'use strict';
/*global console, Promise*/

var JSBench = require('jsbench'),
	JSONKit = require('../jsonkit.js'),
  len = 10000, // 任务队列长度
  cycles = 100; // 每个测试体运行次数

var jsbench = new JSBench();

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


jsbench.
  add('JSON', function () {
  	for (var i = len; i >= 0; i--) {
  		var a = JSON.parse(JSON.stringify(objTpl));
  	}
  }).
  add('JSONKit', function () {
  	for (var i = len; i >= 0; i--) {
	  	var a = JSONKit.union(objTpl);
  	}
  }).
  run(cycles, true);
