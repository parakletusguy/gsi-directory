import React from 'react';

/**
 * GSID SourceChip — a data source pill (OpenAlex, DOAJ, AJOL…) with its
 * access type (api / scrape) and health dot.
 */
export function SourceChip({
  name,
  type = 'api',      // api | scrape
  health = 'online', // online | degraded | offline
  count,
  onClick,
  style,
  ...rest
}) {
  const typeMeta = {
    api:    { label: 'API', color: 'var(--status-info)', bg: 'var(--status-info-subtle)' },
    scrape: { label: 'SCRAPE', color: 'var(--amber-700)', bg: 'var(--status-warning-subtle)' },
  };
  const healthMeta = {
    online:   'var(--status-success)',
    degraded: 'var(--status-warning)',
    offline:  'var(--status-danger)',
  };
  const t = typeMeta[type] || typeMeta.api;
  const interactive = !!onClick;
  const [hover, setHover] = React.useState(false);

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 12px',
        background: hover && interactive ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-xs)',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'background var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: healthMeta[health] || healthMeta.online, flexShrink: 0 }} />
      <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{name}</span>
      <span style={{
        font: 'var(--weight-bold) var(--text-2xs)/1 var(--font-mono)',
        color: t.color, background: t.bg, padding: '2px 6px',
        borderRadius: 'var(--radius-xs)', letterSpacing: '0.04em',
      }}>{t.label}</span>
      {count != null && (
        <span style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>{count}</span>
      )}
    </span>
  );
}
