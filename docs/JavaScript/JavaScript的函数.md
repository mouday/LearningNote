# JavaScript的函数
函数不但是“头等公民”，而且可以像变量一样使用，具有非常强大的抽象能力
借助抽象，我们才能不关心底层的具体计算过程，而直接在更高的层次上思考问题。

定义函数
```
function abs(x) {
    if (x >= 0) {
        return x;
    } else {
        return -x;
    }
}

// 匿名函数
var abs = function (x) {
    if (x >= 0) {
        return x;
    } else {
        return -x;
    }
};  // 末尾加一个;，表示赋值语句结束
```

如果没有return语句，返回结果为undefined

JavaScript的函数也是一个对象，而函数名可以视为指向该函数的变量

JavaScript允许传入任意个参数而不影响调用，因此传入的参数比定义的参数多也没有问题，虽然函数内部并不需要这些参数

```
abs(10, 'blablabla'); // 返回10
abs(); // 返回NaN
```

参数进行检查
```
function abs(x) {
    if (typeof x !== 'number') {
        throw 'Not a number';
    }
    if (x >= 0) {
        return x;
    } else {
        return -x;
    }
}
```

arguments：获得调用者传入的所有参数，类似Array但它不是一个Array
```
function foo(x) {
    console.log('x = ' + x); // 10
    for (var i=0; i<arguments.length; i++) {
        console.log('arg ' + i + ' = ' + arguments[i]); // 10, 20, 30
    }
}

foo(10, 20, 30);
```

ES6标准引入了rest参数
```
function foo(a, b, ...rest) {
    console.log('a = ' + a);
    console.log('b = ' + b);
    console.log(rest);
}

foo(1, 2, 3, 4, 5);
// 结果:
// a = 1
// b = 2
// Array [ 3, 4, 5 ]
```

小心你的return语句
```
function foo() {
    return
        { name: 'foo' };
}

foo(); // undefined

// 上面的代码实际上变成了
function foo() {
    return; // 自动添加了分号，相当于return undefined;
        { name: 'foo' }; // 这行语句已经没法执行到了
}

// 所以正确的多行写法是
function foo() {
    return { // 这里不会自动加分号，因为{表示语句尚未结束
        name: 'foo'
    };
}
```

# 变量作用域与解构赋值
在JavaScript中，用var申明的变量实际上是有作用域的

在函数体内部申明的变量，作用域为整个函数体
```
function foo() {
    var x = 1;
    x = x + 1;
}

x = x + 2; // ReferenceError! 无法在函数体外引用变量x
```

由于JavaScript的函数可以嵌套，内部函数可以访问外部函数定义的变量，反过来则不行
```
function foo() {
    var x = 1;
    function bar() {
        var y = x + 1; // bar可以访问foo的变量x!
    }
    var z = y + 1; // ReferenceError! foo不可以访问bar的变量y!
}
```
JavaScript的函数在查找变量时从自身函数定义开始，从“内”向“外”查找。
如果内部函数定义了与外部函数重名的变量，则内部函数的变量将“屏蔽”外部函数的变量。

变量提升
JavaScript的函数定义有个特点，它会先扫描整个函数体的语句，把所有申明的变量“提升”到函数顶部
```
function foo() {
    var x = 'Hello, ' + y;
    console.log(x);
    var y = 'Bob';
}

foo();

// 相当于
function foo() {
    var y; // 提升变量y的申明，此时y为undefined
    var x = 'Hello, ' + y;
    console.log(x);
    y = 'Bob';
}
```

“在函数内部首先申明所有变量”这一规则。
最常见的做法是用一个var申明函数内部用到的所有变量
```
function foo() {
    var
        x = 1, // x初始化为1
        y = x + 1, // y初始化为2
        z, i; // z和i为undefined
    // 其他语句:
    for (i=0; i<100; i++) {
        ...
    }
}
```

全局作用域
不在任何函数内定义的变量就具有全局作用域。
实际上，JavaScript默认有一个全局对象window，全局作用域的变量实际上被绑定到window的一个属性

```
var course = 'Learn JavaScript';
alert(course); // 'Learn JavaScript'
alert(window.course); // 'Learn JavaScript'
```

名字空间
减少冲突的一个方法是把自己的所有变量和函数全部绑定到一个全局变量中。例如：
```
// 唯一的全局变量MYAPP:
var MYAPP = {};

// 其他变量:
MYAPP.name = 'myapp';
MYAPP.version = 1.0;

// 其他函数:
MYAPP.foo = function () {
    return 'foo';
};
```

局部作用域

JavaScript的变量作用域实际上是函数内部，
我们在for循环等语句块中是无法定义具有局部作用域的变量的：

```
function foo() {
    for (var i=0; i<100; i++) {
        //
    }
    i += 100; // 仍然可以引用变量i
}
```
块级作用域

