/**
 * @file no-parsing-error
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/no-parsing-error';

const ruleTester = new RuleTester({
    parser: require.resolve('@swanide/swan-eslint-parser'),
});

ruleTester.run('no-parsing-error', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view></view>',
        },
        {
            filename: 'page.swan',
            code: '<view s-if="list">{{value}}</view>',
        },
        {
            filename: 'page.swan',
            code: '<view />',
        },
        {
            filename: 'page.swan',
            code: '<view style="border: {{border\n||\nborder1}}">\n\n</view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view>{{a bc}}}</view>',
            errors: [
                {
                    message: 'Parsing error: Unexpected token bc.',
                    type: 'XDocument',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-if="a bc"></view>',
            errors: [
                {
                    message: 'Parsing error: Unexpected token bc.',
                    type: 'XDocument',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view>{{abc}}}</view>',
            errors: [
                {
                    message: 'Parsing error: Unexpected token }.',
                    type: 'XDocument',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view s-></view>',
            errors: [
                {
                    message: 'Parsing error: 错误的指令名称.',
                    type: 'XDocument',
                },
            ],
        },
    ],
});
