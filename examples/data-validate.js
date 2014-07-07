'use strict';
/*global module, process, Promise, noneFn*/

var JSONKit = require('../jsonkit.js');

var ArticleTpl = {
  _id: 0, // Number，数据库id，整数，对外显示ID形式为‘Axxx’，其中x为id字母表字符，长度>=3
  author: 0, // Number，作者_id
  date: 0, // Number，创建时间
  title: '', // String，文章标题，小于90字节（30汉字）
  content: '', // String，文章内容，小于1024×20字节（6826汉字）
  hots: 0, // Number，文章热度，访问+1，支持/反对±2，评论+3，标记+5，推荐+20（可全局设定ArticleHots=[1, 2, 3, 5, 20]）
  visitors: 0, // Number 访问次数
  updateTime: 0, // Date 最后更新时间，包括文章更新和新评论
  tagsList: [], // Array，文章标签的_id列表数组，最多允许5个标签
  favorsList: [], // Array，支持者的_id列表数组
  opposesList: [], // Array，反对者的_id列表数组
  markList: [], // Array，标记者的_id列表数组
  comment: true, // Boolean，是否允许评论
  commentsList: [] // Array，评论的_id列表数组
};

var data = {
	title: '文章标题',
	content: '文章内容。。。。。。。。。。。'
};

var article = JSONKit.union(ArticleTpl); // 从模版复制含默认值的副本
console.log(1, article);

JSONKit.intersect(article, data); // 用副本对输入数据进行验证，不合法的字段将被删除，无数据的字段也被删除
console.log(2, article);

article = JSONKit.union(JSONKit.union(ArticleTpl), article);  // 如果有必要，再用默认模版对验证后的数据补全
console.log(3, article);
console.log(4, ArticleTpl);