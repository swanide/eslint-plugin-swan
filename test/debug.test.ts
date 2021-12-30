/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports */

/**
 * @file lint
 * @author mengke(kekee000@gmail.com)
 */
import assert from 'assert';
import {Linter} from 'eslint';

const ruleName = 'array-bracket-spacing';

function lint() {
    const code = `
<block s-for="{{content.items}}" s-for-index="eleIndex">
</block>

<block s-for="{{[1,2,3]}}" s-for-index="eleIndex">
</block>
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
    console.log(messages);
    assert(messages.length === 0, 'should have no errors');
}

describe('debug', () => {
    it('test-rule', () => {
        lint();
    });

});