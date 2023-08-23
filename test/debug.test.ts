/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

/**
 * @file lint
 * @author mengke(kekee000@gmail.com)
 */
import assert from 'assert';
import {Linter} from 'eslint';

const ruleName = 'xml-indent';

function lint() {
    const code = `
<view
    hover-class="{{
        status === 0
    }}">
</view>
`;
    const config = {
        parser: '@swanide/swan-eslint-parser',
        rules: {
            [ruleName]: 'error',
        },
    };
    const linter = new Linter();
    linter.defineParser('@swanide/swan-eslint-parser', require('@swanide/swan-eslint-parser'));
    linter.defineRule(ruleName, require(`../src/rules/${ruleName}`).default);
    const messages = linter.verify(code, config as any, `${__dirname}/index.swan`);
    console.log(messages);
    assert(messages.length === 0, 'should have no errors');
}

describe('debug', () => {
    it('test-rule', () => {
        lint();
    });

});