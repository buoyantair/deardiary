import { constants as fsConstants, promises as fsPromises } from "fs";

interface Configuration {
  diaryPath: string;
}

async function generateDefaultConfig(
  dataDir: string,
  configDir: string,
  configPath: string,
  defaultConfig: Configuration
): Promise<Configuration> {
  try {
    await fsPromises.mkdir(configDir, { recursive: true });
    await fsPromises.writeFile(configPath, JSON.stringify(defaultConfig));
  } catch (e) {
    console.log("Failed to generate a new config", e);
  }

  return getConfig(dataDir, configDir);
}

async function getConfig(
  dataDir: string,
  configDir: string
): Promise<Configuration> {
  const { HOME, XDG_DATA_HOME, XDG_CONFIG_HOME } = process.env;

  let DATA_DIR,
    CONFIG_DIR,
    CONFIG_PATH = null;

  if (dataDir !== undefined) {
    DATA_DIR = dataDir;
  } else {
    DATA_DIR = XDG_DATA_HOME
      ? `${XDG_DATA_HOME}/deardiary`
      : `${HOME}/.local/share/deardiary`;
  }

  if (configDir !== undefined) {
    CONFIG_DIR = configDir;
  } else {
    CONFIG_DIR = XDG_CONFIG_HOME
      ? `${XDG_CONFIG_HOME}/deardiary`
      : `${HOME}/.config/deardiary`;
  }
  CONFIG_PATH = `${CONFIG_DIR}/deardiary.settings`;

  const defaultConfig: Configuration = {
    diaryPath: `${DATA_DIR}/log`
  };
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
      return generateDefaultConfig(
        DATA_DIR,
        CONFIG_DIR,
        CONFIG_PATH,
        defaultConfig
      );
    } else {
      console.error(e);
    }
  }

  return config;
}

export default {
  getConfig,
  generateDefaultConfig
};
