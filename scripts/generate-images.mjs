import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const contentDir = path.join(root, "src", "content");

const VERBOSE = process.argv.includes("--verbose") || process.env.GENERATE_IMAGES_VERBOSE === "1";
const QUIET = process.argv.includes("--quiet") || process.env.GENERATE_IMAGES_QUIET === "1";

function log(...args) {
  if (QUIET) return;
  console.log(...args);
}

function vlog(...args) {
  if (QUIET || !VERBOSE) return;
  console.log(...args);
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function isLocalImagePath(v) {
  return (
    typeof v === "string" &&
    v.startsWith("/") &&
    !v.startsWith("//") &&
    !v.includes("://") &&
    /\.(png|jpe?g)$/i.test(v)
  );
}

function sha1_16(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 16);
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

// Matches src/utils/generatedWebp.ts signature format
function webpFilenameForSignature(sigObj, variant) {
  const hash = sha1_16(JSON.stringify(sigObj));
  return `${hash}-${variant}.webp`;
}

async function generateWebpVariant({ src, stat, width, height, fit, quality, variant }) {
  const inFs = path.join(publicDir, src);
  const outDirFs = path.join(publicDir, "_generated", "img");
  await ensureDir(outDirFs);

  const sig = {
    src,
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    w: width,
    h: height ?? null,
    fit,
    q: quality,
    v: variant,
  };

  const filename = webpFilenameForSignature(sig, variant);
  const outFs = path.join(outDirFs, filename);
  if (await fileExists(outFs)) return "skipped";

  const img = sharp(inFs, { failOn: "none" });
  if (fit === "cover") {
    img.resize(width, height ?? Math.round((width * 9) / 16), {
      fit: "cover",
      position: "attention",
      withoutEnlargement: true,
    });
  } else if (fit === "contain") {
    img.resize(width, height ?? Math.round((width * 9) / 16), {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: true,
    });
  } else {
    img.resize({ width, height, fit: "inside", withoutEnlargement: true });
  }

  await img.webp({ quality }).toFile(outFs);
  return "generated";
}

// Matches src/components/editions/PhotoGallery.astro hash format for /_generated/photos
function photoGalleryHash(src, stat) {
  return sha1_16(`${src}|${stat.size}|${stat.mtimeMs}`);
}

async function generateGalleryVariants({ src, stat }) {
  const inFs = path.join(publicDir, src);
  const outDirFs = path.join(publicDir, "_generated", "photos");
  await ensureDir(outDirFs);

  const hash = photoGalleryHash(src, stat);
  const targets = [
    { name: `${hash}-sm.webp`, mode: "cover", w: 240, h: 180, q: 45 },
    { name: `${hash}-lg.webp`, mode: "cover", w: 480, h: 360, q: 70 },
    { name: `${hash}-lb.webp`, mode: "inside", w: 1600, h: undefined, q: 82 },
  ];

  const results = await Promise.all(
    targets.map(async (t) => {
      const outFs = path.join(outDirFs, t.name);
      if (await fileExists(outFs)) return "skipped";
      const img = sharp(inFs, { failOn: "none" });
      if (t.mode === "cover") {
        img.resize(t.w, t.h, { fit: "cover", position: "attention", withoutEnlargement: true });
      } else {
        img.resize({ width: t.w, fit: "inside", withoutEnlargement: true });
      }
      await img.webp({ quality: t.q }).toFile(outFs);
      return "generated";
    }),
  );

  return results;
}

function collectFromJson(obj, filePath, acc) {
  if (Array.isArray(obj)) {
    for (const v of obj) collectFromJson(v, filePath, acc);
    return;
  }
  if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (k === "heroImage" && isLocalImagePath(v)) acc.hero.add(v);
      if (k === "coverImage" && isLocalImagePath(v)) acc.cover.add(v);
      if (k === "photos" && Array.isArray(v)) {
        for (const p of v) if (isLocalImagePath(p)) acc.photos.add(p);
      }
      collectFromJson(v, filePath, acc);
    }
  }
}

