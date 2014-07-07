'use strict';
/*global module, process, Promise, noneFn*/

var JSONKit = require('../jsonkit.js');
var x = {};

exports.JSONKit = function (test) {
  // 测试 removeItem
  var a = [1, 2, 3, 4, 5, 5, null, null, x, x, {}];

  test.strictEqual(JSONKit.removeItem(a, null), 2);
  test.deepEqual(a, [1, 2, 3, 4, 5, 5, x, x, {}]);

  test.strictEqual(JSONKit.removeItem(a, null), 0);
  test.deepEqual(a, [1, 2, 3, 4, 5, 5, x, x, {}]);

  test.strictEqual(JSONKit.removeItem(a, 5), 2);
  test.deepEqual(a, [1, 2, 3, 4, x, x, {}]);

  test.strictEqual(JSONKit.removeItem(a, x), 2);
  test.deepEqual(a, [1, 2, 3, 4, {}]);

  test.strictEqual(JSONKit.removeItem(a, {}), 0);
  test.deepEqual(a, [1, 2, 3, 4, {}]);

  a = {a: 1, b: 2, c: x, d: x, e: null};

  test.strictEqual(JSONKit.removeItem(a, null), 1);
  test.deepEqual(a, {a: 1, b: 2, c: x, d: x});

  test.strictEqual(JSONKit.removeItem(a, null), 0);
  test.deepEqual(a, {a: 1, b: 2, c: x, d: x});

  test.strictEqual(JSONKit.removeItem(a, x), 2);
  test.deepEqual(a, {a: 1, b: 2});

  // 测试 uniqueArray

  a = [1, 1, 2, 3, '1', null, null];

  test.deepEqual(JSONKit.uniqueArray(a), [1, 2, 3, '1', null]);

  a = [1, 2, 3, 4, 5, 5, null, null, x, x, {}];

  var b = JSONKit.union(a);

  test.deepEqual(a, b);
  test.notStrictEqual(a, b);
  test.deepEqual(b[10], x);
  test.notStrictEqual(a[10], b[10]);

  test.strictEqual(JSONKit.union(a, [0, 0, 0]), a);
  test.deepEqual(a, [0, 0, 0, 4, 5, 5, null, null, x, x, {}]);

  test.strictEqual(JSONKit.union(a, [1, 1, 1], {}, null, [2, 2, 2, 4, 5, 5, {}, []], {}), a);
  test.deepEqual(a, [2, 2, 2, 4, 5, 5, {}, [], {}, {}, {}]);

  // 测试 union

  a = [1, 2, {a: 1, b: 2, c: [1, 2, {d: 3}]}];

  test.notStrictEqual(JSONKit.union(a), a);
  test.deepEqual(JSONKit.union(a), a);

  b = {};
  test.strictEqual(JSONKit.union(b, a), b);
  test.deepEqual(b, {});

  b = [];
  test.strictEqual(JSONKit.union(b, a), b);
  test.deepEqual(b, a);

  JSONKit.union(a, [0, null, {a: 2, c: [2, 2, {d: [1, 2, x]}]}]);
  test.deepEqual(a, [0, null, {a: 2, b: 2, c: [2, 2, {d: [1, 2, x]}]}]);
  test.notStrictEqual(a[2].c[2].d[2], x);
  test.deepEqual(a[2].c[2].d[2], {});

  a = {};
  a.b = a;
  var err = null;

  try {
    JSONKit.union(a);
  } catch (e) {
    err = e;
  }
  test.strictEqual(err.message, 'Maximum structure depth exceeded.');

  try {
    JSONKit.union(1);
  } catch (e) {
    err = e;
  }

  test.strictEqual(err.message, 'Not a array or object.');

  try {
    JSONKit.union(new Date());
  } catch (e) {
    err = e;
  }

  test.strictEqual(err.message, 'Not a array or object.');

  // 测试 intersect

  a = [1, 2, 3, 4, null, 6, {a: 1, b: 2}, [1, 2, 3], true];
  b = [];

  test.strictEqual(JSONKit.intersect(b, a), b);
  test.deepEqual(b, a);

  test.deepEqual(JSONKit.intersect([0], a), [1, 2, 3, 4, 6]);
  test.deepEqual(JSONKit.intersect([false], a), [true]);
  test.deepEqual(JSONKit.intersect([[]], a), [null, [1, 2, 3]]);
  test.deepEqual(JSONKit.intersect([{}], a), [null, {a: 1, b: 2}]);
  test.deepEqual(JSONKit.intersect([null], a), a);


  test.strictEqual(JSONKit.intersect(a, [2, 3, 4, 5, {}, true]), a);
  test.deepEqual(a, [2, 3, 4, 5, {}, null, null, null, null]);
  test.deepEqual(JSONKit.intersect(a, [2, 3, 4, 5, 6]), [2, 3, 4, 5, null, null, null, null, null]);

  a = {q: 0, w: '', e: {a: 0, b: [0, 0, 0]}};
  b = {r: 10, w: 'hello', e: {a: 99, b: [1, 2, 3, 4, 5]}};

  test.notStrictEqual(JSONKit.intersect({}, a), a);
  test.deepEqual(JSONKit.intersect({}, a), a);

  test.deepEqual(JSONKit.intersect(a, b), {w: 'hello', e: {a: 99, b: [1, 2, 3]}});

  a = {q: 0, w: null, e: {a: 0, b: [0]}};
  b = {r: 10, w: 'hello', e: {a: 99, b: [function (){}, 1, 2, 3, '4', 5]}};
  JSONKit.intersect(a, b);
  test.deepEqual(a, {w: 'hello', e: {a: 99, b: [1, 2, 3, 5]}});

  a = {q: 0, w: null, e: {a: 0, b: [null]}};
  b = {r: 10, w: 'hello', e: {a: 99, b: [function (){}, 1, 2, 3, '4', 5]}};
  test.deepEqual(JSONKit.intersect(a, b), {w: 'hello', e: {a: 99, b: ['function (){}', 1, 2, 3, '4', 5]}});

  a = {};
  a.b = a;
  b = {};
  b.b = b;

  try {
    JSONKit.intersect(a, b);
  } catch (e) {
    err = e;
  }
  test.strictEqual(err.message, 'Maximum structure depth exceeded.');

  try {
    JSONKit.intersect(a);
  } catch (e) {
    err = e;
  }

  test.strictEqual(err.message, 'Must have 2 arguments or more.');

  try {
    JSONKit.intersect(a, new Date());
  } catch (e) {
    err = e;
  }

  test.strictEqual(err.message, 'Arguments\'s type must be consistent.');

  test.done();

};
