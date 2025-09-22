import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  GuildMember,
} from 'discord.js';
import { parseDurationToMs } from '../../utils/parse-duration-to-ms';

// Liste des durées supportées (min : 1min / max : 28j)
const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('Réduit un membre au silence temporairement.')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Utilisateur à réduire au silence')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('time')
      .setDescription('Durée (ex : 10m, 1h, 3d)')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setContexts(InteractionContextType.Guild);

export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const user = interaction.options.getUser('user', true);
  const timeRaw = interaction.options.getString('time', true);

  const member = await interaction.guild?.members.fetch(user.id).catch(() => null);

  if (!member) {
    const embed = new EmbedBuilder()
      .setTitle("Utilisateur introuvable")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```L'utilisateur n'est pas trouvé sur ce serveur.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  if (!(member instanceof GuildMember)) {
    const embed = new EmbedBuilder()
      .setTitle("Erreur")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Impossible d'expulser cet utilisateur.```" })
      .setColor(0xE74C3C);
    
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  const guild = interaction.guild!;

  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je n'ai pas la permission pour expulser ce membre.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  if (guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je ne peux pas expulser cet utilisateur (rôle trop élevé).```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  const durationMs = parseDurationToMs(timeRaw);

  if (!durationMs || durationMs <= 0) {
    const embed = new EmbedBuilder()
      .setTitle("Durée invalide")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Durée invalide. Utilise un format comme `10m`, `1h`, `3d`, etc.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  if (durationMs > MAX_TIMEOUT_MS) {
    const embed = new EmbedBuilder()
      .setTitle("Durée trop longue")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```La durée maximale est de 28 jours.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  try {
    await member.timeout(durationMs, `Mute par ${interaction.user.tag}`);

    const until = new Date(Date.now() + durationMs);

    const embed = new EmbedBuilder()
      .setTitle("Utilisateur expulsé")
      .setDescription(`**${user.tag}** a été réduit au silence jusqu'à \n<t:${Math.floor(until.getTime() / 1000)}:f>.`)
      .setColor(0x00ff00)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('[Mute Error]', error);
    const embed = new EmbedBuilder()
      .setTitle("Erreur lors du mute")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Une erreur inconnue est survenue lors de la tentative de mute.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}