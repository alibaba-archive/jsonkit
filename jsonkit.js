// **Github:** https://github.com/teambition/jsonkit
//
// **License:** MIT

/* global module, define */
;(function (root, factory) {
  'use strict';

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.JSONKit = factory();
  }
}(this, function () {
  'use strict';

  var BREAKER = {}, ARRAY = {}, OBJECT = {},
    maxDepth = 20,
    toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    isArray = Array.isArray || function (obj) {
      return toString.call(obj) === '[object Array]';
    };

  function isObject(obj) {
    return toString.call(obj) === '[object Object]';
  }

  function isEmpty(obj) {
    if (!obj) return true;
    for (var key in obj) return !hasOwnProperty.call(obj, key);
    return true;
  }

  function each(obj, iterator, context, arrayLike, right) {
    var i, l, key;

    if (!obj) return;
    if (arrayLike == null) arrayLike = isArray(obj);
    if (arrayLike) {
      if (right) {
        for (i = obj.length - 1; i >= 0; i--) {
          if (iterator.call(context, obj[i], i, obj) === BREAKER) return;
        }
      } else {
        for (i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === BREAKER) return;
        }
      }
    } else {
      for (key in obj) {
        if (!hasOwnProperty.call(obj, key)) continue;
        if (iterator.call(context, obj[key], key, obj) === BREAKER) return;
      }
    }
  }

  function checkObj(obj) {
    var type = typeof obj;

    if (type === 'function') return obj.toString();
    else if (obj && type === 'object') {
      if (isArray(obj)) return ARRAY;
      else if (isObject(obj)) return OBJECT;
      else return obj.toString();
    }
    return obj;
  }

  function union(a) {
    var b = arguments[1], checkA = checkObj(a);

    if (checkA !== ARRAY && checkA !== OBJECT) throw new Error('Not a array or object.');
    if (arguments.length === 1) {
      b = a;
      a = new a.constructor();
    }

    _union(a, b, checkA, maxDepth);
    for (var i = 2, l = arguments.length; i < l; i++) {
      _union(a, arguments[i], checkA, maxDepth);
    }
    return a;
  }

  function _union(a, b, check, depth) {
    if (--depth <= 0) throw new Error('Maximum structure depth exceeded.');
    if (a === b || check !== checkObj(b)) return a;

    each(b, function (x, i) {
      var checkX = checkObj(x);
      if (checkX === ARRAY || checkX === OBJECT) {
        if (checkX !== checkObj(a[i])) a[i] = new x.constructor();
        _union(a[i], x, checkX, depth);
      } else a[i] = checkX;
    }, null, check === ARRAY);
    return a;
  }

  function intersect(a, b) {
    var checkA = checkObj(a);

    if (checkA !== ARRAY && checkA !== OBJECT) throw new Error('Not a array or object.');
    if (arguments.length < 2) throw new Error('Must have 2 arguments or more.');

    for (var i = 1, l = arguments.length; i < l; i++) {
      if (checkA !== checkObj(arguments[i])) throw new Error('Arguments\'s type must be consistent.');
      _intersect(a, arguments[i], checkA, maxDepth);
    }
    return a;
  }

  function _intersect(a, b, check, depth) {
    if (--depth <= 0) throw new Error('Maximum structure depth exceeded.');
    if (a === b) return a;

    if (isEmpty(a)) return union(a, b);
    if (check === ARRAY && a.length === 1) {
      if (a[0] === null) return union(a, b);

      var o = a[0], checkO = checkObj(o), typeO = typeof o;
      a.length = 0;

      each(b, function (x) {
        if (typeO !== typeof x) return;
        var checkX = checkObj(x);
        if (checkX !== ARRAY && checkX !== OBJECT) return a.push(checkX);
        if (checkX === checkO) a.push(_intersect(union(o), x, checkX, depth));
      }, null, true);
    } else {
      each(a, function (x, i) {
        if (!hasOwnProperty.call(b, i) || (x !== null && typeof x !== typeof b[i])) {
          if (check === ARRAY) a[i] = null;
          else delete a[i];
          return;
        }
        var checkI = checkObj(b[i]);
        if (checkI !== ARRAY && checkI !== OBJECT) {
          a[i] = checkI;
          return;
        }
        if (x === null) {
          a[i] = union(b[i]);
          return;
        }
        if (checkI !== checkObj(x)) {
          if (check === ARRAY) a[i] = null;
          else delete a[i];
          return;
        }
        _intersect(x, b[i], checkI, depth);
      }, null, check === ARRAY);
    }
    return a;
  }

  function removeItem(list, item, arrayLike) {
    var removed = 0;

    if (arrayLike || isArray(list)) {
      each(list, function (x, i) {
        if (x !== item) return;
        list.splice(i, 1);
        removed += 1;
      }, null, true, true);
    } else {
      each(list, function (x, i) {
        if (x !== item) return;
        delete list[i];
        removed += 1;
      });
    }
    return removed;
  }

  function uniqueArray(array) {
    var flag = {};

    if (!isArray(array)) return array;

    each(array, function (x, i) {
      var key = typeof x + x;
      if (flag[key]) array[i] = BREAKER;
      else flag[key] = true;
    }, null, true);
    removeItem(array, BREAKER, true);
    return array;
  }

  return {
    NAME: 'JSONKit',
    VERSION: '0.1.1',
    each: each,
    union: union,
    intersect: intersect,
    removeItem: removeItem,
    uniqueArray: uniqueArray,
    setMaxDepth: function (depth) {
      maxDepth = depth >= 5 && depth <= 1000 ? +depth : 20;
    }
  };

}));
