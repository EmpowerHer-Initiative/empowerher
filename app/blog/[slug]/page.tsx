import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allBlogs } from "content-collections";
import { format } from "date-fns";

import { siteConfig } from "@/lib/site";

import { Button } from "@/components/ui/button";

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
    <div className="container py-10">
      <Button variant="ghost" render={<Link href="/blog">Back to blog</Link>} />

      <div className="mt-6 mb-8">
        <p className="text-muted-foreground text-sm">
          {format(post.date, "MMMM d, yyyy")}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{post.description}</p>
      </div>

      <div className="prose-theme prose max-w-none">
        <MDXContent code={post.mdx} />
      </div>
    </div>
  );
}
