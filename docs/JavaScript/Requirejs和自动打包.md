# Requirejs和自动打包

开发阶段
不打包，不压缩，模块化开发

部署阶段
自动打包，压缩

## require.js基本使用
https://requirejs.org/

1、require.js
1. 异步加载
2. 模块化开发
    - 一个文件一个模块
    - 减少全局变量

2、define 定义模块
```javascript
// helper.js

// 模块名，模块依赖，模块的实现function
define("helper", ["jquery"], function ($) {
    return {
        trim: function (str) {
            return $.trim(str);
        }
    }
});
```

3、require 加载模块
```javascript
// app.js

// 模块名，模块的实现function
require(["helper"], function (helper) {
    var str = "   adm    ";
    console.log(helper.trim(str));
});
```

4、加载文件
1. html  
2. data-main
```
<!-- index.html -->

<script 
data-main="/static/js/app.js" 
src="/static/js/require.js"
></script>
```

3. baseUrl

```javascript
// app.js

requirejs.config({
    baseUrl: "/static/js"
});
```

```html
<!-- index.html -->

<script src="/static/js/require.js"></script>
<script src="/static/js/app.js"></script>
```

5、加载机制
```javascript
// RequireJS将依赖加载为script标签
head.appendChild()
```
加载即执行

## 配置模块路径
paths 映射不放与bashUrl下的模块名

```javascript
// app.js

requirejs.config({
    baseUrl: "/static/js",

    // 模块路径映射
    paths: {
        // 加载模块使用的名称
        "jquery": [
            // 首先加载的文件,不需要 .js
            "//cdn.bootcss.com/jquery/3.4.1/jquery.min",
            // 备用文件
            "./lib/jquery"
        ]
    }
});
```

## 定义模块
函数式定义
```javascript

// 最佳实践：不写死模块名，依赖的模块可有可无
define('helper', ['jquery'], function($) {
    return {
        trim: function(str) {
            return $.trim(str);
        }
    }
});
```

定义简单的对象
```javascript
define({
    username: 'Tom',
    age: 23
});
```

代码示例
app.js
```javascript
requirejs.config({
    baseUrl: "/static/js",
    // 模块路径映射
    paths: {
        "jquery": [
            // 首先加载的文件,不需要 .js
            "//cdn.bootcss.com/jquery/3.4.1/jquery.min",
            // 备用文件
            "./lib/jquery"
        ]
    }
});

require(["jquery", "./app/api"], function ($, api) {
    $("#user").click(function(){
        console.log("user");
        api.getUser().then(function (user) {
            console.log(user);
            }
        );
    });
});
```

app/api.js
```javascript
define(["jquery"], function ($) {
   return {
       getUser: function () {
           // jquery的异步处理
           var def = $.Deferred();
           require(["./app/user"], function (user) {
                def.resolve(user);
           });
           return def;
       }
   }
});
```

app/user.js
```javascript
// 用户信息
define({
   name: "Tom",
   age: 23
});

```

index.html
```html
<button id="user">显示用户信息</button>

<script src="/static/js/lib/require.js"></script>
<script src="/static/js/app.js"></script>

```

## 配置不支持amd
```javascript
shim: {
    "model": {               // 不支持AMD的模块
        "deps": ["jquery"],  // 依赖模块
        "exports": "Model",  // 全局变量作为模块对象
        init: function($) {  // 初始化函数，返回对象代替exports作为模块对象
            return $;
        }
    }
}
```

## 其他常用配置
1、map
```javascript
// 加载不同的版本
map: {
    // 当app/api模块加载jquery时生效
    "app/api": {
        "jquery": "./lib/jquery"
    },

    // 当app/api2模块加载jquery时生效
    "app/api2": {
        "jquery": "./lib/jquery2"
    }
}
```
2、waitSeconds
下载js等待时间，默认7秒
如果设为0，则禁用等待超时

3、urlArgs
下载文件时，在url后面增加额外的查询query参数
```javascript
urlArgs: "_="+(new Date()).getTime()
```

## jsonp服务
jsonp的一种使用模式，可以跨域获取数据，如json

同源策略：
www.baidu.com 通过ajax不能获取www.qq.com的数据

1、jsonp实现
通过script跨域请求获取数据
```html
<script src="http://www.baidu.com/user.js?callback=onloaded"></script>
```

后端通过callback获取参数值onloaded
```javascript
onloaded({
    name: "Tom",
    age: 23
})
```

