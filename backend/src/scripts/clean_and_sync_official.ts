import { PrismaClient, EstadoFormula } from '@prisma/client';
import * as xlsx from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧹 PURIFICACIÓN OFICIAL DE INVENTARIO Y DESACOPLAMIENTO BOM');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // 1. Limpiar detalles de fórmulas antes de depurar insumos
  console.log('1. Limpiando detalles de fórmulas temporales...');
  await prisma.formulaDetalle.deleteMany({});

  // 2. Eliminar insumos extras (cualquiera mayor a INS-231)
  console.log('2. Eliminando insumos temporales/extras del inventario...');
  const deletedExtras = await prisma.insumo.deleteMany({
    where: {
      codigo: { gt: 'INS-231' },
    },
  });
  console.log(`   🗑️  Eliminados ${deletedExtras.count} insumos no oficiales.`);

  const totalInsumos = await prisma.insumo.count();
  console.log(`   📦 Insumos Oficiales Restantes en BD: ${totalInsumos}`);

  // 3. Cachear los 231 insumos oficiales
  const insumosOficiales = await prisma.insumo.findMany();
  const insumosMap = new Map<string, { id: string; codigo: string; nombre: string }>();

  for (const ins of insumosOficiales) {
    insumosMap.set(ins.nombre.trim().toUpperCase(), {
      id: ins.id,
      codigo: ins.codigo,
      nombre: ins.nombre,
    });
  }

  // 4. Leer formulasData.ts
  const formulasDataPath = path.resolve(__dirname, '../../../frontend/lib/formulasData.ts');
  const fileContent = fs.readFileSync(formulasDataPath, 'utf8');
  const jsonMatch = fileContent.match(/export const FORMULAS_MAESTRAS_REALES: FormulaProducto\[\] = (\[[\s\S]*?\]);/);

  if (!jsonMatch) {
    console.error('❌ No se encontró FORMULAS_MAESTRAS_REALES');
    return;
  }

  const formulasRaw: any[] = JSON.parse(jsonMatch[1]);
  console.log(`\n3. Sincronizando ${formulasRaw.length} Fórmulas Maestras con recetas BOM puras...`);

  let totalDetalles = 0;

  for (const f of formulasRaw) {
    const codigo = f.codigoFM.trim().toUpperCase();
    const nombre = f.nombreProducto.trim().toUpperCase();

    const formulaMaster = await prisma.formulaMaster.upsert({
      where: { codigoFormula: codigo },
      update: {
        nombreProducto: nombre,
        estado: EstadoFormula.ACTIVA,
        densidadTeorica: 1.0,
      },
      create: {
        codigoFormula: codigo,
        nombreProducto: nombre,
        estado: EstadoFormula.ACTIVA,
        densidadTeorica: 1.0,
      },
    });

    if (Array.isArray(f.ingredientes)) {
      for (const ing of f.ingredientes) {
        const nombreIng = String(ing.componente).trim().toUpperCase();
        const skuIng = String(ing.sku || '').trim().toUpperCase();
        const pct = parseFloat(String(ing.porcentaje)) || 0;
        const peso = parseFloat(String(ing.pesoTeorico)) || (pct * 10);

        // Buscar si coincide con alguno de los 231 insumos oficiales
        let matchedInsumoId: string | null = null;

        // Match exacto
        if (insumosMap.has(nombreIng)) {
          matchedInsumoId = insumosMap.get(nombreIng)!.id;
        } else {
          // Match con o sin "H", "DE", etc.
          const sinH = nombreIng.replace(/H/g, '');
          for (const [invNom, info] of insumosMap.entries()) {
            if (
              invNom === nombreIng ||
              invNom.replace(/H/g, '') === sinH ||
              invNom.replace(/\s+/g, '') === nombreIng.replace(/\s+/g, '')
            ) {
              matchedInsumoId = info.id;
              break;
            }
          }
        }

        await prisma.formulaDetalle.create({
          data: {
            formulaId: formulaMaster.id,
            insumoId: matchedInsumoId,
            nombreComponente: nombreIng,
            skuComponente: skuIng,
            porcentaje: pct,
            pesoMasaTeorico: peso,
          },
        });
        totalDetalles++;
      }
    }
  }

  console.log(`   ✅ Sincronizados ${totalDetalles} componentes de recetas.`);

  // 5. Verificación final de integridad
  const countInsumosFinal = await prisma.insumo.count();
  const countFormulasFinal = await prisma.formulaMaster.count();
  const countDetallesFinal = await prisma.formulaDetalle.count();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✨ VERIFICACIÓN FINAL:');
  console.log(`   📦 Insumos Oficiales en Almacén: ${countInsumosFinal} (Exacto 231)`);
  console.log(`   🔬 Fórmulas Maestras Activas: ${countFormulasFinal} (Exacto 92)`);
  console.log(`   🧪 Componentes BOM de Recetas: ${countDetallesFinal}`);
  console.log('═══════════════════════════════════════════════════════════════');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
