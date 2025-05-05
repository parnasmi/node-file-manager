import os from 'os';
import readline from 'readline';
import { argv, stdin as input, stdout as output } from 'process';
import path from 'path';

// Parse username from CLI args
const usernameArg = argv.find(arg => arg.startsWith('--username='));
const username = usernameArg?.split('=')[1] || 'Anonymous';

// Set starting directory to user's home
let currentDir = os.homedir();

console.log(`Welcome to the File Manager, ${username}!`);
printCurrentDir();

// Setup readline interface
const rl = readline.createInterface({ input, output });

rl.on('line', (line) => {
  const trimmed = line.trim();

  if (trimmed === '.exit') {
    exitApp();
  } else {
    console.log('Invalid input'); // We'll add real command handling later
    printCurrentDir();
  }
});

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
