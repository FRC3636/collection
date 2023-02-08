const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user-info')
    .setDescription('replies with user info'),
    async execute(interaction) {
        await interaction.reply(`command run by ${interaction.user.username} who joined server at ${interaction.member.joinedAt}`);
    },
};