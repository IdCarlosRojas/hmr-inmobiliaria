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
      {/* HERO */}
      <section style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2244 0%, #1B3A6B 60%, #2952A3 100%)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 200, height: 200, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          <div style={{ maxWidth: 700 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '8px 16px', borderRadius: 20, marginBottom: 24 }}>
              <span style={{ color: '#fbbf24', fontSize: 12 }}>★★★★★</span>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>Inmobiliaria líder en Bogotá</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px' }}>
              Encuentra el inmueble{' '}
              <span style={{ color: '#fbbf24' }}>perfecto</span>{' '}
              para ti
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', marginBottom: 40, lineHeight: 1.7, maxWidth: 560 }}>
              Más de 100 propiedades disponibles en arriendo y venta. Asesores expertos que te acompañan en cada paso del proceso.
            </p>

            {/* Buscador */}
            <div style={{ background: 'white', borderRadius: 16, padding: 8, display: 'flex', gap: 8, flexWrap: 'wrap', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', marginBottom: 32 }}>
              <input
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por localidad o barrio..."
                style={{ flex: 1, minWidth: 180, padding: '12px 16px', border: 'none', outline: 'none', fontSize: 14, borderRadius: 10 }}
                onKeyDown={e => e.key === 'Enter' && handleBuscar()}
              />
              <select value={tipo} onChange={e => setTipo(e.target.value)}
                style={{ padding: '12px 16px', border: '1px solid #e8ecf0', borderRadius: 10, fontSize: 14, outline: 'none', background: 'white' }}>
                <option value="">Tipo</option>
                {['Apartamento', 'Casa', 'Local', 'Oficina', 'Bodega', 'Lote'].map(t => (
                  <option key={t} value={t.toLowerCase()}>{t}</option>
                ))}
              </select>
              <select value={operacion} onChange={e => setOperacion(e.target.value)}
                style={{ padding: '12px 16px', border: '1px solid #e8ecf0', borderRadius: 10, fontSize: 14, outline: 'none', background: 'white' }}>
                <option value="">Operación</option>
                <option value="arriendo">Arriendo</option>
                <option value="venta">Venta</option>
              </select>
              <button onClick={handleBuscar} style={{ background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Search size={16} /> Buscar
              </button>
            </div>

            {/* Zonas rápidas */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {ZONAS.map(zona => (
                <button key={zona} onClick={() => navigate(`/propiedades?localidad=${zona}`)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: 20, fontSize: 13, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
                  📍 {zona}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats flotantes */}
        <div style={{ position: 'absolute', right: 48, bottom: 80, display: 'flex', flexDirection: 'column', gap: 12 }}>
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
        <section style={{ padding: '80px 0', background: '#f8f9fb' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ display: 'inline-block', background: '#1B3A6B15', color: '#1B3A6B', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                Propiedades seleccionadas
              </div>
              <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Inmuebles Destacados</h2>
              <p style={{ color: '#6b7280', fontSize: 16, marginTop: 12 }}>Las mejores oportunidades del mercado, seleccionadas para ti</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
              {destacadas.map(p => <TarjetaPropiedad key={p.id} propiedad={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <Link to="/propiedades" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1B3A6B', color: 'white', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600 }}>
                Ver todas las propiedades →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SERVICIOS */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>¿Por qué elegir HMR?</h2>
            <p style={{ color: '#6b7280', fontSize: 16, marginTop: 12 }}>Expertos en el sector inmobiliario con años de experiencia</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
            {[
              { icon: <Home size={28} />, titulo: 'Amplio Portafolio', desc: 'Más de 100 propiedades en Bogotá y municipios cercanos en arriendo y venta.' },
              { icon: <Handshake size={28} />, titulo: 'Asesoría Personalizada', desc: 'Nuestros asesores te acompañan en cada paso, desde la búsqueda hasta la firma.' },
              { icon: <Star size={28} />, titulo: 'Calidad Garantizada', desc: 'Todas las propiedades son verificadas y cuentan con documentación en regla.' },
              { icon: <Shield size={28} />, titulo: 'Confianza y Seguridad', desc: 'Empresa legalmente constituida con NIT propio y contratos transparentes.' },
            ].map(({ icon, titulo, desc }) => (
              <div key={titulo} style={{ padding: 28, borderRadius: 16, border: '1px solid #e8ecf0', textAlign: 'center', transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(27,58,107,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                <div style={{ width: 64, height: 64, background: '#1B3A6B12', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#1B3A6B' }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{titulo}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 16 }}>¿Listo para encontrar tu inmueble ideal?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 36 }}>Contáctanos hoy y un asesor te atenderá de inmediato</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700 }}>
            <MessageCircle size={20} /> Escríbenos por WhatsApp
          </a>
          <Link to="/propiedades"
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: '2px solid rgba(255,255,255,0.3)' }}>
            Ver propiedades →
          </Link>
        </div>
      </section>

      {/* WhatsApp flotante */}
      <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999, transition: 'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)'}
        onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'}>
        <MessageCircle size={28} color="white" />
      </a>
    </div>
  );
};

export default HomePage;