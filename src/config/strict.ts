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
                '@baidu/swan/xml-indent': [
                    2,
                    4,
                    {baseIndent: 1, scriptBaseIndent: 0, alignAttributesVertically: false},
                ],
                '@baidu/swan/valid-for': [2, {ignoreDuplicateForItem: false}],
                '@baidu/swan/valid-component-nesting': [1, {allowEmptyBlock: false, ignoreEmptyBlock: ['view']}],
                '@baidu/swan/no-multi-spaces': 1,
                '@baidu/swan/mustache-interpolation-spacing': [1, 'never'],

                // eslint-core
                '@baidu/swan/eqeqeq': 2,
                '@baidu/swan/func-call-spacing': 1,
            },
        },
    ],
};