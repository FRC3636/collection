const { SlashCommandBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong:)')
    .addSubcommandGroup(command =>
     command.setName('hello'),
    ),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },

};