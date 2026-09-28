// Additive migration. Requires a verified snapshot; never resets the database.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
if (!process.env.DATABASE_URL) process.loadEnvFile(path.resolve(__dirname, '../.env'));
const dir = process.argv[2];
if (!dir || !path.isAbsolute(dir)) throw Error('Provide the absolute verified backup directory.');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'database-manifest.json')));
const archive = fs.readFileSync(path.join(dir, manifest.filename));
if (crypto.createHash('sha256').update(archive).digest('hex') !== manifest.sha256) throw Error('Backup checksum mismatch.');
const migrationName = '20260928120000_commercial_quantity_integrity';
const sql = fs.readFileSync(path.resolve(__dirname, '../../prisma/migrations', migrationName, 'migration.sql'), 'utf8');
const checksum = crypto.createHash('sha256').update(sql).digest('hex');
const statements = sql.split(';').map(s=>s.replace(/--[^\n]*/g,'').trim()).filter(s=>s && !['BEGIN','COMMIT'].includes(s));
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('commercial-quantity-integrity-migration'))::text AS locked`;
    await tx.$executeRawUnsafe("SET LOCAL lock_timeout = '5s'");
    const previous = await tx.$queryRawUnsafe('SELECT checksum, finished_at FROM "_prisma_migrations" WHERE migration_name=$1 AND rolled_back_at IS NULL', migrationName);
    if (previous.length) {
      if (previous.length !== 1 || previous[0].checksum !== checksum || !previous[0].finished_at) throw Error('Migration history does not match; no changes applied.');
      return { alreadyApplied: true };
    }
    for (const statement of statements) await tx.$executeRawUnsafe(statement);
    await tx.$executeRawUnsafe('INSERT INTO "_prisma_migrations" (id, checksum, migration_name, started_at, finished_at, applied_steps_count) VALUES ($1,$2,$3,now(),now(),1)', crypto.randomUUID(), checksum, migrationName);
    return { applied: true, statements: statements.length };
  }, { timeout: 60000, maxWait: 10000 });
  fs.writeFileSync(path.join(dir, 'schema-application.json'), JSON.stringify({ at: new Date().toISOString(), migrationName, checksum, backupSha256: manifest.sha256, ...result }, null, 2));
  console.log(JSON.stringify({ migrationName, ...result }));
}
main().catch(e=>{ console.error(e.code || e.name, e.meta?.message || 'Schema migration failed; transaction rolled back.'); process.exitCode=1; }).finally(()=>prisma.$disconnect());
