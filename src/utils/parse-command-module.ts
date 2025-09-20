import type { CommandDefinition } from '../types/command';

/**
 * Importe dynamiquement un module de commande et valide sa structure
 */
export async function parseModule(
  modulePath: string
): Promise<CommandDefinition | null> {
  try {
    const imported = await import(modulePath);
    const command: CommandDefinition = imported.default ?? imported;

    if ('data' in command && 'main' in command) {
      return command;
    } else {
      /* TODO LOG System warn */
      console.warn(
        `[⚠️] Module invalide : ${modulePath} - "data" ou "main" manquant.`
      );
      return null;
    }
  } catch (error) {
    console.warn(`[❌] Échec de l'import du module ${modulePath}`, error);
    return null;
  }
}