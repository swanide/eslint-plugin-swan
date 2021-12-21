# 检查 `else` 指令 (valid-else)

检查 `s-else` 指令

## Rule Details

检查 `s-else` 是否有匹配的 `s-if` 或者 `s-elif` 指令。

正确的代码示例:

```xml
<view s-if="{{a}}"></view>
<view s-else></view>


<view s-if="{{b}}"></view>
<view s-elif="{{c}}"></view>
<view s-else></view>
```

错误的代码示例:

```xml
<!-- no previous if/elif matched -->
<view></view>
<view s-else></view>

<!-- has value -->
<view s-else="{{}}"></view>
<view s-else=""></view>

```

## Options

无
