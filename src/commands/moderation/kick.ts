import {
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
  GuildMember,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Expulse un membre du serveur.')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Utilisateur à expulser')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('reason')
      .setDescription('Motif du kick')
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
  .setContexts(InteractionContextType.Guild);

export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const user = interaction.options.getUser('user', true);
  const reason = interaction.options.getString('reason') || 'Aucune raison fournie';

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

  const guild = interaction.guild!

  // Vérification des permissions du bot
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.KickMembers)) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je n'ai pas la permission pour expulser ce membre.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  // Vérification des permissions du bot
  if (guild.members.me.roles.highest.comparePositionTo(member.roles.highest) <= 0) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je ne peux pas expulser cet utilisateur (rôle trop élevé).```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  try {
    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setTitle("Utilisateur expulsé")
      .setDescription(`**${user.tag}** a été banni du serveur.`)
      .addFields({ name: '📝 Raison', value: `\`\`\`${reason}\`\`\`` })
      .setColor(0x00ff00)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error(`[Erreur kick]`, error);

    const embed = new EmbedBuilder()
      .setTitle("Erreur lors du bannissement")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Une erreur inconnue est survenue lors de l'expulsion.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}