import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    ...options,
  });
  if (result.error) {
    console.error(`Falha ao executar "${command} ${args.join(' ')}": ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

if (!existsSync(join(repoRoot, 'node_modules'))) {
  console.log('node_modules não encontrado. Instalando dependências...');
  run('npm', ['install']);
}

const tmpDir = mkdtempSync(join(tmpdir(), 'radref-ios-'));
const devicesFile = join(tmpDir, 'devices.json');

run('xcrun', ['devicectl', 'list', 'devices', '--json-output', devicesFile], { stdio: ['inherit', 'pipe', 'inherit'] });

const { result } = JSON.parse(readFileSync(devicesFile, 'utf8'));
rmSync(tmpDir, { recursive: true, force: true });

const devices = result?.devices ?? [];
const physical = devices.filter((d) => {
  const props = d.properties ?? d;
  const platform = props.hardware?.platform ?? props.deviceType;
  const reality = props.hardware?.reality ?? props.hardwareProperties?.reality;
  const bootState = props.state?.bootState ?? props.deviceProperties?.bootState;
  const pairing = props.connection?.pairingState ?? props.connectionProperties?.pairingState;
  return platform === 'iOS' && reality === 'physical' && bootState === 'booted' && pairing === 'paired';
});

if (physical.length === 0) {
  console.error('Nenhum iPhone/iPad físico conectado e emparelhado foi encontrado.');
  process.exit(1);
}

if (physical.length > 1) {
  console.log('Dispositivos físicos encontrados:');
  physical.forEach((d, i) => console.log(`  ${i + 1}. ${d.properties?.state?.name ?? d.properties?.hardware?.marketingName ?? d.deviceProperties?.name}`));
  console.log(`Usando o primeiro: ${physical[0].properties?.state?.name ?? physical[0].properties?.hardware?.marketingName ?? physical[0].deviceProperties?.name}`);
}

const device = physical[0];
const deviceName = device.properties?.state?.name ?? device.properties?.hardware?.marketingName ?? device.deviceProperties?.name;

console.log(`\nIniciando build Release para: ${deviceName}\n`);
run('npx', ['expo', 'run:ios', '--device', deviceName, '--configuration', 'Release']);
