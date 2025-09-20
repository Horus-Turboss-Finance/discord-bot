import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { formatUptime } from '../utils/format-uptime';
import { EMBED_COLOR, BOT_LOGO_URL, BANNER_IMAGE_URL } from '../config/constants';

const lastRestartTimestamp = Date.now();

export function createBotStatusEmbed(interaction: ChatInputCommandInteraction): EmbedBuilder {
  const now = formatUptime(lastRestartTimestamp);
  const latency = Date.now() - interaction.createdTimestamp;
  const apiLatency = interaction.client.ws.ping;

  return new EmbedBuilder()
    .setAuthor({ name: 'Status du bot Cash Sights', iconURL: BOT_LOGO_URL })
    .setColor(EMBED_COLOR)
    .addFields(
      { name: ':small_blue_diamond: Status', value: '```Bot en ligne```' },
      { name: ':small_blue_diamond: Ping', value: `\`\`\`${latency}ms\`\`\``, inline: true },
      { name: ':small_blue_diamond: API latence', value: `\`\`\`${apiLatency}ms\`\`\``, inline: true },
      { name: ':alarm_clock: Dernier redémarrage', value: `\`\`\`${now}\`\`\`` }
    )
    .setFooter({
      iconURL: interaction.user.displayAvatarURL(),
      text: `Requested by ${interaction.user.displayName}`,
    })
    .setTimestamp()
    .setImage(BANNER_IMAGE_URL);
}