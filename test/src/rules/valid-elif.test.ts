/**
 * @file valid-elif.js
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-elif';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('valid-elif', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr}}"></view><view s-elif="expr"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr || expr1}}"></view><view s-elif="{{expr || expr1}}"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr}}"></view><view s-else-if="expr"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr || expr1}}"></view><view s-else-if="{{expr || expr1}}"></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view s-if="1"></view><view s-elif></view>',
            errors: [
                {
                    message: '\'s-elif\' 值不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="1"></view><view s-elif=""></view>',
            errors: [
                {
                    message: '\'s-elif\' 值不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="1"></view><view s-else-if></view>',
            errors: [
                {
                    message: '\'s-else-if\' 值不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="1"></view><view s-else-if=""></view>',
            errors: [
                {
                    message: '\'s-else-if\' 值不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-elif="1"></view>',
            errors: [
                {
                    message: '\'s-elif\' 找不到匹配的 \'s-if\' 或者 \'s-elif\'',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-else-if="1"></view>',
            errors: [
                {
                    message: '\'s-else-if\' 找不到匹配的 \'s-if\' 或者 \'s-elif\'',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
