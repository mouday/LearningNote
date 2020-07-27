面向对象编程
类：类是对象的类型模板
实例：实例是根据类创建的对象

JavaScript不区分类和实例的概念，而是通过原型（prototype）来实现面向对象编程
JavaScript的原型链和Java的Class区别就在，它没有“Class”的概念，所有对象都是实例，
所谓继承关系不过是把一个对象的原型指向另一个对象而已。

```
// 代码仅用于演示目的
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    }
};

var xiaoming = {
    name: '小明'
};

xiaoming.__proto__ = Student;

xiaoming.name; // '小明'
xiaoming.run(); // 小明 is running...
```

```
// 原型对象:
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    }
};

function createStudent(name) {
    // 基于Student原型创建一个新对象:
    var s = Object.create(Student);
    // 初始化新对象:
    s.name = name;
    return s;
}

var xiaoming = createStudent('小明');
xiaoming.run(); // 小明 is running...
xiaoming.__proto__ === Student; // true
```

# 创建对象

obj.xxx访问一个对象的属性时，先在当前对象上查找该属性，
如果没有找到，就到其原型对象上找，
如果还没有找到，就一直上溯到Object.prototype对象，
最后，如果还没有找到，就只能返回undefined。

array 原型链是
```
arr ----> Array.prototype ----> Object.prototype ----> null
```

构造函数
```
function Student(name) {
    this.name = name;
    this.hello = function () {
        alert('Hello, ' + this.name + '!');
    }
}

var xiaoming = new Student('小明');
xiaoming.name; // '小明'
xiaoming.hello(); // Hello, 小明!
```

如果不写new，这就是一个普通函数，它返回undefined。
但是，如果写了new，它就变成了一个构造函数，它绑定的this指向新创建的对象，并默认返回this，
也就是说，不需要在最后写return this;

用new Student()创建的对象还从原型上, 获得了一个constructor属性，它指向函数Student本身
```
xiaoming.constructor === Student.prototype.constructor; // true
Student.prototype.constructor === Student; // true

Object.getPrototypeOf(xiaoming) === Student.prototype; // true

xiaoming instanceof Student; // true
```

按照约定，构造函数首字母应当大写，而普通函数首字母应当小写
```
function Student(name) {
    this.name = name;
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
};


function Student(props) {
    this.name = props.name || '匿名'; // 默认值为'匿名'
    this.grade = props.grade || 1; // 默认值为1
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
};

function createStudent(props) {
    return new Student(props || {})
}

// 调用
var xiaoming = createStudent({
    name: '小明'
});

xiaoming.grade; // 1
```

# 原型继承
太难理解，略过

# class继承
关键字class从ES6开始正式被引入
```
function Student(name) {
    this.name = name;
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
}

// 如果用新的class关键字来编写Student，可以这样写：
class Student {
    constructor(name) {
        this.name = name;
    }

    hello() {
        alert('Hello, ' + this.name + '!');
    }
}


// class继承
class PrimaryStudent extends Student {
    constructor(name, grade) {
        super(name); // 记得用super调用父类的构造方法!
        this.grade = grade;
    }

    myGrade() {
        alert('I am at grade ' + this.grade);
    }
}

```


