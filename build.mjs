// Draws entry.png from src/content.ts: all layout and scene art is written here as SVG, rasterised by resvg.
// Run: node build.mjs   (needs npm i and the PT fonts in scratch/fonts, see README)
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync } from 'node:fs';
import { day, regions, badges, stories, dateCheck, footer } from './src/content.ts';

const FONT_DIR = process.env.FONT_DIR ?? 'scratch/fonts';
const fontFiles = ['PT_Serif-Web-Bold', 'PT_Serif-Web-Regular', 'PT_Sans-Web-Regular', 'PT_Sans-Web-Bold',
  'PT_Sans-Narrow-Web-Regular', 'PT_Sans-Narrow-Web-Bold'].map((f) => `${FONT_DIR}/${f}.ttf`);
const font = { fontFiles, loadSystemFonts: false, defaultFontFamily: 'PT Sans' };

const W = 1024, M = 20;
const PAPER = '#F6F1E6', INK = '#16161A', GREY = '#4A4A4A', RED = '#C0102C', RULE = '#16161A';
const SERIF = 'PT Serif', SANS = 'PT Sans', NARROW = 'PT Sans Narrow';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (n) => +n.toFixed(2);

// --- text measurement through resvg's own layout, so wrapping matches the render
const cache = new Map();
function width(str, fam, size, weight = 400) {
  const key = `${fam}|${size}|${weight}|${str}`;
  if (cache.has(key)) return cache.get(key);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="200"><text x="10" y="100" font-family="${fam}" font-size="${size}" font-weight="${weight}">${esc(str)}.</text></svg>`;
  const dot = `<svg xmlns="http://www.w3.org/2000/svg" width="3000" height="200"><text x="10" y="100" font-family="${fam}" font-size="${size}" font-weight="${weight}">.</text></svg>`;
  // measure "str." minus "." so a trailing space or glyph side bearing still counts
  const b = new Resvg(svg, { font }).getBBox(), d = new Resvg(dot, { font }).getBBox();
  const w = b ? b.width - (d ? d.width : 0) : 0;
  cache.set(key, w);
  return w;
}

let overflow = 0;
const problems = [];
function wrap(str, fam, size, weight, maxW, maxLines, firstW = maxW, tag = '') {
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const lim = lines.length === 0 ? firstW : maxW;
    const next = cur ? `${cur} ${w}` : w;
    if (width(next, fam, size, weight) <= lim || !cur) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  lines.forEach((l, i) => {
    if (width(l, fam, size, weight) > (i === 0 ? firstW : maxW)) { overflow++; problems.push(`too wide: ${tag} "${l}"`); }
  });
  if (lines.length > maxLines) { overflow++; problems.push(`${lines.length}>${maxLines} lines: ${tag} "${str}"`); }
  return lines;
}
function fit(str, fam, size, weight, maxW, tag) {
  if (width(str, fam, size, weight) > maxW) { overflow++; problems.push(`too wide: ${tag} "${str}"`); }
  return str;
}

const T = (x, y, s, { fam = SANS, size = 12, weight = 400, fill = INK, anchor = 'start', ls = 0 } = {}) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-family="${fam}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ''}>${esc(s)}</text>`;

// --- scenes, each drawn in a 160 x 64 box and scaled into its panel
const SEA = '#7FA6BC', SKY = '#E7DDC8', SAND = '#CDB68A', DARK = '#2A2A30', SMOKE = '#8A8580', FIRE = '#E0571B', GOLD = '#C99A2E';
const burst = (x, y, r, c = FIRE) => {
  const p = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16, rr = i % 2 ? r * 0.45 : r;
    p.push(`${fmt(x + Math.cos(a) * rr)},${fmt(y + Math.sin(a) * rr)}`);
  }
  return `<polygon points="${p.join(' ')}" fill="${c}"/><circle cx="${x}" cy="${y}" r="${fmt(r * 0.3)}" fill="#FFD25A"/>`;
};
const ship = (x, y, s, c = DARK) => `<g transform="translate(${x} ${y}) scale(${s})">
  <polygon points="-20,0 20,0 15,7 -16,7" fill="${c}"/><rect x="8" y="-7" width="7" height="7" fill="${c}"/><rect x="10" y="-11" width="2" height="4" fill="${c}"/>
  <rect x="-16" y="-3" width="22" height="3" fill="#6E3B2A"/></g>`;
