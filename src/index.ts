/**
 * @file index.ts
 * @author mengke01(kekee000@gmail.com)
 */
import {readdirSync} from 'fs';
import swanParser from './processors/swan';
import base from './config/base';
import recommended from './config/recommended';
import globals from './globals';

function requireIndex(baseDir: string) {
    const files = readdirSync(baseDir);
    const requires: Record<string, unknown> = {};
    for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.ts')) {
            const moduleName = file.replace(/\.\w+$/, '');
            // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
            const module = require(`${baseDir}/${file}`);
            requires[moduleName] = module.default || module;
        }
    }
    return requires;
}

export const configs = {
    base,
    recommended,
};

export const rules = requireIndex(`${__dirname}/rules`);
export const processors = {
    '.swan': swanParser,
};

export const environments = {
    globals: {globals},
};

export default {
    configs,
    rules,
    processors,
    environments,
};