import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Star, Handshake, Users, MapPin, Phone, Mail, MessageCircle, Award, TrendingUp, Heart } from 'lucide-react';

const NosotrosPage = () => {
  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: '#f8f9fb' }}>
      <style>{`
        .nosotros-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        .nosotros-valores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .nosotros-equipo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .nosotros-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) {
          .nosotros-hero-grid { grid-template-columns: 1fr; gap: 32px; }
          .nosotros-valores-grid { grid-template-columns: repeat(2, 1fr); }
          .nosotros-equipo-grid { grid-template-columns: repeat(2, 1fr); }
          .nosotros-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 540px) {
          .nosotros-valores-grid { grid-template-columns: 1fr; }
          .nosotros-equipo-grid { grid-template-columns: 1fr; }
          .nosotros-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #0f2244 0%, #1B3A6B 60%, #2952A3 100%)', padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="nosotros-hero-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: 20, marginBottom: 20 }}>
                <Star size={13} color="#fbbf24" fill="#fbbf24" />
                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>Desde 2018 en el mercado</span>
              </div>
              <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                Tu propiedad en<br />
                <span style={{ color: '#fbbf24' }}>manos seguras</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
                Somos una empresa inmobiliaria bogotana comprometida con conectar a las personas con el inmueble que realmente necesitan, con transparencia, experiencia y atención personalizada.
              </p>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link to="/propiedades" style={{
                  background: '#fbbf24', color: '#0f2244', padding: '13px 28px',
                  borderRadius: 10, fontWeight: 800, fontSize: 15, textDecoration: 'none',
                }}>
                  Ver propiedades
                </Link>
                <Link to="/contacto" style={{
                  background: 'rgba(255,255,255,0.1)', color: 'white', padding: '13px 28px',
                  borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  Contáctanos
                </Link>
              </div>
            </div>

            {/* Card empresa */}
            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <img src="/logo.png" alt="HMR" style={{ height: 52, filter: 'brightness(0) invert(1)' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>GRUPO INMOBILIARIO HMR</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>S.A.S.</div>
                </div>
              </div>
              {[
                { label: 'NIT', valor: '901944784-5' },
                { label: 'Registro Cámara de Comercio', valor: 'Activo' },
                { label: 'Dirección', valor: 'Cra 16 #53-38, Galerías, Bogotá' },
                { label: 'Teléfono', valor: '320 279 7261' },
                { label: 'Correo', valor: 'grupoinmobiliariohmr@gmail.com' },
                { label: 'Horario', valor: 'Lun–Vie 8am–6pm · Sáb 9am–1pm' },
              ].map(({ label, valor }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: 13 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</span>
                  <span style={{ color: 'white', fontWeight: 600, textAlign: 'right', maxWidth: '55%' }}>{valor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ESTADÍSTICAS */}
      <section style={{ background: 'white', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="nosotros-stats-grid">
            {[
              { num: '+100', label: 'Propiedades activas', color: '#1B3A6B', icon: '🏠' },
              { num: '+500', label: 'Clientes satisfechos', color: '#059669', icon: '👥' },
              { num: '6+', label: 'Años de experiencia', color: '#f59e0b', icon: '📅' },
              { num: '4.9★', label: 'Calificación promedio', color: '#8b5cf6', icon: '⭐' },
            ].map(({ num, label, color, icon }) => (
              <div key={label} style={{ textAlign: 'center', padding: '28px 16px', borderRadius: 16, border: '1px solid #e8ecf0', background: '#fafafa' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 32, fontWeight: 900, color, marginBottom: 6 }}>{num}</div>
                <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section style={{ padding: '64px 24px', background: '#f8f9fb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#1B3A6B15', color: '#1B3A6B', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              Quiénes somos
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Misión y Visión</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'white', borderRadius: 20, padding: 36, border: '1px solid #e8ecf0', boxShadow: '0 2px 16px rgba(27,58,107,0.06)' }}>
              <div style={{ width: 52, height: 52, background: '#1B3A6B', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Heart size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 14 }}>Misión</h3>
              <p style={{ color: '#374151', lineHeight: 1.8, fontSize: 15 }}>
                Conectar a personas y empresas con el inmueble ideal, ofreciendo un servicio transparente, ágil y personalizado que genere confianza en cada paso del proceso inmobiliario. Trabajamos con compromiso, ética y profesionalismo para que cada cliente encuentre no solo una propiedad, sino un hogar o una oportunidad de negocio.
              </p>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #1B3A6B, #2952A3)', borderRadius: 20, padding: 36, color: 'white' }}>
              <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14 }}>Visión</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, fontSize: 15 }}>
                Ser reconocidos como la inmobiliaria de mayor confianza en Bogotá y la región, consolidándonos como referente del sector por nuestra excelencia en el servicio, innovación tecnológica y el impacto positivo que generamos en la vida de nuestros clientes y la comunidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#1B3A6B15', color: '#1B3A6B', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
              Lo que nos define
            </div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>Nuestros Valores</h2>
          </div>

          <div className="nosotros-valores-grid">
            {[
              { icon: <Shield size={26} />, titulo: 'Transparencia', desc: 'Actuamos con honestidad en cada negociación. Nuestros clientes conocen todos los detalles del proceso sin sorpresas.', color: '#1B3A6B', bg: '#eff6ff' },
              { icon: <Star size={26} />, titulo: 'Excelencia', desc: 'Nos esforzamos por superar las expectativas en cada servicio que prestamos, desde la primera consulta hasta la firma.', color: '#f59e0b', bg: '#fffbeb' },
              { icon: <Handshake size={26} />, titulo: 'Compromiso', desc: 'Nos involucramos completamente con cada cliente. Su satisfacción es nuestra prioridad y mayor motivación.', color: '#059669', bg: '#f0fdf4' },
              { icon: <Users size={26} />, titulo: 'Cercanía', desc: 'Tratamos a cada cliente como parte de nuestra familia. La atención personalizada es la base de todo lo que hacemos.', color: '#8b5cf6', bg: '#f5f3ff' },
              { icon: <Award size={26} />, titulo: 'Profesionalismo', desc: 'Contamos con asesores capacitados y actualizados en el mercado inmobiliario colombiano para darte la mejor asesoría.', color: '#dc2626', bg: '#fef2f2' },
              { icon: <TrendingUp size={26} />, titulo: 'Innovación', desc: 'Adoptamos tecnología y nuevas herramientas para que la experiencia de buscar o arrendar un inmueble sea más fácil.', color: '#0891b2', bg: '#ecfeff' },
            ].map(({ icon, titulo, desc, color, bg }) => (
              <div key={titulo} style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #e8ecf0', transition: 'all 0.3s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(27,58,107,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}>
                <div style={{ width: 52, height: 52, background: bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color, marginBottom: 16 }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{titulo}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section style={{ padding: '64px 24px', background: '#f8f9fb' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>¿Por qué elegir HMR?</h2>
            <p style={{ color: '#6b7280', fontSize: 16, marginTop: 10, maxWidth: 520, margin: '10px auto 0' }}>
              Más que una inmobiliaria, somos tu aliado estratégico en el mercado de finca raíz
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { titulo: 'Amplio portafolio', desc: 'Más de 100 propiedades en Bogotá y municipios cercanos: apartamentos, casas, locales, oficinas, bodegas y lotes en arriendo y venta.' },
              { titulo: 'Asesoría sin costo', desc: 'Nuestros asesores te orientan en todo el proceso sin cobros adicionales. Solo pagas cuando encuentras lo que buscas.' },
              { titulo: 'Contratos seguros', desc: 'Todos nuestros contratos son elaborados por profesionales y cumplen con la normativa colombiana vigente.' },
              { titulo: 'Atención postventa', desc: 'No desaparecemos después del contrato. Te acompañamos durante todo el tiempo de arriendo o después de la venta.' },
              { titulo: 'Empresa legalmente constituida', desc: 'Somos una S.A.S. registrada en Cámara de Comercio de Bogotá, con NIT activo y todos los documentos en regla.' },
              { titulo: 'Respuesta rápida', desc: 'Respondemos consultas en menos de 2 horas en horario laboral. También atendemos por WhatsApp para mayor comodidad.' },
            ].map(({ titulo, desc }) => (
              <div key={titulo} style={{ display: 'flex', gap: 16, background: 'white', padding: 24, borderRadius: 14, border: '1px solid #e8ecf0' }}>
                <div style={{ width: 10, height: 10, background: '#1B3A6B', borderRadius: '50%', flexShrink: 0, marginTop: 6 }} />
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{titulo}</h4>
                  <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: 'white', marginBottom: 14, letterSpacing: '-0.5px' }}>
            ¿Listo para dar el siguiente paso?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 17, marginBottom: 36, lineHeight: 1.6 }}>
            Habla con uno de nuestros asesores hoy mismo y encuentra el inmueble perfecto para ti o tu negocio.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/573202797261?text=Hola, quiero más información sobre sus servicios inmobiliarios"
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              <MessageCircle size={20} /> WhatsApp
            </a>
            <Link to="/propiedades"
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', color: 'white', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, border: '2px solid rgba(255,255,255,0.3)', textDecoration: 'none' }}>
              Ver propiedades →
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              <MapPin size={14} /> Cra 16 #53-38, Galerías, Bogotá
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              <Phone size={14} /> 320 279 7261
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              <Mail size={14} /> grupoinmobiliariohmr@gmail.com
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp flotante */}
      <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', zIndex: 999 }}>
        <MessageCircle size={28} color="white" />
      </a>
    </div>
  );
};

export default NosotrosPage;