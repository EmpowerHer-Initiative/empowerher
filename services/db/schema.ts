import { OrderBillingReason } from "@polar-sh/sdk/models/components/orderbillingreason.js";
import { OrderStatus } from "@polar-sh/sdk/models/components/orderstatus.js";
import { SubscriptionRecurringInterval } from "@polar-sh/sdk/models/components/subscriptionrecurringinterval.js";
import { SubscriptionStatus } from "@polar-sh/sdk/models/components/subscriptionstatus.js";
import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export interface UserMetadata {
  mustChangePassword?: boolean;
  [key: string]: unknown;
}

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  metadata: jsonb("metadata").$type<UserMetadata>().default({}),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

export const products = pgTable("product", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  trialInterval: text("trial_interval", {
    enum: ["day", "week", "month", "year"],
  }),
  trialIntervalCount: integer("trial_interval_count").default(0),
  popular: boolean("popular").notNull().default(false),
  priceAmount: integer("price_amount").notNull(),
  priceCurrency: text("price_currency").notNull().default("usd"),
  recurringInterval: text("recurring_interval", {
    enum: ["day", "week", "month", "year"],
  }),
  isRecurring: boolean("is_recurring").notNull().default(true),
  isArchived: boolean("is_archived").notNull().default(false),
  metadata: jsonb("metadata").$type<unknown>().notNull().default({}),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const subscriptions = pgTable("subscription", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("usd"),
  productId: uuid("product_id").notNull(),
  status: text("status", {
    enum: Object.values(SubscriptionStatus) as [SubscriptionStatus],
  }).notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  trialStart: timestamp("trial_start"),
  trialEnd: timestamp("trial_end"),
  startedAt: timestamp("started_at"),
  canceledAt: timestamp("canceled_at"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  recurringInterval: text("recurring_interval", {
    enum: Object.values(SubscriptionRecurringInterval) as [
      SubscriptionRecurringInterval,
    ],
  }),
  customerCancellationReason: text("customer_cancellation_reason"),
  customerCancellationComment: text("customer_cancellation_comment"),
  metadata: jsonb("metadata").$type<unknown>().notNull().default({}),
});

export const orders = pgTable("orders", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  email: text("email").notNull(),
  productId: uuid("product_id").notNull(),
  billingName: text("billing_name").notNull(),
  subscriptionId: text("subscription_id").notNull(),
  billingReason: text("billing_reason", {
    enum: Object.values(OrderBillingReason) as [OrderBillingReason],
  }).notNull(),
  totalAmount: integer("total_amount").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  status: text("status", {
    enum: Object.values(OrderStatus) as [OrderStatus],
  }).notNull(),
  discountAmount: integer("discount_amount").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: jsonb("metadata").$type<unknown>().notNull().default({}),
});

// ── Activity Log ─────────────────────────────────────────────────────────────

export type EmailTemplateName =
  | "verify-email"
  | "reset-password"
  | "setup-account"
  | "contact-form"
  | "reject-student"
  | "approve-student";

export type EmailLogMetadata = {
  to: string;
  subject: string;
  attachmentCount?: number;
  template?: EmailTemplateName;
  templateProps?: Record<string, string>;
  retry?: boolean;
};

export type DataChangeMetadata = {
  entity: string;
  entityId: string;
  action: "create" | "update" | "delete";
  changes?: Record<string, { from: unknown; to: unknown }>;
};

export type ActivityLogMetadata = EmailLogMetadata | DataChangeMetadata;

