#!/usr/bin/env node
/**
 * Renders the running dev server in the locally-installed Chrome and saves
 * screenshots to screenshots/. Used to eyeball the design after changes.
 *
 * Requires playwright-core, which is not kept as a dependency:
 *   npm i -D playwright-core && npm run dev   (in another shell)
 *   node scripts/screenshot.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'screenshots');
const BASE = process.env.BASE_URL ?? 'http://localhost:5173';

fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });

/** Scroll the whole page so every whileInView reveal has fired, then return. */
async function settle(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(900);
}

const shots = [];

async function capture(name, options = {}) {
  const page = await browser.newPage({
    viewport: options.viewport ?? { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await settle(page);

  if (options.hash) {
    await page.evaluate((h) => {
      window.location.hash = h;
    }, options.hash);
    await page.waitForTimeout(1100);
  }

  if (options.before) await options.before(page);

  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: Boolean(options.fullPage) });
  shots.push(name);
  await page.close();
}

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 390, height: 844 };

// Hero, then each section as it appears when its nav item is clicked.
await capture('01-home', { viewport: DESKTOP, hash: '#home' });
await capture('02-about', { viewport: DESKTOP, hash: '#about' });
await capture('03-projects', { viewport: DESKTOP, hash: '#projects' });
await capture('04-contact', { viewport: DESKTOP, hash: '#contact' });

// Nav hover states
await capture('05-nav-hover', {
  viewport: DESKTOP,
  before: async (page) => {
    await page.locator('header nav a', { hasText: 'Contact' }).hover();
    await page.waitForTimeout(700);
  },
});

await capture('06-nav-lang-hover', {
  viewport: DESKTOP,
  before: async (page) => {
    await page.locator('header [role=group] button').first().hover();
    await page.waitForTimeout(700);
  },
});

// Modals for the two SDD projects - the warning callout should be yellow on both.
for (const [label, index] of [
  ['07-modal-food', 1],
  ['08-modal-pdm', 2],
]) {
  await capture(label, {
    viewport: DESKTOP,
    hash: '#projects',
    before: async (page) => {
      await page.locator('#projects article button').nth(index).click();
      await page.waitForTimeout(900);
    },
  });
}

// Equal-height check: the two bottom cards only.
await capture('09-cards', {
  viewport: DESKTOP,
  before: async (page) => {
    await page.locator('#projects article').nth(1).scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  },
});

await capture('10-mobile-home', { viewport: MOBILE, hash: '#home' });
await capture('11-mobile-about', { viewport: MOBILE, hash: '#about' });
await capture('12-indonesian', {
  viewport: DESKTOP,
  hash: '#about',
  before: async (page) => {
    await page.locator('header [role=group] button').nth(1).click();
    await page.waitForTimeout(900);
  },
});

await browser.close();
console.log(`saved ${shots.length} screenshots -> screenshots/`);
