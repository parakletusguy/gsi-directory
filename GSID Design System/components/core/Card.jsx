import React from 'react';

/**
 * GSID Card — white surface container with hairline border + soft shadow.
 * Optional hover-raise for interactive cards.
 */
export function Card({
  children,
  padding = 'md',
  interactive = false,
  raised = false,
  style,
  onClick,
  ...rest
}) {
  const pads = { none: 0, sm: 'var(--space-4)', md: 'var(--space-5)', lg: 'var(--space-6)' };
  const [hover, setHover] = React.useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        background: 'var(--surface-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: hover ? 'var(--shadow-md)' : (raised ? 'var(--shadow-md)' : 'var(--shadow-sm)'),
        padding: pads[padding] ?? pads.md,
        cursor: interactive ? 'pointer' : 'default',
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Optional card header row: title + optional eyebrow + trailing slot. */
export function CardHeader({ title, eyebrow, trailing, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', ...style }}>
      <div>
        {eyebrow && (
          <div style={{ font: 'var(--type-overline)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--brand)', marginBottom: 4 }}>{eyebrow}</div>
        )}
        {title && <div style={{ font: 'var(--type-h4)', color: 'var(--text-heading)' }}>{title}</div>}
      </div>
      {trailing && <div style={{ flexShrink: 0 }}>{trailing}</div>}
    </div>
  );
}
