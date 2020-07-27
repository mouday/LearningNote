Java 注解 Annotation

概念：

Java 提供的一种原程序中的元素关联任何信息和任何元数据的途径和方法

内容：

1. Java 中常见的注解
2. 注解分类
3. 自定义注解
4. 注解应用实战

## 一、Java 中常见的注解

1、JDK 自带注解

```
@Override 覆盖
@Deprecated 废弃
@SuppressWarnings 抑制警告
```

示例代码：

AnnotationDemo.java

```java
package demo;


interface Human{
    public void sayHello();
    public void sayHi();
}


class Person implements Human{

    @Override
    public void sayHello() {
        System.out.println("hello");
    }

    @Deprecated
    @Override
    public void sayHi() {
        System.out.println("hi");
    }
}


public class AnnotationDemo {
    public static void main(String[] args) {
        Person person = new Person();
        person.sayHi();
    }
}

```

以上代码执行编译的时候会有提示

```
$ javac AnnotationDemo.java
注: AnnotationDemo.java使用或覆盖了已过时的 API。
注: 有关详细信息, 请使用 -Xlint:deprecation 重新编译。


$ javac AnnotationDemo.java -Xlint:deprecation
AnnotationDemo.java:28: 警告: [deprecation] Person中的sayHi()已过时
        person.sayHi();
              ^
1 个警告

```

可以抑制警告

```java
public class AnnotationDemo {
    @SuppressWarnings("deprecation")
    public static void main(String[] args) {
        Person person = new Person();
        person.sayHi();
    }
}
```

再次编译就没有提示了

2、常见的第三方注解

Spring

```
@Autowired
@Service
@Repository
```

MyBatis

```
@InsertProvider
@UpdateProvider
@Options
```

## 二、注解分类

1、按照运行机制分

1. 源码注解 注解只存在于源码中，编译后成.class 文件就不存在了

2. 编译时注解 注解在源码和.class 文件都存在

3. 运行时注解 在运行阶段还起作用，会影响运行逻辑
   eg: @Autowired

2、按照来源分

1. JDK 注解
2. 第三方注解
3. 自定义注解

元注解：注解的注解

## 三、自定义注解

1、自定义注解语法

示例及说明

```java
package demo;

import java.lang.annotation.*;

/**
 * Target是注解作用域：
 *  TYPE 类，接口
 *  FIELD 字段声明
 *  METHOD 方法声明
 *  PARAMETER 参数声明
 *  CONSTRUCTOR 构造方法声明
 *  LOCAL_VARIABLE 局部变量声明
 *  ANNOTATION_TYPE
 *  PACKAGE 包声明
 *
 * Retention 生命周期
 *  SOURCE 只在源码显示，编译时会丢弃
 *  CLASS 编译时会记录到class中，运行时忽略
 *  RUNTIME 运行时存在，可以通过反射读取
 *
 * Inherited 允许子类继承
 *
 * Documented 生成javadoc时会包含注解信息
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
// 1、使用关键词@interface 定义注解
public @interface Description {
    // 2、成员以无参无异常方式声明
    String desc();

    // 3、可以用default为成员指定默认值
    int age() default 18;

    // 4、成员类型是受限的，合法的类型包括原始类型及
    // String, Class, Annotation, Enumeration
    String author();
}
/**
 * 5、如果注解只有一个成员，则成员名必须取名为: value()
 * 在使用时可以忽略成员名和赋值号（=）
 *
 * 6、注解类可以没有成员，没有成员的注解称为 标识注解
 */

```

2、使用注解的语法

```java
// @<注解名>(<成员名>=<成员值>...)

class Demo {
    @Description(desc = "i am  eyeColor", author = "Tom", age = 18)
    public String eyeColor() {
        return "red";
    }

    public static void main(String[] args) {

    }
}
```

3、解析注解

概念：

通过反射获取类、函数或成员上**运行时**注解信息，从而实现动态控制程序运行的逻辑

