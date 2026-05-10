import { db } from "@/services/db/index";
import {
  account,
  session,
  user,
  verification,
  webhookEvents,
} from "@/services/db/schema";
import { ALLOWED_ORIGINS } from "@/services/trpc/lib/allow-origin";
import { polar, portal, usage, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, bearer, emailOTP } from "better-auth/plugins";

import { isFeatureEnabled } from "@/config/features";

import { sendEmail } from "../email";
import {
  createOrder,
  createProduct,
  createSubscription,
  revokeSubscriptionOnRefund,
  updateOrder,
  updateProduct,
  updateSubscription,
} from "./auth-action";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  // Use 'sandbox' if you're using the Polar Sandbox environment
  // Remember that access tokens, products, etc. are completely separated between environments.
  // Access tokens obtained in Production are for instance not usable in the Sandbox environment.
  server: process.env.POLAR_SERVER as "sandbox" | "production",
});
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
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
    ...(isFeatureEnabled("payments")
      ? [
          polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
              portal(),
              usage(),
              webhooks({
                secret: process.env.POLAR_WEBHOOK_SECRET!,
                onPayload: async (payload) => {
                  await db.insert(webhookEvents).values({
                    timestamp: payload.timestamp,
                    type: payload.type,
                    payload: payload.data,
                  });

                  if (payload.type === "order.updated") {
                    await updateOrder(payload.data);
                  }
                },
                onProductCreated: async ({ data }) => {
                  await createProduct(data);
                },
                onProductUpdated: async ({ data }) => {
                  await updateProduct(data);
                },
                onOrderCreated: async ({ data }) => {
                  await createOrder(data);
                  // No-op for previousCustomers, which is not defined in this context
                },
                onOrderRefunded: async ({ data }) => {
                  await updateOrder(data);
                  if (data.subscriptionId) {
                    await revokeSubscriptionOnRefund(data.subscriptionId);
                  }
                },
                onSubscriptionCreated: async ({ data }) => {
                  await createSubscription(data);
                },
                onSubscriptionUpdated: async ({ data }) => {
                  await updateSubscription(data);
                },
              }),
            ],
          }),
        ]
      : []),
    nextCookies(),
  ],
});
