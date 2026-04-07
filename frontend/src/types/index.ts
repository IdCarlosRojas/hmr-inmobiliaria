export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN_INMUEBLES = 'admin_inmuebles',
  ADMIN_CONTRATOS = 'admin_contratos',
}

export enum TipoPropiedad {
  APARTAMENTO = 'apartamento',
  CASA = 'casa',
  LOCAL = 'local',
  OFICINA = 'oficina',
  BODEGA = 'bodega',
  LOTE = 'lote',
  FINCA = 'finca',
}

export enum TipoOperacion {
  ARRIENDO = 'arriendo',
  VENTA = 'venta',
  ARRIENDO_VENTA = 'arriendo_venta',
}

export enum EstadoPropiedad {
  DISPONIBLE = 'disponible',
  ARRENDADA = 'arrendada',
  VENDIDA = 'vendida',
  INACTIVA = 'inactiva',
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  telefono?: string;
  activo: boolean;
}

export interface Propiedad {
  id: number;
  titulo: string;
  tipo: TipoPropiedad;
  operacion: TipoOperacion;
  localidad: string;
  barrio?: string;
  direccion?: string;
  precio: number;
  area?: number;
  habitaciones?: number;
  banos?: number;
  pisos?: number;
  descripcion?: string;
  caracteristicas?: string;
  imagenes?: string[];
  imagenPrincipal?: string;
  estado: EstadoPropiedad;
  publicada: boolean;
  destacada: boolean;
  createdAt: string;
}

export interface Contrato {
  id: number;
  propiedadId: number;
  propiedadTitulo: string;
  arrendatarioNombre: string;
  arrendatarioEmail: string;
  arrendatarioTelefono?: string;
  arrendatarioCedula?: string;
  valorMensual: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  notas?: string;
  createdAt: string;
}

export interface Cita {
  id: number;
  propiedadId: number;
  propiedadTitulo: string;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono: string;
  fecha: string;
  hora: string;
  mensaje?: string;
  estado: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: Usuario;
}

export interface FiltrosPropiedades {
  tipo?: string;
  operacion?: string;
  localidad?: string;
  precioMin?: number;
  precioMax?: number;
}