import { readFile, writeFile } from "node:fs/promises";
import { deriveProfileFromLegacy } from "./prompt.js";
import type { CharacterConfig, Manifest } from "./types.js";

function styleSpecFor(config: CharacterConfig): string {
  if (config.profile) return config.profile.styleHolistic;
  if (config.styleSpec) return config.styleSpec;
  return deriveProfileFromLegacy(config).styleHolistic;
}

function descriptionFor(config: CharacterConfig): string | undefined {
  if (config.profile) return config.profile.archetype;
  return config.description;
}

export function blankManifest(config: CharacterConfig): Manifest {
  const m: Manifest = {
    characterName: config.name,
    styleSpec: styleSpecFor(config),
    conceptArtPaths: [...config.conceptArtPaths],
    entries: {},
    lastRunAt: new Date().toISOString(),
  };
  const description = descriptionFor(config);
  if (description !== undefined) {
    m.description = description;
  }
  return m;
}

export function shouldSkipCell(manifest: Manifest, cellId: string): boolean {
  return manifest.entries[cellId]?.status === "completed";
}

export async function loadManifest(path: string): Promise<Manifest | null> {
  try {
    const raw = await readFile(path, "utf8");
    return JSON.parse(raw) as Manifest;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function writeManifest(
  path: string,
  manifest: Manifest
): Promise<void> {
  await writeFile(path, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}
