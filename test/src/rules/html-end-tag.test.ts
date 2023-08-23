/**
 * @file html-end-tag
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/html-end-tag';

const ruleTester = new RuleTester({
    parser: require.resolve('@swanide/swan-eslint-parser'),
});

ruleTester.run('html-end-tag', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view></view>',
        },
        {
            filename: 'page.swan',
            code: '<view>{{value}}</view>',
        },
        {
            filename: 'page.swan',
            code: '<view />',
        },
        {
            filename: 'page.swan',
            code: '<view>\n\n</view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view>',
            errors: [
                {
                    message: '\'<view>\' 没有结束标签',
                    type: 'XStartTag',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view>{{[+value]}}',
            errors: [
                {
                    message: '\'<view>\' 没有结束标签',
                    type: 'XStartTag',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view></viewa>',
            errors: [
                {
                    message: '\'<view>\' 没有结束标签',
                    type: 'XStartTag',
                },
            ],
        },
    ],
});
