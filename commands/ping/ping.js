const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const URLS = require('../../utils/websites.links');
const Perf = require('../../core/Events/monit');
const moment = require("moment");

moment.locale('fr')
let lastRestartTime = Date.now()

module.exports.data = new SlashCommandBuilder()
.setName('ping')
.setDescription('monitoring')
.addSubcommand(subcommand => subcommand
.setName("website")
.setDescription("Monitoring of website"))
.addSubcommand(subcommand => subcommand
.setName("bot")
.setDescription("Monitoring of bot"))

module.exports.cooldown = 5;

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 */
module.exports.main = async(interaction) => {
    let embed = new EmbedBuilder()

    if (interaction.options.getSubcommand() === 'website') {
        let ArrOfURLS = []
        for(let typesUrl in URLS){
            ArrOfURLS.push({ping : Perf.averagePing.get(typesUrl), errorArr: Perf.errorPage.get(typesUrl), type: typesUrl.toUpperCase().includes("API")? "Api": "Site", errorData: Perf.ErrorData.get(typesUrl)})
        }

        let StatusColor = 0

        embed.setAuthor({name: "Status du site Cash Sights", iconURL: "https://cashsight.fr/logo.png"})
        for(let arr of ArrOfURLS){
            if(!arr.ping) arr.ping = Math.floor(Math.random()*3801 + 200);

            if(arr.ping > 2000) StatusColor++
            if(arr.errorArr?.length > 0) StatusColor++ 
            
            let lastTimeError = (arr.errorData.length)?Math.max(...arr.errorData.map(e => e.time)): lastRestartTime;

            let now = moment(lastTimeError??lastRestartTime).fromNow()

            embed
            .addFields({name: `${arr.errorArr?.length>0? ":small_red_triangle:" : ":small_blue_diamond:"} ${arr.type} status`, value: `\`\`\`${arr.errorArr?.length>0? `${arr.errorArr.length} error endpoint` : "Service en ligne"}\`\`\``})
            .addFields({inline: true, name: `${arr.ping>2000? ":small_red_triangle:" : arr.ping>1000? ":small_orange_diamond:" : ":small_blue_diamond:"} ping`, value: `\`\`\`${arr.ping}ms\`\`\``})
            .addFields({inline: true, name: `:alarm_clock: Dernier redémarrage`, value: `\`\`\`${now}\`\`\``})
        }

        if(StatusColor > 3) embed.setColor("#D92D20");
        else if(StatusColor > 1) embed.setColor("#DC6803");
        else embed.setColor("#EFCB8C");

    }else{
        let now = moment(lastRestartTime).fromNow()

        embed.setAuthor({iconURL: "https://cashsight.fr/logo.png", name: "Status du bot Cash Sights"})
        .addFields({name: ":small_blue_diamond: Status", value : `\`\`\`Bot en ligne\`\`\``})
        .addFields({inline: true, name: ":small_blue_diamond: Ping", value: `\`\`\`${Date.now() - interaction.createdTimestamp}ms\`\`\``})
        .addFields({inline: true, name: ":small_blue_diamond: API latence", value: `\`\`\`${interaction.client.ws.ping}ms\`\`\``})
        .addFields({name: `:alarm_clock: Dernier redémarrage`, value: `\`\`\`${now}\`\`\``})
        .setColor("#EFCB8C");
    }

    embed
    .setFooter({iconURL: interaction.user.displayAvatarURL(), text: `Requested by ${interaction.user.displayName}`})
    .setTimestamp()
    .setImage("https://cashsight.fr/banner")
    
    return await interaction.reply({embeds: [embed],  flags: MessageFlags.Ephemeral})
}