const scenes = {
  hormuz: () => `<rect width="160" height="64" fill="${SKY}"/><polygon points="0,30 40,24 70,30 70,36 0,36" fill="${SAND}"/><polygon points="110,28 160,22 160,34 110,34" fill="${SAND}"/>
    <rect y="34" width="160" height="30" fill="${SEA}"/>${ship(38, 46, 0.9)}${ship(86, 52, 1.1)}${ship(128, 44, 0.8)}
    ${burst(46, 40, 6)}${burst(92, 45, 7)}${burst(133, 38, 5)}<path d="M0 58 Q20 55 40 58 T80 58 T120 58 T160 58" stroke="#5E879E" fill="none" stroke-width="1.2"/>`,
  libya: () => `<rect width="160" height="64" fill="${SKY}"/><rect y="38" width="160" height="26" fill="${SEA}"/><polygon points="0,38 30,32 46,38" fill="${SAND}"/>
    <circle cx="96" cy="16" r="9" fill="${SMOKE}" opacity="0.8"/><circle cx="106" cy="10" r="7" fill="${SMOKE}" opacity="0.7"/>
    <g transform="rotate(-9 100 40)"><polygon points="62,36 140,36 132,46 70,46" fill="${DARK}"/><rect x="86" y="27" width="22" height="9" fill="${DARK}"/>
    <rect x="94" y="19" width="6" height="8" fill="${DARK}"/><rect x="96" y="12" width="1.6" height="8" fill="${DARK}"/><rect x="112" y="32" width="12" height="4" fill="${DARK}"/></g>
    ${burst(84, 42, 9)}<polygon points="20,52 34,49 34,55" fill="${DARK}"/><path d="M34 52 L64 46" stroke="#FFFFFF" stroke-width="1.4" stroke-dasharray="3 2"/>`,
  gaza: () => `<rect width="160" height="64" fill="${SKY}"/><rect y="48" width="160" height="16" fill="#B9AA90"/>
    <rect x="10" y="22" width="26" height="26" fill="#9C9384"/><rect x="14" y="26" width="5" height="5" fill="${DARK}"/><rect x="24" y="26" width="5" height="5" fill="${DARK}"/>
    <polygon points="40,48 52,30 66,34 72,48" fill="#8E8678"/><polygon points="58,48 80,38 92,48" fill="#7D7669"/>
    <circle cx="62" cy="22" r="10" fill="${SMOKE}" opacity="0.85"/><circle cx="72" cy="12" r="8" fill="${SMOKE}" opacity="0.7"/>
    <rect x="104" y="34" width="34" height="14" fill="#F2F2F2" stroke="${DARK}" stroke-width="0.8"/><rect x="138" y="38" width="10" height="10" fill="#F2F2F2" stroke="${DARK}" stroke-width="0.8"/>
    <rect x="108" y="37" width="12" height="7" fill="#4A90C8"/><circle cx="112" cy="49" r="3" fill="${DARK}"/><circle cx="140" cy="49" r="3" fill="${DARK}"/>`,
  boat: () => `<rect width="160" height="64" fill="${SKY}"/><rect y="30" width="160" height="34" fill="#6F9A8C"/>
    <g transform="rotate(170 80 34)"><polygon points="50,30 110,30 102,40 58,40" fill="#7A4B2A"/></g>
    <path d="M0 40 Q15 36 30 40 T60 40 T90 40 T120 40 T160 40" stroke="#E8F0EC" fill="none" stroke-width="1.4"/>
    <path d="M0 52 Q15 48 30 52 T60 52 T90 52 T120 52 T160 52" stroke="#E8F0EC" fill="none" stroke-width="1.2"/>
    <circle cx="128" cy="46" r="6" fill="none" stroke="${RED}" stroke-width="3"/>`,
  podium: () => `<rect width="160" height="22" fill="#2E8B57"/><rect y="22" width="160" height="20" fill="#F4F1EA"/><rect y="42" width="160" height="22" fill="#C0102C"/>
    <polygon points="62,30 98,30 94,64 66,64" fill="${DARK}"/><rect x="58" y="26" width="44" height="6" fill="${DARK}"/>
    <path d="M80 26 L84 14" stroke="${DARK}" stroke-width="1.6"/><circle cx="84" cy="13" r="2.4" fill="${DARK}"/>`,
  flood: () => `<rect width="160" height="64" fill="${SKY}"/><polygon points="0,40 30,8 58,40" fill="#8C8F9A"/><polygon points="22,17 30,8 38,17 30,15" fill="#FFFFFF"/>
    <polygon points="40,40 74,4 108,40" fill="#7A7D88"/><polygon points="65,14 74,4 83,14 74,12" fill="#FFFFFF"/><polygon points="96,40 126,14 160,40" fill="#8C8F9A"/>
    <rect y="40" width="160" height="24" fill="#8A7A55"/><rect x="20" y="38" width="16" height="10" fill="#C9B79A"/><polygon points="18,38 28,31 38,38" fill="#7A4B2A"/>
    <rect y="46" width="160" height="18" fill="#6E8FA8" opacity="0.9"/><rect x="118" y="44" width="22" height="4" fill="${GOLD}"/><rect x="118" y="39" width="22" height="4" fill="${GOLD}"/><rect x="118" y="34" width="22" height="4" fill="${GOLD}"/>`,
  health: () => `<rect width="160" height="64" fill="#DCE6E8"/><circle cx="48" cy="32" r="20" fill="#2F6FA8"/><rect x="44" y="20" width="8" height="24" fill="#FFFFFF"/><rect x="36" y="28" width="24" height="8" fill="#FFFFFF"/>
    <circle cx="112" cy="32" r="12" fill="#8E2A4A"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4; return `<line x1="${fmt(112 + Math.cos(a) * 12)}" y1="${fmt(32 + Math.sin(a) * 12)}" x2="${fmt(112 + Math.cos(a) * 18)}" y2="${fmt(32 + Math.sin(a) * 18)}" stroke="#8E2A4A" stroke-width="2.4"/><circle cx="${fmt(112 + Math.cos(a) * 19)}" cy="${fmt(32 + Math.sin(a) * 19)}" r="2.2" fill="#8E2A4A"/>`; }).join('')}`,
  chip: () => `<rect width="160" height="64" fill="#DDE3D6"/><rect x="40" y="12" width="40" height="40" rx="3" fill="${DARK}"/><rect x="48" y="20" width="24" height="24" fill="#76B900" opacity="0.85"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${44 + i * 7}" y="6" width="3" height="6" fill="${GREY}"/><rect x="${44 + i * 7}" y="52" width="3" height="6" fill="${GREY}"/>`).join('')}
    <circle cx="104" cy="30" r="14" fill="none" stroke="${INK}" stroke-width="4"/><line x1="114" y1="40" x2="128" y2="54" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`,
  border: () => `<rect width="80" height="64" fill="#D6D2C6"/><rect x="80" width="80" height="64" fill="#E4DDCB"/><line x1="80" y1="0" x2="80" y2="64" stroke="${INK}" stroke-width="2" stroke-dasharray="5 3"/>
    ${[24, 44].map((y) => `<rect x="20" y="${y}" width="120" height="4" fill="${RED}"/>`).join('')}<rect x="18" y="18" width="5" height="40" fill="${DARK}"/><rect x="137" y="18" width="5" height="40" fill="${DARK}"/>
    <polygon points="80,4 94,20 66,20" fill="#F2C230" stroke="${INK}" stroke-width="1.2"/><rect x="79" y="9" width="2" height="6" fill="${INK}"/><rect x="79" y="16" width="2" height="2" fill="${INK}"/>`,
  drought: () => `<rect width="160" height="64" fill="#E9C98E"/><circle cx="128" cy="14" r="9" fill="#F2A12E"/>
    <rect y="40" width="160" height="24" fill="#B98A52"/>${[[10, 44, 40, 56], [40, 56, 70, 48], [70, 48, 104, 58], [104, 58, 150, 46], [56, 52, 60, 63], [92, 53, 96, 63]].map(([a, b, c, d]) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="#6E4A26" stroke-width="1.4"/>`).join('')}
    <polygon points="18,40 26,14 34,40" fill="#4E5A2A"/><path d="M22 40 Q18 28 26 20 Q26 30 32 30 Q34 38 30 40 Z" fill="${FIRE}"/>
    <polygon points="44,40 52,20 60,40" fill="#4E5A2A"/><path d="M48 40 Q46 32 52 26 Q52 32 57 34 Q58 39 55 40 Z" fill="${FIRE}"/>
    <circle cx="40" cy="12" r="7" fill="${SMOKE}" opacity="0.7"/><circle cx="50" cy="8" r="5" fill="${SMOKE}" opacity="0.6"/>`,
  gavel: () => `<rect width="160" height="64" fill="#E2D6C2"/><rect x="58" y="50" width="54" height="8" rx="2" fill="#6E3B2A"/>
    <g transform="rotate(-30 80 30)"><rect x="60" y="18" width="34" height="14" rx="3" fill="#7A4B2A"/><rect x="74" y="31" width="5" height="30" fill="#5A3520"/></g>`,
  trophy: () => `<rect width="160" height="64" fill="#2B2B36"/><circle cx="40" cy="16" r="1.5" fill="#F2D27A"/><circle cx="126" cy="12" r="1.5" fill="#F2D27A"/><circle cx="140" cy="40" r="1.2" fill="#F2D27A"/>
    <path d="M64 8 L96 8 L92 30 Q80 40 68 30 Z" fill="${GOLD}"/><path d="M64 12 Q52 12 56 22 Q60 28 67 28" stroke="${GOLD}" stroke-width="3" fill="none"/>
    <path d="M96 12 Q108 12 104 22 Q100 28 93 28" stroke="${GOLD}" stroke-width="3" fill="none"/><rect x="77" y="36" width="6" height="12" fill="${GOLD}"/><rect x="68" y="48" width="24" height="8" fill="${GOLD}"/>`,
  bars: () => `<rect width="160" height="64" fill="#D9D3C4"/><rect x="44" y="6" width="72" height="52" fill="#3A3A44"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${50 + i * 12}" y="6" width="4" height="52" fill="#B8B8BE"/>`).join('')}<rect x="44" y="28" width="72" height="4" fill="#B8B8BE"/>`,
  arson: () => `<rect width="160" height="64" fill="#3A2E2A"/><rect y="50" width="160" height="14" fill="#5A4A3A"/>
    <rect x="50" y="28" width="44" height="22" fill="#C9B79A"/><polygon points="46,28 72,10 98,28" fill="#7A4B2A"/><rect x="66" y="38" width="10" height="12" fill="${DARK}"/>
    <path d="M82 28 Q78 14 88 8 Q86 18 96 16 Q104 26 96 34 Z" fill="${FIRE}"/><path d="M88 30 Q86 22 91 18 Q92 24 96 26 Q96 32 90 34 Z" fill="#FFD25A"/>
    <path d="M40 50 Q36 38 44 32 Q44 40 50 40 Q52 48 46 50 Z" fill="${FIRE}"/>`,
};
const scene = (art, x, y, w, h) => `<svg x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" viewBox="0 0 160 64" preserveAspectRatio="xMidYMid slice">${scenes[art]()}</svg>`;

