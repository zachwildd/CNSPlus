import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateCharacterSheet,
  type CharacterConfig,
  type CharacterProfile,
  type PoseSpec,
} from "./character-sheet/index.js";

const HERE = dirname(fileURLToPath(import.meta.url));
// HERE -> cns/packages/webcomic-generator/src; CNS_ROOT -> cns
const CNS_ROOT = join(HERE, "..", "..", "..");
const ART_DIR = join(CNS_ROOT, "art", "sheldonmlloyd");
const OUT_DIR = join(HERE, "..", "out", "sheets");

const STYLE_SPEC =
  "indie webcomic, anime-inspired, rough sketch-heavy lineart, cyber-fantasy, deliberately imperfect";

// ---------------------------------------------------------------------------
// Kyshumu: TopoGlyph 9.0 character profile + custom pose list.
// Decomposed from kyshumu_cyber.beast_super_5.jpg.
// ---------------------------------------------------------------------------

const KYSHUMU_PROFILE: CharacterProfile = {
  name: "kyshumu",
  archetype: "humanoid beast-warrior in cyber-fantasy super-form",
  identityTokens: [
    "tall lean-muscular build, athletic proportions",
    "dark brown skin",
    "long wild voluminous mane, white-silver with red root-glow, flame-shaped silhouette",
    "horizontal visor band across the eyes (eyes occluded by the visor)",
    "fanged mouth with glowing pink-magenta interior when open",
  ],
  irreducibleFeatures: [
    "long segmented prehensile tail visible in frame",
    "glowing white-and-red energy circuitry running across the bodysuit",
  ],
  styleHolistic:
    STYLE_SPEC +
    ", painterly cel-shading, thick confident inkwork, " +
    "desaturated grayscale base with selective saturated red and white energy accents",
  styleNamed: "Sheldon Mlloyd webcomic style",
  designTokens: [
    "matte black armored fullsuit with segmented panels",
    "glowing white-hot energy circuitry branching across chest, abdomen, arms, and legs, with pink-red bloom at junctions",
    "dark sigil panel on the abdomen plate",
    "rounded shoulder pauldrons with circular accent node",
    "oversized clawed gauntlets, dark with white edge-glow",
    "armored knee plates",
  ],
  designBackExtrapolated: [
    "energy circuitry continues across the back, branching down the spine and across the shoulder blades",
    "circuitry traces the backs of the arms and legs",
    "long mane flows down the back with red root-glow visible at the scalp",
  ],
  defaultAffect: "feral, mid-transformation, powering-up energy",
  baseNegatives: [
    "different character",
    "photorealistic",
    "anime moe softening",
    "cute style",
    "missing tail",
    "missing energy circuitry",
    "light skin",
    "short hair",
    "cape",
    "helmet",
    "generic superhero costume",
    "multiple characters",
    "watermark",
    "signature",
    "text",
    "panel borders",
  ],
  driftRiskEmphasis: [
    "energy circuitry clearly visible and glowing",
    "tail clearly visible in frame",
    "dark brown skin tone preserved",
    "visor band remains across eyes",
  ],
};

