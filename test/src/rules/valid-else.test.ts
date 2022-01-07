/**
 * @file valid-else.js
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-else';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('valid-else', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr}}"></view><view s-else></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr || expr1}}"></view><view s-else></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-elif="expr"></view><view s-else></view>',
        },
        {
            filename: 'page.swan',
            code: '</view><view s-else-if="expr || expr1"></view><view s-else></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view s-else></view>',
            errors: [
                {
                    message: '\'s-else\' 需要有匹配的 \'s-if\' 或者 \'s-elif\'',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="abc"></view><view s-else=""></view>',
            errors: [
                {
                    message: '\'s-else\' 不支持设置值',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="abc"></view><view s-elif="def" s-else></view>',
            errors: [
                {
                    message: '\'s-else\' 和 \'s-elif\' 不可以同时设置在标签上',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="abc"></view><view s-else-if="def" s-else></view>',
            errors: [
                {
                    message: '\'s-else\' 和 \'s-else-if\' 不可以同时设置在标签上',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
