# 第15 章 ： Annotation注解

## 71 Annotation简介
JDK>=1.5

作用
1、减少程序配置的代码
2、进行结构化定义

以注解的形式实现程序开发

程序代码（资源调度）
资源：关系型数据库 + NoSQL系统 + 消息服务 + 数据服务
配置文件：数据库连接资源 + 其他连接资源


程序开发结构的历史
第一阶段：所有配置都写在程序代码中，不利于维护
第二阶段：引入配置文件，适用于配置项不多的情况
第三阶段：配置信息重新写回程序里，利用特殊标记与代码分离

@Override
@Deprecated
@SuppressWarnings

## 72 准确覆写
问题：
1、继承忘记写extends
2、覆写方法单词拼错

@Override 明确表示该方法是覆写方法
程序编译时检查错误，保证覆写准确性
```java
class Resource{
    public void connect(){
        System.out.println("资源连接");
    } 
}


class Database extends Resource{
    @Override
    public void connect(){
        System.out.println("数据库资源连接");
    }

}


class Demo{
    public static void main(String[] args) {
        Database db = new Database();
        
        // 调用子类的方法
        db.connect();  
        // 数据库资源连接
    }
}

```

## 73 过期声明

@Deprecated
软件项目迭代开发过程中，可能有的地方考虑不周，不能直接删除这些操作
给一个过渡时间，老系统可以继续用，新项目不要用了

```java

class Database{
    @Deprecated
    public void connect(){
        System.out.println("数据库资源连接");
    }

    public void connection(){
        System.out.println("新的方式：数据库资源连接");
    }
}


class Demo{
    public static void main(String[] args) {
        Database db = new Database();
        
        db.connect();  
        /* 注: Demo.java使用或覆盖了已过时的 API。
            注: 有关详细信息, 请使用 -Xlint:deprecation 重新编译。
            数据库资源连接
        */
    }
}

```

## 74 压制警告
隐藏警告提示

```java

class Database{
    @Deprecated
    public void connect(){
        System.out.println("数据库资源连接");
    }
}


class Demo{
    // 隐藏 deprecation 警告
    @SuppressWarnings({"deprecation"})
    public static void main(String[] args) {
        Database db = new Database();
        
        db.connect();  
        // 数据库资源连接
    }
}

```

# 第16 章 ： 多态性
## 75 多态性简介
多态是在继承的基础上扩展出来的概念，实现父子类之间的转换处理

Java中多态的两种实现模式
1、方法多态性
    -方法重载：同一个方法名称可以根据传入的参数类型，个数的不同，实现不同功能的执行
    -方法覆写：同一个方法，在不同子类中有不同的实现
2、对象多态性（父子之间转换处理）
    -对象向上转型 父类 父类实例 = 子类实例 （自动转换）
    -对象向下转型 子类 子类实例 = （子类）父类实例 （强制转换）


方法重载
```java
class Demo{
    public static void print(){
        System.out.println("默认输出");
    }

    public static void print(String message){
        System.out.println(message);
    }

    public static void main(String[] args) {
        Demo.print(); // 默认输出

        Demo.print("自定义输出"); // 自定义输出
    }
}

```

方法覆写
```java
class Database{
    public void  connect(){
        System.out.println("数据库连接");
    }
}

class MySQLDatabase extends Database{
    @Override
    public void connect(){
        System.out.println("MySQL数据库连接");
    }
}

class RedisDatabase extends Database{
    @Override
    public void connect(){
        System.out.println("Redis数据库连接");
    }
}

class Demo{
    public static void main(String[] args) {
        Database db = null;

        db = new Database();
        db.connect();  // 数据库连接

        db = new MySQLDatabase();
        db.connect(); // MySQL数据库连接


        db = new RedisDatabase();
        db.connect(); // Redis数据库连接

    }
}

```

## 76 对象向上转型
向上转型的优势：参数可以统一设计（接收或返回参数统一性）
重载也可以实现相同的效果，如果子类过多，代码不利维护
```java
class Database{
    public void  connect(){
        System.out.println("数据库连接");
    }
}

class MySQLDatabase extends Database{
    @Override
    public void connect(){
        System.out.println("MySQL数据库连接");
    }
}

class RedisDatabase extends Database{
    @Override
    public void connect(){
        System.out.println("Redis数据库连接");
    }
}

class Demo{
    // 接收统一的参数 Database 和其子类
    public static void connect(Database db){
        db.connect();
    }

    public static void main(String[] args) {
        // 相当于 Database db = new Database()
        Demo.connect(new Database()) ;

        // 自动向上转型 相当于 Database db = new MySQLDatabase()
        Demo.connect(new MySQLDatabase()) ;

        // 自动向上转型 相当于 Database db = new RedisDatabase()
        Demo.connect(new RedisDatabase()) ;

    }
}

```

