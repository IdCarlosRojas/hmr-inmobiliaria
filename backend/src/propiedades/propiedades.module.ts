import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Propiedad } from './propiedad.entity';
import { PropiedadesService } from './propiedades.service';
import { PropiedadesController } from './propiedades.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Propiedad])],
  providers: [PropiedadesService],
  controllers: [PropiedadesController],
  exports: [PropiedadesService],
})
export class PropiedadesModule {}