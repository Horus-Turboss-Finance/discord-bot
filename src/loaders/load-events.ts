import { Client, type ClientEvents } from "discord.js";
import type { EventDefinition } from "../types/event";
import { join, resolve } from 'node:path';
import { readdirSync } from 'node:fs';

/**
 * Charge dynamiquement les listeners Discord définis dans src/events/
 * @param client Instance du client Discord
 */
export async function loadEvents(client: Client): Promise<void> {
  const eventsDir = resolve(__dirname, '../events');
  const eventFiles = readdirSync(eventsDir).filter((file) =>
    file.endsWith('.ts') || file.endsWith('.js')
  );

  for (const fileName of eventFiles) {
    const filePath = join(eventsDir, fileName);
    const eventModule = await import(filePath);
    const event = (eventModule.default ?? eventModule) as EventDefinition<keyof ClientEvents>;

    if (!event?.config?.name || typeof event.main !== 'function') {
      console.warn(`[⚠️] Événement invalide : "${filePath}"`);
      continue;
    }

    const listener = (...args: unknown[]) =>
      (event.main as (...args: unknown[]) => void)(...args);

    if (event.config.once) {
      client.once(event.config.name, listener);
    } else {
      client.on(event.config.name, listener);
    }
  }
}