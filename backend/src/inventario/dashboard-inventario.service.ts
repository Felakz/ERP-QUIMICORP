import { Injectable } from '@nestjs/common';
import { EstadoGenerico, EstadoSubAlmacen } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class DashboardInventarioService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerResumen() {
    const insumos = await this.prisma.insumo.findMany({
      where: { estado: EstadoGenerico.ACTIVO },
    });

    const totalInsumos = insumos.length;
    let valorizacionTotal = 0;
    let insumosCriticosCount = 0;

    for (const insumo of insumos) {
      const stockReal = Number(insumo.stockReal);
      const costoUnitario = Number(insumo.costoUnitario);
      const stockMinimo = Number(insumo.stockMinimo);

      valorizacionTotal += stockReal * costoUnitario;
      if (stockReal <= stockMinimo) {
        insumosCriticosCount++;
      }
    }

    const sobrantesCount = await this.prisma.subAlmacenSobrante.count({
      where: { estado: EstadoSubAlmacen.DISPONIBLE },
    });

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const movimientosMesCount = await this.prisma.kardexInmutable.count({
      where: {
        createdAt: { gte: inicioMes },
      },
    });

    return {
      totalInsumos,
      valorizacionTotal: valorizacionTotal.toFixed(2),
      insumosCriticosCount,
      sobrantesCount,
      movimientosMesCount,
    };
  }

  async obtenerStockCritico() {
    const insumos = await this.prisma.insumo.findMany({
      where: { estado: EstadoGenerico.ACTIVO },
      include: { familia: true },
      orderBy: { nombre: 'asc' },
    });

    return insumos
      .filter((i) => Number(i.stockReal) <= Number(i.stockMinimo))
      .map((i) => ({
        id: i.id,
        codigo: i.codigo,
        nombre: i.nombre,
        familia: i.familia.nombre,
        unidadMedida: i.unidadMedida,
        stockReal: Number(i.stockReal),
        stockMinimo: Number(i.stockMinimo),
        costoUnitario: Number(i.costoUnitario),
        deficit: (Number(i.stockMinimo) - Number(i.stockReal)).toFixed(2),
        nivelPorcentaje:
          Number(i.stockMinimo) > 0
            ? Math.round((Number(i.stockReal) / Number(i.stockMinimo)) * 100)
            : 0,
      }));
  }

  async obtenerDistribucionFamilias() {
    const familias = await this.prisma.familiaInsumo.findMany({
      include: {
        insumos: {
          where: { estado: EstadoGenerico.ACTIVO },
        },
      },
    });

    return familias.map((f) => {
      let valorizacion = 0;
      let stockTotal = 0;

      for (const insumo of f.insumos) {
        const stock = Number(insumo.stockReal);
        const costo = Number(insumo.costoUnitario);
        stockTotal += stock;
        valorizacion += stock * costo;
      }

      return {
        familiaId: f.id,
        nombre: f.nombre,
        cantidadInsumos: f.insumos.length,
        stockTotal: stockTotal.toFixed(2),
        valorizacionTotal: valorizacion.toFixed(2),
      };
    });
  }

  async obtenerTopValorizados() {
    const insumos = await this.prisma.insumo.findMany({
      where: { estado: EstadoGenerico.ACTIVO },
      include: { familia: true },
    });

    const insumosValorizados = insumos.map((i) => {
      const stockReal = Number(i.stockReal);
      const costoUnitario = Number(i.costoUnitario);
      const valorTotal = stockReal * costoUnitario;
      return {
        id: i.id,
        codigo: i.codigo,
        nombre: i.nombre,
        familia: i.familia.nombre,
        unidadMedida: i.unidadMedida,
        stockReal,
        stockMinimo: Number(i.stockMinimo),
        costoUnitario,
        valorTotal,
      };
    });

    insumosValorizados.sort((a, b) => b.valorTotal - a.valorTotal);
    return insumosValorizados.slice(0, 5);
  }

  async obtenerTendenciaMovimientos() {
    const movimientos = await this.prisma.kardexInmutable.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { insumo: { select: { nombre: true, codigo: true } } },
    });

    return movimientos.map((m) => ({
      id: m.id,
      tipoMovimiento: m.tipoMovimiento,
      insumoCodigo: m.insumo.codigo,
      insumoNombre: m.insumo.nombre,
      cantidad: Number(m.cantidad),
      stockAnterior: Number(m.stockAnterior),
      stockNuevo: Number(m.stockNuevo),
      fecha: m.createdAt,
    }));
  }

  async obtenerListaCompleta() {
    const insumos = await this.prisma.insumo.findMany({
      where: { estado: EstadoGenerico.ACTIVO },
      include: { familia: true },
      orderBy: { nombre: 'asc' },
    });

    const subAlmacenSobrantes = await this.prisma.subAlmacenSobrante.findMany({
      where: { estado: EstadoSubAlmacen.DISPONIBLE },
      include: {
        insumoSubproducto: true,
        loteOrigen: true,
      },
    });

    let stockCriticoCount = 0;
    let stockBajoCount = 0;
    const insumosCriticosDetalle: any[] = [];

    const insumosFormatted = insumos.map((i) => {
      const stockReal = Number(i.stockReal);
      const stockMinimo = Number(i.stockMinimo);
      let estado: 'OK' | 'LOW STOCK' | 'CRITICAL' = 'OK';

      if (stockReal <= 0 || stockReal <= stockMinimo * 0.5) {
        estado = 'CRITICAL';
        stockCriticoCount++;
        insumosCriticosDetalle.push({
          sku: i.codigo,
          nombre: i.nombre,
          stockReal,
          stockMinimo,
          unidad: i.unidadMedida,
          porcentaje: stockMinimo > 0 ? Math.round((stockReal / stockMinimo) * 100) : 5,
        });
      } else if (stockReal <= stockMinimo) {
        estado = 'LOW STOCK';
        stockBajoCount++;
      }

      const stockPercentage = stockMinimo > 0 ? Math.min(Math.round((stockReal / (stockMinimo * 3)) * 100), 100) : 85;

      return {
        id: i.id,
        sku: i.codigo,
        nombre: i.nombre,
        familia: i.familia.nombre.toUpperCase(),
        stockPercentage,
        stockReal,
        stockMinimo,
        unidad: i.unidadMedida,
        ubicacion: 'Almacén Principal Quimicorp',
        estado,
      };
    });

    return {
      totalMateriales: insumos.length,
      disponibilidadTotalKg: insumos.reduce((acc, i) => acc + Number(i.stockReal), 0).toFixed(2),
      stockCriticoCount,
      stockBajoCount,
      insumosCriticosDetalle,
      insumos: insumosFormatted,
      subAlmacen: subAlmacenSobrantes.map((s) => ({
        id: s.id,
        codigo: `RES-${s.id.slice(0, 4)}`,
        nombre: s.insumoSubproducto?.nombre || 'Subproducto Retenido',
        peso: Number(s.pesoDisponible).toFixed(1),
        unidad: s.insumoSubproducto?.unidadMedida || 'KG',
        loteOrigen: s.loteOrigen?.codigoLote || 'LOTE-DESCONOCIDO',
        fecha: new Date(s.createdAt).toISOString().split('T')[0],
        reutilizable: true,
      })),
    };
  }
}
