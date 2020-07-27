
# 标准对象
在JavaScript的世界里，一切都是对象。
typeof操作符获取对象的类型
number、string、boolean、function和undefined、object
```
typeof 123; // 'number'
typeof NaN; // 'number'
```

包装对象
```
var n = new Number(123); // 123,生成了新的包装类型， 不推荐

// 不使用new
var n = Number('123'); // 123，不推荐； 相当于parseInt()或parseFloat() 推荐

```

规则：
```
不要使用new Number()、new Boolean()、new String()创建包装对象；

用parseInt()或parseFloat()来转换任意类型到number；

用String()来转换任意类型到string，或者直接调用某个对象的toString()方法；

通常不必把任意类型转换为boolean再判断，因为可以直接写if (myVar) {...}；

typeof操作符可以判断出number、boolean、string、function和undefined；

判断Array要使用Array.isArray(arr)；

判断null请使用myVar === null；

判断某个全局变量是否存在用typeof window.myVar === 'undefined'；

函数内部判断某个变量是否存在用typeof myVar === 'undefined'。
```

```
123.toString(); // SyntaxError

123..toString(); // '123', 注意是两个点！
(123).toString(); // '123'
```

# Date
```
// 获取时间
var now = new Date();
now; // Wed Jun 24 2015 19:49:22 GMT+0800 (CST)
now.getFullYear(); // 2015, 年份
now.getMonth(); // 5, 月份，注意月份范围是0~11，5表示六月
now.getDate(); // 24, 表示24号
now.getDay(); // 3, 表示星期三
now.getHours(); // 19, 24小时制
now.getMinutes(); // 49, 分钟
now.getSeconds(); // 22, 秒
now.getMilliseconds(); // 875, 毫秒数
now.getTime(); // 1435146562875, 以number形式表示的时间戳

// 创建时间
var d = new Date(2015, 5, 19, 20, 15, 30, 123);
var d = new Date(1435146562875);

// 解析时间
var d = Date.parse('2015-06-24T19:49:22.875+08:00');
d; // 1435146562875

```
JavaScript的Date对象月份值从0开始，牢记0=1月，1=2月，2=3月，……，11=12月。

# RegExp
```
\d      匹配一个数字
\w      匹配一个字母或数字
[]      表示范围
A|B     可以匹配A或B
^       行的开头
$       行的结束

*       任意个字符（包括0个）
+       至少一个字符
?       0个或1个字符
{n}     n个字符
{n,m}   n-m个字符
```
示例
```
var re1 = /ABC\-001/;
var re2 = new RegExp('ABC\\-001');

re1; // /ABC\-001/
re2; // /ABC\-001/


var re = /^\d{3}\-\d{3,8}$/;
re.test('010-12345'); // true
```
切分字符串
```
'a b   c'.split(' '); // ['a', 'b', '', '', 'c']

// 正则表达式试试
'a b   c'.split(/\s+/); // ['a', 'b', 'c']
```

分组（Group）
```
var re = /^(\d{3})-(\d{3,8})$/;
re.exec('010-12345'); // ['010-12345', '010', '12345']
```

正则匹配默认是贪婪匹配
非贪婪匹配
```
var re = /^(\d+?)(0*)$/;
re.exec('102300'); // ['102300', '1023', '00']
```

全局搜索
```
var r1 = /test/g;
// 等价于:
var r2 = new RegExp('test', 'g');


var s = 'JavaScript, VBScript, JScript and ECMAScript';
var re=/[a-zA-Z]+Script/g;

// 使用全局匹配:
re.exec(s); // ['JavaScript']
re.lastIndex; // 10

re.exec(s); // ['VBScript']
re.lastIndex; // 20

```
i标志，表示忽略大小写
m标志，表示执行多行匹配

# JSON
JavaScript Object Notation
```
number：和JavaScript的number完全一致；
boolean：就是JavaScript的true或false；
string：就是JavaScript的string；
null：就是JavaScript的null；
array：就是JavaScript的Array表示方式——[]；
object：就是JavaScript的{ ... }表示方式。
```
JSON还定死了字符集必须是UTF-8，表示多语言就没有问题了。
为了统一解析，JSON的字符串规定必须用双引号""，
Object的键也必须用双引号""

序列化
```
var xiaoming = {
    name: '小明',
    age: 14,
    gender: true,
    height: 1.65,
    grade: null,
    'middle-school': '\"W3C\" Middle School',
    skills: ['JavaScript', 'Java', 'Python', 'Lisp']
};

var s = JSON.stringify(xiaoming);

// 按缩进输出：
JSON.stringify(xiaoming, null, '  ');

// 输出指定的属性
JSON.stringify(xiaoming, ['name', 'skills'], '  ');

// 每个键值对都会被函数先处理
function convert(key, value) {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    return value;
}

JSON.stringify(xiaoming, convert, '  ');

// 精确控制如何序列化
var xiaoming = {
    name: '小明',
    age: 14,
    gender: true,
    height: 1.65,
    grade: null,
    'middle-school': '\"W3C\" Middle School',
    skills: ['JavaScript', 'Java', 'Python', 'Lisp'],
    toJSON: function () {
        return { // 只输出name和age，并且改变了key：
            'Name': this.name,
            'Age': this.age
        };
    }
};

JSON.stringify(xiaoming); // '{"Name":"小明","Age":14}'

```
反序列化

```
JSON.parse('[1,2,3,true]'); // [1, 2, 3, true]

// 转换解析出的属性
var obj = JSON.parse('{"name":"小明","age":14}', function (key, value) {
    if (key === 'name') {
        return value + '同学';
    }
    return value;
});

console.log(JSON.stringify(obj)); // {name: '小明同学', age: 14}

```

