/**
 * @file recommended.js
 * @author mengke(kekee000@gmail.com)
 */
import base from './base';

const {rules: baseRules, ...baseOverwritesSwan} = base.overrides[0];

export default {
    ...base,
    overrides: [
        {
            ...baseOverwritesSwan,
            rules: {
                ...baseRules,
                'max-len': [1, 120],
                'swan/no-multi-spaces': 1,
                'swan/valid-component-nesting': [1, {allowEmptyBlock: true, ignoreEmptyBlock: ['view']}],
                'swan/mustache-interpolation-spacing': [1, 'never'],
                // eslint-core
                'swan/array-bracket-spacing': 2,
                'swan/arrow-spacing': 2,
                'swan/dot-location': [2, 'property'],
                'swan/dot-notation': 2,
                // 'swan/func-call-spacing': 2,
                'swan/key-spacing': 2,
                'swan/keyword-spacing': 2,
                'swan/no-useless-concat': 2,
            },
        },
    ],
};