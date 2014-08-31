JSONKit v0.3.2 [![Build Status](https://travis-ci.org/teambition/jsonkit.png?branch=master)](https://travis-ci.org/teambition/jsonkit)
====
Tool set for JSON object.

## Install

**Node.js:**

```sh
npm install jsonkit
```

**bower:**

```sh
bower install jsonkit
```

**Browser:**

```.html
<script src="/pathTo/jsonkit.js"></script>
```

## API


### JSONKit.each(obj, iterator[, context, arrayLike, right])

迭代器，对数组或者对象的键值进行迭代。

+ **obj:** `Array` 或 `Object`
+ **iterator:** `Function`，function (value, key, obj) {}
+ **context:** `Object`, 绑定至 `iterator` 的 `this` 值
+ **arrayLike:** Boolean, 为 `true` 时按数组迭代，为 `false` 则按对象迭代，否则自动判断
+ **right:** `Boolean`, 如果是按数组迭代，这里指定是否反向迭代

```js
JSONKit.each([1, 2, 3, 4, 5], function (value, index, list) {
  console.log('each', value, index, list);
});

JSONKit.each({a: 1, b: 2, c: 3}, function (value, index, list) {
  console.log('each', value, index, list);
});
```

### JSONKit.extend(obj[, obj1, obj2, ...])

属性复制，将 obj1、obj2、...objx 的属性复制到 obj，对于同名属性，后者覆盖前者，返回 obj。

```js
var obj = {a: 3, b: 4, c: 5};
console.log('extend', JSONKit.extend(obj, {a: 0, d: []}, {e: 6}));
```

### JSONKit.union(obj[, obj1, obj2, ...])

深度并集复制，用于数据深克隆，将 obj1、obj2、...objx 的属性深度复制到 obj，对于同名属性，后者覆盖前者，返回 obj。**当只有一个参数 obj 时，则对 obj 进行深度复制，返回新的复制对象**。

+ **obj:** `Array` 或 `Object`，当 objx 类型与 obj 不一致时，自动忽略。

```js
var d = [1, 2, {a: 3, b: 4, c: 5}];
console.log('union', JSONKit.union(d));
console.log('union', JSONKit.union(d, [0, 0, {a: 0}]));
```

### JSONKit.intersect(obj, obj1[, obj2, ...])

深度交集复制，用于数据深过滤，将 obj1、obj2、...objx 共同具有的且类型相同的属性值深度复制到 obj，后者覆盖前者，返回 obj。

+ **obj:** `Array` 或 `Object`，当 objx 类型与 obj 不一致时抛出错误。

```js
var e = [0, '', {a: 0, b: false, c: null}];
console.log('intersect', JSONKit.intersect(e, [9, 9, {a: 9, c: {}}]));
```

**情况1: 当 obj 中属性／子属性值为空对象或空数组时，表示接受任意对象或任意数组：**

```js
e = {a: {}, b: []};
console.log('intersect', JSONKit.intersect(e, {a: {a: 1, b:2, c: [1, 2]}, b: [1, 2, {a: 3}]}));
```

**情况2: 当 obj 中属性／子属性值为数组且长度为 1 时，表示接受任意长度的数组，但数组值必须为指定类型，不合法数据自动忽略：**

```js
e = {a: [0]};
console.log('intersect', JSONKit.intersect(e, {a: [1, 2, '3', 4]}));
```

**情况3: 当 obj 中属性／子属性值为数组且长度大于 1 时，表示接受定长的数组，但数组值类型必须与对应位置的类型一致，不合法数据被赋值为 `null`：**

```js
e = {a: [0, 0, 0, 0, 0]};
console.log('intersect', JSONKit.intersect(e, {a: [1, 2, '3', 4]}));
```

**情况4: 当 obj 中属性／子属性值为 `null` 时，表示接受任意类型的数据：**

```js
e = {a: null};
console.log('intersect', JSONKit.intersect(e, {a: {a: 1, b:2, c: [1, 2]}}));
```

### JSONKit.isEqual(a, b[, depth])

对 a, b 进行深度对比，判断他们是否相等，返回 `Boolean` 值。

+ **a:** Any
+ **b:** Any
+ **depth:** 可选，指定比较的最大深度，超过时将抛出错误，默认为 `20` 或 `setMaxDepth` 的设置值。

```js
var a = {a: 1, b: 2, c: 3, d: [1, 2, 3], e: null};
var b = {a: 1, b: 2, c: 3, d: [1, 2, 3], e: null};
console.log('isEqual', JSONKit.isEqual(a, b));
```

### JSONKit.isEmpty(obj)

判断对象是否为空，返回 `Boolean` 值，对于非对象，返回 `true`。

+ **obj:** Any

```js
console.log('isEmpty', JSONKit.isEmpty([]));
console.log('isEmpty', JSONKit.isEmpty({}));
```

### JSONKit.isArray(obj)

判断是否为数组，返回 `Boolean` 值。

+ **obj:** Any

```js
console.log('isArray', JSONKit.isArray([]));
console.log('isArray', JSONKit.isArray({}));
```

### JSONKit.isObject(obj)

判断是否为纯对象，返回 `Boolean` 值。

+ **obj:** Any

```js
console.log('isObject', JSONKit.isObject({}));
console.log('isObject', JSONKit.isObject([]));
console.log('isObject', JSONKit.isObject(new Date()));
```

### JSONKit.removeItem(list, item, arrayLike)

删除 list 中的所有 item，直接修改 list 自身，返回已删除 item 的数量。

+ **list:** `Array` 或 `Object`
+ **item:** Any, 当 item 为函数时，会调用该函数

    ```js
    item(value, index)
    ```

    如果其返回值为 `true`，则删除 list 中的对应值。

+ **arrayLike:** `Boolean`, 为 `true` 时按数组迭代，为 `false `则按对象迭代，否则自动判断

```js
var a = [1, 2, 3, null, null];
console.log('removeItem', JSONKit.removeItem(a, null), a);

var b = {a: 1, b: 2, c: 3, d: null, e: null};
console.log('removeItem', JSONKit.removeItem(b, null), b);
```

### JSONKit.findItem(list, fn, arrayLike)

从 list 中找出目标值。

+ **list:** `Array` 或 `Object`
+ **fn:** 断言函数，该函数有三个参数：list 子元素的值、键和 list 自身，如果 fn 返回 `true`，则为找到目标值，立即返回目标值，不再往后迭代。
+ **arrayLike:** `Boolean`, 为 `true` 时按数组迭代，为 `false` 则按对象迭代，否则自动判断

```js
a = [1, 1, 2, 3, '1', null, null];
JSONKit.findItem(a, function (x, i) {
  return typeof v === 'string';
}); // '1'
```

### JSONKit.uniqueArray(array)

删除 array 中的重复值，仅对原始类型有效，直接修改 array 自身，返回 array。

+ **array:** `Array`

```js
var c = [1, 2, 3, 4, 3, 2];
console.log('uniqueArray', JSONKit.uniqueArray(c), c);
```

### JSONKit.parseJSON(string)

解析 JSON 字符串 string，返回解析值，如果 string 不是标准 JSON，不可解析，则返回 `undefined`。

+ **string:** `String`

### JSONKit.toStr(any)

```js
console.log('JSONKit.toStr(null)', JSONKit.toStr(null)); // ''
console.log('JSONKit.toStr(undefined)', JSONKit.toStr(undefined)); // ''
console.log('JSONKit.toStr(0)', JSONKit.toStr(0)); // '0'
console.log('JSONKit.toStr(NaN)', JSONKit.toStr(NaN)); // 'NaN'
console.log('JSONKit.toStr(true)', JSONKit.toStr(true)); // 'true'
```

### JSONKit.toNum(any)

解析 JSON 字符串 string，返回解析值，如果 string 不是标准 JSON，不可解析，则返回 `undefined`。

+ **string:** `String`

```js
console.log('parseJSON', JSONKit.parseJSON('{}')); // {}
console.log('parseJSON', JSONKit.parseJSON('1')); // 1
console.log('parseJSON', JSONKit.parseJSON('"1"')); // '1'
console.log('parseJSON', JSONKit.parseJSON('a')); // undefined
console.log('parseJSON', JSONKit.parseJSON('null')); // null
console.log('parseJSON', JSONKit.parseJSON('undefined')); // undefined
```

### JSONKit.setMaxDepth(depth)

设置 `union` 或 `intersect `中允许的对象最大深度，超过时将抛出错误，用于防止对象循环自引用，默认为 20，最小为 5，最大为 1000，返回当前最大深度值。

+ **depth:** Number

