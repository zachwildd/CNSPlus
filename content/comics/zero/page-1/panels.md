# Page 1 — Panels

Built from [`script.md`](script.md) per
[Panelglyph](../../../.topoglyph/modules/panelglyph.md) (TopoGlyph 10.0).
Renderer: **Nano Banana Pro** (handles in-panel text, so dialogue is part of
each render prompt — no separate lettering pass).

---

## Page Glyph

```
⫯page-1 = ⫷ ▭₁◰ ▷ ▭₂◳ ▷ ▭₃◲ ▶ ▭₄◲∅ ⏵ ▭₅◳ ▷ ▭₆◲ ▶ ▭₇◱⤞ ⫸
          ↫ comic/zero/page-1/script.md
          ↬ renders/panel-1.jpg … renders/panel-7.jpg
          ⨹ ⦿ᴬ Sheldon  ⦿ᴬⁱ Claude  ⦿ᴿ nano-banana-pro
```

**Beat-to-panel mapping**

| Script beat | Panel |
|---|---|
| `■ᵇ¹` Establish — hooded prisoners on descending elevator; screams below | ▭₁ |
| `■ᵇ²` Bursun & Yaharia unbothered amid stressed peers | ▭₂ |
| `■ᵇ³` Yaharia self-introduces, asks Bursun's name | ▭₃ |
| `■ᵇ⁴` Bursun looks, ignores | ▭₄ |
| `■ᵇ⁵` Yaharia self-corrects: *"Silly me — we don't have names"* | ▭₅ |
| `■ᵇ⁶` Yaharia decides to give him a name | ▭₆ |
| `■ᵇ⁷` Reveal: her speech was telepathic, not aloud | ▭₇ |

---

## Page-level render constraints

These apply to **every** panel's render prompt. Hoist into the issue-level
style anchor once you've fixed the issue's visual identity; until then this
section is the page's local override.

- **Style anchor (placeholder — to be finalized):** *high-contrast inked
  comic-book style; heavy chiaroscuro from a single warm overhead light
  source; muted palette of warm reds/oranges against deep cool shadows;
  industrial sci-fi aesthetic; detailed line work; characters readable
  through hoods only where the light catches them.*
- **Setting:** the interior of a descending industrial elevator car bringing
  tailed prisoners down to a linking facility (per
  [readme.md](../readme.md) prologue). Steel walls, riveted plating, a
  digital floor-indicator on the wall.
- **Costume:** every prisoner wears the same uniform — coarse hood pulled
  up, heavy slave collar around the neck, handcuffs at the wrists. Faces
  are in deep shadow inside the hoods *except* where lit.
- **Lighting beat:** a single warm overhead light pools onto Bursun and
  Yaharia, catching their eyes and mouths through their hoods; the other
  prisoners around them stay in shadow.
- **Tails:** tailed-prisoner species marker (per
  [vault](../../../character-vault/index.md)) — both Bursun and Yaharia have
  visible tails. Foreground where the framing permits; otherwise implied.
- **Floor indicator:** **diegetic** — a glowing LED display set into the
  elevator wall — *and* **caption** — a small *"floor: NN"* box in a panel
  corner. Both visible.
- **Balloon device (telepathy trick):** in panels 3, 5, 6 every balloon must
  read as **Bursun's internal monologue**. Use rounded **thought-cloud**
  balloon outlines (bumpy/cloudy contour, *not* speech-bubble) with a trail
  of small bubble dots leading **into Bursun's hood**, never to Yaharia's
  mouth. Panel 7 is the reveal — the residual balloon's tail visibly
  reroutes to Yaharia, and its outline shifts to a wavy telepathic style.

---

## Panel 1 — Establishing the elevator

**Glyph**

```
▭₁ = ⦗ ◰  ⟦◯⟧ᴸ ↥
       ⌖ᵖelevator-car  ⌗ᵗfloor-30  ⌗ᵐdread  ⌗ˡwarm-overhead-pool
       { ◉bursun:hooded-cuffed, ◉yaharia:hooded-cuffed,
         ◎crowd:hooded-trembling }
       ⊟ᶠˣ<muffled-screams-from-below>  ⌜floor: 30⌟
       ↬establish ⦘ ▷ ▭₂
```

- **Shot** Wide, high angle looking down into the elevator car.
- **Setting** Industrial steel elevator interior; riveted walls; a glowing
  LED floor-indicator on the back wall reads **30**.
