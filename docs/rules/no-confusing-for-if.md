# 检查 for,if 组件嵌套关系 (no-confusing-for-if)


## Rule Details

检查 for,if 组件嵌套关系，如果 if 指令组件依赖 for 指令中依赖的变量，则会导致组件渲染冲突。

组件嵌套正确的代码示例:

```xml
<view s-if="{{cond}}">
    <text s-for="{{list}}"></text>
</view>

<view s-if="{{cond}}" s-for="{{list}}">
    <text>{{item}}</text>
</view>
<view s-if="cond" s-for="list">
    <text>{{item}}</text>
</view>
```

错误的代码示例:

```xml
<view s-if="{{list}}" s-for="{{list}}">
    <text>{{item}}</text>
</view>

<view s-if="{{txt}}" s-for="{{list}}" s-for-item="txt">
    <text>{{txt}}</text>
</view>
```

## Options

无