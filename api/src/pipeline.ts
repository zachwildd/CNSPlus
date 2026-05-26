/*
Pipeline stages

If I were drawing the assembly line:

1. **Outline expansion** — outline bullets → scene list (location, cast, time, beats).
2. **Scripting** — scene list → panel-by-panel script. The "Marvel script" format works well: prose description per panel + dialogue list.
3. **Continuity resolution** — for each panel, look up current character/world state and bind it into the panel spec.
4. **Layout/thumbnailing** — panel script → page layouts (panel sizes, positions).
5. **Panel art generation** — fully-resolved panel spec → image. This is where character refs, pose refs, location refs, and style bible all converge.
6. **Lettering** — dialogue + captions + SFX → composited onto panel.
7. **Page assembly** — panels + lettering + gutters → page.
8. **State writeback** — record changes (Micha is now wounded, the bunker is now destroyed) to the continuity DB.
9. **Continuity QA** — automated checks: outfits consistent? speaker tails pointing at correct characters? locations matching prior renders?

The crucial property: stages 1–4 are all structured text/JSON. 
You don't cross into pixels until step 5, which is the expensive, 
hardest-to-revise stage. Pushing image generation as late as 
possible lets you iterate cheaply on script and layout.
*/

// What is the input?
// (a): a markdown outline with acts, chapters, 
const outline = ``
// (b): 

// Can we convert the outline into a script?
// (a): full script - dc style, the writer specifies everything: page number, 
// panel number, panel description (setting, blocking, camera angle, lighting, 
// expressions), then dialogue and sound effects underneath. This is the closest 
// equivalent to a director's script, because the writer is essentially "directing" 
// the artist panel by panel. The author writes the story AND the panel descriptions 
// for the artist, giving more control over how panels are laid out.

// How does the outline get expanded into a scene list? Prompt the LLM to identify scenes, their locations, casts, times, and beats. Output structured JSON.
