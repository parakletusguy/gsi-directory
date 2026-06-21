import React from 'react';

/**
 * GSID Switch — on/off toggle.
 */
export function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  id,
  style,
  ...rest
}) {
  const swId = id || React.useId();
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;

  const dims = size === 'sm' ? { w: 36, h: 20, k: 14 } : { w: 44, h: 24, k: 18 };

  const toggle = (e) => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };

  return (
    <label htmlFor={swId} style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1, ...style,
    }}>
      <input id={swId} type="checkbox" checked={on} disabled={disabled} onChange={toggle}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} {...rest} />
      <span style={{
        position: 'relative', width: dims.w, height: dims.h, flexShrink: 0,
        borderRadius: 'var(--radius-pill)',
        background: on ? 'var(--brand)' : 'var(--neutral-300)',
        transition: 'background var(--duration-base) var(--ease-standard)',
      }}>
        <span style={{
          position: 'absolute', top: (dims.h - dims.k) / 2,
          left: on ? dims.w - dims.k - (dims.h - dims.k) / 2 : (dims.h - dims.k) / 2,
          width: dims.k, height: dims.k, borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--shadow-sm)',
          transition: 'left var(--duration-base) var(--ease-out)',
        }} />
      </span>
      {label && <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-heading)', fontWeight: 'var(--weight-medium)' }}>{label}</span>}
    </label>
  );
}
