import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita, EstadoCita } from './cita.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class CitasService {
  private readonly logger = new Logger(CitasService.name);

  constructor(
    @InjectRepository(Cita)
    private repo: Repository<Cita>,
    private emailService: EmailService,
  ) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  async findOne(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Cita no encontrada');
    return c;
  }

  async create(data: Partial<Cita>) {
    const c = this.repo.create(data);
    const saved = await this.repo.save(c);
    // Notificar a la inmobiliaria
    await this.emailService.enviarNotificacionCita({
      id: saved.id,
      clienteNombre: saved.clienteNombre,
      clienteEmail: saved.clienteEmail,
      clienteTelefono: saved.clienteTelefono,
      propiedadTitulo: saved.propiedadTitulo,
      fecha: saved.fecha ? String(saved.fecha) : undefined,
      hora: saved.hora,
      mensaje: saved.mensaje,
    }).catch(err => this.logger.error('Error enviando email a inmobiliaria:', err.message));
    return saved;
  }

  async update(id: number, data: Partial<Cita>) {
    const cita = await this.findOne(id);
    const estadoAnterior = cita.estado;
    Object.assign(cita, data);
    const saved = await this.repo.save(cita);

    // Enviar email al cliente solo si cambia a confirmada o cancelada
    const cambioRelevante =
      estadoAnterior !== saved.estado &&
      (saved.estado === EstadoCita.CONFIRMADA || saved.estado === EstadoCita.CANCELADA);

    if (cambioRelevante) {
      await this.emailService.enviarConfirmacionCliente({
        clienteNombre: saved.clienteNombre,
        clienteEmail: saved.clienteEmail,
        propiedadTitulo: saved.propiedadTitulo,
        fecha: saved.fecha ? String(saved.fecha) : undefined,
        hora: saved.hora,
        estado: saved.estado,
      }).catch(err => this.logger.error('Error enviando email al cliente:', err.message));
    }

    return saved;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getStats() {
    const pendientes = await this.repo.count({ where: { estado: EstadoCita.PENDIENTE } });
    const confirmadas = await this.repo.count({ where: { estado: EstadoCita.CONFIRMADA } });
    const total = await this.repo.count();
    return { pendientes, confirmadas, total };
  }
}