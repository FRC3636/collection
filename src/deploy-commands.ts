import { REST, Routes } from "discord.js";
import { clientId, guildId, token } from "./config.json";
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

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    console.log(
        `Started refreshing ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
    );

    console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
    );
})().catch(console.error);
