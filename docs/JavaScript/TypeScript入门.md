# TypeScript入门

## 简介
1. 微软开发
2. Javascript超集
3. 遵循ES6

Google 使用 TypeScript 开发了 Angular2框架

运行环境
概念，语法，特性

ES5、ES6 是TypeScript规范
TypeScript 是JavaScript 超集

TypeScript - compiler -> JavaScript

在线compiler
http://www.typescriptlang.org/index.html

安装开发环境
```bash
# 确保npm已安装
npm --version
6.9.0

# 安装
npm install -g typescript

# 查看版本
tsc --version
Version 3.7.4

# 编译
tsc demo.ts
```

demo.ts
```ts
exports class Demo{}
```

转换后的代码
```js
"use strict";
exports.__esModule = true;
var Demo = /** @class */ (function () {
    function Demo() {
    }
    return Demo;
}());
exports.Demo = Demo;

```
使用IDE WebStrom 配置保存编译
1、打开 WebStrom -> Preferences -> Languages & Frameworks -> TypeScript
2、设置 Node interpreter 和 TypeScript  
3、勾选 Recompile on changes

字符串特性
1、多行字符串
```js
var name = `
first line
second line
`
```

2、字符串模板
```js
var name = `hello ${name} ${getName()}`
```

3、自动拆分字符串
```js
function test(template, name, age){
}

var name = 'Tom',

var getAge = function(){
    return 18
}

test`my name is ${name} i'm ${age}`
//相当于 test(["my name is ", " i'm ", ""], name, age)
```

4、指定类型
```js
// 指定变量类型
var woname: string = "Tom";

var alias: any = '12';

var age: number = 12;

var man: boolean = true;

// 定义类中元素类型
class Person {
    name: string;
    age: number;
}

var person = new Person();
person.name = "Jack";
person.age = 23;
console.log(person);
```

5、函数参数
```js
// 指定函数参数和返回值类型
function test(name: string): void {

}

// 设置默认参数, 要声明到最后
function test2(name: string = 'default'): void {

}

// 设置可选参数,要声明明到必选参数之后
function test3(age?: number, name: string = 'default'): void {

}

test2('demo')
test3()

// 任意数量参数
function test4(...args) {
    args.forEach(arg => {
        console.log(arg);
    })
}

test4(1, 2, 3)

// 解包数组ts不支持
function test5(a, b, c) {
}

var args = [1, 2, 3]
test5(...args)
```

6、generator函数
```js
// generator函数，手工控制程序执行 ts不支持
// babeljs: https://www.babeljs.cn/repl
function* test6() {
    yield;
    console.log("log");
}
test6().next()

function* getStock(num: number) {
    let count = 0
    while (true) {
        yield Math.random()
        if (count > num) {
            break
        }
    }
}

console.log(getStock().next().value)
```

7、析构表达式
```js
// 对象析构表达式, 可以取别名, 获取嵌套表达式内容,可以有多余的值
const { name1: name2, age1: { age2 } } = {
    name1: "Tom",
    age1: { age2: 23 },
}
console.log(name2, age2);

// 数组析构表达式，位置取
var [a, b, ...others] = [1, 2, 3, 4];
console.log(a, b, others);
// 1 2 [ 3, 4 ]

```

8、箭头函数
```js
// 箭头函数匿名表达式, 消除this带来的问题
var sum = (arg1, arg2) => { arg1 + arg2 };

console.log([1, 2, 3, 4].filter(value => value % 2 == 0));
// [ 2, 4 ]
```
9、循环
```js
// forEach 循环
var list = [1, 2, 3];

list.forEach(value => {
    console.log(value);
});

// for-in循环打印下标
for (let index in list) {
    console.log(index);
}

// for-of循环打印值
for (let value of list) {
    console.log(value);
}

// 打印字符串
// for (let s of 'munber') {
//     console.log(s);
// }
```

10、面向对象
```js
// class是TS和核心
class Student {
    // 访问控制符，默认
    public name;

    // 外部不能访问，只能在内部访问
    private age;

    // 内部和子类访问，外部不能访问
    protected sex;

    // 构造函数，实例化时候被调用, 可以申明属性
    constructor(public school: string) {
        console.log("constructor");

    }

    eat() {
        console.log("eat");

    }
}

// 实例化
let s1 = new Student('school');
s1.name = 'Tom';
console.log(s1.school);

s1.eat();
```

11、类的继承
```js
class LittleStudent extends Student {
    // 子类自己的数据
    code: string;

    constructor(code: string) {
        // 必须要调用父类构造函数
        super('school');
        this.code = code;
        console.log("LittleStudent");

    }

    work() {
        // 调用父类的方法
        super.eat();
        this.eat();
    }
}

let ls1 = new LittleStudent('LittleStudent');
ls1.eat();
ls1.work();
```

12、泛型
```js
// 泛型 只能放某个类型元素
let intList: Array<number> = [];
intList.push(1);
// intList.push('2'); 报错
```

13、接口
```js
// 接口 代码约定
interface IHuman {
    name: string;
    age: number;
}


class HumanImpl implements IHuman {
    // 实现接口的内容
    name: string;
    age: number;

    constructor(public config: IHuman) {

    }

}

new HumanImpl({ name: 't', age: 12 });
```
14、模块，重用单元

a.ts
```js
// 不对外暴露
var var0;

function func0() {

}

class Clazz0 {

}

// 对外暴露
export var var1;

export function func1() {

}

export class Clazz1 {

}

```

b.ts
```js

// 导入其他模块对外暴露的内容
import { var1, func1, Clazz1 } from './a';

console.log(var1);

func1()

new Clazz1()

```

15、注解
说明信息，与业务逻辑无关

16、类型定义文件

类型定义文件 `*.d.ts` 使用已有的工具包，如JQuery
github 工具 typings


17、总结
基本概念和优势
开发环境
语法特性



