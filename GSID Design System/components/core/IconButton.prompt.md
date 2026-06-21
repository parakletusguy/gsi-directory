Square icon-only control for toolbars, table rows, and close affordances. Always pass `label` for accessibility.

```jsx
<IconButton label="Filter" ><i data-lucide="filter" /></IconButton>
<IconButton variant="solid" label="Download"><i data-lucide="download" /></IconButton>
<IconButton variant="outline" size="sm" label="More"><i data-lucide="ellipsis" /></IconButton>
```

- **variant**: `ghost` (default, muted) · `solid` (brand) · `outline`
- **size**: `sm` 30 · `md` 38 · `lg` 44
