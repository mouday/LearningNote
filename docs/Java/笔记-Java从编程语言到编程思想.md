# Java从编程语言到编程思想

## Java语言的变化

（1）1.2 
集合框架Collection Framework
Java Beans

（2）1.3 
略

（3）1.4 
assert

（4）1.5 

工厂方法，返回一个数组
```java
package com.demo;

public class Java5Demo {
    public static void main(String[] args) {
        // String[] values = new String[]{"pig", "dog"};

        String[] values = of("pig", "dog");
    }

    public static <T> T[] of(T... values){
        return values;
    }
}

```

强制需要一个参数

```java
package com.demo;

public class Java5Demo {
    public static void main(String[] args) {
        // String[] values = new String[]{"pig", "dog"};
        String[] values = of("pig", "dog", "cat");
    }

    public static <T> T[] of(T one, T... values){
        return values;
    }
}

```

（5）1.7

@Override 进行编译器检测

```java
package com.demo;

public class Java5Demo extends Object{
    @Override
    public String toString() {
        return "Java5Demo";
    }
}

```
异常try...catch...

```java
try {
    FileInputStream stream = new FileInputStream("name.txt");
    // 多异常精确捕获
} catch (FileNotFoundException | RuntimeException e) {
    e.printStackTrace();
}
```
```java
// AutoCloseable 接口, 会自动关闭，不需要finaly中关闭
try (FileInputStream stream = new FileInputStream("name.txt")) {


} catch (FileNotFoundException e) {
    e.printStackTrace();
} catch (IOException e) {
    e.printStackTrace();
}
```

1.8 Lambda

1.9 模块化

2.0 类型推断

## 数据结构

- 原生类型
    - boolean
    - byte
    - sort
    - int
    - long
    - float
    - double
- 对象类型
    - Object
    - String
    - Class
- 数组类型
    - int[]
    - Object[]
    - ...

- 集合类型
    - Collection Stack Vector
    - List Set Queue Map Enumeration
    - Iterable Iterator


```java
package com.demo;

import java.util.Arrays;

public class Demo{
    public static void main(String[] args) {
        print(Arrays.asList("a", "b", "c"));
    }

    public static void print(Iterable<?> iterable){
        for(Object object: iterable){
            System.out.println(object);
        }
    }
}

```

## Java类库提升
- Java5 
    - 并发框架(J.U.C)
    - 格式化Formatter
    - Java管理扩展(JXM)
    - Instrumentation
    - XML处理（DOM、SAX、XPath、XSTL）

- Java6
    - JDBC 4.0
    - JAXB 2.0
    - 可拔插注解处理API
    - Common Annotations
    - Java Compiler API
    - Scripting JVM

- Java7
    - NIO2
    - Fork/Join框架
    - invokedynamic字节码

- Java8
    - Stream API
    - CompletableFuture
    - Annotation on Java Types
    - Date and Time API
    - 可重复Annotations
    - JavaScript 运行时

Java 9
    - Reactive Streams Flow API
    - Process API Updates
    - Variable Handles
    - Method Handles
    - Spin-Wait Hints
    - Stack-Walking API

Java 10
    - Java-Based JIT Compiler

```java
System.out.printf("Hello %s", "Tom");
// Hello Tom
```

## 编程模型
- 面向对象编程OOP 
    - 封装性（访问限制）
    - 派生性（上下游关系）
    - 多态性（一种接口多种实现）

- 面向切面编程AOP
    - 静态接口
    - 动态代理
    - 字节码提升 ASM CGLIB Javassist BCEL
    - 拦截判断 方法，注解，参数，异常
    - 拦截执行 前置，后置，返回，异常

- 面向元信息编程MDOP
    - 注解 @Annotation
    - 反射 Reflection
    - 泛型 Generic

- 面向函数编程FOP
    - 函数式接口 @FunctionalInterface
    - 默认方法
    - 方法引用

- 面向模块编程MOP

## 编程思想
- 契约编程
    - 操作对象 Field字段、Method方法、Constructor构造器
    - 语义命名：模块名、包名、类名、枚举、字段、方法、常量
    - 访问控制：private（默认）、protected、public
    - 异常错误：类型（检查和非检查、层次（Throwable、Error、Exception）、来源（JDK 自定义 三方库）
    - 构造器、方法参数：名称、类型（数据结构、泛型）、顺序、数量、约束
    - 方法返回类型：类型（数据结构、泛型）、多态性（层次性）、约束（注解）

- 设计模式
    - 面向对象设计模式
        - 构造模式
        - 结构模式
        - 行为模式
        - 并发模式
    - 面向切面设计模式
        - 判断模式
        - 拦截模式
    - 面向元数据设计模式
        - 泛型接口设计
        - 注解驱动设计
    - 面向函数设计模式
        - 函数式接口设计SCFP
        - Fluent API设计
        - Reactive / Stream API设计
- 模式驱动
    - 接口驱动
        - Java SE (GoF23模式)
        - Java EE API (Servlet/JSP/EJB)
        - Spring Core API(interface 21)
        
    - 配置驱动
        - Java System Properties
        - OS 环境变量
        - 文件配置（XML/Properties/YAML）
        - Java EE配置（JDNI/Servlet EJB）

    - 注解驱动
        - Java EE （Java Beans/JMX）
        - Java EE (Servlet 3.0/JAX-RS/Bean Validation/EJB 3.0)
        - Spring(@Component/@Service/@Respository)
        - Spring Boot(@SpringBootApplication)
        - Spring Cloud(@SpringCloudApplication)

    - 函数驱动
        - Java 8 Stream API
        - Java 9 FLow API
        - RxJava
        - Vert.x
        - Spring Boot WebFlux
        - Spring Cloud Gateway/Function

    - 模块驱动
        - Java OSGI
        - Java 9 Module
        - Spring @Enable*
        - Spring Boot AutoConfiguration
        - Spring Boot Actuator

























