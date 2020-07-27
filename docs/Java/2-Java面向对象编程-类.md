## 2、面向对象简介
Java语言最大特点：面向对象编程设计
面向过程：C语言，面对一个问题的解决方案
面向对象：C++/Java，模块化设计，进行重用配置，考虑标准

1、面向对象三个主要特征：
封装性：内部操作对外部不可见
继承性：已有结构的基础上继续进行功能扩充
多态性：是在继承性的基础上扩充而来的概念，指类型的转换处理

2、面向对象开发三个步骤：
OOA：面向对象分析 
OOD：面向对象设计
OOP：面向对象编程

## 3、类与对象
类：对某一类事物共性的抽象
对象：描述一个具体的产物

类是一个模型，对象是类可以使用的实例
先有类再有对象

类的组成：
成员属性Field  简称属性
操作方法Method 对象的行为

## 4、类与对象的定义及使用
Java中，类是一个独立的结构体

属性就是变量
方法就是可以重复执行的代码

```java
// 定义类
class Person {
    // 定义属性
    String name;  // 引用数据类型 默认值 null
    int age;      // 基础数据类型 默认值 0

    // 定义方法
    public void tell(){
        System.out.println("姓名：" + this.name + " 年龄：" + this.age);
    }

    public static void main(String[] args) {
        Person person = new Person();
        person.name = "张三";
        person.age = 18;
        person.tell();
        // 姓名：张三 年龄：18
    }

}
```

生产对象两种方式：
1、声明并实例化对象
类名称 对象名称 = new 类名称();

2、分步完成
（1）声明对象：类名称 对象名称 = null;
（2）实例化对象：对象名称 = new 类名称();

实例化对象调用操作：
调用属性：实例化对象.成员属性；
调用方法：实例化对象.方法名称();

## 5、内存对象分析
最常用的2块内存空间
堆内存：保存对象具体信息 new开辟堆内存空间
栈内存：保存一块堆内存地址

```java
/**
栈内存              堆内存     
地址Ox0001    ->   对象内容
*/


// 方式一
Person person = new Person();


// 方式二
Person person = null;
person = new Person();

```
所有的对象在调用属性或方法之前，必须实例化


## 6、对象引用分析

同一块堆内存可以被不同的栈内存所指向，也可以更换指向

修改person2, person1也会被修改
```java
Person person1 = new Person();
person1.name = "张三";
person1.age = 19;

Person person2 = person1;
person2.tell();
// 姓名：张三 年龄：19
```

引用传递可以发生在方法调用
```java
public static void main(String[] args) {
    Person person = new Person();
    person.name = "张三";
    person.age = 18;
    
    change(person); // 相当于: Person temp = person;

    person.tell();
    // 姓名：李四 年龄：18
}

public static void change(Person temp){
    temp.name = "李四";
    // 方法结束后断开引用
}
```

## 7、引用于垃圾产生分析
垃圾空间：没有任何栈内存指向的堆内存空间
垃圾会被GC（Garbage Collector）垃圾收集器定期回收
垃圾过多会影响GC性能

一个栈内存只能保存有一个堆内存的地址数据

```java
Person person1 = new Person(); // Ox0001
Person person2 = new Person(); // Ox0002

person2 = person1;   // 此时 person2 指向的 Ox0002 对象成为了垃圾
```

## 8、成员属性封装
封装：对数据进行保护

private关键字对外不可见
使用setter、getter设置或获取属性

类中的所有属性都必须使用private封装，需要提供setter、getter方法

```java
class Person {
    
    // 私有化属性
    private String name; 

    // 对外提供geter， setter方法
    public void setName(String n){
        name = n;
    }

    public String getName(){
        return name;
    }

    public static void main(String[] args) {
        Person person = new Person();
        person.setName("张三");
        System.out.println(person.getName());
        // 张三
    }
}
```

## 9、构造方法与匿名对象
现有程序使用类，经过了2个步骤：
1、声明实例化对象，只能使用默认值
2、通过 setter 方法设置属性

