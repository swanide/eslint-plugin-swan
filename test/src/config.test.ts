/**
 * @file lint
 * @author mengke(kekee000@gmail.com)
 */
import assert from 'assert';
import {ESLint} from 'eslint';
import * as eslintPluginsSwan from '../../index';

const baseConfig = eslintPluginsSwan.configs.base;
const recommendedConfig = eslintPluginsSwan.configs.recommended;

const testCode = `
<template data="{{item}}"></template>
<view bindtap="abc">
    <button class="btn" bindtap="btn1" type="primary" loading="{{loading}}" disabled="{{disabled}}">
        按钮
    </button>
    <icon s-if="abc" type="success" size="23" color="" />
</view>

<import-sjs module="foo">
var some_msg = "hello world";
module.exports = {
    msg: some_msg
}
</import-sjs>
<text class="class">{{foo.msg}}<view /></text>
`;

describe('lint', () => {
    it('lint base', async () => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig: baseConfig as any,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@baidu/eslint-plugin-swan': eslintPluginsSwan,
            },
            fix: false,
        });
        const [{messages} = {messages: []}] = await eslint.lintText(testCode,
            {
                filePath: 'page.swan',
                warnIgnored: false,
            });
        // console.log(messages);
        assert.strictEqual(messages.length, 0, 'has no errors');
    });

    it('lint recommended', async () => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig: recommendedConfig as any,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@baidu/eslint-plugin-swan': eslintPluginsSwan,
            },
            fix: false,
        });
        const [{messages} = {messages: []}] = await eslint.lintText(testCode,
            {
                filePath: 'page.swan',
                warnIgnored: false,
            });

        assert.ok(messages.length > 0, 'has lint errors');
    });


    it('lint base eslint-disabled', async () => {
        const eslint = new ESLint({
            cwd: '/tmp',
            baseConfig: baseConfig as any,
            resolvePluginsRelativeTo: __dirname,
            plugins: {
                '@baidu/eslint-plugin-swan': eslintPluginsSwan,
            },
            fix: false,
        });
        const [{messages} = {messages: []}] = await eslint.lintText(`<!-- eslint-disable -->\n${testCode}`,
            {
                filePath: 'page.swan',
                warnIgnored: false,
            });

        assert.strictEqual(messages.length, 0, 'has no errors');
    });
});
