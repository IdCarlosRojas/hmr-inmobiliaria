import React, { useState } from 'react';
import { crearCita } from '../services/api';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Check } from 'lucide-react';

const ContactoPage = () => {
  const [form, setForm] = useState({
    nombre: '', email: '', telefono: '', mensaje: '', fecha: '', hora: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.telefono || !form.mensaje) {
      setError('Por favor completa todos los campos obligatorios'); return;
    }
    setEnviando(true);
    setError('');
    try {
      await crearCita({
        clienteNombre: form.nombre,
        clienteEmail: form.email,
        clienteTelefono: form.telefono,
        mensaje: form.mensaje,
        propiedadId: null,
        propiedadTitulo: 'Consulta general',
        fecha: form.fecha || new Date().toISOString().split('T')[0],
        hora: form.hora || '10:00',
      });
      setEnviado(true);
    } catch {
      setError('Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', border: '2px solid #e8ecf0',
    borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', background: 'white',
  };

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: '#f8f9fb' }}>
      <style>{`
        .contacto-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 32px;
          align-items: flex-start;
        }
        .contacto-fecha-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 820px) {
          .contacto-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .contacto-fecha-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', padding: '48px 24px 36px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: 'white', marginBottom: 10 }}>Contáctanos</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
            Estamos listos para ayudarte a encontrar el inmueble ideal
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        <div className="contacto-grid">

          {/* Info */}
          <div>
            <div style={{ background: 'white', borderRadius: 20, padding: 28, border: '1px solid #e8ecf0', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 22 }}>Información de contacto</h2>
              {[
                { icon: <Phone size={18} color="#1B3A6B" />, titulo: 'Teléfono / WhatsApp', valor: '+57 320 279 7261', link: 'https://wa.me/573202797261' },
                { icon: <Mail size={18} color="#1B3A6B" />, titulo: 'Correo electrónico', valor: 'grupoinmobiliariohmr@gmail.com', link: 'mailto:grupoinmobiliariohmr@gmail.com' },
                { icon: <MapPin size={18} color="#1B3A6B" />, titulo: 'Ubicación', valor: 'Bogotá D.C., Colombia', link: null },
                { icon: <Clock size={18} color="#1B3A6B" />, titulo: 'Horario de atención', valor: 'Lun–Vie: 8am–6pm · Sáb: 9am–2pm', link: null },
              ].map(({ icon, titulo, valor, link }) => (
                <div key={titulo} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ width: 42, height: 42, background: '#f0f4ff', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, marginBottom: 2 }}>{titulo}</div>
                    {link ? (
                      <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#1B3A6B', fontWeight: 600, textDecoration: 'none' }}>{valor}</a>
                    ) : (
                      <div style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{valor}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <a href="https://wa.me/573202797261?text=Hola, me gustaría recibir información sobre sus propiedades"
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: 'white', padding: '15px', borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              <MessageCircle size={20} /> Escríbenos por WhatsApp
            </a>
          </div>

          {/* Formulario */}
          <div style={{ background: 'white', borderRadius: 20, padding: '32px 28px', border: '1px solid #e8ecf0' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Envíanos un mensaje</h2>
            <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 24 }}>Te respondemos en menos de 24 horas hábiles</p>

            {enviado ? (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <div style={{ width: 68, height: 68, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                  <Check size={32} color="#059669" />
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 800, color: '#111827', marginBottom: 8 }}>¡Mensaje enviado!</h3>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 22 }}>Un asesor se comunicará contigo pronto.</p>
                <button onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', telefono: '', mensaje: '', fecha: '', hora: '' }); }}
                  style={{ background: '#1B3A6B', color: 'white', border: 'none', padding: '11px 26px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleEnviar}>
                {error && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '11px 14px', borderRadius: 8, marginBottom: 18, fontSize: 13 }}>
                    {error}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nombre completo *</label>
                    <input style={inputStyle} placeholder="Tu nombre"
                      value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                      onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Teléfono *</label>
                    <input style={inputStyle} placeholder="300 000 0000" type="tel"
                      value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                      onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Correo electrónico *</label>
                  <input style={inputStyle} placeholder="correo@ejemplo.com" type="email"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                    onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                </div>

                <div className="contacto-fecha-grid" style={{ marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Fecha preferida (opcional)</label>
                    <input style={inputStyle} type="date" value={form.fecha}
                      onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                      onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Hora preferida (opcional)</label>
                    <input style={inputStyle} type="time" value={form.hora}
                      onChange={e => setForm(p => ({ ...p, hora: e.target.value }))}
                      onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                      onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                  </div>
                </div>

                <div style={{ marginBottom: 22 }}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Mensaje *</label>
                  <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={4}
                    placeholder="¿En qué podemos ayudarte? Cuéntanos qué tipo de inmueble buscas, tu presupuesto, zona de interés..."
                    value={form.mensaje} onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = '#1B3A6B'}
                    onBlur={e => e.target.style.borderColor = '#e8ecf0'} />
                </div>

                <button type="submit" disabled={enviando}
                  style={{ width: '100%', padding: '14px', background: enviando ? '#94a3b8' : '#1B3A6B', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: enviando ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Send size={17} /> {enviando ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp flotante */}
      <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, width: 54, height: 54, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999 }}>
        <MessageCircle size={26} color="white" />
      </a>
    </div>
  );
};

export default ContactoPage;