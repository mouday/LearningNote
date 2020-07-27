# 第12 章 ： 继承的定义与使用
## 59 继承问题引出
继承：扩充已有类的功能

## 60 继承的实现

```
class 子类 extends 父类
```
子类：派生类
父类：超类

继承实现的主要目的
子类可以重用父类中的结构，并且扩充功能
```java
class Person{
    private String name ;
    private int age ;

    public void setName(String name){
        this.name = name ;
    }

    public void setAge(int age){
        this.age = age ;
    }

    public String getName(){
        return this.name ;
    }

    public int getAge(){
        return this.age ;
    }

    public Person(String name, int age){
        this.name = name ;
        this.age = age ;
    }

}


class Student extends Person{
    String school ;

    public void setSchool(String school){
        this.school = school ;
    }
    
    public String getSchool(){
        return this.school ;
    }

    public Student(String name, int age, String school){
        super(name, age);
        this.school = school ;
    }
}

class Demo{
    public static void main(String[] args) {
        Student student = new Student("张三" , 23, "大学");
        
        System.out.println(student.getName());
        // 张三

        System.out.println(student.getSchool());
        // 大学
    }
}

```

## 61 子类对象实例化流程
子类实例化会自动调用父类构造方法

默认执行 super()

子类构造方法默认调用父类无参构造方法，只允许放在子类构造方法首行

结论：
定义类的时候最好写无参构造方法
实例化子类对象的同事一定会实例化父类对象
```java

class Person{
    private String name ;
    private int age ;
    
    public Person(){}

    public Person(String name, int age){
        this.name = name ;
        this.age = age ;
    }

}


class Student extends Person{
    public Student(String name, int age){
        super(name, age); // 调用父类构造方法
    }
}

class Demo{
    public static void main(String[] args) {
        Student student = new Student("张三" , 23);
    }
}

```

super, this 两个语句不能同时出现
相同点：
1、都可以调用构造方法
2、都只能放在构造方法首行

不同点：
1、super 调用父类构造方法
2、this 调用本类构造方法

## 62 继承定义限制
Java不允许多重继承，只允许多层继承

多重继承
```java
class A{}
class B{}
class C extends A, B{}
```

多层继承, 一脉传承
```java
class A{}
class B extends A{}
class C extends B{}
```

继承关系最好不要超过三层

子类可以继承父类中所有操作结构
显式继承非私有操作
隐式继承私有操作

```java
class Person{
    private String name ;
    
    public String getName(){
        return this.name ;
    }

    public Person(){}

    public Person(String name){
        this.name = name ;
    }
}


class Student extends Person{
    public void fun(){
        // 错误, 子类不能访问父类中的私有属性
        // System.out.println(this.name); 

        // 子类间接访问父类中的私有属性
        System.out.println(this.getName());  
        // 张三
    }

    public Student(String name){
        super(name);
    }
}

class Demo {
     public static void main(String[] args) {
        Student student = new Student("张三");
        student.fun();
    }
}

```

## 63 方法覆写
覆写意义：优化功能

子类调用父类方法
super.方法()

调用本类方法, this可省略
this.方法()

```java

class Resource{
    public void connect(){
        System.out.println("资源连接");
    } 
}


class Database{
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

## 64 方法覆写限制
覆写的方法访问控制权限要 大于等于 父类方法控制权限

访问权限控制
public > default(不写) > private

区别Override Overloading

Override    覆写
概念：方法名，签名（参数类型，个数），返回值相同
权限：被覆写的方法不能有更严格的权限控制
范围：发生在继承关系中

Overloading 重载 
概念：方法名相同，签名（参数类型，个数）不同，推荐返回类型一致
权限：没有权限控制
范围：发生在一个类中

## 65 属性覆盖
属性覆盖：子类定义了与父类相同名称的成员

区别：this super
this 先查找本类，再查找父类，this可以表示本类对象
super 直接查找父类
```java

class Father{
    private String name = "Father" ;

}

class Child{
    private String name = "Child" ;
    
    public String getName(){
        return this.name;
    }
}

class Demo{
    public static void main(String[] args) {
        Child child = new Child();
        System.out.println(child.getName()) ;
        // Child
    }
    
}
```
## 66 final关键字
final 定义不能被继承的类，不能被覆写的方法，常量
```java
final class Demo{}  // 不能有子类

class Demo{
    public final void fun(){}  // 不能被覆写
} 

