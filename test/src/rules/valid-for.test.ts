/**
 * @file valid-for.js
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-for';

const ruleTester = new RuleTester({
    parser: require.resolve('@swanide/swan-eslint-parser'),
});

ruleTester.run('valid-for', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view s-for="{{expr}}" s-for-item="item"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{[1,2,3]}}" s-for-index="idx" s-for-item="item"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-for="expr" s-for-index="idx" s-for-item="item"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-for="[1,2,3]" s-for-item="item" s-for-index="idx"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item,index in expr"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item,index in expr trackBy item.id"></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view s-for=""></view>',
            errors: [
                {
                    message: '\'s-for\' 值为非空表达式',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{}}"></view>',
            errors: [
                {
                    message: '\'s-for\' 值为非空表达式',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for-item="abc"></view>',
            errors: [
                {
                    message: '\'s-for-item\' 需要有匹配的 \'s-for\'',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for-index="abc"></view>',
            errors: [
                {
                    message: '\'s-for-index\' 需要有匹配的 \'s-for\'',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{1}}" s-for-item=""></view>',
            errors: [
                {
                    message: '\'s-for-item\' 值需要是合法变量',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{1}}" s-for-item="{{123}}"></view>',
            errors: [
                {
                    message: '\'s-for-item\' 值需要是合法变量',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item,index in expr" s-for-item="item" s-for-index="index"></view>',
            errors: [
                {
                    message: '\'s-for-item\' 和 \'s-for\' 重复定义',
                    type: 'XDirective',
                },
                {
                    message: '\'s-for-index\' 和 \'s-for\' 重复定义',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item in expr trackBy item.id" s-for-item="item" s-for-index="index"></view>',
            errors: [
                {
                    message: '\'s-for-item\' 和 \'s-for\' 重复定义',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