2、ajax请求
```javascript
$.ajax(
    {
        url: "http://127.0.0.1:5000/static/js/app/user.js",
        dataType: "jsonp",       // 注意参数是jsonp
        success: function (data) {
            console.log(data);
        }
    }
);
```

3、require.js实现jsonp
```javascript
require(["http://www.baidu.com/user.js"], function(user){

})
```

user.js
```javascript
define({
    name: "Tom",
    age: 23
})
```

## text.js插件
https://github.com/requirejs/text

用于加载文本
```javascript
// 注意前缀  strip只要body部分的内容
require(["text!/user.html!strip"], function(template) {
    $(#userinfo).html(template);
})
```
text.js配置
```javascript
requirejs.config({
    config: {   // 不要少了这个
        text: {
            onXhr: function(xhr, url){
                // 请求之前设置
                // 设置请求头
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            },
            createXhr: function(){
                // 请求时设置
            },
            onXhrComplete: function(xhr, url){
                // 请求完成后设置
            }
        }
    }
})
```
## css.js插件
加载样式文件
https://github.com/guybedford/require-css
```javascript
paths: {
    "css": "./lib/require/css"
}

或者
map: {
    "*": {
        "css": "./lib/require/css"
    }
}

// 加载
require(["css!/static/css/bootstrap.css"], function () {

}
```

加载js依赖的时候同时加载css文件
```javascript
paths: {
    "jquery": "./lib/jquery",
    "css": "./lib/require/css",
    "bootstrap": "./lib/bootstrap"
},

shim: {
    "bootstrap": [
        "jquery",
        "css!/static/css/bootstrap.css",
        "css!/static/css/bootstrap-theme.css"
    ]
},

// 加载
require(["bootstrap"], function () {

}

```

## i18n插件
支持国际化多语言
https://github.com/requirejs/i18n

调用方式
```javascript
require(["i18n!./nls/message"], function(i18n){
    $("#user").after("<button class='btn btn-primary'>" + i18n.edit + "</button>");
})
```

目录结构
文件夹名称固定为nls
```javascript
nls
-en
    -message.js
    define({
        "edit": "Edit"
    })
    
-zh 
    -message.js
    define({
        "edit": "编辑"
    })
-message.js
define({
    "zh": true,
    "en": true
})

```

从浏览器中获取语言
```javascript
navigator.language
navigator.userLanguage
```

配置默认语言
```javascript
config: {
    i18n: {
        locale: "zh"
    }
}
```

从cookie中获取语言

设置浏览器cookie
```bash
$ document.cookie='language=zh_CN'  # 中文

$ document.cookie='language=en_US'  # 英文
```

```javascript
// 从浏览器cookie中获取语言
var language= document.cookie.match(/language=([^;]+)/);

var locale = "zh";

if (language){
    locale = language[1].split("_")[0];
    console.log(locale);
}

// 修改配置
config: {   
    i18n: {
        locale: locale
    }
}
```

## r.js打包工具
下载执行
https://github.com/requirejs/r.js
```
$ node r.js -o bashUrl=js name=app out=built.js
```

安装执行
```
$ npm install -g requirejs

$ r.js -o bashUrl=js name=app out=built.js
```

使用配置文件打包
```
r.js -o app.build.js
```

app.build.js
```
({
    appDir: "./src",  // 要打包的根目录
    bashUrl: "./js",  // js文件在这个baseUrl下
    dir: "./build",   // 打包后的输出目录
    mainConfigFile: "src/js/require.config.js",  // requirejs的配置文件
    name: "app"
})
```

## 多模块打包
app.build.js
```
({
    appDir: "./src",  // 要打包的根目录
    bashUrl: "./js",  // js文件在这个baseUrl下
    dir: "./build",   // 打包后的输出目录
    mainConfigFile: "src/js/require.config.js",  // requirejs的配置文件
    models: [
        {
            name: "app",
            // optimize:'uglify' // 压缩方式 "none" 
            include: ["foo/bar/bee"]  // 添加一起打包
        },
        {
            name: "user",
            exclude: ["foo/bar/bop"]  // 移除不打包
        }
    ]
})
```

## 插件打包
text
css

## npm打包
```
$ npm init
$ npm run-script <command>
$ npm run  # 简写
```

```
"script": {
    "package": "node r.js -o app.build.js"
}
```

## maven+ npm自动打包
frontend-maven-plugin






















