import React, { useState, useEffect } from 'react';
import { getPropiedades, crearPropiedad, actualizarPropiedad, eliminarPropiedad, uploadImagen } from '../../services/api';
import { Propiedad } from '../../types';
import { Plus, Edit, Trash2, Upload, X, Check, Star, Eye, EyeOff } from 'lucide-react';

const TIPOS = ['apartamento', 'casa', 'local', 'oficina', 'bodega', 'lote', 'finca'];
const OPERACIONES = ['arriendo', 'venta', 'arriendo_venta'];
const LOCALIDADES = ['Usaquén', 'Chapinero', 'Suba', 'Teusaquillo', 'Barrios Unidos', 'Kennedy', 'Engativá', 'Zipaquirá', 'Cedritos', 'Galerías', 'Otro'];

const FORM_INICIAL = {
  titulo: '', tipo: 'apartamento', operacion: 'arriendo', localidad: '',
  barrio: '', direccion: '', precio: '', area: '', habitaciones: '',
  banos: '', pisos: '', descripcion: '', caracteristicas: '',
  publicada: true, destacada: false,
};

const formatPrecio = (p: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);

const PropiedadesAdminPage = () => {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Propiedad | null>(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [subiendoImagen, setSubiendoImagen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await getPropiedades({ soloPublicadas: false });
      setPropiedades(res.data);
    } catch { }
    finally { setCargando(false); }
  };

  const abrirModal = (propiedad?: Propiedad) => {
    if (propiedad) {
      setEditando(propiedad);
      setForm({
        titulo: propiedad.titulo,
        tipo: propiedad.tipo,
        operacion: propiedad.operacion,
        localidad: propiedad.localidad,
        barrio: propiedad.barrio || '',
        direccion: propiedad.direccion || '',
        precio: propiedad.precio?.toString() || '',
        area: propiedad.area?.toString() || '',
        habitaciones: propiedad.habitaciones?.toString() || '',
        banos: propiedad.banos?.toString() || '',
        pisos: propiedad.pisos?.toString() || '',
        descripcion: propiedad.descripcion || '',
        caracteristicas: propiedad.caracteristicas || '',
        publicada: propiedad.publicada,
        destacada: propiedad.destacada,
      });
      setImagenes(propiedad.imagenes || []);
    } else {
      setEditando(null);
      setForm(FORM_INICIAL);
      setImagenes([]);
    }
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setEditando(null);
    setForm(FORM_INICIAL);
    setImagenes([]);
  };

  const handleImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendoImagen(true);
    try {
      const res = await uploadImagen(file);
      setImagenes(prev => [...prev, res.data.url]);
    } catch { alert('Error al subir imagen'); }
    finally { setSubiendoImagen(false); }
  };

  const eliminarImagen = (idx: number) => {
    setImagenes(prev => prev.filter((_, i) => i !== idx));
  };

  const handleGuardar = async () => {
    if (!form.titulo || !form.precio || !form.localidad) {
      alert('Título, precio y localidad son obligatorios');
      return;
    }
    setGuardando(true);
    try {
      const datos: any = {
        ...form,
        precio: parseInt(form.precio),
        area: form.area ? parseFloat(form.area) : null,
        habitaciones: form.habitaciones ? parseInt(form.habitaciones) : null,
        banos: form.banos ? parseInt(form.banos) : null,
        pisos: form.pisos ? parseInt(form.pisos) : null,
        imagenes,
        imagenPrincipal: imagenes[0] || null,
      };
      if (editando) {
        await actualizarPropiedad(editando.id, datos);
      } else {
        await crearPropiedad(datos);
      }
      await cargar();
      cerrarModal();
    } catch { alert('Error al guardar'); }
    finally { setGuardando(false); }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta propiedad?')) return;
    try {
      await eliminarPropiedad(id);
      cargar();
    } catch { alert('Error al eliminar'); }
  };

  const togglePublicada = async (p: Propiedad) => {
    try {
      await actualizarPropiedad(p.id, { publicada: !p.publicada });
      cargar();
    } catch { }
  };

  const toggleDestacada = async (p: Propiedad) => {
    try {
      await actualizarPropiedad(p.id, { destacada: !p.destacada });
      cargar();
    } catch { }
  };

  const filtradas = propiedades.filter(p =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.localidad.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', border: '1px solid #e8ecf0',
    borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    background: 'white',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar propiedades..."
            style={{ ...inputStyle, width: 280 }} />
        </div>
        <button onClick={() => abrirModal()} style={{
          display: 'flex', alignItems: 'center', gap: 8, background: '#1B3A6B',
          color: 'white', border: 'none', padding: '10px 20px', borderRadius: 8,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus size={16} /> Nueva propiedad
        </button>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { label: 'Total', valor: propiedades.length, color: '#1B3A6B' },
          { label: 'Publicadas', valor: propiedades.filter(p => p.publicada).length, color: '#059669' },
          { label: 'Destacadas', valor: propiedades.filter(p => p.destacada).length, color: '#f59e0b' },
          { label: 'Arriendo', valor: propiedades.filter(p => p.operacion === 'arriendo').length, color: '#6366f1' },
          { label: 'Venta', valor: propiedades.filter(p => p.operacion === 'venta').length, color: '#ec4899' },
        ].map(({ label, valor, color }) => (
          <div key={label} style={{ background: 'white', borderRadius: 10, padding: '12px 20px', border: '1px solid #e8ecf0', minWidth: 100 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color }}>{valor}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8ecf0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fb', borderBottom: '1px solid #e8ecf0' }}>
              {['Propiedad', 'Tipo', 'Operación', 'Precio', 'Localidad', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Cargando...</td></tr>
            ) : filtradas.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>No hay propiedades</td></tr>
            ) : filtradas.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {p.imagenPrincipal || p.imagenes?.[0] ? (
                      <img src={p.imagenPrincipal || p.imagenes![0]} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: 6, background: '#e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏠</div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{p.titulo}</div>
                      {p.destacada && <span style={{ fontSize: 10, background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>⭐ Destacada</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151', textTransform: 'capitalize' }}>{p.tipo}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: p.operacion === 'arriendo' ? '#dbeafe' : '#dcfce7', color: p.operacion === 'arriendo' ? '#1e40af' : '#166534', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>
                    {p.operacion}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#1B3A6B' }}>{formatPrecio(p.precio)}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{p.localidad}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => togglePublicada(p)} title={p.publicada ? 'Ocultar' : 'Publicar'}
                      style={{ background: p.publicada ? '#dcfce7' : '#f3f4f6', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: p.publicada ? '#166534' : '#6b7280' }}>
                      {p.publicada ? <Eye size={12} /> : <EyeOff size={12} />}
                      {p.publicada ? 'Publicada' : 'Oculta'}
                    </button>
                    <button onClick={() => toggleDestacada(p)} title={p.destacada ? 'Quitar destacado' : 'Destacar'}
                      style={{ background: p.destacada ? '#fef3c7' : '#f3f4f6', border: 'none', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
                      <Star size={12} color={p.destacada ? '#f59e0b' : '#9ca3af'} />
                    </button>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => abrirModal(p)}
                      style={{ background: '#eff6ff', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#1B3A6B' }}>
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleEliminar(p.id)}
                      style={{ background: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 700, padding: 32, position: 'relative', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editando ? 'Editar propiedad' : 'Nueva propiedad'}</h2>
              <button onClick={cerrarModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Título *</label>
                <input style={inputStyle} value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Ej: Apartamento en Chapinero" />
              </div>

              <div>
                <label style={labelStyle}>Tipo *</label>
                <select style={inputStyle} value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                  {TIPOS.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Operación *</label>
                <select style={inputStyle} value={form.operacion} onChange={e => setForm(p => ({ ...p, operacion: e.target.value }))}>
                  {OPERACIONES.map(o => <option key={o} value={o}>{o === 'arriendo_venta' ? 'Arriendo y Venta' : o}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Localidad *</label>
                <select style={inputStyle} value={form.localidad} onChange={e => setForm(p => ({ ...p, localidad: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {LOCALIDADES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Barrio</label>
                <input style={inputStyle} value={form.barrio} onChange={e => setForm(p => ({ ...p, barrio: e.target.value }))} placeholder="Ej: El Lago" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Dirección</label>
                <input style={inputStyle} value={form.direccion} onChange={e => setForm(p => ({ ...p, direccion: e.target.value }))} placeholder="Ej: Cra 7 # 45-12" />
              </div>

              <div>
                <label style={labelStyle}>Precio (COP) *</label>
                <input style={inputStyle} type="number" value={form.precio} onChange={e => setForm(p => ({ ...p, precio: e.target.value }))} placeholder="Ej: 1500000" />
              </div>

              <div>
                <label style={labelStyle}>Área (m²)</label>
                <input style={inputStyle} type="number" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="Ej: 70" />
              </div>

              <div>
                <label style={labelStyle}>Habitaciones</label>
                <input style={inputStyle} type="number" value={form.habitaciones} onChange={e => setForm(p => ({ ...p, habitaciones: e.target.value }))} placeholder="Ej: 3" />
              </div>

              <div>
                <label style={labelStyle}>Baños</label>
                <input style={inputStyle} type="number" value={form.banos} onChange={e => setForm(p => ({ ...p, banos: e.target.value }))} placeholder="Ej: 2" />
              </div>

              <div>
                <label style={labelStyle}>Pisos</label>
                <input style={inputStyle} type="number" value={form.pisos} onChange={e => setForm(p => ({ ...p, pisos: e.target.value }))} placeholder="Ej: 1" />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción</label>
                <textarea style={{ ...inputStyle, resize: 'vertical' }} rows={3} value={form.descripcion}
                  onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Describe la propiedad..." />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Características (separadas por coma)</label>
                <input style={inputStyle} value={form.caracteristicas}
                  onChange={e => setForm(p => ({ ...p, caracteristicas: e.target.value }))}
                  placeholder="Ej: Parqueadero, Ascensor, Seguridad 24h" />
              </div>

              {/* Imágenes */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Fotos de la propiedad</label>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                  {imagenes.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                      {i === 0 && <span style={{ position: 'absolute', top: 2, left: 2, background: '#1B3A6B', color: 'white', fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>PRINCIPAL</span>}
                      <button onClick={() => eliminarImagen(i)}
                        style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  <label style={{ width: 80, height: 80, border: '2px dashed #e8ecf0', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#6b7280', fontSize: 11, gap: 4 }}>
                    {subiendoImagen ? '...' : <><Upload size={16} /><span>Subir</span></>}
                    <input type="file" accept="image/*" onChange={handleImagen} style={{ display: 'none' }} disabled={subiendoImagen} />
                  </label>
                </div>
              </div>

              {/* Opciones */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 24 }}>
                {[
                  { key: 'publicada', label: 'Publicar en la web' },
                  { key: 'destacada', label: 'Marcar como destacada' },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input type="checkbox" checked={form[key as keyof typeof form] as boolean}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                      style={{ width: 16, height: 16, accentColor: '#1B3A6B' }} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e8ecf0' }}>
              <button onClick={cerrarModal} style={{ padding: '10px 20px', border: '1px solid #e8ecf0', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}>
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando} style={{ padding: '10px 24px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} /> {guardando ? 'Guardando...' : editando ? 'Actualizar' : 'Crear propiedad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropiedadesAdminPage;