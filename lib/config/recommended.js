"use strict";
/**
 * @file recommended.js
 * @author mengke(kekee000@gmail.com)
 */
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    extends: require.resolve('./base'),
    overrides: [
        {
            files: ['*.swan'],
            rules: {
                'max-len': [1, 120],
                'swan/no-multi-spaces': 1,
                'swan/valid-component-nesting': [1, { allowEmptyBlock: true, ignoreEmptyBlock: ['view'] }],
                // eslint-core
                'swan/array-bracket-spacing': 2,
                'swan/arrow-spacing': 2,
                'swan/dot-location': [2, 'property'],
                'swan/dot-notation': 2,
                'swan/func-call-spacing': 2,
                'swan/key-spacing': 2,
                'swan/keyword-spacing': 2,
                'swan/no-useless-concat': 2,
            },
        },
    ],
};
exports.default = module.exports;
