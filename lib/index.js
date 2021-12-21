"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environments = exports.processors = exports.rules = exports.configs = void 0;
/**
 * @file index.ts
 * @author mengke01(kekee000@gmail.com)
 */
const fs_1 = require("fs");
const swan_1 = __importDefault(require("./processors/swan"));
const base_1 = __importDefault(require("./config/base"));
const recommended_1 = __importDefault(require("./config/recommended"));
const globals_1 = __importDefault(require("./globals"));
function requireIndex(baseDir) {
    const files = (0, fs_1.readdirSync)(baseDir);
    const requires = {};
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
exports.configs = {
    base: base_1.default,
    recommended: recommended_1.default,
};
exports.rules = requireIndex(`${__dirname}/rules`);
exports.processors = {
    '.swan': swan_1.default,
};
exports.environments = {
    globals: { globals: globals_1.default },
};
exports.default = {
    configs: exports.configs,
    rules: exports.rules,
    processors: exports.processors,
    environments: exports.environments,
};
