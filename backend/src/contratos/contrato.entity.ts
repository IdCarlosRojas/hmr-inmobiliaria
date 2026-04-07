import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoContrato {
  ACTIVO = 'activo',
  VENCIDO = 'vencido',
  CANCELADO = 'cancelado',
  POR_VENCER = 'por_vencer',
}

@Entity('contratos')
export class Contrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propiedadId: number;

  @Column()
  propiedadTitulo: string;

  @Column()
  arrendatarioNombre: string;

  @Column()
  arrendatarioEmail: string;

  @Column({ nullable: true })
  arrendatarioTelefono: string;

  @Column({ nullable: true })
  arrendatarioCedula: string;

  @Column({ type: 'bigint' })
  valorMensual: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column({ type: 'enum', enum: EstadoContrato, default: EstadoContrato.ACTIVO })
  estado: EstadoContrato;

  @Column({ nullable: true, type: 'text' })
  notas: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}