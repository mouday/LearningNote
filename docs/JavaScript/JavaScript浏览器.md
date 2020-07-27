浏览器
浏览器对象
window对象不但充当全局作用域，而且表示浏览器窗口。
outerWidth和outerHeight属性，可以获取浏览器窗口的整个宽高
innerWidth和innerHeight属性，可以获取浏览器窗口的内部宽度和高度

navigator
navigator对象表示浏览器的信息，最常用的属性包括：

navigator.appName：浏览器名称；
navigator.appVersion：浏览器版本；
navigator.language：浏览器设置的语言；
navigator.platform：操作系统类型；
navigator.userAgent：浏览器设定的User-Agent字符串


screen
对象表示屏幕的信息，常用的属性有：

screen.width：屏幕宽度，以像素为单位；
screen.height：屏幕高度，以像素为单位；
screen.colorDepth：返回颜色位数，如8、16、24。


location
对象表示当前页面的URL信息
location.href // http://www.example.com:8080/path/index.html?a=1&b=2#TOP
location.protocol; // 'http'
location.host; // 'www.example.com'
location.port; // '8080'
location.pathname; // '/path/index.html'
location.search; // '?a=1&b=2'
location.hash; // 'TOP'

location.assign()   加载一个新页面
location.reload()   重新加载当前页面

document
对象表示当前页面
document对象就是整个DOM树的根节点
```
document.getElementById()
document.getElementsByTagName()

```


Cookie
是由服务器发送的key-value标示符

```
// 读取到当前页面的Cookie
document.cookie; // 'v=123; remember=true; prefer=zh'
```

服务器在设置 httpOnly的Cookie将不能被JavaScript读取

history
对象保存了浏览器的历史记录
```
history.back()     // 后退
history.forward()  // 前进
```
任何情况，你都不应该使用history这个对象了

操作DOM
document.getElementById()
document.getElementsByTagName()
document.getElementsByClassName()

querySelector()
querySelectorAll()

# 更新DOM
innerHTML
innerText或textContent

修改css
```
var p = document.getElementById('p-id');
// 设置CSS:
p.style.color = '#ff0000';
p.style.fontSize = '20px';  // font-size改写为驼峰式命名
```

# 插入DOM
document.createElement()
parentElement.appendChild(newElement)
node.setAttribute(key, value)
parentElement.insertBefore(newElement, referenceElement)
node.children()

# 删除DOM
removeChild
parent.children

# 操作表单
```
文本框，对应的<input type="text">，用于输入文本；

口令框，对应的<input type="password">，用于输入口令；

单选框，对应的<input type="radio">，用于选择一项；

复选框，对应的<input type="checkbox">，用于选择多项；

下拉框，对应的<select>，用于选择一项；

隐藏文本，对应的<input type="hidden">，用户不可见，但表单提交时会把隐藏文本发送到服务器。
```

获取设置值
value : text、password、hidden以及select
checked : 单选框和复选框

没有name属性的<input>的数据不会被提交

操作文件
```
<input type="file">
```
表单的enctype必须指定为multipart/form-data，method必须指定为post

AJAX
AJAX不是JavaScript的规范，
Asynchronous JavaScript and XML，意思就是用JavaScript执行异步网络请求
```
var request = new XMLHttpRequest(); // 新建XMLHttpRequest对象

request.onreadystatechange = function () { // 状态发生变化时，函数被回调
    if (request.readyState === 4) { // 成功完成
        // 判断响应结果:
        if (request.status === 200) {
            // 成功，通过responseText拿到响应的文本:
            return success(request.responseText);
        } else {
            // 失败，根据响应码判断失败原因:
            return fail(request.status);
        }
    } else {
        // HTTP请求还在继续...
    }
}

// 发送请求:
request.open('GET', '/api/categories');
request.send();
```
安全限制
浏览器的同源策略
JavaScript在发送AJAX请求时，URL的域名必须和当前页面完全一致。
浏览器允许跨域引用JavaScript资源
```
 <script src="http://example.com/abc.js"></script>
```

CORS全称Cross-Origin Resource Sharing
跨域访问资源
Access-Control-Allow-Origin

Promise对象

Promise().then().then....catch() 多任务串行执行.
Promise.all([p1,p2,...]) 多任务并行执行
Promise.race([p1,p2,...]) 多任务赛跑.

Canvas

# jquery
```
$.fn.jquery  // 查看版本
```
使用JSONP，可以在ajax()中设置jsonp: 'callback'，让jQuery实现JSONP跨域加载数据。


JSON是一种数据交换格式，
JSONP是一种依靠开发人员的聪明才智创造出的一种非官方跨域数据交互协议

ajax的核心是通过XmlHttpRequest获取非本页内容，
jsonp的核心则是动态添加 script 标签来调用服务器提供的js脚本


异常处理
```
try {
    ...
} catch (e) {
    ...
} finally {
    ...
}

```
抛出错误使用throw语句

JavaScript引擎是一个事件驱动的执行引擎，代码总是以单线程执行
而回调函数的执行需要等到下一个满足条件的事件出现后，才会被执行。

underscore库，高阶函数兼容IE6～8


