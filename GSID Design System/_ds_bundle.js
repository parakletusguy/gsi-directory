/* @ds-bundle: {"format":3,"namespace":"GSIDDesignSystem_019e0b","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"AgentStatus","sourcePath":"components/data/AgentStatus.jsx"},{"name":"ProgressBar","sourcePath":"components/data/ProgressBar.jsx"},{"name":"SourceChip","sourcePath":"components/data/SourceChip.jsx"},{"name":"StatCard","sourcePath":"components/data/StatCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"8434f4e8a0fd","components/core/Badge.jsx":"210d75c95faf","components/core/Button.jsx":"6b403bb632e4","components/core/Card.jsx":"8963de8be394","components/core/IconButton.jsx":"ba11c7017a54","components/data/AgentStatus.jsx":"13dc6995340e","components/data/ProgressBar.jsx":"cbb4ae4fb522","components/data/SourceChip.jsx":"726b5757eb7e","components/data/StatCard.jsx":"e16fba329024","components/forms/Checkbox.jsx":"3a0b67141bf4","components/forms/Input.jsx":"c043d55c3523","components/forms/Select.jsx":"1b0673a9b53b","components/forms/Switch.jsx":"4663f1b5d32c","ui_kits/console/Dashboard.jsx":"b410270b4321","ui_kits/console/Directory.jsx":"4d856cd49f63","ui_kits/console/Harvest.jsx":"e29677a730c7","ui_kits/console/Shell.jsx":"92bbed5ed7da","ui_kits/console/Sources.jsx":"46480b8116a0","ui_kits/console/data.js":"14d869cea218"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GSIDDesignSystem_019e0b = window.GSIDDesignSystem_019e0b || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Avatar — researcher / user identity chip.
 * Shows an image if provided, else initials on a deterministic green-tinted background.
 */
function Avatar({
  name = '',
  src = null,
  size = 'md',
  square = false,
  style,
  ...rest
}) {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56
  };
  const dim = sizes[size] || sizes.md;
  const fontSize = Math.round(dim * 0.38);
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';

  // deterministic tint from the green family
  const bgs = ['var(--green-100)', 'var(--green-200)', 'var(--neutral-250)', 'var(--green-50)'];
  const fgs = ['var(--green-800)', 'var(--green-900)', 'var(--green-800)', 'var(--green-700)'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % bgs.length;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      flexShrink: 0,
      borderRadius: square ? 'var(--radius-md)' : '50%',
      overflow: 'hidden',
      background: src ? 'var(--neutral-100)' : bgs[h],
      color: fgs[h],
      font: `var(--weight-semibold) ${fontSize}px/1 var(--font-body)`,
      border: '1px solid var(--border-subtle)',
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Badge — compact status / count pill.
 * Tones: neutral, brand, success, warning, danger, info.
 * Styles: soft (tinted), solid, outline.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  size = 'md',
  style,
  ...rest
}) {
  const tones = {
    neutral: {
      fg: 'var(--neutral-600)',
      bg: 'var(--neutral-100)',
      solid: 'var(--neutral-600)',
      bd: 'var(--border-default)'
    },
    brand: {
      fg: 'var(--green-700)',
      bg: 'var(--green-50)',
      solid: 'var(--brand)',
      bd: 'var(--green-300)'
    },
    success: {
      fg: 'var(--green-700)',
      bg: 'var(--status-success-subtle)',
      solid: 'var(--status-success)',
      bd: 'var(--green-300)'
    },
    warning: {
      fg: 'var(--amber-700)',
      bg: 'var(--status-warning-subtle)',
      solid: 'var(--status-warning)',
      bd: 'var(--amber-500)'
    },
    danger: {
      fg: 'var(--brick-700)',
      bg: 'var(--status-danger-subtle)',
      solid: 'var(--status-danger)',
      bd: 'var(--brick-500)'
    },
    info: {
      fg: 'var(--azure-700)',
      bg: 'var(--status-info-subtle)',
      solid: 'var(--status-info)',
      bd: 'var(--azure-500)'
    }
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'sm' ? '2px 8px' : '3px 10px';
  const fs = size === 'sm' ? 'var(--text-2xs)' : 'var(--text-xs)';
  const styles = variant === 'solid' ? {
    background: t.solid,
    color: '#fff',
    border: '1px solid transparent'
  } : variant === 'outline' ? {
    background: 'transparent',
    color: t.fg,
    border: `1px solid ${t.bd}`
  } : {
    background: t.bg,
    color: t.fg,
    border: '1px solid transparent'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      font: `var(--weight-semibold) ${fs}/1 var(--font-body)`,
      letterSpacing: '0.01em',
      borderRadius: 'var(--radius-pill)',
      whiteSpace: 'nowrap',
      ...styles,
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: variant === 'solid' ? '#fff' : t.solid
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Button — primary action control.
 * Variants: primary (brand green), secondary (outline), ghost, danger.
 * Sizes: sm, md, lg. Supports leading/trailing icon nodes and loading state.
 */
function Button({
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
    sm: {
      padding: '0 14px',
      height: 34,
      font: 'var(--text-sm)',
      gap: 6,
      radius: 'var(--radius-sm)'
    },
    md: {
      padding: '0 18px',
      height: 42,
      font: 'var(--text-base)',
      gap: 8,
      radius: 'var(--radius-md)'
    },
    lg: {
      padding: '0 24px',
      height: 50,
      font: 'var(--text-md)',
      gap: 10,
      radius: 'var(--radius-md)'
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      background: 'var(--brand)',
      color: 'var(--text-on-brand)',
      border: '1px solid transparent',
      '--h-bg': 'var(--brand-hover)',
      '--a-bg': 'var(--brand-active)',
      shadow: 'var(--shadow-xs)'
    },
    secondary: {
      background: 'var(--surface-card)',
      color: 'var(--text-heading)',
      border: '1px solid var(--border-default)',
      '--h-bg': 'var(--surface-sunken)',
      '--a-bg': 'var(--neutral-100)',
      shadow: 'var(--shadow-xs)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--brand)',
      border: '1px solid transparent',
      '--h-bg': 'var(--brand-subtle)',
      '--a-bg': 'var(--green-100)',
      shadow: 'none'
    },
    danger: {
      background: 'var(--status-danger)',
      color: '#fff',
      border: '1px solid transparent',
      '--h-bg': 'var(--brick-700)',
      '--a-bg': 'var(--brick-700)',
      shadow: 'var(--shadow-xs)'
    }
  };
  const p = palettes[variant] || palettes.primary;
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const isDisabled = disabled || loading;
  const bg = isDisabled ? null : active ? p['--a-bg'] : hover ? p['--h-bg'] : p.background;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: isDisabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    style: {
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
      ...style
    }
  }, rest), loading ? /*#__PURE__*/React.createElement(Spinner, null) : iconLeft, children, !loading && iconRight);
}
function Spinner() {
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 15,
      height: 15,
      borderRadius: '50%',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      display: 'inline-block',
      animation: 'gsid-spin 0.7s linear infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes gsid-spin{to{transform:rotate(360deg)}}'));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Card — white surface container with hairline border + soft shadow.
 * Optional hover-raise for interactive cards.
 */
