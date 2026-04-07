import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum EstadoCita {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  REALIZADA = 'realizada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propiedadId: number;

  @Column()
  propiedadTitulo: string;

  @Column()
  clienteNombre: string;

  @Column()
  clienteEmail: string;

  @Column()
  clienteTelefono: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ nullable: true, type: 'text' })
  mensaje: string;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.PENDIENTE })
  estado: EstadoCita;

  @CreateDateColumn()
  createdAt: Date;
}