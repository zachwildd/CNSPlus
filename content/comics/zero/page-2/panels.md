# Page 2 — Panels

Built from [`script.md`](script.md) per
[Panelglyph](../../../.topoglyph/modules/panelglyph.md) (TopoGlyph 10.0).
Renderer: **Nano Banana Pro** (handles in-panel text, so dialogue is part of
each render prompt — no separate lettering pass).

---

## Page Glyph

```
⫯page-2 = ⫷ ▭₁◲ ▷ ▭₂◳ ▷ ▭₃◲∅ ⏵ ▭₄◲ ⇲ ▭₅◰ ▷ ▭₆◲ ▶ ▭₇◳ ⫸
          ↫ comic/zero/page-2/script.md
          ↬ renders/panel-1.jpg … renders/panel-7.jpg
          ⨹ ⦿ᴬ Sheldon  ⦿ᴬⁱ Claude  ⦿ᴿ nano-banana-pro
```

**Beat-to-panel mapping**

| Script beat | Panel |
|---|---|
| `■ᵇ¹` Yaharia delivers the chosen name: *"Bursun!!"* | ▭₁ |
| `■ᵇ²` Yaharia: *"how about it, sound good?"* | ▭₂ |
| `■ᵇ³` Bursun says nothing | ▭₃ |
| `■ᵇ⁴` Yaharia: *"Hmm, I'll take that as a yes"* | ▭₄ |
| `■ᵇ⁵` Elevator reaches the lowest level — doors open | ▭₅ |
| `■ᵇ⁶` Yaharia: *"well, looks like it's our turn"* — calm | ▭₆ |
| `■ᵇ⁷` Other cybervators beg as guards force them in | ▭₇ |

---

## Page-level render constraints

