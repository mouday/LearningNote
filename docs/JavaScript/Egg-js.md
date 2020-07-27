## Egg.js

基于Node.js和Koa企业级应用开发框架

## 特性
提供基于Egg的定制上层框架的能力
高度可扩展的插件机制
内置多进程管理
基于Koa开发性能优异
框架稳定，测试覆盖率搞
渐进式开发

## 涉及内容
vant ui
vue-cli3
moment.js
Egg.js
mysql
前后端联调

## 开发环境
Egg.js

https://eggjs.org/zh-cn/intro/quickstart.html

```
$ node -v
v10.16.0

$ mkdir egg-demo && cd egg-demo
$ npm init egg --type=simple
$ cnpm i
$ npm run dev
```
http://127.0.0.1:7001/

## 路由
app/router.js
```js
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
};
```

## GET传参
1、方式一
/product/detail?id=110
```js
// 路由
router.get('/product/detail', controller.product.detail);

// 控制器
async detail() {
    const { ctx } = this;
    console.log(ctx.query); // { id: '110' }
    ctx.body = `id=${ctx.query.id}`;
}
```

2、方式二
/product/detail2/110
```js
// 路由
router.get('/product/detail2/:id', controller.product.detail2);

// 控制器
async detail2() {
    const { ctx } = this;
    console.log(ctx.params); // { id: '110' }
    ctx.body = `id=${ctx.params.id}`;
}

```

## POST请求

```js

// 配置文件关闭csrf
config.security = {
    csrf: {
      enable: false,
    },
  };

// 路由
router.post('/product/create', controller.product.create);


// 控制器
async create() {
    const { ctx } = this;
    console.log(ctx.request.body); // { name: 'Tom' }

    const {name, age} = ctx.request.body;
    ctx.body = {name, age};
  }

```
POST请求 /product/create

Content-Type application/x-www-form-urlencoded
Content-Type application/json

name: "Tom"

返回
```json
{
    "name": "Tom"
}
```

## PUT请求
/product/update/110
```js
// 路由
router.put('/product/update/:id', controller.product.update);

// 控制器
async update() {
    const { ctx } = this;
    console.log(ctx.params); // { id: '110' }
    ctx.body = {id: ctx.params.id};
  }
```

## DELETE请求
/product/delete/110
```js
// 路由
router.delete('/product/delete/:id', controller.product.delete);

// 控制器
async delete() {
    const { ctx } = this;
    console.log(ctx.params); // { id: '110' }
    ctx.body = {
        id: ctx.params.id
    };
  }
```

## Service
app/service/product.js
```js
'use strict';

const Service = require('egg').Service;

class productService extends Service {
  async index() {
      return {
          name: "Tom",
          age: 18
      };
  }
}

module.exports = productService;

```

```js
// 路由
router.get('/product', controller.product.index);

// 修改控制器使用service
async index() {
    const { ctx } = this;
    const res = await ctx.service.product.index();
    ctx.body = res;
  }
```

访问后返回： /product/
```json
{
    "name": "Tom",
    "age": 18
}
```

## 模板引擎
ejs https://github.com/eggjs/egg-view-ejs
```
$ npm i egg-view-ejs
```

语法参考
https://ejs.bootcss.com/

修改配置
```js
// {app_root}/config/plugin.js
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

// {app_root}/config/config.default.js
config.view = {
  mapping: {
    '.html': 'ejs',
  },
};
```
新建文件
app/view/index.html

```html
<%# 变量 #%>
<%=res.name%>
<%=res.age%>


<%# for循环 #%>
<% for(var i=0; i<list.length; i++){ %>
  <p><%=list[i]%></p>    
<% } %>
```

控制器中渲染
```js
async index() {
    const { ctx } = this;
    const res = await ctx.service.product.index();
    // ctx.body = res;
    await ctx.render('index.html', {
      res,
      list: ['red', 'green', 'blue']
    })
  }
```

## 静态资源
app/public目录树
```
app
  ├── public
      ├── css
      │   └── main.css
      ├── img
      │   └── demo.png
      └── js
          └── main.js
```

```html
<!-- 引入css文件 -->
<link rel="stylesheet" href="/public/css/main.css">

<!-- 引入图片资源 -->
<img src="/public/img/demo.png" alt="">

<!-- 引入js文件 -->
<script src="/public/js/main.js"></script>
```


## mysql插件安装
```
npm i --save egg-mysql
```

修改配置
```js
// config/plugin.js
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

// config/config.default.js
config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'data',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

```

## 前端开发

1、脚手架 @vue/cli 
https://cli.vuejs.org/zh/guide/installation.html

```
$ cnpm install -g @vue/cli

$ vue -V
3.12.0

$ vue --help

$ vue create client

$ cd client

$ npm run serve
```
http://localhost:8080/


2、前端组件库 vant 
https://youzan.github.io/vant/#/zh-CN/quickstart

```
$ npm i vant -S
$ npm i babel-plugin-import -D
```

在 .babelrc 中添加配置
```js

{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
```

App.vue引入vant组件
```html
<template>
  <div id="app">
    <van-button type="primary">按钮组件</van-button>
  </div>
</template>

<script>
import { Button } from 'vant';

export default {
  name: 'app',

  components: {
    [Button.name]: Button
  }
}
</script>

```

3、路由vue-router
```
cnpm i vue-router --save
```

查询 
```js
async index() {
    const { ctx, app } = this;
    const res = await app.mysql.select("article");
    console.log(res);
  }
```

4、处理时间
```
cnpm i moment --save
```
```js
// 后端保存之前
const moment = require('moment');

const create_time = moment().format('YYYY-MM-DD HH:mm:ss');
// 2019-10-13 22:29:23

//前端展示之前
import momemt from 'moment';

this.list = res.data.map(item=>{
  if(item.create_time){
    item.create_time  = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss');
  }
  return item;
});
```

5、客户端跨域请求
vue.config.js
```js
module.exports = {
    // 处理跨域请求
    devServer: {
        proxy: {
            '/article': {
                target: "http://127.0.0.1:7001/",
                ws: true, // 允许websockt服务
                changeOrigin: true // 开启虚拟服务器，请求代理服务器
            }
        }
    }
}
```
