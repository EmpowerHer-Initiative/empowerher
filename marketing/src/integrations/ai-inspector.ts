import { readFileSync } from "node:fs";
import { parse } from "@astrojs/compiler";
import type { AstroIntegration } from "astro";

interface AiInspectorOptions {
  /** Master switch — when false the integration is a no-op (zero footprint). */
  enabled?: boolean;
  /** Secret activation route, e.g. "edit-x7k2m9" → visit /edit-x7k2m9. */
  token?: string;
  /**
   * Prepended to every annotated path. For monorepos where the Astro project
   * lives in a subfolder, set e.g. "marketing/" so the copied payload is
   * repo-relative ("marketing/src/pages/index.astro:12") and the AI opens
   * the right file. Leave empty for single-project repos.
   */
  pathPrefix?: string;
}

/** Tags that never make sense as click-to-edit targets. */
const SKIP_TAGS = new Set([
  "html",
  "head",
  "body",
  "meta",
  "link",
  "title",
  "script",
  "style",
  "base",
  "noscript",
  "slot",
]);

interface Insert {
  offset: number;
  text: string;
}

/**
 * Find the byte offset where ` data-ai-src="…"` should be spliced into the
 * opening tag that starts at `start`: just before the terminating `>` — or,
 * for self-closing tags (`<img … />`), before the `/` and its leading
 * whitespace. Scans outside quoted attribute values and `{…}` expressions.
 * Returns -1 when no safe spot is found.
 */
function findInsertOffset(buf: Buffer, start: number): number {
  let quote = 0; // active quote char code, 0 = none
  let braces = 0; // depth inside {expression} attribute values
  for (let i = start; i < buf.length; i++) {
    const c = buf[i];
    if (quote) {
      if (c === quote) quote = 0;
      continue;
    }
    if (c === 0x22 /* " */ || c === 0x27 /* ' */ || c === 0x60 /* ` */) {
      quote = c;
      continue;
    }
    if (c === 0x7b /* { */) braces++;
    else if (c === 0x7d /* } */ && braces > 0) braces--;
    else if (c === 0x3e /* > */ && braces === 0) {
      // Walk back over `/` + whitespace for self-closing tags.
      let j = i - 1;
      while (
        j > start &&
        (buf[j] === 0x20 ||
          buf[j] === 0x09 ||
          buf[j] === 0x0a ||
          buf[j] === 0x0d)
      )
        j--;
      if (buf[j] === 0x2f /* / */) {
        while (
          j > start &&
          (buf[j - 1] === 0x20 ||
            buf[j - 1] === 0x09 ||
            buf[j - 1] === 0x0a ||
            buf[j - 1] === 0x0d)
        )
          j--;
        return j;
      }
      return i;
    }
  }
  return -1;
}

/** Recursively collect annotation inserts for every plain HTML element node. */
function collectInserts(
  node: any,
  buf: Buffer,
  srcPath: string,
  out: Insert[]
): void {
  if (
    node.type === "element" &&
    !SKIP_TAGS.has(node.name) &&
    node.position?.start
  ) {
    const offset = findInsertOffset(buf, node.position.start.offset);
    if (offset !== -1) {
      out.push({
        offset,
        text: ` data-ai-src="${srcPath}:${node.position.start.line}"`,
      });
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) collectInserts(child, buf, srcPath, out);
  }
}

/**
 * AI Inspector — build-time source annotation + click-to-copy overlay.
 *
 * When enabled:
 *  - Every rendered HTML element gets `data-ai-src="src/…/File.astro:LINE"`
 *    (its owning component file + line), surviving production builds.
 *  - Every page loads a tiny overlay script. It is inert until the client
 *    visits the secret `/{token}` route, which flags localStorage and
 *    redirects back. Then hover shows a cursor-dot that morphs around
 *    editable elements; click copies a minimal AI-editing payload.
 *
 * When disabled: nothing is injected at all.
 */
export default function aiInspector({
  enabled = false,
  token = "edit",
  pathPrefix = "",
}: AiInspectorOptions = {}): AstroIntegration {
  return {
    name: "ai-inspector",
    hooks: {
      "astro:config:setup": ({
        config,
        injectScript,
        injectRoute,
        updateConfig,
        logger,
      }) => {
        if (!enabled) return;

        const rootDir = config.root;

        updateConfig({
          vite: {
            plugins: [
              {
                name: "ai-src",
                // Hook-level order:"pre" is required — Astro's own .astro
                // transform has no order, so this is guaranteed to run first
                // and receive raw .astro source (plugin position alone is not
                // enough; Astro appends integration plugins after its own).
                transform: {
                  order: "pre",
                  async handler(source: string, id: string) {
                    if (!id.endsWith(".astro") || id.includes("node_modules"))
                      return null;
                    // Ordering regression guard: compiled output, not raw source.
                    if (source.includes("astro/compiler-runtime")) {
                      logger.warn(
                        `ai-src received compiled output for ${id} — skipping (plugin ordering broke)`
                      );
                      return null;
                    }
                    try {
                      const { ast } = await parse(source, { position: true });
                      const buf = Buffer.from(source);
                      const srcPath =
                        pathPrefix +
                        id
                          .slice(rootDir.pathname.length)
                          .replace(/^\/+/, "")
                          .split("\\")
                          .join("/");
                      const inserts: Insert[] = [];
                      collectInserts(ast, buf, srcPath, inserts);
                      if (!inserts.length) return null;
                      // Splice back-to-front so earlier offsets stay valid.
                      inserts.sort((a, b) => b.offset - a.offset);
                      const parts: Buffer[] = [];
                      let end = buf.length;
                      for (const ins of inserts) {
                        parts.unshift(
                          Buffer.from(ins.text),
                          buf.subarray(ins.offset, end)
                        );
                        end = ins.offset;
                      }
                      parts.unshift(buf.subarray(0, end));
                      return {
                        code: Buffer.concat(parts).toString(),
                        map: null,
                      };
                    } catch (err) {
                      // Fail-open: an annotation failure must never break a build.
                      logger.warn(
                        `ai-src skipped ${id}: ${err instanceof Error ? err.message : err}`
                      );
                      return null;
                    }
                  },
                },
              },
            ],
          },
        });

        injectScript(
          "page",
          readFileSync(
            new URL("./inspector-client.js", import.meta.url),
            "utf-8"
          )
        );

        injectRoute({
          pattern: `/${token}`,
          entrypoint: "./src/integrations/activate.astro",
          prerender: true,
        });
      },
    },
  };
}
