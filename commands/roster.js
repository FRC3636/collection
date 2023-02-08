const { SlashCommandBuilder } = require('discord.js');

const rosterCommand =
    new SlashCommandBuilder()
    .setName('roster')
    .setDescription('manage roster')
        // Display commands
        .addSubcommandGroup(group =>
            group
            .setName('get')
            .setDescription('Display members/values of rosters')

            .addSubcommand(subcommand =>
                subcommand
                .setName('main'),
            )

            .addSubcommand(subcommand =>
                subcommand
                .setName('wait'),
            )

            .addSubcommand(subcommand =>
                subcommand
                .setName('all'),
            ),
        )
        // Main roster commands
        .addSubcommandGroup(group =>
            group
            .setName('main')
            .setDescription('manage main roster')
            // Add member
            .addSubcommand(subcommand =>
                subcommand
                .setName('add')
                .setDescription('add member to main roster')
                .addUserOption(option =>
                    option
                    .setName('user')
                    .setRequired(true),
                )
                .addNumberOption(option =>
                    option
                    .setName('value')
                    .setRequired(true)),
                )
            // Remove member
            .addSubcommand(subcommand =>
                subcommand
                .setName('remove')
                .setDescription('remove member from roster')
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('user to remove')
                    .setRequired(true),
                ),
            )
            // Change score of member
            .addSubcommand(subcommand =>
                subcommand
                .setName('change')
                .setDescription('change value of user')
                .addUserOption(option =>
                    option
                    .setName('user')
                    .setRequired(true),
                )
                .addNumberOption(option =>
                    option
                    .setName('value')
                    .setRequired(true),
                ),
            ),
        )
        // Wait roster commands
        .addSubcommandGroup(group =>
                group
                .setName('main')
            .setDescription('manage wait roster')
            // add user
            .addSubcommand(subcommand =>
                subcommand
                .setName('add')
                .setDescription('add member to wait roster')
                .addUserOption(option =>
                    option
                    .setName('user')
                    .setRequired(true),
                )
                .addNumberOption(option =>
                    option
                    .setName('value')
                    .setRequired(true)),
                )
            // remove user
            .addSubcommand(subcommand =>
                subcommand
                .setName('remove')
                .setDescription('remove member from wait roster')
                .addUserOption(option =>
                    option.setName('user')
                    .setDescription('user to remove')
                    .setRequired(true),
                ),
            )
            // change user
            .addSubcommand(subcommand =>
                subcommand
                .setName('change')
                .setDescription('change value of user')
                .addUserOption(option =>
                    option
                    .setName('user')
                    .setRequired(true),
                )
                .addNumberOption(option =>
                    option
                    .setName('value')
                    .setRequired(true),
                ),
            ),
    );

module.exports = {
    data: rosterCommand,
    async execute(interaction) {
        await interaction.reply(`${interaction}`);
    },
};
