import fs from 'fs/promises';
import { statSync, createReadStream } from 'fs';
import path from 'path';

export function handleUp(currentDir) {
  const parent = path.dirname(currentDir);
  if (parent !== currentDir) {
    return parent;
  }
  return currentDir;
}

export async function handleCd(currentDir, targetPath) {
  if (!targetPath) throw new Error();
  const resolvedPath = path.isAbsolute(targetPath)
    ? targetPath
    : path.resolve(currentDir, targetPath);
  const stats = await fs.stat(resolvedPath);
  if (!stats.isDirectory()) throw new Error();
  return resolvedPath;
}

export async function handleCat(currentDir, filePath) {
  if (!filePath) throw new Error();
  const fullPath = path.resolve(currentDir, filePath);
  const stream = createReadStream(fullPath, { encoding: 'utf8' });
  stream.on('error', () => {
    console.log('Operation failed');
  });
  stream.pipe(process.stdout);
  await new Promise((resolve) => stream.on('end', resolve));
}

export async function handleAdd(currentDir, filename) {
  if (!filename) throw new Error();
  const filePath = path.join(currentDir, filename);
  await fs.writeFile(filePath, '');
}

export async function handleRm(currentDir, filePath) {
  if (!filePath) throw new Error();
  const fullPath = path.resolve(currentDir, filePath);
  await fs.unlink(fullPath);
}

export async function handleMkdir(currentDir, dirName) {
  if (!dirName) throw new Error();
  const dirPath = path.join(currentDir, dirName);
  await fs.mkdir(dirPath);
}

export async function handleLs(currentDir) {
  const items = await fs.readdir(currentDir);
  const detailed = await Promise.all(
    items.map(async (name) => {
      const fullPath = path.join(currentDir, name);
      const isFile = statSync(fullPath).isFile();
      return { Name: name, Type: isFile ? 'file' : 'directory' };
    }),
  );
  detailed.sort((a, b) => {
    if (a.Type === b.Type) return a.Name.localeCompare(b.Name);
    return a.Type === 'directory' ? -1 : 1;
  });
  console.table(detailed);
}
