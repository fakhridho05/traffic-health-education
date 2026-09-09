import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/beranda',       icon: '🏠', label: 'Beranda',    match: (p) => p === '/beranda' },
  { to: '/edukasi',       icon: '📚', label: 'Edukasi',    match: (p) => p.includes('/edukasi') },
  { to: '/kuesioner',     icon: '📝', label: 'Kuesioner',  match: (p) => p.includes('/kuesioner') },
  { to: '/pre-post-test', icon: '⭐', label: 'Tes',        match: (p) => p.includes('/pre-test') || p.includes('/post-test') || p.includes('/pre-post-test') },
  { to: '/progress',      icon: '📈', label: 'Progres',    match: (p) => p.includes('/progress') },
  { to: '/profil',        icon: '👤', label: 'Profil',     match: (p) => p.includes('/profil') },
  { to: '/bantuan',       icon: '❓', label: 'Bantuan',    match: (p) => p.includes('/bantuan') },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = userProfile?.namaIbu || 'Bunda';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* ===== SIDEBAR (Desktop) ===== */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🚦</span>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
            <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#18312a' }}>TRAFFIC HEALTH</span>
            <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#18312a' }}>EDUCATION</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {navItems.map(({ to, icon, label, match }) => (
            <Link key={to} to={to} className={`sidebar-item ${match(location.pathname) ? 'active' : ''}`}>
              {icon} {label}
            </Link>
          ))}

          {/* Admin Menu - hanya tampil untuk admin */}
          {isAdmin && (
            <>
              <Link
                to="/admin/modules"
                className={`sidebar-item ${location.pathname.includes('/admin/modules') ? 'active' : ''}`}
                style={{ marginTop: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}
              >
                ⚙️ Admin Modul
              </Link>
              <Link
                to="/admin/kuesioner"
                className={`sidebar-item ${location.pathname.includes('/admin/kuesioner') ? 'active' : ''}`}
              >
                📝 Admin Kuesioner
              </Link>
              <Link
                to="/admin/quiz"
                className={`sidebar-item ${location.pathname.includes('/admin/quiz') ? 'active' : ''}`}
              >
                ⭐ Admin Tes (Quiz)
              </Link>
            </>
          )}
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{ marginTop: 'auto', color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '12px 20px', fontSize: 'inherit', fontFamily: 'inherit' }}
          >
            🚪 Keluar
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="main-content" style={{ position: 'relative' }}>
        {/* Topbar */}
        <div className="topbar" style={{ position: 'relative', zIndex: 10 }}>
          {/* Hamburger (mobile only) */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
          >
            ☰
          </button>
          <div className="topbar-user">
            <span>🔔</span>
            <span className="topbar-name">Halo, {displayName}</span>
            <div className="avatar">👩</div>
          </div>
        </div>

        <div className="page-content" style={{ position: 'relative', zIndex: 1 }}>
          <Outlet />
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <nav className="bottom-nav">
        {navItems.slice(0, 5).map(({ to, icon, label, match }) => (
          <Link
            key={to}
            to={to}
            className={`bottom-nav-item ${match(location.pathname) ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">{icon}</span>
            <span className="bottom-nav-label">{label}</span>
          </Link>
        ))}
        <button
          className="bottom-nav-item"
          onClick={() => setMenuOpen(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <span className="bottom-nav-icon">⋯</span>
          <span className="bottom-nav-label">Lainnya</span>
        </button>
      </nav>

      {/* ===== MOBILE SLIDE DRAWER ===== */}
      {menuOpen && (
        <div className="drawer-overlay" onClick={() => setMenuOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.8rem' }}>🚦</span>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#18312a', lineHeight: 1.1 }}>TRAFFIC HEALTH</div>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: '#18312a', lineHeight: 1.1 }}>EDUCATION</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="drawer-close">✕</button>
            </div>
            <div className="drawer-user">
              <div className="avatar" style={{ width: '48px', height: '48px', fontSize: '1.6rem' }}>👩</div>
              <div>
                <div style={{ fontWeight: '700', color: '#18312a' }}>Bunda {displayName}</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>Ibu Balita</div>
              </div>
            </div>
            <div className="drawer-nav">
              {navItems.map(({ to, icon, label, match }) => (
                <Link
                  key={to}
                  to={to}
                  className={`sidebar-item ${match(location.pathname) ? 'active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {icon} {label}
                </Link>
              ))}
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="sidebar-item"
                style={{ color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: '12px 16px', fontSize: 'inherit', fontFamily: 'inherit', marginTop: '8px' }}
              >
                🚪 Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
