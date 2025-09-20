import { generateSnapshotFromUrl } from '../utils/snapshot';
import { hashContent } from '../utils/hash-content';
import type { HashSet } from '../types/monitor';

export async function fetchSnapshotHash(url: string): Promise<HashSet> {
  const snapshot = await generateSnapshotFromUrl(url);

  return {
    html: hashContent(snapshot.html),
    css: hashContent(snapshot.css),
    js: hashContent(snapshot.js),
    img: hashContent(snapshot.img.toString()),
  };
}