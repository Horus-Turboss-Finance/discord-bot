import { Collection, EmbedBuilder } from 'discord.js';
import { CommandDefinition } from '../../types/command';

export function buildHelpEmbed(commands: Collection<string, CommandDefinition>): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle('📘 Commandes disponibles')
    .setDescription('Voici la liste des commandes disponibles sur ce serveur')
    .setColor("#EFCB8C")
    .setFooter({ text: 'Cash Sights Bot - Aide' })
    .setTimestamp();

  for (const [_, command] of commands) {
    const baseCommand = command.data;
    _.split(''); // juste pour que lint me fasse pas chier;

    // Si la commande a des sous-commandes, on les ajoute aussi
    const subcommands = baseCommand.options?.filter(opt => opt.toJSON().type === 1); // type 1 = subcommand

    if (subcommands?.length) {
      const subDescriptions = subcommands
        .map((sub) => `• \`/${baseCommand.name} ${sub.toJSON().name}\` - ${sub.toJSON().description}`)
        .join('\n');

      embed.addFields({
        name: `/${baseCommand.name}`,
        value: subDescriptions,
      });
    } else {
      embed.addFields({
        name: `/${baseCommand.name}`,
        value: baseCommand.description || 'Pas de description.',
      });
    }
  }

  return embed;
}

export function buildHelpErrorEmbed() : EmbedBuilder {
  return new EmbedBuilder()
    .setTitle('Error')
    .setDescription('La commande demandé est inconnue')
      .setColor(0xE74C3C)
    .setFooter({ text: 'Cash Sights Bot - Aide' })
    .setTimestamp();
}


export function buildHelpDetailEmbed(command: CommandDefinition): EmbedBuilder {
  const baseCommand = command.data;

  const embed = new EmbedBuilder()
    .setTitle(`📖 Détail de la commande /${baseCommand.name}`)
    .setDescription(baseCommand.description || 'Pas de description.')
    .setColor("#EFCB8C")
    .setFooter({ text: 'Cash Sights Bot - Détail de la commande' })
    .setTimestamp();

  // Fonction utilitaire pour convertir le type option numérique en string lisible
  function getOptionTypeName(type: number) {
    const map = new Map([
      [1, 'Sous-commande'],
      [2, 'Groupe de sous-commandes'],
      [3, 'Option chaîne'],
      [4, 'Option entier'],
      [5, 'Option booléen'],
      [6, 'Option utilisateur'],
      [7, 'Option canal'],
      [8, 'Option rôle'],
      [9, 'Option mentionnable'],
      [10, 'Option nombre flottant'],
      [11, 'Option attachement'],
    ]);
    return map.get(type) || 'Inconnu';
  }

  // On affiche les options / sous-commandes
  if (baseCommand.options && baseCommand.options.length > 0) {
    for (const opt of baseCommand.options) {
      const optJSON = opt.toJSON();

      if (optJSON.type === 1) { // subcommand
        embed.addFields({
          name: `Sous-commande: ${optJSON.name}`,
          value: optJSON.description || 'Pas de description.',
          inline: false,
        });

        // Options de la subcommande
        if (optJSON.options?.length) {
          const optionsDesc = optJSON.options
            .map(o => `\`${o.name}\` (${getOptionTypeName(o.type)}) - ${o.description}${o.required ? ' *(requis)*' : ''}`)
            .join('\n');

          embed.addFields({
            name: `Options pour ${optJSON.name}`,
            value: optionsDesc,
            inline: false,
          });
        }
      } else {
        // Option simple (pour la commande principale)
        embed.addFields({
          name: `Option: \`${optJSON.name}\``,
          value: `${optJSON.description || 'Pas de description.'} (${getOptionTypeName(optJSON.type)})${optJSON.required ? ' *(requis)*' : ''}`,
          inline: false,
        });
      }
    }
  }

  return embed;
}