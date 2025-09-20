import * as URLS from '../config/websites.links';
import { monitoringWorker } from '../client/worker';
import { WORKER_EVENTS } from '../types/worker-events';
import { captureAndCompare } from '../services/monitoring.service';

const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

async function executeMonitorJob(): Promise<void> {
  for (const typeUrl in URLS) {
    try {
      const jobResult = await captureAndCompare(URLS[typeUrl as keyof typeof URLS]);

      if (jobResult.changePage.length > 0) {
        monitoringWorker.emit(WORKER_EVENTS.PAGE_CHANGE, {
          type: typeUrl,
          arr: jobResult.changePage as unknown as { url: string; change: Record<string, boolean>; }[],
        });
      }

      if (jobResult.errorPage.length > 0) {
        monitoringWorker.emit(WORKER_EVENTS.PAGE_ERROR, {
          type: typeUrl,
          arr: jobResult.errorPage,
        });
      }

      monitoringWorker.emit(WORKER_EVENTS.UPDATE_PING, {
        type: typeUrl,
        cfr: jobResult.averagePing,
      });
    } catch (error) {
      // TODO : remplacer console.error par logger dédié en prod
      console.error('[Monitor Job error]', error);
    }
  }
}

executeMonitorJob();
setInterval(executeMonitorJob, INTERVAL_MS);

export default executeMonitorJob;