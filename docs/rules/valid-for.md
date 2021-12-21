# 检查 `for` 指令 (valid-for)

检查 `s-for` 指令

## Rule Details

检查 `s-for` 是否合法。

正确的代码示例:

```xml
<view s-for="list" s-for-index="id"</view>
<view s-for="{{list}}" s-for-item="id"</view>

<view s-for="{{list trackBy item.id}}">
    <text>{{item.id}}</text>
</view>

<view s-for="{{list}}" s-for-item="item" s-for-index="index">
    <text>{{index}}. {{item.id}}</text>
</view>
```

错误的代码示例:

```xml
<!-- no 'key' directive -->
<view s-for="{{list}}"></view>

<!-- 'for-item' should be literal -->
<view s-for="{{list}}" s-for-item="{{item}}"></view>

<!-- 'for-index' should be literal -->
<view s-for="{{list}}" s-for-index="{{index}}"></view>

<!-- 'key' should be literal -->
<view s-for="{{list}}"  s-for-item="item"></view>
```

## Options

```javascript
[
    {
        type: 'object',
        properties: {
            withKey: {
                type: 'boolean'
            },
            withItem: {
                type: 'boolean'
            }
        }
    }
]
```

### withKey

是否检查 `for-key` 指令，默认为 true， 必须定义 `for-key` 指令
