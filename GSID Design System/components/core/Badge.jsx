import React from 'react';

/**
 * GSID Badge — compact status / count pill.
 * Tones: neutral, brand, success, warning, danger, info.
 * Styles: soft (tinted), solid, outline.
 */
export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  size = 'md',
  style,
  ...rest
}) {
  const tones = {
    neutral: { fg: 'var(--neutral-600)', bg: 'var(--neutral-100)', solid: 'var(--neutral-600)', bd: 'var(--border-default)' },
    brand:   { fg: 'var(--green-700)', bg: 'var(--green-50)', solid: 'var(--brand)', bd: 'var(--green-300)' },
    success: { fg: 'var(--green-700)', bg: 'var(--status-success-subtle)', solid: 'var(--status-success)', bd: 'var(--green-300)' },
    warning: { fg: 'var(--amber-700)', bg: 'var(--status-warning-subtle)', solid: 'var(--status-warning)', bd: 'var(--amber-500)' },
    danger:  { fg: 'var(--brick-700)', bg: 'var(--status-danger-subtle)', solid: 'var(--status-danger)', bd: 'var(--brick-500)' },
    info:    { fg: 'var(--azure-700)', bg: 'var(--status-info-subtle)', solid: 'var(--status-info)', bd: 'var(--azure-500)' },
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)';

  const styles = variant === 'solid'
    ? { background: t.solid, color: '#fff', border: '1px solid transparent' }
    : variant === 'outline'
    ? { background: 'transparent', color: t.fg, border: `1px solid ${t.bd}` }
    : { background: t.bg, color: t.fg, border: '1px solid transparent' };

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: pad,
        font: `var(--weight-semibold) ${fs}/1 var(--font-body)`,
        letterSpacing: '0.01em',
        borderRadius: 'var(--radius-pill)',
        whiteSpace: 'nowrap',
        ...styles, ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: variant === 'solid' ? '#fff' : t.solid,
        }} />
      )}
      {children}
    </span>
  );
}