class Demo{
    private final int ON = 1 ;  // 常量不能被重新赋值
    private final int OFF = 0 ; 
} 
```

常量往往都是公共的，全局常量
```java
public static final int ON = 1 ;
public static final int OFF = 0 ; 
```
常量每个字符都必须大写

## 67 案例分析一（学生类）
简单Java类

学生类继承人类
人类 
-四个属性：name，address， sex， age
-三个构造：四参，两参，无参
-一个方法：显示输出

学生
-增加两个属性：math，english
-三个构造：六参，两餐，无参
-一个重写方法：显示输出

```java
class Person{
    private String name ;
    private int age ;
    private String address;
    private char sex;

    public void setName(String name){
        this.name = name ;
    }

    public void setAge(int age){
        this.age = age ;
    }

    public void setAddress(String address){
        this.address = address ;
    }

    public void setSex(char sex){
        this.sex = sex ;
    }

    public String getName(){
        return this.name ;
    }

    public int getAge(){
        return this.age ;
    }

    public String getAddress(){
        return this.address ;
    }

     public char getSex(){
        return this.sex ;
    }

    public Person(){}

    public Person(String name, int age){
        // 调用本类构造方法
        this(name, age, "", '男');
    }

    public Person(String name, int age, String address, char sex){
        this.name = name ;
        this.age = age ;
        this.address = address ;
        this.sex = sex ;
    }

    public String getInfo(){
        return "name: " + this.name + 
                " age: " + this.age +
                " address: " + this.address + 
                " sex: " + this.sex ;
    }
}


// 继承
class Student extends Person{
    private double math ;
    private double english ;

    public void setMath(double math){
        this.math = math ;
    }

    public void setEnglish(double english){
        this.english = english ;
    }
    
    public double getMath(){
        return this.math ;
    }

     public double getEnglish(){
        return this.english ;
    }

    // 重载构造方法
    public Student(){}


    public Student(String name, int age){
        // 调用父类构造方法
        super(name, age);
    }

    public Student(String name, int age, String address, char sex, 
        double math, double english){
        super(name, age, address, sex);
        this.math = math ;
        this.english = english ;
    }

    // 覆写父类方法
    public String getInfo(){
        return super.getInfo() + 
                " math: " + this.math +
                " english: " + this.english ;
    }
}

class Demo{
    public static void main(String[] args) {
        Student student = new Student("张三", 16, "北京", '男', 99.9, 87.9);
        System.out.println(student.getInfo());
        // name: 张三 age: 16 address: 北京 sex: 男 math: 99.9 english: 87.9

    }
}

```

## 68 案例分析二（管理人员与职员）
员工类
-2个属性 name, age
-2个构造 无参, 2参
-1个方法 显示信息

普通职员
-4属性 name, age, dept, salary
-2构造 无参， 4参
-1个方法 显示信息

管理人员
-4属性 name， age, position, income
-2构造 无参， 4参
-1个方法 显示信息

```java
class Employee{
    private String name ;
    private int age ;

    public Employee(){}

    public Employee(String name, int age){
        this.name = name ;
        this.age = age ;
    }

    public String getInfo(){
        return "name: " + this.name + " age: " + this.age ;
    }
}


class Stuff extends Employee{
    private String dept ;
    private double salary ;

    public Stuff(){}

    public Stuff(String name, int age, String dept, double salary){
        super(name, age);
        this.dept = dept ;
        this.salary = salary ;
    }

    public String getInfo(){
        return "【Stuff】 " + super.getInfo() + 
            " dept: " + this.dept + 
            " salary: " + this.salary;
    }
}


class Manager extends Employee{
    private String position ;
    private double income ;

    public Manager(){}

    public Manager(String name, int age, String position, double income){
        super(name, age);
        this.position = position ;
        this.income = income ;
    }

    public String getInfo(){
        return "【Manager】 " + super.getInfo() + 
            " position: " + this.position + 
            " income: " + this.income;
    }
}

class Demo{
    public static void main(String[] args) {
        Stuff stuff = new Stuff("张三", 23, "技术部", 3000.0);
        Manager manager = new Manager("李四", 32, "技术总监", 150000.0);

        System.out.println(manager.getInfo());
        // 【Manager】 name: 李四 age: 32 position: 技术总监 income: 150000.0

        System.out.println(stuff.getInfo());
        // 【Stuff】 name: 张三 age: 23 dept: 技术部 salary: 3000.0

    }
}

```

## 69 案例分析三（字符串统计）
统计 字符o 和 n 出现的次数 do you know?

方式一：返回数组
```java

class CountDemo{
    // 统计两个字符个数，第一个为o, 第二个为u
    public static int[] getCount(String str){
        int[] countData = new int[2] ;

        char[] data = str.toCharArray() ;
        

        for(char c : data){
            if(c == 'o' || c == 'O'){
                countData[0] ++;
            }
            else if(c == 'u' || c == 'U'){
                countData[1] ++;
            }
        }
        
        return countData;
    }

