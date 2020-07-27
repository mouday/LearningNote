# Node基础学习笔记
## Node简介
1、Node的作用和应用
1. 脱离浏览器运行JS
2. 后端API编写
3. webpack gulp npm等

2、中间层：服务器中负责IO读写的中间层服务器
性能 异步IO
处理数据
安全性

3、学习目标
登录、注册

4、前置知识
HTML CSS JS

5、Node优势
便于前端开发入门
性能高
利于前端代码整合

6、缺点
年轻

## 环境搭建
```bash
# 查看版本
$ node -v

# 进入交互命令行
$ node

```

1、Hello world
demo.js
```js
console.log("hello world!");
```
运行
```bash
$ node demo
hello world!

$ node demo.js
hello world!
```

## npm包管理

常用命令
```bash
# 初始化项目，生成package.json
$ npm init

# 安装package.json中所有依赖
$ npm install

# 安装 简写 i
$ npm install jquery

# 删除 简写 un
$ npm uninstall jquery

# 更新
$ npm update jquery

# 全局安装cnpm  指定淘宝源
$ npm install cnpm -g --registry=https://registry.npm.taobao.org
```

## Node模块
三种模块：
1. 全局模块
2. 系统模块
3. 自定义模块

1、全局模块
全局使用，不需要引用
```
process.env  环境变量
process.argv 执行参数
```

示例：读取环境变量
```js
console.log(process.env);

if(process.env.dev){
    console.log("开发环境");
} else{
    console.log("生产环境");
}
// 生产环境
```

示例：简易计算器命令行接收参数
```js
let num1 = parseInt(process.argv[2])
let num2 = parseInt(process.argv[3])

console.log(num1 + num2);
```

执行
```bash
$ node demo 1 1
2
```

2、系统模块
需要require引入，不需要单独下载

path: 用于处理文件路径和目录路径的实用工具

示例
```js
const path = require("path")

let filename = "/root/demo/index.jpg"

console.log(path.dirname(filename));
// /root/demo

console.log(path.basename(filename));
// index.jpg

console.log(path.extname(filename));
// .jpg

/* 路径拼接 */
console.log(path.resolve(__dirname, "index.js"));
// /Users/demo/Desktop/index.js
```

fs 用于文件读写操作
```js
const fs = require("fs")

/* 异步操作 */
// 读取文件
fs.readFile("./demo.txt", (err, data)=>{
    if(err){
        console.log(err);
    } else{
        console.log(data.toString());
        // hello
    }
})


// 写入文件 flag 可选 a是append
fs.writeFile("./demo.txt", "hello", {flag: "a"}, (err)=>{
    if(err){
        throw err
    }
})


/* 同步操作 */
// 读取文件
let data = fs.readFileSync("./demo.txt");
console.log(data.toString());

// 写入文件
fs.writeFileSync("./demo.txt", "hello")

```

3、自定义模块
export
module
require查找规则：
1. 如果有路径就去路径中查找
2. 如果没有路径就去node_modules文件夹中查找
3. 最后去node安装目录中查找

demo.js
```js
// 导出 a和 b
exports.a = "hello"
exports.b = "world"

// 不对外导出
let c = "private"

// 批量导出
module.exports = {
    a: 'hello',
    b: 'world'
}
```

index.js
```js
// 如果require("demo") 是去特殊文件夹node_modules 中查找 
const demo = require("./demo")

console.log(demo.a);
// hello
```

导出一个类
```js
// person.js
module.exports = class {
    constructor(name){
        this.name = name;
    }
    showName(){
        console.log(this.name);
    }
}


// index.js
const Person = require("person")

let person = new Person("Tom")
person.showName();
// Tom
```

## 核心Http模块
服务器对象
```js
http.createSerser()
```

1、开启服务
```js
let http = require("http")

http.createServer((request, response)=>{
    response.end("hello")
}).listen(8080);
```
访问
http://localhost:8080/

2、简单的http服务器
index.js
```js
let http = require("http")
let fs = require("fs")

http.createServer((request, response)=>{
    console.log(request.url);
    
    fs.readFile(`./${request.url}`, (err, data)=>{
        if(err){
            response.writeHead(404)
            response.end("404 not found")
        } else{
            response.end(data)
        }
    })
    
}).listen(8080);
```

demo.html
```html
<h1>demo</h1>
```
访问地址：http://localhost:8080/demo.html

## GET请求和POST请求
请求报文
```
头 信息 <= 32K

体 数据 < 2G
```
GET 主要获取数据，数据放在url里传输
```js
// url?username=Tom&age=23
// url模块处理
url.parse(request.url, true)
```

POST 数据放在body
```js
// querystring模块处理
querystring.parse(data)
```

