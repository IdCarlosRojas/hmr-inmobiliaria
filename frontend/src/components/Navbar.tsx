import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Solo en la homepage el navbar empieza transparente con letras blancas
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setScrolled(false);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (path: string) => location.pathname === path;

  // Transparente+blanco SOLO en home sin scroll y sin menú abierto
  const esTransparente = isHomePage && !scrolled && !menuOpen;

  const linkColor = esTransparente ? 'rgba(255,255,255,0.9)' : '#374151';
  const logoColor = esTransparente ? 'white' : '#1B3A6B';
  const subColor  = esTransparente ? 'rgba(255,255,255,0.6)' : '#6b7280';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: esTransparente ? 'transparent' : 'rgba(255,255,255,0.97)',
        backdropFilter: esTransparente ? 'none' : 'blur(12px)',
        boxShadow: esTransparente ? 'none' : '0 2px 20px rgba(27,58,107,0.1)',
        transition: 'all 0.3s ease',
        borderBottom: esTransparente ? 'none' : '1px solid rgba(27,58,107,0.08)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <img src="/logo.png" alt="HMR" style={{ height: 40 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: logoColor, letterSpacing: '-0.5px', transition: 'color 0.3s' }}>GRUPO INMOBILIARIO</div>
              <div style={{ fontSize: 10, color: subColor, letterSpacing: '2px', textTransform: 'uppercase', transition: 'color 0.3s' }}>HMR</div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {[
              { path: '/', label: 'Inicio' },
              { path: '/propiedades', label: 'Propiedades' },
              { path: '/nosotros', label: 'Nosotros' },
              { path: '/contacto', label: 'Contacto' },
            ].map(({ path, label }) => (
              <Link key={path} to={path} style={{
                padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: isActive(path) ? '#1B3A6B' : linkColor,
                background: isActive(path) ? 'rgba(27,58,107,0.08)' : 'transparent',
                transition: 'all 0.2s', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="nav-desktop">
            <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: 8, background: '#25D366',
              color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
              <MessageCircle size={16} /> WhatsApp
            </a>
            <Link to="/admin/login" style={{
              padding: '8px 16px',
              border: `2px solid ${esTransparente ? 'rgba(255,255,255,0.6)' : '#1B3A6B'}`,
              borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: esTransparente ? 'white' : '#1B3A6B',
              textDecoration: 'none', transition: 'all 0.3s',
            }}>
              Ingresar
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: esTransparente ? 'white' : '#1B3A6B' }}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: 'white', borderTop: '1px solid #e8ecf0', padding: '16px 20px 24px' }} className="nav-mobile">
            {[
              { path: '/', label: 'Inicio' },
              { path: '/propiedades', label: 'Propiedades' },
              { path: '/nosotros', label: 'Nosotros' },
              { path: '/contacto', label: 'Contacto' },
            ].map(({ path, label }) => (
              <Link key={path} to={path} style={{
                display: 'block', padding: '14px 16px', borderRadius: 10, fontSize: 16, fontWeight: 600,
                color: isActive(path) ? '#1B3A6B' : '#374151',
                background: isActive(path) ? '#f0f4ff' : 'transparent',
                textDecoration: 'none', marginBottom: 4,
              }}>
                {label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid #e8ecf0', marginTop: 12, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: '#25D366', color: 'white', padding: '13px', borderRadius: 10,
                fontSize: 15, fontWeight: 700, textDecoration: 'none',
              }}>
                <MessageCircle size={18} /> WhatsApp
              </a>
              <Link to="/admin/login" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #1B3A6B', borderRadius: 10, padding: '13px',
                fontSize: 15, fontWeight: 700, color: '#1B3A6B', textDecoration: 'none',
              }}>
                Ingresar al panel
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;