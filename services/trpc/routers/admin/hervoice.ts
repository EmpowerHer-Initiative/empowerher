import { asc, desc, eq, like } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/services/db/index";
import { hervoiceTable } from "@/services/db/schema";
import { adminProcedure, createTRPCRouter } from "@/services/trpc/init";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-");
}

// Build a slug from the title, appending -2, -3… on collision.
async function uniqueSlug(title: string): Promise<string> {
  const base = toSlug(title) || "story";
  const existing = await db
    .select({ slug: hervoiceTable.slug })
    .from(hervoiceTable)
    .where(like(hervoiceTable.slug, `${base}%`));
  const taken = new Set(existing.map((r) => r.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

const storySchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  content: z.string().min(1),
  image: z.string().max(255).optional(),
  imageAlt: z.string().max(255).optional(),
  imageCredit: z.string().optional(),
  authorName: z.string().max(255).optional(),
  authorBio: z.string().optional(),
  authorPosition: z.string().max(255).optional(),
  authorInstagram: z.string().max(255).optional(),
  authorFacebook: z.string().max(255).optional(),
  authorLinkedin: z.string().max(255).optional(),
  messageToWorld: z.string().optional(),
  hide: z.boolean().optional(),
});

export const adminHervoiceRouter = createTRPCRouter({
  list: adminProcedure.query(async () => {
    return db
      .select()
      .from(hervoiceTable)
      .orderBy(desc(hervoiceTable.createdAt), asc(hervoiceTable.title));
  }),

  create: adminProcedure.input(storySchema).mutation(async ({ input }) => {
    const slug = await uniqueSlug(input.title);
    const [story] = await db
      .insert(hervoiceTable)
      .values({ ...input, slug })
      .returning();
    return story;
  }),

  update: adminProcedure
    .input(
      storySchema
        .partial()
        .extend({ id: z.number().int() })
        .refine((data) => Object.keys(data).length > 1, {
          message: "At least one field must be provided for update",
        })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const [story] = await db
        .update(hervoiceTable)
        .set(data)
        .where(eq(hervoiceTable.id, id))
        .returning();
      return story;
    }),

  delete: adminProcedure.input(z.number().int()).mutation(async ({ input }) => {
    await db.delete(hervoiceTable).where(eq(hervoiceTable.id, input));
    return { success: true };
  }),
});