async function main() {
  const startedAt = Date.now();
  log(`[generate-images] start (cwd: ${root})`);
  if (VERBOSE) log("[generate-images] verbose logging enabled");

  // Always generate logo WebP fallback
  const logo = "/assets/logo.png";
  const acc = {
    hero: new Set(),
    cover: new Set(),
    photos: new Set(),
    misc: new Set([logo]),
  };

  const missingInputs = new Set();
  const stats = {
    jsonFiles: 0,
    img: { generated: 0, skipped: 0 },
    photos: { generated: 0, skipped: 0 },
  };

  if (await exists(contentDir)) {
    const files = (await walk(contentDir)).filter((f) => f.endsWith(".json"));
    stats.jsonFiles = files.length;
    log(`[generate-images] scanning content JSON (${files.length} files)`);
    for (const f of files) {
      const raw = await fs.readFile(f, "utf-8");
      const json = JSON.parse(raw);
      collectFromJson(json, f, acc);
    }
  } else {
    log(`[generate-images] content directory missing, skipping JSON scan: ${contentDir}`);
  }

  // Generate cover/card variants for cover images
  const coverProfiles = [
    { width: 1200, height: 675, fit: "cover", quality: 78, variant: "1x" },
    { width: 2400, height: 1350, fit: "cover", quality: 78, variant: "2x" },
    { width: 640, height: 360, fit: "cover", quality: 72, variant: "1x" },
    { width: 1280, height: 720, fit: "cover", quality: 72, variant: "2x" },
  ];

  // Generate hero background variants
  const heroProfiles = [
    { width: 1600, height: 900, fit: "cover", quality: 82, variant: "hero-1x" },
    { width: 2400, height: 1350, fit: "cover", quality: 82, variant: "hero-2x" },
  ];

  // Logo
  const logoProfiles = [{ width: 80, height: 80, fit: "cover", quality: 82, variant: "logo" }];

  const allCover = [...acc.cover];
  const allHero = [...acc.hero];
  const allPhotos = [...acc.photos];
  const allMisc = [...acc.misc];

  log(
    `[generate-images] discovered: hero=${allHero.length}, cover=${allCover.length}, photos=${allPhotos.length}, misc=${allMisc.length}`,
  );

  const allForWebp = new Set([...allCover, ...allHero, ...allMisc]);

  // Generate webp variants (OptimizedImg/Hero/Logo)
  let idx = 0;
  const totalWebpInputs = allForWebp.size;
  log(`[generate-images] generating webp variants for ${totalWebpInputs} source image(s)`);
  for (const src of allForWebp) {
    idx += 1;
    const inFs = path.join(publicDir, src);
    if (!(await exists(inFs))) {
      missingInputs.add(src);
      vlog(`[generate-images] missing input (skipped): ${src}`);
      continue;
    }
    const stat = await fs.stat(inFs);

    if (src === logo) {
      for (const p of logoProfiles) {
        const r = await generateWebpVariant({ src, stat, ...p });
        if (r === "generated") stats.img.generated += 1;
        else stats.img.skipped += 1;
      }
      continue;
    }

    if (acc.hero.has(src)) {
      for (const p of heroProfiles) {
        const r = await generateWebpVariant({ src, stat, ...p });
        if (r === "generated") stats.img.generated += 1;
        else stats.img.skipped += 1;
      }
    }

    if (acc.cover.has(src)) {
      for (const p of coverProfiles) {
        const r = await generateWebpVariant({ src, stat, ...p });
        if (r === "generated") stats.img.generated += 1;
        else stats.img.skipped += 1;
      }
    }

    if (!QUIET && !VERBOSE && (idx % 25 === 0 || idx === totalWebpInputs)) {
      log(`[generate-images] webp sources processed: ${idx}/${totalWebpInputs}`);
    } else {
      vlog(`[generate-images] processed ${idx}/${totalWebpInputs}: ${src}`);
    }
  }

  // Generate gallery variants
  log(`[generate-images] generating gallery variants for ${allPhotos.length} photo(s)`);
  let pidx = 0;
  for (const src of allPhotos) {
    pidx += 1;
    const inFs = path.join(publicDir, src);
    if (!(await exists(inFs))) {
      missingInputs.add(src);
      vlog(`[generate-images] missing gallery input (skipped): ${src}`);
      continue;
    }
    const stat = await fs.stat(inFs);
    const res = await generateGalleryVariants({ src, stat });
    for (const r of res) {
      if (r === "generated") stats.photos.generated += 1;
      else stats.photos.skipped += 1;
    }
    if (!QUIET && !VERBOSE && (pidx % 25 === 0 || pidx === allPhotos.length)) {
      log(`[generate-images] gallery photos processed: ${pidx}/${allPhotos.length}`);
    } else {
      vlog(`[generate-images] gallery processed ${pidx}/${allPhotos.length}: ${src}`);
    }
  }

  if (missingInputs.size) {
    console.warn(
      `[generate-images] warning: ${missingInputs.size} referenced image(s) not found under public/ (showing up to 20):`,
    );
    for (const m of [...missingInputs].slice(0, 20)) console.warn(`  - ${m}`);
  }

  const ms = Date.now() - startedAt;
  log(
    `[generate-images] done in ${ms}ms | webp: generated=${stats.img.generated} skipped=${stats.img.skipped} | gallery: generated=${stats.photos.generated} skipped=${stats.photos.skipped}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


