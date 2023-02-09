import { SlashCommandBuilder } from "discord.js";
import Command from "../command";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("replies with pong:)")
        .toJSON(),
    async execute(interaction) {
        await interaction.reply("Pong!");
    },
} satisfies Command;
