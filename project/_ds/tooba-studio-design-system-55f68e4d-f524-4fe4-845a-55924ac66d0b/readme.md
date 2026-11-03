# Tooba Studio — Design System

Tooba (طوبة, "brick") is a Cairo brand studio that builds strategic, bilingual brand identities **in days, not months**. Tagline: **Every brand starts with a brick.** Four promises: Speed (strategy brief within 48 hours, three creative routes), Strategic depth, Premium craft (every mark redrawn as clean vector), Clear pricing (fixed-price packages, dated quotes). "AI is our engine, not our product."

There is no software product yet. This system covers the brand identity and its first applications (social post, story, business card), plus a UI component set authored from the guidelines for the studio's future website, proposals and client tools.

## Sources
- `uploads/Tooba_Brand_Guidelines_v1.pdf` — Brand Guidelines, Edition 01, October 2026 (28 pp: Story, Logo, Color, Typography, Iconography, Pattern & graphics, In use).
- `uploads/Tooba_Brand_Editable_Files/` — outlined logo SVGs, 16 icons (Nile + Oat), 240px pattern tile, Fraunces + Outfit TTFs, README.
- No codebase, Figma, website or slide template was provided.

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `assets.css` (asset classes `.tb-logo-*`, `.tb-icon-*`, `.tb-pattern` — url()s resolve against the stylesheet, so they work at any page depth).
- `fonts/` — Fraunces Regular; Outfit Light/Regular/Medium (OFL).
- `assets/logo/` — 16 logo files: horizontal / tagline / stacked lockups (Nile, Oat-on-Nile, Oat transparent), mark (Nile, Oat-on-Nile, Oat transparent, one-color Nile, white, small-size), wordmark.
- `assets/icons/` — 16 core icons × Nile/Oat. `assets/pattern/Pattern_Tile_240.svg`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand, Iconography).
- `components/` — React primitives (below), one card per directory.
- `ui_kits/brand_applications/` — Instagram post, story, business card from guidelines p.27.
- `SKILL.md` — Agent Skill entry. `thumbnail.html` — project tile.

