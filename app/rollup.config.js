import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
    input: './app/index.ts',
    output: {
        dir: './app/build',
        format: 'es'
    },
    plugins: [
        typescript(),
        json(),
        commonjs(),
        nodeResolve(),
    ]
};