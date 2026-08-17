import { PrismaClient, EstadoFormula } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔬 ESCANEO & CONSOLIDACIÓN GLOBAL DE TODAS LAS FÓRMULAS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Leer formulasData.ts
  const formulasDataPath = path.resolve(__dirname, '../../../frontend/lib/formulasData.ts');
  const fileContent = fs.readFileSync(formulasDataPath, 'utf8');
  const jsonMatch = fileContent.match(/export const FORMULAS_MAESTRAS_REALES: FormulaProducto\[\] = (\[[\s\S]*?\]);/);
  const formulasRaw: any[] = jsonMatch ? JSON.parse(jsonMatch[1]) : [];

  console.log(`📦 Fórmulas iniciales leídas: ${formulasRaw.length}`);

  // 2. Extraer nombre base limpio (removiendo sufijos de clientes)
  function limpiarNombreMaestro(nombre: string): { nombreLimpio: string; clientesEncontrados: string[] } {
    let limpio = nombre.trim();
    const clientes: string[] = [];

    const clientRegexes = [
      /-\s*alfalion(,\s*jose puelles)?/gi,
      /-\s*jhon canto/gi,
      /-\s*naupari/gi,
      /-\s*ñaupari/gi,
      /-\s*daniel espinoza(,\s*luis marin)?/gi,
      /-\s*david sarmiento/gi,
      /-\s*jose puelles/gi,
      /-\s*luis marin/gi,
      /-\s*karsell/gi,
      /-\s*renovapet/gi,
      /\(\+?\d*\s*adicionales?\)/gi,
      /\(\d+\s*kilos?\)/gi,
      /\(\d+\s*litros?\)/gi,
      /\(\d+\s*grs?\)/gi,
      /ph\s*\d+/gi,
    ];

    for (const reg of clientRegexes) {
      const match = limpio.match(reg);
      if (match) {
        match.forEach(m => clientes.push(m.replace(/[-\(\)]/g, '').trim()));
        limpio = limpio.replace(reg, '').trim();
      }
    }

    limpio = limpio.replace(/\s+/g, ' ').replace(/-\s*$/, '').trim().toUpperCase();
    return { nombreLimpio: limpio, clientesEncontrados: clientes };
  }

  // Agrupar fórmulas por nombre limpio
  const gruposMaestros = new Map<string, any[]>();

  for (const f of formulasRaw) {
    const { nombreLimpio } = limpiarNombreMaestro(f.nombreProducto);
    const key = nombreLimpio;
    if (!gruposMaestros.has(key)) {
      gruposMaestros.set(key, []);
    }
    gruposMaestros.get(key)!.push(f);
  }

  console.log(`🔍 Fórmulas Maestras Únicas Consolidadas: ${gruposMaestros.size} familias químicas.`);

  // 3. Cachear clientes existentes
  const clientesDb = await prisma.cliente.findMany();
  const clientesMap = new Map<string, string>();
  for (const c of clientesDb) {
    clientesMap.set(c.razonSocial.trim().toUpperCase(), c.id);
  }

  console.log('\n3. Actualizando Fórmulas Maestras y Variantes en PostgreSQL...');

  // Limpiar variantes y detalles anteriores
  await prisma.formulaVariant.deleteMany({});
  await prisma.formulaDetalle.deleteMany({});

  // Asignar códigos temporales a las fórmulas maestras existentes para evitar colisión de clave única
  const existingMasters = await prisma.formulaMaster.findMany();
  for (let idx = 0; idx < existingMasters.length; idx++) {
    await prisma.formulaMaster.update({
      where: { id: existingMasters[idx].id },
      data: { codigoFormula: `TMP-${String(idx + 1).padStart(5, '0')}` },
    });
  }

  let formulaCounter = 1;
  let totalDetallesCount = 0;
  let totalVariantesCount = 0;

  for (const [nombreFamilia, lista] of gruposMaestros.entries()) {
    const codigoFM = `FM-${String(formulaCounter).padStart(4, '0')}`;
    const recetaBase = lista.sort((a, b) => b.ingredientes.length - a.ingredientes.length)[0];

    let master = existingMasters[formulaCounter - 1];

    if (master) {
      master = await prisma.formulaMaster.update({
        where: { id: master.id },
        data: {
          codigoFormula: codigoFM,
          nombreProducto: nombreFamilia,
          estado: EstadoFormula.ACTIVA,
          densidadTeorica: 1.0,
        },
      });
    } else {
      master = await prisma.formulaMaster.create({
        data: {
          codigoFormula: codigoFM,
          nombreProducto: nombreFamilia,
          estado: EstadoFormula.ACTIVA,
          densidadTeorica: 1.0,
        },
      });
    }

    formulaCounter++;

    // Guardar ingredientes de la fórmula maestra
    for (const ing of recetaBase.ingredientes) {
      const pct = parseFloat(String(ing.porcentaje)) || 0;
      const peso = parseFloat(String(ing.pesoTeorico)) || (pct * 10);

      await prisma.formulaDetalle.create({
        data: {
          formulaId: master.id,
          nombreComponente: String(ing.componente).trim().toUpperCase(),
          skuComponente: String(ing.sku || '').trim().toUpperCase(),
          porcentaje: pct,
          pesoMasaTeorico: peso,
        },
      });
      totalDetallesCount++;
    }

    // Crear las variantes de cliente asociadas a esta familia
    for (const varItem of lista) {
      const { clientesEncontrados } = limpiarNombreMaestro(varItem.nombreProducto);
      
      let clienteId: string | null = null;

      for (const clNom of clientesEncontrados) {
        const clUpper = clNom.toUpperCase();
        for (const [dbNom, dbId] of clientesMap.entries()) {
          if (dbNom.includes(clUpper) || clUpper.includes(dbNom)) {
            clienteId = dbId;
            break;
          }
        }
        if (clienteId) break;
      }

      if (!clienteId && clientesDb.length > 0) {
        clienteId = clientesDb[0].id;
      }

      const ingredientesVariante = varItem.ingredientes.map((i: any) => ({
        sku: i.sku || 'INS-VAR',
        componente: String(i.componente).trim().toUpperCase(),
        porcentaje: parseFloat(String(i.porcentaje)) || 0,
        pesoTeorico: parseFloat(String(i.pesoTeorico)) || 0,
        tipo: i.tipo || 'BASE',
      }));

      await prisma.formulaVariant.create({
        data: {
          formulaId: master.id,
          clienteId: clienteId,
          nombre: varItem.nombreProducto,
          notas: `${varItem.ingredientes.length} insumos específicos`,
          ajustesJson: ingredientesVariante,
        },
      });
      totalVariantesCount++;
    }
  }

  // Si sobraron formulas maestras no usadas de las 92 anteriores, borrarlas o desactivarlas
  if (existingMasters.length >= formulaCounter) {
    const sobrantes = existingMasters.slice(formulaCounter - 1);
    for (const s of sobrantes) {
      await prisma.formulaMaster.delete({ where: { id: s.id } }).catch(() => {
        return prisma.formulaMaster.update({
          where: { id: s.id },
          data: { estado: EstadoFormula.INACTIVA, codigoFormula: `INACT-${s.id.slice(0, 8)}` },
        });
      });
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✨ CONSOLIDACIÓN EXITOSA:');
  console.log(`   🔬 Fórmulas Maestras Únicas en Catálogo: ${gruposMaestros.size}`);
  console.log(`   🧪 Ingredientes Base (FormulaDetalle): ${totalDetallesCount}`);
  console.log(`   🏷️  Variantes de Clientes Interactivas (FormulaVariant): ${totalVariantesCount}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
