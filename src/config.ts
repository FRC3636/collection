import { readFileSync } from "node:fs";

export interface Config {
    token: string;
    clientId: string;
    guildId: string;
}

export default JSON.parse(readFileSync("./config.json").toString()) as Config;
