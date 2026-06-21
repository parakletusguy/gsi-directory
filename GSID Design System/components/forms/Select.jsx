import React from 'react';

/**
 * GSID Select — styled native <select> with label, leading icon and chevron.
 */
export function Select({
  label,
  hint,
  error,
  options = [],
  size = 'md',
  disabled = false,
  id,
  containerStyle,
  style,
  ...rest
}) {
  const selId = id || React.useId();
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 36, md: 42, lg: 48 };
  const h = heights[size] || heights.md;
  const borderColor = error ? 'var(--status-danger)' : (focus ? 'var(--brand)' : 'var(--border-default)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && <label htmlFor={selId} style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{label}</label>}
      <div style={{
        position: 'relative', display: 'flex', alignItems: 'center',
        height: h,
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
      }}>
        <select
          id={selId}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            appearance: 'none', WebkitAppearance: 'none',
            flex: 1, height: '100%', border: 'none', outline: 'none',
            background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '0 38px 0 12px',
            font: 'var(--type-body)', color: 'var(--text-heading)',
            ...style,
          }}
          {...rest}
        >
          {options.map((o) => {
            const value = typeof o === 'string' ? o : o.value;
            const labelText = typeof o === 'string' ? o : o.label;
            return <option key={value} value={value}>{labelText}</option>;
          })}
        </select>
        <span aria-hidden="true" style={{
          position: 'absolute', right: 12, pointerEvents: 'none',
          color: 'var(--text-muted)', display: 'inline-flex',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      </div>
      {(hint || error) && (
        <span style={{ font: 'var(--type-caption)', color: error ? 'var(--status-danger)' : 'var(--text-muted)' }}>{error || hint}</span>
      )}
    </div>
  );
}
