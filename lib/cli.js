"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
/**
 * @file swan eslint plugin cli
 * @author mengke01(kekee000@gmail.com)
 */
const child_process_1 = require("child_process");
const tryLoadEslint = () => {
    let globalNpmModule = '';
    let globalYarnModule = '';
    try {
        globalNpmModule = (0, child_process_1.execSync)('npm config get prefix -g', {
            encoding: 'utf8',
        }).trim();
    }
    catch (e) {
    }
    try {
        globalYarnModule = (0, child_process_1.execSync)('npm config get prefix -g', {
            encoding: 'utf8',
        }).trim();
    }
    catch (e) {
    }
    let eslintModulePath = '';
    try {
        eslintModulePath = require.resolve('eslint', {
            paths: [
                process.cwd(),
                `${globalNpmModule}/lib`,
                globalYarnModule,
            ].filter(p => p.length),
        });
    }
    catch (e) {
    }
    if (!eslintModulePath) {
        throw new Error('no local or global eslint installed!');
    }
    const module = require(eslintModulePath);
    return (module.default || module).ESLint;
};
async function main(pattern) {
    const ESLint = tryLoadEslint();
    const eslint = new ESLint({
        useEslintrc: false,
        baseConfig: require('./config/recommended'),
        extensions: ['.swan'],
        plugins: {
            'eslint-plugin-swan': require('./index'),
        },
    });
    const results = await eslint.lintFiles(pattern);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
}
main(process.argv[2] || process.cwd());
