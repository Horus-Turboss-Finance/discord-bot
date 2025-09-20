import { EmbedBuilder, GuildMember, User } from "discord.js";
import { safeDateTimestamp } from "../safe-date-timestamp";
import { formatBadgesFromFlags } from "../format-badges";

export function buildGuildMemberEmbed(member: GuildMember, user: User): EmbedBuilder {
  const flagsArray = user?.flags?.toArray?.() ?? [];
  const badgeStr = formatBadgesFromFlags(flagsArray);

  const roles = member.roles.cache
    .filter(r => r.id !== member.guild.roles.everyone.id)
    .map(r => `<@&${r.id}>`);

  const rolesDisplay = roles.length ? roles.slice(0, 30).join(' ') : '```Aucun rôle```';

  const isMuted = !!(
    member.communicationDisabledUntilTimestamp && member.communicationDisabledUntilTimestamp > Date.now()
  );

  const embed = new EmbedBuilder()
    .setColor('#EFCB8C')
    .setAuthor({
      name: `Information sur ${member.displayName ?? user.username}`,
      iconURL: member.displayAvatarURL?.() ?? user.displayAvatarURL?.(),
    })
    .setDescription(`Voici les informations concernant l'utilisateur ${user.username} (\`@${member.nickname ?? user.username}\`)`)
    .addFields(
      { name: 'Mention', value: `<@${user.id}>`, inline: true },
      { name: 'Identifiant', value: `\`\`\`${user.id}\`\`\``, inline: true },
      { name: 'Tag', value: badgeStr, inline: false },
      { name: 'Rôles', value: rolesDisplay, inline: false },
      {
        name: 'Création du compte',
        value: `<t:${safeDateTimestamp(user.createdTimestamp)}:D> (<t:${safeDateTimestamp(user.createdTimestamp)}:R>)`,
        inline: true,
      },
      {
        name: "Date d'arrivée",
        value: `<t:${safeDateTimestamp(member.joinedTimestamp)}:D> (<t:${safeDateTimestamp(member.joinedTimestamp)}:R>)`,
        inline: true,
      }
    );

  if (isMuted) embed.addFields({ name: 'Modération status', value: '```Muted```', inline: true });

  if (member.premiumSinceTimestamp && member.premiumSinceTimestamp > 0) {
    embed.addFields({ name: 'Booster', value: '```Server Booster```', inline: true });
  }

  embed.setThumbnail(user.displayAvatarURL?.() ?? undefined);

  const banner = typeof user.bannerURL === 'function' ? user.bannerURL() ?? null : null;
  if (banner) embed.setImage(`${banner}?size=1280`);

  return embed;
}