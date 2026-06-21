import React from 'react';

/**
 * GSID IconButton — square icon-only control for toolbars and table rows.
 * Pass a Lucide <i data-lucide="…"/> (or any node) as children.
 */
export function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  label,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const sizes = { sm: 30, md: 38, lg: 44 };
  const dim = sizes[size] || sizes.md;

  const palettes = {
    ghost: { background: 'transparent', color: 'var(--text-muted)', border: '1px solid transparent', h: 'var(--surface-sunken)', hc: 'var(--text-heading)' },
    solid: { background: 'var(--brand)', color: '#fff', border: '1px solid transparent', h: 'var(--brand-hover)', hc: '#fff' },
    outline: { background: 'var(--surface-card)', color: 'var(--text-heading)', border: '1px solid var(--border-default)', h: 'var(--surface-sunken)', hc: 'var(--text-heading)' },
  };
  const p = palettes[variant] || palettes.ghost;
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dim, height: dim,
        background: disabled ? 'transparent' : (hover ? p.h : p.background),
        color: disabled ? 'var(--text-faint)' : (hover ? p.hc : p.color),
        border: p.border,
        borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
