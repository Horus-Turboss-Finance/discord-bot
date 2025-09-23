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
  .setName('ban_user')
  .setDescription('Bannir un utilisateur du serveur.')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .setContexts(InteractionContextType.Guild)
  .addUserOption((option) =>
    option
      .setName('utilisateur')
      .setDescription('Utilisateur à bannir')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('raison')
      .setDescription('Raison du bannissement')
      .setRequired(false)
  );

export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const targetUser = interaction.options.getUser('utilisateur', true);
  const reason = interaction.options.getString('raison') ?? 'Aucune raison fournie.';

  const member = interaction.guild?.members.cache.get(targetUser.id);

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
      .addFields({ name: "Raison", value: "```Impossible de bannir cet utilisateur.```" })
      .setColor(0xE74C3C);
    
    
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  const guild = interaction.guild!

  if (!member.bannable || !guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers)) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je n'ai pas la permission de bannir cet utilisateur.```" })
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
    await member.ban({ reason });

    const embed = new EmbedBuilder()
      .setTitle("Utilisateur banni")
      .setDescription(`**${targetUser.tag}** a été banni du serveur.`)
      .addFields({ name: '📝 Raison', value: `\`\`\`${reason}\`\`\`` })
      .setColor(0x067647)
      .setTimestamp();

    const bot_res = await interaction.reply({ embeds: [embed] });
    
    setTimeout(() => {
      bot_res.delete().catch(()=> null)
    }, 10_000);
  } catch (error) {
    console.error(`[Erreur Ban]`, error);
    
    const embed = new EmbedBuilder()
      .setTitle("Erreur lors du bannissement")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Une erreur inconnue est survenue lors du bannissement.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}