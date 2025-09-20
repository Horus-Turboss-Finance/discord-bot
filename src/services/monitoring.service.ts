import type { CaptureCompareResult, ChangePageItem } from '../types/monitor';
import { fetchSnapshotHash } from './snapshot.service';
import { loadBaselineData, saveBaselineData, loadErrorData, saveErrorData } from './hash-data.service';

import type { ChangeDetails } from '../types/monitor';
export async function captureAndCompare(urls: string[]): Promise<CaptureCompareResult> {
  const baselineData = loadBaselineData(), errorData = loadErrorData(), changePage: ChangePageItem[] = [], errorPage: string[] = [], times: number[] = [];

  for (const url of urls) {
    try {
      const start = Date.now(), currentHash = await fetchSnapshotHash(url), duration = Date.now() - start;
      times.push(duration);

      const previousHash = baselineData[url];

      const hasChanged =
        !previousHash || ['html', 'css', 'js', 'img'].some(k => previousHash[k as keyof typeof previousHash] !== currentHash[k as keyof typeof currentHash]);

      if (hasChanged) {
        changePage.push({
          url,
          change: Object.fromEntries(
            ['html', 'css', 'js', 'img'].map(k => 
              [k, previousHash?.[k as keyof typeof previousHash] !== currentHash[k as keyof typeof currentHash]]
            )) as unknown as ChangeDetails
        });

        baselineData[url] = currentHash;
      }
    } catch {
      errorPage.push(url);
      errorData[url] = Date.now();
    }
  }

  saveBaselineData(baselineData); saveErrorData(errorData);
  const averagePing = times.length > 0 ? Math.floor(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  return { changePage, errorPage, averagePing };
}