## 77 对象向下转型
向下转型主要特点：
需要使用到子类自己的特殊方法

```java
class Person{
    public void eat(){
        System.out.println("I can eat");
    }
}

class SuperMan extends Person{
    public void fly(){
        System.out.println("I can fly");
    }
}

class Demo{
    public static void main(String[] args) {

        // 向上自动转型
        Person person = new SuperMan() ;
        person.eat() ; // I can eat

        // 向下强制转型
        SuperMan superMan = (SuperMan) person ;
        superMan.fly() ;  // I can fly

    }
}

```

向上描述的是一些公共特征
向下描述的是子类特殊的定义, 不安全

向下转型之前一定要有向上转型

## 78 instanceof关键字
语法
```
对象 instanceof 类
```
如果要执行向下转型要先做类型判断
```java
// 向上自动转型
Person person = new SuperMan() ;
person instanceof Person ; // true
person instanceof SuperMan ; // true

// 向下强制转型
SuperMan superMan = (SuperMan) person ;
superMan instanceof Person ; // true
superMan instanceof SuperMan ; // true
```

# 第17 章 ： Object类
## 79 Object类的基本概念
Java中只有一个类不存在继承关系，Object可以接收所有的数据类型
所有类默认都是Object子类

两种定义方式等价
```java
class Person{}

class Person extends Object{}

```
Object类提供无参构造方法

```java
class Person{}

class Demo{
    public static void main(String[] args) {
        Object obj = new Person() ;

        if(obj instanceof Person){
            Person person = (Person) obj ;
        }
    }
}

```
Object可以接收所有引用类型，万能数据类型
适合进行程序的标准设计

Object接收数组
```java
Object obj = new int[] {1, 2, 3} ;

if(obj instanceof int[]){
    int[] data  = (int[]) obj ;

    for(int x : data){
        System.out.println(x);
    }
}
```

## 80 取得对象信息
toString() 从Object继承而来

对象直接输出调用的是toString()

```java
class Person{
    private String name ; 
    private int age ;

    public Person(){}

    public Person(String name, int age){
        this.name = name ;
        this.age = age ;
    }

    @Override
    public String toString(){
        return "name: " + this.name + " age: " + this.age ; 
    }

}

class Demo{
    public static void main(String[] args) {
        Person person = new Person("张三", 23);
        System.out.println(person);
        // name: 张三 age: 23
    }
}

```

## 81 对象比较
Object提供 equals比较对象内容
默认比较对象地址
```java
class Person{
    private String name ; 
    private int age ;

    public Person(){}

    public Person(String name, int age){
        this.name = name ;
        this.age = age ;
    }

    @Override
    public boolean equals(Object obj){
        
        // 处理null
        if(obj == null){
            return false ;
        }

        // 同对象比较
        if(this == obj ){
            return true;
        }

        // 不同类型比较
        if(!(obj instanceof Person)){
            return false ;
        }

        Person person = (Person) obj ;

        return this.name == person.name && this.age == person.age ;
    }

}

class Demo{
    public static void main(String[] args) {
        Person person1 = new Person("张三", 23);
        Person person2 = new Person("张三", 23);

        System.out.println(person1.equals(person1)); // true
        System.out.println(person1.equals(person2)); // true

        System.out.println(person1.equals(null)); // false
        System.out.println(person1.equals("李四")); // false
     
    }
}

```

# 第18 章 ： 抽象类的定义与使用
## 82 抽象类基本概念
类继承主要作用在于可以扩充已有类的功能，不过不能强制子类必须覆写哪些类

父类设计优先考虑抽象类
抽象类：对子类覆写方法进行约定
抽象方法：abstract关键字定义并且没有提供方法体的方法
抽象类：抽象方法所在的类必须为抽象类

抽象类不是完整的类，不能直接实例化

使用抽象类：
1、抽象类必须提供子类，子类使用extends继承抽象类
2、抽象类子类一定要覆写抽象类中的全部抽象方法
3、抽象类的对象实例化可以利用对象多态性通过子类向上转型的方式完成

抽象类只是比普通类增加了抽象方法，以及对子类的强制性覆写要求，使用和普通类完全相同

核心问题：抽象类无法直接实例化
主要目的：进行过渡操作，解决类继承问题中代码重复处理

```java
// 定义抽象类
abstract class Database{
    private String type ;

    // 抽象方法
    public abstract void connect() ;

    // 普通方法
    public void setType(String type){
        this.type = type;
    }

    public String getType(){
        return this.type;
    }
}

class MySQLDatabase extends Database{
    @Override
    public void connect(){
        System.out.println("MySQL数据库连接");
    }
}

class Demo{
    public static void main(String[] args) {
        Database db = new MySQLDatabase();
        db.connect();
        // MySQL数据库连接
    }
}

```

