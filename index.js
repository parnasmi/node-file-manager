import os from 'os';
import { argv, stdin as input, stdout as output } from 'process';
import readline from 'readline';
import {
  handleAdd,
  handleCat,
  handleCd,
  handleLs,
  handleMkdir,
  handleRm,
  handleUp,
} from './commands.js';
import { exitApp, printCurrentDir } from './utils.js';

const usernameArg = argv.find((arg) => arg.startsWith('--username='));
const username = usernameArg?.split('=')[1] || 'Someone';
let currentDir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDir(currentDir);

const rl = readline.createInterface({ input, output });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  const [command, ...args] = trimmed.split(' ');
  if (!command || typeof command !== 'string') {
    console.log('Invalid input');
    return;
  }
  try {
    switch (command) {
      case 'up':
        currentDir = handleUp(currentDir);
        break;
      case 'cd':
        currentDir = await handleCd(currentDir, args[0]);
        break;
      case 'ls':
        await handleLs(currentDir);
        break;
      case '.exit':
        exitApp(username);
        return;
      case 'cat':
        await handleCat(currentDir, args[0]);
        break;
      case 'add':
        await handleAdd(currentDir, args[0]);
        break;
      case 'rm':
        await handleRm(currentDir, args[0]);
        break;
      case 'mkdir':
        await handleMkdir(currentDir, args[0]);
        break;
      default:
        console.log('Invalid input');
    }
  } catch {
    console.log('Operation failed');
  }
  printCurrentDir(currentDir);
});

rl.on('SIGINT', () => {
  exitApp(username);
});
