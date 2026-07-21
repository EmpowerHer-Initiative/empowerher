Ask the user: "Describe the scroll animation you want (e.g., 'a building transforming from blueprint to finished construction', 'a product box opening to reveal contents')" — wait for their response before proceeding.

---

Once you have the **description**, generate the HTML file. Print progress as you go.

**[1/3] Creating output directory...**

```bash
mkdir -p scroll-prompts
```

**[2/3] Generating prompt HTML file...**

Create a **slugified** version of the user's description (lowercase, spaces → hyphens, strip special chars, max ~40 chars at a word boundary). Save the file at:

```
scroll-prompts/scroll-prompt-<slug>.html
```

---

## HTML file requirements

Generate a **single self-contained HTML file** (no external dependencies) with the following specification. Every piece of content — prompts, descriptions, JSON — must be **specific to the user's description**. Never use placeholder or lorem ipsum text.

### Design

- Dark theme: background `#0a0a0a`, text `#e5e5e5`, muted `#a3a3a3`
- Accent: `#7c3aed` (violet)
- Font: system stack `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- Code blocks: monospace, background `#141414`, border `1px solid #262626`, `border-radius: 12px`, padding `1.5rem`, `overflow-x: auto`
- Container: max-width `860px`, centered

### Layout

```
┌─────────────────────────────────────────────────┐
│ Scroll Animation Prompt                         │
│ <description> · <date>                          │
├─────────────────────────────────────────────────┤
│ [First Frame]  [Last Frame]  [✦ Animation Prompt] │
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab content area with code block               │
│  and copy buttons                               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tab 1: First Frame

The "before" / starting state of the animation. Display the prompt content, then provide **two copy buttons** side by side:

**"Copy as JSON"** — copies this structure (filled in with real content):

```json
{
  "prompt": "<detailed description of the FIRST frame — the starting 'before' state, in 3D illustration style, centered composition, generous padding, not touching borders, professional product visualization, pure white background>",
  "negative_prompt": "text, watermark, border-touching elements, flat design, photorealistic, blurry, low quality, cropped, edge-bleeding, shadows on background, gradient background",
  "style": "3d-model",
  "background": {
    "type": "solid",
    "color": "#FFFFFF"
  },
  "composition": {
    "framing": "centered",
    "padding": "15%",
    "subject_position": "center"
  },
  "quality": {
    "detail": "high",
    "resolution": "1024x1024",
    "render_quality": "premium"
  }
}
```

**"Copy as Prompt"** — copies a plain-English version of the same prompt, suitable for pasting directly into an AI image generator. Should be a single detailed paragraph describing the image.

### Tab 2: Last Frame

Same layout and dual-copy format as Tab 1, but for the "after" / ending state. The JSON `prompt` field and the plain-text prompt describe the final transformed state.

Both frames must share the same camera angle, lighting direction, subject scale, and style so the animation transition is smooth.

### Tab 3: Animation Prompt (DEFAULT ACTIVE TAB)

This is the **highest priority** output. A single copy button labeled **"Copy Prompt"**.

The prompt must produce a video that works perfectly for scroll-driven `<canvas>` frame-by-frame playback. **The animation prompt must stay under 2,500 characters** — be concise and direct. Use this template, filled in with the user's specific content:

```
Create a smooth, continuous transformation video from Frame A to Frame B.

FRAME A (Starting State):
<Describe exactly what the first frame looks like — the "before" state>

FRAME B (Ending State):
<Describe exactly what the last frame looks like — the "after" state>

VISUAL STYLE:
- 3D illustration / 3D rendered model aesthetic, maintained consistently throughout
- Soft, even studio lighting with consistent direction
- Pure white (#FFFFFF) background throughout the entire video
- Subject centered in frame with at least 15% padding on all sides
- No text, watermarks, particles, or overlay effects

CAMERA:
- Fixed position, no movement, no zoom, no pan, no rotation
- Same perspective and focal length throughout

TRANSFORMATION:
- Smooth, continuous morphing from Frame A to Frame B
- The transformation should feel physical and tangible
- Even, linear progression — each frame represents an equal step in the transformation
- No sudden jumps, flash transitions, or discontinuities
- Duration: 3–5 seconds at 24fps

SCROLL-DRIVEN PLAYBACK CONTEXT:
This video will be extracted as individual JPEG frames and played back on a website via scroll-driven canvas animation. Each video frame maps to a scroll position. This means:
- Every single frame must be a clean, complete, artifact-free image
- No motion blur or transitional rendering artifacts
- The first frame must exactly match Frame A, the last frame must exactly match Frame B
- The transformation must be perfectly smooth — users will scrub forward and backward through it
- Linear interpolation between states works best for scroll scrubbing
```

### JavaScript

- **Tab switching**: click handler toggles `active` class on tab buttons and content panels
- **Copy to clipboard**: `navigator.clipboard.writeText()` with fallback to legacy `document.execCommand('copy')`
- **Copy feedback**: button text changes to "Copied!" for 2 seconds, with accent color highlight
- **Default tab**: Tab 3 (Animation Prompt) is active on page load

---

**[3/3] Done!**

Display a summary:

```
✅ Scroll prompt generated!

  File:    scroll-prompts/scroll-prompt-<slug>.html

  Open in browser to copy prompts:
    Tab 1: First Frame  → Copy as JSON | Copy as Prompt
    Tab 2: Last Frame   → Copy as JSON | Copy as Prompt
    Tab 3: Animation Prompt → Copy Prompt (main priority)
```

---

## Prompt quality guidelines

When writing the prompts, follow these principles:

- **Be specific, not generic** — describe exact materials, textures, colors, shapes, angles
- **First and last frames must be coherent** — same object, same angle, same scale, different state
- **3D illustration style** — think Blender/Cinema4D renders: clean geometry, soft shadows, studio lighting
- **White background is sacred** — pure #FFFFFF, no gradients, no shadows bleeding onto it, no environment reflections
- **Padding matters** — the 3D object should float in the center with clear white space on all sides
- **Think about the scroll experience** — the transformation should tell a story that makes sense when scrubbed slowly

---

## Physical angle/orientation shift between frames (CRITICAL)

The first and last frames must show the subject at **different physical angles or orientations**. This is what makes the scroll animation dynamic — the subject physically moves/rotates between states, not just changes surface content in the same position.

- The subject (e.g., laptop, product, object) should be at one angle in the first frame and a noticeably different angle in the last frame
- Example: a laptop angled to the left in frame 1, rotated to face the viewer more front-on in frame 2
- The content/state transformation (e.g., wireframe → finished) happens simultaneously with the physical rotation
- Both frames must still share the same lighting direction, background, and overall 3D illustration style
- The animation prompt must describe both the physical rotation AND the content transformation
