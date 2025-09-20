import { Collection, MessagePayload, MessageFlags, Client, User } from 'discord.js';
import { addedTypeClient } from '../client/discord-client';

type CooldownCollection = Collection<string, number>;

const DEFAULT_COOLDOWN_SECONDS = 2;

export function getCooldownReply(commandName : string, client : Client & addedTypeClient, user : User): MessagePayload | null {
  const command = client.commands.get(commandName);
  const cooldowns = client.cooldowns;

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const now = Date.now();
  const timestamps: CooldownCollection = cooldowns.get(commandName)!;
  const cooldownAmount = (command?.cooldown ?? DEFAULT_COOLDOWN_SECONDS) * 1_000;

  if (timestamps.has(user.id)) {
    const expirationTime = timestamps.get(user.id)! + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      return {
        content: `Merci d'attendre la fin du cooldown pour la commande : \`${commandName}\`. Tu pourras l'utiliser <t:${expiredTimestamp}:R>.`,
        flags: MessageFlags.Ephemeral,
      } as unknown as MessagePayload;
    }
  }

  return null;
}

export function updateCooldown(commandName : string, client : Client & addedTypeClient, user : User): void {
  const command = client.commands.get(commandName);
  const cooldowns = client.cooldowns;

  const now = Date.now();
  const cooldownAmount = (command?.cooldown ?? DEFAULT_COOLDOWN_SECONDS) * 1_000;

  const timestamps: CooldownCollection = cooldowns.get(commandName)!;
  timestamps.set(user.id, now);

  setTimeout(() => timestamps.delete(user.id), cooldownAmount);
}