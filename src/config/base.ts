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
            plugins: ['@baidu/eslint-plugin-swan'],
            parser: require.resolve('@baidu/swan-eslint-parser'),
            env: {
                'browser': true,
                'es6': true,
                '@baidu/swan/globals': true,
            },
            rules: {
                'indent': 0,
                'no-multi-spaces': 0,
                'import/unambiguous': 0,
                'babel/new-cap': 0,
                '@babel/new-cap': 0,
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
                '@baidu/swan/comment-directive': 2,
                '@baidu/swan/no-parsing-error': 2,
                '@baidu/swan/no-duplicate-attributes': 2,
                '@baidu/swan/no-useless-mustache': 2,
                '@baidu/swan/no-unary-operator': 2,
                '@baidu/swan/valid-for': [2, {ignoreDuplicateForItem: true}],
                '@baidu/swan/valid-if': 2,
                '@baidu/swan/valid-elif': 2,
                '@baidu/swan/valid-else': 2,
                '@baidu/swan/no-confusing-for-if': 2,
                '@baidu/swan/html-end-tag': 2,
                '@baidu/swan/valid-bind': 2,
                '@baidu/swan/template-name': 2,
                '@baidu/swan/filter-name': 2,
            },
        },
    ],
    globals,
};