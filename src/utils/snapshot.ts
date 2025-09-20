import axios from 'axios';
import { JSDOM } from 'jsdom';

import { extractJsFromDocument } from './extract-js';
import { extractCssFromDocument } from './extract-css';
import { extractImagesFromDocument } from './extract-images';
import { parseHtmlWithoutExternalAssets } from './parse-html';

export interface SnapshotContent {
  html: string;
  css: string;
  js: string;
  img: Buffer;
}

/**
 * Génère un snapshot complet d'une page HTML (HTML nettoyé, CSS, JS, images).
 * @param url URL de la page à capturer
 * @returns Structure SnapshotContent
 */
export async function generateSnapshotFromUrl(url: string): Promise<SnapshotContent> {
  try{
    const response = await axios.get(url, { responseType: 'text', headers: { Accept: 'text/html'} });
    
    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const baseUrl = new URL(url);
      
    const snapshot: SnapshotContent = {
      html: parseHtmlWithoutExternalAssets(document),
      css: await extractCssFromDocument(document, baseUrl),
      js: await extractJsFromDocument(document, baseUrl),
      img: await extractImagesFromDocument(document, baseUrl),
    };

    return snapshot;
  } catch (error) {
    const status = axios.isAxiosError(error) && error.response?.status;
    throw new Error(`Impossible de charger la page: ${url}${status ? ` (status: ${status})` : ''}`);
  }
}