## 83 抽象类的相关说明
注意要点：
1、定义抽象类不能使用final 关键字定义，抽象类必须有子类
2、抽象类是普通类的加强版，抽象类可以提供构造方法
3、抽象类允许没有抽象方法，无法new实例化对象，必须由子类完成
4、抽象类可以提供static 方法，不受抽象类结构限制

static 方法永远可以通过类名调用
```java
// 定义抽象类
abstract class Database{}

// 子类继承
class MySQLDatabase extends Database{}

class Demo{
    public static void main(String[] args) {
        Database db = new MySQLDatabase();
    }
}

```

## 84 模板设计模式
抽象类的定义比普通类更高一层

抽象类好处
1、对子类方法统一管理
2、提供一些普通方法，并且普通方法可调用抽象方法

```java
// 定义抽象类
abstract class Action{
    public static final int EAT = 1;
    public static final int SLEEP = 2;

    public void command(int code){
        switch (code){
            case EAT:{
                this.eat();
                break;
            }

            case SLEEP: {
                this.sleep();
                break;
            }

            case EAT + SLEEP: {
                this.eat();
                this.sleep();
                break;
            }
        }
    }

    public abstract void eat();
    public abstract void sleep();

}


class Dog extends Action{
    public void eat(){
        System.out.println("Dog eat");
    }

    public void sleep(){
        System.out.println("Dog sleep");
    }
}


class Cat extends Action{
    public void eat(){
        System.out.println("Cat eat");
    }

    public void sleep(){
        System.out.println("Cat sleep");
    }
}


class Demo{
    public static void main(String[] args) {
        Action dog = new Dog();
        dog.command(Action.EAT);
        // Dog eat

        Action cat = new Cat();
        cat.command(Action.EAT + Action.SLEEP);
        // Cat eat
        // Cat sleep
    }
}

```

## 85 包装类实现原理分析
包装类针对基本数据类型对象转换而实现
基本数据类型不是一个类
基本数据类型以类的形式进行处理，需要对其进行包装

装箱：将基本数据类型保存到包装类中
拆箱：从包装类对象中获取基本数据类型

```java
// 定义包装类
class Int{
    private int data;
    
    public Int(int data){
        this.data = data ;
    }

    public int intValue(){
        return this.data ;
    }
}
    

class Demo{
    public static void main(String[] args) {
        // 装箱 基本数据类型 => 对象类型
        Object obj = new Int(12) ;

        // 拆箱 对象类型 => 基本数据类型
        int x = ((Int)obj).intValue();
       
        System.out.println(x) ;
       // 12
    }
}

```
基本数据类型进行包装类后，可以向对象一样进行引用传递
8种基本数据类型
```
Object
-数值型Number{abstract}
    -Byte: byte-8
    -Short: short-16
    -Integer: int-32
    -Long: long-64          
    -Float: float-32
    -Double: double-64     
-布尔型Boolean：boolean                    
-字符型Character：char-16     
```

Java中有两种包装类：
1、对象型包装类Object子类：Boolean，Character
2、数值型包装类Number子类：Byte，Short， Integer， Long， Float， Double

Number类提供的方法：
```java
byte byteValue()
short shortValue()
abstract int intValue()
abstract long longValue()
abstract float floatValue()
abstract double doubleValue()
```

## 86 装箱与拆箱

Integer
```java

Integer obj = new Integer(12) ;
int x = obj.intValue();

System.out.println(x) ;
// 12
```

```java
boolean booleanValue()

```
JDK >= 1.5 自动装箱拆箱
JDK >= 1.9 过期

```java
Integer obj = 2 ;
int x = obj;

// 直接参与数学运算
System.out.println(x * obj) ;
// 4
```

自动装箱好处是Object可直接接收基本数据类型
```java
// 自动装箱为Integer，再自动向上转型为Object
Object obj = 2 ;

// 先向下转型为Integer，再自动拆箱
int x = (Integer)obj;
```

相等判断，一定使用equals完成

```java
Integer x = 12 ;
Integer y = 12 ;

System.out.println(x == y ); // true


Integer x = 127 ;
Integer y = 127 ;

System.out.println(x == y ); // true


Integer x = 128 ;
Integer y = 128 ;

System.out.println(x == y ); // false
System.out.println(x.equals(y)); // true

Integer x = -128 ;
Integer y = -128 ;

System.out.println(x == y ); // true


Integer x = -129 ;
Integer y = -129 ;

System.out.println(x == y ); // false
```

