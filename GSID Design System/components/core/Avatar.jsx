import React from 'react';

/**
 * GSID Avatar — researcher / user identity chip.
 * Shows an image if provided, else initials on a deterministic green-tinted background.
 */
export function Avatar({
  name = '',
  src = null,
  size = 'md',
  square = false,
  style,
  ...rest
}) {
  const sizes = { xs: 24, sm: 32, md: 40, lg: 56 };
  const dim = sizes[size] || sizes.md;
  const fontSize = Math.round(dim * 0.38);

  const initials = name
    .split(/\s+/).filter(Boolean).slice(0, 2)
    .map((w) => w[0].toUpperCase()).join('') || '?';

  // deterministic tint from the green family
  const bgs = ['var(--green-100)', 'var(--green-200)', 'var(--neutral-250)', 'var(--green-50)'];
  const fgs = ['var(--green-800)', 'var(--green-900)', 'var(--green-800)', 'var(--green-700)'];
  let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % bgs.length;

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: dim, height: dim, flexShrink: 0,
        borderRadius: square ? 'var(--radius-md)' : '50%',
        overflow: 'hidden',
        background: src ? 'var(--neutral-100)' : bgs[h],
        color: fgs[h],
        font: `var(--weight-semibold) ${fontSize}px/1 var(--font-body)`,
        border: '1px solid var(--border-subtle)',
        ...style,
      }}
      {...rest}
    >
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials}
    </span>
  );
}
