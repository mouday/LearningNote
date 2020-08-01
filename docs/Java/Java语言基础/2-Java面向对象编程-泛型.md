# 第22 章 ： 泛型
## 96 泛型问题引出

JDK >= 1.5
主要为了解决 ClassCastException

举例：
要描述一个坐标类，允许存放以下坐标数据类型
整型    x = 10, y = 20
浮点型  x = 10.1, y = 20.2
字符串型 x = 东经 10 度 , y = 北纬 20 度

可以使用Object，不过会出现转型操作
整型： 基本数据类型 -> Integer包装类 -> 自动向上转型为Object
浮点型 ：基本数据类型 -> Double包装类 -> 自动向上转转型为Object
字符串型 ：String对象 -> 自动向上转转型为Object

```java
class Point{
    private Object x ;
    private Object y ;

    public Point(Object x, Object y){
        this.x = x ;
        this.y = y ;
    }

    public void setX(Object x){
        this.x = x ;
    }

     public void setY(Object y){
        this.y = y ;
    }

    public Object getX(){
        return this.x ;
    }

    public Object getY(){
        return this.y ;
    }

    @Override
    public String toString(){
        return "Point("+ this.x + ", " + this.y + ")" ;
    }
}


class Demo{
    public static void main(String[] args) {
        Point p1 = new Point(1, 2);
        System.out.println(p1); // Point(1, 2)
        int x = (Integer)p1.getX() ;
        System.out.println(x);  // 1

        Point p2 = new Point(1.1, 2.2);
        System.out.println(p2); // Point(1.1, 2.2)

        // Object 不能约束传入的参数
        Point p3 = new Point(10, "北纬20度");
        System.out.println(p3); // Point(10, 北纬20度)
    }
}

```
## 97 泛型基本定义
类中属性或方法的参数与返回值类型由对象实例化的时候动态决定
需要在类定义的时候明确的定义占位符(泛型标记)

实例化不设置泛型类型，默认使用Object
```java
Point<Integer> p1 = new Point<Integer>(1, 2);
```

泛型的好处：
1、编译时检查类型，避免出现安全隐患
2、避免向下转型操作

泛型注意点：
1、只能使用引用类型，基本类型要使用包装类
2、JDK >=1.7开始可以简写
```java
Point<Integer> p1 = new Point<>(1, 2);
```
使用泛型可以解决大部分的类对象强制转换处理


```java
class Point<T>{
    private T x ;
    private T y ;

    public Point(){}

    public Point(T x, T y){
        this.x = x ;
        this.y = y ;
    }

    public void setX(T x){
        this.x = x ;
    }

     public void setY(T y){
        this.y = y ;
    }

    public T getX(){
        return this.x ;
    }

    public T getY(){
        return this.y ;
    }

    @Override
    public String toString(){
        return "Point("+ this.x + ", " + this.y + ")" ;
    }
}


class Demo{
    public static void main(String[] args) {
        Point<Integer> p1 = new Point<Integer>(1, 2);
        System.out.println(p1); // Point(1, 2)
        int x = (Integer)p1.getX() ;
        System.out.println(x);  // 1

        Point<Double> p2 = new Point<Double>(1.1, 2.2);
        System.out.println(p2); // Point(1.1, 2.2)

        Point<String> p3 = new Point<String>("东经30度", "北纬20度");
        System.out.println(p3); // Point(10, 北纬20度)
    }
}

```

## 98 泛型通配符
目前的泛型进行引用传递
```java
class Message<T>{
    private T content;

    public void setContent(T message){
        this.content = message;
    }

    public T getContent(){
        return this.content;
    }
}

class Demo{
    public static void main(String[] args) {
        Message<String> message = new Message<>();
        message.setContent("Hello Java");
        showMessage(message);
    }

    // 只能接收Message<String> 对象
    public static void showMessage(Message<String> message){
        System.out.println(message.getContent());
        // Hello Java
    }
}
 
```
修改为通配符接收数据
```java
public static void showMessage(Message<?> message) {
    System.out.println(message.getContent());
    // Hello Java
}
```

