import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import tslint from "rollup-plugin-tslint";
import { terser } from "rollup-plugin-terser";

const TERSER_OPTIONS = {
    toplevel: true,
    compress: {
        arguments: true,
        booleans_as_integers: true,
        ecma: 2015,
        passes: 10,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_symbols: true
    },
    mangle: {
        toplevel: true,
        eval: true
    }

};

export default {
    input: './src/index.ts',
    output: [
        {
            file: "./dist/game.min.js",
            format: "cjs",
            plugins: [
                terser(TERSER_OPTIONS)
            ]
        },
    ],
    plugins: [
        tslint({
            exclude: [
                "**/*.json",
                "**/*.js",
                "**/*.mjs",
            ]
        }),
        typescript(),
        resolve(),
        // terser()
    ]
}
