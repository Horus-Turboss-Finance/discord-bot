export function logError(context: string, error: unknown): void {
  // Exemple simplifié, peut être enrichi avec sentry, logs fichiers, etc.
  console.error(`[ERROR] ${context}`, error);
}