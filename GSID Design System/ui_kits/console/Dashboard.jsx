/* GSID Console — Dashboard screen. window.Dashboard */
function Dashboard({ onRun }) {
  const NS = window.GSIDDesignSystem_019e0b;
  const { StatCard, AgentStatus, Card, CardHeader, Badge, Button, ProgressBar } = NS;
  const D = window.GSID_DATA;
  const Ic = (n, s) => <i data-lucide={n} style={s}></i>;
  const statusTone = { running: 'info', done: 'success', failed: 'danger' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
        <div>
          <div className="gsid-overline">Multi-agent pipeline</div>
          <h1 style={{ font: 'var(--type-h2)', marginTop: 6 }}>Good morning, let's harvest.</h1>
          <p style={{ font: 'var(--type-body-lg)', color: 'var(--text-muted)', marginTop: 6 }}>Three agents working to make Global South research visible.</p>
        </div>
        <Button size="lg" iconLeft={Ic('play', { width: 18, height: 18 })} onClick={onRun}>Run harvest</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <StatCard label="Total profiles" value="12,847" delta="+1,284 this run" icon={Ic('users', { width: 18, height: 18 })} />
        <StatCard label="Valid emails" value="96.4%" delta="−0.8% vs target" deltaTone="warning" icon={Ic('mail-check', { width: 18, height: 18 })} />
        <StatCard label="Regions covered" value="23" delta="+2 countries" icon={Ic('globe', { width: 18, height: 18 })} />
        <StatCard label="Sources online" value="5 / 6" delta="AJOL degraded" deltaTone="danger" icon={Ic('database', { width: 18, height: 18 })} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-5)', alignItems: 'start' }}>
        <Card>
          <CardHeader eyebrow="Live run · r-2061" title="Pipeline" trailing={<Badge tone="info" dot>Running</Badge>} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {D.agents.map((a) => (
              <AgentStatus key={a.name} name={a.name} role={a.role} state={a.state} detail={a.detail} progress={a.progress} icon={Ic(a.icon, { width: 18, height: 18 })} />
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
            {Ic('shield-check', { width: 16, height: 16, color: 'var(--brand)' })}
            <span style={{ font: 'var(--type-caption)', color: 'var(--text-muted)' }}>Only publicly listed correspondence emails are collected. Scrapers respect robots.txt with a randomised 1–5s delay.</span>
          </div>
        </Card>

        <Card padding="none">
          <div style={{ padding: 'var(--space-5) var(--space-5) var(--space-4)' }}>
            <CardHeader title="Recent runs" trailing={<Button variant="ghost" size="sm">View all</Button>} style={{ marginBottom: 0 }} />
          </div>
          <div>
            {D.runs.map((r, i) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px var(--space-5)', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: 'var(--type-label)', color: 'var(--text-heading)' }}>{r.region} · {r.disciplines}</div>
                  <div style={{ font: 'var(--type-mono-sm)', color: 'var(--text-muted)', marginTop: 2 }}>{r.id} · {r.started}</div>
                </div>
                <span style={{ font: 'var(--type-mono)', color: 'var(--text-body)' }}>{r.profiles}</span>
                <Badge tone={statusTone[r.status]} dot>{r.status[0].toUpperCase() + r.status.slice(1)}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
window.Dashboard = Dashboard;
