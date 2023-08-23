/**
 * @file filter-name
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/filter-name';

const ruleTester = new RuleTester({
    parser: require.resolve('@swanide/swan-eslint-parser'),
});

ruleTester.run('filter-name', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<filter module="abc"></filter>',
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="abc"></import-sjs>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<filter></filter>',
            errors: [
                {
                    message: 'filter 需要设置 module 模块名，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XElement',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<import-sjs></import-sjs>',
            errors: [
                {
                    message: 'import-sjs 需要设置 module 模块名，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XElement',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<filter module="$abc"></filter>',
            errors: [
                {
                    message: 'filter module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<filter module="1abc"></filter>',
            errors: [
                {
                    message: 'filter module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<filter module="{{abc}}"></filter>',
            errors: [
                {
                    message: 'filter module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="$abc"></import-sjs>',
            errors: [
                {
                    message: 'import-sjs module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="1abc"></import-sjs>',
            errors: [
                {
                    message: 'import-sjs module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="{{abc}}"></import-sjs>',
            errors: [
                {
                    message: 'import-sjs module 模块名必须为字符串，并且符合 \'a-zA-Z0-9_\'',
                    type: 'XAttribute',
                },
            ],
        },
    ],
});