- **Subjects** Roughly a dozen hooded prisoners crammed shoulder-to-shoulder
  in identical uniform (coarse hoods up, slave collars, handcuffs at the
  wrists, visible tails behind them).
  [**Bursun**](../../../character-vault/bursun/character.md) and
  [**Yaharia**](../../../character-vault/yaharia/character.md) are anywhere
  in the cluster — not yet distinguished.
- **Action** The car is descending — sense of weight, of going *down*.
- **Text** No dialogue. **SFX** muffled scream rising from below the floor
  plates. **Caption** *floor: 30*.
- **Beat** Establish the world — hooded peons on a one-way trip.

**Render prompt**

> Wide high-angle comic-book panel looking down into the steel interior of
> a descending industrial elevator car. About a dozen prisoners in identical
> coarse hooded uniforms are crammed shoulder-to-shoulder, each wearing a
> heavy iron slave collar and handcuffs, each with a long tail trailing
> behind them. Their faces are lost in the deep shadow of their hoods. A
> glowing red LED display on the back wall reads "30". Faint motion lines
> and dust suggest descent. A single warm overhead light pools onto the
> center of the floor; the corners of the car are deep cool shadow. Muffled
> scream lettering — small ragged "AAAAH" sound effects — rises from below
> the floor plates. A small caption box in the bottom-left corner reads
> "floor: 30". High-contrast inked comic-book style, heavy chiaroscuro,
> muted palette of warm reds and oranges against deep cool shadows,
> industrial sci-fi aesthetic, detailed line work.

---

## Panel 2 — Foil against peers

**Glyph**

```
▭₂ = ⦗ ◳  ⟦◯⟧ᴹ
       ⌖ᵖelevator-interior  ⌗ᵗfloor-29  ⌗ᵐdread-with-anomaly
       { ◉bursun:calm-impassive, ◉yaharia:calm-curious,
         ◎peers:trembling-around-them }
       ⌜floor: 29⌟
       ↬foil-against-peers ⦘ ▷ ▭₃
```

- **Shot** Medium, eye-level, framing Bursun and Yaharia at the center.
- **Setting** Same elevator car, tighter framing on the central cluster.
  LED on the wall now reads **29**.
- **Subjects**
  - **Bursun** — hood up, head level, posture relaxed; the warm light pools
    on his face inside the hood, catching the line of his jaw and his eyes.
    Eyes calm, half-lidded.
  - **Yaharia** — hood up, beside Bursun; same warm light catches her eyes
    and the corner of her mouth (the beginning of a small, curious smile).
  - Other hooded prisoners visible at the edges of the frame: shoulders
    hunched, faces buried, one shaking. Their hoods are in deep shadow.
- **Action** Static. The two of them stand still while everyone else
  trembles.
- **Text** No dialogue. **Caption** *floor: 29*.
- **Beat** Make the foil legible — these two are not afraid.

**Render prompt**

> Medium eye-level comic-book panel inside an industrial elevator. Front and
> center: two young tailed prisoners in identical hooded uniforms, slave
> collars and handcuffs, standing close together. A single warm overhead
> light pools on their faces *through* the hoods — the man on the left has
> a calm, half-lidded gaze; the woman on the right has a small curious
> smile beginning at the corner of her mouth. The light catches their eyes
> and mouths clearly while the rest of their faces stay in the hood's
> shadow. Around them, other hooded prisoners are visible in deep shadow at
> the edges of the frame — shoulders hunched, faces buried, one visibly
> shaking. A glowing red LED on the back wall reads "29". A small caption
> box in a corner reads "floor: 29". High-contrast inked comic-book style,
> heavy chiaroscuro, muted palette of warm reds and oranges against deep
> cool shadows.

---

## Panel 3 — Yaharia opens (bait #1)

**Glyph**

```
▭₃ = ⦗ ◲  ⟦◯⟧ᶜ ↪ᵒᵗˢ
       ⌖ᵖelevator  ⌗ᵗfloor-28
       { ◉yaharia:eager-eyes-turned-to-bursun, ◎bursun:in-frame-edge }
       ⟪⟪Hi I'm Yaharia, Yaharia Akinosun. What's your name?⟫⟫
       ⌜floor: 28⌟
       ↬yaharia-opens ⦘ ▶ ▭₄
```

