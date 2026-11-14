/**
 * Builds every brand image from the two source files in the project root:
 *   - ahmedlogo.png  → trainer portrait (hero banner, login panel, share image)
 *   - logo1.png      → round logo badge (app icons, favicon, header logo)
 *
 * Re-run after replacing either source:
 *
 *   npx tsx scripts/build-brand-assets.mts
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = process.cwd();
const photoSrc = resolve(root, "ahmedlogo.png");
const logoSrc = resolve(root, "logo1.png");
const brandDir = resolve(root, "public/brand");
await mkdir(brandDir, { recursive: true });

const BLACK = "#0A0A0A";
const RED = "#FF1A2D";

async function report(file: string) {
  const s = await stat(file);
  const rel = file.slice(root.length).split(sep).join("/");
  console.log(`  ${rel.padEnd(40)} ${(s.size / 1024).toFixed(0)} KB`);
}

// ---- Trainer portrait -------------------------------------------------------
const meta = await sharp(photoSrc).metadata();
console.log(`portrait source: ${meta.width}x${meta.height}`);

// Full portrait (hero banner / login panel). next/image resizes per viewport.
const portrait = resolve(brandDir, "ahmed-emad.webp");
await sharp(photoSrc).resize(1200, 1200, { fit: "cover" }).webp({ quality: 82 }).toFile(portrait);
await report(portrait);

// Head-and-shoulders crop for avatars / small circles.
const avatar = resolve(brandDir, "ahmed-emad-avatar.webp");
const w = meta.width!;
const side = Math.round(w * 0.52);
await sharp(photoSrc)
  .extract({ left: Math.round((w - side) / 2), top: Math.round(w * 0.02), width: side, height: side })
  .resize(320, 320)
  .webp({ quality: 84 })
  .toFile(avatar);
await report(avatar);

// ---- Logo badge -------------------------------------------------------------
/** Square logo on its own black background (PWA icons, push notifications). */
async function squareLogo(file: string, size: number, scale = 1) {
  const inner = Math.round(size * scale);
  const logo = await sharp(logoSrc).resize(inner, inner).toBuffer();
  const out = resolve(root, file);
  await sharp({ create: { width: size, height: size, channels: 3, background: "#000000" } })
    .composite([{ input: logo, gravity: "centre" }])
    .png({ compressionLevel: 9, palette: size <= 192 })
    .toFile(out);
  await report(out);
}

/** Logo cut to its circle with transparent corners, so it sits on any background. */
async function roundLogo(file: string, size: number, format: "png" | "webp" = "png") {
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size * 0.492}" fill="#fff"/></svg>`,
  );
  const out = resolve(root, file);
  const img = sharp(logoSrc).resize(size, size).composite([{ input: mask, blend: "dest-in" }]);
  await (format === "webp" ? img.webp({ quality: 88 }) : img.png({ compressionLevel: 9 })).toFile(out);
  await report(out);
}

await roundLogo("public/brand/logo.webp", 256, "webp"); // header / sidebar / auth
await roundLogo("public/favicon.png", 128);
await roundLogo("src/app/icon.png", 256);
await squareLogo("public/logo.png", 512); // push notification icon
await squareLogo("public/icon-192.png", 192);
await squareLogo("public/icon-512.png", 512);
await squareLogo("public/icon-maskable-512.png", 512, 0.8); // glyph inside the maskable safe zone
await squareLogo("src/app/apple-icon.png", 180);

// ---- Open Graph share image (1200x630) --------------------------------------
const og = resolve(brandDir, "og.jpg");
const photo = await sharp(photoSrc).resize(630, 630, { fit: "cover" }).toBuffer();
const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0.5" stop-color="${BLACK}" stop-opacity="0"/>
      <stop offset="1" stop-color="${BLACK}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="630" height="630" fill="url(#g)"/>
  <text x="650" y="300" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="72" fill="#FFFFFF" letter-spacing="-2">AHMED <tspan fill="${RED}">EMAD</tspan></text>
  <text x="653" y="352" font-family="'Segoe UI', Arial, sans-serif" font-weight="500" font-size="28" fill="#A1A1A6">Personal Training · Online Coaching</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: BLACK } })
  .composite([{ input: photo, left: 0, top: 0 }, { input: overlay, left: 0, top: 0 }])
  .jpeg({ quality: 86 })
  .toFile(og);
await report(og);
