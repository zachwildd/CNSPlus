
import OpenAI, { toFile } from "openai";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";

export type PanelSize = "square" | "portrait" | "landscape" | "auto";

export interface GeneratePanelOptions {
  sceneDescription: string;
  characterRefs?: string[];
  sceneRef?: string;
  styleSpec?: string;
  size?: PanelSize;
}

const MODEL = "gpt-image-1";

const SIZE_MAP: Record<PanelSize, "1024x1024" | "1024x1536" | "1536x1024" | "auto"> = {
  square: "1024x1024",
  portrait: "1024x1536",
  landscape: "1536x1024",
  auto: "auto",
};

const PANEL_FRAMING =
  "Render this as a single comic book panel. No panel borders, gutters, captions, or speech bubbles.";

const client = new OpenAI();

function buildPrompt(opts: GeneratePanelOptions): string {
  const blocks: string[] = [PANEL_FRAMING];

  if (opts.styleSpec) {
    blocks.push(`Style: ${opts.styleSpec}`);
  }

  blocks.push(`Scene: ${opts.sceneDescription}`);

  const hasCharacterRefs = (opts.characterRefs?.length ?? 0) > 0;
  if (hasCharacterRefs) {
    blocks.push(
      "The provided reference images depict the characters that should appear in this panel; render them faithfully to the references."
    );
  }

  if (opts.sceneRef) {
    blocks.push(
      "A reference image of the location/background is included; match the panel's setting to that reference."
    );
  }

  return blocks.join("\n\n");
}

export async function generatePanel(opts: GeneratePanelOptions): Promise<Buffer> {
  const size = SIZE_MAP[opts.size ?? "square"];
  const prompt = buildPrompt(opts);

  const refPaths = [
    ...(opts.sceneRef ? [opts.sceneRef] : []),
    ...(opts.characterRefs ?? []),
  ];

  const response =
    refPaths.length > 0
      ? await client.images.edit({
          model: MODEL,
          image: await Promise.all(
            refPaths.map(async (p) => toFile(await readFile(p), basename(p)))
          ),
          prompt,
          size,
          n: 1,
        })
      : await client.images.generate({
          model: MODEL,
          prompt,
          size,
          n: 1,
        });

  const b64 = response.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI image response did not include b64_json");
  }
  return Buffer.from(b64, "base64");
}