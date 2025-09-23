import { buildHelpEmbed, buildHelpErrorEmbed, buildHelpDetailEmbed } from '../utils/build-embed/build-help-embed';
import { loadCommands } from '../loaders/load-commands';
import { Collection, EmbedBuilder } from 'discord.js';
import { CommandDefinition } from '../types/command';

export async function getHelpEmbed(commandName: string | null): Promise<EmbedBuilder> {
  const collection = new Collection<string, CommandDefinition>();
  await loadCommands(collection); // charge les commandes dans la collection
  
   if (!commandName) {
    // Liste toutes les commandes
    return buildHelpEmbed(collection);
  } else {
    // Détaille une commande précise
    const command = collection.get(commandName.toLowerCase());
    if (!command) {
      return buildHelpErrorEmbed();
    }

    return buildHelpDetailEmbed(command);
  }
}