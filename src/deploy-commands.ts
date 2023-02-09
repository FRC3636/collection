import { REST, Routes } from "discord.js";
import config from "./config";
import fs from "node:fs";
import Command from "./command";

const commands = [];

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`) as Command;
    commands.push(command.data);
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    console.log(
        `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = (await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands }
    )) as unknown[];

    console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
    );
})().catch(console.error);
