export function printCurrentDir(currentDir) {
  console.log(`You are currently in ${currentDir}`);
}

export function exitApp(username) {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}
