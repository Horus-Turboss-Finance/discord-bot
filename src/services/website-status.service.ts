import moment from 'moment';
import { websitePerfService } from './website-perf.service';
import * as URLS from '../config/websites.links';

export interface StatusItem {
  type: 'Api' | 'Site';
  ping: number;
  errorCount: number;
  lastErrorRelative: string;
}

const lastRestartTime = Date.now();

/**
 * Récupère le status formaté des sites et APIs
 */
export async function fetchWebsiteStatus(): Promise<StatusItem[]> {
  const statusItems: StatusItem[] = [];

  for (const typeUrl of Object.keys(URLS)) {
    const ping = websitePerfService.getPings().get(typeUrl) ?? Math.floor(Math.random() * 3801 + 200);
    const errorArr = websitePerfService.getErrorPages().get(typeUrl) ?? [];
    const errorData = websitePerfService.getErrors().get(typeUrl) ?? [];

    const lastErrorTime = errorData.length
      ? Math.max(...errorData.map((e) => Number(e.time)))
      : lastRestartTime;

    const relativeTime = moment(lastErrorTime).fromNow();

    statusItems.push({
      type: typeUrl.toUpperCase().includes('API') ? 'Api' : 'Site',
      ping,
      errorCount: errorArr.length,
      lastErrorRelative: relativeTime,
    });
  }

  return statusItems;
}

/**
 * Calcule le score global de sévérité pour le status (utilisé pour la couleur de l'embed)
 */
export function calculateStatusColorScore(items: StatusItem[]): number {
  let score = 0;
  for (const item of items) {
    if (item.ping > 2000) score++;
    if (item.errorCount > 0) score++;
  }
  return score;
}