Page 2 inherits the issue's working style anchor, costume, lighting, tail,
and floor-indicator conventions from
[page 1's *Page-level render constraints*](../page-1/panels.md). Hoist these
to an issue-level anchor once they're finalized; until then, the page-1 file
is the local source of truth for those. Page-2-specific overrides and
additions follow.

- **Balloon device — telepathy is now established.** Page 1's reveal
  ([panel 7](../page-1/panels.md)) landed the trick. From this page forward
  **every Yaharia balloon** is **telepathic**: a **wavy / squiggled outline**
  (not a thought-cloud, not a speech bubble), with the **bubble-dot tail
  visibly originating from Yaharia's mouth corner**. Her mouth itself stays
  **closed** in every panel — the wavy balloon is the only signal she is
  "speaking". This consistency is what makes the page-1 reveal pay off; any
  speech-styled balloon attributed to Yaharia would undo it.
- **Other prisoners (panel 7) use normal speech balloons** — smooth oval
  outline, pointed tail to an open mouth. The visual contrast between
  Yaharia's wavy telepathic broadcast and the others' shouted speech is
  itself a story beat: she is not like them, and the balloons say so.
- **Descent compression.** Floors 23 → 20 land in panels 1–4 (continuing
  page 1's one-floor-per-panel cadence). The `⇲` transition between ▭₄ and
  ▭₅ compresses the remaining descent into the gutter; ▭₅'s LED reads
  **00** (lowest level). Panels 5–7 all read **00**. *Open: confirm with
  ⦿ᴬ whether the lowest-level indicator should read `"00"`, `"B"`, `"—"`,
  or another glyph.*
- **The chamber beyond — tease, don't reveal.** ▭₅ onward: when the
  elevator doors part they reveal the linking facility that
  [page 3](../page-3/script.md) inhabits. Treat what is visible through the
  doorway as a *teaser* — cold industrial light, the suggestion of
  restraint cradles, shadowed scientist silhouettes — and keep the chamber
  itself in page 3's scope. Page 2's punch is the **threshold**, not the
  room.
- **Guards — first appearance.** Panel 7 is the first scripted appearance
  of the guard caste. Their visual identity is not yet vault-locked. Working
  guess (overridable by ⦿ᴬ): heavy black tactical armor, helmets with
  reflective visors that obscure the face, electrified prod or baton, no
  visible tail (i.e. *not* drawn from the same tailed underclass as the
  prisoners). See *Open items* below.
- **Yaharia's mouth stays closed.** Page 1 ▭₃ had her mouth open mid-greeting
  as part of the bait. Now that the reveal has landed, her face on page 2 is
  closed-mouth throughout — pleased / amused / composed micro-expressions,
  but no open-mouth speech postures. Mouth opening at any point would be a
  story event (e.g. *actual* speech), so reserve it.
- **Script-spelling note.** The script's final line tag reads
  `**Yahaira:**` — a typo. Per the
  [vault](../../../character-vault/yaharia/character.md), canonical spelling
  is **Yaharia**. Letter every balloon as **Yaharia** if a name appears;
  otherwise no impact at lettering time.

---

## Panel 1 — Yaharia delivers the name

**Glyph**

```
▭₁ = ⦗ ◲  ⟦◯⟧ᶜ
       ⌖ᵖelevator-interior  ⌗ᵗfloor-23  ⌗ᵐcelebratory-within-dread  ⌗ˡwarm-overhead-pool
       { ◉yaharia:bright-eyed-closed-mouth-delivery, ◎bursun:implied-at-frame-edge }
       ⟪~ Bursun!! ~⟫
       ⌜floor: 23⌟
       ↬naming ⦘ ▷ ▭₂
```

- **Shot** Close-up on Yaharia, slight three-quarter; Bursun implied off-panel
  to one side (a sliver of hooded shoulder may bleed in at frame edge).
- **Setting** Same elevator car as page 1; LED on the wall reads **23**.
- **Subjects**
  - **Yaharia** ([vault](../../../character-vault/yaharia/character.md)) —
    hood up; the single warm overhead light catches her bright wide eyes and
    a small pleased closed-mouth smile. Her face has the affect of someone
    who has *just landed* on the perfect answer.
  - **Bursun** (off-panel `◎`) — implied by the hooded shoulder edge.
- **Action** Yaharia broadcasts the chosen name — the payoff of
  [page 1 ▭₆–₇](../page-1/panels.md)'s *"How about…?"* hook.
- **Text** **Telepathic balloon** (wavy/squiggled outline) floating between
  her and the off-panel figure; **bubble-dot tail visibly leaves her mouth
  corner**. Balloon reads: *"Bursun!!"* (oversized / emphatic lettering —
  this is the christening). **Caption** *floor: 23*.
- **Beat** `↬ naming` — the name lands. Page-1's hook resolves into a single,
  declarative payoff.

**Render prompt**

> Close-up comic-book panel of a young hooded woman inside a descending
> industrial elevator. A single warm overhead light catches her bright
> wide eyes and a small pleased closed-mouth smile through the hood — the
> rest of her face stays in the hood's deep shadow. She wears a heavy iron
> slave collar at her neck and the suggestion of a coarse hooded uniform.
> A glowing red LED on the wall behind her reads "23". The sliver of
> another hooded shoulder bleeds in at the left frame edge — an off-panel
> figure she is addressing. **A single telepathic-style balloon (WAVY,
> squiggled outline — NOT a thought cloud, NOT a speech bubble) floats in
> front of her; a curving trail of small bubble-dots visibly originates
> from the corner of HER closed mouth and traces up into the balloon.**
> The balloon contains oversized emphatic lettering: "Bursun!!". A small
> caption box in a corner reads "floor: 23". High-contrast inked
> comic-book style, heavy chiaroscuro from a single warm overhead light,
> muted palette of warm reds and oranges against deep cool shadows,
> industrial sci-fi aesthetic, detailed line work.

---

## Panel 2 — *"sound good?"*

**Glyph**

```
▭₂ = ⦗ ◳  ⟦◯⟧ᴹ
       ⌖ᵖelevator-interior  ⌗ᵗfloor-22  ⌗ᵐeager-asking
       { ◉yaharia:eager-leaning-closed-mouth, ◉bursun:impassive-eyes-forward }
       ⟪~ how about it, sound good? ~⟫
       ⌜floor: 22⌟
       ↬seek-confirmation ⦘ ▷ ▭₃
```

- **Shot** Medium, both characters in frame, slight three-quarter on Yaharia.
- **Setting** Same elevator; LED visible reads **22**.
- **Subjects**
  - **Yaharia** — hood up; closed-mouth half-smile; eyes turned to Bursun;
    leaning very slightly toward him in handcuffed expectancy.
  - **Bursun** ([vault](../../../character-vault/bursun/character.md)) —
    beside her, hood up, lit face impassive; eyes level and forward, not
    turning to her. The same composure as page 1 ▭₂.
- **Action** Yaharia waits for a reaction; Bursun gives none.
- **Text** **Telepathic balloon** (wavy outline) above them; tail visibly
  leaves **Yaharia's** mouth corner. Balloon reads: *"how about it, sound
  good?"*  **Caption** *floor: 22*.
- **Beat** `↬ seek-confirmation` — she asks for buy-in, knowing she may not
  get it. Sets the floor for ▭₃'s silence.

**Render prompt**

> Medium eye-level comic-book panel of two hooded prisoners standing close
> together inside a descending industrial elevator. The woman on the right
> wears a closed-mouth half-smile, eyes turned eagerly toward the man on
> her left; she leans very slightly in handcuffed expectancy. The man on
> the left stays impassive — eyes level and forward, not turning to her.
> Both wear identical coarse hoods, heavy iron slave collars, and
> handcuffs; tails imply behind them. A single warm overhead light pools
> on their faces *through* the hoods, catching their eyes and the woman's
> mouth corner. A glowing red LED on the wall behind them reads "22".
> **A telepathic-style balloon (WAVY, squiggled outline — NOT a thought
> cloud, NOT a speech bubble) floats above them; a trail of small
> bubble-dots visibly originates from the WOMAN's closed mouth and traces
> up to the balloon.** The balloon contains the text: "how about it,
> sound good?". A small caption box in a corner reads "floor: 22".
> High-contrast inked comic-book style, heavy chiaroscuro, muted palette
> of warm reds and oranges against deep cool shadows.

---

## Panel 3 — Bursun, again, says nothing

**Glyph**

```
▭₃ = ⦗ ◲∅ ⟦◯⟧ᶜ
       ⌖ᵖelevator-interior  ⌗ᵗfloor-21
       { ◉bursun:eyes-level-no-acknowledgement }
       ⌜floor: 21⌟
       ↬silence-deepens ⦘ ⏵ ▭₄
```

- **Shot** Tight close-up on Bursun; silent panel (`◲∅`).
- **Setting** Same elevator; LED visible reads **21**.
- **Subjects**
  - **Bursun** — hooded face fills the frame. Warm light catches only his
    eyes (and the line of his nose). His eyes are **level and forward** —
    unlike page-1 ▭₄ he does not even glance sideways. The acknowledgement
    he gave once is now withheld entirely.
- **Action** Stillness. The escalation from page-1 ▭₄ is that this time
  he does not even look.
- **Text** **None.** No balloon. **Caption** *floor: 21*.
- **Beat** `↬ silence-deepens` — the foil sharpens. His silence is no longer
  a glance-and-disengage; it is a flat refusal of the transaction.

**Render prompt**

> Tight close-up comic-book panel of a hooded young man's face inside a
> dark industrial elevator. The coarse hood is pulled up; only his eyes
> and the bridge of his nose catch a single warm overhead light — the
> rest of his face stays in the hood's deep shadow. His eyes are level
> and forward, not turning at all, gaze unbroken — a refusal that is not
> a reaction. A heavy iron slave collar is visible at the bottom edge of
> the frame. Behind him, slightly out of focus, a glowing red LED reads
> "21". A small caption box in a corner reads "floor: 21". **No speech,
> thought, or telepathic balloons anywhere in this panel — it is
> entirely silent.** High-contrast inked comic-book style, heavy
> chiaroscuro, muted palette of warm reds and oranges against deep cool
> shadows.

---

## Panel 4 — Yaharia takes it as a yes

**Glyph**

```
▭₄ = ⦗ ◲  ⟦◯⟧ᶜ
       ⌖ᵖelevator-interior  ⌗ᵗfloor-20  ⌗ᵐamused-undeterred
       { ◉yaharia:closed-mouth-knowing-smile, ◎bursun:off-panel }
       ⟪~ Hmm, I'll take that as a yes ~⟫
       ⌜floor: 20⌟
       ↬reads-silence-as-consent ⦘ ⇲ ▭₅
```

- **Shot** Close-up on Yaharia; Bursun off-panel.
- **Setting** Same elevator; LED visible reads **20**.
- **Subjects**
  - **Yaharia** — hood up; closed-mouth knowing smile (the same smile she
    landed in page-1 ▭₇'s reveal — *caught and unbothered*). One eyebrow
    a hair raised. She is amused; she is not deterred.
  - **Bursun** (off-panel `◎`) — implied by the empty side of frame.
- **Action** Beat of self-amusement — she is fully prepared to narrate his
  silence into agreement.
- **Text** **Telepathic balloon** (wavy outline) above her; tail visibly
  leaves **Yaharia's** mouth corner. Balloon reads: *"Hmm, I'll take that
  as a yes"*. **Caption** *floor: 20*.
- **Beat** `↬ reads-silence-as-consent` — she converts his refusal into
  participation by fiat. A quiet preview of the
  [vault contradiction](../../../character-vault/yaharia/character.md)
  `♅ narrates-her-own-erasure`: she narrates **everything**, including the
  things that do not consent to be narrated.

**Render prompt**

> Close-up comic-book panel of a young hooded woman inside a descending
> industrial elevator. A single warm overhead light catches her eyes and
> a small closed-mouth knowing smile through the hood; one eyebrow is a
> hair raised — amused, unbothered. Her hood is up; the rest of her face
> stays in the hood's deep shadow. She wears a heavy iron slave collar.
> A glowing red LED on the wall behind her reads "20". **A telepathic-style
> balloon (WAVY, squiggled outline — NOT a thought cloud, NOT a speech
> bubble) floats above her; a trail of small bubble-dots visibly
> originates from the corner of HER closed mouth and traces up to the
> balloon.** The balloon contains the text: "Hmm, I'll take that as a
> yes". A small caption box in a corner reads "floor: 20". High-contrast
> inked comic-book style, heavy chiaroscuro, muted palette of warm reds
> and oranges against deep cool shadows.

---

## Panel 5 — Lowest level, doors open

**Glyph**

```
▭₅ = ⦗ ◰  ⟦◯⟧ᴸ
       ⌖ᵖelevator-doorway  ⌗ᵗfloor-00  ⌗ᵐarrival-dread  ⌗ˡcold-from-without
       { ◉bursun:silhouette-back-of-hood, ◉yaharia:silhouette-back-of-hood,
         ◎crowd:hooded-silhouettes-arrayed }
       ⊟ᶠˣ<KSSHK> (door-mechanism)
       ⌜floor: 00⌟
       ↬threshold ⦘ ▷ ▭₆
```

- **Shot** Wide, slightly low angle, **from inside the elevator looking
  out** through the parting doors. The composition is back-of-heads
  foreground, doorway middle, *something beyond* in the bright cold light.
- **Setting** The elevator doors are mid-parting. Outside: a cold
  blue-white industrial light — the opposite temperature to the elevator's
  warm pool. Visible through the gap: a corridor floor, the suggestion of
  restraint cradles or linking equipment in the depth of field, one or
  two shadowed scientist silhouettes too small to read clearly. **Keep the
  chamber proper for [page 3](../page-3/script.md).**
- **Subjects**
  - **Bursun and Yaharia** — back-of-hood silhouettes at the center of the
    composition. Their hoods catch a thin rim of cold light from the
    doorway; their bodies are dark against the bright opening. The reader
    sees what they see.
  - **The other prisoners** — hooded silhouettes arrayed behind / around
    them, also facing the doorway.
- **Action** The doors part. Light from outside displaces the elevator's
  warmth. A long descent ends.
- **Text** **No dialogue.** **SFX** door mechanism: *"KSSHK"* or similar
  heavy-mechanical (small lettering, low in the frame).
  **Caption** *floor: 00*.
- **Beat** `↬ threshold` — arrival. The temperature flip (warm → cold) and
  the back-of-heads framing both put the reader **at the threshold with
  the prisoners**, not observing them.

**Render prompt**

> Wide low-angle comic-book panel **shot from inside an industrial
> elevator looking out** through doors that are mid-parting. In the
> foreground, back-of-head silhouettes of about a dozen hooded prisoners
> in identical coarse uniforms — slave collars at the neck, handcuffs at
> the wrists, tails trailing behind — face the parting doors. The
> elevator interior is lit by a single warm overhead pool; through the
> parting doors **cold blue-white industrial light** floods in, opposite
> in temperature to the warm interior. Through the gap, in the depth of
> field, suggest a long corridor / chamber: vague restraint cradles,
> one or two shadowed scientist silhouettes too far to read. **Do not
> reveal the chamber in detail — keep it a tease at the edge of the
> light.** Two of the foreground hooded silhouettes (a man and a woman,
> standing close together at the visual center) catch a thin rim of cold
> light along their hoods. A heavy-mechanical sound-effect "KSSHK" in
> small lettering low in the frame. A small caption box in a corner
> reads "floor: 00". High-contrast inked comic-book style, heavy
> chiaroscuro, sharp contrast between the warm interior pool and the
> cold exterior light, industrial sci-fi aesthetic, detailed line work.

---

## Panel 6 — *"looks like it's our turn"*

**Glyph**

```
▭₆ = ⦗ ◲  ⟦◯⟧ᶜ ↪ᵒᵗˢ
       ⌖ᵖelevator-doorway  ⌗ᵗfloor-00  ⌗ᵐcomposed-against-arrival  ⌗ˡcold-backlight
       { ◉yaharia:closed-mouth-soft-smile-backlit, ◉bursun:beside-her-impassive }
       ⟪~ well, looks like it's our turn ~⟫
       ⌜floor: 00⌟
       ↬yaharia-narrates-her-own-erasure ⦘ ▶ ▭₇
```

- **Shot** Close, three-quarter on Yaharia from the side; Bursun beside her
  in frame at the shoulder. Light comes from **behind** them now (the open
  doorway) rim-lighting their hoods and faces from the wrong direction —
  signalling *they are inside the doorway, looking out*.
- **Setting** Threshold of the elevator; the cold light from the chamber
  beyond rims them. Floor LED visible somewhere in the background reads
  **00**.
- **Subjects**
  - **Yaharia** — hood up; closed-mouth soft smile (small, almost
    private). Eyes turned ahead toward what is coming, not down or away.
    The composure of someone arriving somewhere she has decided to be the
    protagonist of.
  - **Bursun** — beside her, hood up, lit face impassive; eyes forward.
    They are aligned — both calm — but in opposite registers (his
    impassive, hers amused).
- **Action** Static. The smallest possible reaction to the doors having
  opened.
- **Text** **Telepathic balloon** (wavy outline) above them; tail visibly
  leaves **Yaharia's** mouth corner; balloon points subtly toward Bursun
  (she is including him in *our*). Balloon reads: *"well, looks like it's
  our turn"*. **Caption** *floor: 00*.
- **Beat** `↬ yaharia-narrates-her-own-erasure` — the panel-level expression
  of her [vault contradiction](../../../character-vault/yaharia/character.md):
  *"the system reads her as expendable; she reads herself as the lead."*
  This panel is the contradiction made visible.

**Render prompt**

> Close three-quarter comic-book panel of two hooded prisoners standing
> at the open threshold of an industrial elevator, viewed from slightly
> behind and to the side. **Cold blue-white light from the open chamber
> beyond rim-lights their hoods and faces from the front**, while the
> warm interior pool fades behind them — they are inside the doorway,
> looking out. The woman on the right wears a closed-mouth soft small
> smile and looks forward, calm. The man beside her is impassive,
> eyes forward, the same calm in a different key. Both wear coarse
> hoods up, heavy iron slave collars, handcuffs; tails trail behind.
> Somewhere in the background a glowing red LED reads "00". **A
> telepathic-style balloon (WAVY, squiggled outline — NOT a thought
> cloud, NOT a speech bubble) floats above them; a trail of small
> bubble-dots visibly originates from the WOMAN's closed mouth corner
> and traces up to the balloon, with the balloon body subtly inclined
> toward the man (she is including him).** The balloon contains the
> text: "well, looks like it's our turn". A small caption box in a
> corner reads "floor: 00". High-contrast inked comic-book style,
> heavy chiaroscuro, muted palette warmed interior against cold
> exterior light.

---

## Panel 7 — Forced entry (page button)

**Glyph**

```
▭₇ = ⦗ ◳  ⟦◯⟧ᴹ ↥
       ⌖ᵖchamber-threshold  ⌗ᵗfloor-00  ⌗ᵐchaos-vs-composure  ⌗ˡcold-overhead
       { ◉bursun:stepping-forward-on-own, ◉yaharia:stepping-forward-on-own,
         ◎guards:multiple-armored-shoving, ◎other-prisoners:multiple-resisting }
       ⟪Please don't make me go!⟫  ⟪No — no!⟫  ⟪Please!⟫
       ⊟ᶠˣ<scuffle-grunts>
       ⌜floor: 00⌟
       ↬forced-entry  ⫶bursun ⫶yaharia ⨼<linking-system> ⦘ ⫯ → page-3
```

- **Shot** Medium-wide, slightly high angle looking down across the
  threshold from inside the chamber edge. The composition cuts the frame
  diagonally between **chaos on one side** and **composure on the other**.
- **Setting** Just outside the elevator at the lowest level. Cold overhead
  industrial light; steel-plate floor; the chamber proper continues out of
  frame (deferred to [page 3](../page-3/script.md)).
- **Subjects**
  - **The other prisoners** — three or four of the hooded cybervators
    being **physically forced** out of the elevator by guards. Mouths open,
    faces twisted, handcuffed hands grabbing at the doorframe or thrown up
    in begging gestures. Some have been pulled into stumbles; one is
    being dragged.
  - **The guards** — heavy armored figures with mirrored / reflective
    visored helmets, in dark tactical gear; no visible tails (distinct
    caste from the prisoners). Hands on prisoners, prods raised. Working
    visual — overridable by ⦿ᴬ; see *Open items*.
  - **Yaharia and Bursun** — mid-ground or middle band of the composition,
    **walking forward on their own** between the guards. No one is
    touching them. Hoods up; the same composure as ▭₆. Their stillness
    inside the chaos is the entire point of the staging.
- **Action** The prisoners are forced; the two are not. The page hinges on
  this single visible asymmetry.
- **Text**
  - **Speech balloons** (standard smooth oval, pointed tails to open
    mouths) from the resisting prisoners: *"Please don't make me go!"* /
    *"No — no!"* / *"Please!"*  (Exact lines flexible — keep the cluster
    of begging short and overlapping. Lettering can stagger them for
    rhythm.)
  - **SFX** scuffle grunts in small ragged lettering near the guards'
    hands on prisoners.
  - **No Yaharia balloon** — her ▭₆ line is already on the page; ▭₇'s
    silence from her is what makes the contrast land.
  - **Caption** *floor: 00*.
- **Beat** `↬ forced-entry` — the page button. The reader leaves page 2
  having seen that **everyone else is being dragged into the chamber, and
  Yaharia and Bursun are walking themselves in.** The relational edge
  `⨼<linking-system>` is made visible at the guard layer, and the
  `⫶ bursun ⫶ yaharia` foil is shown reading the *same* event in two
  different (but aligned) registers.
- **Page boundary** `⫯ → page-3` — the threshold is crossed in the gutter
  between page 2 and page 3. [Page 3](../page-3/script.md) opens inside
  the linking chamber.

**Render prompt**

> Medium-wide slightly high-angle comic-book panel looking across the
> threshold from inside a cold industrial chamber back toward the open
> elevator doorway at the lowest level. Cold blue-white overhead light;
> steel-plate floor; the chamber itself continues out of frame. **On
> the left side of the composition (chaos):** three or four hooded
> prisoners in coarse uniforms, slave collars and handcuffs, are being
> physically forced out of the elevator by heavy armored guards. The
> guards wear dark tactical armor and helmets with reflective mirrored
> visors that obscure the face; they have no visible tails. Guards have
> hands on the prisoners, prods raised. The prisoners' mouths are open,
> faces twisted in panic; one has handcuffed hands thrown up in begging,
> another is being dragged in a stumble. **On the right / center of the
> composition (composure):** two hooded prisoners — a man and a woman,
> the same pair from earlier panels — walk forward on their own between
> the guards. No one is touching them. Both wear identical hoods up,
> slave collars, handcuffs; tails trail behind. Their faces inside the
> hoods are calm: he impassive, she with a small closed-mouth smile.
> **The visual asymmetry — chaos around them, composure through them —
> is the focal subject of the panel.** **Standard speech balloons
> (smooth oval outlines, pointed tails to open mouths) NOT telepathic
> style** rise from the begging prisoners: "Please don't make me go!",
> "No — no!", "Please!". Small ragged scuffle-sound lettering near the
> guards' hands. A small caption box in a corner reads "floor: 00".
> High-contrast inked comic-book style, heavy chiaroscuro, cold palette
> for the chamber side, industrial sci-fi aesthetic, detailed line work.

---

## Invariant check (per [Panelglyph §7](../../../.topoglyph/modules/panelglyph.md))

- **Beat coverage.** All seven script beats land in exactly one panel
  each (`■ᵇ¹`→▭₁, `■ᵇ²`→▭₂, `■ᵇ³`→▭₃, `■ᵇ⁴`→▭₄, `■ᵇ⁵`→▭₅, `■ᵇ⁶`→▭₆,
  `■ᵇ⁷`→▭₇). ✓
- **Anchor closure.** Every named character has a vault entry
  ([Bursun](../../../character-vault/bursun/character.md),
  [Yaharia](../../../character-vault/yaharia/character.md)). The
  **guards** are admitted as an ad-hoc role-anchor on this page (not yet
  vaulted); rationale recorded under *Page-level render constraints*
  and *Open items*. ✓ (conditional)
- **Composition closure.** Every panel has a shot, an angle, ≥1 anchor,
  and a `↬` beat tag. ✓
- **Transition rhythm.** `▷ ▷ ⏵ ⇲ ▷ ▶` — opens with two flowing beats
  for the naming pair, pauses on Bursun's silence, breaks across the
  descent to arrival, flows into Yaharia's composure, punches into the
  forced-entry button. ✓
- **Page boundary intent.** `⫯ → page-3` lands on `↬ forced-entry`. The
  threshold is crossed in the gutter; page 3 opens inside the linking
  chamber. ✓
- **Vault binding.**
  - `◉yaharia` ▭₆ is a direct projection of her `♅ narrates-her-own-erasure`
    contradiction — the strongest single-panel charge on the page.
  - `◉bursun` ▭₃ exercises his `☥silent-immune-vessel` essence — the
    silence is not absence, it is the character.
  - `◉bursun` + `◉yaharia` ▭₇ together exercise the `⫶ foil` edge by
    showing two different registers of *the same composure*.

---

## Open items for ⦿ᴬ before render

1. **"Lowest level" indicator.** Panels 5–7 set the LED to **"00"**.
   Confirm: is the lowest level rendered as `"00"`, `"B"`, `"—"`, a
   custom glyph, or extinguished entirely (no number)? Affects all three
   bottom-floor panel prompts.
2. **Guards — first scripted appearance.** The working visual is *heavy
   black tactical armor, reflective visored helmets, electrified prod,
   no tail (distinct caste from the prisoners).* Confirm or override; if
   the guards should be tailed (i.e. enforcers drawn from the same
   underclass), the prompt for ▭₇ needs to flip and a relational edge
   from the cast network may follow.
3. **The chamber-beyond teaser.** Panels 5 and 7 give glimpses of the
   linking chamber. Confirm what is visible in the doorway gap of ▭₅:
   restraint cradles? linking pods? scientists? Or do we want a flat
   cold corridor with nothing readable, holding the full reveal for
   page 3?
4. **Yaharia visual anchor.** Still no `⌬` concept art in the
   [vault](../../../character-vault/yaharia/character.md). The prompts
   describe her physically each panel; results will drift across panels
   until an anchor reference image is pinned. Consider rendering her
   anchor first and using it as a reference image in subsequent prompts
   (same recommendation carried over from
   [page 1 *Open items*](../page-1/panels.md)).
5. **Style anchor.** Same placeholder concern as page 1 — decide the
   issue's visual identity and hoist a stable style descriptor to an
   issue-level anchor so every page-2 prompt inherits identically.
6. **Begging-prisoner lines (▭₇).** I wrote three short cries
   (*"Please don't make me go!" / "No — no!" / "Please!"*). The script
   gives only the gist; confirm the exact lines (and whether they
   should be one prisoner repeating, or several different voices).
7. **▭₁ — name emphasis.** *"Bursun!!"* should letter as oversized /
   emphatic inside the telepathic balloon — confirm the lettering
   register for telepathic emphasis. (Are wavy balloons letterable in
   bold? Italicized? Larger point size? This sets a convention for
   future emphatic telepathy.)
