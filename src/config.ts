import { constants as fsConstants, promises as fsPromises } from "fs";
import { sqlite3 } from "sqlite3";

export interface IConfiguration {
  diaryPath: string;
}

function getProgramPaths() {
  function configPath(configDir: string) {
    return `${configDir}/deardiary.settings`;
  }

  const { HOME, XDG_DATA_HOME, XDG_CONFIG_HOME } = process.env;

  const DATA_DIR = XDG_DATA_HOME
    ? `${XDG_DATA_HOME}/deardiary`
    : `${HOME}/.local/share/deardiary`;
  const CONFIG_DIR = XDG_CONFIG_HOME
    ? `${XDG_CONFIG_HOME}/deardiary`
    : `${HOME}/.config/deardiary`;
  const CONFIG_PATH = configPath(CONFIG_DIR);
  const DATA_PATH = `${DATA_DIR}/diary.sqlite`;

  return {
    DATA_DIR,
    DATA_PATH,
    CONFIG_DIR,
    CONFIG_PATH,
    configPath
  };
}

async function generateConfig(
  dataDir: string,
  configDir: string,
  configPath: string,
  config: IConfiguration
): Promise<IConfiguration> {
  try {
    await fsPromises.mkdir(configDir, { recursive: true });
    await fsPromises.writeFile(configPath, JSON.stringify(config));
  } catch (e) {
    if (e.code === "EISDIR") {
      await fsPromises.writeFile(configPath, JSON.stringify(config));
    } else {
      console.log("Failed to generate a new config", e);
    }
  }

  return getConfig(dataDir, configDir);
}

async function getConfig(
  dataDir: string,
  configDir: string
): Promise<IConfiguration> {
  const programPaths = getProgramPaths();
  const CONFIG_DIR = configDir || programPaths.CONFIG_DIR;
  const CONFIG_PATH = configDir
    ? programPaths.configPath(CONFIG_DIR)
    : programPaths.CONFIG_PATH;

  let config;
  try {
    await fsPromises.access(CONFIG_PATH, fsConstants.R_OK && fsConstants.W_OK);
    let rawConfig = await fsPromises.readFile(CONFIG_PATH, {
      encoding: "utf-8"
    });

    config = JSON.parse(rawConfig.toString());
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log(
        `Config doesn't exist, please generate one using ConfigurationManager.generateConfig()
          before calling getConfig()`,
        e
      );
    } else {
      console.error(e);
    }
  }

  return config;
}

/**
 * TODO: implementation
 * Returns an SQLite3 Database object
 *
 */
function getDatabase() {}

export default {
  getConfig,
  generateConfig,
  getDatabase
};
