// Require the necessary discord.js classes

import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { token } from './config.json';

import fs from 'node:fs';
import path from 'node:path';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    console.log('data' in command);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        console.error('the command at' + filePath + ' is missing required "data" or "execute');
    }
}


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand) { return; }
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error('No command with matching name found');
        return;
    }

    try {
        await command.execute(interaction);
    }
    catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});


client.login(token);