function Card({
  children,
  padding = 'md',
  interactive = false,
  raised = false,
  style,
  onClick,
  ...rest
}) {
  const pads = {
    none: 0,
    sm: 'var(--space-4)',
    md: 'var(--space-5)',
    lg: 'var(--space-6)'
  };
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: hover ? 'var(--shadow-md)' : raised ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      padding: pads[padding] ?? pads.md,
      cursor: interactive ? 'pointer' : 'default',
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'box-shadow var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}

/** Optional card header row: title + optional eyebrow + trailing slot. */
function CardHeader({
  title,
  eyebrow,
  trailing,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-4)',
      marginBottom: 'var(--space-4)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--brand)',
      marginBottom: 4
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h4)',
      color: 'var(--text-heading)'
    }
  }, title)), trailing && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, trailing));
}
Object.assign(__ds_scope, { Card, CardHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID IconButton — square icon-only control for toolbars and table rows.
 * Pass a Lucide <i data-lucide="…"/> (or any node) as children.
 */
function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  label,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: 30,
    md: 38,
    lg: 44
  };
  const dim = sizes[size] || sizes.md;
  const palettes = {
    ghost: {
      background: 'transparent',
      color: 'var(--text-muted)',
      border: '1px solid transparent',
      h: 'var(--surface-sunken)',
      hc: 'var(--text-heading)'
    },
    solid: {
      background: 'var(--brand)',
      color: '#fff',
      border: '1px solid transparent',
      h: 'var(--brand-hover)',
      hc: '#fff'
    },
    outline: {
      background: 'var(--surface-card)',
      color: 'var(--text-heading)',
      border: '1px solid var(--border-default)',
      h: 'var(--surface-sunken)',
      hc: 'var(--text-heading)'
    }
  };
  const p = palettes[variant] || palettes.ghost;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      background: disabled ? 'transparent' : hover ? p.h : p.background,
      color: disabled ? 'var(--text-faint)' : hover ? p.hc : p.color,
      border: p.border,
      borderRadius: 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      transition: 'background var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/data/AgentStatus.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID AgentStatus — a row representing one pipeline agent (Harvester,
 * Scraper, Synthesizer) with live state, description and optional progress.
 */
