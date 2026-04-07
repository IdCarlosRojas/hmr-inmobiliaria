import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await loginApi(email, password);
      login(res.data.access_token, res.data.usuario);
      navigate('/admin');
    } catch {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f2244 0%, #1B3A6B 50%, #2952A3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '48px 40px', width: '100%', maxWidth: 420, boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <img src="/logo.png" alt="HMR" style={{ height: 56, marginBottom: 16 }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 6 }}>Panel Administrativo</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Grupo Inmobiliario HMR</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Correo electrónico
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="correo@ejemplo.com"
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1B3A6B'}
              onBlur={e => e.target.style.borderColor = '#e8ecf0'}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', border: '2px solid #e8ecf0', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#1B3A6B'}
              onBlur={e => e.target.style.borderColor = '#e8ecf0'}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : '#1B3A6B', color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}>
            {loading ? 'Iniciando sesión...' : 'Ingresar al panel'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6b7280' }}>
          <a href="/" style={{ color: '#1B3A6B', fontWeight: 600 }}>← Volver al sitio web</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;