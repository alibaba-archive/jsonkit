'use strict';
/*global module, process, Promise, noneFn*/

var JSONKit = require('../jsonkit.js');
var x = {};
var objTpl = {
  _id: 'GlobalConfig',
  domain: 'jsgen.org',
  title: 'jsGen',
  url: 'http://www.jsgen.org',
  logo: '/static/img/logo.png',
  email: '',
  beian: '',
  description: 'You can generate a beautiful website or blog with javascript!',
  metatitle: 'jsGen',
  metadesc: 'You can generate a beautiful website or blog with javascript!',
  keywords: 'jsGen,Node.js,MongoDB',
  robots: 'Baiduspider|Googlebot|BingBot|Slurp!|MSNBot|YoudaoBot|JikeSpider|Sosospider|360Spider|Sogou web spider|Sogou inst spider',
  date: 0,
  visitors: 0,
  users: 0,
  articles: 0,
  comments: 0,
  onlineNum: 1,
  onlineUsers: 1,
  maxOnlineNum: 1,
  maxOnlineTime: 0,
  TimeInterval: 15,
  ArticleTagsMax: 5,
  UserTagsMax: 10,
  TitleMinLen: 12,
  TitleMaxLen: 90,
  SummaryMaxLen: 420,
  ContentMinLen: 24,
  ContentMaxLen: 20480,
  UserNameMinLen: 5,
  UserNameMaxLen: 15,
  CommentUp: 5,
  RecommendUp: 15,
  register: true,
  emailVerification: false,
  UsersScore: [1, 3, 5, 10, 0.1, 1],
  ArticleStatus: [5, 15],
  ArticleHots: [0.2, 2, 3, 5, 20],
  userCache: 100,
  articleCache: 200,
  commentCache: 500,
  listCache: 500,
  tagCache: 100,
  collectionCache: 50,
  messageCache: 50,
  paginationCache: 600,
  smtp: {
    host: 'smtp.qq.com',
    secureConnection: true,
    port: 465,
    auth: {
      user: 'admin@jsgen.org',
      pass: '123456'
    },
    senderName: 'jsGen',
    senderEmail: 'admin@jsgen.org'
  },
  upload: false,
  cloudDomian: '',
  upyun: {
    url: 'http://v0.api.upyun.com/',
    bucket: '',
    user: '',
    passwd: '',
    formApiSecret: ''
  },
  info: {}
};

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

  a = [1, 2, 3, 4, 5];
  JSONKit.removeItem(a, function (x) {
    return x % 2;
  });
  test.deepEqual(a, [2, 4]);

  // 测试 findItem

  a = {a: 1, b: 2, c: x, d: x, e: null};

  test.strictEqual(JSONKit.findItem(a, function (v, i) {
    return v === x;
  }), x);

  a = [1, 1, 2, 3, '1', null, null];

  test.strictEqual(JSONKit.findItem(a, function (v, i) {
    return typeof v === 'string';
  }), '1');

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

  // 测试 extend

  a = {a: 1, b: 2};

  test.deepEqual(JSONKit.extend(a, {b: 3, c: 4}, {c: 5}), {a: 1, b: 3, c: 5});

  // 测试 union

  test.deepEqual(JSONKit.union(objTpl), JSON.parse(JSON.stringify(objTpl)));

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

  // 测试 isEqual

  test.strictEqual(JSONKit.isEqual(objTpl, JSONKit.union(objTpl)), true);
  test.strictEqual(JSONKit.isEqual([1, 2, [3, 4, [5, {a: 6}]]], [1, 2, [3, '4', [5, {a: 6}]]]), false);
  test.strictEqual(JSONKit.isEqual({a: 1, b: [2, 3], c: {d: 4}}, {a: 1, b: [2, 3], c: {d: 4}}), true);

  a = [1, 2, 3, 4];
  b = [1, 2, 3, 4];
  b.a = null;
  test.strictEqual(JSONKit.isEqual(a, b), false);

  a = {a: 1, b: [1, 2, new Date()]};
  b = JSONKit.union(a);
  test.strictEqual(JSONKit.isEqual(a, b), true);

  a = {};
  a.x = a;
  b = {};
  b.x = b;
  try {
    JSONKit.isEqual(a, b);
  } catch (e) {
    err = e;
  }
  test.strictEqual(err.message, 'Maximum structure depth exceeded.');

  // 测试 parseJSON

  test.deepEqual(JSONKit.parseJSON('{}'), {});
  test.deepEqual(JSONKit.parseJSON('[1, 2, 3]'), [1, 2, 3]);
  test.strictEqual(JSONKit.parseJSON('1'), 1);
  test.strictEqual(JSONKit.parseJSON('"1"'), '1');
  test.strictEqual(JSONKit.parseJSON('a'), undefined);
  test.strictEqual(JSONKit.parseJSON('null'), null);
  test.strictEqual(JSONKit.parseJSON('undefined'), undefined);

  test.done();

};
