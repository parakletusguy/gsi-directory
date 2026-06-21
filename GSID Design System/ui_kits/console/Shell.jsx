/* GSID Console — app shell (sidebar + topbar). Exposes window.Shell */
function Shell({ active, onNav, children, onRun }) {
  const { Avatar, Button } = window.GSIDDesignSystem_019e0b;
  const Ic = (n, s) => <i data-lucide={n} style={s}></i>;
  const nav = [
    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
    { id: 'harvest', label: 'New harvest', icon: 'sparkles' },
    { id: 'directory', label: 'Directory', icon: 'users' },
    { id: 'sources', label: 'Sources', icon: 'database' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-width) 1fr', minHeight: '100vh', background: 'var(--bg-page)' }}>
      {/* Sidebar */}
      <aside style={{ background: 'var(--neutral-900)', display: 'flex', flexDirection: 'column', padding: 'var(--space-5) var(--space-4)', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 0 8px', marginBottom: 'var(--space-7)' }}>
          <img src={(window.__resources && window.__resources.sidebarLogo) || "../../assets/logos/gsi-mark-white.svg"} alt="GSI" style={{ height: 30 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ font: 'var(--weight-bold) var(--text-base)/1 var(--font-body)', color: '#fff' }}>Directory</span>
            <span style={{ font: 'var(--type-mono-sm)', color: 'var(--green-300)' }}>GSID Console</span>
          </div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {nav.map((n) => {
            const on = active === n.id;
            return (
              <button key={n.id} onClick={() => onNav(n.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                background: on ? 'var(--green-700)' : 'transparent', border: 'none',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                color: on ? '#fff' : 'var(--neutral-300)',
                font: `${on ? 'var(--weight-semibold)' : 'var(--weight-medium)'} var(--text-sm)/1 var(--font-body)`,
                transition: 'background var(--duration-fast) var(--ease-standard)',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                {Ic(n.icon, { width: 18, height: 18 })}
                {n.label}
              </button>
            );
          })}
        </nav>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar name="Project Lead" size="sm" />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ font: 'var(--type-body-sm)', color: '#fff', fontWeight: 'var(--weight-medium)' }}>Project Lead</div>
            <div style={{ font: 'var(--type-mono-sm)', color: 'var(--neutral-400)' }}>Outreach</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ height: 'var(--topbar-height)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-7)', background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', font: 'var(--type-body-sm)' }}>
            {Ic('command', { width: 15, height: 15 })}
            <span>GSID</span>{Ic('chevron-right', { width: 14, height: 14 })}
            <span style={{ color: 'var(--text-heading)', fontWeight: 'var(--weight-semibold)', textTransform: 'capitalize' }}>{active === 'harvest' ? 'New harvest' : active}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--type-mono-sm)', color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--status-success)' }}></span>
              5 / 6 sources online
            </span>
            <Button size="sm" iconLeft={Ic('plus', { width: 16, height: 16 })} onClick={onRun}>New harvest</Button>
          </div>
        </header>
        <main style={{ flex: 1, padding: 'var(--space-7)', maxWidth: 1240, width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
window.Shell = Shell;
