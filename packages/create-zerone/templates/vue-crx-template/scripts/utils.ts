import process from 'node:process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { bgCyan, black } from 'kolorist';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
/**resolveFromRoot */
export const r = (...args: string[]) => resolve(__dirname, '..', ...args);
export const isDev = process.env.NODE_ENV !== 'production';
export const port = Number.parseInt(process.env.PORT || '') || 3303;
export function log(name: string, message: string) {
  console.log(black(bgCyan(` ${name} `)), message);
}
