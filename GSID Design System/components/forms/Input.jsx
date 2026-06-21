import React from 'react';

/**
 * GSID Input — text field with optional label, leading icon, hint and error.
 */
export function Input({
  label,
  hint,
  error,
  iconLeft = null,
  size = 'md',
  type = 'text',
  disabled = false,
  id,
  style,
  containerStyle,
  ...rest
}) {
  const inputId = id || React.useId();
  const [focus, setFocus] = React.useState(false);
  const heights = { sm: 36, md: 42, lg: 48 };
  const h = heights[size] || heights.md;
  const borderColor = error ? 'var(--status-danger)' : (focus ? 'var(--brand)' : 'var(--border-default)');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        height: h, padding: '0 12px',
        background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: focus ? 'var(--focus-ring)' : 'none',
        transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)',
      }}>
        {iconLeft && <span style={{ display: 'inline-flex', color: 'var(--text-muted)' }}>{iconLeft}</span>}
        <input
          id={inputId}
          type={type}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
            font: 'var(--type-body)', color: 'var(--text-heading)',
            ...style,
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ font: 'var(--type-caption)', color: error ? 'var(--status-danger)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
