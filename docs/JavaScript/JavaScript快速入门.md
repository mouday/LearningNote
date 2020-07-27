JavaScript
https://www.liaoxuefeng.com/wiki/1022910821149312

# 基本语法
```javascript
alert("hello word!")
console.log("hello word!");  // 避免弹出烦人的对话框

// JavaScript严格区分大小写

// 单行注释
/*多行注释*/

// 赋值语句, 每个语句用;表示语句结束
var x = 1;

// 语句块是一组语句的集合, 可以嵌套
if (2 > 1) {
    // do something
}

```

# 数据类型和变量

1、Number
JavaScript不区分整数和浮点数
```javascript
123; // 整数123
0.456; // 浮点数0.456
1.2345e3; // 科学计数法表示1.2345x1000，等同于1234.5
-99; // 负数
NaN; // NaN表示Not a Number
Infinity; // Infinity表示无限大
// 十六进制用0x前缀和0-9，a-f表示 eg: 0xff00
```
支持四则运算，%是求余运算

2、字符串
单引号'或双引号"

3、布尔值
true、false
```
&& 与运算
|| 或运算
!  非运算
```

相等运算符
```javascript
==  // 自动转换数据类型再比较
=== // 不会自动转换数据类型(推荐)
```

唯一能判断NaN的方法是： 
```
isNaN(NaN)
```

浮点数在运算过程中会产生误差，因为计算机无法精确表示无限循环小数

```javascript
null       // 表示一个“空” 大多数情况下使用
0          // 一个数值
''         // 表示长度为0的字符串
undefined  // 表示“未定义”
```

4、数组
数组是一组按顺序排列的集合，集合的每个值称为元素。
JavaScript的数组可以包括任意数据类型。例如：
```javascript
[1, 2, 3.14, 'Hello', null, true];  // 推荐
new Array(1, 2, 3);
```
索引的起始值为0

5、对象

JavaScript的对象是一组由键-值组成的无序集合，例如：
```
var person = {
    name: 'Bob',
    age: 20,
    tags: ['js', 'web', 'mobile'],
    city: "Beijing",
    hasCar: true,
    zipcode: null
};
```
JavaScript对象的键都是字符串类型，值可以是任意数据类型
每个键又称为对象的属性

获取一个对象的属性
```javascript
// 对象变量.属性名
person.name; // 'Bob'
person.zipcode; // null

```

变量
申明一个变量用var语句, 只能申明一次

```
var a;       // 申明了变量a，此时a的值为undefined
var $b = 1;  // 申明了变量$b，同时给$b赋值，此时$b的值为1
```

可以把任意数据类型赋值给变量，同一个变量可以反复赋值，而且可以是不同类型的变量
```
var a = 123; // a的值是整数123
a = 'ABC'; // a变为字符串
```

动态语言: 变量本身类型不固定的语言
静态语言: 在定义变量时必须指定变量类型，如果赋值的时候类型不匹配，就会报错，如Java

strict模式
如果一个变量没有通过var申明就被使用，那么该变量就自动被申明为全局变量

strict模式: 强制通过var申明变量，未使用var申明变量就使用的，将导致运行错误

启用strict模式
```
'use strict';
```
# 字符串
JavaScript字符串就是用''或""括起来的字符表示

转义字符
```
\n 表示换行
\t 表示制表符
\\ 表示的字符就是\
```
ASCII字符可以以\x##形式的十六进制表示：
```
'\x41'; // 完全等同于 'A'
```
还可以用\u####表示一个Unicode字符：
```
'\u4e2d\u6587'; // 完全等同于 '中文'
```

多行字符串
最新的ES6标准
```
`这是一个
多行
字符串`;
```

模板字符串
```
var name = '小明';
var age = 20;

// + 拼接
var message = '你好, ' + name + ', 你今年' + age + '岁了!';

// 模板字符串 ES6新增
var message = `你好, ${name}, 你今年${age}岁了!`;

```

操作字符串
```
var s = 'Hello, world!';
s.length; // 13

s[0]; // 'H'

```
字符串是不可变的
调用方法，本身不会改变原有字符串的内容，而是返回一个新字符串
```
toUpperCase()  // 变为大写
toLowerCase()  // 变为小写
indexOf()      // 搜索指定字符串出现的位置
substring()    // 返回指定索引区间的子串
```

