import { constants as fsConstants, promises as fsPromises } from "fs";
import ConfigurationManager, { IConfiguration } from "../config";
const CACHE_PATH = `${__dirname}/cache`;
const CACHE_CONFIG_DIR_PATH = `${CACHE_PATH}/config`;
const CACHE_DATA_DIR_PATH = `${CACHE_PATH}/data`;
const CACHE_CONFIG_PATH = `${CACHE_CONFIG_DIR_PATH}/deardiary.settings`;

describe("Configuration Management", () => {
  describe("generateConfig()", () => {
    test(`deardiary.settings config file must exist at ${CACHE_CONFIG_PATH}`, async () => {
      const inputConfig: IConfiguration = {
        diaryPath: "/log"
      };
      try {
        const generatedConfig = await ConfigurationManager.generateConfig(
          CACHE_DATA_DIR_PATH,
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
          CACHE_DATA_DIR_PATH,
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
        CACHE_DATA_DIR_PATH,
        CACHE_CONFIG_DIR_PATH
      );

      expect(result).toEqual(generatedConfig);
      expect(typeof result.diaryPath).toBe("string");
    });
  });
});
