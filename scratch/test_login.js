const http = require('http');

const data = JSON.stringify({
  email: 'administracion@quimicorp.pe',
  password: 'Quimicorp2026!'
});

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS:', res.statusCode);
    console.log('RESPONSE:', body);
    if (res.statusCode === 200) {
      const parsed = JSON.parse(body);
      testClientes(parsed.token);
    }
  });
});

req.write(data);
req.end();

function testClientes(token) {
  const req2 = http.request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/clientes',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }, (res2) => {
    let body2 = '';
    res2.on('data', (chunk) => body2 += chunk);
    res2.on('end', () => {
      console.log('CLIENTES STATUS:', res2.statusCode);
      console.log('CLIENTES COUNT:', JSON.parse(body2).length);
    });
  });
  req2.end();
}
