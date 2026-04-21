import type { Metadata } from "next";
import Link from "next/link";
import { allBlogs } from "content-collections";
import { format } from "date-fns";

import { siteConfig } from "@/lib/site";

import { Pagination } from "@/components/pagination";

export const metadata: Metadata = {
  title: siteConfig.pages.blog.title,
  description: siteConfig.pages.blog.description,
};

const PAGE_SIZE = 6;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const sorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, totalPages);
  const posts = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="container py-16">
      <h1 className="mb-8 text-3xl font-bold">Blog</h1>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet.</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post._meta.path}>
              <Link href={`/blog/${post._meta.path}`} className="block">
                <p className="text-muted-foreground text-xs">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
                <p className="font-medium">{post.title}</p>
                <p className="text-muted-foreground text-sm">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </div>
      )}
    </div>
  );
}
