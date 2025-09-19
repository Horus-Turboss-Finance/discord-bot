const { SlashCommandBuilder, EmbedBuilder, MessageFlags, Integration } = require('discord.js');

module.exports.data = new SlashCommandBuilder()
.setName("informations")
.setDescription('Donne des informations sur...')
.addSubcommand(subcommand => subcommand
.setName("user")
.setDescription("Donne des informations sur un utilisateur")
.addUserOption(option => option.setName('tag').setDescription('L\'utilisateur'))
.addStringOption(option => option.setName('id').setDescription('L\'ID de l\'utilisateur')))
.addSubcommand(subcommand => subcommand
.setName("server")
.setDescription('Donne des informations sur le serveur'));

module.exports.cooldown = 15,

/**
 * 
 * @param {Interaction} interaction 
 */
module.exports.main = async(interaction) => {
    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === 'user') {
        const userTag = interaction.options.getUser('tag');
        const userId = interaction.options.getString('id');
        let defaultUser = interaction.user.id;

        let userGuildResolvePromise = pingued => new Promise((res, rej) => {
            interaction.guild.members.fetch({user: `${pingued}`, withPresences: true, force: true, cache: false}).then(res).catch(rej)
        })
        let userResolvePromise = pingued => new Promise((res, rej) => {
            interaction.client.users.fetch(`${pingued}`, {force: true, cache: false}).then(res).catch(rej)
        })

        let userResolved = await userGuildResolvePromise(userTag?.id??userId??defaultUser);
        if(!userResolved.user) userResolved = await userResolvePromise(userId??defaultUser);
        let banner = await userResolvePromise(userTag?.id??userId??defaultUser);

        if(!userResolved.user){
            let flags = userResolved.flags;
            flags = flags?.toArray()

            let userArrFlagsEmbed = ""
            for(let elem of flags){
                if(badges[elem])
                userArrFlagsEmbed += badges[elem]
            }

            if(userResolved.bot) userArrFlagsEmbed += "<:App:1398287617446908095>"
            if(userResolved.system) userArrFlagsEmbed += "<:Official:1398287604520321024>"

            embed
            .setAuthor({name:`Information sur ${userResolved.globalName??userResolved.displayName}`, iconURL: `${userResolved.displayAvatarURL()}`})
            .setDescription(`Voici les informations concernant l'utilisateur ${userResolved.username} (\`@${userResolved.displayName}\`)`)
            .addFields({name: "Mention", value: `<@${userResolved.id}>`, inline: true})
            .addFields({name: "Identifiant", value: `\`\`\`${userResolved.id}\`\`\``, inline:true})
            .addFields({name: "Tag", value: `${userArrFlagsEmbed?userArrFlagsEmbed:"\`\`\`Aucun tag\`\`\`"}`})
            .addFields({name: "Création du compte", value: `<t:${Math.floor(userResolved.createdTimestamp/1000)}:D> (<t:${Math.floor(userResolved.createdTimestamp/1000)}:R>)`, inline: true})
        }else{
            let userRoleArray = []
            if(userResolved.roles){
                const rolesOfUser = userResolved.roles.cache.map((role) => `<@&${role.id}>`);
                userRoleArray = rolesOfUser;
                userRoleArray.pop()
                userRoleArray = userRoleArray.join(" ")
            }
            
            let flags = userResolved.user.flags;
            flags = flags?.toArray()

            let userArrFlagsEmbed = ""
            for(let elem of flags){
                if(badges[elem])
                userArrFlagsEmbed += badges[elem]
            }

            if(userResolved.user.bot) userArrFlagsEmbed += "<:App:1398287617446908095> "
            if(userResolved.user.system) userArrFlagsEmbed += "<:Official:1398287604520321024> "
            if(userResolved.premiumSinceTimestamp && userResolved.premiumSinceTimestamp > 0) userArrFlagsEmbed += "<:booster:1398373296172568679> "

            embed
            .setAuthor({name:`Information sur ${userResolved.user.globalName??userResolved.user.displayName}`, iconURL: `${userResolved.displayAvatarURL()}`})
            .setDescription(`Voici les informations concernant l'utilisateur ${userResolved.user.username} (\`@${userResolved.nickname??userResolved.user.displayName}\`)`)
            .addFields({name: "Mention", value: `<@${userResolved.user.id}>`, inline: true})
            .addFields({name: "Identifiant", value: `\`\`\`${userResolved.user.id}\`\`\``, inline:true})
            .addFields({name: "Tag", value: `${userArrFlagsEmbed?userArrFlagsEmbed:"\`\`\`Aucun tag\`\`\`"}`})
            embed.addFields({name: "Rôles", value: `${userRoleArray?userRoleArray:"\`\`\`Aucun rôle\`\`\`"}`})
            if(userResolved.communicationDisabledUntilTimestamp > Date.now()){
                embed.addFields({name: "Modération status", value: "\`\`\`Muted\`\`\`"})
            }
            embed
            .addFields({name: "Création du compte", value: `<t:${Math.floor(userResolved.user.createdTimestamp/1000)}:D> (<t:${Math.floor(userResolved.user.createdTimestamp/1000)}:R>)`, inline: true})
            .addFields({name: "Date d'arrivée", value: `<t:${Math.floor(userResolved.joinedTimestamp/1000)}:D> (<t:${Math.floor(userResolved.joinedTimestamp/1000)}:R>)`, inline: true})
        }

        if(banner?.bannerURL()) embed.setImage(banner.bannerURL()+"?size=1280");
        embed
        .setThumbnail(userResolved.displayAvatarURL())
    } else {
        let guild = interaction.guild;

        // channels
        let PromiseFetchChannels = () => new Promise((res, rej) => {guild.channels.fetch().then(res).catch(rej)})
        let Channels = await PromiseFetchChannels()
        let Channel_i = 0
        
        Channels.map(e => {Channel_i++;return `<#${e.id}>`;});

        let GuildChannelSize = Channel_i - 1;
        // emoji
        let PromiseFetchEmoji = () => new Promise((res, rej) => {guild.emojis.fetch().then(res).catch(rej)})
        let Emojis = await PromiseFetchEmoji()
        let Emoji_i = 0
        
        GuildEmojiArray = Emojis.map(e => {Emoji_i++; return `<${e.animated?"a":""}:${e.name}:${e.id}>`})
        let GuildEmojiSize = Emoji_i;
        let GuildEmojiMension = GuildEmojiArray.slice(0, 18).join(' ')
        // roles
        let PromiseFetchRoles = () => new Promise((res, rej) => {guild.roles.fetch().then(res).catch(rej)})
        let Roles = await PromiseFetchRoles();
        let Role_i = 0

        Roles.map(e => {Role_i++;return `<@&${e.id}>`;});
        let GuildRolesSize = Role_i - 1;

        // created at 
        let GuildCreatedAt = Math.floor(guild.createdTimestamp/1000)
        // description
        let GuildDescription = guild.description 
        // id 
        let GuildID = guild.id
        // name
        let GuildName = guild.name
        // member count
        let GuildMemberSize = guild.memberCount;

        // boost & tiers
        let GuildBoostCount = guild.premiumSubscriptionCount;
        let GuildBoostTier = guild.premiumTier

        // icon, banner
        let GuildBannerURL = guild.bannerURL()
        let GuildIconURL = guild.iconURL()
        
        let GuildOwner = await guild.fetchOwner()
        GuildOwner = GuildOwner.user

        if(GuildBannerURL) embed.setImage(GuildBannerURL+"?size=1280");

        embed
        .setAuthor({name: GuildName, iconURL: GuildIconURL})
        .setTitle('Informations sur le serveur')
        .setDescription(GuildDescription??"Aucune description")
        .setThumbnail(GuildIconURL)
        .addFields({name: "ID du serveur", value: `\`\`\`${GuildID}\`\`\``, inline:true})
        .addFields({name: "Propriétaire", value: `<@${GuildOwner.id}> (\`${GuildOwner.username}\`)`, inline:true})
        .addFields({name: "Date de création", value: `<t:${GuildCreatedAt}:D> (<t:${GuildCreatedAt}:R>)`})
        .addFields({name: "Nombre de membres", value: `\`\`\`${GuildMemberSize}\`\`\``, inline: true})
        .addFields({name: "Nombre de rôles", value: `\`\`\`${GuildRolesSize}\`\`\``, inline: true})
        .addFields({name: "Nombre de salons", value: `\`\`\`${GuildChannelSize}\`\`\``, inline: true})
        .addFields({name: "État des boost", value: `\`\`\`${GuildBoostCount} Boost (Niveau ${GuildBoostTier})\`\`\``})
        .addFields({name: `Emojis [${GuildEmojiSize}]`, value: `${GuildEmojiMension}`})
    }

    embed
    .setColor("#EFCB8C")
    .setFooter({text: `Requested by ${interaction.user.globalName}`, iconURL: `${interaction.user.displayAvatarURL()}`})

    await interaction.reply({embeds: [embed]});
};

const badges = {
    "ActiveDeveloper": "<:ActiveDev:1398270523489914910> ",
    "BugHunterLevel1": "<:BugHunt1:1398266960562884684> ",
    "BugHunterLevel2": "<:BugHunt2:1398266873191333970> ",
    "CertifiedModerator": "<:CertifModo:1398266358898364577> ",
    "Hypesquad": "<:HypeBadge0:1398266162285907968> ",
    "HypeSquadOnlineHouse1": "<:HypeBadge1:1398265015290695690> ",
    "HypeSquadOnlineHouse2": "<:HypeBadge2:1398265039982563409> ",
    "HypeSquadOnlineHouse3": "<:HypeBadge3:1398263002355994714> ",
    "Partner": "<:Partner:1398270455781130340> ",
    "PremiumEarlySupporter": "<:PremiumEarlySup:1398266640818507826> ",
    "Staff": "<:Staff:1398266753863389286> ",
    "VerifiedDeveloper": "<:VerifDev:1398266529795014769> ",
}