import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getHelpEmbed } from '../../services/help.service';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Affiche la liste des commandes disponibles ou détaille une commande')
  .addStringOption(option =>
    option
      .setName('command')
      .setDescription('La commande à détailler')
      .setRequired(false)
  );
  
export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const commandName = interaction.options.getString('command');

  const embed = await getHelpEmbed(commandName);
  await interaction.reply({ embeds: [embed], ephemeral: true });
}
