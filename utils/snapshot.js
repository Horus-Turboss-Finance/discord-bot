const fetch = require('node-fetch').default;
const { JSDOM } = require('jsdom');

/* --- Téléchargement ressource --- */
const downloadResource = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

/* --- Génération instantané complet (HTML+CSS+images inline) --- */
/* Update 04.08.2025 by Horus - Change type detection */
module.exports.snapshotPageDetailed = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Impossible de charger la page: ${url}`);

  const html = await res.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const baseUrl = new URL(url);

  const contents = {
    html: '',
    css: '',
    js: '',
    img: Buffer.alloc(0),
  };

  /* HTML (sans les scripts ni liens CSS) */
  const cloneDoc = document.cloneNode(true);

  [...cloneDoc.querySelectorAll('script')].forEach(el => el.remove());
  [...cloneDoc.querySelectorAll('link[rel="stylesheet"]')].forEach(el => el.remove());

  contents.html = '<!DOCTYPE html>\n' + cloneDoc.documentElement.outerHTML;

  /* CSS */
  const cssLinks = [...document.querySelectorAll('link[rel="stylesheet"]')];
  await Promise.all(cssLinks.map(async link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const absUrl = new URL(href, baseUrl).href;
    const cssBuffer = await downloadResource(absUrl);
    if (cssBuffer) contents.css += cssBuffer.toString() + '\n';
  }));

  /* JS */
  const scripts = [...document.querySelectorAll('script[src]')];
  await Promise.all(scripts.map(async script => {
    const src = script.getAttribute('src');
    if (!src) return;
    const absUrl = new URL(src, baseUrl).href;
    const jsBuffer = await downloadResource(absUrl);
    if (jsBuffer) contents.js += jsBuffer.toString() + '\n';
  }));

  /* IMG (somme des buffers img) */
  const imgs = [...document.querySelectorAll('img')];
  for (const img of imgs) {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) continue;
    const absUrl = new URL(src, baseUrl).href;
    const imgBuffer = await downloadResource(absUrl);
    if (imgBuffer) contents.img = Buffer.concat([contents.img, imgBuffer]);
  }

  return contents;
};