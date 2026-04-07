import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hmr_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hmr_token');
      localStorage.removeItem('hmr_usuario');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const loginApi = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

// PROPIEDADES
export const getPropiedades = (filtros?: any) =>
  api.get('/propiedades', { params: filtros });
export const getPropiedadById = (id: number) =>
  api.get(`/propiedades/${id}`);
export const getPropiedadesDestacadas = () =>
  api.get('/propiedades/destacadas');
export const getStatsPropiedades = () =>
  api.get('/propiedades/stats');
export const crearPropiedad = (data: any) =>
  api.post('/propiedades', data);
export const actualizarPropiedad = (id: number, data: any) =>
  api.put(`/propiedades/${id}`, data);
export const eliminarPropiedad = (id: number) =>
  api.delete(`/propiedades/${id}`);

// CONTRATOS
export const getContratos = () => api.get('/contratos');
export const getStatsContratos = () => api.get('/contratos/stats');
export const crearContrato = (data: any) => api.post('/contratos', data);
export const actualizarContrato = (id: number, data: any) =>
  api.put(`/contratos/${id}`, data);
export const eliminarContrato = (id: number) =>
  api.delete(`/contratos/${id}`);

// CITAS
export const getCitas = () => api.get('/citas');
export const getStatsCitas = () => api.get('/citas/stats');
export const crearCita = (data: any) => api.post('/citas', data);
export const actualizarCita = (id: number, data: any) =>
  api.put(`/citas/${id}`, data);
export const eliminarCita = (id: number) =>
  api.delete(`/citas/${id}`);

// USUARIOS
export const getUsuarios = () => api.get('/users');
export const crearUsuario = (data: any) => api.post('/users', data);
export const actualizarUsuario = (id: number, data: any) =>
  api.put(`/users/${id}`, data);
export const eliminarUsuario = (id: number) =>
  api.delete(`/users/${id}`);

// UPLOAD
export const uploadImagen = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/imagen', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;