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

  var maxDepth = 20, BREAKER = {}, ARRAY = [], OBJECT = {},
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

    if (obj && type === 'object') {
      if (isArray(obj)) return ARRAY;
      else if (isObject(obj)) return OBJECT;
      else return obj.toString();
    } else if (type === 'function') return obj.toString();
    return obj;
  }

  function union(a) {
    var b = arguments[1], check = checkObj(a);

    if (check === ARRAY || check === OBJECT) {
      if (arguments.length === 1) {
        b = a;
        a = check === ARRAY ? [] : {};
      }

      _union(a, b, check, maxDepth);
      for (var i = 2, l = arguments.length; i < l; i++) {
        _union(a, arguments[i], check, maxDepth);
      }
    } else throw new Error('Not a array or object.');
    return a;
  }

  function _union(a, b, check, depth) {
    if (--depth <= 0) throw new Error('Maximum structure depth exceeded.');
    if (a === b || check !== checkObj(b)) return a;

    each(b, function (x, i) {
      var checkX = checkObj(x);
      if (checkX === ARRAY || checkX === OBJECT) {
        if (checkX !== checkObj(a[i])) a[i] = checkX === ARRAY ? [] : {};
        _union(a[i], x, checkX, depth);
      } else a[i] = checkX;
    }, null, check === ARRAY);
    return a;
  }

  function intersect(a, b) {
    var check = checkObj(a);

    if (check === ARRAY || check === OBJECT) {
      if (arguments.length < 2) throw new Error('Must have 2 arguments or more.');

      for (var i = 1, l = arguments.length; i < l; i++) {
        if (check !== checkObj(arguments[i])) throw new Error('Arguments\'s type must be consistent.');
        _intersect(a, arguments[i], check, maxDepth);
      }
    } else throw new Error('Not a array or object.');
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

  function isEqual(a, b, depth) {
    if (a === b) return true;
    var check = checkObj(a);
    if (check !== checkObj(b)) return false;
    if (check === ARRAY || check === OBJECT) return _equalObj(a, b, check, depth > 0 ? depth : maxDepth);
    return true;
  }

  function _equalObj(a, b, check, depth) {
    if (--depth <= 0) throw new Error('Maximum structure depth exceeded.');
    var equal = true;
    if (check === ARRAY && a.length !== b.length) return false;
    if (check === OBJECT && a.prototype !== b.prototype) return false;

    each(a, function (x, i) {
      if (hasOwnProperty.call(b, i)) return;
      equal = false;
      return BREAKER;
    }, null, false);

    if (equal) {
      each(b, function (x, i) {
        if (isEqual(x, a[i], depth)) return;
        equal = false;
        return BREAKER;
      }, null, false);
    }

    return equal;
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
    VERSION: '0.2.0',
    each: each,
    union: union,
    isEqual: isEqual,
    intersect: intersect,
    removeItem: removeItem,
    uniqueArray: uniqueArray,
    setMaxDepth: function (depth) {
      maxDepth = depth >= 5 && depth <= 1000 ? +depth : 20;
    }
  };

}));
