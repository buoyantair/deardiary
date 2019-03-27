import { constants as fsConstants, promises as fsPromises } from "fs";

const { HOME, XDG_DATA_HOME, XDG_CONFIG_HOME } = process.env;
const DATA_DIR = XDG_DATA_HOME
  ? `${XDG_DATA_HOME}/deardiary`
  : `${HOME}/.local/share/deardiary`;
const CONFIG_DIR = XDG_CONFIG_HOME
  ? `${XDG_CONFIG_HOME}/deardiary`
  : `${HOME}/.config/deardiary`;
const CONFIG_PATH = `${CONFIG_DIR}/deardiary.settings`;

interface Configuration {
  diaryPath: string;
}

const defaultConfig: Configuration = {
  diaryPath: `${DATA_DIR}/log`
};

async function generateDefaultConfig(): Promise<Configuration> {
  try {
    await fsPromises.mkdir(CONFIG_DIR, { recursive: true });
    await fsPromises.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig));
  } catch (e) {
    console.log("Failed to generate a new config", e);
  }

  return getConfig();
}

async function getConfig(): Promise<Configuration> {
  let config;
  try {
    await fsPromises.access(CONFIG_PATH, fsConstants.R_OK && fsConstants.W_OK);
    let rawConfig = await fsPromises.readFile(CONFIG_PATH, {
      encoding: "utf-8"
    });

    config = JSON.parse(rawConfig.toString());
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log(`Config doesn't exist, creating new config...`);
      return generateDefaultConfig();
    } else {
      console.error(e);
    }
  }

  return config;
}

export default {
  getConfig,
  generateDefaultConfig,
  defaultConfig
};
