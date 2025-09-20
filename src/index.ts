import { createDiscordClient } from './client/discord-client';
import { loadCommands } from './loaders/load-commands';
import { loadServices } from './loaders/load-services';
import { loadEvents } from './loaders/load-events';
import { logError } from './utils/log-error';
import { ENV } from './config/env-loader';

// Fonction principale
export async function bootstrap(): Promise<void> {
  const client = createDiscordClient();

  try {
    await loadCommands(client.commands);
    await loadEvents(client);
    await loadServices();

    await client.login(ENV.DISCORD_TOKEN);
  } catch (error) {
    logError('Erreur lors du démarrage du bot', error);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}