"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allLegals } from "content-collections";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function LegalPage() {
  const { slug } = useParams<{ slug: string[] }>();
  const page = allLegals.find((p) => p._meta.path === slug.join("/"));

  if (!page) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Button
        variant="ghost"
        render={
          <Link href="/">
            <ArrowLeftIcon /> Back
          </Link>
        }
      />
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        {page.description && (
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
            {page.description}
          </p>
        )}
      </div>
      <div className="prose-theme prose max-w-none">
        <MDXContent code={page.mdx} />
      </div>
    </div>
  );
}
