#!/usr/bin/env node
/**
 * Turns everything in source/ into web-ready files in public/img/.
 *
 * Pure Node (zlib only) - no image packages to install.
 *
 *   source/self_photo.png        -> public/img/portrait.png   (white bg removed, alpha)
 *   source/project_X_sc.PNG      -> public/img/project-x-hover.png
 *   source/project_X_pop_up_img  -> public/img/project-x-detail.png
 *
 * Run: npm run assets
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'source');
const OUT = path.join(ROOT, 'public', 'img');

/* ------------------------------------------------------------------ PNG I/O */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/** Decode a non-interlaced 8-bit PNG into straight RGBA. */
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let pos = 8;
  let ihdr = null;
  let plte = null;
  let trns = null;
  const idat = [];

  while (pos + 8 <= buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + len);
    if (type === 'IHDR') {
      ihdr = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        bitDepth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === 'IDAT') idat.push(Buffer.from(data));
    else if (type === 'PLTE') plte = Buffer.from(data);
    else if (type === 'tRNS') trns = Buffer.from(data);
    else if (type === 'IEND') break;
    pos += 12 + len;
  }

  if (!ihdr) throw new Error('missing IHDR');
  if (ihdr.interlace) throw new Error('interlaced PNG not supported');
  if (ihdr.bitDepth !== 8) throw new Error(`bit depth ${ihdr.bitDepth} not supported`);

  const ch = CHANNELS[ihdr.colorType];
  if (!ch) throw new Error(`colour type ${ihdr.colorType} not supported`);

  const { width: w, height: h } = ihdr;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const px = Buffer.alloc(stride * h);

  let p = 0;
  for (let y = 0; y < h; y++) {
    const filter = raw[p++];
    const line = raw.subarray(p, p + stride);
    p += stride;
    const cur = px.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? px.subarray((y - 1) * stride, y * stride) : null;
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0;
      const b = prev ? prev[i] : 0;
      const c = prev && i >= ch ? prev[i - ch] : 0;
      let v = line[i];
      switch (filter) {
        case 0: break;
        case 1: v += a; break;
        case 2: v += b; break;
        case 3: v += (a + b) >> 1; break;
        case 4: {
          const pa = Math.abs(b - c);
          const pb = Math.abs(a - c);
          const pc = Math.abs(a + b - 2 * c);
          v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
          break;
        }
        default: throw new Error(`unknown filter ${filter}`);
      }
      cur[i] = v & 0xff;
    }
  }

  const data = Buffer.alloc(w * h * 4);
  for (let i = 0, n = w * h; i < n; i++) {
    const s = i * ch;
    const d = i * 4;
    switch (ihdr.colorType) {
      case 0:
        data[d] = data[d + 1] = data[d + 2] = px[s];
        data[d + 3] = 255;
        break;
      case 2:
        data[d] = px[s]; data[d + 1] = px[s + 1]; data[d + 2] = px[s + 2];
        data[d + 3] = 255;
        break;
      case 3: {
        const idx = px[s];
        data[d] = plte[idx * 3]; data[d + 1] = plte[idx * 3 + 1]; data[d + 2] = plte[idx * 3 + 2];
        data[d + 3] = trns && idx < trns.length ? trns[idx] : 255;
        break;
      }
      case 4:
        data[d] = data[d + 1] = data[d + 2] = px[s];
        data[d + 3] = px[s + 1];
        break;
      default:
        data[d] = px[s]; data[d + 1] = px[s + 1]; data[d + 2] = px[s + 2]; data[d + 3] = px[s + 3];
    }
  }

  return { width: w, height: h, data };
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

/**
 * Encode straight RGBA to an 8-bit RGBA PNG with adaptive row filtering.
 * Picking the cheapest of the five filters per row typically saves 20-35%
 * over "no filter" on photographic content.
 */
