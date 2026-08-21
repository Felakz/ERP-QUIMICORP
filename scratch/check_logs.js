const { execSync } = require('child_process');
try {
  const out = execSync('docker logs quimicorp_backend --tail 50', { encoding: 'utf8' });
  console.log('=== DOCKER BACKEND LOGS ===');
  console.log(out);
} catch (e) {
  console.error('Error fetching logs:', e.message);
  if (e.stdout) console.log('STDOUT:', e.stdout);
  if (e.stderr) console.log('STDERR:', e.stderr);
}
