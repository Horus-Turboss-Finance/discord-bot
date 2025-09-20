import { getCooldownReply, updateCooldown } from '../services/cooldown.service';
import { handleCommandError } from '../utils/handle-command-error';
import { addedTypeClient } from '../client/discord-client';
import { Client, Events, Interaction, MessageFlags } from 'discord.js';
import { CommandDefinition } from '../types/command';

export const config = {
  name: Events.InteractionCreate,
};

export const main = async (interaction: Interaction): Promise<void> => {
  if (!interaction.isChatInputCommand()) return;
  const client = interaction.client as Client & addedTypeClient;
  const commandName = interaction.commandName;
  const user = interaction.user;

  const command = client.commands.get(commandName) as CommandDefinition;
  if (!command) {
    // TODO: remplacer par logger
    console.error(`❌ Command not found: ${commandName}`);
    await interaction.reply({
      content: `Commande \`${commandName}\` introuvable.`,
      flags: MessageFlags.Ephemeral,
    });
    return;
  }

  const cooldownReply = getCooldownReply(commandName, client, user);
  if (cooldownReply) {
    await interaction.reply(cooldownReply);
    return;
  }

  updateCooldown(commandName, client, user);

  try {
    await command.main(interaction);
  } catch (error) {
    handleCommandError(interaction, error);
  }
};
