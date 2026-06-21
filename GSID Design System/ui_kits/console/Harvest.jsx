/* GSID Console — New harvest builder. window.Harvest */
function Harvest({ onLaunch }) {
  const NS = window.GSIDDesignSystem_019e0b;
  const { Card, CardHeader, Button, Checkbox, Select, Switch, SourceChip, Badge } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => <i data-lucide={n} style={s}></i>;
  const [regions, setRegions] = React.useState({ Africa: true, Asia: false, 'Latin America': true });
  const [sources, setSources] = React.useState(() => Object.fromEntries(D.sources.map((s) => [s.name, s.health !== 'offline'])));

  const selRegions = Object.keys(regions).filter((k) => regions[k]);
  const selSources = Object.keys(sources).filter((k) => sources[k]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 1080 }}>
      <div>
        <div className="gsid-overline">Configure pipeline</div>
        <h1 style={{ font: 'var(--type-h2)', marginTop: 6 }}>New harvest</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-5)', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <Card>
            <CardHeader eyebrow="Step 1" title="Target regions" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
              {D.regions.map((r) => (
                <label key={r} onClick={() => setRegions((s) => ({ ...s, [r]: !s[r] }))} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '14px',
                  border: `1.5px solid ${regions[r] ? 'var(--brand)' : 'var(--border-default)'}`,
                  background: regions[r] ? 'var(--brand-subtle)' : 'var(--surface-card)',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                }}>
                  {Ic('map-pin', { width: 18, height: 18, color: regions[r] ? 'var(--brand)' : 'var(--text-muted)' })}
                  <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{r}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 'var(--space-4)' }}>
              <Select label="Discipline filter" options={D.disciplines} />
            </div>
          </Card>

          <Card>
            <CardHeader eyebrow="Step 2" title="Sources" trailing={<Badge tone="brand">{selSources.length} selected</Badge>} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {D.sources.map((s) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: sources[s.name] ? 'var(--surface-sunken)' : 'transparent', opacity: s.health === 'offline' ? 0.55 : 1 }}>
                  <Checkbox label={s.name} description={s.desc} checked={!!sources[s.name]} disabled={s.health === 'offline'} onChange={() => setSources((p) => ({ ...p, [s.name]: !p[s.name] }))} />
                  <SourceChip name="" type={s.type} health={s.health} count={s.count} style={{ pointerEvents: 'none' }} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Summary rail */}
        <Card raised style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--space-7))' }}>
          <CardHeader title="Run summary" />
          <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Row label="Regions" value={selRegions.length ? selRegions.join(', ') : '—'} />
            <Row label="Sources" value={`${selSources.length} of ${D.sources.length}`} />
            <Row label="Est. profiles" value="~9,400" mono />
            <Row label="Est. runtime" value="18 min" mono />
          </dl>
          <div style={{ margin: 'var(--space-4) 0', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Switch label="Respect robots.txt" defaultChecked size="sm" />
            <Switch label="Randomise delay (1–5s)" defaultChecked size="sm" />
            <Switch label="Deduplicate by email" defaultChecked size="sm" />
          </div>
          <Button fullWidth size="lg" iconLeft={Ic('play', { width: 18, height: 18 })} onClick={onLaunch} disabled={!selRegions.length || !selSources.length}>Run harvest</Button>
          <p style={{ font: 'var(--type-caption)', color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>Ethical collection of public contact data only.</p>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, mono }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
      <dt style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>{label}</dt>
      <dd style={{ margin: 0, font: mono ? 'var(--type-mono)' : 'var(--type-label)', color: 'var(--text-heading)', textAlign: 'right' }}>{value}</dd>
    </div>
  );
}
window.Harvest = Harvest;
