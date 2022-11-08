import { processCommandLineArgs } from "scripts/CLI";
import path from "path";
import { Color, log } from "scripts/logInColor";
import { flush, read } from "builder";
import { Category, getDataForDir } from "scripts/filesystem";

const { file } = processCommandLineArgs("npm run refresh --", {
  file: {
    alias: 'f',
    description: 'which file is triggering the refresh',
    type: String,
  },
});

const directory = path.dirname(file);
const category = path.basename(directory) as Category;
log(`Refreshing ${category} category.`, Color.Green);

const data = read();
getDataForDir(directory).then(updated => {
  // @ts-ignore
  data[category] = updated;
  flush(data);
});