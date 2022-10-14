import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

export default {
    input: './app/index.ts',
    output: {
        file: './app/site/js/bundle.js',
        format: 'es',
        compact: true,
        sourcemap: 'inline',
    },
    plugins: [
        typescript(),
        json(),
        commonjs(),
        nodeResolve(),
        terser()
    ]
};