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
                'max-len': [1, 120],
                '@baidu/swan/no-multi-spaces': 2,
                '@baidu/swan/mustache-interpolation-spacing': [2, 'never'],

                // eslint-core
                '@baidu/swan/eqeqeq': 2,
                '@baidu/swan/func-call-spacing': 1,
            },
        },
    ],
};