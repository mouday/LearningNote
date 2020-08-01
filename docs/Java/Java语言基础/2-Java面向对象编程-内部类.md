# 第28 章 ： 内部类

## 126 内部类基本概念
内部类：类的内部定义其他的类

```java

// 外部类
class Outer{
    private String message = "私有属性" ;

    // 普通方法
    public void fun(){  
        // 实例化内部类并调用内部类方法
        Inner in = new Inner();
        in.printInfo();
    }

    // 内部类
    class Inner{
        public void printInfo(){
            // 内部类使用外部类中的属性
            System.out.println(Outer.this.message);
        }
    }

}

class Demo{
    public static void main(String[] args) {
        // 实例化外部类
        Outer outer = new Outer();
        outer.fun();
        // 私有属性
    }
}

```

不使用内部类实现上面代码
```java

// 外部类
class Outer{
    private String message = "私有属性" ;

    // 普通方法
    public void fun(){  
        // 实例化内部类并调用内部类方法
        Inner inner = new Inner(this);
        inner.printInfo();
    }

    public String getMessage(){
        return this.message;
    }
}

// 内部类
class Inner{
    private Outer outer;

    public Inner(Outer outer){
        this.outer = outer; 
    }

    public void printInfo(){
        // 内部类使用外部类中的属性
        System.out.println(this.outer.getMessage());
    }
}

class Demo{
    public static void main(String[] args) {
        // 实例化外部类
        Outer outer = new Outer();
        outer.fun();
        // 私有属性
    }
}

```
缺点：从整体代码结构上来讲，内部类的结构并不合理，破坏了类结构
优势：轻松访问外部类中的私有属性

## 127 内部类相关说明
内部类实例化格式：
```
外部类.内部类 内部类对象 = new 外部类().new 内部类();
```
上面实例编译后出现文件
```
Demo.java  

Demo.class      
Outer.class
Outer$Inner.class
```

其中的`$` 换到程序之中就是`.`

内部类可以使用private私有化

抽象类和接口中也可以定义内部结构

示例：内部接口
```java
interface Ichannel{
    public void send(IMessage message);
    
    interface IMessage{
        public String getContent();
    }
}

class ChannelImpl implements Ichannel{
    public void send(IMessage message){
        System.out.println(message.getContent());
    }
    
    class MessageImpl implements IMessage{
        public String getContent(){
            return "内部消息" ;
        }
    }
}

class Demo{
    public static void main(String[] args) {
        Ichannel channel = new ChannelImpl();
        channel.send(((ChannelImpl)channel).new MessageImpl());
        // 内部消息
    }
}

```

示例：内部抽象类
```java
// 定义接口
interface Ichannel{
    public void send();
    
    // 内部抽象类
    abstract class AbstractMessage{
        public abstract String getContent();
    }
}

class ChannelImpl implements Ichannel{
    public void send(){
        AbstractMessage message = new MessageImpl();
        System.out.println(message.getContent());
    }
    
    class MessageImpl extends AbstractMessage{
        public String getContent(){
            return "内部消息" ;
        }
    }
}

class Demo{
    public static void main(String[] args) {
        Ichannel channel = new ChannelImpl();
        channel.send();
        // 内部消息
    }

}

```

示例：内部类实现接口
```java
// 定义接口
interface Ichannel{
    public void send();
    
    class ChannelImpl implements Ichannel{
        public void send(){
            System.out.println("hello");
        }
    }

    public static Ichannel getInstance(){
        return new ChannelImpl();
    }
}


class Demo{
    public static void main(String[] args) {
        Ichannel channel = Ichannel.getInstance();
        channel.send();
        // hello
    }

}

```

## 128 static定义内部类
如果内部类使用了static，那么这个内部类就变成了外部类

static内部类实例化格式：
```
外部类.内部类 内部类对象 = new 外部类.内部类();
```

