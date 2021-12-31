/**
 * @file xml-indent
 * @author mengke(kekee000@gmail.com)
 */

const {RuleTester} = require('eslint');
import rule from '../../../src/rules/xml-indent';

const ruleTester = new RuleTester({
    parser: require.resolve('@baidu/swan-eslint-parser'),
});

ruleTester.run('xml-indent', rule, {

    valid: [
        {
            filename: 'page.swan',
            code: '<view s-for="abc in list"></view>'
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="abc">var a = 1;</import-sjs>'
        },
        {
            filename: 'page.swan',
            code: '<filter module="abc">var a = 1;</filter>'
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<view>
  aaa
  bbb
  ccc
</view>`
        },
        {
            filename: 'page.swan',
            code: `<block>
  <view
    aaa />
</block>`
        },
        {
            filename: 'page.swan',
            code: `<block>
  <view
    s-if="ab"
  />
</block>`
        },
        {
            filename: 'page.swan',
            code: `<block>
  <view>abc
  </view>
</block>`
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block
  class="a"
>
  <view>abc
  </view>
</block>`
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block class="a"
>
  <view>abc
  </view>
</block>`
        }
    ],

    invalid: [
        {
            filename: 'page.swan',
            code: '<view>\n<text></text>\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.',
                    type: null
                }
            ],
            output: '<view>\n  <text></text>\n</view>'
        },
        {
            filename: 'page.swan',
            code: '<view>\n<text />\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.',
                    type: null
                }
            ],
            output: '<view>\n  <text />\n</view>'
        },
        {
            filename: 'page.swan',
            code: '<view style="color: #ccc" >\n    <text />\n</view>',
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 4 spaces.',
                    type: null
                }
            ],
            output: '<view style="color: #ccc" >\n  <text />\n</view>'
        },
        {
            filename: 'page.swan',
            code: '<view style="color: #ccc" >\n  <text />\n  </view>',
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 2 spaces.',
                    type: null
                }
            ],
            output: '<view style="color: #ccc" >\n  <text />\n</view>'
        },
        {
            filename: 'page.swan',
            code: '<import-sjs module="abc">\n var a = 1;\n</import-sjs>',
            options: [2, {baseIndent: 0}],
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 1 space.',
                    type: null
                }
            ],
            output: '<import-sjs module="abc">\nvar a = 1;\n</import-sjs>'
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block>
<view>aaa
  </view>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.',
                    type: null
                }
            ],
            output: `<!--{}-->
<block>
  <view>aaa
  </view>
</block>`
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block>
  <view>aaa
</view>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.',
                    type: null
                }
            ],
            output: `<!--{}-->
<block>
  <view>aaa
  </view>
</block>`
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block class="a"
  ></block>`,
            errors: [
                {
                    message: 'Expected indentation of 0 spaces but found 2 spaces.',
                    type: null
                }
            ],
            output: `<!--{}-->
<block class="a"
></block>`
        },
        {
            filename: 'page.swan',
            code: `<!--{}-->
<block
class="a"
>
</block>`,
            errors: [
                {
                    message: 'Expected indentation of 2 spaces but found 0 spaces.',
                    type: null
                }
            ],
            output: `<!--{}-->
<block
  class="a"
>
</block>`
        }
    ]
});