- **Shot** Close-up, over-the-shoulder from Bursun's side toward Yaharia.
  Bursun's hooded shoulder/profile occupies the foreground left.
- **Setting** Same elevator; LED visible reads **28**.
- **Subjects**
  - **Yaharia** — hood up; the warm light catches her eyes (wide, eager,
    turned toward the foreground figure) and the open mouth of her
    greeting. The mouth in particular is lit.
  - **Bursun** (off-panel `◎`) — implied by the foreground shoulder, hood
    edge, and a sliver of cheek.
- **Action** Yaharia leans slightly toward the foreground figure, mid-greeting.
- **Text** **Thought-cloud balloon** — bumpy/cloudy outline, *not* speech
  shape — floating between them, with its bubble-dot tail leading into
  **Bursun's** hood (the foreground figure). Balloon reads: *"Hi I'm
  Yaharia, Yaharia Akinosun. What's your name?"*  **Caption** *floor: 28*.
- **Beat** Yaharia opens; the trick begins — reader registers this as
  Bursun's interior monologue.

**Render prompt**

> Close-up comic-book panel, over-the-shoulder from a hooded silent figure
> in the foreground toward a young hooded woman opposite him inside a
> descending industrial elevator. Foreground left: the back of a coarse
> hood and the curve of a slave-collared shoulder (a long tail hanging
> behind). Background right: the woman's face caught in a single warm
> overhead light — wide eager eyes turned eagerly toward the foreground
> figure, mouth open mid-greeting. Hood up; only her eyes and lit mouth
> escape the hood's shadow. A glowing red LED on the wall behind her reads
> "28". **A rounded thought-cloud balloon (bumpy cloud-shape outline, NOT a
> speech bubble) floats between them; a trail of small round bubble-dots
> leads from the balloon down and to the left, into the foreground hooded
> figure's head.** The balloon contains the text: "Hi I'm Yaharia, Yaharia
> Akinosun. What's your name?" A small caption box in a corner reads
> "floor: 28". High-contrast inked comic-book style, heavy chiaroscuro,
> muted palette of warm reds and oranges against deep cool shadows.

---

## Panel 4 — Bursun ignores

**Glyph**

```
▭₄ = ⦗ ◲∅ ⟦◯⟧ᶜ
       ⌖ᵖelevator  ⌗ᵗfloor-27
       { ◉bursun:eyes-cut-sideways-then-away }
       ⌜floor: 27⌟
       ↬bursun-ignores ⦘ ⏵ ▭₅
```

- **Shot** Tight close-up on Bursun; silent panel (`◲∅`).
- **Setting** Same elevator; LED visible reads **27**.
- **Subjects**
  - **Bursun** — hooded face fills the frame. The warm light catches only
    his eyes (and perhaps the tip of his nose). His eyes flick sideways
    toward the off-panel figure (Yaharia, off frame-left), then drift away
    forward.
- **Action** A single beat of acknowledgement followed by deliberate
  disengagement. *He looks at her but ignores her.*
- **Text** **None.** No balloon, no caption other than the floor box.
  **Caption** *floor: 27*.
- **Beat** Bursun ignores Yaharia — the foil lands.

**Render prompt**

> Tight close-up comic-book panel of a hooded young man's face inside a
> dark industrial elevator. The coarse hood is pulled up; only his eyes
> (and the bridge of his nose) catch a single warm overhead light — the
> rest of his face stays in the hood's deep shadow. His eyes are cut
> sharply sideways to the left, toward someone off-panel, then begin
> drifting back forward — a single beat of acknowledgement followed by
> disengagement. A slave collar is visible at the bottom edge of the
> frame. Behind him, slightly out of focus, a glowing red LED reads "27".
> A small caption box in a corner reads "floor: 27". **No speech or
> thought balloons anywhere in this panel — it is silent.** High-contrast
> inked comic-book style, heavy chiaroscuro, muted palette of warm reds
> and oranges against deep cool shadows.

---

## Panel 5 — Yaharia self-corrects (bait #2)

**Glyph**

```
▭₅ = ⦗ ◳  ⟦◯⟧ᴹ
       ⌖ᵖelevator  ⌗ᵗfloor-26
       { ◉yaharia:sheepish-shrug, ◉bursun:still-impassive }
       ⟪⟪Silly me — we don't have names. I named myself and assumed you did the same.⟫⟫
       ⌜floor: 26⌟
       ↬yaharia-self-corrects ⦘ ▷ ▭₆
```

