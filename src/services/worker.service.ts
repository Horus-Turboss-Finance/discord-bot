import type { WorkerEventPayloads } from '../types/worker-events';

type EventKey = keyof WorkerEventPayloads;
type Callback<K extends EventKey> = (payload: WorkerEventPayloads[K]) => void;

type ReverseEventMap = {
  [K in EventKey]: K;
};

type ListenerMap = {
  [K in EventKey]: Callback<ReverseEventMap[K]>[];
};

/**
 * Service Worker gérant l'émission et l'écoute d'événements internes.
 * 
 * Responsabilités :
 * - Gestion d'un système simple d'abonnement/émission d'événements spécifiques.
 */
export class WorkerService {
  private listeners: ListenerMap = {
    pageChange: [],
    pageError: [],
    updatePing: [],
  };

  /**
   * S'abonner à un événement Worker.
   * @param event Nom de l'événement
   * @param callback Fonction callback déclenchée lors de l'événement
   */
  on<K extends EventKey>(event: K, cb: Callback<K>) {
    this.listeners[event].push(cb);
  }

  /**
   * Se désabonner d'un événement Worker.
   * @param event Nom de l'événement
   * @param callback Fonction callback à retirer
   */
  off<K extends EventKey>(event: K, cb: Callback<K>) {
    this.listeners[event] = this.listeners[event].filter(x => x !== cb) as typeof this.listeners[typeof event];
  }

  /**
   * Émettre un événement Worker, appelant les callbacks abonnés.
   * @param event Nom de l'événement
   * @param args Arguments à transmettre aux callbacks
   */

  emit<K extends EventKey>(event: K, payload: WorkerEventPayloads[ReverseEventMap[K]]) {
    this.listeners[event].forEach(cb => {
      try {
        cb(payload); // args spreadé dans le type original → args[0] = payload
      } catch (e) {
        console.error(`[WorkerService] Erreur callback "${event}":`, e);
      }
    });
  }
}