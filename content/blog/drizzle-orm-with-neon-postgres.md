---
title: Drizzle ORM with Neon Postgres
description: How to define schemas, run migrations, and query a serverless Postgres database using Drizzle ORM and Neon.
image: https://cdn.dribbble.com/userupload/12625976/file/original-477795e34939330965e12002052dcb49.jpg?resize=1024x768&vertical=center
date: 2025-02-10
---

## Why Drizzle?

Drizzle is a TypeScript-first ORM that feels like writing SQL — because it mostly is. There's no magic query builder to learn. Schemas are plain TypeScript objects, queries are composable, and the generated SQL is predictable.

Paired with Neon's serverless Postgres, you get a fully managed database that scales to zero and costs nothing when idle.

## Defining a schema

```ts
// services/db/schema.ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

## Running migrations

Drizzle generates SQL migration files from your schema. Run them with:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

The `drizzle.config.ts` at the root points to your schema and database URL:

```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./services/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

## Querying

```ts
// find a user by email
const user = await db.query.users.findFirst({
  where: eq(users.email, "ali@example.com"),
});

// list posts with author
const result = await db.query.posts.findMany({
  with: { author: true },
  orderBy: desc(posts.createdAt),
  limit: 10,
});
```

## Inserting and updating

```ts
// insert
const [newPost] = await db
  .insert(posts)
  .values({ title: "Hello", body: "World", authorId: user.id })
  .returning();

// update
await db
  .update(posts)
  .set({ title: "Updated" })
  .where(eq(posts.id, newPost.id));
```

## Why Neon?

Neon splits storage and compute. Your database is always available for reads but compute scales to zero after inactivity — ideal for agency projects where some clients have low traffic. Branching support also makes it easy to test migrations in a staging environment before applying them to production.