- **Shot** Medium, both characters in frame, three-quarter on Yaharia.
- **Setting** Same elevator; LED visible reads **26**.
- **Subjects**
  - **Yaharia** — hood up; her lit face wears a sheepish half-smile, one
    shoulder lifted in a small handcuffed shrug.
  - **Bursun** — beside her, hood up, lit face impassive; eyes forward.
- **Action** Yaharia's small self-aware shrug; Bursun unchanged.
- **Text** **Thought-cloud balloon** (same cloudy outline as panel 3) with
  tail leading into **Bursun's** hood: *"Silly me — we don't have names. I
  named myself and assumed you did the same."*  **Caption** *floor: 26*.
- **Beat** Yaharia self-corrects, the trick deepens (a second balloon, same
  apparent source).

**Render prompt**

> Medium comic-book panel of two hooded prisoners standing side-by-side
> inside a descending industrial elevator. The woman on the right wears a
> sheepish half-smile lit by a single warm overhead light catching her
> eyes and mouth through the hood; her handcuffed hands have lifted in a
> small apologetic shrug. The man on the left is impassive, eyes forward,
> lit the same way. Both wear identical coarse hoods, slave collars, and
> handcuffs. A glowing red LED on the wall behind them reads "26". **A
> rounded thought-cloud balloon (bumpy cloud-shape outline, NOT a speech
> bubble) floats above them, with a trail of small round bubble-dots
> leading from the balloon down to the LEFT figure's head (the silent
> man).** The balloon contains the text: "Silly me — we don't have names.
> I named myself and assumed you did the same." A small caption box in a
> corner reads "floor: 26". High-contrast inked comic-book style, heavy
> chiaroscuro, muted palette of warm reds and oranges against deep cool
> shadows.

---

## Panel 6 — Yaharia decides (bait #3)

**Glyph**

```
▭₆ = ⦗ ◲  ⟦◯⟧ᶜ
       ⌖ᵖelevator  ⌗ᵗfloor-25
       { ◉yaharia:brightening-eyes-up, ◎bursun:off-panel }
       ⟪⟪I know — I'll give you a name!⟫⟫  ⟪⟪How about…?⟫⟫
       ⌜floor: 25⌟
       ↬yaharia-decides-to-name ⦘ ▶ ▭₇
```

- **Shot** Close-up on Yaharia; Bursun off-panel.
- **Setting** Same elevator; LED visible reads **25**.
- **Subjects**
  - **Yaharia** — hood up; eyes turned upward and slightly inward — she's
    just had an idea. Her mouth begins to curve into a closed-mouth smile.
  - **Bursun** (off-panel `◎`) — implied by the empty space at frame edge
    where panel 5 had him.
- **Action** A small idea-bright moment; her face lifts.
- **Text** **Two thought-cloud balloons**, both with tails leading off the
  panel edge **into where Bursun would be**: *"I know — I'll give you a
  name!"*  / *"How about…?"*  **Caption** *floor: 25*.
- **Beat** She decides — the second balloon ("How about…?") is the
  *hook* the reveal panel will catch.

**Render prompt**

> Close-up comic-book panel of a hooded young woman inside a descending
> industrial elevator. A single warm overhead light catches her eyes —
> turned upward and slightly inward, as if she has just had an idea — and
> the corner of her mouth, which is beginning to curve into a small
> closed-mouth smile. Her hood is up; the rest of her face stays in the
> hood's shadow. A glowing red LED on the wall behind her reads "25".
> **Two rounded thought-cloud balloons (bumpy cloud-shape outlines, NOT
> speech bubbles) float in the panel; both have trails of small round
> bubble-dots leading OFF the panel edge to the right, toward an
> off-panel figure.** The first balloon contains the text: "I know — I'll
> give you a name!" The second balloon contains the text: "How about…?"
> A small caption box in a corner reads "floor: 25". High-contrast inked
> comic-book style, heavy chiaroscuro, muted palette of warm reds and
> oranges against deep cool shadows.

---

## Panel 7 — Reveal: telepathy (insert)

**Glyph**

```
▭₇ = ⦗ ◱  ⟦◯⟧ᴱ
       ⌖ᵖelevator  ⌗ᵗfloor-24  ⌗ᵐreveal
       { ◉bursun:caught-mid-glance-eyes-narrow,
         ◉yaharia:closed-mouth-knowing-smile }
       ⟪~ How about… ~⟫  (telepathic balloon, tail re-routed to Yaharia)
       ⌜floor: 24⌟
       ⤞telepathy — retroactively re-reads ▭₃ ▭₅ ▭₆ ⦘
```

