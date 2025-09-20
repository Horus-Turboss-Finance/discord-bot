import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import type { CommandDefinition } from '../types/command';

export type addedTypeClient = {
  commands: Collection<string, CommandDefinition>;
  cooldowns: Collection<string, Collection<string, number>>;
};

export function createDiscordClient(): Client & addedTypeClient {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildIntegrations,
    ],
    partials: [Partials.GuildMember],
  }) as Client & addedTypeClient

  client.commands = new Collection();
  client.cooldowns = new Collection();

  return client;
}