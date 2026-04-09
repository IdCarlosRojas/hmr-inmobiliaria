import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#0f2244', color: '#94a3b8', paddingTop: 48 }}>
    <style>{`
      .footer-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 40px;
        padding-bottom: 40px;
      }
      @media (max-width: 900px) {
        .footer-grid { grid-template-columns: repeat(2, 1fr); gap: 28px; }
      }
      @media (max-width: 500px) {
        .footer-grid { grid-template-columns: 1fr; gap: 24px; }
      }
      .footer-bottom {
        border-top: 1px solid rgba(255,255,255,0.08);
        padding: 20px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }
    `}</style>

    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
      <div className="footer-grid">

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <img src="/logo.png" alt="HMR" style={{ height: 34, filter: 'brightness(0) invert(1)' }}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>GRUPO INMOBILIARIO HMR</div>
              <div style={{ fontSize: 11, letterSpacing: '1px' }}>Su propiedad en manos seguras</div>
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>
            Empresa con experiencia en el sector inmobiliario, comprometida con encontrar el inmueble perfecto para cada cliente.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="https://www.facebook.com/GrupoInmobiliarioHmr" target="_blank" rel="noreferrer"
              style={{ width: 36, height: 36, background: '#1877f2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
              f
            </a>
            <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
              style={{ width: 36, height: 36, background: '#25D366', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Navegación</h4>
          {[['/', 'Inicio'], ['/propiedades', 'Propiedades'], ['/nosotros', 'Nosotros'], ['/contacto', 'Contacto']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 9, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Propiedades</h4>
          {[
            ['/propiedades?operacion=arriendo', 'En Arriendo'],
            ['/propiedades?operacion=venta', 'En Venta'],
            ['/propiedades?tipo=apartamento', 'Apartamentos'],
            ['/propiedades?tipo=local', 'Locales Comerciales'],
            ['/propiedades?tipo=casa', 'Casas'],
          ].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 9, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Contacto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              { icon: <MapPin size={13} />, text: 'Cra 16 #53-38, Galerías, Bogotá' },
              { icon: <Phone size={13} />, text: '320 279 7261' },
              { icon: <Mail size={13} />, text: 'grupoinmobiliariohmr@gmail.com' },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <span style={{ color: '#3b82f6', marginTop: 1, flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              <div>Lun-Vie: 8am – 6pm</div>
              <div>Sáb: 9am – 1pm</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={{ fontSize: 12, margin: 0 }}>© 2024 Grupo Inmobiliario HMR S.A.S. — NIT 901944784-5</p>
        <p style={{ fontSize: 12, margin: 0 }}>Todos los derechos reservados</p>
      </div>
    </div>
  </footer>
);

export default Footer;