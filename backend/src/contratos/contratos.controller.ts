import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContratosService } from './contratos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contratos')
@UseGuards(JwtAuthGuard)
export class ContratosController {
  constructor(private readonly service: ContratosService) {}

  @Get('stats') getStats() { return this.service.getStats(); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(+id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(+id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(+id); }
}