function AgentStatus({
  name,
  role,
  state = 'idle',
  // idle | running | done | error
  icon = null,
  detail,
  progress = null,
  // 0..100 or null
  style,
  ...rest
}) {
  const states = {
    idle: {
      tone: 'var(--text-muted)',
      bg: 'var(--surface-sunken)',
      ring: 'var(--border-default)',
      label: 'Idle'
    },
    running: {
      tone: 'var(--status-info)',
      bg: 'var(--status-info-subtle)',
      ring: 'var(--azure-500)',
      label: 'Running'
    },
    done: {
      tone: 'var(--status-success)',
      bg: 'var(--status-success-subtle)',
      ring: 'var(--green-300)',
      label: 'Done'
    },
    error: {
      tone: 'var(--status-danger)',
      bg: 'var(--status-danger-subtle)',
      ring: 'var(--brick-500)',
      label: 'Error'
    }
  };
  const s = states[state] || states.idle;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-xs)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: s.bg,
      color: s.tone,
      boxShadow: `inset 0 0 0 1px ${s.ring}`,
      animation: state === 'running' ? 'gsid-pulse 1.6s var(--ease-in-out) infinite' : 'none'
    }
  }, icon, /*#__PURE__*/React.createElement("style", null, '@keyframes gsid-pulse{0%,100%{opacity:1}50%{opacity:0.55}}')), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
      color: s.tone,
      background: s.bg,
      padding: '2px 8px',
      borderRadius: 'var(--radius-pill)',
      textTransform: 'uppercase',
      letterSpacing: '0.06em'
    }
  }, s.label)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, role, detail ? ' · ' + detail : ''), progress !== null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-sunken)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: Math.max(0, Math.min(100, progress)) + '%',
      background: s.tone,
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  }))));
}
Object.assign(__ds_scope, { AgentStatus });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/AgentStatus.jsx", error: String((e && e.message) || e) }); }

// components/data/ProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID ProgressBar — determinate or indeterminate harvest progress.
 */
function ProgressBar({
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
    brand: 'var(--brand)',
    success: 'var(--status-success)',
    warning: 'var(--status-warning)',
    danger: 'var(--status-danger)',
    info: 'var(--status-info)'
  };
  const fill = tones[tone] || tones.brand;
  const h = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, rest), (label || showValue) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)',
      fontWeight: 'var(--weight-medium)'
    }
  }, label), showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, Math.round(pct), "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      height: h,
      overflow: 'hidden',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--radius-pill)'
    }
  }, indeterminate ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '40%',
      background: fill,
      borderRadius: 'var(--radius-pill)',
      animation: 'gsid-indeterminate 1.3s var(--ease-in-out) infinite'
    }
  }, /*#__PURE__*/React.createElement("style", null, '@keyframes gsid-indeterminate{0%{left:-40%}100%{left:100%}}')) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      height: '100%',
      width: pct + '%',
      background: fill,
      borderRadius: 'var(--radius-pill)',
      transition: 'width var(--duration-slow) var(--ease-out)'
    }
  })));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/data/SourceChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID SourceChip — a data source pill (OpenAlex, DOAJ, AJOL…) with its
 * access type (api / scrape) and health dot.
 */
function SourceChip({
  name,
  type = 'api',
  // api | scrape
  health = 'online',
  // online | degraded | offline
  count,
  onClick,
  style,
  ...rest
}) {
  const typeMeta = {
    api: {
      label: 'API',
      color: 'var(--status-info)',
      bg: 'var(--status-info-subtle)'
    },
    scrape: {
      label: 'SCRAPE',
      color: 'var(--amber-700)',
      bg: 'var(--status-warning-subtle)'
    }
  };
  const healthMeta = {
    online: 'var(--status-success)',
    degraded: 'var(--status-warning)',
    offline: 'var(--status-danger)'
  };
  const t = typeMeta[type] || typeMeta.api;
  const interactive = !!onClick;
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '6px 12px',
      background: hover && interactive ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-xs)',
      cursor: interactive ? 'pointer' : 'default',
      transition: 'background var(--duration-fast) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: healthMeta[health] || healthMeta.online,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--text-2xs)/1 var(--font-mono)',
      color: t.color,
      background: t.bg,
      padding: '2px 6px',
      borderRadius: 'var(--radius-xs)',
      letterSpacing: '0.04em'
    }
  }, t.label), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, count));
}
Object.assign(__ds_scope, { SourceChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SourceChip.jsx", error: String((e && e.message) || e) }); }

// components/data/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID StatCard — headline metric tile. Big Coolvetica number + label,
 * optional delta and trailing icon node.
 */
function StatCard({
  value,
  label,
  delta,
  deltaTone = 'success',
  icon = null,
  style,
  ...rest
}) {
  const deltaColors = {
    success: 'var(--status-success)',
    danger: 'var(--status-danger)',
    warning: 'var(--amber-700)',
    neutral: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-overline)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--brand)'
    }
  }, icon)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-regular) var(--text-3xl)/1 var(--font-display)',
      color: 'var(--text-heading)',
      letterSpacing: 'var(--tracking-tight)'
    }
  }, value), delta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono-sm)',
      color: deltaColors[deltaTone] || deltaColors.neutral
    }
  }, delta));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Checkbox — controlled or uncontrolled checkbox with label.
 */
