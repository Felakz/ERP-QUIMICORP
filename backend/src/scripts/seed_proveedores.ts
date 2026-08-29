import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Seed de Proveedores Oficiales en PostgreSQL ---');
  
  const seedFilePath = path.join(__dirname, '../../../frontend/lib/proveedoresRealData.ts');
  const fileContent = fs.readFileSync(seedFilePath, 'utf-8');
  
  const jsonMatch = fileContent.match(/export const PROVEEDORES_QUIMICORP_SEED: ProveedorReal\[\] = (\[[\s\S]*?\]);/);
  if (!jsonMatch) {
    console.error('No se pudo extraer el JSON de proveedores');
    return;
  }

  const suppliers = JSON.parse(jsonMatch[1]);
  console.log(`Total de proveedores a sincronizar: ${suppliers.length}`);

  for (const s of suppliers) {
    const existing = await prisma.proveedor.findUnique({
      where: { ruc: s.ruc },
    });

    if (!existing) {
      await prisma.proveedor.create({
        data: {
          ruc: s.ruc,
          razonSocial: s.razonSocial,
          contacto: s.contacto || null,
          telefono: s.telefono || null,
          correo: s.correo || null,
          direccion: s.direccion || null,
          insumoPrincipal: s.insumoPrincipal || 'Insumos Químicos',
          estado: s.estado || 'HOMOLOGADO',
          cuentasBancarias: {
            create: (s.cuentasBancarias || []).map((c: any) => ({
              banco: c.banco,
              moneda: c.moneda,
              numeroCuenta: c.numeroCuenta,
              cci: c.cci || null,
            })),
          },
        },
      });
      console.log(`+ Creado: ${s.razonSocial} (RUC: ${s.ruc})`);
    } else {
      console.log(`= Ya existe: ${s.razonSocial} (RUC: ${s.ruc})`);
    }
  }

  const totalInDb = await prisma.proveedor.count();
  console.log(`--- Seed finalizado con éxito. Total en BD: ${totalInDb} proveedores ---`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
