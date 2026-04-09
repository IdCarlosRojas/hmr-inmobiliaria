import React, { useState, useEffect } from 'react';
import { getUsuarios, crearUsuario, eliminarUsuario } from '../../services/api';
import { Plus, Trash2, X, Check, AlertCircle } from 'lucide-react';

const FORM_INICIAL = { nombre: '', email: '', password: '', rol: 'admin_inmuebles', telefono: '' };

const ROL_INFO: Record<string, { label: string; color: string; bg: string }> = {
  super_admin: { label: 'Super Admin', color: '#7c3aed', bg: '#ede9fe' },
  admin_inmuebles: { label: 'Admin Inmuebles', color: '#1e40af', bg: '#dbeafe' },
  admin_contratos: { label: 'Admin Contratos', color: '#065f46', bg: '#d1fae5' },
};

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const res = await getUsuarios();
      setUsuarios(res.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`No se pudieron cargar los usuarios: ${msg}`);
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!form.nombre || !form.email || !form.password) {
      alert('Nombre, email y contraseña son obligatorios'); return;
    }
    setGuardando(true);
    try {
      await crearUsuario(form);
      await cargar();
      setModalAbierto(false);
      setForm(FORM_INICIAL);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await eliminarUsuario(id);
      cargar();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar');
    }
  };

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
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Usuarios del sistema</h2>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{usuarios.length} usuarios registrados</p>
        </div>
        <button onClick={() => setModalAbierto(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: '#1B3A6B',
          color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={16} /> Nuevo usuario
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {cargando ? (
          <p style={{ color: '#6b7280' }}>Cargando...</p>
        ) : usuarios.length === 0 && !error ? (
          <p style={{ color: '#6b7280', gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>No hay usuarios registrados</p>
        ) : usuarios.map(u => {
          const rolInfo = ROL_INFO[u.rol] || ROL_INFO.admin_inmuebles;
          return (
            <div key={u.id} style={{ background: 'white', borderRadius: 14, padding: 20, border: '1px solid #e8ecf0', boxShadow: '0 2px 8px rgba(27,58,107,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #1B3A6B, #2952A3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18 }}>
                  {u.nombre[0].toUpperCase()}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ background: rolInfo.bg, color: rolInfo.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {rolInfo.label}
                  </span>
                  <button onClick={() => handleEliminar(u.id)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{u.nombre}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>✉️ {u.email}</p>
              {u.telefono && <p style={{ fontSize: 13, color: '#6b7280' }}>📞 {u.telefono}</p>}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.activo ? '#10b981' : '#9ca3af' }} />
                <span style={{ fontSize: 12, color: u.activo ? '#059669' : '#9ca3af' }}>
                  {u.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 480, padding: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Nuevo usuario</h2>
              <button onClick={() => { setModalAbierto(false); setForm(FORM_INICIAL); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'nombre', label: 'Nombre completo *', placeholder: 'Juan Pérez' },
                { key: 'email', label: 'Correo electrónico *', placeholder: 'correo@gmail.com', type: 'email' },
                { key: 'password', label: 'Contraseña *', placeholder: 'Mínimo 6 caracteres', type: 'password' },
                { key: 'telefono', label: 'Teléfono', placeholder: '300 000 0000' },
              ].map(({ key, label, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} type={type} placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Rol</label>
                <select style={inputStyle} value={form.rol} onChange={e => setForm(p => ({ ...p, rol: e.target.value }))}>
                  <option value="admin_inmuebles">Admin Inmuebles</option>
                  <option value="admin_contratos">Admin Contratos</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e8ecf0' }}>
              <button onClick={() => { setModalAbierto(false); setForm(FORM_INICIAL); }} style={{ padding: '10px 20px', border: '1px solid #e8ecf0', borderRadius: 8, background: 'white', cursor: 'pointer' }}>Cancelar</button>
              <button onClick={handleGuardar} disabled={guardando} style={{ padding: '10px 24px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} /> {guardando ? 'Creando...' : 'Crear usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;