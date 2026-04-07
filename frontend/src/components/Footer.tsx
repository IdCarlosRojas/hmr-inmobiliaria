import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#0f2244', color: '#94a3b8', paddingTop: 60 }}>
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, paddingBottom: 40 }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <img src="/logo.png" alt="HMR" style={{ height: 36, filter: 'brightness(0) invert(1)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>GRUPO INMOBILIARIO HMR</div>
              <div style={{ fontSize: 11, letterSpacing: '1px' }}>Su propiedad en manos seguras</div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Empresa con experiencia en el sector inmobiliario, comprometida con encontrar el inmueble perfecto para cada cliente.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a href="https://www.facebook.com/GrupoInmobiliarioHmr" target="_blank" rel="noreferrer"
              style={{ width: 36, height: 36, background: '#1877f2', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              b<Globe size={16} />
            </a>
            <a href="https://wa.me/573202797261" target="_blank" rel="noreferrer"
              style={{ width: 36, height: 36, background: '#25D366', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Navegación</h4>
          {[['/', 'Inicio'], ['/propiedades', 'Propiedades'], ['/nosotros', 'Nosotros'], ['/contacto', 'Contacto']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display: 'block', color: '#94a3b8', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Propiedades</h4>
          {[['arriendo', 'En Arriendo'], ['venta', 'En Venta'], ['apartamento', 'Apartamentos'], ['local', 'Locales Comerciales'], ['casa', 'Casas']].map(([op, label]) => (
            <Link key={op} to={`/propiedades?operacion=${op}`} style={{ display: 'block', color: '#94a3b8', fontSize: 14, marginBottom: 10 }}>
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Contacto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: <MapPin size={14} />, text: 'Cra 16 #53-38, Galerías, Bogotá' },
              { icon: <Phone size={14} />, text: '320 279 7261' },
              { icon: <Mail size={14} />, text: 'grupoinmobiliariohmr@gmail.com' },
            ].map(({ icon, text }, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14 }}>
                <span style={{ color: '#3b82f6', marginTop: 2, flexShrink: 0 }}>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
            <div style={{ fontSize: 13, marginTop: 4 }}>
              <div>Lun-Vie: 8am - 6pm</div>
              <div>Sáb: 9am - 1pm</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 13 }}>© 2024 Grupo Inmobiliario HMR S.A.S. — NIT 901944784-5</p>
        <p style={{ fontSize: 13 }}>Todos los derechos reservados</p>
      </div>
    </div>
  </footer>
);

export default Footer;