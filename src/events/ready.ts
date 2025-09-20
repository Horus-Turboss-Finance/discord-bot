import { Events, Client } from 'discord.js';
import { setupWorkerListeners } from '../services/worker-monitor.service';

export const config = {
  name: Events.ClientReady,
  once: true,
};

/**
 * Listener de l’événement ClientReady
 * @param client Client DiscordJS
 */
export const main = async (client: Client): Promise<void> => {
  // TODO: remplacer par un vrai logger
  console.log(`Connected! Logged in as ${client.user?.tag}`);
  client.user?.setStatus('dnd')

  // Initialisation des listeners Worker
  setupWorkerListeners(client);
};
