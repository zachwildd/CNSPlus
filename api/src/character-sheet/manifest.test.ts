import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  blankManifest,
  loadManifest,
  shouldSkipCell,
  writeManifest,
} from "./manifest.js";
import type { CharacterConfig, Manifest } from "./types.js";

let tmpDir: string;

beforeAll(() => {
  tmpDir = mkdtempSync(join(tmpdir(), "manifest-test-"));
});

afterAll(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

const sampleConfig: CharacterConfig = {
  name: "test-character",
  conceptArtPaths: ["/tmp/a.jpg", "/tmp/b.jpg"],
  styleSpec: "test style",
  outputDir: "/tmp/out",
};

describe("blankManifest", () => {
  test("returns a manifest with no entries and matching config fields", () => {
    const m = blankManifest(sampleConfig);
    expect(m.characterName).toBe("test-character");
    expect(m.styleSpec).toBe("test style");
    expect(m.conceptArtPaths).toEqual(["/tmp/a.jpg", "/tmp/b.jpg"]);
    expect(m.entries).toEqual({});
    expect(typeof m.lastRunAt).toBe("string");
  });

  test("includes description when provided", () => {
    const m = blankManifest({ ...sampleConfig, description: "hero of arc 1" });
    expect(m.description).toBe("hero of arc 1");
  });
});

describe("shouldSkipCell", () => {
  const baseManifest: Manifest = {
    characterName: "x",
    styleSpec: "x",
    conceptArtPaths: [],
    entries: {},
    lastRunAt: "2026-05-06T00:00:00Z",
  };

  test("returns false when no entry exists", () => {
    expect(shouldSkipCell(baseManifest, "view-front_neutral")).toBe(false);
  });

  test("returns false for a failed entry", () => {
    const m: Manifest = {
      ...baseManifest,
      entries: {
        "view-front_neutral": {
          cellId: "view-front_neutral",
          outputFile: "view-front_neutral.png",
          status: "failed",
          prompt: "...",
          refsUsed: [],
          model: "gpt-image-1",
          size: "1024x1024",
          generatedAt: "2026-05-06T00:00:00Z",
          durationMs: 0,
          error: "boom",
        },
      },
    };
    expect(shouldSkipCell(m, "view-front_neutral")).toBe(false);
  });

  test("returns true for a completed entry", () => {
    const m: Manifest = {
      ...baseManifest,
      entries: {
        "view-front_neutral": {
          cellId: "view-front_neutral",
          outputFile: "view-front_neutral.png",
          status: "completed",
          prompt: "...",
          refsUsed: [],
          model: "gpt-image-1",
          size: "1024x1024",
          generatedAt: "2026-05-06T00:00:00Z",
          durationMs: 1000,
        },
      },
    };
    expect(shouldSkipCell(m, "view-front_neutral")).toBe(true);
  });
});

describe("writeManifest / loadManifest round-trip", () => {
  test("written manifest is loadable and equal", async () => {
    const path = join(tmpDir, "round-trip.json");
    const original = blankManifest(sampleConfig);
    await writeManifest(path, original);
    const loaded = await loadManifest(path);
    expect(loaded).toEqual(original);
  });

  test("loadManifest returns null when file does not exist", async () => {
    const loaded = await loadManifest(join(tmpDir, "does-not-exist.json"));
    expect(loaded).toBeNull();
  });
});
