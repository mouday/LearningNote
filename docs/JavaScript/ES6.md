## 常量
```js
// ES5 中常量的写法

Object.defineProperty(window, "PI2", {
    value: 3.1415926,
    writable: false,
})

console.log(window.PI2)

// ES6 的常量写法

const PI = 3.1415926
console.log(PI)

// PI = 4
```

## 作用域
```js
// ES5 中作用域
const callbacks = []
for (var i = 0; i <= 2; i++) {
    callbacks[i] = function() {
        return i * 2
    }
}

console.table([
    callbacks[0](),
    callbacks[1](),
    callbacks[2](),
])
// 输出是6 6 6 


const callbacks2 = []
for (let j = 0; j <= 2; j++) {
    callbacks2[j] = function() {
        return j * 2
    }
}

console.table([
    callbacks2[0](),
    callbacks2[1](),
    callbacks2[2](),
])

// 输出是0 2 4 

;((function() {
    const foo = function() {
        return 1
    }
    console.log("foo()===1", foo() === 1)
    ;((function() {
        const foo = function() {
            return 2
        }
        console.log("foo()===2", foo() === 2)
    })())
})())

{
    function foo() {
        return 1
    }

    console.log("foo()===1", foo() === 1)
    {
        function foo() {
            return 2
        }

        console.log("foo()===2", foo() === 2)
    }
    console.log("foo()===1", foo() === 1)
}

```

## 箭头函数
```js
/* eslint-disable */

{
  // ES3,ES5
  var evens = [1, 2, 3, 4, 5];
  var odds = evens.map(function(v) {
    return v + 1
  });
  console.log(evens, odds);
};
{
  // ES6
  let evens = [1, 2, 3, 4, 5];
  let odds = evens.map(v => v + 1);
  console.log(evens, odds);
} 

{
  // ES3,ES5
  var factory = function() {
    this.a = 'a';
    this.b = 'b';
    this.c = {
      a: 'a+',
      b: function() {
        return this.a
      }
    }
  }
// 谁调用this指向谁
  console.log(new factory().c.b()); // 'a+'
};

{
    // ES6
  var factory = function() {
    this.a = 'a';
    this.b = 'b';
    this.c = {
      a: 'a+',
      b: () => {
        return this.a
      }
    }
  }
  // 定义时指向谁就是谁
  console.log(new factory().c.b());  // 'a'
}

```
## 函数参数
```js
/* eslint-disable */

{
  // ES5\ES3 默认参数的写法
  function f(x, y, z) {
    if (y === undefined) {
      y = 7;
    }
    if (z === undefined) {
      z = 42
    }
    return x + y + z
  }
  console.log(f(1, 3));
} 

{
  // ES6 默认参数
  function f(x, y = 7, z = 42) {
    return x + y + z
  }
  console.log(f(1, 3));
}

{
  // 必选参数检查
  function checkParameter() {
    throw new Error('can\'t be empty')
  }
  function f(x = checkParameter(), y = 7, z = 42) {
    return x + y + z
  }
  console.log(f(1));
  try {
    f()
  } catch (e) {
    console.log(e);
  } finally {}
} 

{
  // ES3,ES5 可变参数
  function f() {
    var a = Array.prototype.slice.call(arguments);
    var sum = 0;
    a.forEach(function(item) {
      sum += item * 1;
    })
    return sum
  }
  console.log(f(1, 2, 3, 6));
} 

{
  // ES6 可变参数
  function f(...a) {
    var sum = 0;
    a.forEach(item => {
      sum += item * 1
    });
    return sum
  }
  console.log(f(1, 2, 3, 6));
} 


{
  // ES5 合并数组
  var params = ['hello', true, 7];
  var other = [1, 2].concat(params);
  console.log(other);
} 

{
  // ES6 利用扩展运算符合并数组
  var params = ['hello', true, 7];
  var other = [
    1, 2, ...params
  ];
  console.log(other);
}

```
## 数据保护
```js
/* eslint-disable */
{
  // ES3,ES5 数据保护
  var Person = function() {
    var data = {
      name: 'es3',
      sex: 'male',
      age: 15
    }
    this.get = function(key) {
      return data[key]
    }
    this.set = function(key, value) {
      if (key !== 'sex') {
        data[key] = value
      }
    }
  }

  // 声明一个实例
  var person = new Person();
  // 读取
  console.table({name: person.get('name'), sex: person.get('sex'), age: person.get('age')});
  // 修改
  person.set('name', 'es3-cname');
  console.table({name: person.get('name'), sex: person.get('sex'), age: person.get('age')});
  person.set('sex', 'female');
  console.table({name: person.get('name'), sex: person.get('sex'), age: person.get('age')});
} {
  // ES5
  var Person = {
    name: 'es5',
    age: 15
  };

  Object.defineProperty(Person, 'sex', {
    writable: false,
    value: 'male'
  });

  console.table({name: Person.name, age: Person.age, sex: Person.sex});
  Person.name = 'es5-cname';
  console.table({name: Person.name, age: Person.age, sex: Person.sex});
  try {
    Person.sex = 'female';
    console.table({name: Person.name, age: Person.age, sex: Person.sex});
  } catch (e) {
    console.log(e);
  }
} {
  // ES6
  let Person = {
    name: 'es6',
    sex: 'male',
    age: 15
  };

  let person = new Proxy(Person, {
    get(target, key) {
      return target[key]
    },
    set(target,key,value){
      if(key!=='sex'){
        target[key]=value;
      }
    }
  });

  console.table({
    name:person.name,
    sex:person.sex,
    age:person.age
  });

  try {
    person.sex='female';
  } catch (e) {
    console.log(e);
  } finally {

  }

}

```