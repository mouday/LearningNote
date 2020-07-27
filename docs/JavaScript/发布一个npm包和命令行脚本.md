# 发布一个npm包和命令行脚本
1、注册账号
https://www.npmjs.com/

2、初始化npm项目
```
npm init
```

目录结构
```
├── index.js
└── package.json
```

3、项目配置
package.json
```json
{
  "name": "2020ooxx",
  "version": "1.0.5",
  "description": "a demo package",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "mouday",
  "license": "ISC",
  "dependencies": {
  }
}

```
配置参数
https://docs.npmjs.com/files/package.json

常用参数
```
main：程序的入口文件，默认是index.js
devDependencies: 所依赖的开发环境下的包
dependencies：所依赖的线上环境下的包
repository: 代码存放地址（一般是git地址）
keywords：npm 包关键词
```

4、模块开发
index.js
```js
function hello() {
    console.log("hello");
}

// 导出模块
module.exports.hello = hello

```

5、登录发布
```shell
# 检查npm源
npm config get registry

# 如过不是下面的地址需要设置
npm config set registry https://registry.npmjs.org

# 登录
npm adduser

# 发包
npm publish
```

6、安装测试
```
npm i 2020ooxx
```
demo.js
```js
// 使用示例
// var ooxx = require("./index")
var ooxx = require("2020ooxx")

ooxx.hello();
// hello
```

7、命令行工具
bin/index.js
```js
#!/usr/bin/env node

console.log("hi");
```

修改package.json
```json
{
  "bin": {
    "my-cli": "bin/index.js"
  }
}
```
本地调试
```shell
$ npm link

$ my-cli
# hi
```
调试完成后可以发布

>参考
[npm发包流程](https://www.cnblogs.com/mengfangui/p/9790118.html)
[手写一个命令行工具到npm发布包](https://www.jianshu.com/p/67eb0caf6e89)