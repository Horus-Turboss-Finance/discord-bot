import type { Interaction, SlashCommandBuilder } from 'discord.js';

export interface CommandDefinition {
  data: SlashCommandBuilder;
  main: (interaction: Interaction) => Promise<void>;
  cooldown?: number;
}