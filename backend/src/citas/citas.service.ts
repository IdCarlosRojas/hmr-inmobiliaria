import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita, EstadoCita } from './cita.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private repo: Repository<Cita>,
  ) {}

  findAll() { return this.repo.find({ order: { createdAt: 'DESC' } }); }

  async findOne(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Cita no encontrada');
    return c;
  }

  async create(data: Partial<Cita>) {
    const c = this.repo.create(data);
    return this.repo.save(c);
  }

  async update(id: number, data: Partial<Cita>) {
    const c = await this.findOne(id);
    Object.assign(c, data);
    return this.repo.save(c);
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