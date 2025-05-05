import os from 'os';
import readline from 'readline';
import { argv, stdin as input, stdout as output } from 'process';
import fs from 'fs/promises';
import { statSync } from 'fs';
import path from 'path';

/* Parse username from CLI args */
const usernameArg = argv.find((arg) => arg.startsWith('--username='));
const username = usernameArg?.split('=')[1] || 'Someone';

/* Set starting directory to user's home */
let currentDir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDir();

/* Setup readline interface */
const rl = readline.createInterface({ input, output });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  const [command, ...args] = trimmed.split(' ');

  try {
    switch (command) {
      case 'up':
        handleUp();
        break;
      case 'cd':
        await handleCd(args[0]);
        break;
      case 'ls':
        await handleLs();
        break;
      case '.exit':
        exitApp();
        return;
      default:
        console.log('Invalid input');
    }
  } catch {
    console.log('Operation failed');
  }

  printCurrentDir();
});

function handleUp() {
  const parent = path.dirname(currentDir);
  // Prevent going above root (like C:\)
  if (parent !== currentDir) {
    currentDir = parent;
  }
}

async function handleCd(targetPath) {
  if (!targetPath) throw new Error();

  const resolvedPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(currentDir, targetPath);

  const stats = await fs.stat(resolvedPath);
  if (!stats.isDirectory()) throw new Error();

  currentDir = resolvedPath;
}

async function handleLs() {
  const items = await fs.readdir(currentDir);
  const detailed = await Promise.all(
    items.map(async (name) => {
      const fullPath = path.join(currentDir, name);
      const isFile = statSync(fullPath).isFile();
      return { Name: name, Type: isFile ? 'file' : 'directory' };
    }),
  );

  // Sort: directories first, then files
  detailed.sort((a, b) => {
    if (a.Type === b.Type) return a.Name.localeCompare(b.Name);
    return a.Type === 'directory' ? -1 : 1;
  });

  // Format as table
  console.table(detailed);
}

rl.on('SIGINT', () => {
  exitApp();
});

function printCurrentDir() {
  console.log(`You are currently in ${currentDir}`);
}

function exitApp() {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}
