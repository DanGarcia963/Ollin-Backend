// Pruebas de integridad estática. No requieren una base de datos ni credenciales.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const text = (path) => readFileSync(resolve(root, path), 'utf8');
const app = text('app.js');
const config = text('helpers/supabaseConfig.js');

assert.ok(text('Dockerfile').includes('FROM node:22-bookworm'), 'La imagen Docker necesita Bookworm.');
assert.ok(app.includes("app.get('/health'"), 'Falta healthcheck.');
assert.ok(app.includes("'0.0.0.0'"), 'El servidor debe escuchar en todas las interfaces.');
assert.ok(config.includes('ryulkebgdtiitpluexsv.supabase.co'), 'URL Ollin-db incorrecta.');
assert.ok(config.includes('SUPABASE_PUBLISHABLE_KEY'), 'Falta la variable de API key.');
assert.ok(!config.includes('sb_publishable_'), 'No se deben guardar claves publicables activas en el código.');

const files = [
  'app.js', 'controllers/authenticator.js', 'controllers/authenticatorAdmin.js',
  'models/MySQL/authenticator.js', 'models/MySQL/authenticatorAdmin.js',
  'models/MySQL/usuarioTurista.js', 'models/MySQL/usuarioAdmin.js',
  'helpers/supabaseConfig.js', 'services/mail.service.js'
];
for (const path of files) {
  const result = spawnSync(process.execPath, ['--check', resolve(root, path)], { encoding:'utf8' });
  assert.equal(result.status, 0, path + ' tiene un error de sintaxis:\n' + result.stderr);
}
console.log('Ollin backend: configuración y sintaxis verificadas (' + files.length + ' scripts).');
