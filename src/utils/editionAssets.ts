import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export async function getEditionAssetPhotos(year: number): Promise<string[]> {
  const dir = path.join(process.cwd(), "public", "assets", "editions", String(year));
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((name) => IMAGE_EXTS.has(path.extname(name).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    return files.map((name) => `/assets/editions/${year}/${name}`);
  } catch {
    return [];
  }
}