设置泛型范围
```java
// 设置泛型上限
// ? extends 类
// 例如：只允许设置Number 或其子类
? extends Number 

// 设置泛型下限
// ? super 类
// 例如：只能够使用String 或其父类
? super String 
```

```java
public static void showMessage(Message<? extends Number> message) {
    System.out.println(message.getContent());
}


public static void showMessage(Message<? super String> message) {
    System.out.println(message.getContent());
}
```

## 99 泛型接口
1、实现类继续使用泛型
```java
interface IMessage<T>{
    public void echo(T t);
}

class Messageimpl<S> implements IMessage<S> {
   public void echo(S t){
    System.out.println(t);
   }
}

class Demo{
    public static void main(String[] args) {
        Messageimpl<String> message = new Messageimpl<>();
        message.echo("Hello");
        // Hello
    }
}

```

2、实现类不使用泛型
```java
interface IMessage<T>{
    public void echo(T t);
}

class Messageimpl implements IMessage<String> {
   public void echo(String t){
    System.out.println(t);
   }
}

class Demo{
    public static void main(String[] args) {
        Messageimpl message = new Messageimpl();
        message.echo("Hello");
        // Hello
    }
}

```

## 100 泛型方法
泛型方法：泛型标记写到了方法上
泛型方法不一定非要出现在泛型类中

```java
class Demo{
    public static <T> T[] getArray(T ...args){
        return args;
    }

    public static void main(String[] args) {
        Integer[] list = getArray(1, 2, 3);
        for(int x : list){
            System.out.println(x);
            // 1 2 3
        }
    }
}

```

# 第23 章 ： 包的定义及使用
## 101 包的定义
包 == 目录
“.”表示分隔子目录
```java
package com.name.demo;

public class Hello{}

```
编译后的.class文件需要保存到指定目录中

打包处理
```
$ javac -d . Hello.java
```
-d 表示要生成的目录，package定义的结构
. 表示当前所在目录
程序执行的时候一定要带着包执行程序

```
$ java  com.name.demo.Hello
```

## 102 包的导入
直接编译,让java决定编译先后顺序
```
$ java -d . *.java
```
注意：
1、`public class`类名必须与文件名保持一致
2、要被其他包所使用的类要加`public`
3、一般一个java文件只有一个class类
4、`class` 类名称可以与文件名不一致，可以提供多个类，会被编译为多个class文件
而且只能被本包所访问
包名必须采用小写字母定义

导入可以使用通配符 `*`
不表示全部加载，会根据需要加载
会出现引用不明确问题

使用的时候直接写完整路径

```java
import com.name.demo;

com.name.demo.Hello();
```

导包示例

Message.java
```java
package com.name.demo ;

public class Message{
    public void printMessage(String message){
        System.out.println(message);
    }
}

```

Demo.java
```java
import com.name.demo.Message ;

class Demo{
    public static void main(String[] args) {
        Message message = new Message();
        message.printMessage("Hello Message") ;
    }
}

```

打包执行
```
# 编译打包文件
$ javac -d . *.java

# 执行
$ java Demo
Hello Message

```

文件目录
```
├── Demo.class
├── Demo.java
├── Message.java
└── com
    └── name
        └── demo
            └── Message.class
```

## 103 静态导入
JDK >=1.5 
```java
import static com.name.demo.Demo.* ;

```

Message.java
```java
package com.name.demo ;

public class Message{

    public static void echoMessage(String message){
        System.out.println(message);
    }

}

```

Demo.java
```java
import static com.name.demo.Message.* ;

class Demo{
    public static void main(String[] args) {
        echoMessage("Hello Message") ;
    }
}

```

## 104 生成jar文件
jar文件： 管理class文件

步骤：
打包编译 javac -d . Message.java
打包jar jar -cvf name.jar com
-c create 创建文件
-v verbose 详细输出
-f file 要生成的jar文件

rar打开jar文件

