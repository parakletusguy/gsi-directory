White surface container — the default panel for everything. Pair with `CardHeader` for titled sections.

```jsx
<Card>
  <CardHeader eyebrow="Multi-agent pipeline" title="Run summary" trailing={<Badge tone="success" dot>Complete</Badge>} />
  …
</Card>

<Card interactive onClick={open}>…</Card>
```

- **padding**: `none` · `sm` · `md` (default) · `lg`
- **interactive** raises on hover; **raised** starts at md elevation.
- Never add a coloured left-border accent — not in this brand.