```java
package demo;

import java.lang.annotation.*;
import java.lang.reflect.Method;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Description {
    String value();
}

@Description("a class annotation")
class Demo {
    @Description("a method annotation")
    public String eyeColor() {
        return "red";
    }
}

class DemoTest {
    public static void main(String[] args) throws ClassNotFoundException {
        // 1、使用类加载器
        Class clazz = Class.forName("demo.Demo");

        // 2、找到类上面的注解
        boolean isExist = clazz.isAnnotationPresent(Description.class);
        if (isExist) {
            // 3、拿到注解实例
            Description description = (Description) clazz.getAnnotation(Description.class);
            System.out.println(description.value());
            // a class annotation
        }

        // 找到方法上的注解
        Method[] methods = clazz.getMethods();
        for (Method method : methods) {
            boolean isMethodExist = method.isAnnotationPresent(Description.class);
            if (isMethodExist) {
                Description description = (Description) method.getAnnotation(Description.class);
                System.out.println(description.value());
            }
        }

        // 另一种解析方法
        for (Method method : methods) {
            Annotation[] annotations = method.getAnnotations();
            for (Annotation annotation : annotations) {
                if (annotation instanceof Description) {
                    Description description = (Description) annotation;
                    System.out.println(description.value());
                }
            }
        }
    }
}
```

4、继承@Inherited

```java
package demo;

import java.lang.annotation.*;
import java.lang.reflect.Method;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Documented
public @interface Description {
    String value();
}

@Description("a class annotation")
class Person {
    @Description("a method annotation")
    public String eyeColor() {
        return "red";
    }
}


class Child extends Person {
    @Override
    public String eyeColor() {
        return "red";
    }
}

// Child 继承 Person 可以获取类上面的注解
```

## 四、注解实战

1、项目说明

用注解实现持久层框架，替代 Hibernate 解决方案

2、需求：

1. 有一张用户表，字段包括用户用户名，年龄，电话
2. 方便对每个对象进行保存，并打印出 SQL。
3. 使用方式要足够简单，见代码示例。

3、思路：

1. 考虑代码如何与数据库进行映射
2. 实现 save

4、代码实现

文件目录

```
.
├── Column.java
├── Demo.java
├── Table.java
└── User.java
```

Table.java

```java
package anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Table {
    String value();
}

```

Column.java

```java
package anno;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Column {
    String value();
}

```

User.java

```java
package anno;

@Table("user")
public class User {
    @Column("name")
    private String name;

    @Column("age")
    private Integer age;

    @Column("phone_number")
    private String phoneNumber;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

```

Demo.java

```java
package anno;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Demo {
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        User user = new User();
        user.setAge(12);

        System.out.println(save(user));
        //insert into `user` (`name`, `phone_number`, `age`) values('null', 'null', '12')
    }

    private static String save(User user) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        // 获取class
        Class clazz = user.getClass();

        // 获取表名
        if (!clazz.isAnnotationPresent(Table.class)) {
            return null;
        }

        StringBuilder builder = new StringBuilder();
        builder.append("insert into ");

        Table table = (Table) clazz.getAnnotation(Table.class);
        String tableName = table.value();
        builder.append("`").append(tableName).append("` ");

        // 获取所有字段名和字段值
        Map<String, String> map = new HashMap<>();

        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (!field.isAnnotationPresent(Column.class)) {
                continue;
            }

            // 通过注解获取字段名称
            Column column = field.getAnnotation(Column.class);
            String columnName = column.value();

            // 通过反射获取字段的值
            String fieldName = field.getName();
            String methodName = "get" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1);
            Method method = clazz.getMethod(methodName);
            String columnValue = String.valueOf(method.invoke(user));

            map.put(columnName, columnValue);
        }

        // 拼装sql
        builder.append("(");
        Object[] columns = map.keySet().toArray();
        for (int i = 0; i < columns.length; i++) {
            builder.append("`").append(columns[i].toString()).append("`");
            if (i != columns.length - 1) {
                builder.append(", ");
            }
        }

        builder.append(") ");

        builder.append("values");

        builder.append("(");
        Object[] values = map.values().toArray();
        for (int i = 0; i < values.length; i++) {
            builder.append("'").append(values[i].toString()).append("'");
            if (i != values.length - 1) {
                builder.append(", ");
            }
        }
        builder.append(") ");

        return builder.toString();
    }
}

```

## 五、总结

1、认识注解

2、注解的作用范围@Target 和生命周期@Retention

（1）作用范围： 包、类、字段、方法、方法参数、局部变量

（2）生命周期：源文件 source,编译 class, 运行 runtime

3、读懂注解

4、使用注解解决实际开发问题
