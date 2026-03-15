import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import { z } from "zod";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function extractHeadings(
  content: string
): Array<{ depth: number; text: string; id: string }> {
  const tree = fromMarkdown(content);
  const headings: Array<{ depth: number; text: string; id: string }> = [];
  visit(tree, "heading", (node: { depth: number }) => {
    const text = toString(node);
    headings.push({
      depth: node.depth,
      text,
      id: toSlug(text),
    });
  });
  return headings;
}

const posts = defineCollection({
  name: "posts",
  directory: "content",
  include: "**/*.md",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    thumbnail: z.string().optional(),
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrettyCode, rehypeAutolinkHeadings, rehypeSlug],
    });
    const headings = extractHeadings(document.content);
    return {
      ...document,
      mdx,
      headings,
    };
  },
});

export default defineConfig({
  content: [posts],
});
