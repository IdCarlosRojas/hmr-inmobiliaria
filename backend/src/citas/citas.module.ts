import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cita } from './cita.entity';
import { CitasService } from './citas.service';
import { CitasController } from './citas.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    EmailModule,
  ],
  providers: [CitasService],
  controllers: [CitasController],
})
export class CitasModule {}