// label ON the art: white on red, bold
function artLabel(x, y, text, size) {
  const w = width(text, SANS, size, 700) + size * 0.9, h = size * 1.45;
  return `<rect x="${fmt(x)}" y="${fmt(y - h)}" width="${fmt(w)}" height="${fmt(h)}" fill="${RED}"/>` + T(x + size * 0.45, y - size * 0.38, text, { size, weight: 700, fill: '#FFFFFF' });
}
function pill(xRight, yBase, text, color, size) {
  const w = width(text, SANS, size, 700) + size * 1.1, h = size * 1.5;
  return { w, svg: `<rect x="${fmt(xRight - w)}" y="${fmt(yBase - h + size * 0.38)}" width="${fmt(w)}" height="${fmt(h)}" rx="${fmt(h / 2)}" fill="${color}"/>` + T(xRight - w / 2, yBase, text, { size, weight: 700, fill: '#FFFFFF', anchor: 'middle' }) };
}

// --- computed counts
stories.forEach((s, i) => { s.n = i + 1; });
const regionKeys = [...new Set(stories.map((s) => s.region))];
const fieldSet = new Set(stories.map((s) => s.field));
const N = stories.length;
const heroes = stories.slice(0, 3), tiles = stories.slice(3, 13), list = stories.slice(13);