每个.jar文件都是独立的程序路径，必须通过CLASSPATH配置
windows: 以分号分隔
```
$ SET CLASSPATH=.;d:\name.jar
```

Mac：以冒号分隔
```
$ export CLASSPATH=".:/root/name.jar"
```
JDK < 1.9
所有类的jar文件： rt.jar tools.jar

JDK >= 1.9 模块化设计

## 105 系统常用包
Java自身提供类库
第三方提供支持类库

java.lang String, Number, Object JDK 1.1自动导入
java.lang.reflect 反射机制
java.util 工具类，数据结构
java.io  输入输出
java.net 网络开发
java.sql 数据库编程
java.applet 嵌套网页执行
java.awt 图形界面GUI开发Windows位置
java.swing（JDK1.2）轻量级图形开发包

## 106 访问控制权限
面向对象三个特点：封装，继承，多态
访问控制权限
```
访问范围         private    default   protected    public
同包同类           true        true      true       true
同包不同类                      true      true       true
不同包的子类                              true       true 
不同包的所有类                                        true 
```

参考选择
属性定义 private
方法定义 public


通过子类访问protected 属性

Message.java
```java
package com.util.a ;

public class Message{
    protected String info = "message info";
}

```

TestMessage.java
```java
package com.util.b ;

import com.util.a.Message ;

public class TestMessage extends Message{
    public void showInfo(){
        System.out.println(super.info);
    }
}

```

Demo.java
```java
import com.util.b.TestMessage ;

public class Demo{
    public static void main(String[] args) {
        new TestMessage().showInfo();
    }
}

```

# 第24 章 ： UML图形

## 107 类图
UML统一建模语言： 利用图形化的形式来实现程序类关系的描述

三层结构表示
```
类名称
属性 
方法
```

抽象类属性斜体abstract

属性格式：访问权限 属性名称: 属性类型
public +
protected #
private -

方法格式：访问权限 方法名称(): 返回值

画图工具
Rational Role
PowerDesigner

子类实现接口 三角和虚线
子类继承父类 三角和实线

## 108 时序图
描述代码的执行流程

## 109 用例图
描述程序执行分配
一般出现在项目设计过程


# 第25 章 ： 单例设计模式
## 110 单例设计
单例设计模式：只允许提供一个实例对象
    -饿汉式：系统加载就实例化
    -懒汉式：第一次使用的时候实例化
多例设计模式

单例模式特点：
构造方法私有化，内部提供static方法获取实例化对象

饿汉式单例模式
```java
class Singleton{
    private static Singleton singleton = new  Singleton();
    
    // 构造函数私有化
    private Singleton(){};

    public static Singleton getInstance(){
        return singleton ;
    }
}

class Demo{
    public static void main(String[] args) {
        Singleton singleton = Singleton.getInstance();
    }
}

```

懒汉式单例模式
```java
class Singleton{
    private static Singleton singleton ;
    
    // 构造函数私有化
    private Singleton(){};

    public static Singleton getInstance(){
        // 第一次使用实例化
        if (singleton == null){
           singleton = new  Singleton();
        }
        return singleton ;
    }
}

```

## 111 多例设计
```java
class Color{
    private String title;

    private static final Color RED = new Color("红色");
    private static final Color GREEN = new Color("绿色");
    private static final Color BLUE = new Color("蓝色");

    private Color(String title){
        this.title = title ;
    };

    public static Color getInstance(String color){
        switch(color){
            case "red" : return RED;
            case "green" : return GREEN;
            case "blue" : return BLUE;
            default: return null;
        }
    }

    @Override
    public String toString(){
        return this.title;
    }
}

class Demo{
    public static void main(String[] args) {
        Color red = Color.getInstance("red") ;
        System.out.println(red);
    }
}

```

单例和多例都会提供一个静态获取实例化的方法

# 第26 章 ： 枚举
## 112 定义枚举类
JDK >= 1.5
枚举主要用于定义有限个数对象的一种结构（多例设计）

