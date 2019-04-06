import { join, parse } from "path";
import { promisify } from "util";
import * as fs from "fs";
import * as program from "commander";
import { version } from "../package.json";
import configManager from "./config";

program.version(version);

program.command("ping").action(() => {
  console.log("pong!");
});

program.parse(process.argv);
