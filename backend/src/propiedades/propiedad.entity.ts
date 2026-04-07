import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

@Entity('propiedades')
export class Propiedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'enum', enum: TipoPropiedad })
  tipo: TipoPropiedad;

  @Column({ type: 'enum', enum: TipoOperacion })
  operacion: TipoOperacion;

  @Column()
  localidad: string;

  @Column({ nullable: true })
  barrio: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ type: 'bigint' })
  precio: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  area: number;

  @Column({ nullable: true })
  habitaciones: number;

  @Column({ nullable: true })
  banos: number;

  @Column({ nullable: true })
  pisos: number;

  @Column({ nullable: true, type: 'text' })
  descripcion: string;

  @Column({ nullable: true })
  caracteristicas: string;

  @Column({ type: 'json', nullable: true })
  imagenes: string[];

  @Column({ nullable: true })
  imagenPrincipal: string;

  @Column({ type: 'enum', enum: EstadoPropiedad, default: EstadoPropiedad.DISPONIBLE })
  estado: EstadoPropiedad;

  @Column({ default: true })
  publicada: boolean;

  @Column({ default: false })
  destacada: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}