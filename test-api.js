const http = require('http');

const data = JSON.stringify({
  formData: {
    fullName: "테스트",
    phone: "010-1234-5678",
    email: "test@example.com",
    address: "서울시 강남구"
  },
  items: [
    { name: "테스트 상품", quantity: 1 }
  ],
  totalQuantity: 1
});

const req = http.request({
  hostname: 'localhost',
  port: 3000,
  path: '/api/order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
}, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(`STATUS: ${res.statusCode} BODY: ${body}`));
});

req.on('error', (e) => console.error(`problem with request: ${e.message}`));
req.write(data);
req.end();
