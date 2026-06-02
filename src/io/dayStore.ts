import moment from "obsidian";
import { parseDay, lines, i } from "./taskParser";

async function loadFromFileContent(app, file) {
  const fileContent = await app.vault.read(file);
  const coreFormat =
    app.internalPlugins.plugins["daily-notes"]?.instance?.options?.format;
  const periodicFormat =
    app.plugins.plugins["periodic-notes"]?.settings?.daily?.format;
  const userFormat = coreFormat || periodicFormat || "YYYY-MM-DD";
  // needs to be converted to unified format using moment
  const dateToken = moment(file.basename, userFormat);
  console.log(dateToken);

  const dd = dateToken.format("DD");
  const mm = dateToken.format("MMMM");
  const yy = dateToken.format("YYYY");

  parseDay(fileContent, dd, mm, yy);
}
