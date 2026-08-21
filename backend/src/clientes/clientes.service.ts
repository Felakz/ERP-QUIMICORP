import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const db = this.prisma as any;
    const where: any = {};
    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { razonSocial: { contains: q, mode: 'insensitive' } },
        { ruc: { contains: q, mode: 'insensitive' } },
        { direccion: { contains: q, mode: 'insensitive' } },
        {
          contactos: {
            some: {
              OR: [
                { nombre: { contains: q, mode: 'insensitive' } },
                { cargo: { contains: q, mode: 'insensitive' } },
                { telefono: { contains: q, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }
    return db.cliente.findMany({
      where,
      include: {
        contactos: {
          orderBy: { esPrincipal: 'desc' },
        },
      },
      orderBy: { razonSocial: 'asc' },
    });
  }

  async findByRuc(ruc: string) {
    const db = this.prisma as any;
    return db.cliente.findUnique({
      where: { ruc },
      include: {
        contactos: {
          orderBy: { esPrincipal: 'desc' },
        },
      },
    });
  }

  async create(dto: {
    razonSocial: string;
    ruc: string;
    telefono?: string;
    direccion?: string;
    contacto?: string;
    metodoEnvio?: string;
    condicionPago?: string;
    contactos?: { nombre: string; cargo?: string; telefono?: string; esPrincipal?: boolean }[];
  }) {
    const db = this.prisma as any;
    const existing = await db.cliente.findUnique({
      where: { ruc: dto.ruc },
      include: { contactos: true },
    });
    if (existing) {
      return existing;
    }

    const contactosData = dto.contactos && dto.contactos.length > 0
      ? dto.contactos
      : dto.contacto
        ? [{ nombre: dto.contacto, cargo: 'Contacto Principal', telefono: dto.telefono, esPrincipal: true }]
        : [];

    return db.cliente.create({
      data: {
        razonSocial: dto.razonSocial,
        ruc: dto.ruc,
        telefono: dto.telefono || null,
        direccion: dto.direccion || null,
        contacto: dto.contacto || null,
        metodoEnvio: dto.metodoEnvio || null,
        condicionPago: dto.condicionPago || 'Contado',
        contactos: {
          create: contactosData,
        },
      },
      include: {
        contactos: true,
      },
    });
  }
}
