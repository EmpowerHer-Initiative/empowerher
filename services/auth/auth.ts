import { db } from "@/services/db/index";
import {
  account,
  session,
  user,
  verification,
  webhookEvents,
} from "@/services/db/schema";
import { ALLOWED_ORIGINS } from "@/services/trpc/lib/allow-origin";
import { stripe } from "@better-auth/stripe";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, bearer, emailOTP } from "better-auth/plugins";
import Stripe from "stripe";

import { sendEmail } from "../email";
import {
  createInvoice,
  createProduct,
  createSubscription,
  deleteProduct,
  deleteSubscription,
  handleChargeRefunded,
  updateInvoice,
  updateProduct,
  updateSubscription,
} from "./auth-action";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const auth = betterAuth({
  baseURL: "http://localhost:3000",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      account,
      session,
      verification,
    },
  }),
  trustedOrigins: ALLOWED_ORIGINS,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendEmail("resetPassword", user.email, {
        resetPasswordLink: `${url}?token=${token}`,
      });
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      allowDifferentEmails: true,
      updateUserInfoOnLink: true,
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      metadata: {
        type: "json",
      },
    },
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID as string,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  //   },
  // },
  advanced: {
    // crossSubDomainCookies: {
    //   enabled: true,
    //   domain:
    //     process.env.NODE_ENV === "production"
    //       ? "<YOUR_DOMAIN> (e.g. example.com)"
    //       : "localhost",
    // },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds (5 minutes)
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async () => {
          // if (process.env.RESEND_AUDIENCE_GENERAL_ID) {
          //   await createAudience({
          //     email: user.email,
          //     firstName: user.name,
          //     unsubscribed: false,
          //     audienceId: process.env.RESEND_AUDIENCE_GENERAL_ID as string,
          //   });
          // }
        },
      },
    },
  },
  plugins: [
    bearer(),
    admin(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          const { error } = await sendEmail("verifyEmail", email, {
            verificationCode: otp,
          });

          if (error) {
            throw new APIError(500, {
              message: "Failed to send verification email",
            });
          }
        } else {
          // Send the OTP for password reset
        }
      },
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      onEvent: async (event) => {
        // Audit trail
        await db.insert(webhookEvents).values({
          timestamp: new Date(event.created * 1000),
          type: event.type,
          payload: event.data,
        });

        // Sync products
        if (
          event.type === "product.created" ||
          event.type === "product.updated" ||
          event.type === "product.deleted"
        ) {
          const product = event.data.object as Stripe.Product;
          if (event.type === "product.created") {
            await createProduct(product);
          } else if (event.type === "product.updated") {
            await updateProduct(product);
          } else {
            await deleteProduct(product);
          }
        }

        // Sync invoices → orders
        if (event.type === "invoice.paid" || event.type === "invoice.created") {
          const invoice = event.data.object as Stripe.Invoice;
          await createInvoice(invoice);
        }
        if (
          event.type === "invoice.updated" ||
          event.type === "invoice.payment_failed"
        ) {
          const invoice = event.data.object as Stripe.Invoice;
          await updateInvoice(invoice);
        }

        // Sync subscriptions
        if (
          event.type === "customer.subscription.created" ||
          event.type === "customer.subscription.updated" ||
          event.type === "customer.subscription.deleted"
        ) {
          const sub = event.data.object as Stripe.Subscription;
          if (event.type === "customer.subscription.created") {
            await createSubscription(sub);
          } else if (event.type === "customer.subscription.updated") {
            await updateSubscription(sub);
          } else {
            await deleteSubscription(sub);
          }
        }

        // Sync refunds → update invoice status directly
        if (event.type === "charge.refunded") {
          const charge = event.data.object as Stripe.Charge;
          await handleChargeRefunded(charge);
        }
      },
    }),
    nextCookies(),
  ],
});
