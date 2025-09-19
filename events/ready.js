const { Events, Client, EmbedBuilder } = require("discord.js");
const worker = require('../core/Workers/worker');

module.exports.config = {
    name : Events.ClientReady,
    once : true
}

let {DISCORD_CHANNEL_NOTIFIER} = process.env

/**
 * @param {Client} client 
 */
module.exports.main = (client) => {
	console.log(`Connected! Logged in as ${client.user.tag}`);
    
    /* Update : 04.08.2025 by Horus - monit change  */
    worker.on(worker.eventsList.WorkerFundPageChange, (args) => {
        const { type, arr } = args;

        /* Detect global change On détecte les changements globaux */
        let hasCSSChange = false;
        let hasJSChange = false;

        const urlsWithChanges = [];

        for (const entry of arr) {
            const { url, change } = entry;

            if (change.css) hasCSSChange = true;
            if (change.js) hasJSChange = true;

            const changes = [];
            if (change.html) changes.push("```HTML```");
            if (change.img) changes.push("```IMG```");

            if (changes.length > 0) {
                urlsWithChanges.push(`- **${url} :** ${changes.join('\n ')}`);
            }
        }

        // Construction de la description
        let changeFields;
        const changeDescriptions = [];

        if (urlsWithChanges.length > 0) {
            changeFields = {name : `Contenu modifié`, value: `${urlsWithChanges.join('\n')}`};
        }
        if (hasCSSChange) {
            changeDescriptions.push("🖌️ **Changement de style (CSS)** détecté");
        }
        if (hasJSChange) {
            changeDescriptions.push("⚙️ **Changement de script (JS)** détecté");
        }
        if (changeDescriptions.length === 0 && !changeFields) {
            changeDescriptions.push("*Aucun changement détecté précisément.");
        }

        const embed = new EmbedBuilder()
            .setTitle(`${type.toUpperCase()} PAGE CHANGE`)
            .addFields(changeFields)
            .setThumbnail("https://cdn-icons-png.flaticon.com/512/4344/4344882.png")
            .setColor("#DC6803")
            .setFooter({ text: "Worker #1" })
            .setTimestamp();
        
            if(changeDescriptions[0]){
                embed
                .setDescription(changeDescriptions.join("\n\n"))
            }

        client.channels.fetch(DISCORD_CHANNEL_NOTIFIER)
            .then(channel => channel.send({ embeds: [embed] }))
            .catch(console.error);
    });

    worker.on(worker.eventsList.WorkerHasPageError, (args) => {
        let {type, arr} = args

        let embed = new EmbedBuilder()
        .setTitle(`${type.toUpperCase()} PAGE ERROR`)
        .setDescription("Des urls n'ont pas pu être chargé selon le worker")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/14090/14090276.png")
        .setColor("#D92D20")
        .addFields({name: "Listes des url", value: `- \`${arr.join('\`\n- \`')}\``})
        .setFooter({text: "Worker"})
        .setTimestamp()

        
        client.channels.fetch(DISCORD_CHANNEL_NOTIFIER)
        .then((channel) => channel.send({embeds: [embed], content: `<@${channel.guild.ownerId}>`}))
        .catch(console.error);
    })
}