枚举可以在程序编译时判断实例化对象是否存在
```java
enum Color{
    RED,
    GREEN,
    BLUE
}

class Demo{
    public static void main(String[] args) {
        for(Color color : Color.values()){
            System.out.println(color);
        }
        // RED GREEN BLUE
    }
}

```

switch中对枚举类判断
```java
enum Color{
    RED,
    GREEN,
    BLUE
}

class Demo{
    public static void main(String[] args) {
        Color color = Color.RED ;
        
        switch(color){
            case RED :
                System.out.println("红色");
                break;

            case GREEN :
                System.out.println("绿色");
                break;

            case BLUE :
                System.out.println("蓝色");
                break;

            default :
                System.out.println("default");
        }
        // 红色
    }
}

```

## 113 Enum类
枚举本质是一个类

枚举中每一个对象序号都是根据枚举对象的定义顺序来决定的
```java
enum Color{
    RED,
    GREEN,
    BLUE
}

class Demo{
    public static void main(String[] args) {
        for(Color color : Color.values()){
            System.out.println(color.ordinal() + " - " + color.name());
        }
        /**
        0 - RED
        1 - GREEN
        2 - BLUE
        */
    }
}
```

enum和Enum区别
enum 是JDK 1.5之后提供的关键字，定义枚举类
Enum 是一个抽象类，关键字enum定义的类默认继承此类

## 114 定义枚举结构
枚举类本身属于多例设计模式

在枚举类中定义其他结构
```java
// 枚举类
enum Color{

    // 枚举对象要写在首行
    RED("红色"), GREEN("绿色"), BLUE("蓝色") ;


    // 定义属性
    private String title ;

    private Color(String  title){
        this.title = title ;
    }

    @Override
    public String toString(){
        return this.title ;
    }
}

class Demo{
    public static void main(String[] args) {
        for(Color color : Color.values()){
            System.out.println(color.ordinal() + " - " + color.name() + " - " + color);
        }
        /**
       0 - RED - 红色
        1 - GREEN - 绿色
        2 - BLUE - 蓝色
        */
    }
}
```

枚举类中可以实现接口继承
```java
interface Imessage{
    public String getMessage();
}

enum Color implements Imessage{
    RED("红色"), GREEN("绿色"), BLUE("蓝色") ;

    private String title ;

    private Color(String  title){
        this.title = title ;
    }

    @Override
    public String toString(){
        return this.title ;
    }

    public String getMessage(){
        return this.title ;
    }
}

class Demo{
    public static void main(String[] args) {
        Imessage message = Color.RED ;
        System.out.println(message.getMessage());
        // 红色
    }
}
```

枚举类可以直接定义抽象方法，
并且要求每一个枚举对象都要独立覆写此抽象方法
```java

enum Color{
    RED("红色"){
        public String getMessage(){
            return this.toString();
        }
    }, 

    GREEN("绿色"){
        public String getMessage(){
            return this.toString();
        }
    }, 

    BLUE("蓝色"){
        public String getMessage(){
            return this.toString();
        }
    } ;

    private String title ;

    private Color(String  title){
        this.title = title ;
    }

    @Override
    public String toString(){
        return this.title ;
    }

    public abstract String getMessage() ;
        
}

class Demo{
    public static void main(String[] args) {        
        System.out.println(Color.RED.getMessage());
        // 红色

    }
}
```

枚举类不建议写太多内容

## 115 枚举应用案例
```java
enum Sex{
    MAN("男"), FEMALE("女") ;

    private String title;

    private Sex(String title){
        this.title = title ;
    }

    @Override
    public String toString(){
        return this.title ;
    }
}

class Person{
    private String name ;
    private int age ;
    private Sex sex ;

    public Person(String name, int age, Sex sex){
        this.name = name ;
        this.age = age ;
        this.sex = sex ;
    }

    @Override
    public String toString(){
        return "Person(" + this.name + " " + this.age + " " + this.sex + ")";
    }
}


class Demo{
    public static void main(String[] args) {
        Person person = new Person("张三", 23, Sex.MAN);
        System.out.println(person);
        // Person(张三 23 男)
    }
}


```












