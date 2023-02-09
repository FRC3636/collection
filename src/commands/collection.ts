// eslint-disable-next-line no-unused-vars
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import db from '../collection-database';
import { TemplateTag } from 'common-tags';
const sql = new TemplateTag();

const collectionCommand =
    new SlashCommandBuilder()
        .setName('collection')
        .setDescription('manage collection')

        // clears collections
        .addSubcommand(subcommand =>
            subcommand
            .setName('clear')
            .setDescription('clears all collections'),
        )

        // get collection info
        .addSubcommandGroup(group =>
            group
                .setName('get')
                .setDescription('Display members/values of collections')

                // get main collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('main')
                        .setDescription('displays all members and values in main collection'),
                )

                // get wait collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('wait')
                        .setDescription('displays all members and values in wait collection'),
                )
                // get all collections
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('all')
                        .setDescription('displays all members and values in all collections'),
                ),
        )

        // manage main collection
        .addSubcommandGroup(group =>
            group
                .setName('main')
                .setDescription('manage main collection')

                // add member to main collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('add member to main collection')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('user to add to collection')
                                .setRequired(true),
                        )
                        .addStringOption(option =>
                            option
                                .setName('value')
                                .setDescription('value to give to user')
                                .setRequired(true)),
                )

                // remove member from main collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('remove member from collection')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('user to remove')
                                .setRequired(true),
                        ),
                )
                // change value of member in main collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('change')
                        .setDescription('change value of user')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('changes value of user in main collection')
                                .setRequired(true),
                        )
                        .addStringOption(option =>
                            option
                                .setName('value')
                                .setDescription('value to assign to user')
                                .setRequired(true),
                        ),
                ),
        )

        // manage wait collection
        .addSubcommandGroup(group =>
            group
                .setName('wait')
                .setDescription('manage wait collection')

                // add member to wait collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('add')
                        .setDescription('add member to wait collection')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('user to add to collection')
                                .setRequired(true),
                        ),
                )
                // remove member from wait collection
                .addSubcommand(subcommand =>
                    subcommand
                        .setName('remove')
                        .setDescription('remove member from wait collection')
                        .addUserOption(option =>
                            option
                                .setName('user')
                                .setDescription('user to remove')
                                .setRequired(true),
                        ),
                ),
        );

const getMainStmt = db.prepare(sql`SELECT * FROM main_table;`);
const getWaitStmt = db.prepare(sql`SELECT * FROM wait_table;`);

const getUserMain = db.prepare(sql`SELECT * FROM main_table WHERE username = ?;`);
const getUserWait = db.prepare(sql`SELECT * FROM wait_table WHERE username = ?;`);

const mainAddStmt = db.prepare(sql`INSERT INTO main_table (username, value) VALUES (?, ?);`);
const waitAddStmt = db.prepare(sql`INSERT INTO wait_table (username) VALUES (?); `);

const mainChangeStmt = db.prepare(sql`UPDATE main_table SET value = ? WHERE username = ?;`);

const setCounter = db.prepare(sql`UPDATE counter_table SET items = ? WHERE the_collection = ?;`);

const getCounter = db.prepare(sql`SELECT items FROM counter_table WHERE the_collection = ?;`);

const mainRemoveStmt = db.prepare(sql`DELETE FROM main_table WHERE username = ?;`);
const waitRemoveStmt = db.prepare(sql`DELETE FROM wait_table WHERE username = ?;`);

const deleteMainStmt = db.prepare(sql`DELETE FROM main_table;`);
const deleteWaitStmt = db.prepare(sql`DELETE FROM wait_table;`);

