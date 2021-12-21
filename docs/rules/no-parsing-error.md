# 检查是否存在解析错误 (no-parsing-error)


## Rule Details

检查是否存在解析错误，不允许出现 xml 解析错误。

正确的代码示例:

```xml
<view class="{{myClass}}"></view>
```

错误的代码示例:

```xml
<view class="{{myClass}}"></view>

<view class="
{{myClass}}"></view>

<view class="{{
    myClass}}"></view>

<view class="{{myClass}}"></ view>

<view class="{{myClass"></view>

<view>{{abc</view>

```

## Options

可以启用或者禁用某个解析错误报错，例如:

```javascript
{
    'no-parsing-error': [
        2,
        {
            'abrupt-closing-of-empty-comment': false
        }
    ]
}
```


已知的解析错误选项如下：

- abrupt-closing-of-empty-comment
- control-character-in-input-stream
- eof-before-tag-name
- eof-in-comment
- eof-in-tag
- incorrectly-closed-comment
- incorrectly-opened-comment
- invalid-first-character-of-tag-name
- missing-attribute-value
- missing-end-tag-name
- missing-whitespace-between-attributes
- nested-comment
- noncharacter-in-input-stream
- surrogate-in-input-stream
- unexpected-character-in-attribute-name
- unexpected-character-in-unquoted-attribute-value
- unexpected-equals-sign-before-attribute-name
- unexpected-null-character
- unexpected-question-mark-instead-of-tag-name
- unexpected-solidus-in-tag
- end-tag-with-attributes
- duplicate-attribute
- non-void-html-element-start-tag-with-trailing-solidus
- attribute-value-invalid-unquoted
- unexpected-line-break
- missing-expression-end-tag
- missing-end-tag
- x-invalid-end-tag
- x-invalid-directive
- x-expression-error