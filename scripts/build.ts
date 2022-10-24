import path from 'path';
import fs from 'fs';
import glob from "glob";
import { fork } from "child_process";
import * as chokidar from "chokidar";
import { bundle } from './bundle';
import { processCommandLineArgs } from './CLI';
import { Message } from './communication';
import { clear, decodeMessage, flush, init, NormalizedData } from '../builder';
import { dataFile, theme } from './files';
import { Color, error, log } from './logInColor';
import fetch from 'node-fetch';

const { watch, clean } = processCommandLineArgs("npm run build --", {
    watch: {
        alias: 'w',
        description: 'watch for file changes',
        type: Boolean,
        trueIfPresent: true
    },
    clean: {
        alias: 'c',
        description: 'Fetches data from the most recent build (instead of rebuilding it locally -- helpful on slower systems)',
        type: Boolean,
        defaultValue: false,
    }
});

if (clean) clear();

const data = init();
const memberIndexByFile: Record<string, number> = {};

const write = () => flush({ ...data, memberIndexByFile });

const root = path.resolve(__dirname, "..");
const executedFiles: string[] = [];

const set = <T extends keyof NormalizedData>(key: T, value: NormalizedData[T]) => data[key] = value;
type ValueFor<T extends keyof NormalizedData> = NormalizedData[T];

const process = (file: string, name: string, onComplete?: () => void) =>
    fork(file).on("message", (msg: Message) => {
        const decoded = decodeMessage(msg);
        if (!decoded) return error(`Error decoding data from ${name}`);

        const [key, value] = decoded;
        switch (key) {
            case "themes":
            case "roles":
            case "skills":
                set(key, value as ValueFor<typeof key>);
                break;
            case "members":
                const member = (value as ValueFor<"members">)[0];
                const relative = path.relative(root, file);
                relative in memberIndexByFile
                    ? data["members"][memberIndexByFile[relative]] = member
                    : memberIndexByFile[relative] = data[key].push(member) - 1;
                break;
        }

        log(`Completed ${name}.`, Color.Green);
        if (onComplete) onComplete();
    });

const bundlerAfterRetrievingPrebuiltData = async () => {
    let prebuilt: any;
    if (fs.existsSync(dataFile.path)) {
        prebuilt = JSON.parse(fs.readFileSync(dataFile.path, "utf8"));
    }
    else {
        const url = "https://mitmedialab.github.io/PRG-Group-Map/artifacts/data.json";
        prebuilt = await (await fetch(url)).json();
    }

    for (const key in prebuilt) {
        key === "memberIndexByFile"
            ? Object.assign(memberIndexByFile, prebuilt[key] as any)
            : (data as any)[key] = prebuilt[key];
    }

    initialBundle();
}

let initialProcessCount = 0;

const initialExecute = async (file: string, index: number) => {
    executedFiles.push(file);
    const fileName = path.basename(file);

    log(`${clean ? "Begin executing" : "Skipping execution of"} ${fileName}`, Color.Cyan);

    if (!clean) return index == 0 ? bundlerAfterRetrievingPrebuiltData() : null;

    initialProcessCount++;
    process(file, fileName, () => {
        initialProcessCount--;
        if (initialProcessCount == 0) initialBundle();
    });
}

const executableFilesQuery = `${root}/{people,categories}/*.ts`;

const initialBundle = () => {
    write();

    if (!watch) return bundle(root);

    chokidar.watch(executableFilesQuery).on('all', (event, file) => {
        const fileName = path.basename(file);

        switch (event) {
            case "change":
                log(`Begin re-executing ${fileName}.`, Color.Cyan);
                process(file, fileName, write);
                return;
            case "add":
                if (executedFiles.includes(file)) return;
                log(`Executing new file: ${fileName}.`, Color.Cyan);
                process(file, fileName, write);
                executedFiles.push(fileName);
                return;
        }
    });

    chokidar.watch(`${root}/categories/themes/**/*.ts`).on('change', (path) => {
        log(`Change in ${path}`, Color.Cyan);
        log(`Begin re-executing ${theme.name}.`, Color.Cyan);
        process(theme.path, theme.name, () => flush(data));
    });

    bundle(root, true);
}

glob(executableFilesQuery, (err: Error | null, files: string[]) => {
    if (err) return error(`${err.name}: ${err.message} ${err.stack ?? ""}`);
    files.forEach(initialExecute);
});