const { Events, Collection, MessageFlags } = require("discord.js")

module.exports.config = {
    name : Events.InteractionCreate,
}

module.exports.main = async(interaction) => {
    if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return await interaction.reply('What are you doin');
	}

	const { cooldowns } = interaction.client;
	if (!cooldowns.has(interaction.commandName)) {
		cooldowns.set(interaction.commandName, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(interaction.commandName);
	const defaultCooldownDuration = 2;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1_000);
			return await interaction.reply({ content: `Merci d'attendre la fin du cooldown pour la commande : \`${interaction.commandName}\`. Tu pourras l'utiliser <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.main(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Il y a eu une erreur lors de l\'exécution de la commande!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'Il y a eu une erreur lors de l\'exécution de la commande!', flags: MessageFlags.Ephemeral }).catch(e => {});
		}
	}
}