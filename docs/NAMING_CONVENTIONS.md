# 📘 Convention de nommage
Ce document définit les règles à respecter afin d'assurer une **cohérence globale**, une **lisibilité optimale**, et une **maintenabilité à long terme** pour le code source du bot.

## 📁 Noms de fichiers & dossiers
| Type                       | Convention             | Exemple                          |
|----------------------------|------------------------|----------------------------------|
| Commande Discord           | `kebab-case`           | `kiff-score.ts`, `user-info.ts` |
| Événement Discord          | `kebab-case`           | `interaction-create.ts`         |
| Service métier             | `kebab-case`           | `user.service.ts`               |
| Utilitaire (helper)        | `kebab-case`           | `format-date.ts`                |
| Dossier fonctionnel        | `kebab-case`           | `commands/`, `services/`        |
| Fichier de configuration   | `kebab-case`           | `env-loader.ts`                 |
| Fichier de test            | Suffixe `.test.ts`     | `user.service.test.ts`          |
| Type ou Interface TS       | `PascalCase`           | `User`, `CommandDefinition`     |
| Constante globale          | `SCREAMING_SNAKE_CASE` | `DISCORD_TOKEN`                 |

## 🧩 Commandes Discord
* Fichier en `kebab-case`, exportant un objet `{ data, main, [cooldown] }`.
* Nom de commande en `snake_case` côté Discord (si nécessaire).
* Dossier : `src/commands/`.

```js
// ✅ src/commands/kiff-score/kiff-score.js
module.exports.data = new SlashCommandBuilder()
  .setName('kiff')
  .setDescription("Affiche ton Kiff Score");

module.exports.main = (interaction) => {
  // ...
}
```

## 📡 Événements Discord
* Un fichier par événement : `ready.ts`, `interaction-create.ts`, etc.
* Le nom du fichier reflète l'événement Discord.
* Le fichier exporte un object `{config, main}`
* Dossier : `src/events/`.

```js
// ✅ src/events/ready.js
module.exports.config = {
  name: Events.ClientReady,
  once: true,
};

/**
 * @param {Client} client 
 */
module.exports.main = (client) => {
  console.log(`Connected! Logged in as ${client.user.tag}`);
};
```

## ⚙️ Services métier
* Nom de fichier : `nom-du-service.service.ts`
* Chaque fonction dans un service suit la convention `verbeDomaine` :
  * `fetchUserById()`
  * `calculateKiffScore()`
* Dossier : `src/services/`.

```ts
// ✅ src/services/user.service.ts
export async function fetchUserById(userId: string): Promise<User> { ... }
```

## 📚 Types & Interfaces
* Utiliser **PascalCase**.
* Préfixer avec `I` **uniquement si cela clarifie une ambiguïté** (ex : conflit avec une classe ou une constante).
* Dossier : `src/types/`.
```ts
// ✅ src/types/user.ts
export interface User {
  id: string;
  username: string;
}
```

## 🔢 Constantes & Config
* Constantes globales en `SCREAMING_SNAKE_CASE` :

```ts
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const API_URL = 'https://api.cashsights.fr';
```

* Fichiers de config typés, suffixés par `-config.ts` ou `-loader.ts` si applicable :
  * `client-config.ts`
  * `env-loader.ts`

## 🔧 Fichiers utilitaires
* Un fichier = une fonction ou groupe logique de fonctions
* Pas de fichier fourre-tout `utils.ts`
* Toujours nommer selon l'action ou la transformation :
  * `format-date.ts`
  * `parse-command-options.ts`

## 🧪 Tests
* Fichier en miroir du service testé
* Suffixe obligatoire `.test.ts`
* Nom clair et descriptif

```ts
// ✅ src/services/user.service.test.ts
describe('fetchUserById', () => {
  // ...
});
```

## 🌐 Environnement & Variables
* Les variables d'environnement suivent la convention `SCREAMING_SNAKE_CASE`
* Chargées via `production.env` et typées via un fichier `env.ts`

```ts
export const ENV = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  CLIENT_ID: process.env.CLIENT_ID!,
};
```

## ⚠️ À éviter
* ❌ Abréviations non standards : `usr`, `tmp`, `cfg`, etc.
* ❌ Usage de `index.ts` générique (sauf pour des exports explicites de module)
* ❌ Noms de commandes ambigus : préférer `user-info.ts` à `info.ts`
* ❌ Fichiers multi-responsabilités

## 📌 Bonnes pratiques supplémentaires
* Toujours nommer les fonctions par **verbe + nom clair** (`getUserById`, `sendKiffEmbed`)
* Préférer l'import explicite aux regroupements implicites via `index.ts`
* Utiliser des noms cohérents dans les interactions (`interaction`, `command`, etc.)
* Pas de variable générique type `data`, `res`, `tmp` sauf usage court et local

> 🧠 Ce fichier est vivant : les conventions peuvent évoluer selon les besoins du projet.
> Toute amélioration est la bienvenue via *pull request* ou *issue*.