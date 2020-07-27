安装环境
```
npm install -g typescript

$ tsc -v
Version 3.7.4
```

Hello World
demo.ts
```
const hello : string = "hello world"
console.log(hello);
```
ts -> js
```
$ tsc demo.ts
```
转换结果
```
var hello = "hello world";
console.log(hello);
```
执行js
```
$ node demo.js
```