export const activityLog = pgTable("activity_log", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  type: text("type", { enum: ["email", "data_change"] }).notNull(),
  status: text("status", { enum: ["success", "failed"] }).notNull(),
  actor: text("actor"),
  summary: text("summary"),
  metadata: jsonb("metadata").$type<ActivityLogMetadata>().notNull(),
  error: text("error"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const webhookEvents = pgTable("webhook_events", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp").notNull(),
  type: text("type").notNull(), // e.g. subscription.updated
  createdAt: timestamp("created_at").defaultNow(),
  payload: jsonb("payload").$type<unknown>().notNull(),
});

// ── Content ──────────────────────────────────────────────────────────────────

export const commentsTable = pgTable("comments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  from: varchar("from", { length: 255 }).notNull(),
  blogName: varchar("blog_name", { length: 255 }).notNull(),
  message: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
});

export const teachersTable = pgTable("teachers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  index: integer().notNull().default(0).unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  headTitle: varchar("head_title", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  avatar: varchar("avatar", { length: 255 }),
  description: text(),
  role: text("role", { enum: ["mentor", "executive", "lecturer", "director"] })
    .notNull()
    .default("mentor"),
});

export const projectsTable = pgTable("projects", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
  description: text().notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
});

export const workshopsTable = pgTable("workshops", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  mentors: varchar("mentors", { length: 255 }).array().notNull().default([]),
  createdAt: timestamp().notNull().defaultNow(),
  description: text().notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  status: varchar("status", { enum: ["pending", "approved", "rejected"] })
    .notNull()
    .default("pending"),
  classCode: varchar("class_code", { length: 255 }).notNull(),
});

export const studentsTable = pgTable(
  "students",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }),
    createdAt: timestamp().notNull().defaultNow(),
    workshopId: uuid("workshop_id")
      .references(() => workshopsTable.id)
      .notNull(),
    status: varchar("status", { enum: ["pending", "approved"] })
      .notNull()
      .default("pending"),
    emailId: text("email_id"),
    period: integer().notNull(),
  },
  (table) => ({
    emailPeriodUnique: unique().on(table.email, table.period),
  })
);

export const rejectedStudentsTable = pgTable(
  "rejected_students",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar("email", { length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    emailSent: boolean().notNull().default(false),
    period: integer().notNull(),
    emailSentAt: timestamp("email_sent_at"),
    emailId: text("email_id"),
  },
  (table) => ({
    emailPeriodUnique: unique().on(table.email, table.period),
  })
);

export const allStudentsTable = pgTable("all_students", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp().notNull().defaultNow(),
});

export const resourcesTable = pgTable("resources", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name").notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  description: text().notNull(),
  image: varchar("image").notNull(),
  location: varchar("location").notNull(),
  link: varchar("link").notNull(),
  deadline: varchar("deadline", { length: 255 }),
  status: varchar("status", { enum: ["active", "expired", "remote"] })
    .notNull()
    .default("active"),
  type: varchar("type", { length: 255 }),
});

export const featuredWritingsTable = pgTable("featured_writings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text().notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  link: varchar("link", { length: 255 }).notNull(),
  from: varchar("from", { length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
});

export type Comment = typeof commentsTable.$inferSelect;
export type InsertComment = typeof commentsTable.$inferInsert;

export type Teacher = typeof teachersTable.$inferSelect;
export type InsertTeacher = typeof teachersTable.$inferInsert;

export type Project = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;

export type Workshop = typeof workshopsTable.$inferSelect;
export type InsertWorkshop = typeof workshopsTable.$inferInsert;

export type Student = typeof studentsTable.$inferSelect;
export type InsertStudent = typeof studentsTable.$inferInsert;

export type RejectedStudent = typeof rejectedStudentsTable.$inferSelect;
export type InsertRejectedStudent = typeof rejectedStudentsTable.$inferInsert;

export type AllStudent = typeof allStudentsTable.$inferSelect;
export type InsertAllStudent = typeof allStudentsTable.$inferInsert;

export type Resource = typeof resourcesTable.$inferSelect;
export type InsertResource = typeof resourcesTable.$inferInsert;

export type FeaturedWriting = typeof featuredWritingsTable.$inferSelect;
export type InsertFeaturedWriting = typeof featuredWritingsTable.$inferInsert;