function encodePng({ width, height, data }) {
  const bpp = 4;
  const stride = width * bpp;
  const raw = Buffer.alloc((stride + 1) * height);
  const candidates = [Buffer.alloc(stride), Buffer.alloc(stride), Buffer.alloc(stride), Buffer.alloc(stride), Buffer.alloc(stride)];

  for (let y = 0; y < height; y++) {
    const row = data.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : null;

    let best = 0;
    let bestScore = Infinity;

    for (let f = 0; f < 5; f++) {
      const dst = candidates[f];
      let score = 0;
      for (let i = 0; i < stride; i++) {
        const a = i >= bpp ? row[i - bpp] : 0;
        const b = prev ? prev[i] : 0;
        const c = prev && i >= bpp ? prev[i - bpp] : 0;
        let v;
        switch (f) {
          case 0: v = row[i]; break;
          case 1: v = row[i] - a; break;
          case 2: v = row[i] - b; break;
          case 3: v = row[i] - ((a + b) >> 1); break;
          default: v = row[i] - paeth(a, b, c);
        }
        v &= 0xff;
        dst[i] = v;
        score += v < 128 ? v : 256 - v; // absolute signed magnitude
      }
      if (score < bestScore) { bestScore = score; best = f; }
    }

    raw[y * (stride + 1)] = best;
    candidates[best].copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* --------------------------------------------------------------- operations */

/** Area-average downscale. Good quality for the ~2x reductions we do here. */
function resize(img, maxWidth) {
  if (img.width <= maxWidth) return img;
  const scale = maxWidth / img.width;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const out = Buffer.alloc(w * h * 4);

  for (let y = 0; y < h; y++) {
    const sy0 = Math.floor(y / scale);
    const sy1 = Math.min(img.height, Math.max(sy0 + 1, Math.ceil((y + 1) / scale)));
    for (let x = 0; x < w; x++) {
      const sx0 = Math.floor(x / scale);
      const sx1 = Math.min(img.width, Math.max(sx0 + 1, Math.ceil((x + 1) / scale)));
      let r = 0, g = 0, b = 0, a = 0, n = 0;
      for (let sy = sy0; sy < sy1; sy++) {
        let s = (sy * img.width + sx0) * 4;
        for (let sx = sx0; sx < sx1; sx++, s += 4) {
          r += img.data[s]; g += img.data[s + 1]; b += img.data[s + 2]; a += img.data[s + 3];
          n++;
        }
      }
      const d = (y * w + x) * 4;
      out[d] = r / n; out[d + 1] = g / n; out[d + 2] = b / n; out[d + 3] = a / n;
    }
  }
  return { width: w, height: h, data: out };
}

function boxBlur(src, w, h, radius) {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const win = radius * 2 + 1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        const xx = Math.min(w - 1, Math.max(0, x + k));
        sum += src[y * w + xx];
      }
      tmp[y * w + x] = sum / win;
    }
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let k = -radius; k <= radius; k++) {
        const yy = Math.min(h - 1, Math.max(0, y + k));
        sum += tmp[yy * w + x];
      }
      out[y * w + x] = sum / win;
    }
  }
  return out;
}

/**
 * Remove a flat white studio background.
 *
 * Flood-fills inward from the border so white *inside* the subject (the shirt)
 * survives, then erodes + feathers the mask for a clean edge. Finally bleeds
 * foreground colour outward so the semi-transparent rim is not white-fringed.
 */
