import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    return users.map(({ password, ...rest }) => rest as Omit<User, 'password'>);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(data: Partial<User>): Promise<Omit<User, 'password'>> {
    if (!data.email || !data.password) throw new ConflictException('Email y password requeridos');
    const existe = await this.findByEmail(data.email);
    if (existe) throw new ConflictException('El email ya está registrado');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const user = this.userRepository.create({ ...data, password: hashedPassword });
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async update(id: number, data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    Object.assign(user, data);
    const saved = await this.userRepository.save(user);
    const { password, ...result } = saved;
    return result as Omit<User, 'password'>;
  }

  async remove(id: number): Promise<void> {
    await this.findById(id);
    await this.userRepository.delete(id);
  }

  async seedAdmin(): Promise<void> {
    const existe = await this.findByEmail('grupoinmobiliariohmr@gmail.com');
    if (!existe) {
      await this.create({
        nombre: 'Ivonne Maritza Rojas',
        email: 'grupoinmobiliariohmr@gmail.com',
        password: 'HMR2024admin',
        rol: UserRole.SUPER_ADMIN,
        telefono: '3505063604',
      });
      console.log('✅ Super Admin creado');
    }
  }
}