function Checkbox({
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
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: description ? 'flex-start' : 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      flexShrink: 0,
      marginTop: description ? 1 : 0
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: isChecked,
    disabled: disabled,
    onChange: toggle,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 19,
      height: 19,
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${isChecked ? 'var(--brand)' : 'var(--border-strong)'}`,
      background: isChecked ? 'var(--brand)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--duration-fast) var(--ease-standard), border-color var(--duration-fast) var(--ease-standard)'
    }
  }, isChecked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  })))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)',
      fontWeight: 'var(--weight-medium)'
    }
  }, label), description && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Input — text field with optional label, leading icon, hint and error.
 */
function Input({
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
  const heights = {
    sm: 36,
    md: 42,
    lg: 48
  };
  const h = heights[size] || heights.md;
  const borderColor = error ? 'var(--status-danger)' : focus ? 'var(--brand)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: h,
      padding: '0 12px',
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--text-muted)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--type-body)',
      color: 'var(--text-heading)',
      ...style
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Select — styled native <select> with label, leading icon and chevron.
 */
function Select({
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
  const heights = {
    sm: 36,
    md: 42,
    lg: 48
  };
  const h = heights[size] || heights.md;
  const borderColor = error ? 'var(--status-danger)' : focus ? 'var(--brand)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      height: h,
      background: disabled ? 'var(--surface-sunken)' : 'var(--surface-card)',
      border: `1px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: focus ? 'var(--focus-ring)' : 'none',
      transition: 'border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      flex: 1,
      height: '100%',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '0 38px 0 12px',
      font: 'var(--type-body)',
      color: 'var(--text-heading)',
      ...style
    }
  }, rest), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const labelText = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, labelText);
  })), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      right: 12,
      pointerEvents: 'none',
      color: 'var(--text-muted)',
      display: 'inline-flex'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: error ? 'var(--status-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * GSID Switch — on/off toggle.
 */
function Switch({
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
  const dims = size === 'sm' ? {
    w: 36,
    h: 20,
    k: 14
  } : {
    w: 44,
    h: 24,
    k: 18
  };
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.55 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    checked: on,
    disabled: disabled,
    onChange: toggle,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: dims.w,
      height: dims.h,
      flexShrink: 0,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--brand)' : 'var(--neutral-300)',
      transition: 'background var(--duration-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: (dims.h - dims.k) / 2,
      left: on ? dims.w - dims.k - (dims.h - dims.k) / 2 : (dims.h - dims.k) / 2,
      width: dims.k,
      height: dims.k,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--duration-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-heading)',
      fontWeight: 'var(--weight-medium)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Dashboard.jsx
