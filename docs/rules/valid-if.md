# 检查 `if` 指令 (valid-if)

检查 `s-if` 指令

## Rule Details

检查 `s-if` 是否合法。

正确的代码示例:

```xml
<view s-if="a"></view>
<view s-if="{{a}}"></view>
<view s-else></view>
```

错误的代码示例:

```xml
<!-- empty value expression -->
<view s-if=""></view>
<view s-if="{{}}"></view>

<!-- 'if' shouldn't use with 'else' -->
<view s-if="{{a}}" s-else></view>

<!-- 'if' shouldn't use with 'elif' -->
<view s-if="{{a}}" s-elif="{{b}}"></view>
```

## Options

无
