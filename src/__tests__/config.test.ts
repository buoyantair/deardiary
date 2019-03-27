import ConfigurationManager from "../config";

describe("Configuration Management", () => {
  describe("getConfig()", () => {
    test("getConfig should return a config object", async () => {
      const result = await ConfigurationManager.getConfig();
      expect(result).toEqual(ConfigurationManager.defaultConfig);
    });
  });

  describe("generateDefaultConfig()", () => {});
});
