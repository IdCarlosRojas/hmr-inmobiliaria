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
  const [formCita, setFormCita] = useState({ nombre: '', email: '', telefono: '', fecha: '', hora: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [citaEnviada, setCitaEnviada] = useState(false);

  useEffect(() => {
    if (id) getPropiedadById(+id).then(r => { setPropiedad(r.data); setCargando(false); }).catch(() => setCargando(false));
  }, [id]);

  const handleCita = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const { crearCita } = await import('../services/api');
      await crearCita({ ...formCita, propiedadId: propiedad?.id, propiedadTitulo: propiedad?.titulo });
      setCitaEnviada(true);
    } catch { alert('Error al enviar la cita'); }
    finally { setEnviando(false); }
  };

  if (cargando) return <div style={{ paddingTop: 120, textAlign: 'center', fontSize: 18, color: '#6b7280' }}>Cargando propiedad...</div>;
  if (!propiedad) return <div style={{ paddingTop: 120, textAlign: 'center' }}>Propiedad no encontrada</div>;

  const imagenes = propiedad.imagenes?.length ? propiedad.imagenes : propiedad.imagenPrincipal ? [propiedad.imagenPrincipal] : [];
  const caracteristicas = propiedad.caracteristicas?.split(',').map(c => c.trim()).filter(Boolean) || [];
  const mensajeWA = `Hola, estoy interesado en la propiedad: *${propiedad.titulo}* (ID: ${propiedad.id}). ¿Pueden darme más información?`;

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: '#f8f9fb' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <Link to="/propiedades" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#1B3A6B', fontWeight: 600, marginBottom: 24, fontSize: 14 }}>
          <ArrowLeft size={12} /> Volver a propiedades
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'flex-start' }}>
          {/* Columna izquierda */}
          <div>
            {/* Galería */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)' }}>
              <div style={{ height: 420, background: '#e8ecf0', position: 'relative', overflow: 'hidden' }}>
                {imagenes.length > 0 ? (
                  <img src={imagenes[imagenActiva]} alt={propiedad.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B3A6B15, #2952A315)' }}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1" opacity={0.3}>
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
                    </svg>
                  </div>
                )}
                <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                  <span style={{ background: propiedad.operacion === 'arriendo' ? '#1B3A6B' : '#059669', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>
                    {propiedad.operacion}
                  </span>
                  <span style={{ background: 'white', color: '#374151', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                    {propiedad.tipo}
                  </span>
                </div>
              </div>
              {imagenes.length > 1 && (
                <div style={{ display: 'flex', gap: 8, padding: 12, overflowX: 'auto' }}>
                  {imagenes.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImagenActiva(i)}
                      style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: i === imagenActiva ? '3px solid #1B3A6B' : '3px solid transparent', flexShrink: 0 }} />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ background: 'white', borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)' }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 12 }}>{propiedad.titulo}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280', fontSize: 15, marginBottom: 20 }}>
                <MapPin size={14} color="#1B3A6B" />
                <span>{propiedad.localidad}{propiedad.barrio ? `, ${propiedad.barrio}` : ''}{propiedad.direccion ? ` — ${propiedad.direccion}` : ''}</span>
              </div>

              <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                {propiedad.habitaciones != null && propiedad.habitaciones > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f8f9fb', borderRadius: 10 }}>
                   <Bed size={18} color="#1B3A6B" />
                    <div><div style={{ fontSize: 16, fontWeight: 700 }}>{propiedad.habitaciones}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Habitaciones</div></div>
                  </div>
                )}
                {propiedad.banos != null && propiedad.banos > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f8f9fb', borderRadius: 10 }}>
                    <Bath size={18} color="#1B3A6B" />
                    <div><div style={{ fontSize: 16, fontWeight: 700 }}>{propiedad.banos}</div><div style={{ fontSize: 12, color: '#6b7280' }}>Baños</div></div>
                  </div>
                )}
                {propiedad.area != null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f8f9fb', borderRadius: 10 }}>
                    <Ruler size={18} color="#1B3A6B" />
                    <div><div style={{ fontSize: 16, fontWeight: 700 }}>{propiedad.area} m²</div><div style={{ fontSize: 12, color: '#6b7280' }}>Área</div></div>
                  </div>
                )}
              </div>

              {propiedad.descripcion && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Descripción</h3>
                  <p style={{ color: '#374151', lineHeight: 1.7, fontSize: 15 }}>{propiedad.descripcion}</p>
                </div>
              )}

              {caracteristicas.length > 0 && (
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Características</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {caracteristicas.map((c, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f4ff', color: '#1B3A6B', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500 }}>
                        <Check size={10} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div style={{ position: 'sticky', top: 90 }}>
            {/* Precio */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0' }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>
                {formatPrecio(propiedad.precio)}
              </div>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
                {propiedad.operacion === 'arriendo' ? 'por mes' : 'precio de venta'}
              </div>
              <a href={`https://wa.me/573202797261?text=${encodeURIComponent(mensajeWA)}`} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: 'white', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 15, marginBottom: 10, textDecoration: 'none' }}>
                <MessageCircle size={20} /> Consultar por WhatsApp
              </a>
              <a href="tel:+573202797261"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1B3A6B', color: 'white', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                <Phone size={16} /> Llamar ahora
              </a>
            </div>

            {/* Formulario cita */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Agendar visita</h3>
              {citaEnviada ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                  <div style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>¡Cita agendada!</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>Nos comunicaremos contigo pronto</div>
                </div>
              ) : (
                <form onSubmit={handleCita}>
                  {[
                    { key: 'nombre', placeholder: 'Tu nombre completo', type: 'text' },
                    { key: 'email', placeholder: 'Tu correo electrónico', type: 'email' },
                    { key: 'telefono', placeholder: 'Tu teléfono', type: 'tel' },
                    { key: 'fecha', placeholder: '', type: 'date' },
                    { key: 'hora', placeholder: '', type: 'time' },
                  ].map(({ key, placeholder, type }) => (
                    <input key={key} type={type} placeholder={placeholder} required
                      value={formCita[key as keyof typeof formCita]}
                      onChange={e => setFormCita(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 10, boxSizing: 'border-box' }} />
                  ))}
                  <textarea placeholder="Mensaje (opcional)" rows={3}
                    value={formCita.mensaje} onChange={e => setFormCita(prev => ({ ...prev, mensaje: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 13, outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
                  <button type="submit" disabled={enviando}
                    style={{ width: '100%', padding: '12px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                    {enviando ? 'Enviando...' : 'Solicitar visita'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadDetallePage;