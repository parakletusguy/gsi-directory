import React from 'react';

/**
 * GSID ProgressBar — determinate or indeterminate harvest progress.
 */
export function ProgressBar({
  value = 0,
  max = 100,
  tone = 'brand',
  size = 'md',
  indeterminate = false,
  label,
  showValue = false,
  style,
  ...rest
}) {
  const tones = {
    brand: 'var(--brand)', success: 'var(--status-success)',
    warning: 'var(--status-warning)', danger: 'var(--status-danger)', info: 'var(--status-info)',
  };
  const fill = tones[tone] || tones.brand;
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }} {...rest}>
      {(label || showValue) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          {label && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', fontWeight: 'var(--weight-medium)' }}>{label}</span>}
          {showValue && <span style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{
        position: 'relative', width: '100%', height: h, overflow: 'hidden',
        background: 'var(--surface-sunken)', borderRadius: 'var(--radius-pill)',
      }}>
        {indeterminate ? (
          <span style={{
            position: 'absolute', top: 0, left: 0, height: '100%', width: '40%',
            background: fill, borderRadius: 'var(--radius-pill)',
            animation: 'gsid-indeterminate 1.3s var(--ease-in-out) infinite',
          }}>
            <style>{'@keyframes gsid-indeterminate{0%{left:-40%}100%{left:100%}}'}</style>
          </span>
        ) : (
          <span style={{
            display: 'block', height: '100%', width: pct + '%',
            background: fill, borderRadius: 'var(--radius-pill)',
            transition: 'width var(--duration-slow) var(--ease-out)',
          }} />
        )}
      </div>
    </div>
  );
}
