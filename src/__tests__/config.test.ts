import { constants as fsConstants, promises as fsPromises } from "fs";
import ConfigurationManager, { IConfiguration } from "../config";
import { Database } from "sqlite";
import {
  CACHE_PATH,
  CACHE_CONFIG_DIR_PATH,
  CACHE_DATA_DIR_PATH,
  CACHE_CONFIG_PATH
} from "./index";

describe("Configuration Management", () => {
  describe("generateConfig()", () => {
    test(`deardiary.settings config file must exist at ${CACHE_CONFIG_PATH}`, async () => {
      const inputConfig: IConfiguration = {
        diaryPath: "/log"
      };
      try {
        const generatedConfig = await ConfigurationManager.generateConfig(
          CACHE_CONFIG_DIR_PATH,
          CACHE_CONFIG_PATH,
          inputConfig
        );
        await fsPromises.access(
          CACHE_CONFIG_PATH,
          fsConstants.R_OK && fsConstants.W_OK
        );

        expect(generatedConfig).toEqual(inputConfig);
      } catch (e) {
        throw e;
      }
    });
  });

  describe("getConfig()", () => {
    let generatedConfig: IConfiguration;
    beforeEach(async () => {
      const exampleConfig: IConfiguration = {
        diaryPath: "/log"
      };
      try {
        generatedConfig = await ConfigurationManager.generateConfig(
          CACHE_CONFIG_DIR_PATH,
          CACHE_CONFIG_PATH,
          exampleConfig
        );
      } catch (e) {
        throw e;
      }
    });

    test("getConfig should read the config file & return a config object with relevant properties", async () => {
      const result = await ConfigurationManager.getConfig(
        CACHE_CONFIG_DIR_PATH
      );

      expect(result).toEqual(generatedConfig);
      expect(typeof result.diaryPath).toBe("string");
    });
  });

  describe("getDatabase()", () => {
    test("Returns a new database object when called", async () => {
      const database: Database = await ConfigurationManager.getDatabase(CACHE_PATH);
      expect(database).toBeTruthy();
    });

    test("Database file exists in the cache directory", async () => {
      try {
        await ConfigurationManager.getDatabase(CACHE_DATA_DIR_PATH);
        await fsPromises.access(
          `${CACHE_DATA_DIR_PATH}/diary.sqlite`,
          fsConstants.R_OK && fsConstants.W_OK
        );
      } catch (e) {
        throw e;
      }
    });
  });
});
