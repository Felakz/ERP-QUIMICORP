const http = require('http');

async function testFull() {
  const loginData = JSON.stringify({ email: 'administracion@quimicorp.pe', password: 'Quimicorp2026!' });
  
  const loginReq = http.request({
    hostname: 'localhost',
    port: 3001,
    path: '/api/v1/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData),
    },
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const auth = JSON.parse(body);
      console.log('Login exitoso token:', auth.token ? 'GENERADO OK' : 'ERROR');

      const orderData = JSON.stringify({
        code: '#OP007_001',
        cliente: 'GEYMA S.A.C.',
        ruc: '20614697321',
        producto: 'FM-0008 - SERUM ANTIARRUGAS',
        cantidad: 29,
        unidad: 'KG',
        montoTotal: 4500,
        prioridad: 'URGENTE',
      });

      const orderReq = http.request({
        hostname: 'localhost',
        port: 3001,
        path: '/api/v1/pedidos-admin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(orderData),
          'Authorization': `Bearer ${auth.token}`,
        },
      }, (orderRes) => {
        let orderBody = '';
        orderRes.on('data', c => orderBody += c);
        orderRes.on('end', () => {
          console.log('Creación de Pedido Status:', orderRes.statusCode);
          console.log('Pedido Creado en BD:', orderBody);
        });
      });

      orderReq.write(orderData);
      orderReq.end();
    });
  });

  loginReq.write(loginData);
  loginReq.end();
}

testFull();