module.exports = {
    data: collectionCommand,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommandGroup() + ' ' + interaction.options.getSubcommand();
        const user = interaction.options.getUser("user")?.id;
        const value = interaction.options.getString("value");
        const permIDs = ['682051435533565979', '766756847138635798'];
        const managePerms = interaction.member.roles.cache.some(r => r.name === 'Captain') ||
                            interaction.member.roles.cache.some(r => r.name === 'Benevolent Leader') ||
                            interaction.member.roles.cache.some(r => r.name === 'Mod') ||
                            permIDs.includes(interaction.member.id + '');

        const mainCount = getCounter.pluck().get('main');
        const waitCount = getCounter.pluck().get('wait');

        if (interaction.options.getSubcommand() === 'clear') {
            if (!managePerms) {
                await interaction.reply('no perms???');
                return;
            }
            deleteMainStmt.run();
            deleteWaitStmt.run();
            setCounter.run(0, 'main');
            setCounter.run(0, 'wait');
            await interaction.reply('cleared all collections');
            return;
        }
        switch (subcommand) {
            case 'get main': {
                const main = getMainStmt.all();
                if (main.length > 0) {
                    await interaction.reply(
                        main.map(({ username, value }) => `<@${username}> : ${value}`)
                            .join('\n'));
                    break;
                }
                await interaction.reply('collection is empty');
                break;
            }
            case 'get wait':{
                const wait = getWaitStmt.all();
                if (wait.length > 0) {
                    await interaction.reply(
                        wait.map(({ username }) => `<@${username}>`)
                            .join('\n'));
                    break;
                }
                await interaction.reply('wait collection is empty');
                break;
            }
            case 'get all':{
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                const main = getMainStmt.all();
                const wait = getWaitStmt.all();
                if (wait.length > 0 && main.length > 0) {
                    await interaction.reply(
                    `\tMain collection:\n${main.map(({ username, value }) => `<@${username}> : ${value}`).join('\n')}\n\nWait collection:\n${wait.map(({ username }) => `<@${username}>`).join('\n')}`);
                    break;
                }
                await interaction.reply('a collection is empty');
                break;
            }
            case 'main add': {
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                if (mainCount >= 9) {
                    await interaction.reply('main collection is full');
                    break;
                }
                if (getUserMain.get(user) === undefined && getUserWait.get(user) === undefined) {
                    mainAddStmt.run(user, value);
                    setCounter.run(mainCount + 1, 'main');
                    await interaction.reply(`:white_check_mark: Added <@${user}> to the collection with ${value}.`);
                    break;
                }
                await interaction.reply(`:x: <@${user}> is already on a collection.`);
                break;
            }
            case 'main remove': {
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                if (getUserMain.get(user) !== undefined) {
                    mainRemoveStmt.run(user);
                    setCounter.run(mainCount - 1, 'main');
                    await interaction.reply(`:white_check_mark: Removed <@${user}> from the collection.`);
                    break;
                }
                await interaction.reply(`:x: <@${user}> is not on the collection.`);
                break;
            }
            case 'main change':{
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                if (getUserMain.get(user) === undefined) {
                    await interaction.reply(`:x: <@${user}> is not on the collection.`);
                    break;
                }
                mainChangeStmt.run(value, user);
                await interaction.reply(`:white_check_mark: Changed <@${user}>'s value to ${value}.`);
                break;
            }
            case 'wait add':{
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                if (waitCount >= 9) {
                    await interaction.reply('wait collection is full');
                    break;
                }
                if (getUserWait.get(user) === undefined) {
                    console.log(`user: ${user}`);
                    waitAddStmt.run(user);
                    setCounter.run(waitCount + 1, 'wait');
                    await interaction.reply(`:white_check_mark: Added <@${user}> to the wait collection `);
                    break;
                }
                await interaction.reply(`:x: <@${user}> is already on the wait collection.`);
                break;
            }
            case 'wait remove':{
                if (!managePerms) {
                    await interaction.reply('no perms???');
                    return;
                }
                if (getUserWait.get(user) !== undefined) {
                    waitRemoveStmt.run(user);
                    setCounter.run(waitCount - 1, 'wait');
                    await interaction.reply(`:white_check_mark: Removed <@${user}> from the wait collection.`);
                    break;
                }
                await interaction.reply(`:x: <@${user}> is not on the wait collection.`);
                break;
            }

        }
    },
};
