import { PrismaClient, EstadoFormula, UnidadMedida, TipoInsumo } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const prisma = new PrismaClient();

// Leer las fórmulas maestras reales desde formulasData.ts
const formulasDataPath = path.resolve(__dirname, '../../../frontend/lib/formulasData.ts');
const fileContent = fs.readFileSync(formulasDataPath, 'utf8');

// Extraer el JSON de FORMULAS_MAESTRAS_REALES
const jsonMatch = fileContent.match(/export const FORMULAS_MAESTRAS_REALES: FormulaProducto\[\] = (\[[\s\S]*?\]);/);

if (!jsonMatch) {
  console.error('❌ No se pudo extraer FORMULAS_MAESTRAS_REALES de formulasData.ts');
  process.exit(1);
}

const formulasRaw: any[] = JSON.parse(jsonMatch[1]);

async function sync() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧪 SINCRONIZANDO FÓRMULAS MAESTRAS E INGREDIENTES EN POSTGRESQL');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log(`📦 Encontradas ${formulasRaw.length} fórmulas maestras oficiales.`);

  // 1. Obtener o crear insumo base default
  let defaultFamilia = await prisma.familiaInsumo.findFirst({ where: { nombre: 'MATERIA_PRIMA_BASE' } });
  if (!defaultFamilia) {
    defaultFamilia = await prisma.familiaInsumo.create({
      data: { nombre: 'MATERIA_PRIMA_BASE', descripcion: 'Materia Prima Base e Insumos Principales' },
    });
  }

  // Cachear todos los insumos existentes
  const insumosExistentes = await prisma.insumo.findMany();
  const insumosMap = new Map<string, string>(); // normalizado -> id

  for (const ins of insumosExistentes) {
    insumosMap.set(ins.nombre.trim().toUpperCase(), ins.id);
  }

  let totalDetallesInsertados = 0;
  let totalFormulasSincronizadas = 0;

  for (const f of formulasRaw) {
    const codigo = f.codigoFM.trim().toUpperCase();
    const nombre = f.nombreProducto.trim().toUpperCase();

    // Upsert FormulaMaster
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

    // Limpiar detalles anteriores para re-poblar
    await prisma.formulaDetalle.deleteMany({ where: { formulaId: formulaMaster.id } });

    // Insertar ingredientes de la fórmula
    if (Array.isArray(f.ingredientes)) {
      for (const ing of f.ingredientes) {
        const nombreIngrediente = String(ing.componente).trim().toUpperCase();
        let insumoId = insumosMap.get(nombreIngrediente);

        // Si el insumo no existe exactamente, buscar por coincidencia parcial o crearlo
        if (!insumoId) {
          const matchParcial = insumosExistentes.find(i => 
            i.nombre.includes(nombreIngrediente) || nombreIngrediente.includes(i.nombre)
          );
          if (matchParcial) {
            insumoId = matchParcial.id;
          } else {
            // Crear el insumo
            const totalInsumos = await prisma.insumo.count();
            const nuevoInsumo = await prisma.insumo.create({
              data: {
                codigo: `INS-${String(totalInsumos + 1).padStart(3, '0')}`,
                nombre: nombreIngrediente,
                familiaId: defaultFamilia.id,
                categoria: 'MATERIA_PRIMA_BASE',
                unidadMedida: UnidadMedida.KG,
                unidadMedidaVisual: 'KG',
                stockReal: 50000,
                stockTeorico: 50000,
                stockMinimo: 10,
                costoUnitario: 0,
                tipo: TipoInsumo.BASE,
              },
            });
            insumoId = nuevoInsumo.id;
            insumosMap.set(nombreIngrediente, insumoId);
          }
        }

        const porcentaje = parseFloat(String(ing.porcentaje)) || 0;
        const pesoTeorico = parseFloat(String(ing.pesoTeorico)) || (porcentaje * 10);

        try {
          await prisma.formulaDetalle.create({
            data: {
              formulaId: formulaMaster.id,
              insumoId: insumoId!,
              porcentaje: porcentaje,
              pesoMasaTeorico: pesoTeorico,
            },
          });
          totalDetallesInsertados++;
        } catch (err) {
          // Ignorar duplicado si ya existía
        }
      }
    }

    totalFormulasSincronizadas++;
  }

  // 2. Sincronizar Variantes de Marca Blanca de Clientes
  console.log('\n🏷️  Sincronizando Variantes de Clientes...');
  let clienteAlfalion = await prisma.cliente.findFirst({ where: { razonSocial: { contains: 'ALFALION', mode: 'insensitive' } } });
  if (!clienteAlfalion) {
    clienteAlfalion = await prisma.cliente.create({
      data: { razonSocial: 'ALFALION SAC', ruc: '20601234567', telefono: '987654321', condicionPago: 'Crédito 15 días' },
    });
  }

  let clienteNaupari = await prisma.cliente.findFirst({ where: { razonSocial: { contains: 'ÑAUPARI', mode: 'insensitive' } } });
  if (!clienteNaupari) {
    clienteNaupari = await prisma.cliente.create({
      data: { razonSocial: 'DISTRIBUIDORA ÑAUPARI', ruc: '20609876543', telefono: '987123456', condicionPago: 'Contado' },
    });
  }

  let clienteNexara = await prisma.cliente.findFirst({ where: { razonSocial: { contains: 'NEXARA', mode: 'insensitive' } } });
  if (!clienteNexara) {
    clienteNexara = await prisma.cliente.create({
      data: { razonSocial: 'NEXARA SAC', ruc: '20605554433', telefono: '999888777', condicionPago: 'Contado' },
    });
  }

  // Asignar variantes de prueba a las primeras 3 fórmulas
  const formulasDb = await prisma.formulaMaster.findMany({ take: 5 });
  for (const f of formulasDb) {
    await prisma.formulaVariant.deleteMany({ where: { formulaId: f.id } });
    await prisma.formulaVariant.createMany({
      data: [
        {
          formulaId: f.id,
          clienteId: clienteAlfalion.id,
          nombre: `${f.nombreProducto} (Línea Gold Alfalion)`,
          notas: 'Etiqueta dorada con tapa dorada',
        },
        {
          formulaId: f.id,
          clienteId: clienteNaupari.id,
          nombre: `${f.nombreProducto} Plus Distribución`,
          notas: 'Frasco ámbar 60ml',
        },
      ],
    });
  }

  console.log(`\n✅ Sincronización exitosa:`);
  console.log(`   🔬 Fórmulas Maestras en BD: ${totalFormulasSincronizadas}`);
  console.log(`   🧪 Ingredientes enlazados (FormulaDetalle): ${totalDetallesInsertados}`);
  console.log(`   🏷️  Variantes de Clientes registradas.`);
}

sync()
  .catch((e) => {
    console.error('❌ Error en sync:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
