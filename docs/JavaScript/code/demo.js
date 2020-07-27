"use strict";

function hello(){
    console.log("hello world");
}


var fs = require('fs');

// 写文件
var data = 'Hello, Node.js';
fs.writeFileSync('output.txt', data);

// 读取文件
var data = fs.readFileSync('output.txt', 'utf-8');
console.log(data);

module.exports = hello;