import { handleReportSubmission } from '../../services/report.service';
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('report')
  .setDescription('Signale un bug, un utilisateur ou un serveur suspect')
  .addStringOption(option =>
    option
      .setName('type')
      .setDescription('Type de signalement')
      .setRequired(true)
      .addChoices(
        { name: 'Bug', value: 'bug' },
        { name: 'Utilisateur (spam/scam)', value: 'user' },
        { name: 'Serveur suspect', value: 'server' }
      )
  )
  .addStringOption(option =>
    option
      .setName('description')
      .setDescription('Explique ton signalement')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('lien')
      .setDescription('Lien vers le message, le profil ou autre (si applicable)')
      .setRequired(false)
  );

export async function main(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const type = interaction.options.getString('type', true);
  const description = interaction.options.getString('description', true);
  const lien = interaction.options.getString('lien', false);

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  try{
    await handleReportSubmission({
      reporterId: interaction.user.id,
      reporterTag: interaction.user.tag,
      guildId: interaction.guild?.id || null,
      description,
      type,
      lien,
    }, interaction.client);

    const embed = new EmbedBuilder()
      .setTitle("Report effectué")
      .setDescription(`Merci pour ton signalement, il a bien été transmis à l'équipe.`)
      .setColor(0x00ff00)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('[RAPPORT Error]', error);
    const embed = new EmbedBuilder()
      .setTitle("Erreur lors du report")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Une erreur inconnu est survenue lors du report.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}