import React from 'react';

/**
 * GSID AgentStatus — a row representing one pipeline agent (Harvester,
 * Scraper, Synthesizer) with live state, description and optional progress.
 */
export function AgentStatus({
  name,
  role,
  state = 'idle',     // idle | running | done | error
  icon = null,
  detail,
  progress = null,    // 0..100 or null
  style,
  ...rest
}) {
  const states = {
    idle:    { tone: 'var(--text-muted)', bg: 'var(--surface-sunken)', ring: 'var(--border-default)', label: 'Idle' },
    running: { tone: 'var(--status-info)', bg: 'var(--status-info-subtle)', ring: 'var(--azure-500)', label: 'Running' },
    done:    { tone: 'var(--status-success)', bg: 'var(--status-success-subtle)', ring: 'var(--green-300)', label: 'Done' },
    error:   { tone: 'var(--status-danger)', bg: 'var(--status-danger-subtle)', ring: 'var(--brick-500)', label: 'Error' },
  };
  const s = states[state] || states.idle;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
      background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)', padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-xs)', ...style,
    }} {...rest}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-md)',
        background: s.bg, color: s.tone,
        boxShadow: `inset 0 0 0 1px ${s.ring}`,
        animation: state === 'running' ? 'gsid-pulse 1.6s var(--ease-in-out) infinite' : 'none',
      }}>
        {icon}
        <style>{'@keyframes gsid-pulse{0%,100%{opacity:1}50%{opacity:0.55}}'}</style>
      </span>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{name}</span>
          <span style={{
            font: 'var(--weight-semibold) var(--text-2xs)/1 var(--font-body)',
            color: s.tone, background: s.bg, padding: '2px 8px',
            borderRadius: 'var(--radius-pill)', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>{s.label}</span>
        </div>
        <div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 2 }}>
          {role}{detail ? ' · ' + detail : ''}
        </div>
        {progress !== null && (
          <div style={{ marginTop: 8, height: 6, borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', overflow: 'hidden' }}>
            <span style={{ display: 'block', height: '100%', width: Math.max(0, Math.min(100, progress)) + '%', background: s.tone, borderRadius: 'var(--radius-pill)', transition: 'width var(--duration-slow) var(--ease-out)' }} />
          </div>
        )}
      </div>
    </div>
  );
}
