JavaScript中的30个疑难杂症

目录

1. 数据类型
2. 表达式运算符和分支结构
3. 内置对象
4. JS DOM
5. JS BOM
6. 函数对象
7. 面向对象

## typeof 和 instanceof

JS数据类型：

- 原始类型（基本类型）Undefined Null Boolean Number String
- 引用类型（复杂类型）Object

1、typeof检测返回对应数据类型

```js
console.log(typeof 123); // number
console.log(typeof true); // boolean
console.log(typeof "hello"); // string
console.log(typeof undefined); // undefined
console.log(typeof null); // object
// 计算机typeof 按照机器码后3位判断数据类型
// null 00000000 => object后3位为0

console.log(typeof []); // object
console.log(typeof {});  // object
console.log(typeof new Date()); // object
console.log(typeof function () {}); // function
console.log(typeof Array); // function
// typeof 引用类型 object function
// object + call方法 => function
```

字符串示例
```js
var name1 = "Tom";
console.log(name1); // Tom
console.log(typeof name1);  //string

var name2 = new String("Tom");
console.log(name2);
// String {"Tom"}
// 0: "T"
// 1: "o"
// 2: "m"
// length: 3
console.log(typeof name2); // object
```

总结：

typeof 少null, 多function

2、instanceof检测返回bool: true/false

```js
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(new Date() instanceof Date); // true
function Person() {}
console.log(new Person() instanceof Person); // true

console.log([] instanceof Object); // true
console.log(new Date() instanceof Object); // true
console.log(new Person() instanceof Object); // true
```

instanceof 原型链查找
```js
A instanceof B == True
B instanceof C == True

=> A instanceof C == True
```

```js
console.log(Object.prototype.toString.call("1")); // [object String]
console.log(Object.prototype.toString.call([])); // [object Array]
```

总结：
1. typeof 返回值是一个字符串:
    - number string boolean 
    - function（函数） 
    - object(null，数组，对象) 
    - undefined
2. instanceof 返回布尔值，判断A 是否为B 的实例对象，检测的是原型

## 数据的存储形式-堆栈

js堆栈

- 栈：计算机为原始类型开辟的一块内存空间 string number...
- 堆：计算机为引用类型开辟的一块内存空间 object

```js
// 栈中存放数值
var a = "Tom";
var b = a;
b = "Jack";
console.log(a, b);
// Tom Jack

// 栈中存放地址值，堆中存放对象
var c = { key: "value" };
var d = c;
d.key = "newValue";
console.log(c, d);
// {key: "newValue"}  {key: "newValue"}

```

## 深拷贝和浅拷贝

- 深拷贝：修改复制对象，原始对象不会变化
- 浅拷贝：修改复制对象，原始对象也变化

方式：
- 遍历赋值
- Object.create()
- JSON.parse()和JSON.stringify()

操作的对象
```js
var obj = {
    a: "Hello",
    b: {
      a: "world",
      b: 111,
    },
    c: [11, "Jack", "Tom"],
};

```


1、浅拷贝

1-1、遍历赋值

```js
// 浅拷贝
function simpleCopy(o) {
    var o_ = {};
    for (let i in o) {
      o_[i] = o[i];
    }
    return o_;
}

var newObj = simpleCopy(obj);
newObj.b.a = "WORLD";
console.log(obj);

console.log(newObj);

/**
obj 和 newObj都变了：
b: { "a": "WORLD", "b": 111}}
*/
```

1-2、Object.create()

```js
var newObj = Object.create(obj);
newObj.b.a = "WORLD";

console.log(obj);
// b: {a: "WORLD", b: 111}
console.log(newObj);
// __proto__:
// b: {a: "WORLD", b: 111}
```

2、深拷贝

2-1、遍历赋值

```js
function deepCopy(object, deepObject=null) {
    let deepObj = deepObject || {};

    for (let i in object) {
      if (typeof object[i] === "object") {
        // 引用类型 [] {} null
        if(object[i] === null){
          deepObj[i] = object[i];
        } else{
          deepObj[i] = object[i].constructor === Array ? []: {}
          // deepObj[i] = object[i].constructor === Array ? []: Object.create(null);
          deepCopy(object[i], deepObj[i])
        }
      } else{
        // 简单数据类型
        deepObj[i] = object[i];
      }
    }
    return deepObj;
}

var newObj = deepCopy(obj);
newObj.b.a = "WORLD";

console.log(obj);
// b: {a: "world", b: 111}
console.log(newObj);
// b: {a: "WORLD", b: 111}
```

