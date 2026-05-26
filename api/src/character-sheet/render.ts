import OpenAI, { toFile } from "openai";
import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";
import type { SheetCellSize } from "./types.js";

export const MODEL = "gpt-image-1";
const client = new OpenAI();

export type RenderResult = {
  buffer: Buffer;
  model: string;
};

// OpenAI's images.edit rejects application/octet-stream — we must set an
// explicit image MIME type. toFile does not infer it from the filename.
function mimeFromPath(path: string): "image/jpeg" | "image/png" | "image/webp" {
  const ext = extname(path).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      throw new Error(
        `Unsupported image extension for ref ${path}: ${ext || "(none)"}. Allowed: .jpg, .jpeg, .png, .webp`
      );
  }
}

export async function renderCell(opts: {
  prompt: string;
  refsPaths: string[];
  size: SheetCellSize;
}): Promise<RenderResult> {
  const images = await Promise.all(
    opts.refsPaths.map(async (p) =>
      toFile(await readFile(p), basename(p), { type: mimeFromPath(p) })
    )
  );

  const response = await client.images.edit({
    model: MODEL,
    image: images,
    prompt: opts.prompt,
    size: opts.size,
    n: 1,
  });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI image response did not include b64_json");
  }
  return { buffer: Buffer.from(b64, "base64"), model: MODEL };
}
