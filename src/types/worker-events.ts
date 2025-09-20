export interface PageErrorPayload {
  type: string;
  arr: string[];
}

export interface PageChangePayload {
  type: string;
  arr: { url: string; change: Record<string, boolean> }[];
}

export interface PingUpdatePayload {
  type: string;
  cfr: number;
}

/**
 * Mapping des noms d'événements vers leurs payloads respectifs
 */
export interface WorkerEventPayloads {
  pageChange: PageChangePayload;
  pageError: PageErrorPayload;
  updatePing: PingUpdatePayload;
}

export const WORKER_EVENTS = {
  PAGE_CHANGE: 'pageChange',
  PAGE_ERROR: 'pageError',
  UPDATE_PING: 'updatePing',
} as const;