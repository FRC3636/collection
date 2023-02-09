import { ChatInputCommandInteraction, RESTPostAPIChatInputApplicationCommandsJSONBody, SlashCommandBuilder } from "discord.js";

export default interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
