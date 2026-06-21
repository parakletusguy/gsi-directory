import React from 'react';

/**
 * GSID Button — primary action control.
 * Variants: primary (brand green), secondary (outline), ghost, danger.
 * Sizes: sm, md, lg. Supports leading/trailing icon nodes and loading state.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: '0 14px', height: 34, font: 'var(--text-sm)', gap: 6, radius: 'var(--radius-sm)' },
    md: { padding: '0 18px', height: 42, font: 'var(--text-base)', gap: 8, radius: 'var(--radius-md)' },
    lg: { padding: '0 24px', height: 50, font: 'var(--text-md)', gap: 10, radius: 'var(--radius-md)' },
  };
  const s = sizes[size] || sizes.md;

  const palettes = {
    primary: {
      background: 'var(--brand)', color: 'var(--text-on-brand)', border: '1px solid transparent',
      '--h-bg': 'var(--brand-hover)', '--a-bg': 'var(--brand-active)', shadow: 'var(--shadow-xs)',
    },
    secondary: {
      background: 'var(--surface-card)', color: 'var(--text-heading)', border: '1px solid var(--border-default)',
      '--h-bg': 'var(--surface-sunken)', '--a-bg': 'var(--neutral-100)', shadow: 'var(--shadow-xs)',
    },
    ghost: {
      background: 'transparent', color: 'var(--brand)', border: '1px solid transparent',
      '--h-bg': 'var(--brand-subtle)', '--a-bg': 'var(--green-100)', shadow: 'none',
    },
    danger: {
      background: 'var(--status-danger)', color: '#fff', border: '1px solid transparent',
      '--h-bg': 'var(--brick-700)', '--a-bg': 'var(--brick-700)', shadow: 'var(--shadow-xs)',
    },
  };
  const p = palettes[variant] || palettes.primary;

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const isDisabled = disabled || loading;

  const bg = isDisabled ? null : (active ? p['--a-bg'] : (hover ? p['--h-bg'] : p.background));

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        font: `var(--weight-semibold) ${s.font}/1 var(--font-body)`,
        letterSpacing: 'var(--tracking-snug)',
        color: p.color,
        background: bg || p.background,
        border: p.border,
        borderRadius: s.radius,
        boxShadow: p.shadow,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.5 : 1,
        transform: active && !isDisabled ? 'translateY(1px)' : 'none',
        transition: 'background var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-standard)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner /> : iconLeft}
      {children}
      {!loading && iconRight}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 15, height: 15, borderRadius: '50%',
        border: '2px solid currentColor', borderTopColor: 'transparent',
        display: 'inline-block', animation: 'gsid-spin 0.7s linear infinite',
      }}
    >
      <style>{'@keyframes gsid-spin{to{transform:rotate(360deg)}}'}</style>
    </span>
  );
}