const KYSHUMU_POSES: PoseSpec[] = [
  {
    id: "kyshumu-pose-01-calm-standing",
    label: "Calm standing reference pose",
    kinematic:
      "standing upright, arms relaxed at sides, weight distributed evenly on both legs",
    action: "neutral resting stance, calm but alert, not in combat",
    expression: "mouth closed, neutral expression, head facing forward",
    camera: "full body, three-quarter front view, centered, eye-level framing",
    lighting: "soft even lighting, no dramatic shadow",
    emphasis: [
      "tail visibly extending behind the body",
      "hands relaxed and empty, no flames",
      "energy circuitry softly active but not flaring",
    ],
  },
  {
    id: "kyshumu-pose-02-combat-punch",
    label: "Mid-action combat punch",
    kinematic:
      "lunging forward, right arm fully extended in straight punch, left arm pulled back to hip in chamber position, left leg planted forward, right leg trailing behind, hips rotated into the strike",
    action: "full-power straight punch mid-impact, body torqued for force",
    expression:
      "fierce snarl, mouth open showing fangs, head locked forward toward target",
    camera:
      "low-angle hero shot, full body in frame, slight motion blur on trailing limbs, camera pulled back to fit the extended pose",
    lighting:
      "dramatic rim light from behind, energy circuitry glowing brightly as key fill, flames on the extended fist as a secondary light source",
    emphasis: [
      "yellow-orange flames erupting from the extended fist",
      "tail whipping back behind the body for balance",
      "hair streaming back from the motion",
      "energy circuitry flaring at peak intensity",
    ],
  },
  {
    id: "kyshumu-pose-03-sitting-quiet",
    label: "Quiet sitting moment, powered down",
    kinematic:
      "sitting on a low rock ledge, elbows resting on knees, hands loosely clasped, shoulders forward, head tilted slightly down",
    action: "resting between battles, contemplative, exhausted, not in combat",
    expression:
      "mouth closed, jaw relaxed, fangs hidden, visor band still occluding the eyes; emotion conveyed through body language only",
    camera:
      "medium shot, three-quarter side view, slightly above eye-level looking down at the subject",
    lighting:
      "low-key warm lighting, fading sunset, long shadows, dim ember glow from the circuitry only",
    emphasis: [
      "tail draped down off the ledge with segments clearly visible",
      "hands empty and at rest, no flames",
      "subtle weariness in posture",
    ],
    designOverride:
      "energy circuitry DIMMED to faint ember-red, no white-hot bloom; the circuitry pattern itself is unchanged",
  },
  {
    id: "kyshumu-pose-04-back-view",
    label: "Back view stress test",
    kinematic:
      "standing, back to camera, looking over the right shoulder toward the camera",
    action: "turning to face a threat behind, alert, primed to act",
    expression:
      "snarling profile visible from the side, fangs showing, head turned over right shoulder",
    camera:
      "full body from behind, three-quarter back view, camera at eye level",
    lighting:
      "rim light from the front silhouetting the figure, circuitry glow from the front edges fills the silhouette, soft fill on the back",
    emphasis: [
      "tail visible curling around the side of the body into frame",
      "long mane flowing down the back with red root-glow visible",
      "spine of the bodysuit traced by glowing white-red energy line",
    ],
    isBackOrSideView: true,
  },
];

// ---------------------------------------------------------------------------
// Character registry
// ---------------------------------------------------------------------------

const CHARACTERS: Record<string, CharacterConfig> = {
  airiona: {
    name: "airiona",
    conceptArtPaths: [
      join(ART_DIR, "airiona_cyber.beast.jpg"),
      join(ART_DIR, "airiona_cyber.beast_stance_2.jpg"),
      join(ART_DIR, "airiona_cyber.beast_stance_3.jpg"),
      join(ART_DIR, "airiona_cyber.beast_stance_4.jpg"),
      join(ART_DIR, "airiona_cyber.beast_stance_5.jpg"),
      join(ART_DIR, "airiona_cyber.beast_stance_6.jpg"),
    ],
    styleSpec: STYLE_SPEC,
    outputDir: join(OUT_DIR, "airiona"),
  },
  kyshumu: {
    name: "kyshumu",
    conceptArtPaths: [join(ART_DIR, "kyshumu_cyber.beast_super_5.jpg")],
    profile: KYSHUMU_PROFILE,
    poses: KYSHUMU_POSES,
    outputDir: join(OUT_DIR, "kyshumu"),
  },
};

async function main(): Promise<void> {
  const requested = process.argv[2] ?? "airiona";
  const config = CHARACTERS[requested];
  if (!config) {
    console.error(`Unknown character: ${requested}`);
    console.error(`Available: ${Object.keys(CHARACTERS).join(", ")}`);
    process.exit(1);
  }
  await generateCharacterSheet(config);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
