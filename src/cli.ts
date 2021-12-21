/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
/**
 * @file swan eslint plugin cli
 * @author mengke01(kekee000@gmail.com)
 */
import {execSync} from 'child_process';
import type {ESLint} from 'eslint';

const tryLoadEslint = () => {
    let globalNpmModule = '';
    let globalYarnModule = '';

    try {
        globalNpmModule = execSync('npm config get prefix -g', {
            encoding: 'utf8',
        }).trim();
    }
    catch (e) {
    }

    try {
        globalYarnModule = execSync('npm config get prefix -g', {
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

async function main(pattern: string) {
    const ESLint = tryLoadEslint();
    const eslint = new ESLint({
        useEslintrc: false,
        baseConfig: require('./config/recommended'),
        extensions: ['.swan'],
        plugins: {
            'eslint-plugin-swan': require('../'),
        },
    }) as ESLint;
    const results = await eslint.lintFiles(pattern);
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
}

main(process.argv[2] || process.cwd());