import React from 'react';

/**
 * GSID Checkbox — controlled or uncontrolled checkbox with label.
 */
export function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  description,
  id,
  style,
  ...rest
}) {
  const cbId = id || React.useId();
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isChecked = isControlled ? checked : internal;

  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };

  return (
    <label htmlFor={cbId} style={{
      display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, ...style,
    }}>
      <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, marginTop: description ? 1 : 0 }}>
        <input id={cbId} type="checkbox" checked={isChecked} disabled={disabled} onChange={toggle}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
        <span style={{
          width: 19, height: 19, borderRadius: 'var(--radius-xs)',
          border: `1.5px solid ${isChecked ? 'var(--brand)' : 'var(--border-strong)'}`,
          background: isChecked ? 'var(--brand)' : 'var(--surface-card)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)',
        }}>
          {isChecked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          )}
        </span>
      </span>
      {label && (
        <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-heading)', fontWeight: 'var(--weight-medium)' }}>{label}</span>
          {description && <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{description}</span>}
        </span>
      )}
    </label>
  );
}