2-2 JSON

```js
function deepCopy(o) {
    return JSON.parse(JSON.stringify(o));
}

var newObj = deepCopy(obj);
newObj.b.a = "WORLD";

console.log(obj);
// b: {a: "world", b: 111}
console.log(newObj);
// b: {a: "WORLD", b: 111}
```

## 数据类型转换

1、 特殊类型的隐式转换 NaN, 0, undefined, null, "" => false

```js
Boolean(NaN) // false

Boolean(null) // false

Boolean(undefined) // false

Boolean(0) // false

Boolean("") // false

Boolean([])  // true

Boolean({}) // true
```

2、 逻辑运算符`&&` 和 `||`

```js
console.log(true && true) // true

console.log(false || false) // false

console.log(5 || 0) // 5

console.log(0 || 5) // 5
```

运用
```js

var a = 0;

if(a === 0){
    console.log(a);
} else{
    console.log(5);
}

// 等价于
console.log(a && 5);
```

3、 == 和 ===

== 比较值
=== 比较值 和 类型

```js
console.log(undefined == null); // true
console.log(undefined === null); // false

console.log(0 == '0'); // true
console.log(0 === '0'); // false
```

## 多运算符和分支结构

1、运算符的优先级
```
+-/* && || () -= -- ++

增加括号
```

2、舍入误差

```js
console.log(1.0 + 2.0)
// 3

console.log(0.1 + 0.2)
// 0.30000000000000004

// 转二进制
(0.1).toString(2)
"0.0001100110011001100110011001100110011001100110011001101"
```

舍入误差解决
```js
// 方案一: 舍去后面的位数
console.log(parseFloat((0.1 + 0.2).toFixed(2)));
// 0.3


// 方案二
function add(num1 , num2){
    let n = Math.pow(10, 2); // 增大一定倍数，使得两个数进行整数计算
    return ((num1 * n) + (num2 * n)) / n
}

console.log(add(0.1, 0.2));
// 0.3
```

## 优化for循环

性能优化

```js
var array = [];

for (let index = 0; index < array.length; index++) {
    // do something
}

// 优化后
for (let index = 0, len = array.length; index < len; index++) {
    // do something
}
```

算法优化

```js
// 求和：1 + 2 + 3 + 4 +... + 100
var sum = 0;
for (let i = 1; i <= 100; i++) {
    sum += i;
}
console.log(sum); // 5050

// 等差数列公式求和公式 Sn=n(a1+an)/2
console.log(((1 + 100) * 100) / 2); // 5050
```

例题：找出两个数，和为11，返回下标
```js
var list = [1, 7, 3, 4, 5, 6];
```

方式一：
```js
var loop = 0;

for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list.length; j++) {
        if (list[i] + list[j] == 11) {
            console.log(i, j);
            // 1 3, 3 1, 4 5, 5 4
        }
        console.log("loop", ++loop);
        // loop 36
    }
}
```

方式二：
```js
var loop = 0;
for (let i = 0; i < list.length; i++) {
    let index = list.indexOf(11 - list[i]);
    
    if (index > -1) {
        console.log(i, index);
        // 1 3, 3 1, 4 5, 5 4
    }

    console.log("loop", ++loop);
    // loop 6
}
```

## js中常见的内置对象

1、三种包装对象：String, Number, Boolean

```js

// 内置对象调用方法
var str = "Hello";

var str_ = new String('Hello')
str = str_.toUpperCase()
str_ = null

str.toUpperCase()
```

火狐浏览器可以打印出对象的方法
```js

console.log(Number)
console.log(String)
console.log(Boolean)

```

2、其他标准内置对象：Array, Date, Function, Object...

## 装箱和拆箱

- 装箱：基本数据类型 -> 引用数据类型
```js
var num = 123;
var numObj = new Number(123);

console.log(typeof num) // number
console.log(typeof numObj) // object

```

- 拆箱：引用数据类型 -> 基本数据类型
```js
var numObj = new Number(123);

console.log(numObj.valueOf()) // 123

console.log(typeof numObj.valueOf()) // number

```

拆箱操作原理：

