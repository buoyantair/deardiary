import ConfigurationManager from "../config";
const CACHE_PATH = `${__dirname}/cache`;
const CONFIG_CACHE_PATH = `${CACHE_PATH}/config`;
const DATA_CACHE_PATH = `${CACHE_PATH}/data`;

describe("Configuration Management", () => {
  describe("getConfig()", () => {
    test("getConfig should return a config object with relevant properties", async () => {
      const result = await ConfigurationManager.getConfig(
        DATA_CACHE_PATH,
        CONFIG_CACHE_PATH
      );
      expect(typeof result.diaryPath).toBe("string");
    });
  });

  describe("generateDefaultConfig()", () => {});
});
