import React from 'react';

/**
 * GSID StatCard — headline metric tile. Big Coolvetica number + label,
 * optional delta and trailing icon node.
 */
export function StatCard({
  value,
  label,
  delta,
  deltaTone = 'success',
  icon = null,
  style,
  ...rest
}) {
  const deltaColors = {
    success: 'var(--status-success)', danger: 'var(--status-danger)',
    warning: 'var(--amber-700)', neutral: 'var(--text-muted)',
  };
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)', ...style,
    }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: 'var(--type-overline)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        {icon && <span style={{ display: 'inline-flex', color: 'var(--brand)' }}>{icon}</span>}
      </div>
      <div style={{ font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)', color: 'var(--text-heading)', letterSpacing: 'var(--tracking-tight)' }}>{value}</div>
      {delta && (
        <span style={{ font: 'var(--type-mono-sm)', color: deltaColors[deltaTone] || deltaColors.neutral }}>{delta}</span>
      )}
    </div>
  );
}
