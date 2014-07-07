'use strict';
/*global module, process, Promise, noneFn*/

var JSONKit = require('../jsonkit.js');

JSONKit.each([1, 2, 3, 4, 5], function (value, index, list) {
  console.log('each', value, index, list);
});

JSONKit.each({a: 1, b: 2, c: 3}, function (value, index, list) {
  console.log('each', value, index, list);
});

var a = [1, 2, 3, null, null];
console.log('removeItem', JSONKit.removeItem(a, null), a);

var b = {a: 1, b: 2, c: 3, d: null, e: null};
console.log('removeItem', JSONKit.removeItem(b, null), b);

var c = [1, 2, 3, 4, 3, 2];
console.log('uniqueArray', JSONKit.uniqueArray(c), c);

var d = [1, 2, {a: 3, b: 4, c: 5}];
console.log('union', JSONKit.union(d));
console.log('union', JSONKit.union(d, [0, 0, {a: 0}]));

var e = [0, '', {a: 0, b: false, c: null}];
console.log('intersect', JSONKit.intersect(e, [9, 9, {a: 9, c: {}}]));

e = {a: {}, b: []};
console.log('intersect', JSONKit.intersect(e, {a: {a: 1, b:2, c: [1, 2]}, b: [1, 2, {a: 3}]}));

e = {a: [0]};
console.log('intersect', JSONKit.intersect(e, {a: [1, 2, '3', 4]}));

e = {a: [0, 0, 0, 0, 0]};
console.log('intersect', JSONKit.intersect(e, {a: [1, 2, '3', 4]}));

e = {a: null};
console.log('intersect', JSONKit.intersect(e, {a: {a: 1, b:2, c: [1, 2]}}));