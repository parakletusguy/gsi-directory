Primary action control for GSID — use for the main action on a view (Run harvest, Export CSV); one primary per region of the screen.

```jsx
<Button variant="primary" iconLeft={<i data-lucide="play" />}>Run harvest</Button>
<Button variant="secondary">Add region</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="danger" iconLeft={<i data-lucide="octagon-x" />}>Stop scraper</Button>
<Button loading>Harvesting…</Button>
```

- **variant**: `primary` (brand green) · `secondary` (white outline) · `ghost` (green text) · `danger` (brick)
- **size**: `sm` · `md` · `lg`
- Pass Lucide `<i data-lucide>` nodes to `iconLeft` / `iconRight`; call `lucide.createIcons()` after mount.
- `loading` swaps the leading icon for a spinner and disables the button.
- Sentence case labels, verb-first ("Run harvest", not "Harvest Runner").