代码实例
```js
let http = require("http")
let fs = require("fs")
let url = require("url")
let querystring = require("querystring")

http.createServer((request, response) => {

    if (request.method === 'GET') {
        // 解析GET参数
        let { query } = url.parse(request.url, true);

        // 返回json
        response.end(JSON.stringify(query))

    } else if (request.method === 'POST') {
        
        let result = []
        // 接收数据
        request.on('data', buffer => {
            result.push(buffer)
        })
        
        // 将接收到的数据返回
        request.on('end', () => {
            let data = Buffer.concat(result).toString()
            // 解析查询参数
            response.end(JSON.stringify(querystring.parse(data)))
        })
    } else {
        response.end('not allow')
    }

}).listen(8080);
```

提交表单代码 demo.html
```html
<form action="http://localhost:8080/" method="POST">
    <input type="text" name="username">
    <input type="submit">
</form>
```

## 案例: 登录注册接口设计
接口API：不同功能层之间的通信规则
```
请求方式 返回值 接口名 参数
```
项目结构
```
.
├── index.js
└── template
    ├── jquery.min.js
    ├── admin.html
    └── login.html
```

index.js
```js
const http = require("http")
const fs = require("fs")
const url = require("url")
const querystring = require("querystring")

// 用户列表
let users = {
    admin: '123456'
}

http.createServer((request, response) => {
    // 先定义好处理函数
    function handleLogin() {
        let { username, password } = post
        let msg
        let code = 0

        if (!users[username]) {
            msg = "用户名不存在"
            code = -1
        } else if (users[username] !== password) {
            code = -1
            msg = "密码不正确"
        } else {
            msg = "登录成功"
        }

        response.end(JSON.stringify({
            code, msg
        }))
    }

    function handleRegister() {
        let msg = ''
        let code = 0
        let { username, password } = post

        if (users[username]) {
            msg = "用户已存在"
            code = -1
        } else {
            users[username] = password
            code = 0
            msg = "注册成功"
        }

        response.end(JSON.stringify({
            code, msg
        }))
    }

    function sendFile() {
        fs.readFile(`./template/${path}`, (err, data) => {
            if (err) {
                response.end("404")
            } else {
                response.end(data)
            }
        })
    }

    // 路由映射
    const routes = {
        '/login': handleLogin,
        '/register': handleRegister
    }

    // 获取数据
    let path, get, post;

    if (request.method === 'GET') {
        // 解析GET参数
        let { pathname, query } = url.parse(request.url, true);
        path = pathname
        get = query
        complete()

    } else if (request.method === 'POST') {

        let result = []
        // 接收数据
        request.on('data', buffer => {
            result.push(buffer)
        })

        // 将接收到的数据返回
        request.on('end', () => {
            let data = Buffer.concat(result).toString()
            path = request.url
            post = querystring.parse(data)
            complete()
        })
    }

    function complete() {
        console.log(path);

        if (routes[path]) {
            response.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8'
            })
            routes[path]()
        } else {
            response.writeHead(200,
                { 'Content-Type': 'text/html; charset=UTF-8' })
            sendFile()
        }
    }

}).listen(8080);
```

template/login.html
```html
<input type="text" name="username" id="username"> <br />
<input type="text" name="password" id="password"> <br />
<input type="submit" value="注册" id="register">
<input type="submit" value="登录" id="login">


<script src="./jquery.min.js"></script>

<script>
    function getFormData() {
        return {
            username: $("#username").val(),
            password: $("#password").val()
        }
    }

    $("#login").click(function () {
        $.post("/login", getFormData(),
            function (data) {
                if (data.code != 0) {
                    alert(data.msg)
                } else {
                    alert(data.msg)
                    window.location.href = "admin.html"
                }
            })
    })


    $("#register").click(function () {
        $.post("/register", getFormData(),
            function (data) {
                if (data.code != 0) {
                    alert(data.msg)
                } else {
                    alert(data.msg)
                }
            }
        )
    })

</script>
```

template/admin.html
```
<h1>admin</h1>
```

## 总结回顾
1、Node作用
webAPI
中间层
前端工程化 webpack

2、优势
性能高
便于前端入手

3、npm 管理优势
npm i jquery
npm un jquery
package.json

4、三大模块
全局模块
系统模块 require
自定义模块 module.exports

5、http
数据通信
get
url模块

post
request.on('data', buffer=>{
    
})

request.on('end', ()=>{
    Buffer.concat(arr).toString()
})

querystring模块

6、设计API
方式 GET, POST
名称 /login
参数 username, password
返回值 {
    code: 0,
    msg: ''
}

7、深入
express/koa2
MongoDB