try { (() => {
/* GSID Console — Dashboard screen. window.Dashboard */
function Dashboard({
  onRun
}) {
  const NS = window.GSIDDesignSystem_019e0b;
  const {
    StatCard,
    AgentStatus,
    Card,
    CardHeader,
    Badge,
    Button,
    ProgressBar
  } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: s
  });
  const statusTone = {
    running: 'info',
    done: 'success',
    failed: 'danger'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gsid-overline"
  }, "Multi-agent pipeline"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h2)',
      marginTop: 6
    }
  }, "Good morning, let's harvest."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, "Three agents working to make Global South research visible.")), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconLeft: Ic('play', {
      width: 18,
      height: 18
    }),
    onClick: onRun
  }, "Run harvest")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    label: "Total profiles",
    value: "12,847",
    delta: "+1,284 this run",
    icon: Ic('users', {
      width: 18,
      height: 18
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Valid emails",
    value: "96.4%",
    delta: "\u22120.8% vs target",
    deltaTone: "warning",
    icon: Ic('mail-check', {
      width: 18,
      height: 18
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Regions covered",
    value: "23",
    delta: "+2 countries",
    icon: Ic('globe', {
      width: 18,
      height: 18
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    label: "Sources online",
    value: "5 / 6",
    delta: "AJOL degraded",
    deltaTone: "danger",
    icon: Ic('database', {
      width: 18,
      height: 18
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 'var(--space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    eyebrow: "Live run \xB7 r-2061",
    title: "Pipeline",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      tone: "info",
      dot: true
    }, "Running")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, D.agents.map(a => /*#__PURE__*/React.createElement(AgentStatus, {
    key: a.name,
    name: a.name,
    role: a.role,
    state: a.state,
    detail: a.detail,
    progress: a.progress,
    icon: Ic(a.icon, {
      width: 18,
      height: 18
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, Ic('shield-check', {
    width: 16,
    height: 16,
    color: 'var(--brand)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, "Only publicly listed correspondence emails are collected. Scrapers respect robots.txt with a randomised 1\u20135s delay."))), /*#__PURE__*/React.createElement(Card, {
    padding: "none"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5) var(--space-5) var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Recent runs",
    trailing: /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "View all"),
    style: {
      marginBottom: 0
    }
  })), /*#__PURE__*/React.createElement("div", null, D.runs.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px var(--space-5)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, r.region, " \xB7 ", r.disciplines), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, r.id, " \xB7 ", r.started)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      color: 'var(--text-body)'
    }
  }, r.profiles), /*#__PURE__*/React.createElement(Badge, {
    tone: statusTone[r.status],
    dot: true
  }, r.status[0].toUpperCase() + r.status.slice(1))))))));
}
window.Dashboard = Dashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Dashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Directory.jsx
try { (() => {
/* GSID Console — Directory (results table). window.Directory */
function Directory() {
  const NS = window.GSIDDesignSystem_019e0b;
  const {
    Card,
    Input,
    Select,
    Button,
    Badge,
    Avatar,
    SourceChip,
    IconButton
  } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: s
  });
  const [q, setQ] = React.useState('');
  const [region, setRegion] = React.useState('All regions');
  const rows = D.researchers.filter(r => (region === 'All regions' || r.region === region) && (q === '' || (r.name + r.inst + r.email + r.country).toLowerCase().includes(q.toLowerCase())));
  const th = {
    textAlign: 'left',
    font: 'var(--type-overline)',
    letterSpacing: 'var(--tracking-caps)',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    padding: '0 16px 12px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '14px 16px',
    borderTop: '1px solid var(--border-subtle)',
    verticalAlign: 'middle'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gsid-overline"
  }, "Researcher directory"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h2)',
      marginTop: 6
    }
  }, "12,847 profiles")), /*#__PURE__*/React.createElement(Button, {
    iconLeft: Ic('download', {
      width: 17,
      height: 17
    })
  }, "Export CSV")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    containerStyle: {
      flex: 1
    },
    iconLeft: Ic('search', {
      width: 17,
      height: 17
    }),
    placeholder: "Search by name, institution, email or country",
    value: q,
    onChange: e => setQ(e.target.value)
  }), /*#__PURE__*/React.createElement(Select, {
    containerStyle: {
      width: 200
    },
    value: region,
    onChange: e => setRegion(e.target.value),
    options: ['All regions', ...D.regions]
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    iconLeft: Ic('filter', {
      width: 17,
      height: 17
    })
  }, "Filters")), /*#__PURE__*/React.createElement(Card, {
    padding: "none"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      overflowX: 'auto'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      display: 'table-row'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16
    }
  }, "Researcher"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16
    }
  }, "Institution"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16
    }
  }, "Region"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16
    }
  }, "Field"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16
    }
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      paddingTop: 16,
      textAlign: 'right'
    }
  }))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r.email
  }, /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: r.name,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, r.name), r.verified ? Ic('badge-check', {
    width: 14,
    height: 14,
    color: 'var(--brand)'
  }) : Ic('clock', {
    width: 14,
    height: 14,
    color: 'var(--amber-500)'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, r.email)))), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, r.inst, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, r.country)), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, r.region)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)'
    }
  }, r.field), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, r.source)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...td,
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    label: "Open profile"
  }, Ic('arrow-up-right', {
    width: 16,
    height: 16
  })))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px var(--space-5)',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, "Showing ", rows.length, " of 12,847"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconLeft: Ic('chevron-left', {
      width: 15,
      height: 15
    })
  }, "Prev"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    size: "sm",
    iconRight: Ic('chevron-right', {
      width: 15,
      height: 15
    })
  }, "Next")))));
}
window.Directory = Directory;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Directory.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Harvest.jsx
try { (() => {
/* GSID Console — New harvest builder. window.Harvest */
function Harvest({
  onLaunch
}) {
  const NS = window.GSIDDesignSystem_019e0b;
  const {
    Card,
    CardHeader,
    Button,
    Checkbox,
    Select,
    Switch,
    SourceChip,
    Badge
  } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: s
  });
  const [regions, setRegions] = React.useState({
    Africa: true,
    Asia: false,
    'Latin America': true
  });
  const [sources, setSources] = React.useState(() => Object.fromEntries(D.sources.map(s => [s.name, s.health !== 'offline'])));
  const selRegions = Object.keys(regions).filter(k => regions[k]);
  const selSources = Object.keys(sources).filter(k => sources[k]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)',
      maxWidth: 1080
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gsid-overline"
  }, "Configure pipeline"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h2)',
      marginTop: 6
    }
  }, "New harvest")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 340px',
      gap: 'var(--space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    eyebrow: "Step 1",
    title: "Target regions"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 'var(--space-3)'
    }
  }, D.regions.map(r => /*#__PURE__*/React.createElement("label", {
    key: r,
    onClick: () => setRegions(s => ({
      ...s,
      [r]: !s[r]
    })),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '14px',
      border: `1.5px solid ${regions[r] ? 'var(--brand)' : 'var(--border-default)'}`,
      background: regions[r] ? 'var(--brand-subtle)' : 'var(--surface-card)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer'
    }
  }, Ic('map-pin', {
    width: 18,
    height: 18,
    color: regions[r] ? 'var(--brand)' : 'var(--text-muted)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: 'var(--text-heading)'
    }
  }, r)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Discipline filter",
    options: D.disciplines
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, {
    eyebrow: "Step 2",
    title: "Sources",
    trailing: /*#__PURE__*/React.createElement(Badge, {
      tone: "brand"
    }, selSources.length, " selected")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, D.sources.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.name,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 12px',
      borderRadius: 'var(--radius-md)',
      background: sources[s.name] ? 'var(--surface-sunken)' : 'transparent',
      opacity: s.health === 'offline' ? 0.55 : 1
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: s.name,
    description: s.desc,
    checked: !!sources[s.name],
    disabled: s.health === 'offline',
    onChange: () => setSources(p => ({
      ...p,
      [s.name]: !p[s.name]
    }))
  }), /*#__PURE__*/React.createElement(SourceChip, {
    name: "",
    type: s.type,
    health: s.health,
    count: s.count,
    style: {
      pointerEvents: 'none'
    }
  })))))), /*#__PURE__*/React.createElement(Card, {
    raised: true,
    style: {
      position: 'sticky',
      top: 'calc(var(--topbar-height) + var(--space-7))'
    }
  }, /*#__PURE__*/React.createElement(CardHeader, {
    title: "Run summary"
  }), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "Regions",
    value: selRegions.length ? selRegions.join(', ') : '—'
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Sources",
    value: `${selSources.length} of ${D.sources.length}`
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Est. profiles",
    value: "~9,400",
    mono: true
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Est. runtime",
    value: "18 min",
    mono: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-4) 0',
      paddingTop: 'var(--space-4)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(Switch, {
    label: "Respect robots.txt",
    defaultChecked: true,
    size: "sm"
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Randomise delay (1\u20135s)",
    defaultChecked: true,
    size: "sm"
  }), /*#__PURE__*/React.createElement(Switch, {
    label: "Deduplicate by email",
    defaultChecked: true,
    size: "sm"
  })), /*#__PURE__*/React.createElement(Button, {
    fullWidth: true,
    size: "lg",
    iconLeft: Ic('play', {
      width: 18,
      height: 18
    }),
    onClick: onLaunch,
    disabled: !selRegions.length || !selSources.length
  }, "Run harvest"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)',
      marginTop: 10,
      textAlign: 'center'
    }
  }, "Ethical collection of public contact data only."))));
}
function Row({
  label,
  value,
  mono
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0,
      font: mono ? 'var(--type-mono)' : 'var(--type-label)',
      color: 'var(--text-heading)',
      textAlign: 'right'
    }
  }, value));
}
window.Harvest = Harvest;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Harvest.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Shell.jsx
try { (() => {
/* GSID Console — app shell (sidebar + topbar). Exposes window.Shell */
function Shell({
  active,
  onNav,
  children,
  onRun
}) {
  const {
    Avatar,
    Button
  } = window.GSIDDesignSystem_019e0b;
  const Ic = (n, s) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: s
  });
  const nav = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard'
  }, {
    id: 'harvest',
    label: 'New harvest',
    icon: 'sparkles'
  }, {
    id: 'directory',
    label: 'Directory',
    icon: 'users'
  }, {
    id: 'sources',
    label: 'Sources',
    icon: 'database'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-width) 1fr',
      minHeight: '100vh',
      background: 'var(--bg-page)'
    }
  }, /*#__PURE__*/React.createElement("aside", {
    style: {
      background: 'var(--neutral-900)',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-5) var(--space-4)',
      position: 'sticky',
      top: 0,
      height: '100vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 8px 0 8px',
      marginBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: window.__resources && window.__resources.sidebarLogo || "../../assets/logos/gsi-mark-white.svg",
    alt: "GSI",
    style: {
      height: 30
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-bold) var(--text-base)/1 var(--font-body)',
      color: '#fff'
    }
  }, "Directory"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--green-300)'
    }
  }, "GSID Console"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1
    }
  }, nav.map(n => {
    const on = active === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onNav(n.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        background: on ? 'var(--green-700)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        color: on ? '#fff' : 'var(--neutral-300)',
        font: `${on ? 'var(--weight-semibold)' : 'var(--weight-medium)'} var(--text-sm)/1 var(--font-body)`,
        transition: 'background var(--duration-fast) var(--ease-standard)'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, Ic(n.icon, {
      width: 18,
      height: 18
    }), n.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: 'var(--space-4)',
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Project Lead",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-sm)',
      color: '#fff',
      fontWeight: 'var(--weight-medium)'
    }
  }, "Project Lead"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--neutral-400)'
    }
  }, "Outreach")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      height: 'var(--topbar-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-7)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      color: 'var(--text-muted)',
      font: 'var(--type-body-sm)'
    }
  }, Ic('command', {
    width: 15,
    height: 15
  }), /*#__PURE__*/React.createElement("span", null, "GSID"), Ic('chevron-right', {
    width: 14,
    height: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-heading)',
      fontWeight: 'var(--weight-semibold)',
      textTransform: 'capitalize'
    }
  }, active === 'harvest' ? 'New harvest' : active)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--status-success)'
    }
  }), "5 / 6 sources online"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    iconLeft: Ic('plus', {
      width: 16,
      height: 16
    }),
    onClick: onRun
  }, "New harvest"))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      padding: 'var(--space-7)',
      maxWidth: 1240,
      width: '100%'
    }
  }, children)));
}
window.Shell = Shell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/Sources.jsx
try { (() => {
/* GSID Console — Sources health screen. window.Sources */
function Sources() {
  const NS = window.GSIDDesignSystem_019e0b;
  const {
    Card,
    Badge,
    Button,
    ProgressBar,
    SourceChip
  } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => /*#__PURE__*/React.createElement("i", {
    "data-lucide": n,
    style: s
  });
  const healthTone = {
    online: 'success',
    degraded: 'warning',
    offline: 'danger'
  };
  const healthLabel = {
    online: 'Online',
    degraded: 'Degraded',
    offline: 'Offline'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "gsid-overline"
  }, "Data sources"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--type-h2)',
      marginTop: 6
    }
  }, "Source health"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-lg)',
      color: 'var(--text-muted)',
      marginTop: 6
    }
  }, "Open APIs and ethically scraped open-access platforms. No walled gardens.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: 'var(--space-4)'
    }
  }, D.sources.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.name,
    interactive: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 42,
      height: 42,
      borderRadius: 'var(--radius-md)',
      background: s.type === 'api' ? 'var(--status-info-subtle)' : 'var(--status-warning-subtle)',
      color: s.type === 'api' ? 'var(--status-info)' : 'var(--amber-700)'
    }
  }, Ic(s.type === 'api' ? 'plug-zap' : 'globe', {
    width: 20,
    height: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-h4)',
      color: 'var(--text-heading)'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-mono-sm)',
      color: 'var(--text-muted)'
    }
  }, s.type === 'api' ? 'Open API' : 'Ethical scrape'))), /*#__PURE__*/React.createElement(Badge, {
    tone: healthTone[s.health],
    dot: true
  }, healthLabel[s.health])), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-body-sm)',
      color: 'var(--text-body)',
      marginBottom: 'var(--space-4)'
    }
  }, s.desc), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-muted)'
    }
  }, "Records this cycle"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-mono)',
      color: 'var(--text-heading)'
    }
  }, s.count)), /*#__PURE__*/React.createElement(ProgressBar, {
    value: s.health === 'offline' ? 0 : s.health === 'degraded' ? 40 : 90,
    tone: healthTone[s.health],
    size: "sm"
  })))));
}
window.Sources = Sources;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/Sources.jsx", error: String((e && e.message) || e) }); }

