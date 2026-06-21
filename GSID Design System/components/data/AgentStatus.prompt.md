Status row for a pipeline agent (API Harvester, Ethical Scraper, Data Synthesizer). The signature GSID component.

```jsx
<AgentStatus name="API Harvester" role="OpenAlex · Zenodo" state="running"
  detail="page 14 / 60" progress={42} icon={<i data-lucide="bot" />} />
<AgentStatus name="Ethical Scraper" role="AJOL · NJOL" state="idle"
  detail="rate-limited 3s" icon={<i data-lucide="globe" />} />
<AgentStatus name="Data Synthesizer" role="Dedupe → CSV" state="done"
  detail="1,284 records" icon={<i data-lucide="file-spreadsheet" />} />
```

- **state**: `idle` · `running` (pulses) · `done` · `error`
- Pass `progress` (0–100) to show the bar; omit/`null` to hide it.
