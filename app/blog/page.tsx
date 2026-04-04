import type { Metadata } from "next";
import { allBlogs } from "content-collections";

import { siteConfig } from "@/lib/site";

import { BlogCard } from "@/components/blog-card";
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
    <div className="container mx-auto py-16">
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-muted-foreground max-w-xl text-base">
          Thoughts, guides, and updates from the team.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No blog posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard
              key={post._meta.path}
              href={`/blog/${post._meta.path}`}
              title={post.title}
              description={post.description}
              date={post.date}
              image={post.image}
            />
          ))}
        </div>
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
