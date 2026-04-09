import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropiedadesModule } from './propiedades/propiedades.module';
import { ContratosModule } from './contratos/contratos.module';
import { CitasModule } from './citas/citas.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { UsersService } from './users/users.service';
import { PropiedadesService } from './propiedades/propiedades.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get<string>('DB_PORT') ?? '5432'),
        database: config.get('DB_NAME'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    PropiedadesModule,
    ContratosModule,
    CitasModule,
    CloudinaryModule,
    EmailModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private propiedadesService: PropiedadesService,
  ) {}

  async onModuleInit() {
    await this.usersService.seedAdmin();
    await this.propiedadesService.seedPropiedades();
  }
}