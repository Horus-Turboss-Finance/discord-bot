import { fetchBufferFromUrl } from './fetch-buffer';

export async function extractJsFromDocument(document: Document, baseUrl: URL): Promise<string> {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const jsChunks: string[] = [];

  for (const script of scripts) {
    const src = script.getAttribute('src');
    if (!src) continue;

    try {
      const absUrl = new URL(src, baseUrl).href;
      const jsBuffer = await fetchBufferFromUrl(absUrl);
      if (jsBuffer) {
        jsChunks.push(jsBuffer.toString('utf-8'));
      }
    } catch {
      continue;
    }
  }

  return jsChunks.join('\n');
}