```java
class Outer{
    private static final String MESSAGE = "静态消息" ;

    static class Inner{
        public void print(){
            System.out.println(Outer.MESSAGE);
        }
    }
}


class Demo{
    public static void main(String[] args) {
        Outer.Inner Inner = new Outer.Inner();
        Inner.print();
        // 静态消息
    }

}

```

static定义一组相关内部接口
```java
interface IMessageWrap{
    static interface IMessage{
        public String getContent();
    }

    static interface IChannel{
        public boolean connect();
    }

    public static void send(IMessage message, IChannel channel){
        if(channel.connect()){
            System.out.println(message.getContent());
        } else {
            System.out.println("无法连接通道");
        }

    }
}

class MessageImpl implements IMessageWrap.IMessage{
    public String getContent(){
        return "消息内容" ;
    }
}

class ChannelImpl implements IMessageWrap.IChannel{
    public boolean connect(){
        return true ;
    }
}

class Demo{
    public static void main(String[] args) {
        IMessageWrap.send(new MessageImpl(), new ChannelImpl()) ; 
        // 消息内容
    }
}

```

## 129 方法中定义内部类
内部类可以在任意结构中定义
包括：类，方法，代码块


方法中定义内部类
JDK >= 1.8 内部类直接访问方法中的参数

JDK < 1.8 需要加关键字final
```java
public void fun(final long time)
```

```java
class Outer{
    private String msg = "私有消息";

    public void fun(long time){
        // 方法中定义内部类
        class Inner{
            public void print(){
                System.out.println(Outer.this.msg);
                System.out.println(time);
            }
        }

        // 方法中直接实例化内部类
        new Inner().print();
    }
}

class Demo{
    public static void main(String[] args) {
        new Outer().fun(1234567890L);
        // 私有消息
        // 1234567890
    }
}

```

## 130 匿名内部类
匿名内部类是一种简化的内部类处理形式
主要在抽象类和接口的子类上使用

```java
interface IMessage{
    public void send();
}

class MessageImpl implements IMessage{
    public void send(){
        System.out.println("Hello Java");
    }
}

class Demo{
    public static void main(String[] args) {
        IMessage message = new MessageImpl();
        message.send();
        // Hello Java
    }
}

```

如果 MessageImpl 实现只使用一次，可以使用匿名内部类

```java
interface IMessage{
    public void send();
}

class Demo{
    public static void main(String[] args) {
        IMessage message = new IMessage() {
            public void send(){
                System.out.println("Hello Java");
            }
        };
        message.send();
        // Hello Java
    }
}

```

接口中定义匿名内部类
```java
interface IMessage{
    public void send();

    public static IMessage getInstance(){
        return new IMessage() {
            public void send() {
                System.out.println("Hello Java");
            }
        };
    }
}

class Demo{
    public static void main(String[] args) {
        IMessage.getInstance().send();
        // Hello Java
    }
}

```

# 第29 章 ： 函数式编程

## 131 Lambda表达式
JDK >= 1.8
函数式编程语言：
Scala https://www.scala-lang.org/
haskell https://www.haskell.org/

```java
interface IMessage{
    public void send();
}

class Demo{
    public static void main(String[] args) {
        IMessage message = new IMessage() {
            public void send(){
                System.out.println("Hello Java");
            }
        };

        message.send();
        // Hello Java
    }
}

```

使用Lambda
```java
@FunctionalInterface
interface IMessage{
    public void send();
}

class Demo{
    public static void main(String[] args) {
        IMessage message = () -> {
            System.out.println("Hello Java");
        };
        
        message.send();
        // Hello Java
    }
}

```
使用Lambda 表达式的要求:
 SAM (Single Abstract Method)只有一个抽象方法
被称为函数式接口, 里边的方法只能有一个

Lambda表达式的格式：
方法没有参数： ()->{};
方法有参数：(参数, 参数)->{};
如果只有一行语句返回：(参数, 参数)->语句;

```java

// 函数式接口
@FunctionalInterface
interface IMath{
    public int add(int x, int y);
}

class Demo{
    public static void main(String[] args) {
        IMath math = (x, y) -> {
            return x + y ;
        };
        
        System.out.println(math.add(1, 1));
        // 2
    }
}

```
一行返回语句简化写法
```java
IMath math = (x, y) -> x + y ;
```

