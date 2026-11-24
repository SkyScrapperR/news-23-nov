// Entry program (Node 22, standard library only): writes the pre-rendered entry.png to /output.
// The image is drawn by build.mjs from src/content.ts; this program only delivers its exact bytes.
import { readFileSync, writeFileSync } from 'node:fs';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const png = readFileSync(new URL('./entry.png', import.meta.url));
// the gate takes a whole PNG of at most 1 MiB: fail loudly here rather than ship a bad file
if (png.length > 1048576 || png.readUInt32BE(0) !== 0x89504e47) throw new Error('entry.png is not a PNG under 1 MiB');
writeFileSync(`${outDir}/entry.png`, png);
