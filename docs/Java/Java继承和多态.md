# Java 继承和多态

Java 面向对象三大特征：
封装、继承、多态

大纲

1. 多态概述
2. 多态基础
3. 多态设计

## 1. 多态概述

- 程序运行过程中，对象角色的切换
- 程序运行过程中，对象行为的扩展

## 2. 多态基础

2.1、继承：面向对象特征

继承基本语法结构

```java

public class Father {
    public String name;

    public void working(){
        System.out.println(this.name + " working...");
    }
}


public class Child extends Father{
    public void playGame(){
        System.out.println(this.name + " playGame");
    }
}


public class Demo {
    public static void main(String[] args) {
        Child child = new Child();

        // 继承属性
        child.name = "小明";

        // 继承方法
        child.working();

        // 自有方法
        child.playGame();

    }
}

```

继承关系的应用

final 关键字修饰的类，不允许被继承

单继承，多实现，突破访问限制

java 中单继承的优势 super

继承：方法重载和方法重写

方法重载：设计时多态
方法重写：运行时多态

继承：抽象类 abstract

多态基础：接口 interface, 大写字母 I 开头

JDK7 之前，接口中只允许存在抽象方法
接口可以继承另一个接口（单继承机制）
一个类型可以实现多个接口（多实现机制）

JDK8 之后，静态方法
提供给所有实现类使用的一种公共方法，访问公共资源
接口中的静态方法主要被接口名称调用
静态方法：不能被实现类继承，不能被子接口继承

JDK8 之后，默认方法
提供给所有实现类的一种特殊方法，提供了一种默认的处理方式
用于独立的基础功能的实现
默认方法：可以被子接口继承，可以被实现类继承和重写
默认方法只能由实例化对象进行调用执行

如果一个类型实现了多个接口
多个接口中出现了同名的默认方法，此时就出现了接口冲突问题
实现类中，必须重写这个默认方法，解决冲突

```java
public interface IDataTyoe{
    //  接口属性，默认修饰符 public static final
    String TYPE = "JSON";

    // 等价于
    public static final String TYPE = "JSON";

    // 接口方法, 默认修饰符 public abstract
    String formatMessage();

    // 等价于
    public abstract String formatMessage();

    // 静态方法
    static String getType(){
        return IDataTyoe.TYPE;
    }

    // 默认方法
    default String sendMessage(){
        ...
    }
}
```

接口应用

- 访问规范
- 标记接口

## 多态

对象行为的转换，方法重写实现的操作

对象角色的转换，接口多实现的操作
