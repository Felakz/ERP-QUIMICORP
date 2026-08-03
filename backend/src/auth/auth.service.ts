import { Injectable, UnauthorizedException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'QUIMICORP_SECRET_KEY_2026_ERP_PRODUCTION';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialUsers();
  }

  async seedInitialUsers() {
    const rolesList: { email: string; nombre: string; role: Role }[] = [
      { email: 'gerencia@quimicorp.pe', nombre: 'Carlos Mendoza (Gerente)', role: Role.GERENCIA },
      { email: 'administracion@quimicorp.pe', nombre: 'Ana Torres (Admin)', role: Role.ADMINISTRACION },
      { email: 'finanzas@quimicorp.pe', nombre: 'Roberto Silva (Finanzas)', role: Role.FINANZAS },
      { email: 'ventas@quimicorp.pe', nombre: 'Elena Gómez (Ventas)', role: Role.VENTAS_ATENCION_DIGITAL },
      { email: 'ecommerce@quimicorp.pe', nombre: 'Diego Castro (Ecommerce)', role: Role.ECOMMERCE_MARKETING },
      { email: 'produccion@quimicorp.pe', nombre: 'Ing. Mateo Rivas (Jefe Planta)', role: Role.PRODUCCION_ALMACEN },
      { email: 'compras@quimicorp.pe', nombre: 'Laura Paredes (Compras)', role: Role.COMPRAS_PROVEEDORES },
      { email: 'rrhh@quimicorp.pe', nombre: 'Sofia Morales (RRHH)', role: Role.RECURSOS_HUMANOS },
      { email: 'sistemas@quimicorp.pe', nombre: 'Alex Salazar (Sistemas TI)', role: Role.SISTEMAS_TI },
      { email: 'diseno@quimicorp.pe', nombre: 'Valeria Rios (Diseño)', role: Role.DISENO_MULTIMEDIA },
      { email: 'historico@quimicorp.pe', nombre: 'Mario Vega (Archivo)', role: Role.ARCHIVO_HISTORICO },
    ];

    const passwordHash = await bcrypt.hash('Quimicorp2026!', 10);

    for (const item of rolesList) {
      const exists = await this.prisma.user.findUnique({ where: { email: item.email } });
      if (!exists) {
        await this.prisma.user.create({
          data: {
            email: item.email,
            nombre: item.nombre,
            password: passwordHash,
            role: item.role,
            active: true,
          },
        });
      }
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user || !user.active) {
        throw new UnauthorizedException('Token no válido o usuario inactivo');
      }
      return {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: user.role,
      };
    } catch (e) {
      throw new UnauthorizedException('Token JWT expirado o inválido');
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, nombre: true, role: true, active: true },
      orderBy: { role: 'asc' },
    });
  }
}
