import fs from "fs";
import path from "path";
import { Data, dirnameFromImportURL, flush, getChildFileNames, NormalizedData, UnionToTuple } from "../builder";
import * as chokidar from "chokidar";
import { processCommandLineArgs } from "./CLI";
import { bundle } from "./bundle";
import { Color, log } from './logInColor';

const { watch } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    },
});

const __dirname = dirnameFromImportURL(import.meta.url);
const root = path.resolve(__dirname, "..");
const getDirectory = (name: string) => path.join(root, name);

const enum Category {
    Projects = "projects",
    People = "people",
    Roles = "roles",
    Skills = "skills",
    Themes = "themes"
};

const categories: UnionToTuple<Category> & (keyof Data)[] = [Category.Projects, Category.People, Category.Roles, Category.Skills, Category.Themes];

const directories = categories.reduce((acc, name) => {
    const dir = getDirectory(name);
    if (!fs.existsSync(dir)) throw new Error(`Directory does not exist for category: ${name}`);
    acc[name] = dir;
    return acc;
}, {} as Record<Category, string>);

const generateImportsForChildFiles = (directory: string) => {
    const codeGenFlag = "CODE GENERATION GUARD";
    const indexFile = path.join(directory, "index.ts");
    const children = getChildFileNames(directory);
    const content = fs.readFileSync(indexFile, "utf8").split("\n");
    const [start, end] = content
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.includes(codeGenFlag))
        .map(({ index }) => index);
    content.splice(start + 1, end - start - 1, ...children.map(file => `\t...(await import("./${file}")).default,`));
    fs.writeFileSync(indexFile, content.join("\n"), "utf8");
};

const directoriesRequiringCodeGen = [directories.projects];
directoriesRequiringCodeGen.forEach(generateImportsForChildFiles);

const getDataForDir = async (path: string) => (await import(path)).default;

const keys = Object.keys(directories);
const items = await Promise.all(Object.values(directories).map(getDataForDir));
const data = items.reduce((acc, item, index) => {
    acc[keys[index]] = item;
    return acc;
}, {}) as NormalizedData;

flush(data);

bundle(root, watch);

if (watch) {
    const globQuery = path.join("root", `{${keys.join(",")}}`, "*.ts");

    chokidar.watch(globQuery).on("all", async (event, file) => {
        const dir = path.dirname(file);
        const category = path.basename(dir) as Category;
        if (!categories.includes(category)) throw new Error(`Change to the following file can not be mapped to a category: ${file}`);
        switch (event) {
            case "add":
            case "change":
                log(`Change to ${file}`, Color.Cyan);
                log(`Refreshing ${category} category.`, Color.Green);
                data[category] = await getDataForDir(dir);
                flush(data);
                return;
        }
    });
}