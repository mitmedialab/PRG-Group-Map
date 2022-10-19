import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import glob from "glob";
import { fork } from "child_process";
import * as chokidar from "chokidar";
import { bundle } from './bundle';
import { processCommandLineArgs } from './CLI';

const { watch } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    }
});

const root = path.resolve(__dirname, "..");

const logOpen = (msg: string) => console.log(chalk.cyan(msg));
const logClose = (msg: string) => console.log(chalk.green(msg));

fs.rmSync(path.join(root, 'app', 'data.json'), { force: true });

const executedFiles: string[] = []

const executeNext = (files: string[]) => {
    const task = files.pop();

    if (!task) return;

    const file = path.basename(task);
    logOpen(`Begin executing ${file}`);

    if (files.length === 0) {
        fork(task).once("close", () => {
            logClose(`Completed ${file}.`);
            executedFiles.push(file);
            logOpen("Beginning bundling process.");
            initialBundle();
        });
    } else {
        fork(task).once("close", () => {
            logClose(`Completed ${file}.`);
            executedFiles.push(file);
            executeNext(files);
        });
    }
}

glob(`${root}/{people,categories}/*.ts`, (err: Error | null, files: string[]) => {
    if (err) return console.error(chalk.red(err));
    executeNext(files);
});

const initialBundle = () => {
    if (watch) {
        chokidar.watch(`${root}/{people,categories}/*.ts`).on('all', (event, file) => {

            if (event === "change") {
                const fileName = path.basename(file);
                logOpen(`Begin re-executing ${fileName}.`);
                fork(file).once("close", () => logClose(`Completed ${fileName}.`));
            }

            if (event === "add") {
                const fileName = path.basename(file);

                if (executedFiles.includes(fileName)) return;

                logOpen(`Executing new file: ${fileName}.`);
                fork(file).once("close", () => logClose(`Completed ${fileName}.`));
                executedFiles.push(fileName);
            }
        });

        bundle(root, true).then(watcher => {
            if (!watcher) return;

            watcher.on('event', (event) => {
                console.log(chalk.gray(event.code))
                if (event.code === "BUNDLE_END") { event.result?.close() }
            });
        });

    }
    else {
        bundle(root);
    }
}