    public static void main(String[] args) {
        int[] countData = CountDemo.getCount("are you ok?") ;
        
        System.out.println("o: " + countData[0]); // o: 2
        System.out.println("u: " + countData[1]); // u: 1
    }
}
```

方式二：返回对象
```java
class StringUtil{
    private String content ; 

    public StringUtil(String content){
        this.content = content ;
    }

    public String getContent(){
        return this.content ;
    }
}


class CountDemo extends StringUtil {
    private int oCount = 0;
    private int uCount = 0;

    public CountDemo(String content){
        super(content) ;

        this.countChar() ;  //构造方法调用统计
    }

    // 统计两个字符个数
    public void countChar(){
    
        char[] data = super.getContent().toCharArray() ;
        
        for(char c : data){
            if(c == 'o' || c == 'O'){
                this.oCount ++;
            }
            else if(c == 'u' || c == 'U'){
                this.uCount ++;
            }
        }
    }

    public int getOCount(){
        return this.oCount ;
    }

     public int getUCount(){
        return this.uCount ;
    }

}

class Demo{
    public static void main(String[] args) {
        CountDemo countData = new CountDemo("are you ok?") ;
        
        System.out.println("o: " + countData.getOCount()); // o: 2
        System.out.println("u: " + countData.getUCount()); // u: 1
    }
}
```

## 70 案例分析四（数组操作）
1、实现数组保存数据
（1）大小由外部决定
（2）增加数据，满了则失败
（3）数组扩容
（4）取得数组全部数据

2、实现两个派生类
（1）数组排序
（2）数组反转

如果子类方法和父类方法功能相同，优先考虑覆写父类方法

```java
class ArrayDemo{
    private int point = 0;
    private int[] data = null;

    public ArrayDemo(int length){
        // 传入的长度如果小于1则等于1
        if(length < 1){
            length = 1;
        }

        // 开辟数组空间
        this.data = new int[length];

    }

    // 添加元素
    public boolean add(int element){

        if(this.point < this.data.length){
            this.data[this.point] = element ;
            this.point ++ ;
            return  true;
        }
        else{
            return  false;    
        }
    }

    // 数组扩容
    public void increment(int num){

        // 数组一旦确定大小就不能被改变
        int[] newData = new int[data.length + num];
        // arraycopy(Object src, int srcPos, Object dest, int destPos, int length)
        System.arraycopy(this.data, 0, newData, 0, this.data.length);

        //修改数组引用
        this.data = newData ;
    }

    public int[] getData(){
        return this.data ;
    }

    public void printData(){
        System.out.print("{");
        for(int i : this.getData()){
            System.out.print(i);
            System.out.print(", ");
        }
        System.out.println("}");
    }
}


// 排序数组
class SortArray extends ArrayDemo{
    public SortArray(int length){
        super(length);
    }

    public int[] getData(){
        java.util.Arrays.sort(super.getData());
        return super.getData();
    }
}


// 反转数组
class ReverseArray extends ArrayDemo{
    public ReverseArray(int length){
        super(length);
    }

    public int[] getData(){
        int center = super.getData().length / 2;
        int head = 0 ;
        int tail = super.getData().length - 1;
        
        for(int i = 0 ; i < center ; i++){
            int temp =  super.getData()[head] ;
            super.getData()[head] = super.getData()[tail] ; 
            super.getData()[tail]  = temp ;

            head ++ ;
            tail -- ;
        } 

        return super.getData();
    }
}

class Demo{
    public static void main(String[] args) {
        ArrayDemo array = new ArrayDemo(3);

        System.out.println(array.add(1)); // true
        System.out.println(array.add(2)); // true
        System.out.println(array.add(3)); // true

        System.out.println(array.add(4)); // false
        System.out.println(array.add(5)); // false

        array.increment(3) ; 

        System.out.println(array.add(6)); // true
        System.out.println(array.add(7)); // true

        array.printData();
        // {1, 2, 3, 6, 7, 0, }


        // 排序数组
        SortArray sortArray = new SortArray(5);
        sortArray.add(2);
        sortArray.add(6);
        sortArray.add(3);
        sortArray.add(5);
        sortArray.printData();
        // {0, 2, 3, 5, 6, }    


        // 反转数组
        ReverseArray reverseArray = new ReverseArray(5) ;
        reverseArray.add(1) ;
        reverseArray.add(2) ;
        reverseArray.add(3) ;
        reverseArray.add(4) ;
        reverseArray.add(5) ;
        reverseArray.printData() ;
        // {5, 4, 3, 2, 1, }

    }
}

```





