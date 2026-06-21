---
name: gsid-design
description: Use this skill to generate well-branded interfaces and assets for the Global South Index Directory (GSID), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Quick map:
- `styles.css` — the single global stylesheet to link (imports all tokens + fonts).
- `tokens/` — colors, typography, spacing/radius/shadow/motion, fonts.
- `components/` — React primitives (core, forms, data); see each `*.prompt.md` for usage.
- `ui_kits/console/` — the GSID operator console recreation.
- `guidelines/` — foundation specimen cards.
- `assets/logos/` — GSI logo lockups (green / white / ink / mark-only / raster).

Brand in one line: earnest, structured, and green — academic confidence for making
Global South research visible. Brand green `#298937`, ink `#0B160D`, Coolvetica display +
Inter body + JetBrains Mono for data. Sentence case, no emoji, ethics-forward copy.
