import path from 'path';
import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import fs from 'fs';
import { Color, log } from './logInColor';

export const bundle = async (rootDir: string, watch: boolean = false) => {
    const app = path.join(rootDir, 'app');
    const site = path.join(app, 'site');
    const entry = path.join(app, 'index.ts');

    const appFiles: string[] = fs.readdirSync(app)
        .map(file => path.join(app, file))
        .filter(file => !file.startsWith("."))
        .filter(file => !fs.lstatSync(file).isDirectory());

    const plugins = [
        typescript({
            noEmitOnError: false,
        }),
        json(),
        commonjs(),
        nodeResolve(),
    ];

    if (watch) {
        plugins.push(
            serve({
                contentBase: site,
                port: '8000'
            }),
            livereload({
                watch: site,
                clientUrl: process.env.CLIENT_URL
            })
        )
    }

    const options: rollup.RollupOptions = {
        input: entry,
        plugins,
        watch: watch ? undefined : false,
    }

    const bundle = await rollup.rollup(options);

    const output: rollup.OutputOptions = {
        file: path.join(app, 'site', 'js', 'bundle.js'),
        format: 'es',
        compact: true,
        sourcemap: 'inline',
    }

    bundle.write(output);

    if (!watch) return;

    const watcher = rollup.watch({
        ...options,
        output: [output],
        watch: { include: appFiles, skipWrite: false, chokidar: { usePolling: true } }
    });

    watcher.on('event', (event) => {
        log(event.code, Color.Grey);
        if (event.code === "BUNDLE_END") event.result?.close();
    });
};