```js
内部执行

toPrimitive(input, type)
input 传入的值
type 值类型

1. 如果是原始类型的值直接返回
2. 如果不是，调用 input.valueOf() 是原始类型就返回
3. 如果不是，继续调用  input.toString() 是原始类型就返回
4. 报错
```

```
valueOf()  有原始类型的值返回，没有返回对象本身
toString() 对象[object type] type：对象类型
```

例题1：
```js
console.log([] + [])
<empty string>

// 分析：
console.log([])
Array []

console.log([].valueOf())
Array []

console.log([].toString())
<empty string>
```

例题2：
```js
console.log([] + {})
[object Object]

// 分析：
console.log({}.valueOf())
{}

console.log({}.toString())
[object Object]

// 交换位置，{}可能被识别为代码块
console.log({} + [])
[object Object] 或 0

console.log(+ [])
0

console.log(+ '')
0

console.log(+ {})
NaN
```

## 深入理解栈和队列

- 栈：  后进先出 LIFO (last in first out)
- 队列： 先进先出 FIFO (first in  first out)

- 栈和堆：数据存储
- 栈和队列：数据访问顺序

js数组 具备了 栈 + 队列

push
pop
unshift
shift

```js
var list = [1, 2, 3];

// 队尾入栈
list.push(4);
console.log(list); // [ 1, 2, 3, 4 ]

var val1 = list.pop();
console.log(list); // [ 1, 2, 3 ]
console.log(val1);  // 4

// 队首入栈
list.unshift(0);
console.log(list);  // [0, 1, 2, 3]

var val2 = list.shift();
console.log(list);  // [1, 2, 3]
console.log(val2);  // 0
```

- 结尾出入栈，不影响原有数据位置索引，效率高
- 开头出入栈，会影响原有的数据位置索引，效率低

## sort列表排序

```js
var list1 = [1, 3, 2, 5, 8];
console.log(list1.sort()); // [1, 2, 3, 5, 8]

// 得到不期望的排序结果
var list2 = [3, 23, 15, 9, 31];
console.log(list2.sort());  // [15, 23, 3, 31, 9]

```

sort:

1. 默认升序
2. 按照字符串Unicode码进行排序

解决

定义一个比较器函数

```js
function compare(x, y) {
    return x - y;
}

var list1 = [1, 3, 2, 5, 8];
console.log(list1.sort(compare)); // [1, 2, 3, 5, 8]

// 得到期望的排序结果
var list2 = [3, 23, 15, 9, 31];
console.log(list2.sort(compare)); //  [3, 9, 15, 23, 31]
```

## Date对象中的getMonth()

```js
// 2021-03-15 星期一
var now = new Date();
console.log(now.getTime()); // 13位时间戳，1970年1月1日至今的毫秒数
//   单位是毫秒: 1615820418925

console.log(now.getDate()); // 本月第几号：  15
console.log(now.getDay()); //  本周第几天1-7：1
console.log(now.getMonth() + 1); // 月份：3

```
客户端的时间可以修改
严谨的时间需要后端给


## 开发中的编码和解码

- escape/unescape
- encodeURI/decodeURI
- encodeURIComponent/decodeURIComponent


1、escape/unescape

处理ASCII码表之外的字符

```js
var url = "http://www.baidu.com?name=张三&age=23";
console.log(escape(url));
//   http%3A//www.baidu.com%3Fname%3D%u5F20%u4E09%26age%3D23

var escapeUrl = "http%3A//www.baidu.com%3Fname%3D%u5F20%u4E09%26age%3D23";
console.log(unescape(escapeUrl));
// http://www.baidu.com?name=张三&age=23
```

2、encodeURI/decodeURI（用的较多）

处理unicode编码

```js
var url = "http://www.baidu.com?name=张三&age=23";
console.log(encodeURI(url));
// http://www.baidu.com?name=%E5%BC%A0%E4%B8%89&age=23

var escapeUrl = "http://www.baidu.com?name=%E5%BC%A0%E4%B8%89&age=23";
console.log(decodeURI(escapeUrl));
// http://www.baidu.com?name=张三&age=23
```

3、encodeURIComponent/decodeURIComponent

