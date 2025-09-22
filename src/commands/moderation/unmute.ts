import {
  ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  MessageFlags,
  EmbedBuilder,
  GuildMember,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('unmute')
  .setDescription('Réactive un membre muet (timeout actif).')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Utilisateur à réactiver')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setContexts(InteractionContextType.Guild);

export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const user = interaction.options.getUser('user', true);

  const guild = interaction.guild!

  const member: GuildMember | null = await guild.members.fetch(user.id).catch(() => null);

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
      .addFields({ name: "Raison", value: "```Impossible d'unmute cet utilisateur.```" })
      .setColor(0xE74C3C);
    
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  // Permissions bot
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je n'ai pas la permission d'unmute ce membre.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  // Hiérarchie
  if (guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je ne peux pas expulser cet utilisateur (rôle trop élevé).```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  // Est-ce que le membre est actuellement mute ?
  if (!member.communicationDisabledUntilTimestamp || member.communicationDisabledUntilTimestamp < Date.now()) {
    const embed = new EmbedBuilder()
      .setTitle("Erreur")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```ℹ️ Cet utilisateur n'est actuellement pas réduit au silence.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  try {
    await member.timeout(null, `Unmute par ${interaction.user.tag}`);

    const embed = new EmbedBuilder()
      .setTitle("Utilisateur unmute")
      .setDescription(`**${user.tag}** a été réactivé (mute levé).`)
      .setColor(0x00ff00)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('[Unmute Error]', error);
    const embed = new EmbedBuilder()
      .setTitle("Erreur lors du unmute")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Une erreur inconnu est survenue lors de la tentative de unmute.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}