/* GSID Console — Sources health screen. window.Sources */
function Sources() {
  const NS = window.GSIDDesignSystem_019e0b;
  const { Card, Badge, Button, ProgressBar, SourceChip } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => <i data-lucide={n} style={s}></i>;
  const healthTone = { online: 'success', degraded: 'warning', offline: 'danger' };
  const healthLabel = { online: 'Online', degraded: 'Degraded', offline: 'Offline' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <div className="gsid-overline">Data sources</div>
        <h1 style={{ font: 'var(--type-h2)', marginTop: 6 }}>Source health</h1>
        <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-muted)', marginTop: 6 }}>Open APIs and ethically scraped open-access platforms. No walled gardens.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {D.sources.map((s) => (
          <Card key={s.name} interactive>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 'var(--radius-md)', background: s.type === 'api' ? 'var(--status-info-subtle)' : 'var(--status-warning-subtle)', color: s.type === 'api' ? 'var(--status-info)' : 'var(--amber-700)' }}>
                  {Ic(s.type === 'api' ? 'plug-zap' : 'globe', { width: 20, height: 20 })}
                </span>
                <div>
                  <div style={{ font: 'var(--type-h4)', color: 'var(--text-heading)' }}>{s.name}</div>
                  <div style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>{s.type === 'api' ? 'Open API' : 'Ethical scrape'}</div>
                </div>
              </div>
              <Badge tone={healthTone[s.health]} dot>{healthLabel[s.health]}</Badge>
            </div>
            <p style={{ font: 'var(--type-body-sm)', color: 'var(--text-body)', marginBottom: 'var(--space-4)' }}>{s.desc}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Records this cycle</span>
              <span style={{ font: 'var(--type-mono)', color: 'var(--text-heading)' }}>{s.count}</span>
            </div>
            <ProgressBar
              value={s.health === 'offline' ? 0 : s.health === 'degraded' ? 40 : 90}
              tone={healthTone[s.health]}
              size="sm" />
          </Card>
        ))}
      </div>
    </div>
  );
}
window.Sources = Sources;
