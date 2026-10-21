// Regenerate the client assets from the real homepage captures in scripts/artwork/ironfist.
const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const source = path.join(__dirname, "artwork", "ironfist");
const images = path.join(root, "src", "assets", "images");
const svg = (content) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">${content}</svg>`);

// Match the black-bezel laptop and silver base used by the other portfolio images.
const laptopFrame = svg(`
  <defs>
    <linearGradient id="rim" x2="0" y2="1">
      <stop stop-color="#b7b9bc"/><stop offset=".12" stop-color="#53565a"/>
      <stop offset=".8" stop-color="#25272a"/><stop offset="1" stop-color="#8f9296"/>
    </linearGradient>
    <linearGradient id="base" x2="0" y2="1">
      <stop stop-color="#f0f0f1"/><stop offset=".2" stop-color="#c6c7c9"/>
      <stop offset=".65" stop-color="#999b9e"/><stop offset="1" stop-color="#494c50"/>
    </linearGradient>
    <linearGradient id="edge">
      <stop stop-color="#888b8f"/><stop offset=".08" stop-color="#dadbdd"/>
      <stop offset=".5" stop-color="#f4f4f5"/><stop offset=".92" stop-color="#c5c6c9"/>
      <stop offset="1" stop-color="#797c80"/>
    </linearGradient>
  </defs>
  <rect x="91" y="249" width="704" height="469" rx="21" fill="url(#rim)"/>
  <rect x="94" y="252" width="698" height="464" rx="18" fill="#0b0c0f"/>
  <rect x="101" y="261" width="682" height="427" rx="5" fill="#141619"/>
  <path d="M24 716H866V730Q866 749 843 750H47Q24 749 24 730Z" fill="url(#base)"/>
  <rect x="25" y="716" width="840" height="6" rx="2" fill="url(#edge)"/>
  <path d="M376 716H512L508 726H380Z" fill="#8d9094"/>
  <path d="M381 717H507L505 722H383Z" fill="#d8d9dc"/>
  <path d="M48 749H842" stroke="#303236" stroke-width="2"/>
`);

const laptopCamera = svg(`
  <path d="M410 262H474V270Q474 275 469 275H415Q410 275 410 270Z" fill="#0b0c0f"/>
  <circle cx="442" cy="267" r="2" fill="#212a35"/>
  <circle cx="442" cy="267" r=".75" fill="#526174"/>
`);

const phoneFrame = svg(`
  <defs>
    <linearGradient id="phone-rim">
      <stop stop-color="#777c81"/><stop offset=".05" stop-color="#1d2024"/>
      <stop offset=".92" stop-color="#1a1d20"/><stop offset="1" stop-color="#7a8087"/>
    </linearGradient>
  </defs>
  <rect x="819" y="270" width="158" height="341" rx="17" fill="url(#phone-rim)"/>
  <rect x="822" y="273" width="152" height="335" rx="14" fill="#090b0e"/>
  <rect x="977" y="334" width="2" height="38" rx="1" fill="#3e4348"/>
  <rect x="817" y="326" width="2" height="27" rx="1" fill="#4b5056"/>
  <rect x="877" y="279" width="36" height="2" rx="1" fill="#30343a"/>
  <circle cx="921" cy="280" r="1.7" fill="#263341"/>
  <rect x="877" y="601" width="43" height="2" rx="1" fill="#363b41"/>
`);

async function screen(input, width, height, radius) {
  const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${radius}" fill="white"/></svg>`);
  return sharp(input)
    .resize(width, height, { fit: "cover", position: "north" })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function main() {
  const [desktop, mobile] = await Promise.all([
    screen(path.join(source, "desktop.webp"), 680, 425, 4),
    screen(path.join(source, "mobile.webp"), 142, 307, 4),
  ]);
  const laptop = await sharp(laptopFrame).composite([
    { input: desktop, left: 102, top: 262 },
    { input: laptopCamera, left: 0, top: 0 },
  ]).png().toBuffer();
  const phone = await sharp(phoneFrame).composite([
    { input: mobile, left: 827, top: 287 },
  ]).png().toBuffer();
  const combined = await sharp(laptop).composite([{ input: phone, left: 0, top: 0 }]).png().toBuffer();

  await fs.mkdir(path.join(images, "client-logos"), { recursive: true });
  await Promise.all([
    sharp(combined).webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(images, "mockup-ironfist-webp-1000.webp")),
    sharp(combined).resize(500, 500).webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(images, "mockup-ironfist-webp-500.webp")),
    sharp(laptop).extract({ left: 10, top: 235, width: 870, height: 515 }).resize(699, 414)
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(images, "mockup-ironfist-laptop-only.webp")),
    sharp(path.join(source, "logo.webp")).resize({ width: 320, withoutEnlargement: true })
      .webp({ quality: 90, alphaQuality: 100, effort: 6 })
      .toFile(path.join(images, "client-logos", "ironfist-ticker-webp.webp")),
  ]);
  console.log("Generated Iron Fist laptop, laptop-and-phone responsive images, and ticker logo.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
