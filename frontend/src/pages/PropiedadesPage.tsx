import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPropiedades } from '../services/api';
import { Propiedad } from '../types';
import TarjetaPropiedad from '../components/TarjetaPropiedad';
import { Filter, X } from 'lucide-react';

const LOCALIDADES = ['Usaquén', 'Chapinero', 'Suba', 'Teusaquillo', 'Barrios Unidos', 'Kennedy', 'Engativá', 'Zipaquirá', 'Cedritos', 'Galerías'];

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
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: '#f8f9fb' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f2244, #1B3A6B)', padding: '48px 24px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 8 }}>Propiedades</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            {cargando ? 'Buscando...' : `${propiedades.length} propiedades encontradas`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* Filtros sidebar */}
          <aside style={{ width: 260, flexShrink: 0, background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0', position: 'sticky', top: 90 }}>
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
              { label: 'Tipo de inmueble', key: 'tipo', options: [['', 'Todos'], ['apartamento', 'Apartamento'], ['casa', 'Casa'], ['local', 'Local'], ['oficina', 'Oficina'], ['bodega', 'Bodega'], ['lote', 'Lote']] },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</label>
                <select value={filtros[key as keyof typeof filtros]}
                  onChange={e => setFiltros(prev => ({ ...prev, [key]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                  {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Localidad</label>
              <select value={filtros.localidad}
                onChange={e => setFiltros(prev => ({ ...prev, localidad: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white' }}>
                <option value="">Todas</option>
                {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Rango de precio</label>
              <input type="number" placeholder="Precio mínimo" value={filtros.precioMin}
                onChange={e => setFiltros(prev => ({ ...prev, precioMin: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 13, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
              <input type="number" placeholder="Precio máximo" value={filtros.precioMax}
                onChange={e => setFiltros(prev => ({ ...prev, precioMax: e.target.value }))}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </aside>

          {/* Grid propiedades */}
          <div style={{ flex: 1 }}>
            {cargando ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ height: 340, background: 'linear-gradient(90deg, #e8ecf0 25%, #f0f2f5 50%, #e8ecf0 75%)', borderRadius: 16, animation: 'pulse 1.5s infinite' }} />
                ))}
              </div>
            ) : propiedades.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>No encontramos propiedades</h3>
                <p style={{ color: '#6b7280', marginBottom: 20 }}>Intenta con otros filtros de búsqueda</p>
                <button onClick={limpiarFiltros} style={{ background: '#1B3A6B', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Ver todas las propiedades
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
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