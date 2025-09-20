import { fetchBufferFromUrl } from './fetch-buffer';

export async function extractImagesFromDocument(document: Document, baseUrl: URL): Promise<Buffer> {
  const images = Array.from(document.querySelectorAll('img'));
  const buffers: Buffer[] = [];

  for (const img of images) {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) continue;

    try {
      const absUrl = new URL(src, baseUrl).href;
      const imgBuffer = await fetchBufferFromUrl(absUrl);
      if (imgBuffer) {
        buffers.push(imgBuffer);
      }
    } catch {
      continue;
    }
  }

  return Buffer.concat(buffers);
}