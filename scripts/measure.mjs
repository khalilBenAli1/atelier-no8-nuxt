import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root = '.output/public';
const walk = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
const files = walk(root);
const summary = {};
for (const [label, extension] of [
  ['javascript', '.js'],
  ['css', '.css'],
  ['fonts', '.woff2'],
  ['images', '.webp'],
]) {
  const selected = files.filter((file) => file.endsWith(extension));
  summary[label] = {
    files: selected.length,
    bytes: selected.reduce((total, file) => total + fs.statSync(file).size, 0),
  };
  if (['javascript', 'css'].includes(label))
    summary[label].gzipBytes = selected.reduce(
      (total, file) => total + gzipSync(fs.readFileSync(file)).length,
      0,
    );
}
summary.totalStaticBytes = files.reduce(
  (total, file) => total + fs.statSync(file).size,
  0,
);
summary.measurement =
  'Built artifact sizes; gzip is an offline estimate, not a Lighthouse score or measured live transfer.';
fs.writeFileSync(
  'docs/payload-report.json',
  JSON.stringify(summary, null, 2) + '\n',
);
console.log(summary);
