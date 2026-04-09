import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropiedadById } from '../services/api';
import { Propiedad } from '../types';
import { Bed, Bath, Ruler, MapPin, MessageCircle, Phone, ArrowLeft, Check } from 'lucide-react';

const formatPrecio = (precio: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);

const PropiedadDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [cargando, setCargando] = useState(true);
  const [imagenActiva, setImagenActiva] = useState(0);

  useEffect(() => {
    if (id) getPropiedadById(+id)
      .then(r => { setPropiedad(r.data); setCargando(false); })
      .catch(() => setCargando(false));
  }, [id]);

  if (cargando) return <div style={{ paddingTop: 120, textAlign: 'center', fontSize: 18, color: '#6b7280' }}>Cargando propiedad...</div>;
  if (!propiedad) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Propiedad no encontrada</div>;

  const imagenes = propiedad.imagenes?.length ? propiedad.imagenes : propiedad.imagenPrincipal ? [propiedad.imagenPrincipal] : [];
  const caracteristicas = propiedad.caracteristicas?.split(',').map(c => c.trim()).filter(Boolean) || [];
  const mensajeWA = `Hola, estoy interesado en la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Me pueden dar más información y agendar una visita?`;

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: '#f8f9fb' }}>
      <style>{`
        .detalle-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: flex-start;
        }
        .detalle-sticky { position: sticky; top: 90px; }
        .detalle-galeria { height: 420px; }
        @media (max-width: 860px) {
          .detalle-grid { grid-template-columns: 1fr; }
          .detalle-sticky { position: static; }
          .detalle-galeria { height: 260px; }
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
        <Link to="/propiedades" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1B3A6B', fontWeight: 600, marginBottom: 20, fontSize: 14 }}>
          <ArrowLeft size={14} /> Volver a propiedades
        </Link>

        <div className="detalle-grid">
          {/* Columna izquierda */}
          <div>
            {/* Galería */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 2px 16px rgba(27,58,107,0.06)' }}>
              <div className="detalle-galeria" style={{ background: '#e8ecf0', position: 'relative', overflow: 'hidden' }}>
                {imagenes.length > 0 ? (
                  <img src={imagenes[imagenActiva]} alt={propiedad.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B3A6B15, #2952A315)' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1" opacity={0.3}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                  <span style={{ background: propiedad.operacion === 'arriendo' ? '#1B3A6B' : '#059669', color: 'white', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    {propiedad.operacion}
                  </span>
                  <span style={{ background: 'white', color: '#374151', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                    {propiedad.tipo}
                  </span>
                </div>
              </div>
              {imagenes.length > 1 && (
                <div style={{ display: 'flex', gap: 8, padding: 10, overflowX: 'auto' }}>
                  {imagenes.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImagenActiva(i)}
                      style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 6, cursor: 'pointer', border: i === imagenActiva ? '3px solid #1B3A6B' : '3px solid transparent', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px 20px', marginBottom: 20, boxShadow: '0 2px 16px rgba(27,58,107,0.06)' }}>
              <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#111827', marginBottom: 10 }}>{propiedad.titulo}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 14, marginBottom: 18 }}>
                <MapPin size={13} color="#1B3A6B" />
                <span>{propiedad.localidad}{propiedad.barrio ? `, ${propiedad.barrio}` : ''}{propiedad.direccion ? ` — ${propiedad.direccion}` : ''}</span>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                {propiedad.habitaciones != null && propiedad.habitaciones > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                    <Bed size={16} color="#1B3A6B" />
                    <div><div style={{ fontSize: 15, fontWeight: 700 }}>{propiedad.habitaciones}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Habitaciones</div></div>
                  </div>
                )}
                {propiedad.banos != null && propiedad.banos > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                    <Bath size={16} color="#1B3A6B" />
                    <div><div style={{ fontSize: 15, fontWeight: 700 }}>{propiedad.banos}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Baños</div></div>
                  </div>
                )}
                {propiedad.area != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#f8f9fb', borderRadius: 10 }}>
                    <Ruler size={16} color="#1B3A6B" />
                    <div><div style={{ fontSize: 15, fontWeight: 700 }}>{propiedad.area} m²</div><div style={{ fontSize: 11, color: '#6b7280' }}>Área</div></div>
                  </div>
                )}
              </div>

              {propiedad.descripcion && (
                <div style={{ marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>Descripción</h3>
                  <p style={{ color: '#374151', lineHeight: 1.7, fontSize: 14 }}>{propiedad.descripcion}</p>
                </div>
              )}

              {caracteristicas.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Características</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {caracteristicas.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f0f4ff', color: '#1B3A6B', padding: '5px 12px', borderRadius: 20, fontSize: 13 }}>
                        <Check size={10} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="detalle-sticky">
            {/* Precio */}
            <div style={{ background: 'white', borderRadius: 16, padding: 22, marginBottom: 14, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>
                {formatPrecio(propiedad.precio)}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 18 }}>
                {propiedad.operacion === 'arriendo' ? 'por mes' : 'precio de venta'}
              </div>
              <a href={`https://wa.me/573202797261?text=${encodeURIComponent(mensajeWA)}`} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: 'white', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, marginBottom: 10, textDecoration: 'none' }}>
                <MessageCircle size={20} /> Consultar por WhatsApp
              </a>
              <a href="tel:+573202797261"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1B3A6B', color: 'white', padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <Phone size={16} /> Llamar ahora
              </a>
            </div>

            {/* Contacto */}
            <div style={{ background: 'white', borderRadius: 16, padding: 22, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 8 }}>¿Te interesa esta propiedad?</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 18, lineHeight: 1.6 }}>
                Contáctanos y un asesor te ayudará a agendar una visita.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href={`https://wa.me/573202797261?text=${encodeURIComponent(mensajeWA)}`} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, textDecoration: 'none', color: '#166534', fontWeight: 600, fontSize: 13 }}>
                  <MessageCircle size={16} color="#25D366" />
                  <div><div style={{ fontWeight: 700 }}>WhatsApp</div><div style={{ fontSize: 11, color: '#6b7280' }}>Respuesta inmediata</div></div>
                </a>
                <a href="tel:+573202797261"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, textDecoration: 'none', color: '#1e40af', fontWeight: 600, fontSize: 13 }}>
                  <Phone size={16} color="#1B3A6B" />
                  <div><div style={{ fontWeight: 700 }}>320 279 7261</div><div style={{ fontSize: 11, color: '#6b7280' }}>Lun–Vie 8am–6pm · Sáb 9am–2pm</div></div>
                </a>
                <Link to="/contacto"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px 14px', background: '#1B3A6B', borderRadius: 10, textDecoration: 'none', color: 'white', fontWeight: 600, fontSize: 13 }}>
                  Enviar mensaje
                </Link>
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 14, marginBottom: 0 }}>
                Las visitas son coordinadas por nuestros asesores
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadDetallePage;