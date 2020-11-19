# ES6（ES2015）新特性之常量、箭头函数、解构赋值

## 几个概念

1、JavaScript VS ECMAScript

ECMAScript 一种标准
JavaScript 一种标准的实现

2、ES6 == ES2015

ES6 版本号
ES2015 发布年份

3、新特性
常量 Const
箭头函数 Arrow Function
解构赋值 Desctructuring

4、准备工具
开发工具 VSCode
插件 Live Server
浏览器 Chrome

## const常量

```js
// ES3声明常量，可以被修改
var BASE_NAME = "Tom";
BASE_NAME = "jack";
console.log(BASE_NAME);
// jack

// ES5声明常量，不可以被修改
Object.defineProperty(window, "es", {
    value: "Tom",
    writable: false
});

es = "Jack";

console.log(es);
// Tom

// ES6声明常量，不可以被修改
const es = "Tom";
es = "Jack"; 
// Uncaught TypeError: Assignment to constant variable.

```

const声明常量的特性：

- 如果声明的时候没有赋值，会抛出异常
- 不允许重复声明
- 不属于顶层对象window
- 不存在变量提升
- 必须先定义再使用，暂时性死区
- 存在块级作用域

如果const声明的是引用类型，内部元素可以被改变，
需要使用`冻结`，防止内部元素被改变

浅层冻结

```js
const obj = {
    name: "Tom"
};
// 浅层冻结
Object.freeze(obj);

const arr = ['Tom'];
// 浅层冻结
Object.freeze(arr);

obj.name = "Jack";
arr[0] = "Jack";

console.log(obj);
console.log(arr);
```

深层递归冻结
```js
/**
* 深层递归冻结
*/
function deepFreeze(obj){
    Object.freeze(obj);

    Object.keys(obj).forEach(key=>{
        if(typeof obj[key] === 'object'){
            deepFreeze(obj[key]);
        }                
    })
}

const obj = {
    name: "Tom",
    pets: ["dog", "cat"]
};

// Object.freeze(obj);
deepFreeze(obj);
obj.pets[0] = "pig";

console.log(obj);

```

声明变量关键字：
优先使用const，如果需要被改变再使用let

## 箭头函数

定义函数
```js
function sum1(x, y){
    return x + y;
}

const sum2 = function(x, y){
    return x + y;
}

// 使用箭头函数
const sum3 = (x, y) => {
    return x + y;
}

const sum4 = (x, y) => x + y;

const sum5 = x => {/*方法体*/};

```

以下情况不适用箭头函数

场景1: 事件回调函数

```html
<button id="btn">按钮</button>

<script>
  const btn = document.querySelector("#btn");

  btn.addEventListener("click", function () {
    this.style.backgroundColor = "red";
  });
</script>
```

场景2：对象内方法

```js
const person = {
  name: "Tom",
  showName: function(){
    console.log(this.name);
  }
}
person.showName();
```

场景3：函数内使用arguments

```js
function sum(x, y){
  console.log(arguments);
  return x + y;
}

sum(1, 2);
```

场景4：构造函数、原型方法

```js
function Person(name, age){
  this.name = name;
  this.age = age;
}

Person.prototype.showName = function(){
  console.log(this.name);
}

const person = new Person("Tom", 23);
person.showName();

console.log(person);
```

## 解构赋值

等号左右两边结构要完全一致

```js
// 对象解构赋值
const obj = {
    name: "Tom",
    age: 23,
};

// const name = obj.name;
// const age = obj.age;

const { name, age } = obj;
console.log(name, age);


// 数组解构赋值
const arr = [0, 1, 2];

// const a = arr[0];
// const b = arr[1];
// const c = arr[2];
const [a, b, c] = arr;

console.log(a, b, c);
```

2、结构赋值取别名

```js
const obj = {
    name: "Tom",
    age: 23,
    pet: {
      name: "bigo",
    },
  };
  // pet.name 别名 petName
  const {
    name,
    age,
    pet: { name: petName },
  } = obj;

  console.log(name, age, petName);
```

3、解构赋值应用

（1）作为数组参数

```js
function sum(arr){
  let result = 0;
  for (let i = 0; i < arr.length; i++) {
      result += arr[i];
  }
  console.log(result);
}

const arr = [1, 2, 3];
sum(arr);

// 改写如下
function sum([a, b, c]) {
  console.log(a + b + c);
}

const arr = [1, 2, 3];
sum(arr);
```

（2）作为对象参数

```js
// pet有默认参数
function foo({ name, age, pet = "pig" }) {
    console.log(name, age, pet);
}

const obj = {
    name: "Tom",
    age: 23,
};

foo(obj);
```

（3）作为函数返回值

```js
function foo() {
    return {
      name: "Tom",
      age: 23,
    };
}

const {name, age} = foo();
console.log(name, age);
```

（4）交换变量的值

```js
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a, b);
```

（5）解析json时使用

```js
const res = '{"name": "Tom", "age": 23}';
const {name, age} = JSON.parse(res);
console.log(name, age);
```

（6）Ajax请求应用
```html
<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.1.0/axios.min.js"></script>

<script>
 axios.get("./data.json").then(({name, age})=>{
     console.log(name, age);
 })
</script>
```

data.json
```json
{
    "name": "Tom",
    "age": 23
}
```

## Babel浏览器兼容

```
ES6 -> Babel -> ES5
```

环境配置
1、环境 Node.js
2、初始化 npm init -y

3、安装依赖
```bash
npm install --save-dev babel-preset-env babel-cli

# 或者
npm i -D babel-preset-env babel-cli
```

3、创建配置文件
```
cat .babelrc

{
    "presets": ["env"]
}
```

4、文件转化
```
文件：babel src/index.js -o dist/index.js
文件夹：babel src -d dist
实时监控：babel src -w -d dist
```

