// Generates favicons, app icons, and the OG image from the master logo.
//   pnpm add -D sharp png-to-ico && node scripts/generate-brand-assets.mjs
// Source logo lives on the CDN; cached locally as scripts/_logo.png.
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { writeFile, readFile } from "node:fs/promises";

// ── EmpowerHer ────────────────────────────────────────────────────────────
// Logo is a circular emblem: gold girl-with-flag mark above a blue "EmpowerHer"
// wordmark + botanical wreath. The full lockup is unreadable at 16px, so the
// favicon crops to the girl-with-flag mark (top-centre of the 1126×1018 image).
const LOGO = "scripts/_logo.png";
const BRAND_BG = "#ffffff"; // logo is mid-tone gold/blue on transparent → white reads best
const MARK_CROP = (w, h) => ({
  left: Math.round(w * 0.335),
  top: Math.round(h * 0.195),
  width: Math.round(w * 0.28),
  height: Math.round(h * 0.34),
});
// ─────────────────────────────────────────────────────────────────────────

const logo = await readFile(LOGO);
const { width, height } = await sharp(logo).metadata();

// Two passes: sharp runs trim before extract within one pipeline.
const topCrop = await sharp(logo)
  .extract(MARK_CROP(width, height))
  .png()
  .toBuffer();
const mark = await sharp(topCrop).trim().png().toBuffer();

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const icon = (size, background = TRANSPARENT) =>
  sharp(mark)
    .resize(size, size, { fit: "contain", background })
    .flatten(background === TRANSPARENT ? false : { background })
    .png()
    .toBuffer();

await writeFile(
  "public/favicon.ico",
  await pngToIco([await icon(16), await icon(32), await icon(48)]),
);
// Apple convention: opaque background.
await writeFile("public/apple-touch-icon.png", await icon(180, BRAND_BG));
await writeFile("public/icon-192.png", await icon(192));
await writeFile("public/icon-512.png", await icon(512));

// OG image: full logo centered on the brand background, 1200x630.
const ogLogo = await sharp(logo)
  .resize(560, 480, { fit: "contain", background: TRANSPARENT })
  .png()
  .toBuffer();
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: BRAND_BG },
})
  .composite([{ input: ogLogo, gravity: "centre" }])
  .png()
  .toFile("public/og-image.png");

console.log(
  "Generated: favicon.ico, apple-touch-icon.png, icon-192/512.png, og-image.png",
);
