/**
 * @file valid-if.js
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-if';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('valid-if', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr}}"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{expr || expr1}}"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view if="expr"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="expr || expr1"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="{{[1,\n2,\n3]}}"></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view s-if="abc" s-else></view>',
            errors: [
                {
                    message: '\'s-if\' 和 \'s-else\' 不可以设置在同一个标签上',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="abc" s-elif="def"></view>',
            errors: [
                {
                    message: '\'s-if\' 和 \'s-elif\' 不可以设置在同一个标签上',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="abc" s-else-if="def"></view>',
            errors: [
                {
                    message: '\'s-if\' 和 \'s-else-if\' 不可以设置在同一个标签上',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if=""></view>',
            errors: [
                {
                    message: '\'s-if\' 值为非空表达式',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="  "></view>',
            errors: [
                {
                    message: '\'s-if\' 值为非空表达式',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
