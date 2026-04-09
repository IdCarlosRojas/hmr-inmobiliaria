import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPropiedades } from '../services/api';
import { Propiedad } from '../types';
import TarjetaPropiedad from '../components/TarjetaPropiedad';
import { Filter, ChevronDown } from 'lucide-react';

// Todas las localidades de Bogotá
const LOCALIDADES = [
  'Usaquén', 'Chapinero', 'Santa Fe', 'San Cristóbal', 'Usme',
  'Tunjuelito', 'Bosa', 'Kennedy', 'Fontibón', 'Engativá',
  'Suba', 'Barrios Unidos', 'Teusaquillo', 'Los Mártires', 'Antonio Nariño',
  'Puente Aranda', 'La Candelaria', 'Rafael Uribe Uribe', 'Ciudad Bolívar', 'Sumapaz',
  // Municipios cercanos
  'Zipaquirá', 'Chía', 'Cajicá', 'Sopó', 'La Calera',
  'Facatativá', 'Madrid', 'Mosquera', 'Funza', 'Cota',
  'Tabio', 'Tenjo', 'Tocancipá', 'Gachancipá', 'Sibaté',
];

const PropiedadesPage = () => {
  const [searchParams] = useSearchParams();
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: searchParams.get('tipo') || '',
    operacion: searchParams.get('operacion') || '',
    localidad: searchParams.get('localidad') || '',
    precioMin: '',
    precioMax: '',
  });
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  useEffect(() => { cargar(); }, [filtros]);

  const cargar = async () => {
    setCargando(true);
    try {
      const params: any = {};
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.operacion) params.operacion = filtros.operacion;
      if (filtros.localidad) params.localidad = filtros.localidad;
      if (filtros.precioMin) params.precioMin = filtros.precioMin;
      if (filtros.precioMax) params.precioMax = filtros.precioMax;
      const res = await getPropiedades(params);
      setPropiedades(res.data);
    } catch { setPropiedades([]); }
    finally { setCargando(false); }
  };

  const limpiarFiltros = () => setFiltros({ tipo: '', operacion: '', localidad: '', precioMin: '', precioMax: '' });
  const hayFiltros = Object.values(filtros).some(v => v !== '');

  const selectStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0',
    borderRadius: 8, fontSize: 14, outline: 'none', background: 'white',
  };

  const SidebarContent = () => (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Filtros</h3>
        {hayFiltros && (
          <button onClick={limpiarFiltros} style={{ background: 'none', border: 'none', color: '#1B3A6B', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
            Limpiar todo
          </button>
        )}
      </div>

      {[
        { label: 'Operación', key: 'operacion', options: [['', 'Todas'], ['arriendo', 'Arriendo'], ['venta', 'Venta']] },
        { label: 'Tipo de inmueble', key: 'tipo', options: [['', 'Todos'], ['apartamento', 'Apartamento'], ['casa', 'Casa'], ['local', 'Local'], ['oficina', 'Oficina'], ['bodega', 'Bodega'], ['lote', 'Lote'], ['finca', 'Finca']] },
      ].map(({ label, key, options }) => (
        <div key={key} style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</label>
          <select value={filtros[key as keyof typeof filtros]}
            onChange={e => setFiltros(prev => ({ ...prev, [key]: e.target.value }))}
            style={selectStyle}>
            {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
          </select>
        </div>
      ))}

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Localidad / Municipio</label>
        <select value={filtros.localidad}
          onChange={e => setFiltros(prev => ({ ...prev, localidad: e.target.value }))}
          style={selectStyle}>
          <option value="">Todas</option>
          <optgroup label="Localidades de Bogotá">
            {LOCALIDADES.slice(0, 20).map(l => <option key={l} value={l}>{l}</option>)}
          </optgroup>
          <optgroup label="Municipios cercanos">
            {LOCALIDADES.slice(20).map(l => <option key={l} value={l}>{l}</option>)}
          </optgroup>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Rango de precio</label>
        <input type="number" placeholder="Precio mínimo" value={filtros.precioMin}
          onChange={e => setFiltros(prev => ({ ...prev, precioMin: e.target.value }))}
          style={{ ...selectStyle, marginBottom: 8 }} />
        <input type="number" placeholder="Precio máximo" value={filtros.precioMax}
          onChange={e => setFiltros(prev => ({ ...prev, precioMax: e.target.value }))}
          style={selectStyle} />
      </div>
    </>
  );

  return (
    <div style={{ paddingTop: 68, minHeight: '100vh', background: '#f8f9fb' }}>
      <style>{`
        .prop-layout { display: flex; gap: 24px; align-items: flex-start; }
        .prop-sidebar {
          width: 260px; flex-shrink: 0; background: white; border-radius: 16px;
          padding: 24px; box-shadow: 0 2px 16px rgba(27,58,107,0.06);
          border: 1px solid #e8ecf0; position: sticky; top: 90px;
        }
        .prop-mobile-filtros { display: none; }
        @media (max-width: 768px) {
          .prop-layout { flex-direction: column; }
          .prop-sidebar { display: none; }
          .prop-mobile-filtros { display: block; }
        }
      `}</style>

      <div style={{ background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', padding: '40px 24px 28px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', marginBottom: 6 }}>Propiedades</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
            {cargando ? 'Buscando...' : `${propiedades.length} propiedades encontradas`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px' }}>

        {/* Filtros mobile */}
        <div className="prop-mobile-filtros" style={{ marginBottom: 16 }}>
          <button onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #e8ecf0', borderRadius: 10, padding: '10px 18px', fontSize: 14, fontWeight: 600, color: '#1B3A6B', cursor: 'pointer', width: '100%', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Filter size={16} /> Filtros {hayFiltros && '(activos)'}
            </span>
            <ChevronDown size={16} style={{ transform: filtrosAbiertos ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          {filtrosAbiertos && (
            <div style={{ background: 'white', borderRadius: 12, padding: 20, marginTop: 8, border: '1px solid #e8ecf0' }}>
              <SidebarContent />
            </div>
          )}
        </div>

        <div className="prop-layout">
          <aside className="prop-sidebar"><SidebarContent /></aside>
          <div style={{ flex: 1, minWidth: 0 }}>
            {cargando ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ height: 320, background: 'linear-gradient(90deg, #e8ecf0 25%, #f0f2f5 50%, #e8ecf0 75%)', borderRadius: 16 }} />
                ))}
              </div>
            ) : propiedades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>🏠</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>No encontramos propiedades</h3>
                <p style={{ color: '#6b7280', marginBottom: 20 }}>Intenta con otros filtros de búsqueda</p>
                <button onClick={limpiarFiltros} style={{ background: '#1B3A6B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Ver todas las propiedades
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                {propiedades.map(p => <TarjetaPropiedad key={p.id} propiedad={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropiedadesPage;