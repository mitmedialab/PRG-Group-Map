import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import path from "path";

export const bundle = async (watch: boolean) => {
    const app = path.resolve(__dirname, "..");
    const src = path.join(app, 'src');
    const entry = path.join(app, 'src', 'index.ts');

    const plugins = [
        typescript(),
        json(),
        commonjs(),
        nodeResolve(),
        terser()
    ];

    const options: rollup.RollupOptions = {
        input: entry,
        plugins,
        watch: false,
    }

    const bundled = await rollup.rollup(options);

    const file = path.join(app, 'site', 'js', 'bundle.js');
    const output: rollup.OutputOptions = { file, format: 'es', compact: true, sourcemap: 'inline' };

    bundled.write(output);

    const watcher = rollup.watch({
        ...options,
        output: [output],
        watch: { include: path.join(src, "**", "*") }
    });

    watcher.on('event', (event) => {
        console.log(event.code);
        if (event.code === "BUNDLE_END") event.result?.close();
    });
};

