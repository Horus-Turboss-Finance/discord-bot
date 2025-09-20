import axios from 'axios';

/**
 * Télécharge une ressource distante sous forme de buffer.
 * @param url URL absolue de la ressource
 * @returns Buffer ou null si le téléchargement échoue
 */
export async function fetchBufferFromUrl(url: string): Promise<Buffer | null> {
  try {
    const response = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } catch {
    return null;
  }
}
