#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

const PORT = 3000;

function main() {
  const root = path.resolve(__dirname, "..");

  // Start Next dev server on all interfaces
  const next = spawn(
    "npx",
    ["next", "dev", "--hostname", "0.0.0.0", "--port", String(PORT)],
    { cwd: root, stdio: ["inherit", "pipe", "inherit"] },
  );

  // Start a public tunnel using localtunnel (no account flow)
  const lt = spawn(
    "npx",
    ["localtunnel", "--port", String(PORT)],
    { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
  );

  let printed = false;
  const tryPrint = (chunk) => {
    if (printed) return;
    const s = chunk.toString();
    // localtunnel typically prints a URL like https://xxxx.loca.lt
    const m = s.match(/https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?::\d+)?/);
    if (m) {
      printed = true;
      console.log(m[0]);
    }
  };

  lt.stdout.on("data", tryPrint);
  lt.stderr.on("data", tryPrint);

  const shutdown = () => {
    try {
      lt.kill();
    } catch {}
    try {
      next.kill();
    } catch {}
  };

  process.on("SIGINT", () => {
    shutdown();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    shutdown();
    process.exit(0);
  });

  next.on("exit", (code) => process.exit(code ?? 0));
}

main();

