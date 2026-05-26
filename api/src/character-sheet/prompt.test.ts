import { describe, test, expect } from "vitest";
import {
  buildPosePrompt,
  buildPrompt,
  deriveProfileFromLegacy,
  sizeForPose,
} from "./prompt.js";
import { CANONICAL_POSES } from "./canonical-poses.js";
import type {
  CharacterConfig,
  CharacterProfile,
  PoseSpec,
} from "./types.js";

const legacyConfig: CharacterConfig = {
  name: "Airiona",
  conceptArtPaths: ["/tmp/a.jpg"],
  styleSpec: "indie webcomic, rough sketch-heavy",
  outputDir: "/tmp/out",
};

const fullProfile: CharacterProfile = {
  name: "Kyshumu",
  archetype: "humanoid beast-warrior",
  identityTokens: ["dark brown skin", "long silver-and-red mane"],
  irreducibleFeatures: ["long prehensile tail visible"],
  styleHolistic: "indie webcomic, rough sketch-heavy",
  styleNamed: "Sheldon Mlloyd style",
  designTokens: ["matte black armored bodysuit"],
  designBackExtrapolated: ["energy circuitry along the spine"],
  defaultAffect: "feral, powering up",
  baseNegatives: ["different character", "photorealistic"],
  driftRiskEmphasis: ["circuitry visible"],
};

const sidePose = CANONICAL_POSES.find((p) => p.id === "view-side_neutral")!;
const backPose = CANONICAL_POSES.find((p) => p.id === "view-back_neutral")!;
const expressionPose = CANONICAL_POSES.find(
  (p) => p.id === "expr-front_smiling"
)!;

describe("buildPrompt — lean reference-conditioned envelope", () => {
  test("includes the reference-binding clause", () => {
    expect(buildPrompt(sidePose, legacyConfig).toLowerCase()).toContain(
      "attached reference image"
    );
  });

  test("includes Pose, Action, Expression, Camera, Lighting fields", () => {
    const prompt = buildPrompt(sidePose, legacyConfig);
    expect(prompt).toContain("Pose:");
    expect(prompt).toContain("Action:");
    expect(prompt).toContain("Expression:");
    expect(prompt).toContain("Camera:");
    expect(prompt).toContain("Lighting:");
  });

  test("does NOT restate identity / style / design / mood / always-on negatives in legacy mode", () => {
    const prompt = buildPrompt(sidePose, {
      ...legacyConfig,
      description: "long teal hair, cybernetic right arm",
      outfitNote: "asymmetric jacket",
    });
    expect(prompt).not.toContain("long teal hair, cybernetic right arm");
    expect(prompt).not.toContain("asymmetric jacket");
    expect(prompt).not.toContain("indie webcomic, rough sketch-heavy");
    expect(prompt).not.toContain("Mood:");
    expect(prompt).not.toContain("Avoid:");
    expect(prompt).not.toContain("MUST be visible");
  });

  test("does not contain literal 'undefined'", () => {
    expect(buildPrompt(sidePose, legacyConfig)).not.toContain("undefined");
  });

  test("side view: prompt mentions side/profile framing", () => {
    expect(buildPrompt(sidePose, legacyConfig).toLowerCase()).toMatch(
      /profile|side view/
    );
  });

  test("turnaround poses describe full body", () => {
    expect(buildPrompt(sidePose, legacyConfig).toLowerCase()).toContain(
      "full body"
    );
  });

  test("expression poses use head-and-shoulders crop", () => {
    expect(buildPrompt(expressionPose, legacyConfig).toLowerCase()).toContain(
      "head-and-shoulders"
    );
  });

  test("smiling expression: prompt mentions smile", () => {
    expect(buildPrompt(expressionPose, legacyConfig).toLowerCase()).toContain(
      "smile"
    );
  });
});

