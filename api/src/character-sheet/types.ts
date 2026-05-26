/**
 * Character-sheet types.
 *
 * The system uses TopoGlyph 9.0 reference-anchored prompting. A character is
 * decomposed into a CharacterProfile (invariants: identity / style / design /
 * affect, plus drift-risk emphasis), and the sheet is generated as a list of
 * PoseSpecs (the variable axis: kinematic / action / expression / camera /
 * lighting). The reference image conditions the generation; the profile and
 * pose are projected back as the textual prompt.
 *
 * Legacy CharacterConfig fields (styleSpec, description, outfitNote) are still
 * accepted; an internal adapter derives a minimal CharacterProfile from them.
 */

export type View = "front" | "three-quarter" | "side" | "back";

export type Expression =
  | "neutral"
  | "smiling"
  | "angry"
  | "surprised"
  | "sad"
  | "smirking";

export type SheetCellSize = "1024x1024" | "1024x1536";

// ---------------------------------------------------------------------------
// TopoGlyph 9.0 — CharacterProfile and PoseSpec
// ---------------------------------------------------------------------------

export type CharacterProfile = {
  name: string;
  /** ⊙ — irreducible archetype, one short phrase. */
  archetype: string;
  /** ⟁ᴵ ⊳ ⊡ᶜ — compositional identity tokens, restated every prompt. */
  identityTokens: string[];
  /** ⊙ ⫯ — features at high drift risk; emphasis-bracketed mandatorily. */
  irreducibleFeatures: string[];
  /** ⊳ ⥺ˢ — holistic style invocation, paired with reference image. */
  styleHolistic: string;
  /** ⥺ⁿ — optional named-style backup anchor. */
  styleNamed?: string;
  /** ⟁ᴰ ⊳ ⊡ᶜ — compositional design tokens (costume, props, accessories). */
  designTokens: string[];
  /** ⟁ᴰ extrapolated — design tokens for regions the reference omits (e.g. back). */
  designBackExtrapolated?: string[];
  /** ⟁ᴬ — default affect; usually free-tier, may be overridden per pose. */
  defaultAffect: string;
  /** ⊟ⁿ — base negative prompts always in force. */
  baseNegatives: string[];
  /** ⫻ — features the model tends to drop; emphasis-bracketed every prompt. */
  driftRiskEmphasis: string[];
};

export type PoseSpec = {
  id: string;
  label: string;
  /** ⟿ᵏ — body posture, limb positions. */
  kinematic: string;
  /** ⟿ᵃ — what the character is doing. */
  action: string;
  /** ⟿ᵉ — expression, head direction. Avoid eye-direction tokens for occluded-eye characters. */
  expression: string;
  /** ⟿ᶜ — camera angle, framing, distance. */
  camera: string;
  /** ⟿ˡ — lighting direction and mood. */
  lighting: string;
  /** ⫷⫸ — pose-specific emphasis tokens. */
  emphasis?: string[];
  /** Override profile.defaultAffect for this pose. */
  affectOverride?: string;
  /** Modify a design token for this pose (e.g. "circuitry dimmed to ember"). */
  designOverride?: string;
  /** When true, append profile.designBackExtrapolated to the design block. */
  isBackOrSideView?: boolean;
  /** Pose-specific negatives on top of profile.baseNegatives. */
  extraNegatives?: string[];
  /** Output canvas size; defaults to "1024x1536" (full-body portrait). */
  size?: SheetCellSize;
};

// ---------------------------------------------------------------------------
// CharacterConfig — accepts TopoGlyph mode (preferred) or legacy mode.
// ---------------------------------------------------------------------------

export type CharacterConfig = {
  name: string;
  conceptArtPaths: string[];
  outputDir: string;

  /** TopoGlyph mode: full character decomposition. Preferred. */
  profile?: CharacterProfile;
  /** TopoGlyph mode: custom pose list. Falls back to CANONICAL_POSES if absent. */
  poses?: PoseSpec[];

  /** Legacy mode: short style phrase used to derive profile.styleHolistic. */
  styleSpec?: string;
  /** Legacy mode: short character description used as profile.archetype. */
  description?: string;
  /** Legacy mode: short outfit note used as profile.designTokens. */
  outfitNote?: string;
};

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

export type ManifestEntry = {
  cellId: string;
  outputFile: string;
  status: "completed" | "failed";
  prompt: string;
  refsUsed: string[];
  model: string;
  size: SheetCellSize;
  generatedAt: string;
  durationMs: number;
  error?: string;
};

export type Manifest = {
  characterName: string;
  styleSpec: string;
  description?: string;
  conceptArtPaths: string[];
  entries: Record<string, ManifestEntry>;
  lastRunAt: string;
};
