// Restores the logical snapshot ONLY into the fixed, isolated localhost audit DB.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const url = process.env.DATABASE_URL;
if (!url || new URL(url).hostname !== '127.0.0.1' || new URL(url).pathname !== '/quimicorp_validation') throw Error('Only the isolated localhost validation database is allowed.');
const dir = process.argv[2];
const archive = fs.readFileSync(path.join(dir, 'public-database-before.json.gz'));
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'database-manifest.json')));
if (crypto.createHash('sha256').update(archive).digest('hex') !== manifest.sha256) throw Error('Backup checksum mismatch.');
const snapshot = JSON.parse(zlib.gunzipSync(archive));
const prisma = new PrismaClient();
const quote = value => '"' + value.replaceAll('"', '""') + '"';
async function main() {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (id varchar(36) PRIMARY KEY, checksum varchar(64) NOT NULL, finished_at timestamptz, migration_name varchar(255) NOT NULL, logs text, rolled_back_at timestamptz, started_at timestamptz NOT NULL DEFAULT now(), applied_steps_count integer NOT NULL DEFAULT 0)`);
  await prisma.$transaction(async tx => {
    await tx.$executeRawUnsafe('SET LOCAL session_replication_role = replica');
    for (const [table, payload] of Object.entries(snapshot.tables)) {
      const [{ existing }] = await tx.$queryRawUnsafe('SELECT to_regclass($1)::text AS existing', 'public.' + table);
      if (!existing) {
        const columns = snapshot.columns.filter(c => c.table_name === table);
        if (!columns.length) throw Error('Missing backup column metadata: ' + table);
        await tx.$executeRawUnsafe(`CREATE TABLE ${quote(table)} (${columns.map(c => quote(c.column_name) + ' ' + quote(c.udt_name) + (c.is_nullable === 'NO' ? ' NOT NULL' : '')).join(',')})`);
      }
      const [{ count }] = await tx.$queryRawUnsafe(`SELECT count(*)::int AS count FROM ${quote(table)}`);
      if (count) throw Error('The isolated copy must be empty: ' + table);
      const columns = await tx.$queryRawUnsafe('SELECT column_name FROM information_schema.columns WHERE table_schema=\'public\' AND table_name=$1 AND is_generated=\'NEVER\' ORDER BY ordinal_position', table);
      const names = columns.map(c => quote(c.column_name)).join(',');
      await tx.$executeRawUnsafe(`INSERT INTO ${quote(table)} (${names}) SELECT ${names} FROM json_populate_recordset(NULL::${quote(table)}, $1::json)`, payload);
    }
  }, { timeout: 120000 });
  console.log(JSON.stringify({ restoredTables: Object.keys(snapshot.tables).length, rows: Object.values(manifest.tables).reduce((a,b)=>a+b,0), isolatedLocalDatabase: true }));
}
main().catch(e=>{ console.error(e.message); process.exitCode=1; }).finally(()=>prisma.$disconnect());
