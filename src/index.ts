/**
 * @file index.ts
 * @author mengke01(kekee000@gmail.com)
 */
import swanParser from './processors/swan';
import base, {globals} from './config/base';
import recommended from './config/recommended';
import strict from './config/strict';
export {default as rules} from './rules';

export const configs = {
    base,
    recommended,
    strict,
};

export const processors = {
    '.swan': swanParser,
};

export const environments = {
    globals: {globals},
};
