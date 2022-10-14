import path from 'path';
import chalk from "chalk";
import glob from "glob";
import { fork } from "child_process";

const root = path.resolve(__dirname, "..");

const executeNext = (files: string[]) => {
    const task = files.pop();
    if (!task) return;
    if (files.length === 0) return fork(task);
    fork(task).once("close", () => executeNext(files))
}

glob(`${root}/{people,categories}/*.ts`, (err: Error | null, files: string[]) => {
    if (err) return console.error(chalk.red(err));
    executeNext(files);
});
