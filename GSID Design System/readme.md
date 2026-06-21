# Global South Index Directory (GSID) — Design System

> A green, sturdy, scholarly design language for the Global South Index family of
> products. This system is an **extension of the Global South Index (GSI)** brand and
> inherits its logo, colour palette, and typography.

---

## 1. What this is / product context

**Global South Index (GSI)** is a platform built to give African and Global-South
researchers the global visibility they deserve — an alternative to expensive,
Western-focused indexes (Scopus, Web of Science) built on a fair, permanent,
community-owned model.

**Global South Index Directory (GSID)** is the data product within that family. It is a
**multi-agent data-extraction system** that builds a comprehensive, accessible database
of researchers across Africa, Asia, and Latin America. It prioritises **open scholarly
APIs** (OpenAlex, DOAJ, Zenodo) and **ethically scrapes** open-access platforms (AJOL,
NJOL) — deliberately bypassing hostile "walled gardens" to sustainably harvest names,
affiliations, and contact emails. The output is a clean, deduplicated CSV of researcher
contacts that powers indexing, collaboration networks, and conference outreach.

The system is organised as cooperating agents:
- **Agent 1 — API Harvester** (OpenAlex / Zenodo / DOAJ; pagination + JSON parsing)
- **Agent 2 — Ethical Scraper** (AJOL / NJOL; rate-limited, respects robots.txt)
- **Agent 3 — Data Synthesizer** (standardise → dedupe by email → export CSV)

The primary operator is a **non-technical project manager**. Data consumers are research
institutions, open-access indexers, grant providers, and conference organisers.

### Source materials provided
- `uploads/GSI Branding.pdf` — official GSI brand guidelines (logo system, colour, type, mockups)
- `uploads/Global South Index Directory PRD.pdf` — GSID product requirements (v1.1)
- `uploads/GSI Logo.svg`, `GSI Logo png.png`, `GSI White bg.jpg` — logo lockups

> No codebase or Figma file was provided. The UI kit in this system is a brand-faithful
> *design proposal* for the GSID operator console, derived from the PRD's described flow
> (regions/disciplines in → agents run → deduplicated CSV out). It is not a recreation of
> an existing build. Treat it as the canonical visual target; confirm against real product
> code when it exists.

---

## 2. Content fundamentals — how GSID writes

**Voice.** Mission-driven, plain-spoken, and credible. GSI exists to correct a structural
inequity ("give … researchers the global visibility they deserve"), so copy is purposeful
and a little proud — never corporate-bland, never hype. It reads like a serious open-access
non-profit, not a startup.

- **Person.** Address the operator as **you** ("Choose the regions you want to harvest").
  Speak about the system in plain third person ("The API Harvester queries OpenAlex").
- **Casing.** **Sentence case** for almost everything — headings, buttons, labels, menu
  items. Reserve the all-caps **overline/eyebrow** style (tracked, small, green) for
  section kickers only. Never Title Case full sentences.
