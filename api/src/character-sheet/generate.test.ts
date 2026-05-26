import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  beforeAll,
  afterAll,
} from "vitest";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const { mockRenderCell } = vi.hoisted(() => ({
  mockRenderCell: vi.fn(),
}));

vi.mock("./render.js", () => ({
  MODEL: "gpt-image-1",
  renderCell: mockRenderCell,
}));

import { generateCharacterSheet } from "./generate.js";
import type { CharacterConfig, Manifest } from "./types.js";

const FAKE_PNG = Buffer.from("png-bytes");

let workDir: string;
let refA: string;
let refB: string;

beforeAll(() => {
  workDir = mkdtempSync(join(tmpdir(), "char-sheet-test-"));
  refA = join(workDir, "ref-a.jpg");
  refB = join(workDir, "ref-b.jpg");
  writeFileSync(refA, Buffer.from("ref-a"));
  writeFileSync(refB, Buffer.from("ref-b"));
});

afterAll(() => {
  rmSync(workDir, { recursive: true, force: true });
});

beforeEach(() => {
  mockRenderCell.mockReset();
  mockRenderCell.mockResolvedValue({
    buffer: FAKE_PNG,
    model: "gpt-image-1",
  });
});

function configFor(
  name: string,
  overrides: Partial<CharacterConfig> = {}
): CharacterConfig {
  return {
    name,
    conceptArtPaths: [refA, refB],
    styleSpec: "test style",
    outputDir: join(workDir, "out", name),
    ...overrides,
  };
}

describe("generateCharacterSheet — validation", () => {
  test("throws when conceptArtPaths is empty", async () => {
    await expect(
      generateCharacterSheet(configFor("v1", { conceptArtPaths: [] }))
    ).rejects.toThrow(/conceptArtPaths/);
    expect(mockRenderCell).not.toHaveBeenCalled();
  });

  test("throws when a ref file does not exist", async () => {
    await expect(
      generateCharacterSheet(
        configFor("v2", {
          conceptArtPaths: [refA, join(workDir, "missing.jpg")],
        })
      )
    ).rejects.toThrow(/missing/i);
    expect(mockRenderCell).not.toHaveBeenCalled();
  });

  test("throws when name contains a slash", async () => {
    await expect(generateCharacterSheet(configFor("bad/name"))).rejects.toThrow();
    expect(mockRenderCell).not.toHaveBeenCalled();
  });

  test("throws when name is empty", async () => {
    await expect(generateCharacterSheet(configFor(""))).rejects.toThrow();
  });
});

describe("generateCharacterSheet — first run", () => {
  test("calls renderCell for all 9 cells and writes 9 PNGs + manifest", async () => {
    const config = configFor("first-run");
    const manifest = await generateCharacterSheet(config);

    expect(mockRenderCell).toHaveBeenCalledTimes(9);
    expect(Object.keys(manifest.entries)).toHaveLength(9);
    for (const entry of Object.values(manifest.entries)) {
      expect(entry.status).toBe("completed");
      expect(existsSync(join(config.outputDir, entry.outputFile))).toBe(true);
    }
    expect(existsSync(join(config.outputDir, "manifest.json"))).toBe(true);
  });

  test("manifest includes prompt and refsUsed for each entry", async () => {
    const config = configFor("first-run-meta");
    const manifest = await generateCharacterSheet(config);
    const entry = manifest.entries["view-front_neutral"];
    expect(entry.prompt.toLowerCase()).toContain("attached reference image");
    expect(entry.refsUsed).toEqual([refA, refB]);
    expect(entry.model).toBe("gpt-image-1");
  });
});

describe("generateCharacterSheet — re-runs skip completed cells", () => {
  test("second run with same config makes zero render calls", async () => {
    const config = configFor("rerun");
    await generateCharacterSheet(config);
    expect(mockRenderCell).toHaveBeenCalledTimes(9);

    mockRenderCell.mockClear();
    await generateCharacterSheet(config);
    expect(mockRenderCell).not.toHaveBeenCalled();
  });
});

describe("generateCharacterSheet — failure handling", () => {
  test("renderCell rejection records failed status and continues", async () => {
    const config = configFor("partial-fail");

    mockRenderCell
      .mockResolvedValueOnce({ buffer: FAKE_PNG, model: "gpt-image-1" })
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue({ buffer: FAKE_PNG, model: "gpt-image-1" });

    const manifest = await generateCharacterSheet(config);

    expect(mockRenderCell).toHaveBeenCalledTimes(9);
    const failed = Object.values(manifest.entries).filter(
      (e) => e.status === "failed"
    );
    const completed = Object.values(manifest.entries).filter(
      (e) => e.status === "completed"
    );
    expect(failed).toHaveLength(1);
    expect(completed).toHaveLength(8);
    expect(failed[0].error).toMatch(/boom/);
  });

  test("failed cells are retried on subsequent runs", async () => {
    const config = configFor("retry-failed");

    mockRenderCell
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValue({ buffer: FAKE_PNG, model: "gpt-image-1" });

    await generateCharacterSheet(config);
    expect(mockRenderCell).toHaveBeenCalledTimes(9);
    const m1 = JSON.parse(
      await readFile(join(config.outputDir, "manifest.json"), "utf8")
    ) as Manifest;
    expect(
      Object.values(m1.entries).filter((e) => e.status === "failed")
    ).toHaveLength(1);

    mockRenderCell.mockClear();
    mockRenderCell.mockResolvedValue({
      buffer: FAKE_PNG,
      model: "gpt-image-1",
    });

    await generateCharacterSheet(config);
    expect(mockRenderCell).toHaveBeenCalledTimes(1);
  });
});
