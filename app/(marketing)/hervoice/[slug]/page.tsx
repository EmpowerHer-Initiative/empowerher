import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allHervoices } from "content-collections";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

import { siteConfig } from "@/lib/site";

/* ─── MDX Components ───────────────────────────────────────────────────────── */

function PoemWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-primary/20 my-10 space-y-6 border-l-2 pl-6 md:pl-8">
      {children}
    </div>
  );
}

function Poem({
  values,
}: {
  values: { value: string; translation?: string }[];
}) {
  return (
    <div className="space-y-1">
      {values.map((line, i) => (
        <p key={i} className="font-serif text-lg leading-relaxed md:text-xl">
          <span>{line.value}</span>
          {line.translation && (
            <span className="text-muted-foreground/60 ml-3 text-sm italic">
              {line.translation}
            </span>
          )}
        </p>
      ))}
    </div>
  );
}

function MdxImage({ src, alt }: { src: string; alt?: string }) {
  return (
    <figure className="my-8">
      <img
        src={src}
        alt={alt ?? ""}
        className="w-full rounded-2xl object-cover"
      />
      {alt && (
        <figcaption className="text-muted-foreground/60 mt-3 text-center text-sm">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

const mdxComponents = { PoemWrapper, Poem, Image: MdxImage };

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = allHervoices.find((p) => p._meta.path === slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `${siteConfig.url}/hervoice/${slug}`,
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

export function generateStaticParams() {
  return allHervoices.map((post) => ({ slug: post._meta.path }));
}

export default async function HerVoicePostPage({ params }: Props) {
  const { slug } = await params;
  const post = allHervoices.find((p) => p._meta.path === slug);

  if (!post) return notFound();

  return (
    <>
      {/* Hero */}
      <section className="py-28 md:py-40">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/hervoice"
              className="group text-muted-foreground hover:text-foreground mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to HerVoice
            </Link>

            <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
              HerVoice
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.15] md:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            <p className="text-muted-foreground mt-6 text-base leading-relaxed md:text-lg">
              {post.description}
            </p>
            <p className="text-muted-foreground/60 mt-6 text-sm">
              {format(post.date, "MMMM d, yyyy")}
            </p>
          </div>
        </div>
      </section>

      {/* Cover image */}
      {post.image && (
        <section className="pb-16">
          <div className="container">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl">
              <img
                src={post.image}
                alt={post.title}
                className="aspect-[2/1] w-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-28 md:pb-40">
        <div className="container">
          <div className="prose-theme prose mx-auto max-w-3xl text-base leading-[1.9]">
            <MDXContent code={post.mdx} components={mdxComponents} />
          </div>
        </div>
      </section>
    </>
  );
}
