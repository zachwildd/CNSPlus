import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generatePanel, type GeneratePanelOptions } from "./generate-panel.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..", "..");
const ART_DIR = join(REPO_ROOT, "art", "sheldonmlloyd");
const OUT_DIR = join(HERE, "..", "out");

interface Scenario {
  label: string;
  options: GeneratePanelOptions;
}

const scenarios: Scenario[] = [
  {
    label: "01-text-only",
    options: {
      sceneDescription:
        "Wide establishing shot of a quiet city street at dawn. A lone figure walks away from camera. Mist on the asphalt.",
    },
  },
  {
    label: "02-text-with-style-landscape",
    options: {
      sceneDescription:
        "Medium shot. A character looks out a rain-streaked window, reflection visible on the glass.",
      styleSpec:
        "moody noir, ink and flat color, limited palette of teal and amber",
      size: "landscape",
    },
  },
  {
    label: "03-single-character-ref",
    options: {
      sceneDescription:
        "Close-up. The character stands in front of a flickering neon sign, looking up.",
      characterRefs: [join(ART_DIR, "aarock.jpg")],
      styleSpec: "ink+flat color, expressive linework",
    },
  },
  {
    label: "04-all-options",
    options: {
      sceneDescription:
        "Two characters face each other across a cluttered table. Tension in their posture.",
      characterRefs: [
        join(ART_DIR, "aarock.jpg"),
        join(ART_DIR, "jax_akinosun.jpg"),
      ],
      // Stand-in for an actual location reference; swap when one is available.
      sceneRef: join(ART_DIR, "halo_crusades_logo_dark.jpg"),
      styleSpec: "ink+flat color, expressive linework",
      size: "landscape",
    },
  },
];

function checkRefs(opts: GeneratePanelOptions): string[] {
  const missing: string[] = [];
  for (const p of opts.characterRefs ?? []) {
    if (!existsSync(p)) missing.push(p);
  }
  if (opts.sceneRef && !existsSync(opts.sceneRef)) missing.push(opts.sceneRef);
  return missing;
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`writing panels to: ${OUT_DIR}\n`);

  for (const { label, options } of scenarios) {
    const missing = checkRefs(options);
    if (missing.length > 0) {
      console.log(`[${label}] SKIPPED — missing refs:\n  ${missing.join("\n  ")}\n`);
      continue;
    }

    process.stdout.write(`[${label}] generating... `);
    const start = Date.now();
    try {
      const buf = await generatePanel(options);
      const path = join(OUT_DIR, `${label}.png`);
      await writeFile(path, buf);
      const seconds = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`wrote ${buf.length} bytes (${seconds}s) → ${path}`);
    } catch (err) {
      console.log("FAILED");
      console.error(err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