- **Tone register.** Confident and concrete. Prefer real nouns and counts ("1,284
  profiles", "3-second delay", "<5% bounce rate") over adjectives. The product is about
  data integrity, so the copy signals precision.
- **Ethics is a feature, say so.** "Ethical scraping", "respects robots.txt", "publicly
  available contact information" — surface the responsible-data posture in UI copy; it is
  part of the brand promise, not fine print.
- **Numbers & identifiers** are first-class. Counts, regions, source names (OpenAlex,
  AJOL), and export filenames (`gsid_export_2026-06-11.csv`) appear in **mono**.
- **Emoji:** none. This is an academic / civic-tech product. Use icons, not emoji.
- **Geography with respect.** Name regions and countries precisely (Africa, Asia, Latin
  America; Nigeria, Brazil, India). Avoid "developing world" / "third world" framing — the
  whole point of "Global South" is to reject that hierarchy.

**Examples**
- Button: `Run harvest` · `Add region` · `Export CSV` · `Pause scraper`
- Eyebrow: `MULTI-AGENT PIPELINE`
- Empty state: `No sources selected yet. Pick at least one open API or journal to begin.`
- Status line: `Agent 2 · Ethical Scraper — rate-limited, 3s between requests`
- Microcopy: `Only publicly listed correspondence emails are collected.`

---

## 3. Visual foundations

The look is **earnest, structured, and green** — academic confidence without stuffiness.
Think of a well-made field guide or a public-interest data dashboard.

**Colour.** Brand green `#298937` leads; it carries primary actions, active states, and
brand moments. A full green ramp (`--green-50 … --green-950`) gives depth — deep
`--green-700` (the logomark green) for pressed/strong states, light `--green-50` for
subtle brand fills. Neutrals are warm-cool greys tuned to the brand sage `#D4DED5` and
grey `#D5D6D6`; ink is `#0B160D`. Semantic accents are **muted and academic** — amber
`#B5860C` (warning / in-progress), brick `#B23A2E` (failed source / danger), azure
`#2D6A8E` (info / API source). Never neon, never bluish-purple gradients.

**Typography.** Two voices plus a data voice:
- **Coolvetica** (display) — tight, characterful 70s-display sans. Used **only large**:
  hero numbers, page/section titles, the logotype feel. Never for body or small UI.
- **Inter** (body/UI) — everything readable: paragraphs, labels, controls, tables.
- **JetBrains Mono** (data) — counts, region/source identifiers, export filenames, code.

Display headings ride tight leading (`--leading-tight 1.04`) and slightly negative
tracking. Body is 16px / 1.5. Eyebrows are 11px semibold, uppercase, `0.12em` tracked, in
brand green.

**Backgrounds.** Mostly flat: page is a barely-warm off-white `--neutral-50`; cards are
pure white. No photographic hero washes by default, no busy textures. The one signature
flourish is the **logomark's radar/pie geometry** used sparingly as a large, low-contrast
watermark or as a tonal green block behind hero content. Brand blocks are solid
`--green-500` (or the deep `--green-900` ink for inverse sections) — **flat colour, not
gradients.** If a gradient is ever used it is a subtle single-hue green tonal shift, never
multi-hue.

**Borders & cards.** Cards are white, `--radius-md (10px)` to `--radius-lg (14px)`, a
single `1px --border-subtle` hairline, and a **low, green-tinted shadow** (`--shadow-sm`
at rest, `--shadow-md` on hover/raise). No coloured left-border accent cards. No glass.
Dividers are 1px hairlines.

**Shadows.** Soft and low-spread, tinted with the ink (`rgba(11,22,13,…)`) so they read
green-neutral, never blue. Elevation ladder: `xs → sm → md → lg → xl`. A dedicated
`--shadow-brand` (green glow) is reserved for the primary CTA when it needs lift.

**Radii.** Controls and cards use 10px; pills/tags/avatars use `--radius-pill`. Inputs
match buttons at 10px. Nothing fully sharp, nothing bubble-round.

**Motion.** Calm and quick. Default `--duration-base 200ms` with `--ease-standard`.
Entrances fade + 4–8px rise (`--ease-out`). No bounce, no spring, no infinite loops on
content. Respect `prefers-reduced-motion`.

**Hover / press.**
- *Hover:* brand surfaces darken one step (`--brand → --brand-hover`); neutral surfaces
  pick up `--surface-sunken` or a hairline darkening + raise to `--shadow-md`.
- *Press:* darken a second step (`--brand-active`) and/or `translateY(1px)`; no scale-down
  on large surfaces.
- *Focus:* 3px soft green focus ring (`--focus-ring`), never a hard blue outline.

**Transparency & blur.** Used rarely — only for the modal scrim (`ink @ ~45%`) and
sticky-header hairline separation. No frosted-glass panels.

**Layout.** 8pt spacing system. Generous gutters, a 264px app sidebar, 60px top bar,
max content widths capped (`--container-lg 1080px`). Content is left-aligned and
grid-driven; centre only for hero / empty states.

---

## 4. Iconography

GSI's own brand assets ship **no icon set** — only the logo system. To keep a single,
consistent, brand-appropriate icon voice, GSID standardises on **[Lucide](https://lucide.dev)**
(MIT) loaded from CDN:

- **Style:** outline, **1.75–2px** stroke, rounded caps/joins, 24px grid. This matches the
  friendly-but-serious feel of the brand and the rounded terminals of the logomark.
- **Colour:** icons inherit `currentColor`. Use `--text-muted` for inert UI icons,
  `--brand` for active/selected, status colours for status icons.
- **Load:**
  ```html
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <i data-lucide="search"></i>
  <script>lucide.createIcons();</script>
  ```
  Common GSID glyphs: `search`, `database`, `globe`, `bot`, `download`, `filter`,
  `map-pin`, `mail`, `book-marked`, `play`, `pause`, `check`, `circle-alert`,
  `loader-circle`, `file-spreadsheet`.
- **Emoji:** never. **Unicode** symbols only where typographically standard (·, →, ×).

> Substitution flagged: Lucide is a substitute, not a brand-owned set (the brand provided
> none). Swap if GSI later standardises an in-house icon library. The **logomark** itself
> (radar pie + bookmark) is the one true brand glyph — use it for app/favicon, never redraw.

---

## 5. Index / manifest

**Root**
- `styles.css` — global entry point (＠import list only). Consumers link this.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter for use in Claude Code.

**Tokens** (`tokens/`, all reachable from `styles.css`)
- `fonts.css` — `@font-face`/CDN imports + family stacks (display / body / mono)
- `colors.css` — green ramp, neutral ramp, semantic accents, semantic aliases
- `typography.css` — size / weight / leading / tracking scale + semantic roles
- `spacing.css` — spacing, radius, border, shadow, motion, layout, z-index
- `base.css` — light element reset wired to tokens

**Foundations** (`guidelines/` — `@dsCard` specimen cards)
- Colour, type, spacing, radius, shadow, and brand cards for the Design System tab.

**Components** (`components/` — React primitives, namespace `GSIDDesignSystem_019e0b`)
- `core/` — Button, IconButton, Badge, Tag, Input, Select, Checkbox, Switch, Avatar,
  Card, ProgressBar, StatCard, AgentStatus, SourceChip … (see each `*.prompt.md`)

**UI kits** (`ui_kits/`)
- `console/` — GSID operator console: dashboard, harvest builder, results directory,
  source detail. Brand-faithful proposal derived from the PRD.

**Assets** (`assets/`)
- `logos/` — GSI logo lockups (original green, white, ink, normalised green, raster).

---

*Coolvetica is loaded via the cdnfonts CDN rather than self-hosted binaries — see caveats.*