## Components
- **brand/** — `Logo`, `Icon` (+`ICON_NAMES`), `Eyebrow`, `Dots`, `PatternSurface`
- **actions/** — `Button`, `IconButton`
- **forms/** — `Input` (incl. multiline), `Select`, `Checkbox`, `Radio` (+`RadioGroup`), `Switch`
- **display/** — `Card`, `Badge`, `Tag`, `Tabs`
- **feedback/** — `Dialog`, `Toast`, `Tooltip`

The guidelines define no UI components, so this is a standard set sized to the brand. Brand-derived choices: apricot dot pair as the checked/selected/active marker and select chevron; 8px "soft brick" radius on all containers; spaced Outfit Medium capitals for buttons, labels, tabs.

**Intentional additions:** `Dots` (the brand's single accent gesture, reused everywhere), `PatternSurface` (the official tile, correctly configured), `Eyebrow` (the +24% label style), `Logo`/`Icon` (wrappers over the supplied SVGs so nobody redraws them).

---

## CONTENT FUNDAMENTALS
**Voice: Warm · Sharp · Grounded · Quick.**
- Warm — welcoming, human; never cold or corporate.
- Sharp — clear opinions in plain words. "We recommend, then explain."
- Grounded — strategy and evidence, not trends.
- Quick — short sentences, fast replies, visible progress.

**We say / not:**
- "Here's what we recommend, and why." — not "We leverage synergies to elevate your brand."
- "Your strategy brief lands within 48 hours." — not "We'll get back to you soon."
- "This name works in Arabic and in English." — not "A globally minded naming solution."

**Mechanics**
- "We" for the studio, "you/your" for the client. Concrete numbers and dates over adjectives ("48 hours", "nine days", "three distinct creative routes").
- Headlines in **sentence case**, ending with a full stop when they're a statement ("Every brand starts with a brick.", "A beach house brand, built in nine days.").
- Eyebrows/labels in spaced capitals with a middle dot: "CASE STUDY · HOSPITALITY", "01 · STORY". Section numbering is two-digit (01, 02 …; "01 / 06").
- Brick/building metaphor used deliberately but sparingly ("A name you can build on", "laid one considered piece at a time").
- No emoji. No exclamation-mark hype. No jargon ("leverage", "elevate", "synergy").
- **Language:** logo is English only. Content is bilingual by default; Arabic is *written, not translated* — Egyptian colloquial for social and messaging, Modern Standard Arabic for proposals and contracts.

## VISUAL FOUNDATIONS
- **Colour.** Four colours from "the river and the kiln": Nile Green `#123F3B` (primary ground, ~50%), Oat `#F1E7D6` (secondary ground, ~28%), Apricot `#F08A5D` (the dots — accents, buttons, highlights only, ~14%), Papyrus `#A9BFA3` (supergraphics, quiet panels, ~8%). Apricot never carries body text (2.0:1 on Oat); apricot buttons take Nile labels. White is allowed as a paper ground. Tone-on-tone work uses one step lighter than the ground (`--nile-step`, `--nile-step-2`).
- **Type.** Fraunces Regular only — the voice (headlines 32–48pt / 1.1, subheads 18–24pt / 1.25, pull quotes, wordmark). Never italic, never bold. Fraunces caps +14% reserved for the wordmark. Outfit — the work: Light for large intros, Regular for body (1.5 leading, 60–75ch measure, left-aligned, never justified), Medium caps +24% for labels, buttons, taglines.
- **Backgrounds.** Flat solid Nile or Oat grounds. Texture comes from the **tile pattern** (mark repeated edge to edge, lines one step lighter, dots apricot; on Nile, or Oat with Papyrus lines) and the **supergraphic** (the t + dots enlarged ≥4× the mark, cropped by at least one edge, Papyrus on Oat or lighter Nile on Nile). No gradients. No photography specified beyond "reversed logo on photography".
- **Pattern rules.** Covers, packaging, stickers, story backgrounds, website footer. Never behind body text; never with the full lockup on top.
- **Corners.** 8px on every container — "the soft brick cell". 4px for tiny elements (badges, checkboxes, tooltips). Brick cell in the mark: 16-unit corners on an 88-unit cell.
- **Lines.** Constant weight, round ends. Icons 2.5px; UI borders 1.5px; the lockup divider is a 1px hairline.
- **Dots.** Always solid, always apricot when colour allows; in one-colour work they take the line colour, never a third colour. One pair per icon — "nothing else is apricot".
- **Cards.** Flat solid ground (Oat on white, white-with-hairline on Oat, Nile, Papyrus), 8px radius, no shadow, no coloured side-borders.
- **Shadows.** The brand is flat. A single soft Nile-tinted overlay shadow (`--shadow-overlay`) is an addition for dialogs/toasts only.
- **Transparency/blur.** Not used in the brand. Only a Nile 55% scrim behind dialogs; muted text uses Oat/Nile at 72%.
- **Motion.** Not specified in the guidelines (a "Motion" icon exists as a service). Defaults: short fades/slides, 120–200ms, `cubic-bezier(.2,.7,.2,1)`; no bounce.
- **Hover / press.** Hover darkens apricot slightly (`--apricot-press`) or steps Nile one tone lighter; outline/ghost get a 6–8% tint. Press nudges 1px down. Interactive cards lift 2px and gain a Nile line.
- **Layout.** Generous margins, left-aligned type, numbered sections, hairline dividers. Logo clear space = one brick cell on every side. Minimums: lockup 140px / 35mm, mark 48px / 12mm; below 48px use the small-size (heavy stroke) mark.
- **Logo don'ts.** Don't stretch, rotate, recolour the dots, fill the cells, remove/rearrange cells, or place on busy backgrounds.

## ICONOGRAPHY
- A proprietary set of **16 core icons**, supplied as SVG in Nile and Oat (`assets/icons/`): Strategy, Naming, Identity, Typography, Color, Brand book, Packaging, Social, Motion, Web, Photography, Rebrand, Speed, Chat, Location, Proposal.
- Six rules, all drawn from the mark: 48×48 canvas, 4px safe margin, 40px live area · 2.5px stroke, round ends and joins, outlines only · 8px radius on containers · exactly one apricot dot pair per icon · free line-ends may finish in the t's foot curve · Nile lines on light, Oat on dark, dots always apricot.
- Scale only in whole steps: 48, 32, 24, 16px. Use via `<Icon name="chat" size={24} />`.
- No icon font, no third-party icon library, no emoji, no unicode glyph icons (the only exceptions in this kit are `×` for dismiss and `✕` on "don't" examples). If a needed icon doesn't exist, ask for one drawn to the six rules — don't substitute Lucide etc.

## Fonts
Fraunces Regular and Outfit Light/Regular/Medium are bundled from the supplied files. **No Arabic typeface was supplied**; Arabic falls back to the system (Noto Naskh Arabic if installed) via `--font-arabic`.
