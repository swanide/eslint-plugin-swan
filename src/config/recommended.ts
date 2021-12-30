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
                '@baidu/swan/no-multi-spaces': 1,
                '@baidu/swan/valid-component-nesting': [1, {allowEmptyBlock: true, ignoreEmptyBlock: ['view']}],
                // eslint-core
                '@baidu/swan/arrow-spacing': 2,

                '@baidu/swan/dot-location': [2, 'property'],
                '@baidu/swan/array-bracket-spacing': 1,
                '@baidu/swan/dot-notation': 1,
                '@baidu/swan/key-spacing': 1,
                '@baidu/swan/keyword-spacing': 1,
                '@baidu/swan/no-useless-concat': 2,
            },
        },
    ],
};