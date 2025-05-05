import os from 'os';
import readline from 'readline';
import { argv, stdin as input, stdout as output } from 'process';
import fs from 'fs/promises';
import { statSync } from 'fs';
import path from 'path';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { unlink } from 'fs/promises';
import { mkdir } from 'fs/promises';

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
      case 'cat':
        await handleCat(args[0]);
        break;
      case 'add':
        await handleAdd(args[0]);
        break;
      case 'rm':
        await handleRm(args[0]);
        break;
      case 'mkdir':
        await handleMkdir(args[0]);
        break;
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

  // Preventing going above root (like C:\)
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

async function handleCat(filePath) {
  if (!filePath) throw new Error();

  const fullPath = path.resolve(currentDir, filePath);

  const stream = createReadStream(fullPath, { encoding: 'utf8' });
  stream.on('error', () => {
    console.log('Operation failed');
  });
  stream.pipe(process.stdout);

  // Wait for stream to end before printing directory again
  await new Promise((resolve) => stream.on('end', resolve));
}

async function handleAdd(filename) {
  if (!filename) throw new Error();
  debugger;
  const filePath = path.join(currentDir, filename);
  await writeFile(filePath, '');
}

async function handleRm(filePath) {
  if (!filePath) throw new Error();

  const fullPath = path.resolve(currentDir, filePath);
  await unlink(fullPath);
}

async function handleMkdir(dirName) {
  if (!dirName) throw new Error();

  const dirPath = path.join(currentDir, dirName);
  await mkdir(dirPath);
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