const out = [];
out.push(`<rect width="${W}" height="${W}" fill="${PAPER}"/>`);

// 1. top line
out.push(T(M, 24, fit(`${day.kicker}  ·  ${day.order}`, SANS, 11.5, 700, 470, 'kicker'), { size: 11.5, weight: 700, fill: RED, ls: 0.4 }));
out.push(T(W - M, 24, fit(`${N} STORIES  ·  ${regionKeys.length} REGIONS  ·  ${fieldSet.size} FIELDS  ·  ALL FROM MONDAY 23 NOV 2026`, SANS, 11.5, 700, 500, 'topright'), { size: 11.5, weight: 700, anchor: 'end', ls: 0.4 }));
// 2. masthead
out.push(T(W / 2, 88, fit(`${day.weekday} ${day.date}`, SERIF, 66, 700, 984, 'masthead'), { fam: SERIF, size: 66, weight: 700, anchor: 'middle' }));
out.push(`<rect x="${M}" y="100" width="${W - 2 * M}" height="2.4" fill="${RULE}"/><rect x="${M}" y="105" width="${W - 2 * M}" height="0.9" fill="${RULE}"/>`);

// 3. heroes
const HG = 14, HW = (W - 2 * M - 2 * HG) / 3, HY = 116, HA = 124;
heroes.forEach((s, i) => {
  const x = M + i * (HW + HG), r = regions[s.region];
  out.push(scene(s.art, x, HY, HW, HA));
  out.push(artLabel(x + 8, HY + HA - 8, s.label, 17));
  const tag = s.place.toUpperCase(), tw = width(tag, SANS, 10.5, 700) + 12;
  out.push(`<rect x="${fmt(x + HW - 6 - tw)}" y="${HY + 6}" width="${fmt(tw)}" height="16" fill="${INK}" opacity="0.85"/>` + T(x + HW - 6 - tw / 2, HY + 18, tag, { size: 10.5, weight: 700, fill: '#FFFFFF', anchor: 'middle', ls: 0.4 }));
  const ky = HY + HA + 19;
  const b = pill(x + HW, ky, badges[s.badge].word, badges[s.badge].color, 10);
  out.push(b.svg);
  out.push(T(x, ky, String(s.n), { fam: SERIF, size: 17, weight: 700, fill: r.color }));
  const nw = width(String(s.n), SERIF, 17, 700) + 7;
  out.push(T(x + nw, ky - 1, fit(`${s.place.toUpperCase()}  ·  ${s.field}`, SANS, 11.5, 700, HW - nw - b.w - 8, s.id), { size: 11.5, weight: 700, fill: r.color, ls: 0.3 }));
  wrap(s.head, SERIF, 25, 700, HW, 2, HW, s.id).forEach((l, j) => out.push(T(x, ky + 30 + j * 27, l, { fam: SERIF, size: 25, weight: 700 })));
  wrap(`${s.sum} (${s.src})`, SANS, 12.5, 400, HW, 3, HW, s.id).forEach((l, j) => out.push(T(x, ky + 77 + j * 15, l, { size: 12.5, fill: GREY })));
});
const TOPT = HY + HA + 19 + 77 + 2 * 15 + 10; // below hero summaries
out.push(`<rect x="${M}" y="${TOPT}" width="${W - 2 * M}" height="1" fill="${RULE}"/>`);