ES6引入了新的关键字let，用let替代var可以申明一个块级作用域的变量
```
function foo() {
    var sum = 0;
    for (let i=0; i<100; i++) {
        sum += i;
    }
    // SyntaxError:
    i += 1;
}
```
常量

```
// 大写的变量表示
var PI = 3.14;

// ES6标准引入了新的关键字const来定义常量，const与let都具有块级作用域
const PI = 3.14;

```
解构赋值
从ES6开始，JavaScript引入了解构赋值，可以同时对一组变量进行赋值。
```
// 把一个数组的元素分别赋值给几个变量：
var array = ['hello', 'JavaScript', 'ES6'];

var x = array[0];
var y = array[1];
var z = array[2];

// ES6中，可以使用解构赋值，直接对多个变量同时赋值
var [x, y, z] = ['hello', 'JavaScript', 'ES6'];

// 忽略前两个元素，只对z赋值第三个元素
let [, , z] = ['hello', 'JavaScript', 'ES6']; 

// 对象解构赋值
var person = {
    name: '小明',
    age: 20,
    gender: 'male',
    passport: 'G-12345678',
    school: 'No.4 middle school'
};
var {name, age, passport} = person;

// 把passport属性赋值给变量id:
let {name, passport:id} = person;

// 如果person对象没有single属性，默认赋值为true:
var {name, single=true} = person;

// 先声明变量再赋值
var x, y;

// JavaScript引擎把{开头的语句当作了块处理，于是=不再合法，用小括号括起来
({x, y} = { name: '小明', x: 100, y: 200});
```

使用场景
```
// 交换两个变量x和y的值
var x=1, y=2;
[x, y] = [y, x];

// 快速获取当前页面的域名和路径
var {hostname:domain, pathname:path} = location;

// 函数接收一个对象作为参数
function buildDate({year, month, day, hour=0, minute=0, second=0}) {
    return new Date(year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
}
```

# 方法
对象的方法: 在对象中绑定函数

```
var xiaoming = {
    name: '小明',
    birth: 1990,

    age: function () {
        var y = new Date().getFullYear();
        return y - this.birth;
    }
};

xiaoming.age; // function xiaoming.age()
xiaoming.age(); // 今年调用是25,明年调用就变成26了

// 拆开写
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25, 正常结果
getAge(); // NaN
```
在一个方法内部，this是一个特殊变量，它始终指向当前对象

以对象.方法形式调用，比如xiaoming.age()，该函数的this指向被调用的对象
单独调用函数，比如getAge()，此时，该函数的this指向全局对象，也就是window。
在strict模式, 函数的this指向undefined

内部嵌套使用this
```
var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        var that = this; // 在方法内部一开始就捕获this

        function getAgeFromBirth() {
            var y = new Date().getFullYear();
            return y - that.birth; // 用that而不是this
        }
        return getAgeFromBirth();
    }
};

xiaoming.age(); // 25
```

apply指定this指向对象

指定函数的this指向哪个对象，可以用函数本身的apply方法
第一个参数就是需要绑定的this变量，第二个参数是Array，表示函数本身的参数
```
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25
getAge.apply(xiaoming, []); // 25, this指向xiaoming, 参数为空
```
apply()把参数打包成Array再传入；
call()把参数按顺序传入。
```
Math.max.apply(null, [3, 5, 4]); // 5
Math.max.call(null, 3, 5, 4); // 5
```

普通函数调用，我们通常把this绑定为null

装饰器
利用apply()， 还可以动态改变函数的行为
eg:
```
// 统计一下代码一共调用了多少次parseInt()
var count = 0;
var oldParseInt = parseInt; // 保存原函数

window.parseInt = function () {
    count += 1;
    return oldParseInt.apply(null, arguments); // 调用原函数
};
```

非严格模式中：

1.在全局环境中this始终指向window
```
console.log(this); //window
```
2.在普通方法内部，this指向他的调用者

作为普通函数调用：
```
function f(){
    return this;
}
console.log(f()); // window
```
作为对象方法调用：
```
var obj = {
    prop: 37,
    f: function(){
        return this.prop;
    }
}

console.log(obj.f()); //37
```

3.在箭头函数内部，this被设置为函数创建时，将函数用‘{ }’封闭的词法作用域中的this
```
var obj = {
    prop: 37,
    f: function(){
        return () => {return this.prop; }
    }
}
console.log(obj.f()()); //37
```
在箭头函数创建时，被f函数的‘{ }’封闭，所以箭头函数的this指向f函数的this，
而作为对象方法被调用的f函数的this就是obj,因此箭头函数的this也是obj

# 高阶函数Higher-order function
JavaScript的函数其实都指向某个变量。
既然变量可以指向函数，函数的参数能接收变量，那么一个函数就可以接收另一个函数作为参数

```
function add(x, y, f) {
    return f(x) + f(y);
}
```

map映射
```
var arr = [1, 2, 3];
arr.map(String); // ['1', '2', '3']
```

reduce归约
```
var arr = [1, 3, 5, 7, 9];
arr.reduce(function (x, y) {
    return x + y;
}); // 25
```

