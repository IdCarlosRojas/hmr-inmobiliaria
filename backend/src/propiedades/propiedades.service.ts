import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Propiedad, EstadoPropiedad } from './propiedad.entity';

@Injectable()
export class PropiedadesService {
  constructor(
    @InjectRepository(Propiedad)
    private repo: Repository<Propiedad>,
  ) {}

  async findAll(filtros?: any): Promise<Propiedad[]> {
    const query = this.repo.createQueryBuilder('p');
    if (filtros?.tipo) query.andWhere('p.tipo = :tipo', { tipo: filtros.tipo });
    if (filtros?.operacion) query.andWhere('p.operacion = :op', { op: filtros.operacion });
    if (filtros?.localidad) query.andWhere('LOWER(p.localidad) LIKE :loc', { loc: `%${filtros.localidad.toLowerCase()}%` });
    if (filtros?.precioMin) query.andWhere('p.precio >= :min', { min: filtros.precioMin });
    if (filtros?.precioMax) query.andWhere('p.precio <= :max', { max: filtros.precioMax });
    if (filtros?.soloPublicadas !== false) query.andWhere('p.publicada = true');
    query.orderBy('p.destacada', 'DESC').addOrderBy('p.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: number): Promise<Propiedad> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Propiedad no encontrada');
    return p;
  }

  async findDestacadas(): Promise<Propiedad[]> {
    return this.repo.find({ where: { destacada: true, publicada: true }, take: 6 });
  }

  async create(data: Partial<Propiedad>): Promise<Propiedad> {
    const p = this.repo.create(data);
    return this.repo.save(p);
  }

  async update(id: number, data: Partial<Propiedad>): Promise<Propiedad> {
    const p = await this.findOne(id);
    Object.assign(p, data);
    return this.repo.save(p);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.repo.delete(id);
  }

  async getStats() {
    const total = await this.repo.count({ where: { publicada: true } });
    const disponibles = await this.repo.count({ where: { estado: EstadoPropiedad.DISPONIBLE } });
    const arrendadas = await this.repo.count({ where: { estado: EstadoPropiedad.ARRENDADA } });
    const vendidas = await this.repo.count({ where: { estado: EstadoPropiedad.VENDIDA } });
    return { total, disponibles, arrendadas, vendidas };
  }

  async seedPropiedades(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      const propiedades = [
        { titulo: 'Local en Zipaquirá', tipo: 'local' as any, operacion: 'venta' as any, localidad: 'Zipaquirá', precio: 750000000, area: 186, banos: 2, pisos: 1, direccion: 'Cra. 7 #63-45', descripcion: 'Local comercial a una cuadra del centro turístico de Zipaquirá.', caracteristicas: 'Área libre', publicada: true, destacada: true },
        { titulo: 'Local en Zipaquirá', tipo: 'local' as any, operacion: 'arriendo' as any, localidad: 'Zipaquirá', precio: 7500000, area: 186, banos: 2, pisos: 1, descripcion: 'Local comercial a una cuadra del centro turístico de Zipaquirá.', caracteristicas: 'Área libre', publicada: true, destacada: false },
        { titulo: 'Apto en Cedritos', tipo: 'apartamento' as any, operacion: 'venta' as any, localidad: 'Cedritos', precio: 380000000, area: 70, habitaciones: 3, banos: 3, pisos: 2, descripcion: 'Apartamento dúplex en el mejor sector de Cedritos.', caracteristicas: 'Parqueadero, seguridad 24h, ascensor', publicada: true, destacada: true },
        { titulo: 'Local en Galerías', tipo: 'local' as any, operacion: 'arriendo' as any, localidad: 'Galerías', precio: 2500000, area: 14, descripcion: 'Local comercial en zona de alto tráfico.', publicada: true, destacada: false },
      ];
      for (const p of propiedades) {
        await this.create(p);
      }
      console.log('✅ Propiedades de ejemplo creadas');
    }
  }
}