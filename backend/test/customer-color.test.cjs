const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.resolve(__dirname, '../../frontend/lib/customerColor.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exported = {};
new Function('exports', compiled)(exported);
const { colorParaCliente } = exported;

test('quotation uses each customer label without exposing chemical names or codes', () => {
  const item = { color: 'QUIMICO INTERNO', aditivos: [
    { tipo: 'PIGMENTO', nombre: 'QUIMICO INTERNO', codigo: 'PIG-001', nombreCliente: ' Azul cielo ' },
    { tipo: 'PIGMENTO', nombre: 'OTRO QUIMICO', codigo: 'PIG-002' },
    { tipo: 'FRAGANCIA', nombre: 'AROMA', nombreCliente: 'No corresponde' },
  ] };
  assert.equal(colorParaCliente(item), 'Azul cielo, Color personalizado');
  assert.equal(item.aditivos[0].nombre, 'QUIMICO INTERNO');
});

test('legacy or empty labels never fall back to the internal chemical field', () => {
  assert.equal(colorParaCliente({ color: 'NOMBRE QUIMICO HISTORICO' }), 'Color personalizado');
  assert.equal(colorParaCliente({}), null);
  assert.equal(colorParaCliente({ aditivos: [{ tipo: 'PIGMENTO', nombreCliente: '  ' }] }), 'Color personalizado');
});
