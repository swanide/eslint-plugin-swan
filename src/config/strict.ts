/**
 * @file strict.js
 * @author mengke(kekee000@gmail.com)
 */
import recommended from './recommended';

const {rules: recommendedRules, ...recommendedOverwritesSwan} = recommended.overrides[0];

export default {
    ...recommended,
    overrides: [
        {
            ...recommendedOverwritesSwan,
            rules: {
                ...recommendedRules,
                'max-len': [2, 200],
                '@swanide/swan/xml-indent': [
                    2,
                    4,
                    {baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false},
                ],
                '@swanide/swan/valid-for': [2, {ignoreDuplicateForItem: false}],
                '@swanide/swan/valid-component-nesting': [1, {allowEmptyBlock: false, ignoreEmptyBlock: ['view']}],
                '@swanide/swan/no-multi-spaces': 1,
                '@swanide/swan/mustache-interpolation-spacing': [1, 'never'],

                // eslint-core
                '@swanide/swan/eqeqeq': 2,
                '@swanide/swan/func-call-spacing': 1,
            },
        },
    ],
};