构造方法: 实例化对象时进行数据初始化
1、构造方法名与类名必须一致
2、构造方法无返回值
3、构造方法在new实例化对象时自动调用

```java
class Person {
    
    // 私有化属性
    private String name; 
    
    // 有参构造方法
    public Person(String n){
        name = n;
    }

    public static void main(String[] args) {
        Person person = new Person("张三");
        System.out.println(person.getName());
        // 张三
    }
}

```
（1）Person 定义对象所属类型，类型决定可以调用的方法
（2）person 实例化对象的名称
（3）new 开辟新的堆内存空间
（4）Person("张三") 调用构造函数（有参，无参）

所有的类都会提供有无参构造方法，程序编译时自动创建，如果明确构造方法则不自动创建

结论：一个类至少存在一个构造方法

问题：构造方法没有返回值？不使用void

构造方法与普通方法区别：
构造方法在类对象实例化时调用
普通方法在类对象实例化之后调用

构造方法重载
只用考虑方法签名（参数个数，类型，顺序）
按照参数数量顺序排列构造方法

```java
class Person {
    
    // 私有化属性
    private String name; 
    
    // 无参构造方法
    public Person(){
    }

    // 有参构造方法
    public Person(String n){
        name = n;
    }

    public String getName(){
        return name;
    }

    public static void main(String[] args) {
        Person person = new Person("张三");
        System.out.println(person.getName());
        // 张三
    }
}
```

匿名对象

```java
new Person("张三").getName());
// 张三

```
使用一次后就会被GC回收释放

方法可以传递基本数据类型和引用数据类型

## 10、this调用本类属性
三类描述
1、当前类中的属性 this.属性
2、当前类中的方法（构造方法：this()、普通方法：this.方法()）
3、描述当前对象

访问本类中的属性一定要加this
```java
public Person(String name, int age){
    this.name = name ;
    this.age = age ;
}

```

## 11、this调用本类方法
1、调用普通方法
```java
setName(name) ;

// 或者

this.setName(name) ;

```
好的代码：
代码结构可以重用
没有重复代码

2、调用构造方法
this()
必须在实例化新对象的时候调用
只允许放在构造函数首行
相互调用必须有出口
```java
// 无参构造方法
public Person(){
    this("张三");
}

// 有参构造方法
public Person(String name){
    this.name = name;
}
```

构造方法调用实现默认参数
```java
class Person {
    
    // 私有化属性
    private String name; 
    private int age;

    // 无参构造方法
    public Person(){
        this("张三");
    }

    // 一参构造方法
    public Person(String name){
        this(name, 21);
    }

    // 两参构造方法
    public Person(String name, int age){
        this.name = name;
        this.age = age ;
    }

    public void getInfo(){
        System.out.println("name: " + this.name + " age: " + this.age);
    }

    
    public static void main(String[] args) {
        new Person().getInfo();
        new Person("李四").getInfo();
        new Person("王五", 22).getInfo();
        /*
        name: 张三 age: 21
        name: 李四 age: 21
        name: 王五 age: 22
        */
    }
}
```

## 12、综合实战：简单Java类

简单Java类：
可以描述某一类信息的程序类，没有特别复杂的操作，只作为一种信息存储的媒介

核心结构
1、类名有意义，明确描述某一类事物
2、属性必须使用private封装，提供setter、getter
3、可以提供多个构造方法，必须保留无参构造方法
4、不允许有任何输出，内有获取必须返回

非必须：
1、可以提供获取对象详细信息方法，getInfo()

涉及概念
数据类型、类的定义、private封装、方法定义、对象实例化

```java
class Person {
    
    // 私有化属性
    private String name; 
    private int age;

    // 无参构造方法
    public Person(){
        this("张三", 23);
    }

    // 两参构造方法
    public Person(String name, int age){
        this.name = name;
        this.age = age ;
    }

    // setter getter
    public void setName(String name){
        this.name = name;
    }

    public String getName(){
        return this.name ;
    }

    public void setAge(int age){
        this.age = age;
    }

    public int getAge(){
        return this.age ;
    }

    public String getInfo(){
        return "name: " + this.name + " age: " + this.age;
    }

    public static void main(String[] args) {
        System.out.println(new Person("王五", 22).getInfo());
        // name: 王五 age: 22
    }
}
```

