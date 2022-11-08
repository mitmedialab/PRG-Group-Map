import * as rollup from 'rollup';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import path from "path";

export const bundle = async (watch: boolean) => {
    const app = path.resolve(__dirname, "..");
    const src = path.join(app, 'src');
    const site = path.join(app, 'site');
    const entry = path.join(src, 'index.ts');

    const plugins = [
        typescript(),
        json(),
        commonjs(),
        nodeResolve(),
        terser()
    ];

    if (watch) {
        plugins.push(
            serve({
                contentBase: site,
                port: '8000'
            }),
            livereload({
                watch: site,
                clientUrl: process.env.CLIENT_URL,
                delay: 500
            })
        )
    }

    const options: rollup.RollupOptions = {
        input: entry,
        plugins,
        watch: false,
    }

    const bundled = await rollup.rollup(options);

    const file = path.join(site, 'js', 'bundle.js');
    const output: rollup.OutputOptions = { file, format: 'es', compact: true, sourcemap: 'inline' };

    await bundled.write(output);

    if (!watch) return;

    const watcher = rollup.watch({
        ...options,
        output: [output],
        watch: { include: [path.join(src, "**", "*"), path.join(site, "**", "*")] }
    });

    watcher.on('event', (event) => {
        console.log(event.code);
        if (event.code === "BUNDLE_END") event.result?.close();
    });
};

