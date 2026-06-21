Styled native `<select>` with label, chevron and error state.

```jsx
<Select label="Discipline" options={['All disciplines', 'Public health', 'Agronomy', 'Climate science']} />
<Select label="Source type" options={[{value:'api',label:'Open API'},{value:'scrape',label:'Open-access journal'}]} />
```

- **size**: `sm` · `md` · `lg`
- Pass `options` as strings or `{value,label}`.