## 13、声明static属性
static修饰的属性为公共属性，一个对象修改，所有对象都会被修改
应该由类来进行访问，而不是对象，可以由类名来调用
static 属性不受类实例化限制，不实例化也可以调用
进行类设计时首选非static属性，涉及公共信息才使用static

```
全局数据区        栈内存      堆内存
static 数据      person1   ->  {name, age}
                person1   ->  {name, age}
```

```java
class Person {
    String name; 
    static String country;
    
    public Person(String name){
        this.name = name;
    }

    public static void main(String[] args) {
        Person person1 = new Person("张三");
        Person person2 = new Person("李四");

        Person.country = "中国";
        System.out.println(person1.country);
        System.out.println(person2.country);
        // 中国   中国
    }
}
```

## 14、声明static方法
static方法只允许调用static属性或static方法
static属性和方法都可以在没有实例化对象的前提下使用

应用场景：
回避实例化对象调用并且描述公共属性的情况

## 15、static应用案例
实现实例化对象个数统计
```java
class Person {
    
    static int count;

    public Person(){
        count ++;
        System.out.println("第 " + count + " 个实例");
    }

    public static void main(String[] args) {
        new Person();
        new Person();
        new Person();
        /*
        第 1 个实例
        第 2 个实例
        第 3 个实例
        */
    }
}
```

## 16、普通代码块
代码块：由"{}"定义的结构

分类：
1、普通代码块
2、构造代码块
3、静态代码块
4、同步代码块（多线程）


普通代码块
定义在方法中的代码块

```java
// 普通代码块
{
    int age = 12;
    System.out.println(age);  // 12
}

int age = 15;
System.out.println(age);  // 15
```

## 17、构造代码块
构造块优先于构造方法执行，每次实例化都会调用构造代码块
```java
class Person {
    public Person(){
        System.out.println("构造方法");
    }

    {
        System.out.println("构造代码块");
    }

    public static void main(String[] args) {
        new Person();
        new Person();
        /**
        构造代码块
        构造方法
        构造代码块
        构造方法
        */
    }
}
```

## 18、静态代码块
static关键字定义的代码块
静态代码块优先于构造函数执行，不管实例化多少次只会执行一次
主要目的是为了静态属性初始化

静态代码块优先于主方法先执行
```java
class Person {
    public Person(){
        System.out.println("构造方法");
    }

    {
        System.out.println("构造代码块");
    }

    static {
        System.out.println("静态代码块");
    }

    public static void main(String[] args) {
        System.out.println("主方法代码块");
        new Person();
        new Person();
        /**
        静态代码块
        主方法代码块
        构造代码块
        构造方法
        构造代码块
        构造方法
        /
    }
}
```

## 19、案例分析一（Address）
实现一个地址类，包含国家，省份，城市，街道，邮政编码

实现一个简单java类
```java

class Address {
    private String country;
    private String province;
    private String city;
    private String street;
    private String zipcode;

    // setter
    public void setCountry(String country){
        this.country = country;
    }

    public void setProvince(String province){
        this.province = province;
    }

    public void setCity(String city){
        this.city = city;
    }

    public void setStreet(String street){
        this.street = street;
    }

    public void setZipcode(String zipcode){
        this.zipcode = zipcode;
    }

    // getter
    public String getCountry(){
        return this.country;
    }

    public String getProvince(){
        return this.province;
    }

    public String getCity(){
        return this.city;
    }

    public String getStreet(){
        return this.street;
    }

    public String getZipcode(){
        return this.zipcode;
    }

    // info
    public String getInfo(){
        return "国家: " + this.country +
               ", 省份: " + this.province + 
               ", 城市: " + this.city + 
               ", 街道: " + this.street + 
               ", 邮政编码: " + this.zipcode;
    }

    public Address(String country, String province, String city, String street, String zipcode){
        this.country = country;
        this.province = province;
        this.city = city;
        this.street = street;
        this.zipcode = zipcode;
    }


    public static void main(String[] args) {
        Address address = new Address("中国", "北京", "朝阳", "大望路", "10001");
        System.out.println(address.getInfo());
        // 国家: 中国, 省份: 北京, 城市: 朝阳, 街道: 大望路, 邮政编码: 10001

    }
}
```

