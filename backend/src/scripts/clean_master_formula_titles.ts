import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function cleanMasterTitle(raw: string): string {
  let title = raw.trim();

  const stripPatterns = [
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
    /-\s*trinnidrop(,\s*luis marin)?/gi,
    /-\s*trinnidrop/gi,
    /\(\+?\d*\s*adicionales?\)/gi,
    /\(\d+(\.\d+)?\s*kg\s*base\)/gi,
    /\(\d+\s*kilos?\)/gi,
    /\(\d+\s*litros?\)/gi,
    /\(\d+\s*grs?\)/gi,
    /ph\s*\d+(\.\d+)?/gi,
  ];

  for (const p of stripPatterns) {
    title = title.replace(p, '').trim();
  }

  title = title.replace(/\s+/g, ' ').replace(/-\s*$/, '').trim().toUpperCase();
  return title;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🧼 LIMPIEZA 100% TÉCNICA Y GENÉRICA DE TÍTULOS MAESTROS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const formulas = await prisma.formulaMaster.findMany({
    include: { variants: { include: { cliente: true } } },
  });

  let modificadas = 0;

  for (const f of formulas) {
    const nuevoTitulo = cleanMasterTitle(f.nombreProducto);
    if (nuevoTitulo !== f.nombreProducto) {
      console.log(`[${f.codigoFormula}] Anterior: "${f.nombreProducto}" -> Limpio: "${nuevoTitulo}"`);
      await prisma.formulaMaster.update({
        where: { id: f.id },
        data: { nombreProducto: nuevoTitulo },
      });
      modificadas++;
    }
  }

  console.log(`\n✅ ${modificadas} Fórmulas Maestras limpiadas a nombres técnicos puros.`);

  // Verificar la fórmula de SPRAY DE OIDOS
  const sprayOidos = await prisma.formulaMaster.findFirst({
    where: { nombreProducto: { contains: 'SPRAY DE OIDOS' } },
    include: { variants: { include: { cliente: true } } },
  });

  if (sprayOidos) {
    console.log('\n--- CASO SPRAY DE OIDOS ---');
    console.log(`Fórmula Maestra: [${sprayOidos.codigoFormula}] "${sprayOidos.nombreProducto}"`);
    console.log('Variantes de clientes:');
    sprayOidos.variants.forEach(v => {
      console.log(`  • ${v.cliente?.razonSocial}: "${v.nombre}" (${Array.isArray(v.ajustesJson) ? v.ajustesJson.length : 0} insumos)`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
