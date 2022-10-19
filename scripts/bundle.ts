import path from 'path';
import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import fs from 'fs';

export const bundle = async (rootDir: string, watch: boolean = false) => {
    const app = path.join(rootDir, 'app');
    const entry = path.join(app, 'index.ts');

    const appFiles: string[] = fs.readdirSync(app)
        .map(file => path.join(app, file))
        .filter(file => !file.startsWith("."))
        .filter(file => !fs.lstatSync(file).isDirectory());

    const plugins = [
        typescript(),
        json(),
        commonjs(),
        nodeResolve(),
        terser(),
    ];

    if (watch) {
        plugins.push(
            serve({
                contentBase: './app/site/',
                port: '8000'
            }),
            livereload()
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

    return watch ? rollup.watch({
        ...options,
        output: [output],
        watch: { include: appFiles }
    }) : undefined;
};