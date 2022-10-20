import path from 'path';
import fs from 'fs';
import chalk from "chalk";
import glob from "glob";
import { fork } from "child_process";
import * as chokidar from "chokidar";
import { bundle } from './bundle';
import { processCommandLineArgs } from './CLI';
import { Flag, Message } from './communication';
import { clear, getData, move } from '../builder';

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

const openingLog = (msg: string) => console.log(chalk.cyan(msg));
const closingLog = (msg: string) => console.log(chalk.green(msg));

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
        move(payload);
        initialBundle();
    });
}

const executedFiles: string[] = [];
const execute = (file: string) => {
    executedFiles.push(file);
    const fileName = path.basename(file);
    openingLog(`Begin executing ${fileName}`);

    fork(file).on("message", (msg: Message) => {
        closingLog(`Completed ${fileName}.`);
        fragmentCount++;
        onFragmentWrite(msg);
    });
}


const initialBundle = () => {
    if (!watch) return bundle(root);

    chokidar.watch(`${root}/{people,categories}/*.ts`).on('all', (event, file) => {
        const fileName = path.basename(file);

        switch (event) {
            case "change":
                openingLog(`Begin re-executing ${fileName}.`);
                fork(file).on("message", (msg: Message) => {
                    closingLog(`Completed ${fileName}.`);
                    const { flag, payload } = msg;
                    if (flag == Flag.WroteFragment) return move(payload);
                });
                return;
            case "add":
                if (executedFiles.includes(file)) return;
                openingLog(`Executing new file: ${fileName}.`);
                fork(file).once("close", () => closingLog(`Completed ${fileName}.`));
                executedFiles.push(fileName);
                return;
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

clear();

glob(`${root}/{people,categories}/*.ts`, (err: Error | null, files: string[]) => {
    files.forEach(execute);
});