eg:
```
var s = 'Hello';
s.toUpperCase(); // 返回'HELLO'

var lower = s.toLowerCase(); // 返回'hello'并赋值给变量lower

```
eg:
```
var s = 'hello, world';
s.indexOf('world'); // 返回7
s.indexOf('World'); // 没有找到指定的子串，返回-1

s.substring(0, 5); // 从索引0开始到5（不包括5），返回'hello'
s.substring(7); // 从索引7开始到结束，返回'world'

```

# 数组
JavaScript的Array可以包含任意数据类型，并通过索引来访问每个元素
```
var arr = [1, 2, 3.14, 'Hello', null, true];
arr.length; // 长度 6

arr[1] = 99; // 修改

```
可以修改length, 不建议
索引超过了范围，arr长度会变化, 建议：索引不要越界

常用方法
```
indexOf()  // 搜索一个指定的元素的位置
slice()    // 切片
push()     // 末尾添加若干元素
pop()      // 把Array的最后一个元素删除掉
unshift()  // 往Array的头部添加若干元素
shift()    // 把Array的第一个元素删掉
sort()     // 对当前Array进行排序
reverse()  // 把整个Array的元素反转
splice()   // 替换元素
concat()   // 拼接数组, 返回了一个新的Array
join()     // 把当前Array的每个元素都用指定的字符串连接起来，然后返回连接后的字符串
```

```
var arr = [10, 20, '30', 'xyz'];
arr.indexOf(10); // 元素10的索引为0

var arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
arr.slice(0, 3); // 从索引0开始，到索引3结束，但不包括索引3: ['A', 'B', 'C']
arr.slice(3); // 从索引3开始到结束: ['D', 'E', 'F', 'G']

// 注意到slice()的起止参数包括开始索引，不包括结束索引。
// 如果不给slice()传递任何参数，它就会从头到尾截取所有元素。
// 利用这一点，我们可以很容易地复制一个Array

var arr = [1, 2];
arr.push('A', 'B'); // 返回Array新的长度: 4
arr; // [1, 2, 'A', 'B']
arr.pop(); // pop()返回'B'
arr; // [1, 2, 'A']
arr.pop(); arr.pop(); arr.pop(); // 连续pop 3次
arr; // []
arr.pop(); // 空数组继续pop不会报错，而是返回undefined
arr; // []

var arr = [1, 2];
arr.unshift('A', 'B'); // 返回Array新的长度: 4
arr; // ['A', 'B', 1, 2]
arr.shift(); // 'A'
arr; // ['B', 1, 2]
arr.shift(); arr.shift(); arr.shift(); // 连续shift 3次
arr; // []
arr.shift(); // 空数组继续shift不会报错，而是返回undefined
arr; // []

var arr = ['B', 'C', 'A'];
arr.sort();
arr; // ['A', 'B', 'C']

var arr = ['one', 'two', 'three'];
arr.reverse(); 
arr; // ['three', 'two', 'one']

var arr = ['Microsoft', 'Apple', 'Yahoo', 'AOL', 'Excite', 'Oracle'];
// 从索引2开始删除3个元素,然后再添加两个元素:
arr.splice(2, 3, 'Google', 'Facebook'); // 返回删除的元素 ['Yahoo', 'AOL', 'Excite']
arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']
// 只删除,不添加:
arr.splice(2, 2); // ['Google', 'Facebook']
arr; // ['Microsoft', 'Apple', 'Oracle']
// 只添加,不删除:
arr.splice(2, 0, 'Google', 'Facebook'); // 返回[],因为没有删除任何元素
arr; // ['Microsoft', 'Apple', 'Google', 'Facebook', 'Oracle']

var arr = ['A', 'B', 'C'];
var added = arr.concat([1, 2, 3]);
added; // ['A', 'B', 'C', 1, 2, 3]
arr; // ['A', 'B', 'C']

// 实际上，concat()方法可以接收任意个元素和Array，并且自动把Array拆开，然后全部添加到新的Array里：
var arr = ['A', 'B', 'C'];
arr.concat(1, 2, [3, 4]); // ['A', 'B', 'C', 1, 2, 3, 4]

var arr = ['A', 'B', 'C', 1, 2, 3];
arr.join('-'); // 'A-B-C-1-2-3'
// 如果Array的元素不是字符串，将自动转换为字符串后再连接

```

