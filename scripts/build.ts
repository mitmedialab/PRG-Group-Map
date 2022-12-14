import fs from "fs";
import path from "path";
import { flush, getChildFileNames, NormalizedData } from "builder";
import * as chokidar from "chokidar";
import { ChildProcess, exec, execSync, fork } from 'child_process';
import glob from "glob";
import { processCommandLineArgs } from "scripts/CLI";
import { Color, log } from 'scripts/logInColor';
import { directories, getDataForDir, getDirectory, getScript, projectRoot } from "scripts/filesystem";

const { watch } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    },
});

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

const dirNames = Object.keys(directories);
const items = await Promise.all(Object.values(directories).map(getDataForDir));
const data = items.reduce((acc, item, index) => {
    acc[dirNames[index]] = item;
    return acc;
}, {}) as NormalizedData;

flush(data);

const execution = watch ? exec : execSync;

const command = watch ? "dev" : "build";
const bundleApp = `npm run ${command} --prefix ${getDirectory("app")}`;
const env = { ...process.env };
const bundling = execution(bundleApp, { env });

if (!watch) log((bundling as Buffer).toString(), Color.Cyan);

if (watch) {

    (bundling as ChildProcess).stdout.on("data", (data) => log(`app: ${data}`, Color.Cyan));
    (bundling as ChildProcess).stdout.on("error", (err) => log(`app: ${err}`, Color.Red));

    const globQuery = path.join(projectRoot, `{${dirNames.join(",")}}`, "*.ts");
    const files = glob.sync(globQuery);

    const refresh = (file: string) => fork(getScript("refresh"), [`--file=${file}`]);

    chokidar.watch(globQuery).on("all", async (event, file) => {
        switch (event) {
            case "add":
                if (files.includes(file)) return;
                log(`New file to ${file}`, Color.Grey);
                if (directoriesRequiringCodeGen.includes(file)) generateImportsForChildFiles(file);
                files.push(file);
                return refresh(file);
            case "change":
                log(`Change to ${file}`, Color.Grey);
                return refresh(file);
        }
    });
}