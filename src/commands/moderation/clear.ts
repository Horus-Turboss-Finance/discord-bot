import {
  ChatInputCommandInteraction,
  InteractionContextType,
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags,
  EmbedBuilder,
  TextChannel,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Supprime un nombre de messages dans ce salon.')
  .addIntegerOption((option) =>
    option
      .setName('amount')
      .setDescription('Nombre de messages à supprimer (max 100)')
      .setMinValue(1)
      .setMaxValue(100)
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .setContexts(InteractionContextType.Guild);

export async function main(interaction: ChatInputCommandInteraction): Promise<void> {
  const amount = interaction.options.getInteger('amount', true);

  const channel = interaction.channel;

  if (!channel || !channel.isTextBased() || !(channel instanceof TextChannel)) {
    const embed = new EmbedBuilder()
      .setTitle("Salon invalide")
      .setDescription('Je ne peux pas pour la raison suivante :')
      .addFields({ name: "Raison", value: "```Cette commande ne peut être utilisée que dans un salon texte.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  const guild = interaction.guild!;

  // Vérification des permissions du bot
  if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageMessages)) {
    const embed = new EmbedBuilder()
      .setTitle("Permission refusée")
      .setDescription("Je ne peux pas pour la raison suivante :")
      .addFields({ name: "Raison", value: "```Je n'ai pas la permission de gérer les messages.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  try {
    const messages = await channel.bulkDelete(amount, true);

    const embed = new EmbedBuilder()
      .setTitle('🧹 Messages supprimés')
      .setDescription(`\`${messages.size} message(s)\` ont été supprimé(s) avec succès.`)
      .setColor(0x067647)
      .setTimestamp();

    const bot_res = await interaction.reply({ embeds: [embed] });
    
    setTimeout(() => {
      bot_res.delete().catch(()=> null)
    }, 10_000);
  } catch (error) {
    console.error('[Clear Command Error]: ', error);

    const embed = new EmbedBuilder()
      .setTitle("Erreur")
      .setDescription('Je ne peux pas pour la raison suivante :')
      .addFields({ name: "Raison", value: "```Une erreur inconnue est survenue lors de la suppression des messages.```" })
      .setColor(0xE74C3C);

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
}