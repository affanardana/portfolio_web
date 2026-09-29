#!/usr/bin/env node
/**
 * Regenerates src/data/brandIcons.js from the `simple-icons` package.
 *
 * That package is large, so it is NOT kept as a dependency - the generated
 * file is committed instead. Re-run only when you want to refresh the artwork:
 *
 *   npm i -D simple-icons && node scripts/extract-icons.mjs && npm remove simple-icons
 *
 * Icons are looked up by title rather than export name so this keeps working
 * across simple-icons releases that reshuffle their export casing.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as si from 'simple-icons';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** local key -> simple-icons title */
const WANTED = {
  python: 'Python',
  pytorch: 'PyTorch',
  postgresql: 'PostgreSQL',
  onnx: 'ONNX',
  scikitlearn: 'scikit-learn',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
};

/** Titles that may legitimately be absent - skipped with a warning, not fatal. */
const OPTIONAL = new Set(['ONNX', 'scikit-learn']);

/**
 * Brands that simple-icons dropped over trademark concerns, pinned from the
 * last release that still shipped them (v9.21.0).
 */
const FALLBACKS = {
  LinkedIn: {
    hex: '0A66C2',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
};

const byTitle = new Map();
for (const icon of Object.values(si)) {
  if (icon && typeof icon === 'object' && icon.title && icon.path) {
    if (!byTitle.has(icon.title)) byTitle.set(icon.title, icon);
  }
}

const entries = [];
for (const [key, title] of Object.entries(WANTED)) {
  const icon = byTitle.get(title) ?? FALLBACKS[title];
  if (!icon) {
    if (OPTIONAL.has(title)) {
      console.warn(`  skipped "${title}" - not in this simple-icons release`);
      continue;
    }
    throw new Error(`no icon available for "${title}"`);
  }
  const hex = String(icon.hex).replace(/^#/, '');
  entries.push(
    `  ${key}: {\n    title: ${JSON.stringify(title)},\n    hex: '#${hex}',\n    path: ${JSON.stringify(icon.path)},\n  },`,
  );
}

const file = `// GENERATED FILE - do not edit by hand.
// Source: simple-icons (CC0-1.0). Regenerate with scripts/extract-icons.mjs.
// Brand marks render in monotone and take their real colour on hover.

export const brandIcons = {
${entries.join('\n')}
};

export default brandIcons;
`;

fs.mkdirSync(path.join(ROOT, 'src', 'data'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'src', 'data', 'brandIcons.js'), file);
console.log(
  `wrote src/data/brandIcons.js — ${entries.length} icons, ${(file.length / 1024).toFixed(1)} KB`,
);
