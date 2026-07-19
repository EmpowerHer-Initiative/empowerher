import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXContent } from "@content-collections/mdx/react";
import { allHervoices } from "content-collections";
import { format } from "date-fns";

import { siteConfig } from "@/lib/site";
import { caller } from "@/services/trpc/server";

import { AuthorCard } from "@/components/hervoice/author-card";
import { BackButton } from "@/components/hervoice/back-button";
import { CommentsSection } from "@/components/hervoice/comments-section";
import { StoryMarkdown } from "@/components/hervoice/markdown";
import { Reveal } from "@/components/reveal";

/* ─── MDX Components (winners only) ─────────────────────────────────────────── */

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

/* ─── Data loading ──────────────────────────────────────────────────────────── */

type Story = {
  title: string;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  imageCredit?: string | null;
  date: Date;
  authorName?: string | null;
  authorBio?: string | null;
  authorPosition?: string | null;
  authorInstagram?: string | null;
  authorFacebook?: string | null;
  authorLinkedin?: string | null;
  messageToWorld?: string | null;
  slug: string;
  /** DB stories carry markdown; winner stories carry compiled MDX. */
  content?: string;
  mdx?: string;
};

async function loadStory(slug: string): Promise<Story | null> {
  const dbStory = await caller.hervoice.bySlug(slug);
  if (dbStory) return { ...dbStory, date: dbStory.createdAt };

  const winner = allHervoices.find((p) => p._meta.path === slug);
  if (winner) return { ...winner, slug: winner._meta.path };

  return null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadStory(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description ?? undefined,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: "article",
      url: `${siteConfig.url}/hervoice/${slug}`,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630 }]
        : [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
      images: post.image ? [post.image] : [siteConfig.ogImage],
    },
  };
}

export async function generateStaticParams() {
  const dbStories = await caller.hervoice.list();
  const slugs = new Set<string>([
    ...dbStories.map((s) => s.slug),
    ...allHervoices.map((p) => p._meta.path),
  ]);
  return [...slugs].map((slug) => ({ slug }));
}

export default async function HerVoicePostPage({ params }: Props) {
  const { slug } = await params;
  const post = await loadStory(slug);

  if (!post) return notFound();

  return (
    <>
      {/* Hero */}
      <section className="py-28 md:py-40">
        <div className="container">
          <Reveal asChild>
            <div className="mx-auto max-w-3xl">
              <BackButton />

              <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                HerVoice
              </p>
              <h1 className="mt-5 font-serif text-4xl leading-[1.15] md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="text-muted-foreground mt-6 text-base leading-relaxed md:text-lg">
                {post.description}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                <p className="text-muted-foreground/60 text-sm">
                  {format(new Date(post.date), "MMMM d, yyyy")}
                </p>
                {post.authorName && (
                  <AuthorCard
                    authorName={post.authorName}
                    authorBio={post.authorBio ?? undefined}
                    authorPosition={post.authorPosition ?? undefined}
                    authorInstagram={post.authorInstagram ?? undefined}
                    authorFacebook={post.authorFacebook ?? undefined}
                    authorLinkedin={post.authorLinkedin ?? undefined}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cover image */}
      {post.image && (
        <section className="pb-16">
          <div className="container">
            <Reveal asChild>
              <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={post.image}
                    alt={post.imageAlt ?? post.title}
                    className="aspect-[2/1] w-full object-cover"
                  />
                </div>
                {post.imageAlt && (
                  <p className="text-muted-foreground/70 mt-3 text-center text-sm italic">
                    {post.imageAlt}
                  </p>
                )}
                {post.imageCredit && (
                  <p className="text-muted-foreground/50 mt-1 text-center text-xs">
                    {post.imageCredit}
                  </p>
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="pb-28 md:pb-40">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <Reveal asChild threshold={0.01}>
              {post.mdx ? (
                <div className="prose-theme prose text-base leading-[1.9]">
                  <MDXContent code={post.mdx} components={mdxComponents} />
                </div>
              ) : (
                <StoryMarkdown content={post.content ?? ""} />
              )}
            </Reveal>

            {post.messageToWorld && (
              <Reveal asChild>
                <div className="border-primary/20 bg-card mt-16 rounded-3xl border p-8 md:p-10">
                  <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase">
                    A Message to The World
                  </p>
                  {post.messageToWorld.startsWith("http") ? (
                    <div className="mt-6">
                      <div className="overflow-hidden rounded-2xl">
                        <video
                          className="w-full"
                          controls
                          preload="metadata"
                          poster="https://3625xubr2k.ufs.sh/f/yiXnwfSQWCPTqvTKsUwBYobifLHTavDVU7h0yBGlSc4z8XEQ"
                        >
                          <source src={post.messageToWorld} type="video/mp4" />
                        </video>
                      </div>
                      {post.authorName && (
                        <p className="text-muted-foreground/70 mt-4 text-center text-sm italic">
                          A message from {post.authorName} to the world
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <blockquote className="mt-6 font-serif text-lg leading-relaxed italic md:text-xl">
                        &ldquo;{post.messageToWorld}&rdquo;
                      </blockquote>
                      {post.authorName && (
                        <p className="text-primary mt-4 text-right text-sm font-semibold tracking-wide">
                          — {post.authorName}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </Reveal>
            )}

            <CommentsSection slug={`/hervoice/${post.slug}`} />
          </div>
        </div>
      </section>
    </>
  );
}
