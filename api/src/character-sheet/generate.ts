import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { CANONICAL_POSES } from "./canonical-poses.js";
import {
  blankManifest,
  loadManifest,
  shouldSkipCell,
  writeManifest,
} from "./manifest.js";
import { buildPrompt, sizeForPose } from "./prompt.js";
import { MODEL, renderCell } from "./render.js";
import type { CharacterConfig, Manifest, ManifestEntry } from "./types.js";

const MAX_REFS = 8;

function validate(config: CharacterConfig): string[] {
  const errors: string[] = [];
  if (!config.name || config.name.length === 0) {
    errors.push("characterName is empty");
  }
  if (
    config.name.includes("/") ||
    config.name.includes("..") ||
    config.name.includes("\\")
  ) {
    errors.push(`characterName is not filesystem-safe: ${config.name}`);
  }
  if (config.conceptArtPaths.length === 0) {
    errors.push("conceptArtPaths is empty");
  }
  for (const p of config.conceptArtPaths) {
    if (!existsSync(p)) {
      errors.push(`conceptArtPath missing: ${p}`);
    }
  }
  if (!config.profile && !config.styleSpec) {
    errors.push(
      "config must supply either `profile` (TopoGlyph mode) or `styleSpec` (legacy mode)"
    );
  }
  return errors;
}

export async function generateCharacterSheet(
  config: CharacterConfig
): Promise<Manifest> {
  const errors = validate(config);
  if (errors.length > 0) {
    throw new Error(`Invalid CharacterConfig: ${errors.join("; ")}`);
  }

  let refsToUse = config.conceptArtPaths;
  if (refsToUse.length > MAX_REFS) {
    console.warn(
      `[character-sheet] ${refsToUse.length} refs provided; using first ${MAX_REFS}.`
    );
    refsToUse = refsToUse.slice(0, MAX_REFS);
  }

  await mkdir(config.outputDir, { recursive: true });
  const manifestPath = join(config.outputDir, "manifest.json");

  const loaded = await loadManifest(manifestPath);
  const manifest = blankManifest(config);
  if (loaded) {
    manifest.entries = loaded.entries;
  }

  const poses = config.poses ?? CANONICAL_POSES;

  console.log(`writing sheet to: ${config.outputDir}`);
  console.log(`poses: ${poses.length} (${config.poses ? "custom" : "canonical"})\n`);

  for (const pose of poses) {
    if (shouldSkipCell(manifest, pose.id)) {
      console.log(`[${pose.id}] skip (completed)`);
      continue;
    }

    const prompt = buildPrompt(pose, config);
    const size = sizeForPose(pose);
    const start = Date.now();
    const outputFile = `${pose.id}.png`;
    const outputPath = join(config.outputDir, outputFile);
    const promptPath = join(config.outputDir, `${pose.id}.prompt.txt`);

    console.log(`\n[${pose.id}] ${pose.label}`);
    console.log("─".repeat(72));
    console.log(prompt);
    console.log("─".repeat(72));
    process.stdout.write(`[${pose.id}] generating... `);
    try {
      await writeFile(promptPath, prompt);
      const { buffer, model } = await renderCell({
        prompt,
        refsPaths: refsToUse,
        size,
      });

      await writeFile(outputPath, buffer);

      const durationMs = Date.now() - start;
      const entry: ManifestEntry = {
        cellId: pose.id,
        outputFile,
        status: "completed",
        prompt,
        refsUsed: [...refsToUse],
        model,
        size,
        generatedAt: new Date().toISOString(),
        durationMs,
      };
      manifest.entries[pose.id] = entry;
      manifest.lastRunAt = new Date().toISOString();
      await writeManifest(manifestPath, manifest);

      const seconds = (durationMs / 1000).toFixed(1);
      console.log(
        `wrote ${buffer.length} bytes (${seconds}s) -> ${outputPath}`
      );
    } catch (err) {
      const durationMs = Date.now() - start;
      const message = err instanceof Error ? err.message : String(err);
      const entry: ManifestEntry = {
        cellId: pose.id,
        outputFile,
        status: "failed",
        prompt,
        refsUsed: [...refsToUse],
        model: MODEL,
        size,
        generatedAt: new Date().toISOString(),
        durationMs,
        error: message,
      };
      manifest.entries[pose.id] = entry;
      manifest.lastRunAt = new Date().toISOString();
      await writeManifest(manifestPath, manifest);
      console.log(`FAILED: ${message}`);
    }
  }

  return manifest;
}
