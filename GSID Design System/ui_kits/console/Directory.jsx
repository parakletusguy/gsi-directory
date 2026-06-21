/* GSID Console — Directory (results table). window.Directory */
function Directory() {
  const NS = window.GSIDDesignSystem_019e0b;
  const { Card, Input, Select, Button, Badge, Avatar, SourceChip, IconButton } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => <i data-lucide={n} style={s}></i>;
  const [q, setQ] = React.useState('');
  const [region, setRegion] = React.useState('All regions');

  const rows = D.researchers.filter((r) =>
    (region === 'All regions' || r.region === region) &&
    (q === '' || (r.name + r.inst + r.email + r.country).toLowerCase().includes(q.toLowerCase())));

  const th = { textAlign: 'left', font: 'var(--type-overline)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px 12px', whiteSpace: 'nowrap' };
  const td = { padding: '14px 16px', borderTop: '1px solid var(--border-subtle)', verticalAlign: 'middle' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <div className="gsid-overline">Researcher directory</div>
          <h1 style={{ font: 'var(--type-h2)', marginTop: 6 }}>12,847 profiles</h1>
        </div>
        <Button iconLeft={Ic('download', { width: 17, height: 17 })}>Export CSV</Button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
        <Input containerStyle={{ flex: 1 }} iconLeft={Ic('search', { width: 17, height: 17 })} placeholder="Search by name, institution, email or country" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select containerStyle={{ width: 200 }} value={region} onChange={(e) => setRegion(e.target.value)} options={['All regions', ...D.regions]} />
        <Button variant="secondary" iconLeft={Ic('filter', { width: 17, height: 17 })}>Filters</Button>
      </div>

      <Card padding="none">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ display: 'table-row' }}>
              <th style={{ ...th, paddingTop: 16 }}>Researcher</th>
              <th style={{ ...th, paddingTop: 16 }}>Institution</th>
              <th style={{ ...th, paddingTop: 16 }}>Region</th>
              <th style={{ ...th, paddingTop: 16 }}>Field</th>
              <th style={{ ...th, paddingTop: 16 }}>Source</th>
              <th style={{ ...th, paddingTop: 16, textAlign: 'right' }}></th>
            </tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email}>
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Avatar name={r.name} size="sm" />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{r.name}</span>
                          {r.verified
                            ? Ic('badge-check', { width: 14, height: 14, color: 'var(--brand)' })
                            : Ic('clock', { width: 14, height: 14, color: 'var(--amber-500)' })}
                        </div>
                        <div style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ ...td, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{r.inst}<div style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>{r.country}</div></td>
                  <td style={td}><Badge tone="neutral">{r.region}</Badge></td>
                  <td style={{ ...td, font: 'var(--type-body-sm)', color: 'var(--text-body)' }}>{r.field}</td>
                  <td style={td}><span style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>{r.source}</span></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    <IconButton size="sm" label="Open profile">{Ic('arrow-up-right', { width: 16, height: 16 })}</IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ font: 'var(--type-body-sm)', color: 'var(--text-muted)' }}>Showing {rows.length} of 12,847</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" size="sm" iconLeft={Ic('chevron-left', { width: 15, height: 15 })}>Prev</Button>
            <Button variant="secondary" size="sm" iconRight={Ic('chevron-right', { width: 15, height: 15 })}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
window.Directory = Directory;
