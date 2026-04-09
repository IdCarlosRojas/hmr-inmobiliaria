import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contrato } from './contrato.entity';
import { ContratosService } from './contratos.service';
import { ContratosController } from './contratos.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contrato]),
    EmailModule,
  ],
  providers: [ContratosService],
  controllers: [ContratosController],
})
export class ContratosModule {}