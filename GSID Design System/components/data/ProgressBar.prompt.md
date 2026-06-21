Progress bar for harvest / scrape runs.

```jsx
<ProgressBar value={68} label="OpenAlex — Nigeria" showValue />
<ProgressBar indeterminate tone="info" label="Connecting to DOAJ…" />
<ProgressBar value={100} tone="success" />
```

- **tone**: `brand` · `success` · `warning` · `danger` · `info`
- `indeterminate` for unknown duration; `showValue` prints the percentage in mono.
