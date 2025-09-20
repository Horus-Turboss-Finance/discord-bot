import { notifyPageChange } from '../services/notify-page-change.service';
import { notifyPageError } from '../services/notify-page-error.service';
import { websitePerfService } from '../services/website-perf.service';
import type { WorkerEventPayloads } from '../types/worker-events';
import { monitoringWorker } from '../client/worker';
import { ChangeDetails } from '../types/monitor';
import { Events, Client } from 'discord.js';

export const config = {
  name: Events.ClientReady,
  once: true,
};

/**
 * Listener de l’événement ClientReady
 * @param client Client DiscordJS
 */
export const main = async (client: Client): Promise<void> => {
  /**
   * Événement : page modifiée
   */
  monitoringWorker.on('pageChange', (payload: WorkerEventPayloads[`pageChange`]) => {
    websitePerfService.updateChangedPages(payload.type, payload.arr as unknown as ChangeDetails);
    notifyPageChange(client, payload);
  });

  /**
   * Événement : erreur de page
   */
  monitoringWorker.on("pageError", (payload: WorkerEventPayloads['pageError']) => {
    websitePerfService.updateErrorPages(payload.type, payload.arr);
    notifyPageError(client, payload);
  });


  /**
   * Événement : mise à jour du ping
   */
  monitoringWorker.on("updatePing", (payload: WorkerEventPayloads['updatePing']) => {
    websitePerfService.updateAveragePing(payload.type, payload.cfr);
  });
};