优势：简化代码

## 132 方法引用
引用数据类型最大的特点是可以进行内存指向处理
JDK < 1.8 对象引用操作
JDK >= 1.8 方法引用操作：不同的方法名可以描述同一个方法

引用静态方法： 类名称::static 方法名称
引用实例对象方法： 实例化对象::普通方法
引用特定类型的方法：特定类::普通方法
引用构造方法：类名称::new


示例：引用静态方法
```java
// static String    valueOf(int i)

@FunctionalInterface
interface IFunction<P, R>{
    public R change(P p);
}

class Demo{
    public static void main(String[] args) {
        IFunction <Integer, String> function = String::valueOf ;
        String str = function.change(12);
        System.out.println(str.length());
        // 2
    }
}

```
方法引用可以为一个方法定义多个名字
要求是函数式接口

示例：引用实例对象方法
```java
// String   toUpperCase()
@FunctionalInterface
interface IFunction<R>{
    public R upper();
}

class Demo{
    public static void main(String[] args) {
        IFunction <String> function = "Hello Java"::toUpperCase ;
        System.out.println(function.upper());
        // HELLO JAVA
    }
}

```

引用普通方法一般都需要实例化对象，如果不给出实例化对象，还要引用普通方法
可以使用引用特定类型的方法


示例：引用特定类型的方法
```java
// int  compareTo(String anotherString)
@FunctionalInterface
interface IFunction<P>{
    public int compare(P p1, P p2);
}

class Demo{
    public static void main(String[] args) {
        IFunction <String> function = String::compareTo ;
        System.out.println(function.compare("hello", "java"));
        // -2
    }
}

```

示例：引用构造方法
```java
class Person{
    private String name ;
    private int age ;

    public Person(String name, int age){
        this.name = name ;
        this.age = age ;
    }

    @Override
    public String toString(){
        return "Person<" + this.name + " " + this.age + ">" ;
    }
}

@FunctionalInterface
interface IFunction<C>{
    public C create(String name, int age);
}

class Demo{
    public static void main(String[] args) {
        IFunction <Person> function = Person::new ;
        System.out.println(function.create("张三", 18));
        // Person<张三 18>
    }
}

```
方法引用，只是弥补对引用支持

## 133 内建函数式接口
如果自定义Lambda表达式，需要使用@FunctionalInterface注解来声明

java.util.function 可以直接使用函数式接口

1、功能性函数式接口
```java
@FunctionalInterface
public interface Function<T,R>{
     R apply(T t);
}f

```

示例
```java
import java.util.function.Function;

class Demo{
    public static void main(String[] args) {
        Function<String, Boolean> fun = "**Hello"::startsWith;
        System.out.println(fun.apply("**"));
        // true
    }
}

```

2、消费型函数式接口
没有返回值
```java
@FunctionalInterface
public interface Consumer<T>{
    void    accept(T t);
}
```

示例
```java
import java.util.function.Consumer;

class Demo{
    public static void main(String[] args) {
        Consumer<String> fun = System.out::println;
        fun.accept("Hello");
        // Hello
    }
}

```

3、供给型函数式接口
没有接收参数，有返回值
```java
@FunctionalInterface
public interface Supplier<T>{
    T   get();
}
```

示例
```java
import java.util.function.Supplier;

class Demo{
    public static void main(String[] args) {
        Supplier<String> fun = "Hello Java"::toLowerCase;
        System.out.println(fun.get());
        // hello java
    }
}

```

4、断言型函数式接口
进行判断处理
```java
@FunctionalInterface
public interface Predicate<T>{
    boolean test(T t);
}
```

示例
```java
import java.util.function.Predicate;

class Demo{
    public static void main(String[] args) {
        Predicate<String> fun = "Hello"::equalsIgnoreCase;
        System.out.println(fun.test("HELLO"));
        // true
    }
}

```