多维数组
```
var arr = [[1, 2, 3], [400, 500, 600], '-'];
```

# 对象
JavaScript的对象是一种无序的集合数据类型，它由若干键值对组成

```
var xiaohong = {
    name: '小红',
    'middle-school': 'No.1 Middle School'   // 包含特殊字符
};

// 访问属性 object.prop
xiaohong['middle-school']; // 'No.1 Middle School'
xiaohong.name; // '小红'

// 检查属性
'name' in xiaoming; // true

// 检查自身属性
xiaoming.hasOwnProperty('name');

```
JavaScript规定，访问不存在的属性不报错，而是返回undefined

可以自由地给一个对象添加或删除属性
```
var xiaoming = {
    name: '小明'
};
xiaoming.age; // undefined
xiaoming.age = 18; // 新增一个age属性
xiaoming.age; // 18

delete xiaoming.age; // 删除age属性
xiaoming.age; // undefined
delete xiaoming['name']; // 删除name属性
xiaoming.name; // undefined
delete xiaoming.school; // 删除一个不存在的school属性也不会报错
```

所有对象最终都会在原型链上指向object

# 条件判断

```
if () 
{ ... } 
else 
{ ... }
```
如果语句块只包含一条语句，那么可以省略{}, 不推荐

多行条件判断
```
if () 
{ ... } 
else if ()
{ ... }
else 
{ ... }
```
JavaScript把null、undefined、0、NaN和空字符串''视为false，其他值一概视为true

# 循环

```
for(初始条件; 递增条件; 结束条件){

}

for (;;) {} // 无限循环 ，break语句退出循环

```

遍历数组
```
var arr = ['Apple', 'Google', 'Microsoft'];
var i, x;

for (i=0; i<arr.length; i++) {
    x = arr[i];
    console.log(x);
}
```

for循环
```
// 对象
var o = {
    name: 'Jack',
    age: 20,
    city: 'Beijing'
};
for (var key in o) {
    console.log(key); // 'name', 'age', 'city'
}

// 数组
var a = ['A', 'B', 'C'];
for (var index in a) {
    console.log(index); // '0', '1', '2'  得到的是String而不是Number
    console.log(a[index]); // 'A', 'B', 'C'
}
```

for和while循环则可能一次都不执行
do ... while  至少执行1次

# Map和Set
ES6标准新增
Map
JavaScript的对象键必须是字符串
Map 是一组键值对的结构，具有极快的查找速度
```
var m = new Map([['Michael', 95], ['Bob', 75], ['Tracy', 85]]);
m.get('Michael'); // 95

m.set('Adam', 67); // 添加新的key-value
m.has('Adam'); // 是否存在key 'Adam': true
m.get('Adam'); // 67
m.delete('Adam'); // 删除key 'Adam'
m.get('Adam'); // undefined
```

Set
一组key的集合
```
var s = new Set([1, 2, 3]); // 含1, 2, 3

s.add(4);  // Set {1, 2, 3, 4}
s.delete(3); 
s.has(1)   // true
```

# iterable
遍历Map和Set就无法使用下标

ES6标准新增
Array、Map和Set都属于iterable类型

具有iterable类型的集合可以通过新的for ... of循环来遍历
```
var a = ['A', 'B', 'C'];
var s = new Set(['A', 'B', 'C']);
var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);

for (var x of a) { // 遍历Array
    console.log(x);
}
for (var x of s) { // 遍历Set
    console.log(x);
}
for (var x of m) { // 遍历Map
    console.log(x[0] + '=' + x[1]);
}
```

for ... in 遍历对象的属性名称, 一个Array数组实际上也是一个对象，它的每个元素的索引被视为一个属性
for ... of 只循环集合本身的元素

iterable内置的forEach方法(ES5.1标准引入)
```
a.forEach(function (element, index, array) {
    // element: 指向当前元素的值
    // index: 指向当前索引
    // array: 指向Array对象本身
    console.log(element + ', index = ' + index);
});
```

Set与Array类似，但Set没有索引: element, sameElement, set
Map的回调函数参数依次为: value、key和map本身

JavaScript的函数调用不要求参数必须一致，因此可以忽略它们

```
var a = ['A', 'B', 'C'];
a.forEach(function (element) {
    console.log(element);
});
```


