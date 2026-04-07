import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contrato, EstadoContrato } from './contrato.entity';

@Injectable()
export class ContratosService {
  constructor(
    @InjectRepository(Contrato)
    private repo: Repository<Contrato>,
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
}