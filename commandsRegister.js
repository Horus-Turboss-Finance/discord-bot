const { REST, Routes } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');

const commands = [];

let {DISCORD_TOKEN, DISCORD_CLIENT_ID} = process.env

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'main' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// log table.
let cons = commands

let commandArrTable = [];
for(let e of cons) {
	let {name, description, options} = e;

	if(options){
		for(let f of options){
			commandArrTable.push({name: `${name} ${f.name}`, description: f.description})
		}
	}else{
		commandArrTable.push({name, description})
	}
}
console.table(commandArrTable)

const rest = new REST().setToken(DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(DISCORD_CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();