import path from 'path';
import chalk from "chalk";
import glob from "glob";
import { fork } from "child_process";
import * as chokidar from "chokidar";
import { bundle } from './bundle';
import { processCommandLineArgs } from './CLI';
import { Message } from './communication';
import { clear, decodeMessage, flush, init, NormalizedData } from '../builder';

const { watch } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    }
});

clear();

const data = init();

const root = path.resolve(__dirname, "..");

const openingLog = (msg: string) => console.log(chalk.cyan(msg));
const closingLog = (msg: string) => console.log(chalk.green(msg));
const errorLog = (msg: string) => console.error(chalk.red(msg));

const executedFiles: string[] = [];
const memberIndexByFile: Record<string, number> = {};

const process = (file: string, name: string, onComplete?: () => void) =>
    fork(file).on("message", (msg: Message) => {
        const decoded = decodeMessage(msg);
        if (!decoded) return errorLog(`Error decoding data from ${name}`);

        const [key, value] = decoded;
        switch (key) {
            case "themes":
                data[key] = value as NormalizedData[typeof key];
                break;
            case "roles":
                data[key] = value as NormalizedData[typeof key];
                break;
            case "skills":
                data[key] = value as NormalizedData[typeof key];
                break;
            case "members":
                const member = (value as NormalizedData["members"])[0];
                file in memberIndexByFile
                    ? data["members"][memberIndexByFile[file]] = member
                    : memberIndexByFile[file] = data[key].push(member) - 1;
                break;
        }

        closingLog(`Completed ${name}.`);
        if (onComplete) onComplete();
    });

let initialProcessCount = 0;

const initialExecute = (file: string) => {
    executedFiles.push(file);
    const fileName = path.basename(file);
    openingLog(`Begin executing ${fileName}`);

    initialProcessCount++;
    process(file, fileName, () => {
        initialProcessCount--;
        if (initialProcessCount == 0) initialBundle();
    });
}

const executableFilesQuery = `${root}/{people,categories}/*.ts`;

const initialBundle = () => {
    flush(data);

    if (!watch) return bundle(root);

    chokidar.watch(executableFilesQuery).on('all', (event, file) => {
        const fileName = path.basename(file);

        switch (event) {
            case "change":
                openingLog(`Begin re-executing ${fileName}.`);
                process(file, fileName, () => flush(data));
                return;
            case "add":
                if (executedFiles.includes(file)) return;
                openingLog(`Executing new file: ${fileName}.`);
                process(file, fileName, () => flush(data));
                executedFiles.push(fileName);
                return;
        }
    });

    const themesFile = path.join(root, 'categories', 'projectsByTheme.ts');
    const themesFileName = path.basename(themesFile);
    chokidar.watch(`${root}/categories/themes/**/*.ts`).on('change', (path, stats) => {
        openingLog(`Change in ${path}`);
        openingLog(`Begin re-executing ${themesFileName}.`);
        process(themesFile, themesFileName, () => flush(data));
    });

    bundle(root, true).then(watcher => {
        if (!watcher) return;

        watcher.on('event', (event) => {
            console.log(chalk.gray(event.code))
            if (event.code === "BUNDLE_END") { event.result?.close() }
        });
    });
}

glob(executableFilesQuery, (err: Error | null, files: string[]) => {
    if (err) return errorLog(`${err.name}: ${err.message} ${err.stack ?? ""}`);
    files.forEach(initialExecute);
});