## 20、案例分析二（Employee）
实现一个员工类，包含编号，姓名，薪水，税率，还包括薪水增长计算和增长后的工资
```java

class Employee{
    private long no;
    private String name;
    private double salary;
    private double rate;

    // setter getter ...

    public String getInfo(){
        return "编号：" + this.no + 
                ", 姓名： " + this.name + 
                ", 薪水 " + this.salary + 
                ", 涨幅： " + this.rate; 
    }

    public void increaseSalary(){
        this.salary = this.salary * (1 + this.rate);
    }

    public Employee(long no, String name, double salary, double rate){
        this.no = no;
        this.name = name;
        this.salary = salary;
        this.rate = rate;
    }

    public static void main(String[] args){
        Employee employee = new Employee(1L, "张三", 3000.0, 0.3);
        System.out.println(employee.getInfo());
        // 编号：1, 姓名： 张三, 薪水 3000.0, 涨幅： 0.3

        employee.increaseSalary();
        System.out.println(employee.getInfo());
        // 编号：1, 姓名： 张三, 薪水 3900.0, 涨幅： 0.3
    }

}
```

## 21、案例分析三（Dog）
创建Dog类，有名字，颜色，年龄，定义构造方法初始化属性
```java
class Dog{
    private String name;
    private String color;
    private int age;

    // getter setter

    public Dog(String name, String color, int age){
        this.name=name;
        this.color=color;
        this.age=age;
    }

    public static void main(String[] args) {
        Dog dog = new Dog("小黑", "黑色", 2);
    }
        
}
```

## 22、案例分析四（Account）
定义银行账户类，包括
1、数据：账户名称，账户余额
2、方法：开户（设置账号，余额），利用构造方法完成
3、查询余额
```java
class Account{
    private String name;
    private double balance;

    public Account(String name){
        this(name, 0.0);
    }

    public Account(String name, double balance){
        this.name = name;;
        this.balance = balance;;
    }

    // 查询余额
    public double getBalance(){
        return this.balance;
    }

    public static void main(String[] args) {
        Account account = new Account("张三", 2000.0);
        System.out.println(account.getBalance());
        // 2000.0
    }
}
```

## 23、案例分析五（User）
创建用户类
1、用户名，记录用户个数
2、获取用户数

```java
class User{
    private String name;

    private static int count = 0;

    public User(String name){
        this.name = name;
        count++;
    }

    public static int getCount(){
        return count;
    }

    public static void main(String[] args) {
        User user1 = new User("小明");
        User user2 = new User("小红");
        User user3 = new User("小花");

        System.out.println(User.getCount());
        // 3

    }
}
```

## 24、案例分析六（Book）
创建图书类
数据：书名，价格，编号（利用静态数据实现自动编号）
方法：统计总数

```java
class Book{
    private int uid;
    private String name;
    private double price;
    private static int count = 0;

    public Book(String name, Double price){
        count++;
        this.uid = count;
        this.name = name ;
        this.price = price ;
    }

    public String getInfo(){
        return "<"+ this.uid + "> <<" + this.name +">> "+ this.price;
    }

    public static int getCount(){
        return count;
    }

    public static void main(String[] args) {
        Book book1 = new Book("今日头条", 12.0);
        Book book2 = new Book("百度", 14.0);
        Book book3 = new Book("腾讯", 11.0);

        System.out.println(Book.getCount()); 
        // 3
        
        System.out.println(book3.getInfo());
        // <3> <<腾讯>> 11.0
    }
}
```