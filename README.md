# 🤖 Cash Sights – Bot Discord Utilitaire  
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://cashsight.fr/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-success)]()
[![Node.js](https://img.shields.io/badge/Node.js-23.6.0-green?logo=node.js)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/discord.js-14.21.0-blue?logo=discord)](https://discord.js.org/)

## 🧠 À propos
Le **Bot Discord Cash Sights** est un assistant utilitaire destiné à accompagner les utilisateurs de la plateforme & staff dans leur gestion financière & utilitaire directement depuis Discord. Il propose des fonctionnalités telles que :
- Suivi du **Kiff Score** - soon
- Notification de nouvelles transactions
- Intégration avec l'API Cash Sights - soon
- Outils d'administration pour la communauté

Ce dépôt contient le code source du bot, développé en **Node.js** avec le framework **discord.js**.

🔗 Site principal : [https://cashsight.fr/](https://cashsight.fr/)  

📁 Dépôt Git : `git@github.com:Horus-Turboss-Finance/discord-bot.git`

## ⚙️ Stack technique
* **Node.js 23.6.0** – Runtime JavaScript côté serveur
* **discord.js 14.21.0** – SDK Discord complet et moderne
* **moment** – Gestion des dates
* **Jest** – Tests unitaires

## 🚀 Démarrage rapide
### Prérequis
- Node.js `>=20.x`
- Un **bot Discord** enregistré : [https://discord.com/developers/applications](https://discord.com/developers/applications)
- Un token valide dans un fichier `production.env`

### Installation
```bash
git clone git@github.com:Horus-Turboss-Finance/discord-bot.git
cd discord-bot
npm install
````

### Configuration
Créer un fichier `production.env` à la racine du projet avec le contenu suivant :

```env
NODE_ENV="PRODUCTION"
DISCORD_TOKEN=ton_token_discord
DISCORD_CLIENT_ID=ton_client_id
DISCORD_CHANNEL_NOTIFIER=ton_channel_id_pour_annonce
```

### Lancer le bot en développement

```bash
npm run dev
```

## 📚 Documentation
La documentation technique (commandes, architecture, événements, erreurs, bonnes pratiques) est disponible dans le dossier [`./DOCS/`](./DOCS/).

## ✨ Contribution
Toute contribution est bienvenue. Merci de lire le fichier [`CONTRIBUTING.md`](./CONTRIBUTING.md) avant toute *pull request* ou création d'*issue*.

## 🧩 TODO / Roadmap
* [ ] Gestion dynamique des permissions par rôle
* [ ] Dashboard discord pour configurer le bot
* [ ] Commande `/kiff` avec graphique dynamique
* [ ] Logs d'activité dans un salon dédié
* [ ] Intégration complète avec l'API Cash Sights (auth utilisateur OAuth2)
* [ ] Ajout d'un système de badges / niveaux
* [ ] Couverture de test complète avec Jest
* [x] ~~Restructuration des fichiers~~
* [x] ~~Migration vers typescripts~~

> Développé avec ❤️ par l'équipe **Horus Turboss Finance**.