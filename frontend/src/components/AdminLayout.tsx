import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Building2, FileText, Calendar, Users, LogOut, Menu, X, BarChart3 } from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { usuario, logout, isSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/admin/login'); };
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/admin', icon: <BarChart3 size={16} />, label: 'Dashboard' },
    { path: '/admin/propiedades', icon: <Building2 size={16} />, label: 'Propiedades' },
    { path: '/admin/contratos', icon: <FileText size={16} />, label: 'Contratos' },
    { path: '/admin/citas', icon: <Calendar size={16} />, label: 'Citas' },
    ...(isSuperAdmin ? [{ path: '/admin/usuarios', icon: <Users size={16} />, label: 'Usuarios' }] : []),
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 240, background: '#0f2244', color: 'white',
        transition: 'width 0.3s ease', flexShrink: 0, display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {!collapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: '-0.3px' }}>GRUPO HMR</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Panel Administrativo</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
            {collapsed ? <Menu size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={{ padding: '16px 8px', flex: 1 }}>
          {links.map(({ path, icon, label }) => (
            <Link key={path} to={path} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
              marginBottom: 4, color: isActive(path) ? 'white' : '#94a3b8',
              background: isActive(path) ? 'rgba(255,255,255,0.1)' : 'transparent',
              fontSize: 14, fontWeight: isActive(path) ? 600 : 400, transition: 'all 0.2s',
              borderLeft: isActive(path) ? '3px solid #3b82f6' : '3px solid transparent',
            }}>
              <span style={{ flexShrink: 0, fontSize: 16 }}>{icon}</span>
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {!collapsed && (
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
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: collapsed ? 72 : 240, flex: 1, transition: 'margin-left 0.3s ease', minWidth: 0 }}>
        <header style={{ background: 'white', padding: '16px 32px', borderBottom: '1px solid #e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
              {links.find(l => l.path === location.pathname)?.label || 'Panel Admin'}
            </h1>
          </div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280', padding: '6px 12px', borderRadius: 6, border: '1px solid #e8ecf0' }}>
           <Home size={14} /> Ver sitio web
          </Link>
        </header>
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;