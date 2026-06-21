# GSID Operator Console — UI kit

A brand-faithful recreation of the GSID multi-agent operator console. Built entirely from
this design system's component primitives (`window.GSIDDesignSystem_019e0b`).

> **Note:** No production codebase or Figma was provided. This kit is a *design proposal*
> derived from the PRD's described flow (regions/disciplines in → three agents run →
> deduplicated CSV out). Treat it as the canonical visual target, not a 1:1 recreation.

## Screens (`index.html` switches between them)
- **Dashboard** (`Dashboard.jsx`) — KPIs, live pipeline (the three agents), recent runs.
- **New harvest** (`Harvest.jsx`) — region picker, source selection, run summary rail.
- **Directory** (`Directory.jsx`) — searchable/filterable researcher results table + export.
- **Sources** (`Sources.jsx`) — source-health cards for each API / scraped platform.

`Shell.jsx` is the app frame (dark sidebar + topbar). `data.js` holds the fake sample data.

## Run
Open `index.html`. The top-bar / sidebar **New harvest** buttons jump to the builder;
launching returns to the dashboard. Lucide icons are loaded from CDN.

## Components used
Button, IconButton, Badge, Card/CardHeader, Avatar, Input, Select, Checkbox, Switch,
ProgressBar, StatCard, AgentStatus, SourceChip.