filter过滤
```
// 在一个Array中，删掉偶数，只保留奇数，可以这么写

var arr = [1, 2, 4, 5, 6, 9, 10, 15];

var r = arr.filter(function (x) {
    return x % 2 !== 0;
});
r; // [1, 5, 9, 15]

// 回调函数，可以有多个参数
var arr = ['A', 'B', 'C'];
var r = arr.filter(function (element, index, self) {
    console.log(element); // 依次打印'A', 'B', 'C'
    console.log(index); // 依次打印0, 1, 2
    console.log(self); // self就是变量arr
    return true;
});
```
sort排序
```
var arr = [10, 20, 1, 2];

arr.sort(function (x, y) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
});
console.log(arr); // [1, 2, 10, 20]

```

every
判断数组的所有元素是否满足测试条件
```
var arr = ['Apple', 'pear', 'orange'];
console.log(arr.every(function (s) {
    return s.length > 0;
})); // true, 因为每个元素都满足s.length>0

```

find
用于查找符合条件的第一个元素，如果找到了，返回这个元素，否则，返回undefined
```
var arr = ['Apple', 'pear', 'orange'];
console.log(arr.find(function (s) {
    return s.toLowerCase() === s;
})); // 'pear', 因为pear全部是小写
```

findIndex
查找符合条件的第一个元素，返回这个元素的索引，如果没有找到，返回-1
```
var arr = ['Apple', 'pear', 'orange'];
console.log(arr.findIndex(function (s) {
    return s.toLowerCase() === s;
})); // 1, 因为'pear'的索引是1
```

forEach
它也把每个元素依次作用于传入的函数，但不会返回新的数组。
forEach()常用于遍历数组，因此，传入的函数不需要返回值
```
var arr = ['Apple', 'pear', 'orange'];
arr.forEach(console.log); // 依次打印每个元素
```

# 闭包
函数作为返回值
高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回

闭包（Closure）内部函数引用外部函数的参数和局部变量，
当返回函数时，相关参数和变量都保存在返回的函数中(夹带私货)

返回闭包时牢记的一点:
返回函数不要引用任何循环变量，或者后续会发生变化的变量

利用闭包创建新的函数
```
function make_pow(n) {
    return function (x) {
        return Math.pow(x, n);
    }
}

// 创建两个新函数:
var pow2 = make_pow(2);
var pow3 = make_pow(3);

console.log(pow2(5)); // 25
console.log(pow3(7)); // 343

```

箭头函数
ES6标准新增 Arrow Function 匿名函数
```
x => x * x

// 上面的箭头函数相当于

function (x) {
    return x * x;
}
```
只包含一个表达式，连{ ... }和return都省略掉了
包含多条语句，这时候就不能省略{ ... }和return

```
x => {
    if (x > 0) {
        return x * x;
    }
    else {
        return - x * x;
    }
}
```

```
// 两个参数:
(x, y) => x * x + y * y

// 无参数:
() => 3.14

// 可变参数:
(x, y, ...rest) => {
    var i, sum = x + y;
    for (i=0; i<rest.length; i++) {
        sum += rest[i];
    }
    return sum;
}

// 返回一个对象
x => ({ foo: x })
```

箭头函数完全修复了this的指向，this总是指向词法作用域,也就是外层调用者obj
```
var obj = {
    birth: 1990,
    getAge: function () {
        var b = this.birth; // 1990
        var fn = () => new Date().getFullYear() - this.birth; // this指向obj对象
        return fn();
    }
};
obj.getAge(); // 25
```
箭头函数和匿名函数有个明显的区别：
箭头函数内部的this是词法作用域，由上下文确定。

generator（生成器）
是ES6标准引入,借鉴了Python的generator的概念和语法
```

function fib(max) {
    var t,
        a = 0,
        b = 1,
        n = 0;

    while (n < max) {
        yield a;
        [a, b] = [b, a + b];
        n ++;
    }
    return;
}

var f = fib(5);
f.next(); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: undefined, done: true}

// for ... of循环迭代generator对象
for (var x of fib(10)) {
    console.log(x); // 依次输出0, 1, 1, 2, 3, ...
}
```

AJAX示例
```
ajax('http://url-1', data1, function (err, result) {
    if (err) {
        return handle(err);
    }
    ajax('http://url-2', data2, function (err, result) {
        if (err) {
            return handle(err);
        }
        ajax('http://url-3', data3, function (err, result) {
            if (err) {
                return handle(err);
            }
            return success(result);
        });
    });
});
回调越多，代码越难看。

// 有了generator的美好时代，用AJAX时可以这么写：
try {
    r1 = yield ajax('http://url-1', data1);
    r2 = yield ajax('http://url-2', data2);
    r3 = yield ajax('http://url-3', data3);
    success(r3);
}
catch (err) {
    handle(err);
}

看上去是同步的代码，实际执行是异步的。
```
