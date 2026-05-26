import type { PoseSpec } from "./types.js";

/**
 * The default 9-pose character sheet: 4-view turnaround at neutral expression
 * plus a 5-expression set at front view. Used when a CharacterConfig does not
 * supply its own `poses` list.
 */

const STANDING_KINEMATIC =
  "standing upright, arms relaxed at sides, weight distributed evenly on both legs";
const STANDING_ACTION = "neutral resting stance, calm but alert";
const EVEN_LIGHT = "soft even lighting, no dramatic shadow";

const turnaround: PoseSpec[] = [
  {
    id: "view-front_neutral",
    label: "Turnaround — front view, neutral",
    kinematic: STANDING_KINEMATIC,
    action: STANDING_ACTION,
    expression: "neutral expression, mouth closed, head facing forward",
    camera: "full body, front view, centered, eye-level framing",
    lighting: EVEN_LIGHT,
    size: "1024x1536",
  },
  {
    id: "view-three-quarter_neutral",
    label: "Turnaround — three-quarter view, neutral",
    kinematic: STANDING_KINEMATIC,
    action: STANDING_ACTION,
    expression: "neutral expression, mouth closed, head facing forward",
    camera:
      "full body, three-quarter view (body angled approximately 45 degrees from camera), centered, eye-level framing",
    lighting: EVEN_LIGHT,
    size: "1024x1536",
  },
  {
    id: "view-side_neutral",
    label: "Turnaround — side view, neutral",
    kinematic: STANDING_KINEMATIC,
    action: STANDING_ACTION,
    expression: "neutral expression, mouth closed, head facing forward",
    camera:
      "full body, side view (full profile, body perpendicular to camera), centered, eye-level framing",
    lighting: EVEN_LIGHT,
    size: "1024x1536",
  },
  {
    id: "view-back_neutral",
    label: "Turnaround — back view, neutral",
    kinematic: STANDING_KINEMATIC,
    action: STANDING_ACTION,
    expression: "head facing fully away from camera; back of head visible",
    camera:
      "full body, back view (character facing fully away from camera), centered, eye-level framing",
    lighting: EVEN_LIGHT,
    isBackOrSideView: true,
    size: "1024x1536",
  },
];

const HEAD_CAMERA =
  "head-and-shoulders crop, front view, centered, eye-level framing";
const HEAD_KINEMATIC = "head and shoulders only, body relaxed";
const HEAD_ACTION = "portrait pose";

const expressions: PoseSpec[] = [
  {
    id: "expr-front_smiling",
    label: "Expression — smiling",
    kinematic: HEAD_KINEMATIC,
    action: HEAD_ACTION,
    expression: "warm smile, eyes slightly creased, friendly",
    camera: HEAD_CAMERA,
    lighting: EVEN_LIGHT,
    size: "1024x1024",
  },
  {
    id: "expr-front_angry",
    label: "Expression — angry",
    kinematic: HEAD_KINEMATIC,
    action: HEAD_ACTION,
    expression: "angry, brow furrowed, scowling",
    camera: HEAD_CAMERA,
    lighting: EVEN_LIGHT,
    size: "1024x1024",
  },
  {
    id: "expr-front_surprised",
    label: "Expression — surprised",
    kinematic: HEAD_KINEMATIC,
    action: HEAD_ACTION,
    expression: "surprised, eyes wide, mouth slightly open",
    camera: HEAD_CAMERA,
    lighting: EVEN_LIGHT,
    size: "1024x1024",
  },
  {
    id: "expr-front_sad",
    label: "Expression — sad",
    kinematic: HEAD_KINEMATIC,
    action: HEAD_ACTION,
    expression: "sad, downcast, melancholic",
    camera: HEAD_CAMERA,
    lighting: EVEN_LIGHT,
    size: "1024x1024",
  },
  {
    id: "expr-front_smirking",
    label: "Expression — smirking",
    kinematic: HEAD_KINEMATIC,
    action: HEAD_ACTION,
    expression: "sly smirk, one corner of the mouth raised",
    camera: HEAD_CAMERA,
    lighting: EVEN_LIGHT,
    size: "1024x1024",
  },
];

export const CANONICAL_POSES: PoseSpec[] = [...turnaround, ...expressions];
