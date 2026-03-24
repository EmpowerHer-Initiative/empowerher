import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allBlogs } from "content-collections";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";

import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { TableOfContents } from "@/components/table-of-contents";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allBlogs.find((p) => p._meta.path === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/blog/${slug}`,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630 }]
        : [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [siteConfig.ogImage],
    },
  };
}

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allBlogs.map((post) => ({ slug: post._meta.path }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = allBlogs.find((p) => p._meta.path === slug);

  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        render={
          <Link href="/blog">
            <ArrowLeftIcon /> Back to blog
          </Link>
        }
      />

      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <p className="text-muted-foreground text-sm">
          {format(post.date, "MMMM d, yyyy")}
        </p>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {post.description}
        </p>
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="mt-4 aspect-video w-full max-w-3xl rounded-2xl object-cover outline"
          />
        )}
      </div>

      <div className="flex w-full flex-col items-start gap-8 md:flex-row">
        {post.headings.length > 0 && (
          <TableOfContents headings={post.headings} />
        )}
        <div
          className={cn(
            "prose-theme prose w-full max-w-none",
            "[&_h1]:scroll-mt-24 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24 [&_h4]:scroll-mt-24"
          )}
        >
          <MDXContent code={post.mdx} />
        </div>
      </div>
    </div>
  );
}
