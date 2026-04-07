import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatsPropiedades, getStatsContratos, getStatsCitas } from '../../services/api';
import { Building2, FileText, Calendar, CheckCircle } from 'lucide-react';

const StatCard = ({ titulo, valor, subtitulo, icon, color }: any) => (
  <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
    <div style={{ width: 52, height: 52, background: `${color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>{valor}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 2 }}>{titulo}</div>
      {subtitulo && <div style={{ fontSize: 12, color: '#6b7280' }}>{subtitulo}</div>}
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ propiedades: null as any, contratos: null as any, citas: null as any });

  useEffect(() => {
    Promise.all([getStatsPropiedades(), getStatsContratos(), getStatsCitas()])
      .then(([p, c, ci]) => setStats({ propiedades: p.data, contratos: c.data, citas: ci.data }))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 4 }}>Bienvenido al Panel HMR</h2>
        <p style={{ color: '#6b7280' }}>Resumen general del sistema</p>
      </div>

      {/* Stats principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard titulo="Propiedades activas" valor={stats.propiedades?.total ?? '—'} subtitulo={`${stats.propiedades?.disponibles ?? 0} disponibles`} icon={<Building2 size={22} />} color="#1B3A6B" />
        <StatCard titulo="Contratos activos" valor={stats.contratos?.activos ?? '—'} subtitulo={`${stats.contratos?.total ?? 0} total`} icon={<FileText size={22} />} color="#059669" />
        <StatCard titulo="Citas pendientes" valor={stats.citas?.pendientes ?? '—'} subtitulo={`${stats.citas?.confirmadas ?? 0} confirmadas`} icon={<Calendar size={22} />} color="#f59e0b" />
        <StatCard titulo="Propiedades arrendadas" valor={stats.propiedades?.arrendadas ?? '—'} subtitulo={`${stats.propiedades?.vendidas ?? 0} vendidas`} icon={<CheckCircle size={22} />} color="#8b5cf6" />
      </div>

      {/* Accesos rápidos */}
      <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(27,58,107,0.06)', border: '1px solid #e8ecf0' }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Acciones rápidas</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {[
            { to: '/admin/propiedades', label: '+ Nueva propiedad', color: '#1B3A6B' },
            { to: '/admin/contratos', label: '+ Nuevo contrato', color: '#059669' },
            { to: '/admin/citas', label: 'Ver citas', color: '#f59e0b' },
          ].map(({ to, label, color }) => (
            <Link key={to} to={to} style={{ background: color, color: 'white', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;