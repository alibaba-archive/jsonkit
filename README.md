JSONKit v0.1.0 [![Build Status](https://travis-ci.org/teambition/jsonkit.png?branch=master)](https://travis-ci.org/teambition/jsonkit)
====
Tool set for JSON object.

## Install

**Node.js:**

    npm install jsonkit

**bower:**

    bower install jsonkit

**Browser:**

    <script src="/pathTo/jsonkit.js"></script>

## API


### JSONKit.each(obj, iterator[, context, arrayLike, right])

迭代器，对数组或者对象的键值进行迭代。

+ **obj:** Array 或 Object
+ **iterator:** Function，function (value, key, obj) {}
+ **context:** Object, 绑定至 iterator 的 this 值
+ **arrayLike:** Boolean, 为 true 时按数组迭代，为 false 则按对象迭代，否则自动判断
+ **right:** Boolean, 如果是按数组迭代，这里指定是否反向迭代

### JSONKit.union(obj[, obj1, obj2, ...])

深度并集复制，用于数据深克隆，将 obj1、obj2、...objx 的属性深度复制到 obj，对于同名属性，后者覆盖前者，返回 obj。

+ **obj:** Array 或 Object，当 objx 类型与 obj 不一致时，自动忽略。当只有一个参数 obj 时，则对 obj 进行深度复制，返回新的复制对象

### JSONKit.intersect(obj, obj1[, obj2, ...])

深度交集复制，用于数据深过滤，将 obj1、obj2、...objx 共同具有的且类型相同的属性值深度复制到 obj，后者覆盖前者，返回 obj。

+ **obj:** Array 或 Object，当 objx 类型与 obj 不一致时抛出错误。

### JSONKit.removeItem(list, item, arrayLike)

删除 list 中的所有 item，直接修改 list 自身，返回已删除 item 的数量。

+ **list:** Array 或 Object
+ **item:** Any
+ **arrayLike:** Boolean, 为 true 时按数组迭代，为 false 则按对象迭代，否则自动判断

### JSONKit.uniqueArray(array)

删除 array 中的重复值，仅对原始类型有效，直接修改 array 自身，返回 array。

+ **array:** Array

### JSONKit.setMaxDepth(depth)

设置 union 或 intersect 中允许的对象最大深度，超过时将抛出错误，用于防止对象循环自引用，默认为 20，最小为 5，最大为 1000。

+ **depth:** Number