// 4. tiles, 2 rows of 5
const TG = 12, TW = (W - 2 * M - 4 * TG) / 5, TA = 80, TH = 172;
tiles.forEach((s, i) => {
  const x = M + (i % 5) * (TW + TG), y = TOPT + 10 + Math.floor(i / 5) * (TH + 8), r = regions[s.region];
  out.push(scene(s.art, x, y, TW, TA));
  out.push(artLabel(x + 6, y + TA - 6, fit(s.label, SANS, 14, 700, TW - 30, s.id), 14));
  out.push(pill(x + TW - 4, y + 14, badges[s.badge].short, badges[s.badge].color, 9).svg);
  const ky = y + TA + 17;
  out.push(T(x, ky, String(s.n), { fam: SERIF, size: 15, weight: 700, fill: r.color }));
  const nw = width(String(s.n), SERIF, 15, 700) + 6;
  out.push(T(x + nw, ky - 1, fit(s.place.toUpperCase(), SANS, 11.5, 700, TW - nw, s.id), { size: 11.5, weight: 700, fill: r.color, ls: 0.3 }));
  wrap(s.head, SERIF, 16.5, 700, TW, 2, TW, s.id).forEach((l, j) => out.push(T(x, ky + 21 + j * 18.5, l, { fam: SERIF, size: 16.5, weight: 700 })));
  out.push(T(x, ky + 21 + 37 + 1, fit(s.sum, NARROW, 12.5, 400, TW, s.id), { fam: NARROW, size: 12.5, fill: GREY }));
  out.push(T(x, ky + 21 + 37 + 15, fit(s.src.toUpperCase(), SANS, 9, 700, TW, s.id), { size: 9, weight: 700, fill: '#6A6A6A', ls: 0.3 }));
});
const BOT = TOPT + 10 + 2 * TH + 8;
out.push(`<rect x="${M}" y="${BOT}" width="${W - 2 * M}" height="1" fill="${RULE}"/>`);

