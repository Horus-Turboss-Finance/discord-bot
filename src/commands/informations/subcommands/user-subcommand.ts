import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { fetchUserAndMember } from "../../../services/user-info.service";
import { buildUserEmbed } from "../../../utils/build-embed/build-user-embed";
import { buildGuildMemberEmbed } from "../../../utils/build-embed/build-guild-member-embed";

export async function handleUserSubcommand(interaction: ChatInputCommandInteraction) {
  const { user, member, targetId } = await fetchUserAndMember(interaction);

  const embed = new EmbedBuilder().setColor('#EFCB8C').setFooter({
    text: `Requested by ${interaction.user?.username ?? interaction.user?.tag ?? 'Unknown'}`,
    iconURL: interaction.user?.displayAvatarURL?.() ?? undefined,
  });

  if (!user) {
    embed.setTitle('Utilisateur introuvable')
      .setDescription(`Impossible de trouver l'utilisateur \`${targetId}\``)
      .setColor('#E74C3C');
    return await interaction.editReply({ embeds: [embed] });
  }

  const finalEmbed = member?.id
    ? buildGuildMemberEmbed(member, user)
    : buildUserEmbed(user);

  finalEmbed.setFooter({
    text: `Requested by ${interaction.user?.username ?? interaction.user?.tag ?? 'Unknown'}`,
    iconURL: interaction.user?.displayAvatarURL?.() ?? undefined,
  });

  await interaction.editReply({ embeds: [finalEmbed] });
}