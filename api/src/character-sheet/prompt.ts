/**
 * TopoGlyph 9.1 prompt builder — Minimal Sufficient Prompting.
 *
 * Empirical finding: when a reference image is attached as a strong conditioner
 * (gpt-image-1 / images.edit, img2img, IP-Adapter, ControlNet), restating the
 * character's invariants (identity, style, design) in the prompt *competes*
 * with the reference for the model's attention budget. Verbose invariant
 * blocks cause the model to re-derive the character from text, producing a
 * plausible-but-off-model output rendered in the model's prior style.
 *
 * The fix: specify the DELTA only. Tell the model to inherit invariants from
 * the reference and describe only what the reference cannot supply (the pose,
 * the camera, the lighting, and any pose-specific drift mitigations).
 *
 * Envelope:
 *   1. Reference binding (one clause)
 *   2. Pose / Action / Expression  (⊟ᵛ — the variable axis)
 *   3. Camera (⟿ᶜ)
 *   4. Lighting (⟿ˡ)
 *   5. [if pose.emphasis]              Emphasis for this shot (⫻ pose-specific only)
 *   6. [if pose.isBackOrSideView]      Back-side details   (⟁ᴰ extrapolated — reference can't show)
 *   7. [if pose.designOverride]        Design modifier     (when an invariant intentionally varies)
 *   8. Framing rules
 *   9. [if pose.extraNegatives]        Avoid               (only essential per-pose exclusions)
 *
 * The CharacterProfile fields beyond `designBackExtrapolated` are retained for
 * documentation and future text-only regime support, but are NOT used by the
 * reference-conditioned envelope.
 */

import type {
  CharacterConfig,
  CharacterProfile,
  PoseSpec,
  SheetCellSize,
} from "./types.js";

/**
 * Derive a minimal CharacterProfile from the legacy CharacterConfig fields
 * (styleSpec / description / outfitNote). Used when the config does not
 * supply an explicit `profile`. Most fields are unused by the lean envelope
 * but are populated for completeness.
 */
export function deriveProfileFromLegacy(
  config: CharacterConfig
): CharacterProfile {
  const description = config.description?.trim();
  const outfit = config.outfitNote?.trim();
  const style = config.styleSpec?.trim() ?? "";

  return {
    name: config.name,
    archetype: description ?? config.name,
    identityTokens: description ? [description] : [],
    irreducibleFeatures: [],
    styleHolistic: style,
    designTokens: outfit ? [outfit] : [],
    defaultAffect: "neutral",
    baseNegatives: [],
    driftRiskEmphasis: [],
  };
}

function resolveProfile(config: CharacterConfig): CharacterProfile {
  return config.profile ?? deriveProfileFromLegacy(config);
}

const REFERENCE_BINDING =
  "Render this character in the exact same art style as the attached reference image. " +
  "Same character, same identity, same costume design, same rendering technique.";

const FRAMING =
  "Render as a single isolated character on a plain neutral background, centered, " +
  "no panel borders, no captions, no text, no other characters in frame.";

export function buildPosePrompt(
  profile: CharacterProfile,
  pose: PoseSpec
): string {
  const blocks: string[] = [];

  // 1. Reference binding
  blocks.push(REFERENCE_BINDING);

  // 2. Pose / Action / Expression
  blocks.push(
    `Pose: ${pose.kinematic}. ` +
      `Action: ${pose.action}. ` +
      `Expression: ${pose.expression}.`
  );

  // 3. Camera
  blocks.push(`Camera: ${pose.camera}.`);

  // 4. Lighting
  blocks.push(`Lighting: ${pose.lighting}.`);

  // 5. Pose-specific emphasis
  if (pose.emphasis && pose.emphasis.length > 0) {
    blocks.push(
      "Emphasis for this shot: " +
        pose.emphasis.map((e) => `(${e})`).join(", ") +
        "."
    );
  }

  // 6. Back-side details — reference can't show what's not visible
  if (
    pose.isBackOrSideView &&
    profile.designBackExtrapolated &&
    profile.designBackExtrapolated.length > 0
  ) {
    blocks.push(
      "Back-side details (the reference does not show these regions): " +
        profile.designBackExtrapolated.join(", ") +
        "."
    );
  }

  // 7. Design modifier — only when an invariant intentionally varies for this shot
  if (pose.designOverride) {
    blocks.push(`Design modifier for this shot: ${pose.designOverride}.`);
  }

  // 8. Framing rules
  blocks.push(FRAMING);

  // 9. Pose-specific negatives — only when explicitly supplied
  if (pose.extraNegatives && pose.extraNegatives.length > 0) {
    blocks.push("Avoid: " + pose.extraNegatives.join(", ") + ".");
  }

  return blocks.join("\n\n");
}

export function buildPrompt(pose: PoseSpec, config: CharacterConfig): string {
  return buildPosePrompt(resolveProfile(config), pose);
}

export function sizeForPose(pose: PoseSpec): SheetCellSize {
  return pose.size ?? "1024x1536";
}
