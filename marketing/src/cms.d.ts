// CMS field-path registration. Registering the project's `pages.json` type here
// makes every cms-bridge component's bare `field="…"` prop autocompleted and
// typo-checked against the page shapes — no `f()` wrapper, no per-call props.
// This is the one and only place the site declares its field vocabulary.
import "@alisamadiillc/cms-bridge/fields";

declare module "@alisamadiillc/cms-bridge/fields" {
  interface CmsRegistry {
    pages: typeof import("./data/pages.json");
  }
}
