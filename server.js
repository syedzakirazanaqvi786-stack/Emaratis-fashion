/**
 * EMARATIS FASHION - ULTRA-FAST ZERO-DEPENDENCY LOCAL SERVER
 * Requires only Node.js (no npm install required).
 * Handles HTML, CSS, JavaScript, and sequential high-res 360 JPG frames.
 * Displays both Local and Network IP links for instant browser demo.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let parsedUrl = req.url.split('?')[0];
  if (parsedUrl === '/' || parsedUrl === '') {
    parsedUrl = '/index.html';
  }

  const safePath = path.normalize(decodeURIComponent(parsedUrl)).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${parsedUrl}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*'
    };

    if (ext === '.jpg' || ext === '.png' || ext === '.webp') {
      headers['Cache-Control'] = 'public, max-age=86400, immutable';
    } else {
      headers['Cache-Control'] = 'no-cache';
    }

    res.writeHead(200, headers);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  // 1. Prioritize Wi-Fi / Wireless adapters
  for (const name of Object.keys(interfaces)) {
    if (/wi-?fi|wlan|wireless|ethernet/i.test(name)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  // 2. Fallback to any active non-internal IPv4
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

server.listen(PORT, '0.0.0.0', () => {
  const networkIp = getNetworkIp();
  console.log(`\n================================================================`);
  console.log(`  EMARATIS FASHION — HAUTE COUTURE DIGITAL ATELIER & STUDIO`);
  console.log(`================================================================`);
  console.log(`  Local Demo Link:      http://localhost:${PORT}`);
  console.log(`  Network Demo Link:    http://${networkIp}:${PORT}`);
  console.log(`  Admin Credentials:    Username: admin  |  Password: emaratis2026`);
  console.log(`  360° Dress Viewer:    240 Sequential Studio Frames Active`);
  console.log(`================================================================`);
  console.log(`  Press Ctrl + C in terminal to stop server.\n`);
});
