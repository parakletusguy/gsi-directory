Text field with label, hint, error, and optional leading icon.

```jsx
<Input label="Search researchers" iconLeft={<i data-lucide="search" />} placeholder="Name, institution or email" />
<Input label="Target region" hint="One region per field" defaultValue="Nigeria" />
<Input label="Email" error="Enter a valid address" defaultValue="bad@" />
```

- **size**: `sm` · `md` · `lg`
- `error` overrides `hint` and colours the border brick.
