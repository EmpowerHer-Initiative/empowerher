import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a HerVoice story body (markdown) with the same prose styling the
 * MDX version used. The `img` override reproduces the old `MdxImage` figure.
 */
export const StoryMarkdown = ({ content }: { content: string }) => {
  return (
    <div className="prose-theme prose text-base leading-[1.9]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Blockquotes are used for poems — match the old <PoemWrapper>/<Poem>
          // look: left border, serif lines, muted italic translations.
          blockquote: ({ children }) => (
            <blockquote className="not-prose border-primary/20 text-foreground [&_em]:text-muted-foreground/60 my-10 space-y-6 border-l-2 pl-6 font-serif text-lg leading-relaxed md:pl-8 md:text-xl [&_em]:ml-3 [&_em]:text-sm [&_em]:italic">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            <figure className="my-8">
              <img
                src={typeof src === "string" ? src : ""}
                alt={alt ?? ""}
                className="w-full rounded-2xl object-cover"
              />
              {alt && (
                <figcaption className="text-muted-foreground/60 mt-3 text-center text-sm">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