// 5. list in 2 columns
const LW = 640, CG = 16, CW = (LW - CG) / 2, LS = 13, LH = 15.5;
out.push(T(M, BOT + 18, day.listHead, { size: 12, weight: 700, fill: RED, ls: 0.6 }));
const colItems = [list.slice(0, Math.ceil(list.length / 2)), list.slice(Math.ceil(list.length / 2))];
let listBottom = 0;
colItems.forEach((items, c) => {
  let y = BOT + 38;
  const x0 = M + c * (CW + CG);
  for (const s of items) {
    const r = regions[s.region];
    const place = `${s.place}:`;
    const pw = width(place, NARROW, LS, 700) + 4;
    const bd = pill(x0 + CW, y, badges[s.badge].short, badges[s.badge].color, 9);
    const avail = CW - 20 - bd.w - 6;
    const lines = wrap(s.sum, NARROW, LS, 400, avail, 2, avail - pw, s.id);
    out.push(`<circle cx="${x0 + 8}" cy="${y - 4.5}" r="8.5" fill="${r.color}"/>` + T(x0 + 8, y - 0.8, String(s.n), { size: 10, weight: 700, fill: '#FFFFFF', anchor: 'middle' }));
    out.push(T(x0 + 20, y, place, { fam: NARROW, size: LS, weight: 700, fill: r.color }));
    lines.forEach((l, j) => out.push(T(x0 + 20 + (j ? 0 : pw), y + j * LH, l, { fam: NARROW, size: LS })));
    out.push(bd.svg);
    y += lines.length * LH + 6;
  }
  listBottom = Math.max(listBottom, y);
});

// region legend, full width above the footer, counts computed
const FY = W - 12;
let lx = M, ly = FY - 24;
for (const k of regionKeys) {
  const cnt = stories.filter((s) => s.region === k).length;
  const txt = `${regions[k].name} ${cnt}`;
  out.push(`<circle cx="${lx + 5}" cy="${ly - 4}" r="5" fill="${regions[k].color}"/>` + T(lx + 13, ly, txt, { size: 11, weight: 700, fill: regions[k].color }));
  lx += 13 + width(txt, SANS, 11, 700) + 12;
}
if (lx > W - M + 12) { overflow++; problems.push('legend too wide'); }
const legendSum = regionKeys.reduce((a, k) => a + stories.filter((s) => s.region === k).length, 0);
if (legendSum !== N) { overflow++; problems.push('legend sum mismatch'); }

// 6. framed date check
const DX = M + LW + 16, DW = W - M - DX, DY = BOT + 8;
const dc = [];
let dy = DY + 20;
dc.push(T(DX + 10, dy, 'DATE CHECK', { size: 12, weight: 700, fill: RED, ls: 0.6 }));
for (const [title, items] of [['Left out: other day', dateCheck.leftOut], ['Not yet happened', dateCheck.notYet], ['Figures', dateCheck.updated]]) {
  dy += 17;
  dc.push(T(DX + 10, dy, title, { size: 11.5, weight: 700 }));
  for (const it of items) {
    for (const l of wrap(it, SANS, 11, 400, DW - 30, 2, DW - 30, 'datecheck')) { dy += 14; dc.push(T(DX + 22, dy, l, { size: 11, fill: GREY })); }
  }
}
const DH = dy - DY + 12;
out.push(`<rect x="${DX}" y="${DY}" width="${DW}" height="${DH}" fill="#EFE8D8" stroke="${INK}" stroke-width="1.2"/>` + dc.join(''));
const bandBottom = Math.max(listBottom, DY + DH);

// 7. footer, one line
const foot = `C confirmed by 2+ outlets · O on the record · R one outlet · CL one side's claim   |   ${footer.method}   |   ${footer.fonts}`;
out.push(`<rect x="${M}" y="${FY - 16}" width="${W - 2 * M}" height="0.8" fill="${RULE}"/>`);
out.push(T(W / 2, FY, fit(foot, SANS, 10, 400, W - 2 * M, 'footer'), { size: 10, fill: GREY, anchor: 'middle' }));
if (bandBottom > ly - 14) { overflow++; problems.push(`bottom band ends at ${bandBottom}, footer rule at ${FY - 16}`); }

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}">${out.join('\n')}</svg>`;
const png = new Resvg(svg, { font, fitTo: { mode: 'original' } }).render().asPng();
writeFileSync('entry.png', png);
console.log(`stories ${N} regions ${regionKeys.length} fields ${fieldSet.size} overflow ${overflow} bytes ${png.length}`);
problems.forEach((p) => console.log('  ' + p));
