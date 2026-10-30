import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFile(resolve(root, p), 'utf8');
const html = await read('index.html');
const kb = JSON.parse(await read('assets/data/portfolio-kb.json'));
const pages = [...html.matchAll(/<article\b[^>]*data-page="([^"]+)"/g)].map(m => m[1]);
assert.equal(pages.length, 7, 'All seven profile sections must remain available');
assert.equal(new Set(pages).size, pages.length, 'Page names must be unique');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML IDs must be unique');
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(m => m[1]);
for (const ref of refs) {
  if (/^(?:https?:|data:|mailto:|tel:)/.test(ref)) continue;
  if (ref.startsWith('#')) {
    assert(ref === '#' || pages.includes(ref.slice(1)) || ids.includes(ref.slice(1)), `Broken section reference: ${ref}`);
  } else {
    await access(resolve(root, ref.split(/[?#]/)[0]));
  }
}
assert.equal(new Set(kb.chunks.map(c => c.id)).size, kb.chunks.length, 'KB IDs must be unique');
for (const chunk of kb.chunks) {
  assert(pages.includes(chunk.section), `Unknown KB section: ${chunk.id}`);
  assert(chunk.text && chunk.anchor, `Incomplete KB chunk: ${chunk.id}`);
}
const frensei = kb.chunks.find(c => c.id === 'exp-frensei').text;
assert(frensei.includes('October 2025 to October 2026'), 'Past role needs confirmed dates');
assert(!/\b(?:is Founding|to present|Currently: Founding)\b/i.test(frensei), 'Past role must not become a current employer');
assert(html.includes('October 2025 - October 2026'), 'Visible career dates must match the CV and KB');
assert(html.includes('October 2023 - September 2024'), 'IIT Kanpur dates must match the CV');
assert(kb.chunks.find(c => c.id === 'education').text.includes('September 2025 to August 2026'), 'Assistant education dates must match the CV');
assert(html.includes('September 2025 - August 2026'), 'Confirmed MSc dates must be preserved');
assert(html.includes('./assets/images/github-profile.jpg'), 'Current GitHub portrait must be used');
for (const image of html.matchAll(/<img\b[^>]*>/g)) assert(/\balt="/.test(image[0]), 'Images require alt text');
for (const file of await readdir(resolve(root, 'assets/js'))) {
  if (!file.endsWith('.js')) continue;
  const result = spawnSync(process.execPath, ['--check', resolve(root, 'assets/js', file)], { encoding: 'utf8' });
  assert.equal(result.status, 0, `${file}: ${result.stderr}`);
}
const api = spawnSync(process.execPath, ['--check', resolve(root, 'netlify/functions/ask.mjs')], { encoding: 'utf8' });
assert.equal(api.status, 0, api.stderr);
console.log(`Site checks passed: ${pages.length} sections, ${refs.length} links/assets, ${kb.chunks.length} grounded knowledge chunks, unique IDs, alt text, career dates and JavaScript syntax.`);
