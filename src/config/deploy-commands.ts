import { REST, Routes } from 'discord.js';
import { loadCommands } from '../loaders/load-commands';
import { ENV } from '../config/env-loader';

async function deployCommands() {
  const commands = await loadCommands();
  const rest = new REST().setToken(ENV.DISCORD_TOKEN);

  try {
    console.log(`🚀 Déploiement de ${commands.length} commandes…`);

    await rest.put(
      Routes.applicationCommands(ENV.DISCORD_CLIENT_ID),
      { body: commands }
    );

    console.log(`✅ ${commands.length} commande(s) déployée(s) avec succès.`);
  } catch (error) {
    console.error('❌ Erreur lors du déploiement des commandes :', error);
  }
}

deployCommands();