- **Shot** Insert / extreme close-up. A two-shot of the side-by-side
  hooded faces, tightly cropped. Suggested as a smaller inset panel
  positioned at the bottom of the page to feel like a *click of
  recognition*.
- **Setting** Same elevator; LED visible reads **24**.
- **Subjects**
  - **Bursun** — eyes narrowed slightly, the only visible reaction in the
    entire page from him. Hood still up.
  - **Yaharia** — beside him, closed-mouth knowing smile, eyes slid
    sideways toward Bursun. The picture of someone who's just been caught.
- **Action** No physical action — a beat of mutual awareness.
- **Text** A single **wavy-outlined balloon** containing the residual
  text *"How about…"* — its tail visibly **rerouted from Bursun's hood to
  Yaharia's mouth corner**. The balloon outline is wavy/squiggled to read
  as telepathic, distinct from the cloud-thought style of panels 3, 5, 6.
  **Caption** *floor: 24*.
- **Beat** `⤞ telepathy` — the reveal. Retroactively re-reads every
  balloon in panels 3, 5, 6 as Yaharia's telepathic broadcast, not
  Bursun's thoughts.

**Render prompt**

> Extreme close-up comic-book insert panel showing two hooded prisoners'
> faces tightly framed side-by-side inside a descending industrial
> elevator. Left: a young man, hood up, the warm overhead light catching
> his slightly narrowed eyes — caught mid-realization. Right: a young
> woman, hood up, the same warm light catching her closed-mouth knowing
> smile and her eyes sliding sideways toward the man. Both wear identical
> coarse hoods, slave collars, and handcuffs; tails imply behind them. A
> glowing red LED in the deep background reads "24". **A single balloon
> floats between them with a WAVY, squiggled outline (NOT a thought cloud,
> NOT a speech bubble — a telepathic style with a rippling contour). The
> balloon contains the text: "How about…". Its tail is a curving trail of
> small dots that visibly originates from the WOMAN's (right) mouth
> corner, NOT from the man's head — this rerouting is the focal beat of
> the panel.** A small caption box in a corner reads "floor: 24".
> High-contrast inked comic-book style, heavy chiaroscuro, muted palette
> of warm reds and oranges against deep cool shadows.

---

## Invariant check (per [Panelglyph §7](../../../.topoglyph/modules/panelglyph.md))

- **Beat coverage.** All seven script beats land in exactly one panel each. ✓
- **Anchor closure.** Every named character has a vault entry
  ([Bursun](../../../character-vault/bursun/character.md),
  [Yaharia](../../../character-vault/yaharia/character.md)). ✓
- **Composition closure.** Every panel has a shot, an angle, ≥1 anchor, and
  a `↬` beat tag. ✓
- **Transition rhythm.** `▷ ▷ ▶ ⏵ ▷ ▶` — opens calmly, punches at Yaharia's
  greeting, pauses for her self-correction, punches into the reveal. ✓
- **Page boundary intent.** `⫯page-1` ends on `⤞ telepathy`, leading directly
  into [page 2's](../page-2/script.md) `"Bursun!!"` — Yaharia using the name
  she's just chosen, in his head. ✓

## Open items for ⦿ᴬ before render

1. **Style anchor** is a placeholder. Decide the issue's visual identity
   and replace the *Style anchor* line under "Page-level render constraints"
   — every prompt inherits it.
2. **Bursun/Yaharia visual anchors.** No `⌬` concept-art exists for Yaharia
   in [her vault folder](../../../character-vault/yaharia/character.md). The
   prompts describe her physically each time; results will drift across
   panels until an anchor reference image is pinned. Consider rendering
   Yaharia's anchor (a clean, hood-down portrait) *first*, before any of
   these seven, and using it as a reference image in subsequent prompts.
3. **Tail visibility.** Tails are the species marker but rarely the focal
   subject on an elevator. Tails are mentioned in the prompts but not
   foregrounded — flag if you want them more prominent.
4. **Panel-7 layout.** I describe it as a small inset bottom-of-page insert,
   but the layout artist (you) decides whether it's full-width, corner,
   nested into panel 6, etc.