#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const os = require('os');
const path = require('path');

const PORT = 3000;

function getLocalIP() {
  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) return iface.address;
      }
    }
  } catch (_) {}
  // Fallback: shell (macOS en0/en1, Linux hostname -I)
  for (const cmd of ['ipconfig getifaddr en0', 'ipconfig getifaddr en1', 'hostname -I']) {
    try {
      const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      const ip = (out || '').trim().split(/\s/)[0];
      if (ip && /^\d+\.\d+\.\d+\.\d+$/.test(ip)) return ip;
    } catch (_) {}
  }
  return null;
}

function startNgrok(port) {
  const ngrok = spawn('ngrok', ['http', String(port)], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  const capture = (d) => { output += d.toString(); };
  ngrok.stdout.on('data', capture);
  ngrok.stderr.on('data', capture);
  ngrok.on('error', () => {});
  const done = setInterval(() => {
    const m = output.match(/https:\/\/[a-zA-Z0-9-]+\.(?:ngrok-free\.app|ngrok\.io)/);
    if (m) {
      clearInterval(done);
      console.log(m[0]);
    }
  }, 500);
  setTimeout(() => clearInterval(done), 10000);
}

function main() {
  const root = path.resolve(__dirname, '..');
  const localIP = getLocalIP();

  const child = spawn(
    'npx',
    ['next', 'dev', '--hostname', '0.0.0.0', '--port', String(PORT)],
    { cwd: root, stdio: ['inherit', 'pipe', 'inherit'] }
  );

  let urlPrinted = false;
  function printUrl(url) {
    if (urlPrinted) return;
    urlPrinted = true;
    // Single line so you can copy-paste into mobile browser
    console.log(url);
  }

  child.stdout.on('data', (d) => {
    const s = d.toString();
    process.stdout.write(s);
    if (/Ready in|compiled|started server|Local:/.test(s) && localIP) {
      printUrl(`http://${localIP}:${PORT}`);
    }
  });

  // Ensure URL is printed once server is likely ready
  setTimeout(() => {
    if (localIP) printUrl(`http://${localIP}:${PORT}`);
  }, 4000);

  child.on('exit', (code) => process.exit(code ?? 0));

  // If no local IP, try ngrok after server has had time to start
  if (!localIP) {
    setTimeout(() => {
      console.error('No local IP found. Trying ngrok...');
      startNgrok(PORT);
    }, 5000);
  }
}

main();
