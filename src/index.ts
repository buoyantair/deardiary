import { join, parse } from "path";
import { promisify } from "util";
import * as fs from "fs";
import * as program from "commander";
import { version } from "../package.json";
import configManager from "./config";

const appendFile = promisify(fs.appendFile);

configManager.getConfig().then(console.log);
// (async () => {
//   try {
//     const test = await appendFile(
//       "/home/flowerypastels/deardiary.settings",
//       "Hello world"
//     );
//   } catch (e) {
//     console.error(e);
//   }
// })();

program.version(version);

program.command("ping").action(() => {
  console.log("pong!");
});

program.parse(process.argv);
