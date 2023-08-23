/**
 * @file valid-bind
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-bind';

const ruleTester = new RuleTester({
    parser: require.resolve('@swanide/swan-eslint-parser'),
});

ruleTester.run('valid-bind', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view bindtap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view bind:tap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view onTap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view catchtap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view capture-bindtap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view capture-catchtap="tap"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view bindtap="tap"></view><view bindtap="{{tap}}"></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view bindtap=""></view>',
            errors: [
                {
                    message: '\'bindtap\' 值设置不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view bind:tap="{{}}"></view>',
            errors: [
                {
                    message: '\'bind:tap\' 值设置不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view catchtap="{{}}"></view>',
            errors: [
                {
                    message: '\'catchtap\' 值设置不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view capture-bind:tap=""></view>',
            errors: [
                {
                    message: '\'capture-bind:tap\' 值设置不正确',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view capture-catch:tap="{{}}"></view>',
            errors: [
                {
                    message: '\'capture-catch:tap\' 值设置不正确',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
