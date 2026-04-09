import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Ruler, MapPin } from 'lucide-react';
import { Propiedad } from '../types';

const formatPrecio = (precio: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(precio);

const TarjetaPropiedad = ({ propiedad }: { propiedad: Propiedad }) => {
  const imagen = propiedad.imagenPrincipal || propiedad.imagenes?.[0] || null;

  return (
    <Link to={`/propiedades/${propiedad.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'white', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(27,58,107,0.08)',
        transition: 'all 0.3s ease', cursor: 'pointer',
        border: '1px solid rgba(27,58,107,0.06)',
        height: '100%',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(27,58,107,0.15)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(27,58,107,0.08)';
        }}
      >
        {/* Imagen */}
        <div style={{ position: 'relative', height: 210, overflow: 'hidden', background: '#e8ecf0' }}>
          {imagen ? (
            <img src={imagen} alt={propiedad.titulo}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1B3A6B15, #2952A315)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1B3A6B" strokeWidth="1.5" opacity={0.4}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
          )}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              background: propiedad.operacion === 'arriendo' ? '#1B3A6B' : '#059669',
              color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            }}>
              {propiedad.operacion === 'arriendo_venta' ? 'Arriendo/Venta' : propiedad.operacion}
            </span>
            <span style={{ background: 'white', color: '#374151', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
              {propiedad.tipo}
            </span>
          </div>
          {propiedad.destacada && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#f59e0b', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              ⭐ Destacado
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '18px' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {propiedad.titulo}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: 13, marginBottom: 14 }}>
            <MapPin size={12} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {propiedad.localidad}{propiedad.barrio ? `, ${propiedad.barrio}` : ''}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
            {propiedad.habitaciones != null && propiedad.habitaciones > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                <Bed size={13} color="#1B3A6B" /><span>{propiedad.habitaciones} hab.</span>
              </div>
            )}
            {propiedad.banos != null && propiedad.banos > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                <Bath size={13} color="#1B3A6B" /><span>{propiedad.banos} baños</span>
              </div>
            )}
            {propiedad.area != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
                <Ruler size={13} color="#1B3A6B" /><span>{propiedad.area} m²</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#1B3A6B' }}>{formatPrecio(propiedad.precio)}</div>
              <div style={{ fontSize: 11, color: '#6b7280' }}>
                {propiedad.operacion === 'arriendo' ? '/mes' : 'precio venta'}
              </div>
            </div>
            <div style={{ background: '#1B3A6B', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
              Ver más
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TarjetaPropiedad;