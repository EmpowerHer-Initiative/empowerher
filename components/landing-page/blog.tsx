import Link from "next/link";
import { allBlogs } from "content-collections";
import { motion } from "motion/react";

import { motionInView } from "@/lib/utils";

import { BlogCard } from "../blog-card";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const MAX_POSTS = 5;

export const Blog = () => {
  const sorted = allBlogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const posts = sorted.slice(0, MAX_POSTS);
  const remaining = sorted.length - MAX_POSTS;

  return (
    <section className="container">
      <motion.div
        className="mb-16"
        variants={motionInView}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <Badge variant="outline" className="mb-4">
          From the blog
        </Badge>
        <h2 className="mb-4 max-w-xl text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          Latest articles
        </h2>
        <p className="text-muted-foreground max-w-2xl text-lg">
          Guides, tips, and updates from the team.
        </p>
      </motion.div>

      <motion.div
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={motionInView}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.4 }}
        viewport={{ once: true, amount: 0.2 }}
      >
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
        {remaining > 0 && (
          <Link href="/blog">
            <Card className="hover:bg-muted group flex h-full min-h-40 cursor-pointer items-center justify-center duration-300">
              <CardContent className="flex flex-col items-center gap-1 p-5 text-center">
                <p className="text-4xl font-bold">+{remaining}</p>
                <p className="text-muted-foreground text-sm">more articles</p>
              </CardContent>
            </Card>
          </Link>
        )}
      </motion.div>
    </section>
  );
};