describe("buildPosePrompt — TopoGlyph profile mode (lean)", () => {
  test("does NOT include identity tokens, design tokens, or always-on drift block", () => {
    const prompt = buildPosePrompt(fullProfile, sidePose);
    expect(prompt).not.toContain("dark brown skin");
    expect(prompt).not.toContain("matte black armored bodysuit");
    expect(prompt).not.toContain("MUST be visible");
    expect(prompt).not.toContain("humanoid beast-warrior");
  });

  test("appends back-extrapolated design tokens for back/side views when isBackOrSideView is true", () => {
    const prompt = buildPosePrompt(fullProfile, backPose);
    expect(prompt).toContain("energy circuitry along the spine");
    expect(prompt.toLowerCase()).toContain("back-side details");
  });

  test("does NOT append back-extrapolated design tokens for front-view poses", () => {
    const frontPose = CANONICAL_POSES.find(
      (p) => p.id === "view-front_neutral"
    )!;
    const prompt = buildPosePrompt(fullProfile, frontPose);
    expect(prompt).not.toContain("energy circuitry along the spine");
  });

  test("designOverride is appended when present", () => {
    const customPose: PoseSpec = {
      ...sidePose,
      designOverride: "circuitry dimmed to ember-red",
    };
    const prompt = buildPosePrompt(fullProfile, customPose);
    expect(prompt).toContain("circuitry dimmed to ember-red");
  });

  test("emphasis tokens are emitted in an Emphasis block", () => {
    const customPose: PoseSpec = {
      ...sidePose,
      emphasis: ["tail visible behind body"],
    };
    const prompt = buildPosePrompt(fullProfile, customPose);
    expect(prompt).toContain("Emphasis for this shot");
    expect(prompt).toContain("tail visible behind body");
  });

  test("extraNegatives are emitted only when present (not by default)", () => {
    expect(buildPosePrompt(fullProfile, sidePose)).not.toContain("Avoid:");
    const customPose: PoseSpec = {
      ...sidePose,
      extraNegatives: ["flames", "combat pose"],
    };
    const prompt = buildPosePrompt(fullProfile, customPose);
    expect(prompt).toContain("Avoid:");
    expect(prompt).toContain("flames");
    expect(prompt).toContain("combat pose");
  });

  test("affectOverride is NOT emitted (subsumed by Action/Expression)", () => {
    const customPose: PoseSpec = {
      ...sidePose,
      affectOverride: "weary, contemplative",
    };
    const prompt = buildPosePrompt(fullProfile, customPose);
    expect(prompt).not.toContain("Mood:");
    expect(prompt).not.toContain("weary, contemplative");
  });
});

describe("deriveProfileFromLegacy", () => {
  test("populates archetype from description, falls back to name", () => {
    expect(deriveProfileFromLegacy(legacyConfig).archetype).toBe("Airiona");
    expect(
      deriveProfileFromLegacy({
        ...legacyConfig,
        description: "long teal hair",
      }).archetype
    ).toBe("long teal hair");
  });

  test("populates designTokens from outfitNote when present", () => {
    expect(deriveProfileFromLegacy(legacyConfig).designTokens).toEqual([]);
    expect(
      deriveProfileFromLegacy({
        ...legacyConfig,
        outfitNote: "asymmetric jacket",
      }).designTokens
    ).toEqual(["asymmetric jacket"]);
  });
});

describe("buildPrompt — coverage across canonical poses", () => {
  test.each(CANONICAL_POSES.map((p) => p.id))(
    "%s produces a non-empty prompt with no literal 'undefined'",
    (id) => {
      const pose = CANONICAL_POSES.find((p) => p.id === id)!;
      const prompt = buildPrompt(pose, legacyConfig);
      expect(prompt.length).toBeGreaterThan(50);
      expect(prompt).not.toContain("undefined");
    }
  );
});

describe("sizeForPose", () => {
  test("turnaround poses use portrait", () => {
    expect(sizeForPose(sidePose)).toBe("1024x1536");
  });

  test("expression poses use square", () => {
    expect(sizeForPose(expressionPose)).toBe("1024x1024");
  });

  test("poses without a size field default to portrait", () => {
    const pose: PoseSpec = {
      id: "x",
      label: "x",
      kinematic: "x",
      action: "x",
      expression: "x",
      camera: "x",
      lighting: "x",
    };
    expect(sizeForPose(pose)).toBe("1024x1536");
  });
});
