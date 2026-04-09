import React, { useState, useEffect } from 'react';
import { getContratos, crearContrato, actualizarContrato, eliminarContrato } from '../../services/api';
import { Contrato } from '../../types';
import { Plus, Edit, Trash2, X, Check, FileText, AlertCircle } from 'lucide-react';

const FORM_INICIAL = {
  propiedadId: '', propiedadTitulo: '', arrendatarioNombre: '',
  arrendatarioEmail: '', arrendatarioTelefono: '', arrendatarioCedula: '',
  valorMensual: '', fechaInicio: '', fechaFin: '', estado: 'activo', notas: '',
};

const formatPrecio = (p: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);

const ESTADO_COLORES: Record<string, { bg: string; color: string }> = {
  activo: { bg: '#dcfce7', color: '#166534' },
  vencido: { bg: '#fef2f2', color: '#dc2626' },
  cancelado: { bg: '#f3f4f6', color: '#6b7280' },
  por_vencer: { bg: '#fef3c7', color: '#92400e' },
};

const ContratosPage = () => {
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Contrato | null>(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await getContratos();
      setContratos(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`No se pudieron cargar los contratos: ${msg}`);
      setContratos([]);
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (contrato?: Contrato) => {
    if (contrato) {
      setEditando(contrato);
      setForm({
        propiedadId: contrato.propiedadId.toString(),
        propiedadTitulo: contrato.propiedadTitulo,
        arrendatarioNombre: contrato.arrendatarioNombre,
        arrendatarioEmail: contrato.arrendatarioEmail,
        arrendatarioTelefono: contrato.arrendatarioTelefono || '',
        arrendatarioCedula: contrato.arrendatarioCedula || '',
        valorMensual: contrato.valorMensual.toString(),
        fechaInicio: contrato.fechaInicio.split('T')[0],
        fechaFin: contrato.fechaFin.split('T')[0],
        estado: contrato.estado,
        notas: contrato.notas || '',
      });
    } else {
      setEditando(null);
      setForm(FORM_INICIAL);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => { setModalAbierto(false); setEditando(null); setForm(FORM_INICIAL); };

  const handleGuardar = async () => {
    if (!form.arrendatarioNombre || !form.valorMensual || !form.fechaInicio || !form.fechaFin) {
      alert('Completa los campos obligatorios'); return;
    }
    setGuardando(true);
    try {
      const datos = { ...form, propiedadId: parseInt(form.propiedadId) || 0, valorMensual: parseInt(form.valorMensual) };
      if (editando) { await actualizarContrato(editando.id, datos); }
      else { await crearContrato(datos); }
      await cargar();
      cerrarModal();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al guardar contrato');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este contrato?')) return;
    try {
      await eliminarContrato(id);
      cargar();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

  const filtrados = contratos.filter(c =>
    c.arrendatarioNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.propiedadTitulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por arrendatario o propiedad..."
          style={{ ...inputStyle, width: 300 }} />
        <button onClick={() => abrirModal()} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: '#1B3A6B',
          color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={16} /> Nuevo contrato
        </button>
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
          { label: 'Total', valor: contratos.length, color: '#1B3A6B' },
          { label: 'Activos', valor: contratos.filter(c => c.estado === 'activo').length, color: '#059669' },
          { label: 'Por vencer', valor: contratos.filter(c => c.estado === 'por_vencer').length, color: '#f59e0b' },
          { label: 'Vencidos', valor: contratos.filter(c => c.estado === 'vencido').length, color: '#dc2626' },
        ].map(({ label, valor, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 10, padding: '12px 20px', border: '1px solid #e8ecf0' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{valor}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8ecf0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fb', borderBottom: '1px solid #e8ecf0' }}>
              {['Arrendatario', 'Propiedad', 'Valor mensual', 'Vigencia', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Cargando...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
                <FileText size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.3 }} />
                {error ? 'Error al cargar' : 'No hay contratos registrados'}
              </td></tr>
            ) : filtrados.map((c, i) => {
              const colores = ESTADO_COLORES[c.estado] || ESTADO_COLORES.cancelado;
              return (
                <tr key={c.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{c.arrendatarioNombre}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{c.arrendatarioEmail}</div>
                    {c.arrendatarioCedula && <div style={{ fontSize: 11, color: '#9ca3af' }}>CC: {c.arrendatarioCedula}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{c.propiedadTitulo}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{formatPrecio(c.valorMensual)}</td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#6b7280' }}>
                    <div>{new Date(c.fechaInicio).toLocaleDateString('es-CO')}</div>
                    <div>→ {new Date(c.fechaFin).toLocaleDateString('es-CO')}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: colores.bg, color: colores.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                      {c.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => abrirModal(c)} style={{ background: '#eff6ff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#1B3A6B' }}><Edit size={14} /></button>
                      <button onClick={() => handleEliminar(c.id)} style={{ background: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 20, overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 640, padding: 32, margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editando ? 'Editar contrato' : 'Nuevo contrato'}</h2>
              <button onClick={cerrarModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'propiedadTitulo', label: 'Propiedad', placeholder: 'Nombre de la propiedad', full: true },
                { key: 'arrendatarioNombre', label: 'Nombre arrendatario *', placeholder: 'Nombre completo' },
                { key: 'arrendatarioEmail', label: 'Email *', placeholder: 'correo@ejemplo.com', type: 'email' },
                { key: 'arrendatarioTelefono', label: 'Teléfono', placeholder: '300 000 0000' },
                { key: 'arrendatarioCedula', label: 'Cédula', placeholder: '12345678' },
                { key: 'valorMensual', label: 'Valor mensual (COP) *', placeholder: '1500000', type: 'number' },
                { key: 'fechaInicio', label: 'Fecha inicio *', type: 'date' },
                { key: 'fechaFin', label: 'Fecha fin *', type: 'date' },
              ].map(({ key, label, placeholder, type = 'text', full }: any) => (
                <div key={key} style={full ? { gridColumn: '1 / -1' } : {}}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form] as string}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Estado</label>
                <select style={inputStyle} value={form.estado} onChange={e => setForm(p => ({ ...p, estado: e.target.value }))}>
                  {['activo', 'por_vencer', 'vencido', 'cancelado'].map(e => (
                    <option key={e} value={e} style={{ textTransform: 'capitalize' }}>{e.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Notas</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={2} value={form.notas}
                  onChange={e => setForm(p => ({ ...p, notas: e.target.value }))} placeholder="Observaciones adicionales..." />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e8ecf0' }}>
              <button onClick={cerrarModal} style={{ padding: '10px 20px', border: '1px solid #e8ecf0', borderRadius: 8, background: 'white', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleGuardar} disabled={guardando} style={{ padding: '10px 24px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} /> {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear contrato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContratosPage;