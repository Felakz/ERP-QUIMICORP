import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(ruc?: string) {
    const db = this.prisma as any;
    const where: any = {};
    if (ruc && ruc.trim()) {
      where.ruc = { contains: ruc.trim(), mode: 'insensitive' };
    }
    return db.cliente.findMany({
      where,
      orderBy: { razonSocial: 'asc' },
    });
  }

  async findByRuc(ruc: string) {
    const db = this.prisma as any;
    return db.cliente.findUnique({ where: { ruc } });
  }

  async create(dto: {
    razonSocial: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
    condicionPago?: string;
  }) {
    const db = this.prisma as any;
    const existing = await db.cliente.findUnique({ where: { ruc: dto.ruc } });
    if (existing) {
      // Si ya existe, devolvemos el existente (idempotente para el modal de creación rápida)
      return existing;
    }
    return db.cliente.create({
      data: {
        razonSocial: dto.razonSocial,
        ruc: dto.ruc,
        telefono: dto.telefono || null,
        direccion: dto.direccion || null,
        condicionPago: dto.condicionPago || 'Contado',
      },
    });
  }
}
