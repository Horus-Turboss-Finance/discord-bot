import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

import type { CommandDefinition } from '../types/command';
import { parseModule } from '../utils/parse-command-module';

/**
 * Fabrique une fonction de chargement des commandes depuis le dossier `commands/`
 */
export function createCommandLoader() {
  const commandsDir = resolve(__dirname, '../commands');

  return async function (
    collection?: Collection<string, CommandDefinition>
  ): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
    const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

    const commandFolders = readdirSync(commandsDir);

    for (const folderName of commandFolders) {
      const folderPath = join(commandsDir, folderName);
      if (!statSync(folderPath).isDirectory()) continue;

      const commandFiles = readdirSync(folderPath).filter(file =>
        file.endsWith('.ts') || file.endsWith('.js')
      );

      for (const fileName of commandFiles) {
        const commandPath = join(folderPath, fileName);
        const command = await parseModule(commandPath);

		    if (!command || !command.data || !command.main) continue;
        commands.push(command.data.toJSON());

        if (!collection) continue;
        collection.set(command.data.name, command);
      }
    }

    return commands;
  };
}