// ui_kits/console/data.js
try { (() => {
// GSID console — sample data (plain globals; no build step)
window.GSID_DATA = {
  regions: ['Africa', 'Asia', 'Latin America'],
  sources: [{
    name: 'OpenAlex',
    type: 'api',
    health: 'online',
    count: '8,902',
    desc: 'Open API · primary author discovery'
  }, {
    name: 'DOAJ',
    type: 'api',
    health: 'online',
    count: '1,205',
    desc: 'Open API · open-access journal metadata'
  }, {
    name: 'Zenodo',
    type: 'api',
    health: 'online',
    count: '640',
    desc: 'Open API · datasets & preprints'
  }, {
    name: 'AJOL',
    type: 'scrape',
    health: 'degraded',
    count: '2,140',
    desc: 'Ethical scrape · African Journals OnLine'
  }, {
    name: 'NJOL',
    type: 'scrape',
    health: 'offline',
    count: '0',
    desc: 'Ethical scrape · Nigerian Journals OnLine'
  }],
  agents: [{
    name: 'API Harvester',
    role: 'OpenAlex · Zenodo · DOAJ',
    icon: 'bot',
    state: 'done',
    detail: '10,747 records',
    progress: 100
  }, {
    name: 'Ethical Scraper',
    role: 'AJOL · NJOL',
    icon: 'globe',
    state: 'running',
    detail: 'page 14 / 60 · 3s delay',
    progress: 42
  }, {
    name: 'Data Synthesizer',
    role: 'Standardise → dedupe → CSV',
    icon: 'file-spreadsheet',
    state: 'idle',
    detail: 'waiting for upstream',
    progress: null
  }],
  runs: [{
    id: 'r-2061',
    region: 'Africa',
    disciplines: 'Public health',
    status: 'running',
    profiles: '4,210',
    started: '12 min ago',
    source: 'All sources'
  }, {
    id: 'r-2060',
    region: 'Latin America',
    disciplines: 'Climate science',
    status: 'done',
    profiles: '3,118',
    started: 'Today, 09:14',
    source: 'API only'
  }, {
    id: 'r-2059',
    region: 'Asia',
    disciplines: 'Agronomy',
    status: 'done',
    profiles: '5,519',
    started: 'Yesterday',
    source: 'All sources'
  }, {
    id: 'r-2058',
    region: 'Africa',
    disciplines: 'All disciplines',
    status: 'failed',
    profiles: '—',
    started: 'Yesterday',
    source: 'AJOL only'
  }],
  researchers: [{
    name: 'Amina Okeke',
    email: 'a.okeke@unilag.edu.ng',
    inst: 'University of Lagos',
    region: 'Africa',
    country: 'Nigeria',
    field: 'Public health',
    source: 'OpenAlex',
    verified: true
  }, {
    name: 'Luis Mendoza',
    email: 'lmendoza@usp.br',
    inst: 'Universidade de São Paulo',
    region: 'Latin America',
    country: 'Brazil',
    field: 'Climate science',
    source: 'OpenAlex',
    verified: true
  }, {
    name: 'Priya Nair',
    email: 'priya.nair@iisc.ac.in',
    inst: 'Indian Institute of Science',
    region: 'Asia',
    country: 'India',
    field: 'Agronomy',
    source: 'DOAJ',
    verified: true
  }, {
    name: 'Kwame Mensah',
    email: 'kmensah@ug.edu.gh',
    inst: 'University of Ghana',
    region: 'Africa',
    country: 'Ghana',
    field: 'Public health',
    source: 'AJOL',
    verified: false
  }, {
    name: 'Fatima Zahra',
    email: 'f.zahra@um5.ac.ma',
    inst: 'Mohammed V University',
    region: 'Africa',
    country: 'Morocco',
    field: 'Climate science',
    source: 'OpenAlex',
    verified: true
  }, {
    name: 'Carlos Rivera',
    email: 'crivera@unam.mx',
    inst: 'UNAM',
    region: 'Latin America',
    country: 'Mexico',
    field: 'Agronomy',
    source: 'Zenodo',
    verified: true
  }, {
    name: 'Thandiwe Dlamini',
    email: 't.dlamini@wits.ac.za',
    inst: 'University of the Witwatersrand',
    region: 'Africa',
    country: 'South Africa',
    field: 'Public health',
    source: 'OpenAlex',
    verified: true
  }, {
    name: 'Anh Nguyen',
    email: 'anh.nguyen@vnu.edu.vn',
    inst: 'Vietnam National University',
    region: 'Asia',
    country: 'Vietnam',
    field: 'Climate science',
    source: 'DOAJ',
    verified: false
  }, {
    name: 'Ngozi Eze',
    email: 'ngozi.eze@unn.edu.ng',
    inst: 'University of Nigeria',
    region: 'Africa',
    country: 'Nigeria',
    field: 'Agronomy',
    source: 'AJOL',
    verified: true
  }, {
    name: 'Sofía Castro',
    email: 'scastro@uchile.cl',
    inst: 'Universidad de Chile',
    region: 'Latin America',
    country: 'Chile',
    field: 'Public health',
    source: 'OpenAlex',
    verified: true
  }],
  disciplines: ['All disciplines', 'Public health', 'Agronomy', 'Climate science', 'Economics', 'Engineering']
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/console/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.AgentStatus = __ds_scope.AgentStatus;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.SourceChip = __ds_scope.SourceChip;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
