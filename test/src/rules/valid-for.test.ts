/**
 * @file valid-for.js
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-for';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('swan/valid-for', rule as Rule.RuleModule, {

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
                    message: '\'s-for\' value should be expression.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{}}"></view>',
            errors: [
                {
                    message: '\'s-for\' value should be expression.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for-item="abc"></view>',
            errors: [
                {
                    message: '\'s-for-item\' should has \'s-for\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for-index="abc"></view>',
            errors: [
                {
                    message: '\'s-for-index\' should has \'s-for\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{1}}" s-for-item=""></view>',
            errors: [
                {
                    message: '\'s-for-item\' value should be literal text.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="{{1}}" s-for-item="{{123}}"></view>',
            errors: [
                {
                    message: '\'s-for-item\' value should be literal text.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item,index in expr" s-for-item="item" s-for-index="index"></view>',
            errors: [
                {
                    message: '\'s-for-item\' duplicate with \'s-for\'.',
                    type: 'XDirective',
                },
                {
                    message: '\'s-for-index\' duplicate with \'s-for\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-for="item in expr trackBy item.id" s-for-item="item" s-for-index="index"></view>',
            errors: [
                {
                    message: '\'s-for-item\' duplicate with \'s-for\'.',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
