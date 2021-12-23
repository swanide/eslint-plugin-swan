/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

/**
 * @file lint
 * @author mengke(kekee000@gmail.com)
 */
import assert from 'assert';
import {Linter} from 'eslint';

const ruleName = 'valid-bind';

function lint() {
    const code = `
<view class="modal-item" catchtap="delete">删除</view>

`;
    const config = {
        parser: '@baidu/swan-eslint-parser',
        rules: {
            [ruleName]: 'error',
        },
    };
    const linter = new Linter();
    linter.defineParser('@baidu/swan-eslint-parser', require('@baidu/swan-eslint-parser'));
    linter.defineRule(ruleName, require(`../src/rules/${ruleName}`).default);

    const messages = linter.verify(code, config as any, `${__dirname}/index.swan`);
    assert(messages.length === 0, 'should have no errors');
}

describe('debug', () => {
    it('test-rule', () => {
        lint();
    });

});