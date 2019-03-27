import { constants as fsConstants, promises as fsPromises } from "fs";
import ConfigurationManager from "../config";
const CACHE_PATH = `${__dirname}/cache`;
const CACHE_CONFIG_DIR_PATH = `${CACHE_PATH}/config`;
const CACHE_DATA_DIR_PATH = `${CACHE_PATH}/data`;
const CACHE_CONFIG_PATH = `${CACHE_CONFIG_DIR_PATH}/deardiary.settings`;

describe("Configuration Management", () => {
  describe("getConfig()", () => {
    test("getConfig should return a config object with relevant properties", async () => {
      const result = await ConfigurationManager.getConfig(
        CACHE_DATA_DIR_PATH,
        CACHE_CONFIG_DIR_PATH
      );
      expect(typeof result.diaryPath).toBe("string");
    });
  });

  describe("generateDefaultConfig()", () => {});
});
