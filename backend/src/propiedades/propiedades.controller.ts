import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PropiedadesService } from './propiedades.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('propiedades')
export class PropiedadesController {
  constructor(private readonly service: PropiedadesService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get('destacadas')
  findDestacadas() {
    return this.service.findDestacadas();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.service.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}