```js
var url = "http://www.baidu.com?name=张三&age=23";
console.log(encodeURIComponent(url));
// http%3A%2F%2Fwww.baidu.com%3Fname%3D%E5%BC%A0%E4%B8%89%26age%3D23

var escapeUrl = "http%3A%2F%2Fwww.baidu.com%3Fname%3D%E5%BC%A0%E4%B8%89%26age%3D23";
console.log(decodeURIComponent(escapeUrl));
// http://www.baidu.com?name=张三&age=23
```

## 理解DOM树的加载过程

浏览器发起请求过程
```
浏览器URL  -> DNS域名解析 -> IP所在服务器发起请求
```

浏览器处理响应过程
```
html：二进制转为html

构建DOM树：
    Html解析： Token -> Node -> DOM
        Token词法解析: 根是document对象 <div></div>
        Node：HTML div Element
        DOM: DOM和标签是一一对应的关系

解析过程中：
    link css并行下载
    script 先执行js，完成后继续构建DOM树
        底部引入js 
        头部引入js, 加async,defer
            async: 异步下载js文件，不影响DOM解析,下载完成后尽快执行js
            defer：文档渲染完后，DOMContentLoaded时间调用之前，按照顺序执行js
        windown.onload

构建css树：CSS解析器
    每个css文件解析为CSSStyleSheet样式表对象，每个对象都包含CSSRule, CSSRule包含选择器和声明对象
    Token解析->Node->CSSOM

构建Render树：渲染树 = DOM树 + CSS树

布局layout和绘制paint: 
    计算对象之间的大小，确定每个节点在屏幕上的坐标
    映射浏览器屏幕绘制，使用UI后端层绘制每个节点

    reflow 回流：元素属性发生变化且影响布局时（高、宽、内外边距等）
        相当于刷新页面
    repaint 重绘：元素属性发生变化且不影响布局时（颜色、透明度、字体样式等）
        相当于不刷新页面，动态更新内容
    重绘不一定引起回流，回流必将引起重绘

```

## 3种事件绑定的异同
html事件
dom0事件
dom2事件

- 广义javascript ECMAScript + DOM + BOM  DOM0  DOM1  DOM2
- 狭义javascript ECMAScript ES6 ES5 ES3

事件监听的优点：可以绑定多个事件，常规的事件绑定只执行最后绑定的事件
事件绑定：相当于存储了函数地址，再绑定一个事件，相当于变量指向了另一个函数地址
事件监听：相当于订阅发布者，改变了数据，触发了事件，订阅这个事件的函数被执行


addEventListener函数

```js
element.addEventListener(event, function, useCapture)
removeEventListener()

event        （必需）事件名
function     （必需）事件触发函数
useCapture   （可选）指定事件在捕获(tru)或冒泡(false)阶段执行


IE8: element.attathEvent(event, function)

event    （必需）事件名, 需加'on' eg: onclick
function （必需）事件触发函数
```


```html
<button onclick="func1()">Html事件</button>
<button id="btn0">事件绑定</button>
<button id="btn2">事件监听</button>

<script>
  function func1() {
    console.log("func1");
  }

  function func2() {
    console.log("func2");
  }

  function func3() {
    console.log("func3");
  }

  function func4() {
    console.log("func4");
  }

  function func5() {
    console.log("func5");
  }

  // dom0级事件：事件绑定； 只执行func3
  document.getElementById("btn0").onclick = func2;
  document.getElementById("btn0").onclick = func3;

  // dom2级事件：事件监听; 两个函数都会执行
  document.getElementById("btn2").addEventListener("click", func4);
  document.getElementById("btn2").addEventListener("click", func5);
</script>
```

## 事件触发、事件捕获与事件冒泡

事件捕获与事件冒泡

```
向下是捕获阶段
---------------
    |    ^
---------------
    V    ^
---------------
    V    |
---------------
向上是冒泡阶段
```

事件对象:

事件触发时包含了事件发生的元素和属性信息

```js
var div3 = document.getElementById("div3");
div3.addEventListener("click", function (e) {
  var e = e || window.event; // IE 8  window.event arguments[0]
  console.log(e);
}, false); // true: 捕获, false: 冒泡(默认)
```


事件的周期

```
--------------------
div1                |
---------------     |
div2           |    |
--------       |    |
div3   |       |    |
--------       |    |
---------------     |
--------------------
```

```html
<style>
#div1 {
    width: 300px;
    height: 300px;
    background-color: green;
}

#div2 {
    width: 200px;
    height: 200px;
    background-color: blue;
}

#div3 {
    width: 100px;
    height: 100px;
    background-color: grey;
}
</style>

<div id="div1">
    div1
    <div id="div2">
        div2
        <div id="div3">div3</div>
    </div>
</div>

<script>
// 事件对象：时间触发时包含了事件发生的元素和属性信息
var div3 = document.getElementById("div3");
div3.addEventListener(
    "click",
    function (e) {
        console.log("div3");
    },
    false
);

var div2 = document.getElementById("div2");
div2.addEventListener(
    "click",
    function (e) {
      console.log("div2");
    },
    false
);

var div1 = document.getElementById("div1");
div1.addEventListener(
    "click",
    function (e) {
      console.log("div1");
    },
    false
);

/**
* 点击div 3
* 
* div3 -> div2 -> div1
*/
</script>
```

阻止冒泡：

```js
e.stopPropagation()

e.cancelBubble = true // IE8
```

事件冒泡的应用：事件委托

```html
<div id="demo">
  <li>aaaaaa</li>
  <li>bbbbbb</li>
  <li>cccccc</li>
</div>

<script>
  // 事件委托
  var demo = document.getElementById("demo");
  demo.addEventListener("click", function (e) {
      if (e.target.nodeName.toLowerCase() == "li") {
        console.log(e.target.innerHTML);
      }
    }, false );

</script>
```

## 阻止默认行为的两种方式

- e.preventDefault()
- return false

让a标签链接不跳转

```html
<a href="https://www.baidu.com/">百度</a>

<script>

  var a = document.querySelector('a')
  a.onclick = function(e){
    // 方式一
    // e.preventDefault()

    // 方式二
    return false;
  }
</script>
```

让form表单不提交

```html
<form action="/post">
  <input type="submit" value="提交" id="submit"/>
</form>

<script>
  var submit = document.getElementById("submit");
  submit.onclick = function (e) {
    // 方式一
    // e.preventDefault()

    // 方式二
    return false;
  };
</script>
```

## 使用History和location

1、History

window.hostory 属性指向History对象

表示当前窗口的浏览历史

类似栈的数据结构

```js
History:
  back()
  forward()
  go() 0 -1 -2
  pushState()
  replaceState()
```

2、Location

window.location和document.location

```js
Location:
  href:      整个URL
  protocal   URL协议，包括冒号
  host       主机 包括主机名，冒号:，端口
  hostname   主机名，不包括端口
  port       端口号
  pathname   URL的路径部分，从根路径/ 开始
  search     查询字符串，问号？开始
  hash       片段字符串 从#开始
  username   用户名
  password   密码
  origin     URL协议，主机名，端口号
```

## 常见函数的4种类型

- 匿名函数
- 回调函数
- 递归函数
- 构造函数

1、匿名函数

定义时候没有任何变量引用的函数

匿名函数自调：函数只执行一次

```js
(function(a, b){
  console.log(a + b);}
)(1, 2);


// 等价于
function foo (a, b){
  console.log(a + b);
}

foo(1, 2);

```

jQuery：
```js
(function(window, undefined){
  var jQuery;
  ...
  window.jQuery = window.$ = jQuery;
})(window);
```

优点：节约内存空间，掉用前和调用后内存中不创建任何函数对象

2、回调函数callback

如果一个函数作为对象交给其他函数使用

```js
var arr = [33, 9, 11, 6];

arr.sort(function (a, b) {
  return a - b;
});

console.log(arr);
// [6, 9, 11, 33]
```

异步回调
```js
function getPrice(params, callback){
  $.ajax({
    url: '/getPrice',
    type: 'POST',
    data: params,
    success: function(data){
      callback(data);
    }
  })
}
```

3、递归函数

循环调用函数本身

```js
var func = function(x) {
  if(x === 2){
    return x
  } else{
    return x * f(x - 1)
  }
}
```

arguments.callee 严格模式下不支持使用 `use strict`

```js
function func(x){
  if(x === 1){
    return 1
  } else{
    return x * arguments.callee(x -1)
  }
}
```

4、构造函数

构造函数习惯上首字母大写

调用方式不一样，作用也不一样

构造函数用来新建实例对象

Person 既是函数名，也是这个对象的类名
```js
function Person(){} // 构造函数

new Person()

function person(){} // 方法
```


## 变量和函数提升

- js解释执行
- 变量和函数提升


变量声明提前，函数声明提前

- 变量声明提前：值停留在本地
- 函数声明提前：整个函数体提前

如果是var赋值声明的函数，变量提前，函数体停留在本地


1、变量提升

未声明使用会报错
```js
console.log(a); // Error: a is not defined
```

var会变量提升
```js
console.log(a);  // undefined
var a = 10;
```

let定义不会提升
```js
console.log(a);  // Error: Cannot access 'a' before initialization
let a = 10;
```

2、函数提升

```js
console.log(func);  // func(){}
function func(){}
```

```js
console.log(foo);  // undefined
var foo = function func(){}
```

```js
console.log(func);  // Error: func is not defined
var foo = function func(){}
```

## 作用域和作用域链

- 全局作用域，函数作用域
- 作用域链

- 作用域scope: 一个变量的可用范围
- 作用域链scope chain：以当前作用域的scope属性为起点，依次引用每个AO,直到window结束，行成多级引用关系

js作用域ES5

- 全局作用域 window
- 函数作用域 function(){}

js的变量和函数作用域是在定义是决定的，而不是运行时决定
js的变量作用域在函数体内有效，无块作用域

作用域示例

```js
function a() {
  function b() {
    var bb = "bb";
  }
  b()
  var aa = "aa";
}

a()

console.log(bb);  // Error: bb is not defined
console.log(aa);  // Error: aa is not defined
```

```
[[scope]]
```

作用域链

```js
var cc = 'cc'
      
function a() {
  function b() {
    var bb = "bb";
    console.log(aa); // undefined
    console.log(cc); // cc
  }
  b()
  var aa = "aa";
  console.log(cc); // cc
}

a()
```


面试题

```js
var buttons = [{name: 'n1'}, {name: 'n2'}, {name: 'n3'}]

function bind(){
  for(var i = 0; i < buttons.length; i++){
    buttons[i].func = function(){
      console.log(i);
    }
  }
}

bind()

buttons[0].func() // 3
buttons[1].func() // 3
buttons[2].func() // 3
```

```js
function bind(){
  for(var i =0; i < buttons.length; i++){
    let num = i;
    buttons[i].func = function(){
      console.log(num);
    }
  }
}
// 输出 0 1 2
```

## 执行环境


浏览器环境栈：js是一个单线程程序
执行环境（执行上下文）：EC execution context

- 全局执行环境
- 局部执行环境

- 变量对象：VO variable object 保存全局环境下变量的对象
- 活动对象：AO activation object  保存函数环境中的变量

## 重载和多态的使用场景

重载：定义相同名称，不同参数的函数，程序调用时自动识别不同参数的函数
实现了相同函数名不同的函数调用

js中没有重载，可以通过arguments实现函数重载

```js
/**
 * 计算正方形或长方形面积
 */
function React() {
  if (arguments.length == 1) {
    // 如果是1个参数，返回正方形
    this.width = arguments[0];
    this.height = arguments[0];
  } else {
    // 如果是2个参数，返回长方形
    this.width = arguments[0];
    this.height = arguments[1];
  }

  this.toString = function () {
    return `${this.width} * ${this.height} = ${this.width * this.height}`;
  };
}

var react1 = new React(5);
console.log(react1.toString());
// 5 * 5 = 25

var react2 = new React(3, 4);
console.log(react2.toString());
// 3 * 4 = 12
```

多态：同一个东西在不同情况下表现不同状态，重写和重载

## 闭包

闭包的概念Closure：作用域

引用了自由变量的函数，这个被引用的自由变量将和这个函数一同存在；
即使已经离开了创造它的环境也不例外。
所以，闭包是由函数和其他相关的引用环境组合而成，实现信息驻留；
信息的保存，引用在，空间不销毁


简单的使用
```js
var Person = function () {
  var count = 0;
  return function () {
    return count++;
  };
};

var p = Person()
console.log(p()); // 0
console.log(p()); // 1
console.log(p()); // 2
```

闭包的应用

```js
var buttons = [{name: 'n1'}, {name: 'n2'}, {name: 'n3'}]

function bind() {
  for (var i = 0; i < buttons.length; i++) {
    // 定义一个立即执行函数，行成闭包
    (function (num) {
      buttons[i].func = function () {
        console.log(num);
      };
    })(i);
  }
}

bind();

buttons[0].func(); // 0
buttons[1].func(); // 1
buttons[2].func(); // 2
```

闭包缺点：

闭包导致内存驻留，如果是大量对象的闭包环境需要注意内存消耗

ES6中使用let定义局部变量也可以实现输出0 1 2

```js
function bind() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].func = function () {
      console.log(i);
    };
  }
}
```

## call、apply、bind的使用场景区分

call、apply、bind都是Function对象的方法

1、apply调用一个函数，可以指定this值

```js
Function.apply(obj, args)

obj: 这个对象将替代Function类里的this对象
args: 是一个数组
```

2、call

```js
Function.call(obj, ...args)
args: 单个参数
```

```js
var stu1 = {
  name: "Tom",
  say: function (age, school) {
    console.log(this.name, age, school);
  },
};

var stu2 = {
  name: "Jack",
}

stu1.say(18, '清华'); // Tom 18 清华
stu1.say.call(stu2, 28, '北大'); // Jack 28 北大
stu1.say.apply(stu2, [28, '北大']); // Jack 28 北大
```

类数组转数组
```js
var arr = Array.prototype.slice.apply(arguments)
```

3、bind：

类似call, 不同之处在于call调用之后立即执行，bind需要一个变量进行接收之后再执行


## new的执行过程

```js
var Person = function(name, age){
  this.name = name;
  this.age = age;
}

var person =new Person('Tom', 23);
console.log(person.name); // Tom

// 分4步
// 1、创建一个新对象obj
var obj = new Object();

// 2、把obj的proto指向构造函数的prototype对象，实现继承
obj.__proto__ = Fn.prototype;

// 3、将this指向obj
var result = Fn.call(obj)

// 4、返回创建的obj,如果该函数没有返回对象，则返回this
if(typeof result === 'object'){
  return result; // func = result
} else{
  return obj;  // func = obj
}
```

## this的使用

this指向

指代当前调用的这个对象

4中绑定(优先级从低到高)：
- 默认绑定
- 隐式绑定
- 显示绑定
- new绑定


```js
var person = {
  name: 'Tom',
  age: 23,
  showName: function () {
    // this->person
    console.log(this.name); // Tom
  },
  showAge: function () {
    // 局部函数
    function _age(){
      // this->window
      console.log(this.age); // undefined
    }
    _age();
    // this->person
    console.log(this.age); // 23
  },
};

person.showName()
person.showAge()
```

可以先保存this
```js
let that = this;
```

改变this指向

call/apply/bind

```js
var name = 'Tom'

var person = {
  name: 'Jack',
  showName: function(){
    console.log(this.name);
  }
}


person.showName(); // Jack

// this->window
var show = person.showName;
show(); // Tom

var fn = person.showName.bind(person);
fn(); // Jack

```

实现一个bind方法

```js
Function.prototype.bind = function(obj){
  var that = this;
  return function(){
    that.apply(obj)
  }
}


// 验证
var name = 'Tom'

var person = {
  name: 'Jack',
  showName: function(){
    console.log(this.name);
  }
}

var fn = person.showName.bind(person);
fn(); // Jack

```

## 理解面向对象

对象:

- 具备私有属性 {name: 'Tom'}
- 只要是new出来的都是对象 new Func() => 实例化
- 不同对象可定不相等 
- 对象都会有引用机制

js万物皆对象

1. 字面量 - 字面显示的内容 Array Date Object
2. 包装类 - 没有new的函数声明，可以理解为不是对象 String, NUmber

面向对象：

把任何的数据和行为抽象成一个形象的对象

面向对象OOP：继承 封装 多态

```
java: class

js: function Person(){}; new Person()
```

- 继承：子继承父
- 封装：方法function()
- 多态： 重载、重写（继承）

## 原型和原型链

创建对象
```js
// 1、函数对象
var func = new Function("str", "console.log(str)");
func("hi"); // hi


// 2、普通对象
var obj1 = {
  name: "Tom",
  getName: function () {
    return this.name;
  },
};
console.log(obj1.getName()); // Tom

var obj2 = new Object();


// 3、构造函数创建对象
function Person(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}

var p1 = new Person('Tom');
var p2 = new Person('Jack');

console.log(p1.getName()); // Tom
console.log(p2.getName()); // Jack

```

原型和原型链

1. 一句话：万物皆对象，万物皆空null
2. 两个定义：
  - 原型：保存所有子对象的公有属性值和方法的父对象
  - 原型链：由各级子对象的`__proto__` 属性连续引用行成的结构
3. 三个属性：`__proto__`、constructor、prototype


```js
// 构造函数实现类
function Person(name, age) {
  this.name = name;
  this.age = age;

  this.say = function () {
    console.log(this.name + this.age);
  };
}

// 1、当函数创建的时候就会携带prototype属性，指向原型对象
Person.prototype.money = 20;

Person.prototype.run = function(){
  console.log('run...');
}

// constructor
console.log(Person.prototype.constructor === Person); // true

var p1 = new Person("Tom", 18);

// 所有对象都会携带 __proto__
console.log(p1.__proto__ === Person.prototype); // true

```

1. 挂载在函数内部的方法上，实例化对象内部会复制构造函数的方法
2. 挂载在原型上的方法，不会复制
3. 挂载在内部和原型上的方法都是可以通过实例去调用的
4. 一般来说，如果需要访问构造函数内部的私有变量，我们可以定义再函数内部；
其他情况可以定义再函数的原型上

总结

1. 所有对象都携带`obj.__proto__`
2. `obj.__proto__ === Person.prototype`
3. `Person.prototype.constructor === Person`

## 原型相关API

Function和Object关系


```js
function Person(){}
var person = new Person()

=>
person.__proto__ -> Person.prototype
Person.prototype.constructor -> Person

Function.__proto__ -> Function.prototype

Person.__proto__ -> Function.prototype
Object.__proto__ -> Function.prototype
Function.prototype.__proto__ -> Object.prototype
Object.prototype.__proto__ -> null

翻一下：
令：
__class__ = __proto__
Person[class] = Person.prototype


person.__class__ -> Person[class]
Person[class].constructor ->  Person

Function.__class__ -> Function[class] // 特殊

Person.__class__ -> Function[class]
Object.__class__ -> Function[class]  // 特殊
Function[class].__class__ -> Object[class]
Object[class].__class__ -> null

就是一个实例找类的过程，有特殊
```

Function对象和Object对象之间的关系

- Function是顶层的构造器，Object是顶层的对象
- 顶层有null, Object.prototype, Function.prototype Function
- 原型上说：Function继承了Object
- 构造器上说：Function构造了Object


原型相关API判断对象的属性是自有还是私有
- hasOwnProperty 
- isPropertyOf 判断对象是否在原型链中
- getPropertyOf 获取原型对象的标准方法

## 继承

继承的方式

继承的6种方式
1. 简单原型链：类式继承
2. 借用构造函数：缺点=> 父类的原型方法自然不会被子类继承
3. 组合继承（最常用）：类式继承+构造函数式继承
4. 寄生组合继承（最佳方式）：寄生式继承+构造函数式继承
5. 原型式：跟类式继承一样，父对象Book中的值类型的属性被复制，引用类型的属性被共有
6. 寄生式：通过在一个函数内的过渡对象实现继承并返回新对象的方式

继承的应用

## Object.defineProperty

定义

```js
Object.defineProperty(obj, prop, descriptor)

/*
obj：需要定义属性的对象
prop：需要定义的属性
descriptor：属性的描述描述符
返回值：返回此对象
*/
```

```js
var obj = {}

// 数据描述符
var descriptor = {
  // 能否delete删除，
  configurable: false,
  // 是否可写，默认false, 不能被赋值，只读
  writable: false,
  // 是否可枚举，即是否可以for...in访问属性，默认false
  enumerable: false,
  // 属性值，默认undefined
  value: 'hello',

  // 访问器描述符，不能与数据描述符同时使用
  // get: 读取，默认undefined
  // set: 设置，默认undefined
}

Object.defineProperty(obj, 'name', descriptor)
console.log(obj.name)
```

示例：数据响应式 vue
```js
function defineReactive(obj, key, val) {
  // val，由于闭包的存在，不会被销毁
  Object.defineProperty(obj, key, {
    get() {
      console.log('get');
      return val;
    },
    set(newVal) {
      if (newVal != val) {
        console.log('set');
        val = newVal;
      }
    },
  });
}


var obj = {};
defineReactive(obj, 'foo', '123')
console.log(obj.foo); // get  123

obj.foo = '223' // set
console.log(obj.foo);  // get 223
```
