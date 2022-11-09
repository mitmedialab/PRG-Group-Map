import path from "path";
import fs from 'fs';
import { UnionToTuple } from "builder";
import { Color, log } from "scripts/logInColor";
import { processCommandLineArgs } from "scripts/CLI";
import { getFileFromRoot, projectRoot } from "scripts/filesystem";

const enum Type {
  Person = "person",
  Project = "project"
}
const types: UnionToTuple<Type> = [Type.Person, Type.Project];

const enum Template {
  Default = "default",
  Minimal = "minimal"
}
const templates: UnionToTuple<Template> = [Template.Default, Template.Minimal];

const getAcceptValuesReadout = (items: string[]) =>
  `accept values are: ${items.map(t => `"${t}"`).join(", ")}`;

const { name, type, template } = processCommandLineArgs("npm run new --", {
  name: {
    alias: 'n',
    description: 'name of file to be created (do not include spaces)',
    type: String
  },
  type: {
    alias: 'y',
    description: `what kind of file to create (${getAcceptValuesReadout(types)})`,
    type: String,
  },
  template: {
    alias: 't',
    description: `which style of file template to use (${getAcceptValuesReadout(templates)})`,
    type: String,
    defaultValue: Template.Default
  }
});

const nameof = (variable: Record<string, any>) => Object.keys(variable)[0];

const checkValue = (acceptableValues: string[], value: string, name: string) => {
  if (acceptableValues.includes(value)) return;
  throw new Error(`Value of ${type} cannot be use for the ${name} parameter. Use --help to view acceptable values for command.`)
}

checkValue(types, type, nameof({ type }));
checkValue(templates, template, nameof({ template }));

const dirByType: Record<Type, string> = {
  [Type.Person]: "people",
  [Type.Project]: "projects"
}

const { path: filepath, name: filename } = getFileFromRoot(dirByType[type], `${name}.ts`);
if (fs.existsSync(filepath)) throw new Error(`Specified file ${filename} already exists`);

const templatesDirectory = path.join(projectRoot, "_templates");
const templateFile = path.join(templatesDirectory, `${template}${type}.ts`);

const content = fs.readFileSync(templateFile, 'utf8');
fs.writeFileSync(filepath, content, 'utf8');

log(`Created file ${filename}! Now you can edit it to add your information.`, Color.Green);
log(`File located at:`, Color.Grey);
log(`\t${filepath}`, Color.Cyan);