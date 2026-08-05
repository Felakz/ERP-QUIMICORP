import { Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Role, AccionPermiso } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'QUIMICORP_SECRET_KEY_2026_ERP_PRODUCTION';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedInitialUsersAndRoles();
  }

  async seedInitialUsersAndRoles() {
    const rolesEnumList: Role[] = [
      Role.GERENCIA,
      Role.ADMINISTRACION,
      Role.FINANZAS,
      Role.VENTAS_ATENCION_DIGITAL,
      Role.ECOMMERCE_MARKETING,
      Role.PRODUCCION_ALMACEN,
      Role.COMPRAS_PROVEEDORES,
      Role.RECURSOS_HUMANOS,
      Role.SISTEMAS_TI,
      Role.DISENO_MULTIMEDIA,
      Role.ARCHIVO_HISTORICO,
    ];

    // 1. Asegurar la existencia de cada Rol en la tabla 'roles'
    const dbRolesMap: Record<string, string> = {};
    for (const roleName of rolesEnumList) {
      let rolRecord = await this.prisma.rol.findUnique({ where: { nombre: roleName } });
      if (!rolRecord) {
        rolRecord = await this.prisma.rol.create({
          data: { nombre: roleName },
        });
      }
      dbRolesMap[roleName] = rolRecord.id;
    }

    // 2. Definir módulos y acciones de Permisos en la tabla 'permisos'
    const modulos = ['inventario', 'formulas', 'produccion', 'kardex', 'qa', 'pedidos-admin', 'usuarios', 'audit'];
    const acciones: AccionPermiso[] = [AccionPermiso.CREATE, AccionPermiso.READ, AccionPermiso.UPDATE, AccionPermiso.DELETE];

    const permisosMap: Record<string, string> = {};
    for (const modulo of modulos) {
      for (const accion of acciones) {
        const key = `${modulo}:${accion}`;
        let permiso = await this.prisma.permiso.findUnique({
          where: { modulo_accion: { modulo, accion } },
        });
        if (!permiso) {
          permiso = await this.prisma.permiso.create({
            data: { modulo, accion },
          });
        }
        permisosMap[key] = permiso.id;
      }
    }

    // 3. Mapear Permisos por Rol en 'rol_permisos'
    const rolePermissionMapping: Record<Role, string[]> = {
      GERENCIA: Object.keys(permisosMap), // Acceso total a todo
      ADMINISTRACION: [
        'inventario:READ', 'inventario:UPDATE',
        'formulas:READ',
        'produccion:READ',
        'kardex:READ',
        'qa:READ',
        'pedidos-admin:CREATE', 'pedidos-admin:READ', 'pedidos-admin:UPDATE', 'pedidos-admin:DELETE',
        'usuarios:READ', 'usuarios:UPDATE',
        'audit:READ',
      ],
      PRODUCCION_ALMACEN: [
        'inventario:CREATE', 'inventario:READ', 'inventario:UPDATE',
        'formulas:READ',
        'produccion:CREATE', 'produccion:READ', 'produccion:UPDATE',
        'kardex:CREATE', 'kardex:READ',
        'qa:READ', 'qa:UPDATE',
      ],
      FINANZAS: ['inventario:READ', 'kardex:READ', 'pedidos-admin:READ', 'audit:READ'],
      VENTAS_ATENCION_DIGITAL: ['inventario:READ', 'pedidos-admin:CREATE', 'pedidos-admin:READ'],
      ECOMMERCE_MARKETING: ['inventario:READ', 'pedidos-admin:READ'],
      COMPRAS_PROVEEDORES: ['inventario:CREATE', 'inventario:READ', 'inventario:UPDATE', 'kardex:CREATE', 'kardex:READ'],
      RECURSOS_HUMANOS: ['usuarios:CREATE', 'usuarios:READ', 'usuarios:UPDATE'],
      SISTEMAS_TI: Object.keys(permisosMap),
      DISENO_MULTIMEDIA: ['formulas:READ'],
      ARCHIVO_HISTORICO: ['audit:READ', 'kardex:READ'],
    };

    for (const [roleName, permKeys] of Object.entries(rolePermissionMapping)) {
      const rolId = dbRolesMap[roleName];
      if (!rolId) continue;

      for (const permKey of permKeys) {
        const permisoId = permisosMap[permKey];
        if (!permisoId) continue;

        const exists = await this.prisma.rolPermiso.findUnique({
          where: { rolId_permisoId: { rolId, permisoId } },
        });
        if (!exists) {
          await this.prisma.rolPermiso.create({
            data: { rolId, permisoId },
          });
        }
      }
    }

    // 4. Crear los 11 Usuarios iniciales en la tabla 'users' enlazados con su rolId de BD
    const initialUsers: { email: string; nombre: string; role: Role }[] = [
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

    for (const item of initialUsers) {
      const rolId = dbRolesMap[item.role];
      const existingUser = await this.prisma.user.findUnique({ where: { email: item.email } });
      if (!existingUser) {
        await this.prisma.user.create({
          data: {
            email: item.email,
            nombre: item.nombre,
            password: passwordHash,
            role: item.role,
            rolId: rolId ?? null,
            active: true,
          },
        });
      } else if (!existingUser.rolId && rolId) {
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: { rolId },
        });
      }
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Consultar el Usuario desde PostgreSQL incluyendo la relación relacional del Rol y sus Permisos
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        rol: {
          include: {
            permisos: {
              include: {
                permiso: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.active) {
      throw new UnauthorizedException('Credenciales inválidas o usuario inactivo');
    }

    // Validar contraseña contra el hash stored en BD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Extraer lista de permisos desde la relación relacional en la BD
    const permissions: string[] = user.rol?.permisos.map(
      (rp) => `${rp.permiso.modulo}:${rp.permiso.accion}`
    ) || [];

    const effectiveRole = user.rol?.nombre || user.role;

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre,
      role: effectiveRole,
      permissions,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '24h' });

    // Mantener la forma exacta del contrato de respuesta que consume el Frontend
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: effectiveRole as Role,
      },
      permissions,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
        include: {
          rol: {
            include: {
              permisos: {
                include: {
                  permiso: true,
                },
              },
            },
          },
        },
      });

      if (!user || !user.active) {
        throw new UnauthorizedException('Token no válido o usuario inactivo');
      }

      const permissions: string[] = user.rol?.permisos.map(
        (rp) => `${rp.permiso.modulo}:${rp.permiso.accion}`
      ) || [];

      const effectiveRole = user.rol?.nombre || user.role;

      return {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        role: effectiveRole as Role,
        permissions,
      };
    } catch (e) {
      throw new UnauthorizedException('Token JWT expirado o inválido');
    }
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: { id: true, email: true, nombre: true, role: true, active: true, rol: { select: { nombre: true } } },
      orderBy: { role: 'asc' },
    });
  }
}
