# 检查 `elif` 指令 (valid-elif)

检查 `s-elif` 指令

## Rule Details

检查 `s-elif` 是否有匹配的 `s-if` 或者 `s-elif` 指令。

正确的代码示例:

```xml
<view s-if="{{a}}"></view>
<view s-elif="b"></view>
<view s-elif="{{b}}"></view>
<view s-elif="{{c}}"></view>
<view s-else></view>
```

错误的代码示例:

```xml
<!-- no previous if/elif matched -->
<view></view>
<view s-elif="{{b}}"></view>

<!-- no value -->
<view s-if="{{a}}"></view>
<view s-elif=""></view>


<!-- empty expression -->
<view s-if="{{a}}"></view>
<view s-elif="{{}}"></view>
```

## Options

无
