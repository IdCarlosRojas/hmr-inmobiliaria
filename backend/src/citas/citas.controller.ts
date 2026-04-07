import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CitasService } from './citas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('citas')
export class CitasController {
  constructor(private readonly service: CitasService) {}

  // Pública — cualquier visitante puede agendar una cita
  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  // Protegidas — solo admins
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() { return this.service.findAll(); }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() { return this.service.getStats(); }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: any) { return this.service.update(+id, body); }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}