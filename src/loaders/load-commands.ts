import { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import type { CommandDefinition } from '../types/command';
import { createCommandLoader } from './create-command-loader';

export async function loadCommands(
  commandCollection?: Collection<string, CommandDefinition>
): Promise<RESTPostAPIChatInputApplicationCommandsJSONBody[]> {
  const load = createCommandLoader();
  return await load(commandCollection);
}