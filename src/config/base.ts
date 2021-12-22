/**
 * @file base
 * @author mengke(kekee000@gmail.com)
 */
export const globals = {
    App: true,
    Page: true,
    Component: true,
    swan: true,
    getApp: true,
    getCurrentPages: true,
};

export default {
    overrides: [
        {
            files: ['*.swan'],
            plugins: ['eslint-plugin-swan'],
            parser: require.resolve('@baidu/swan-eslint-parser'),
            env: {
                'browser': true,
                'es6': true,
                'swan/globals': true,
            },
            rules: {
                'indent': 0,
                'no-multi-spaces': 0,
                'import/unambiguous': 0,
                'babel/new-cap': 0,
                'import/no-commonjs': 0,
                'max-len': 0,
                'spaced-comment': 0,
                'no-empty-character-class': 0,
                'no-redeclare': 0,
                'no-unused-vars': 0,
                'no-var': 0,
                'object-shorthand': 0,
                'prefer-template': 0,
                'prefer-destructuring': 0,
                'prefer-spread': 0,
                'prefer-arrow-callback': 0,
                'prefer-const': 0,
                'no-magic-numbers': 0,
                'eol-last': 0,

                // swan rules
                'swan/comment-directive': 2,
                'swan/no-parsing-error': 2,
                'swan/no-duplicate-attributes': 2,
                'swan/no-useless-mustache': 2,
                'swan/valid-for': [2, {ignoreDuplicateForItem: true}],
                'swan/valid-if': 2,
                'swan/valid-elif': 2,
                'swan/valid-else': 2,
                'swan/no-confusing-for-if': 2,
                'swan/html-end-tag': 2,
                'swan/valid-bind': 2,
            },
        },
    ],
    globals,
};