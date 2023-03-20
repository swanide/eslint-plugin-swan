/**
 * @file template-name
 * @author mengke(kekee000@gmail.com)
 */

import {RuleTester, Rule} from 'eslint';
import rule from '../../../src/rules/template-name';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('template-name', rule as Rule.RuleModule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<template name="abc"></template>',
        },
        {
            filename: 'page.swan',
            code: '<template is="abc"></template>',
        },
        {
            filename: 'page.swan',
            code: '<template />',
        },
        {
            filename: 'page.swan',
            code: '<template is="{{abc}}"></template>',
        },
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<template name="a bc"></template>',
            errors: [
                {
                    message: 'template name 名称必须为字符串，并且符合 \'a-zA-Z0-9_-\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<template name="{{abc}}"></template>',
            errors: [
                {
                    message: 'template name 名称必须为字符串，并且符合 \'a-zA-Z0-9_-\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<template is="a bc"></template>',
            errors: [
                {
                    message: 'template is 需要符合 \'a-zA-Z0-9_-\'',
                    type: 'XAttribute',
                },
            ],
        },
        {
            filename: 'page.swan',
            code: '<template is="abc$"></template>',
            errors: [
                {
                    message: 'template is 需要符合 \'a-zA-Z0-9_-\'',
                    type: 'XAttribute',
                },
            ],
        },
    ],
});
