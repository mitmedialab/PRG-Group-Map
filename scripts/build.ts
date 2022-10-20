import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import glob from "glob";
import { fork } from "child_process";
import * as chokidar from "chokidar";
import { bundle } from './bundle';
import { processCommandLineArgs } from './CLI';
import { Flag, Message } from './communication';
import { clear } from '../builder';

const { watch } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    }
});

const root = path.resolve(__dirname, "..");
const joinScript = path.join(__dirname, "join.ts");

const logOpen = (msg: string) => console.log(chalk.cyan(msg));
const logClose = (msg: string) => console.log(chalk.green(msg));

clear();

const executedFiles: string[] = [];

let nextFragment: string | undefined = undefined;
let fragmentCount = 0;

const onFragmentWrite = (msg: Message) => {
    const { flag, payload } = msg;
    if (flag !== Flag.WroteFragment) return;

    if (nextFragment === undefined) return nextFragment = payload;
    const join = fork(joinScript, [`-a`, `${nextFragment}`, `-b`, `${payload}`]);
    nextFragment = undefined;
    join.on("message", (msg: Message) => {
        fragmentCount -= 1;
        if (fragmentCount > 1) return onFragmentWrite(msg);
        const { payload } = msg;
        initialBundle();
    });
}

const execute = (task: string) => {
    if (!task) return;

    const file = path.basename(task);
    logOpen(`Begin executing ${file}`);

    fork(task).on("message", (msg: Message) => {
        logClose(`Completed ${file}.`);
        fragmentCount++;
        onFragmentWrite(msg);
    });
}

glob(`${root}/{people,categories}/*.ts`, (err: Error | null, files: string[]) => {
    files.forEach(execute);
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


