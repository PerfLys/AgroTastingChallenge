import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

export type WebpFit = "cover" | "contain" | "inside";

export interface GenerateWebpOptions {
  width: number;
  height?: number;
  fit: WebpFit;
  quality: number;
  /**
   * Logical name included in output filename (helps debugging).
   * Example: "card-1x", "card-2x", "hero".
   */
  variant: string;
}

function isLocalPublicPath(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//") && !src.includes("://");
}

async function getLocalFsPath(src: string): Promise<string | null> {
  if (!isLocalPublicPath(src)) return null;
  const fsPath = path.join(process.cwd(), "public", src);
  try {
    await fs.access(fsPath);
    return fsPath;
  } catch {
    return null;
  }
}

async function fileExists(fsPath: string): Promise<boolean> {
  try {
    await fs.access(fsPath);
    return true;
  } catch {
    return false;
  }
}

const GENERATED_DIR_PUBLIC = "/_generated/img";
const GENERATED_DIR_FS = path.join(process.cwd(), "public", "_generated", "img");

async function ensureGeneratedDir() {
  await fs.mkdir(GENERATED_DIR_FS, { recursive: true });
}

function makeHash(input: string): string {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 16);
}

export async function generateWebpUrl(src: string, opts: GenerateWebpOptions): Promise<string> {
  // Already a generated/static webp
  if (typeof src !== "string" || !src) return src;
  if (!isLocalPublicPath(src)) return src;
  if (src.startsWith("/_generated/") && src.endsWith(".webp")) return src;
  if (src.endsWith(".svg")) return src;

  const inputFsPath = await getLocalFsPath(src);
  if (!inputFsPath) return src;

  await ensureGeneratedDir();

  const stat = await fs.stat(inputFsPath);
  const signature = JSON.stringify({
    src,
    size: stat.size,
    mtimeMs: stat.mtimeMs,
    w: opts.width,
    h: opts.height ?? null,
    fit: opts.fit,
    q: opts.quality,
    v: opts.variant,
  });
  const hash = makeHash(signature);
  const filename = `${hash}-${opts.variant}.webp`;
  const outputFsPath = path.join(GENERATED_DIR_FS, filename);

  if (!(await fileExists(outputFsPath))) {
    const img = sharp(inputFsPath, { failOn: "none" });
    if (opts.fit === "cover") {
      img.resize(opts.width, opts.height ?? Math.round((opts.width * 9) / 16), {
        fit: "cover",
        position: "attention",
        withoutEnlargement: true,
      });
    } else if (opts.fit === "contain") {
      img.resize(opts.width, opts.height ?? Math.round((opts.width * 9) / 16), {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
        withoutEnlargement: true,
      });
    } else {
      // inside
      img.resize({
        width: opts.width,
        height: opts.height,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    await img.webp({ quality: opts.quality }).toFile(outputFsPath);
  }

  return `${GENERATED_DIR_PUBLIC}/${filename}`;
}


