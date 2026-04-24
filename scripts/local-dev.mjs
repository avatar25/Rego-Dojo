import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

const processes = [
  {
    name: 'api',
    command: 'go',
    args: ['run', 'cmd/server/main.go'],
    env: { PORT: '8080' }
  },
  {
    name: 'web',
    command: 'npm',
    args: ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '3000']
  }
];

const children = processes.map(({ name, command, args, env }) => {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(`[${name}] ${chunk}`);
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[${name}] ${chunk}`);
  });

  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      process.exitCode = code;
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
};

process.on('SIGINT', () => {
  shutdown();
  process.exit(0);
});

process.on('SIGTERM', () => {
  shutdown();
  process.exit(0);
});

console.log('Rego Dojo local stack starting: http://localhost:3000');
