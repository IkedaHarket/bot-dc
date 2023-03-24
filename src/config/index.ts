import dotenv from "dotenv";

dotenv.config();

interface Config {
  token: string;
  prefix: string;
  openAiToken: string;
}

const config: Config = {
  token: process.env.DISCORD_TOKEN || "",
  openAiToken: process.env.OPEN_AI_TOKEN || "",
  prefix: process.env.PREFIX || "!i",
};

export default config;
