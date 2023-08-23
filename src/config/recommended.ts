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
                'max-len': [1, 200],
                '@swanide/swan/xml-indent': [
                    1,
                    4,
                    {baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false},
                ],
                '@swanide/swan/no-multi-spaces': 1,
                '@swanide/swan/valid-component-nesting': [1, {allowEmptyBlock: true, ignoreEmptyBlock: ['view']}],
                // eslint-core
                '@swanide/swan/arrow-spacing': 2,

                '@swanide/swan/dot-location': [2, 'property'],
                '@swanide/swan/array-bracket-spacing': 1,
                '@swanide/swan/dot-notation': 1,
                '@swanide/swan/key-spacing': 1,
                '@swanide/swan/keyword-spacing': 1,
                '@swanide/swan/no-useless-concat': 2,
            },
        },
    ],
};