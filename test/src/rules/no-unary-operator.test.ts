/**
 * @file no-unary-operator
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/no-unary-operator';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('swan/no-unary-operator', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view bindtap="{{tap}}"></view>',
        },
        {
            filename: 'page.swan',
            code: '<view>{{value}}</view>',
        },
        {
            filename: 'page.swan',
            code: '<view style="color:{{value}}"></view>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view bindtap="{{+tap}}"></view>',
            errors: [
                {
                    message: '在版本低于 3.230.0 的基础库上不支持一元表达式 \'+\'',
                    type: 'UnaryExpression',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view>{{[+value]}}</view>',
            errors: [
                {
                    message: '在版本低于 3.230.0 的基础库上不支持一元表达式 \'+\'',
                    type: 'UnaryExpression',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<view style="color:{{value || + value}}"></view>',
            errors: [
                {
                    message: '在版本低于 3.230.0 的基础库上不支持一元表达式 \'+\'',
                    type: 'UnaryExpression',
                },
            ],
        },
    ],
});
