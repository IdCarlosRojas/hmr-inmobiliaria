import React, { useState, useEffect } from 'react';
import { getCitas, actualizarCita, eliminarCita } from '../../services/api';
import { Cita } from '../../types';
import { Trash2, Check, X, Calendar, Clock, AlertCircle } from 'lucide-react';

const ESTADO_COLORES: Record<string, { bg: string; color: string }> = {
  pendiente: { bg: '#fef3c7', color: '#92400e' },
  confirmada: { bg: '#dcfce7', color: '#166534' },
  cancelada: { bg: '#fef2f2', color: '#dc2626' },
  realizada: { bg: '#dbeafe', color: '#1e40af' },
};

const CitasPage = () => {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await getCitas();
      setCitas(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`No se pudieron cargar las citas: ${msg}`);
      setCitas([]);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      await actualizarCita(id, { estado });
      cargar();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta cita?')) return;
    try {
      await eliminarCita(id);
      cargar();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const filtradas = citas.filter(c => {
    const matchEstado = !filtroEstado || c.estado === filtroEstado;
    const matchBusqueda = !busqueda ||
      c.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.propiedadTitulo.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  const inputStyle: React.CSSProperties = {
    padding: '10px 12px', border: '1px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none',
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar cliente o propiedad..."
          style={{ ...inputStyle, width: 260 }} />
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} style={inputStyle}>
          <option value="">Todos los estados</option>
          {['pendiente', 'confirmada', 'realizada', 'cancelada'].map(e => (
            <option key={e} value={e} style={{ textTransform: 'capitalize' }}>{e}</option>
          ))}
        </select>
      </div>

      {/* Banner de error visible */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 10, marginBottom: 20, fontSize: 14 }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={cargar} style={{ marginLeft: 'auto', background: '#dc2626', color: 'white', border: 'none', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
            Reintentar
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total', valor: citas.length, color: '#1B3A6B' },
          { label: 'Pendientes', valor: citas.filter(c => c.estado === 'pendiente').length, color: '#f59e0b' },
          { label: 'Confirmadas', valor: citas.filter(c => c.estado === 'confirmada').length, color: '#059669' },
          { label: 'Realizadas', valor: citas.filter(c => c.estado === 'realizada').length, color: '#6366f1' },
        ].map(({ label, valor, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 10, padding: '12px 20px', border: '1px solid #e8ecf0' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{valor}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {cargando ? (
          <p style={{ color: '#6b7280', gridColumn: '1 / -1', textAlign: 'center', padding: 40 }}>Cargando...</p>
        ) : filtradas.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <Calendar size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
            <p>{error ? 'Error al cargar citas' : `No hay citas ${filtroEstado ? `con estado "${filtroEstado}"` : 'registradas'}`}</p>
          </div>
        ) : filtradas.map(c => {
          const colores = ESTADO_COLORES[c.estado] || ESTADO_COLORES.pendiente;
          return (
            <div key={c.id} style={{ background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e8ecf0', boxShadow: '0 2px 8px rgba(27,58,107,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ background: colores.bg, color: colores.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                  {c.estado}
                </span>
                <button onClick={() => handleEliminar(c.id)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{c.clienteNombre}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>{c.propiedadTitulo}</p>

              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                  <Calendar size={14} color="#1B3A6B" />
                  {new Date(c.fecha).toLocaleDateString('es-CO')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151' }}>
                  <Clock size={14} color="#1B3A6B" />
                  {c.hora}
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>
                <div>📧 {c.clienteEmail}</div>
                <div>📞 {c.clienteTelefono}</div>
                {c.mensaje && <div style={{ marginTop: 6, fontStyle: 'italic' }}>"{c.mensaje}"</div>}
              </div>

              {c.estado === 'pendiente' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => cambiarEstado(c.id, 'confirmada')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#059669', color: 'white', border: 'none', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <Check size={14} /> Confirmar
                  </button>
                  <button onClick={() => cambiarEstado(c.id, 'cancelada')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#fef2f2', color: '#dc2626', border: 'none', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                    <X size={14} /> Cancelar
                  </button>
                </div>
              )}
              {c.estado === 'confirmada' && (
                <button onClick={() => cambiarEstado(c.id, 'realizada')}
                  style={{ width: '100%', background: '#dbeafe', color: '#1e40af', border: 'none', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                  Marcar como realizada
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitasPage;