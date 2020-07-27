JavaScript
教程
https://wangdoc.com/javascript/index.html

##
Chrome
浏览器
控制台：
Option
+
Command
+
J
开发者工具：
Option
+
Command
+
I
执行代码：Enter
代码换行：Shift
+
Enter


##
发展历程
XMLHttpRequest
允许
JavaScript
发出
HTTP
请求
JSON取代XML
Dojo
框架为不同浏览器提供了同一接口
Ajax
方法（Asynchronous
JavaScript
and
XML）
jQuery
操作网页
DOM
V8
编译器

Node.js
服务器端编程
CoffeeScript
语法要比
JavaScript
简洁
PhoneGap
用于跨平台的应用程序开发
Chrome
OS
以浏览器为基础发展成的操作系统
NPM、BackboneJS
和
RequireJS
进入模块化开发的时代
Google
Dart语言
单页面应用程序框架（single-page
app
framework）AngularJS、Ember
微软TypeScript
asm.js

WinJS
JavaScript
的
Windows
库

Facebook

React
Native
Angular
可以用来开发手机
App
Google
Polymer
ECMAScript
6
WebAssembly
中间码格式


ECMAScript
和
JavaScript
的关系
前者是后者的规格，后者是前者的一种实现


##
变量
语句和表达式的区别
语句主要为了进行某种操作，一般情况下不需要返回值；
表达式则是为了得到返回值

变量是对“值”的具名引用

变量提升（hoisting）
JavaScript
引擎的工作方式是，先解析代码，获取所有被声明的变量，然后再一行一行地运行。
这造成的结果，就是所有的变量的声明语句，都会被提升到代码的头部
```js
console.log(a);
//
undefined
var
a
=
1;
```

对于var命令来说，JavaScript
的区块不构成单独的作用域（scope）

```js
{




var
a
=
1;
}

console.log(a);
//
1
```

赋值表达式（=）
严格相等运算符（===）
相等运算符（==）

##
基本数据类型
6种
数值（number）
字符串（string）
布尔值（boolean）
对象（object）:
狭义的对象（object）、数组（array）、函数（function）
未定义（undefined）
空值（null）

查看值类型
typeof
instanceof
Object.prototype.toString

##
布尔值
布尔值false:
undefined
null
false
0
NaN

""或''（空字符串）

布尔值true：
空数组（[]）和空对象（{}）

##
数值
JavaScript
内部，所有数字都是以64位浮点数形式储存，即使整数也是如此
JavaScript
对15位的十进制数都可以精确处理。
NaN
“非数字”（Not
a
Number）唯一不等于自身的值
Infinity
“无穷”

类型转换，进制转换
parseInt()

parseFloat()
isNaN()
isFinite()

##
字符串
约定
JavaScript
语言的字符串只使用单引号
字符串可以被视为字符数组

base64
atob()
//ASCII
to
Base64
btoa()
//Base64
to
ASCII
不适合非
ASCII
码的字符

```js
function
b64Encode(str)
{


return
btoa(encodeURIComponent(str));
}

function
b64Decode(str)
{


return
decodeURIComponent(atob(str));
}
```

##
对象
判断一下，某个属性是否为对象自身的属性
```js
var
person
=
{




name:
'老张'
};

for
(var
key
in
person)
{




if
(person.hasOwnProperty(key))
{








console.log(key);




}
}
```

##
函数
函数的表达式需要在语句的结尾加上分号，表示语句结束。
而函数的声明在结尾的大括号后面不用加分号

```js
var
add
=
new
Function(


'x',


'y',


'return
x
+
y'
);

//
等同于
function
add(x,
y)
{


return
x
+
y;
}
```
第一等公民

JavaScript
语言将函数看作一种值，与其它值（数值、字符串、布尔值等等）地位相同

多行字符串
```js
var
multiline
=
function
(fn)
{


var
arr
=
fn.toString().split('\n');


return
arr.slice(1,
arr.length
-
1).join('\n');
};

function
f()
{/*


这是一个


多行注释
*/}

multiline(f);
//
"
这是一个
//


多行注释"
```

作用域（scope）
全局作用域
函数作用域

函数执行时所在的作用域，是定义时的作用域，而不是调用时所在的作用域。


传递方式

传值传递（passes
by
value）
传址传递（pass
by
reference）


arguments对象包含了函数运行时的所有参数


转为数组
```js
var
args
=
Array.prototype.slice.call(arguments);

//
或者
var
args
=
[];
for
(var
i
=
0;
i
<
arguments.length;
i++)
{


args.push(arguments[i]);
}
```

闭包（closure）
"链式作用域"结构（chain
scope）
子对象会一级一级地向上寻找所有父对象的变量

闭包简单理解成“定义在一个函数内部的函数”
闭包就是将函数内部和函数外部连接起来的一座桥梁。


立即调用的函数表达式”（Immediately-Invoked
Function
Expression），简称
IIFE
```js
(function(){
/*
code
*/
}());
//
或者
(function(){
/*
code
*/
})();
```

匿名函数
一是不必为函数命名，避免了污染全局变量；
二是
IIFE
内部形成了一个单独的作用域，可以封装一些外部无法读取的私有变量。

##
数组
本质上，数组属于一种特殊的对象
数组的数字键不需要连续，length属性的值总是比最大的那个整数键大1

不推荐使用for...in遍历数组
for...in不仅会遍历数组所有的数字键，还会遍历非数字键

```js
var
a
=
[1,
2,
3];

//
for循环
for(var
i
=
0;
i
<
a.length;
i++)
{


console.log(a[i]);
}
```

空位就是数组没有这个元素，所以不会被遍历到，
而undefined则表示数组有这个元素，值是undefined，所以遍历不会跳过
```js
//
var
a
=
[,
,
,];

var
a
=
[undefined,
undefined,
undefined];

a.forEach(function
(x,
i)
{


console.log(i
+
'.
'
+
x);
});
//
0.
undefined
//
1.
undefined
//
2.
undefined

for
(var
i
in
a)
{


console.log(i);
}
//
0
//
1
//
2

Object.keys(a)
//
['0',
'1',
'2']
```

类似数组的对象（array-like
object）
将“类似数组的对象”变成真正的数组。
```js
var
arr
=
Array.prototype.slice.call(arrayLike);
```

##
运算符
相加“重载”（overload）：一个运算子是字符串，另一个运算子是非字符串，这时非字符串会转成字符串，再连接在一起
除了加法运算符，其他算术运算符（比如减法、除法和乘法）都不会发生重载。
它们的规则是：所有运算子一律转为数值，再进行相应的数学运算

对象的相加
首先，自动调用对象的valueOf方法

如果运算子是一个Date对象的实例，那么会优先执行toString方法

运算之后，变量的值发生变化，这种效应叫做运算的副作用（side
effect）

严格相等运算符比较的是地址

只通过第一个表达式的值，控制是否运行第二个表达式的机制，就称为“短路”（short-cut）

void(0)
主要用途是浏览器的书签工具（Bookmarklet），以及在超级链接中插入代码防止网页跳转。
```html
<a
href="javascript:
void(0);">文字</a>
```

建议总是使用圆括号，保证运算顺序清晰可读

##
类型转换
parseInt逐个解析字符，
而Number函数整体转换字符串的类型
String
Boolean

由于自动转换具有不确定性，而且不易除错，
建议在预期为布尔值、数值、字符串的地方，全部使用Boolean、Number和String函数进行显式转换

##
自定义错误
```js
function
UserError(message)
{


this.message
=
message
||
'默认信息';


this.name
=
'UserError';
}

UserError.prototype
=
new
Error();
UserError.prototype.constructor
=
UserError;

new
UserError('这是自定义的错误！');
```

throw语句的作用是手动中断程序执行，抛出一个错误

分号的自动添加”（Automatic
Semicolon
Insertion，简称
ASI）


##
Object
对象
实例方法就是定义在Object原型对象Object.prototype上的方法

获取属性
Object.keys()，
Object.getOwnPropertyNames()

判断这个值的类型
Object.prototype.toString.call(value)

```js
var
type
=
function
(o){


var
s
=
Object.prototype.toString.call(o);


return
s.match(/\[object
(.*?)\]/)[1].toLowerCase();
};

['Null',

'Undefined',

'Object',

'Array',

'String',

'Number',

'Boolean',

'Function',

'RegExp'
].forEach(function
(t)
{


type['is'
+
t]
=
function
(o)
{




return
type(o)
===
t.toLowerCase();


};
});

type.isObject({})
//
true
type.isNumber(NaN)
//
true
type.isRegExp(/abc/)
//
true

```

Object.getOwnPropertyDescriptor()方法可以获取属性描述对象
Object.keys只返回对象自身的可遍历属性的全部属性名
Object.getOwnPropertyNames会将它们都返回
Object.defineProperty()方法允许通过属性描述对象，定义或修改一个属性，然后返回修改后的对象

Object.prototype.valueOf()
Object.prototype.toString()

包装对象
原始类型：数值、字符串、布尔值
包装对象：Number、String、Boolean

Math数学功能

随机整数
```js
function
getRandomInt(min,
max)
{


return
Math.floor(Math.random()
*
(max
-
min
+
1))
+
min;
}

getRandomInt(1,
6)
//
5
```

RegExp
RegExp.prototype.test()
RegExp.prototype.exec()

JSON
JSON.stringify()
JSON.parse()

this
指代函数当前的运行环境

'use
strict'声明采用严格模式，
这时内部的this一旦指向顶层对象，就会报错。

call方法可以改变this的指向
Function.prototype.call()
接受多个参数
Function.prototype.apply()
接收一个数组

将函数体内的this绑定到某个对象，然后返回一个新函数
Function.prototype.bind()


继承
```js
//
父类
function
Shape()
{




this.x
=
0;




this.y
=
0;
}

//
父类方法
Shape.prototype.move
=
function
(x,
y)
{




this.x
+=
x;




this.y
+=
y;




console.info('Shape
moved.');
};


//
子类
//
第一步，子类继承父类的实例
function
Rectangle()
{




Shape.call(this);
//
调用父类构造函数
}

//
第二步，子类继承父类的原型
Rectangle.prototype
=
Object.create(Shape.prototype);
Rectangle.prototype.constructor
=
Rectangle;

var
rect
=
new
Rectangle();

console.log(rect
instanceof
Rectangle);
console.log(rect
instanceof
Shape);

//
true
//
true
```

Object.getPrototypeOf()
获取原型对象
Object.setPrototypeOf()
Object.create()
Object.getOwnPropertyNames
不包含继承的属性键名
Object.prototype.hasOwnProperty()
判断某个属性定义在对象自身


取消当前所有的setTimeout定时器
```js
var
gid
=
setInterval(clearAllTimeouts,
0);

function
clearAllTimeouts()
{




var
id
=
setTimeout(function()
{},
0);




while
(id
>
0)
{






if
(id
!==
gid)
{








clearTimeout(id);






}






id--;




}


}
```
debounce（防抖动）
```js
$('textarea').on('keydown',
debounce(ajaxAction,
2500));

function
debounce(fn,
delay){


var
timer
=
null;
//
声明计时器


return
function()
{




var
context
=
this;




var
args
=
arguments;




clearTimeout(timer);




timer
=
setTimeout(function
()
{






fn.apply(context,
args);




},
delay);


};
}
```

“文档对象模型”（Document
Object
Model）


使用数组方法，可以将其转为真正的数组
```js
var
children
=
document.body.childNodes;
var
nodeArr
=
Array.prototype.slice.call(children);
```


