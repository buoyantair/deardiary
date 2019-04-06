import { constants as fsConstants, promises as fsPromises } from "fs";
import { open as sqliteOpen, Database } from "sqlite";

export interface IConfiguration {
  diaryPath: string;
}

function getProgramPaths() {
  function configPath(configDir: string) {
    return `${configDir}/deardiary.settings`;
  }

  function dataPath(dataDir: string) {
    return `${dataDir}/diary.sqlite`;
  }

  const { HOME, XDG_DATA_HOME, XDG_CONFIG_HOME } = process.env;

  const DATA_DIR = XDG_DATA_HOME
    ? `${XDG_DATA_HOME}/deardiary`
    : `${HOME}/.local/share/deardiary`;
  const CONFIG_DIR = XDG_CONFIG_HOME
    ? `${XDG_CONFIG_HOME}/deardiary`
    : `${HOME}/.config/deardiary`;
  const CONFIG_PATH = configPath(CONFIG_DIR);
  const DATA_PATH = dataPath(DATA_DIR);

  return {
    DATA_DIR,
    DATA_PATH,
    CONFIG_DIR,
    CONFIG_PATH,
    configPath,
    dataPath
  };
}

async function generateConfig(
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

  return getConfig(configDir);
}

async function getConfig(configDir?: string): Promise<IConfiguration> {
  const programPaths = getProgramPaths();
  const CONFIG_PATH = configDir
    ? programPaths.configPath(configDir)
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
function getDatabase(dataDir: string) {
  const programPaths = getProgramPaths();
  const DATA_PATH = dataDir
    ? programPaths.dataPath(dataDir)
    : programPaths.DATA_PATH;

  return sqliteOpen(DATA_PATH, { promise: Promise });
}

export default {
  getConfig,
  generateConfig,
  getDatabase
};
