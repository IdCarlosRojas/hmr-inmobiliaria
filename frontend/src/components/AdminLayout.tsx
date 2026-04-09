import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, FileText, Calendar, Users, LogOut, Menu, X, BarChart3 } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { usuario, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/admin', icon: <BarChart3 size={18} />, label: 'Dashboard' },
    { path: '/admin/propiedades', icon: <Building2 size={18} />, label: 'Propiedades' },
    { path: '/admin/contratos', icon: <FileText size={18} />, label: 'Contratos' },
    { path: '/admin/citas', icon: <Calendar size={18} />, label: 'Citas' },
    ...(isSuperAdmin ? [{ path: '/admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' }] : []),
  ];

  const SidebarNav = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <>
      <nav style={{ padding: '16px 8px', flex: 1 }}>
        {links.map(({ path, icon, label }) => (
          <Link key={path} to={path}
            onClick={onLinkClick}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: 8,
              marginBottom: 4, color: isActive(path) ? 'white' : '#94a3b8',
              background: isActive(path) ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontSize: 14, fontWeight: isActive(path) ? 600 : 400, transition: 'all 0.2s',
              borderLeft: isActive(path) ? '3px solid #3b82f6' : '3px solid transparent',
              textDecoration: 'none',
            }}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            {(!collapsed || onLinkClick) && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {(!collapsed || onLinkClick) && (
          <div style={{ padding: '8px 12px', marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{usuario?.nombre}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{usuario?.rol?.replace('_', ' ')}</div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
          color: '#94a3b8', background: 'none', border: 'none', width: '100%', fontSize: 14, cursor: 'pointer',
        }}>
          <LogOut size={16} />
          {(!collapsed || onLinkClick) && <span>Cerrar sesión</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .admin-sidebar-desktop {
          display: flex !important;
          flex-direction: column;
        }
        .admin-mobile-overlay { display: none !important; }
        .admin-mobile-header { display: none !important; }
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-header { display: flex !important; }
          .admin-main-content { margin-left: 0 !important; }
          .admin-mobile-overlay { display: block !important; }
          .admin-page-header { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>

        {/* Sidebar desktop */}
        <aside className="admin-sidebar-desktop" style={{
          width: collapsed ? 72 : 240, background: '#0f2244', color: 'white',
          transition: 'width 0.3s ease', flexShrink: 0,
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        }}>
          <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {!collapsed && (
              <div>
                <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: '-0.3px' }}>GRUPO HMR</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>Panel Administrativo</div>
              </div>
            )}
            <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
              <Menu size={18} />
            </button>
          </div>
          <SidebarNav />
        </aside>

        {/* Header mobile */}
        <header className="admin-mobile-header" style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: '#0f2244', height: 60, alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px',
        }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
            <Menu size={22} />
          </button>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>GRUPO HMR</div>
          <Link to="/" style={{ color: '#94a3b8', fontSize: 12 }}>
            <Home size={18} />
          </Link>
        </header>

        {/* Drawer mobile */}
        <div className="admin-mobile-overlay">
          {mobileOpen && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
              <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 260, background: '#0f2244', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
                <div style={{ padding: '18px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13, color: 'white' }}>GRUPO HMR</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>Panel Administrativo</div>
                  </div>
                  <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <SidebarNav onLinkClick={() => setMobileOpen(false)} />
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <main className="admin-main-content" style={{ marginLeft: collapsed ? 72 : 240, flex: 1, transition: 'margin-left 0.3s ease', minWidth: 0 }}>
          {/* Header desktop */}
          <header className="admin-page-header" style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {links.find(l => l.path === location.pathname)?.label || 'Panel Admin'}
            </h1>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280', padding: '6px 12px', borderRadius: 6, border: '1px solid #e8ecf0' }}>
              <Home size={14} /> Ver sitio web
            </Link>
          </header>

          <div style={{ padding: '24px 20px', paddingTop: '84px' }} className="admin-mobile-pad">
            <style>{`
              @media (min-width: 769px) {
                .admin-mobile-pad { padding-top: 24px !important; }
              }
            `}</style>
            {children}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;