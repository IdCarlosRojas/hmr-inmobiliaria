import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPropiedadesDestacadas } from '../services/api';
import { Propiedad } from '../types';
import TarjetaPropiedad from '../components/TarjetaPropiedad';
import { Search, Home, Handshake, Star, Shield, MessageCircle } from 'lucide-react';

const HomePage = () => {
  const [destacadas, setDestacadas] = useState<Propiedad[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [operacion, setOperacion] = useState('');
  const [tipo, setTipo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPropiedadesDestacadas().then(r => setDestacadas(r.data)).catch(() => {});
  }, []);

  const handleBuscar = () => {
    const params = new URLSearchParams();
    if (busqueda) params.set('localidad', busqueda);
    if (operacion) params.set('operacion', operacion);
    if (tipo) params.set('tipo', tipo);
    navigate(`/propiedades?${params.toString()}`);
  };

  const ZONAS = ['Chapinero', 'Usaquén', 'Suba', 'Teusaquillo', 'Barrios Unidos', 'Zipaquirá', 'Kennedy', 'Engativá'];

  return (
    <div>
      <style>{`
        .hero-buscador {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .hero-buscador input { flex: 1; min-width: 160px; }
        .hero-stats {
          position: absolute;
          right: 48px;
          bottom: 80px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .servicios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 24px;
        }
        .destacadas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        @media (max-width: 768px) {
          .hero-stats { display: none !important; }
          .hero-buscador { flex-direction: column; }
          .hero-buscador input, .hero-buscador select, .hero-buscador button {
            width: 100%;
          }
        }
        @media (max-width: 500px) {
          .destacadas-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2244 0%, #1B3A6B 60%, #2952A3 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 200, height: 200, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '100px 20px 80px', width: '100%' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '7px 14px', borderRadius: 20, marginBottom: 22 }}>
              <span style={{ color: '#fbbf24', fontSize: 12 }}>★★★★★</span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>Inmobiliaria líder en Bogotá</span>
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
              Encuentra el inmueble{' '}
              <span style={{ color: '#fbbf24' }}>perfecto</span>{' '}
              para ti
            </h1>

            <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.8)', marginBottom: 36, lineHeight: 1.7, maxWidth: 540 }}>
              Más de 100 propiedades disponibles en arriendo y venta. Asesores expertos que te acompañan en cada paso del proceso.
            </p>

            {/* Buscador */}
            <div style={{ background: 'white', borderRadius: 14, padding: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginBottom: 28 }}>
              <div className="hero-buscador">
                <input
                  value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar por localidad o barrio..."
                  style={{ padding: '11px 14px', border: 'none', outline: 'none', fontSize: 14, borderRadius: 8, minWidth: 160 }}
                  onKeyDown={e => e.key === 'Enter' && handleBuscar()}
                />
                <select value={tipo} onChange={e => setTipo(e.target.value)}
                  style={{ padding: '11px 14px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                  <option value="">Tipo</option>
                  {['Apartamento', 'Casa', 'Local', 'Oficina', 'Bodega', 'Lote'].map(t => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
                <select value={operacion} onChange={e => setOperacion(e.target.value)}
                  style={{ padding: '11px 14px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                  <option value="">Operación</option>
                  <option value="arriendo">Arriendo</option>
                  <option value="venta">Venta</option>
                </select>
                <button onClick={handleBuscar} style={{ background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
                  <Search size={16} /> Buscar
                </button>
              </div>
            </div>

            {/* Zonas rápidas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ZONAS.map(zona => (
                <button key={zona} onClick={() => navigate(`/propiedades?localidad=${zona}`)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                  📍 {zona}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats flotantes — solo desktop */}
        <div className="hero-stats">
          {[
            { num: '+100', label: 'Propiedades activas' },
            { num: '+500', label: 'Clientes satisfechos' },
            { num: '4.9★', label: 'Calificación' },
          ].map(({ num, label }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '14px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROPIEDADES DESTACADAS */}
      {destacadas.length > 0 && (
        <section style={{ padding: '72px 0', background: '#f8f9fb' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 44 }}>
              <div style={{ display: 'inline-block', background: '#1B3A6B15', color: '#1B3A6B', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
                Propiedades seleccionadas
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Inmuebles Destacados</h2>
              <p style={{ color: '#6b7280', fontSize: 15, marginTop: 10 }}>Las mejores oportunidades del mercado</p>
            </div>
            <div className="destacadas-grid">
              {destacadas.map(p => <TarjetaPropiedad key={p.id} propiedad={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Link to="/propiedades" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B3A6B', color: 'white', padding: '13px 28px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Ver todas las propiedades →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SERVICIOS */}
      <section style={{ padding: '72px 0', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>¿Por qué elegir HMR?</h2>
            <p style={{ color: '#6b7280', fontSize: 15, marginTop: 10 }}>Expertos en el sector inmobiliario con años de experiencia</p>
          </div>
          <div className="servicios-grid">
            {[
              { icon: <Home size={26} />, titulo: 'Amplio Portafolio', desc: 'Más de 100 propiedades en Bogotá y municipios cercanos en arriendo y venta.' },
              { icon: <Handshake size={26} />, titulo: 'Asesoría Personalizada', desc: 'Nuestros asesores te acompañan en cada paso, desde la búsqueda hasta la firma.' },
              { icon: <Star size={26} />, titulo: 'Calidad Garantizada', desc: 'Todas las propiedades son verificadas y cuentan con documentación en regla.' },
              { icon: <Shield size={26} />, titulo: 'Confianza y Seguridad', desc: 'Empresa legalmente constituida con NIT propio y contratos transparentes.' },
            ].map(({ icon, titulo, desc }) => (
              <div key={titulo} style={{ padding: 26, borderRadius: 16, border: '1px solid #e8ecf0', textAlign: 'center', transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(27,58,107,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                <div style={{ width: 60, height: 60, background: '#1B3A6B12', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: '#1B3A6B' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{titulo}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 20px', background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', marginBottom: 14 }}>¿Listo para encontrar tu inmueble ideal?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 32 }}>Contáctanos hoy y un asesor te atenderá de inmediato</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#25D366', color: 'white', padding: '13px 26px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            <MessageCircle size={20} /> WhatsApp
          </a>
          <Link to="/propiedades"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', color: 'white', padding: '13px 26px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: '2px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
            Ver propiedades →
          </Link>
        </div>
      </section>

      {/* WhatsApp flotante */}
      <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, width: 54, height: 54, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999 }}>
        <MessageCircle size={26} color="white" />
      </a>
    </div>
  );
};

export default HomePage;