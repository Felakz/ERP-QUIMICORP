// Consistent logical snapshot of application tables. No writes to PostgreSQL.
// Credentials are read from the existing .env and never included in the backup.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { PrismaClient } = require('@prisma/client');
process.loadEnvFile(path.resolve(__dirname, '../.env'));
const destination = process.argv[2];
if (!destination || !path.isAbsolute(destination)) throw new Error('Provide an absolute backup directory.');
const prisma = new PrismaClient();
const quote = name => '"' + name.replace(/"/g, '""') + '"';
async function main() {
  fs.mkdirSync(destination, { recursive: true });
  const snapshot = await prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe('SET TRANSACTION READ ONLY');
    const tables = await tx.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name");
    const columns = await tx.$queryRawUnsafe("SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default, is_generated FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name, ordinal_position");
    const constraints = await tx.$queryRawUnsafe("SELECT c.conrelid::regclass::text AS table_name, c.conname, c.contype, pg_get_constraintdef(c.oid) AS definition FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname='public'");
    const indexes = await tx.$queryRawUnsafe("SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname='public'");
    const enums = await tx.$queryRawUnsafe("SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' GROUP BY t.typname");
    const result = { capturedAt: new Date().toISOString(), schema: 'public', isolation: 'RepeatableRead', columns, constraints, indexes, enums, tables: {} };
    for (const { table_name } of tables) {
      // JSON is built server-side to retain exact decimal strings in its numeric tokens.
      const [{ payload }] = await tx.$queryRawUnsafe(`SELECT COALESCE(json_agg(t)::text, '[]') AS payload FROM public.${quote(table_name)} t`);
      result.tables[table_name] = payload;
    }
    return result;
  }, { isolationLevel: 'RepeatableRead', timeout: 120000, maxWait: 15000 });
  const serialized = JSON.stringify(snapshot);
  const archive = zlib.gzipSync(Buffer.from(serialized));
  const filename = 'public-database-before.json.gz';
  fs.writeFileSync(path.join(destination, filename), archive, { flag: 'wx' });
  const counts = Object.fromEntries(Object.entries(snapshot.tables).map(([name, json]) => [name, JSON.parse(json).length]));
  const manifest = { capturedAt: snapshot.capturedAt, filename, sha256: crypto.createHash('sha256').update(archive).digest('hex'), compressedBytes: archive.length, tables: counts,
    scope: 'All public base tables and catalog metadata; excludes Supabase auth/storage schemas. Each table is stored as an exact JSON text string.',
    recovery: 'Restore first into an isolated PostgreSQL database using the original schema. For live batch reversal use its conditional rollback manifest; do not overwrite subsequent production activity with a full snapshot.' };
  fs.writeFileSync(path.join(destination, 'database-manifest.json'), JSON.stringify(manifest, null, 2));
  const verify = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(destination, filename))));
  if (Object.keys(verify.tables).length !== Object.keys(counts).length) throw new Error('Backup verification failed.');
  console.log(JSON.stringify({ destination, sha256: manifest.sha256, tables: Object.keys(counts).length, rows: Object.values(counts).reduce((a, b) => a + b, 0), verified: true }));
}
main().catch(error => { console.error(error.name + ': backup failed (no database writes).'); process.exitCode = 1; }).finally(() => prisma.$disconnect());
