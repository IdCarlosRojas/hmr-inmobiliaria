import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Contrato, EstadoContrato } from './contrato.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContratosService {
  private readonly logger = new Logger(ContratosService.name);

  constructor(
    @InjectRepository(Contrato)
    private repo: Repository<Contrato>,
    private emailService: EmailService,
  ) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  async findOne(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Contrato no encontrado');
    return c;
  }

  async create(data: Partial<Contrato>) {
    const c = this.repo.create(data);
    return this.repo.save(c);
  }

  async update(id: number, data: Partial<Contrato>) {
    const c = await this.findOne(id);
    Object.assign(c, data);
    return this.repo.save(c);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getStats() {
    const activos = await this.repo.count({ where: { estado: EstadoContrato.ACTIVO } });
    const vencidos = await this.repo.count({ where: { estado: EstadoContrato.VENCIDO } });
    const total = await this.repo.count();
    return { activos, vencidos, total };
  }

  // Se ejecuta todos los días a las 8am
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async verificarVencimientos() {
    this.logger.log('Verificando contratos próximos a vencer...');

    // Calcular rango: exactamente entre 89 y 91 días desde hoy (ventana de 3 meses)
    const hoy = new Date();
    const desde = new Date(hoy);
    desde.setDate(hoy.getDate() + 89);
    desde.setHours(0, 0, 0, 0);

    const hasta = new Date(hoy);
    hasta.setDate(hoy.getDate() + 91);
    hasta.setHours(23, 59, 59, 999);

    const contratos = await this.repo.find({
      where: {
        estado: EstadoContrato.ACTIVO,
        fechaFin: Between(desde, hasta),
      },
    });

    this.logger.log(`Encontrados ${contratos.length} contratos próximos a vencer`);

    for (const contrato of contratos) {
      await this.emailService.enviarAlertaVencimiento({
        id: contrato.id,
        arrendatarioNombre: contrato.arrendatarioNombre,
        arrendatarioEmail: contrato.arrendatarioEmail,
        propiedadTitulo: contrato.propiedadTitulo,
        fechaFin: contrato.fechaFin,
        valorMensual: contrato.valorMensual,
      });
    }
  }
}