import { fetchBufferFromUrl } from './fetch-buffer';

export async function extractCssFromDocument(document: Document, baseUrl: URL): Promise<string> {
  const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  const cssChunks: string[] = [];

  for (const link of cssLinks) {
    const href = link.getAttribute('href');
    if (!href) continue;

    try {
      const absUrl = new URL(href, baseUrl).href;
      const cssBuffer = await fetchBufferFromUrl(absUrl);
      if (cssBuffer) {
        cssChunks.push(cssBuffer.toString('utf-8'));
      }
    } catch {
      continue;
    }
  }

  return cssChunks.join('\n');
}