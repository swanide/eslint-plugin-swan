/**
 * @file valid-bind
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/valid-bind';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('swan/valid-bind', rule as Rule.RuleModule, {

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
                    message: '\'bindtap\' value should be \'literal\' or \'mustache\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view bind:tap="{{}}"></view>',
            errors: [
                {
                    message: '\'bind:tap\' value should be \'literal\' or \'mustache\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view catchtap="{{}}"></view>',
            errors: [
                {
                    message: '\'catchtap\' value should be \'literal\' or \'mustache\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view capture-bind:tap=""></view>',
            errors: [
                {
                    message: '\'capture-bind:tap\' value should be \'literal\' or \'mustache\'.',
                    type: 'XDirective',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view capture-catch:tap="{{}}"></view>',
            errors: [
                {
                    message: '\'capture-catch:tap\' value should be \'literal\' or \'mustache\'.',
                    type: 'XDirective',
                },
            ],
        },
    ],
});