function removeWhiteBackground(img, { threshold = 236, erode = 1, feather = 2 } = {}) {
  const { width: w, height: h, data } = img;
  const n = w * h;

  const white = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const s = i * 4;
    white[i] = data[s] >= threshold && data[s + 1] >= threshold && data[s + 2] >= threshold ? 1 : 0;
  }

  const bg = new Uint8Array(n);
  const stack = [];
  const seed = (i) => {
    if (!bg[i] && white[i]) { bg[i] = 1; stack.push(i); }
  };
  for (let x = 0; x < w; x++) { seed(x); seed((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { seed(y * w); seed(y * w + w - 1); }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) seed(i - 1);
    if (x < w - 1) seed(i + 1);
    if (y > 0) seed(i - w);
    if (y < h - 1) seed(i + w);
  }

  let mask = new Float32Array(n);
  for (let i = 0; i < n; i++) mask[i] = bg[i] ? 0 : 1;

  for (let e = 0; e < erode; e++) {
    const next = Float32Array.from(mask);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (!mask[i]) continue;
        if ((x > 0 && !mask[i - 1]) || (x < w - 1 && !mask[i + 1]) ||
            (y > 0 && !mask[i - w]) || (y < h - 1 && !mask[i + w])) next[i] = 0;
      }
    }
    mask = next;
  }

  mask = boxBlur(mask, w, h, feather);
  mask = boxBlur(mask, w, h, feather);

  const cut = Buffer.from(data);
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, Math.min(1, mask[i]));
    cut[i * 4 + 3] = Math.round(cut[i * 4 + 3] * a);
  }

  // Bleed colour outward into the transparent rim so edges don't halo white.
  const alpha = new Float32Array(n);
  for (let i = 0; i < n; i++) alpha[i] = cut[i * 4 + 3] / 255;
  for (let pass = 0; pass < 4; pass++) {
    const src = Buffer.from(cut);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (alpha[i] >= 0.99) continue;
        let r = 0, g = 0, b = 0, c = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            const j = yy * w + xx;
            if (alpha[j] < 0.99) continue;
            const s = j * 4;
            r += src[s]; g += src[s + 1]; b += src[s + 2]; c++;
          }
        }
        if (!c) continue;
        const d = i * 4;
        cut[d] = r / c; cut[d + 1] = g / c; cut[d + 2] = b / c;
      }
    }
  }

  return { width: w, height: h, data: cut, mask };
}

function crop(img, x0, y0, x1, y1) {
  const w = x1 - x0;
  const h = y1 - y0;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    img.data.copy(out, y * w * 4, ((y + y0) * img.width + x0) * 4, ((y + y0) * img.width + x1) * 4);
  }
  return { width: w, height: h, data: out };
}

function maskBounds(mask, w, h) {
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (mask[y * w + x] < 0.35) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { x0, y0, x1, y1 };
}

/* --------------------------------------------------------------------- main */

const read = (name) => decodePng(fs.readFileSync(path.join(SRC, name)));
const write = (name, img) => {
  const buf = encodePng(img);
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(`  ${name.padEnd(26)} ${img.width}x${img.height}  ${(buf.length / 1024).toFixed(0)} KB`);
};

fs.mkdirSync(OUT, { recursive: true });

// --- portrait -------------------------------------------------------------
console.log('portrait:');
{
  const original = read('self_photo.png');
  const small = resize(original, 1100);
  const cut = removeWhiteBackground(small);

  const b = maskBounds(cut.mask, cut.width, cut.height);
  console.log(`  subject bounds in ${cut.width}x${cut.height}: x ${b.x0}-${b.x1}, y ${b.y0}-${b.y1}`);

  // Head + upper body only. Also drops the studio watermark in the bottom corner.
  const y1 = Math.min(b.y1 + 1, Math.round(cut.height * 0.8));
  const pad = Math.round(cut.width * 0.015);
  const x0 = Math.max(0, b.x0 - pad);
  const x1 = Math.min(cut.width, b.x1 + pad + 1);
  const y0 = Math.max(0, b.y0 - Math.round(cut.height * 0.005));

  write('portrait.png', crop(cut, x0, y0, x1, y1));
}

// --- project imagery ------------------------------------------------------
console.log('projects:');
for (const key of ['a', 'b', 'c']) {
  const hover = fs.readdirSync(SRC).find((f) => f.toLowerCase() === `project_${key}_sc.png`);
  const detail = fs.readdirSync(SRC).find((f) => f.toLowerCase() === `project_${key}_pop_up_img.png`);
  if (hover) write(`project-${key}-hover.png`, resize(read(hover), 1400));
  if (detail) write(`project-${key}-detail.png`, resize(read(detail), 1600));
}

console.log('\ndone -> public/img');
