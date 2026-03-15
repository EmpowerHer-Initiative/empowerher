"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allPosts } from "content-collections";
import { format } from "date-fns";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PostPage() {
  const { slug } = useParams<{ slug: string[] }>();
  const post = allPosts.find((post) => post._meta.path === slug.join("/"));

  if (!post) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Button
        variant="ghost"
        render={
          <Link href="/">
            <ArrowLeftIcon /> Back
          </Link>
        }
      />
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
          {post.description}
        </p>

        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="mt-4 aspect-7/3 rounded-2xl object-cover outline"
          />
        )}
        {post.date && (
          <p className="text-muted-foreground mt-2 text-sm">
            {format(post.date, "MMMM d, yyyy")}
          </p>
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-8 md:flex-row">
        <div className="bg-muted shadow-card sticky flex shrink-0 flex-col gap-2 rounded-2xl p-8 md:top-18 md:w-100">
          {post.headings.map((heading) => (
            <Link
              key={heading.id}
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors hover:underline"
            >
              {heading.text}
            </Link>
          ))}
        </div>
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
