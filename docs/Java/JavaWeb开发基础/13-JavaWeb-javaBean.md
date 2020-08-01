# 第 7 章 ： JavaBean

## 课时 24：JavaBean 规范

必须要有默认的构造器（无参）
必须要为成员提供 get/set 方法
只提供一个 get 也可以,称为只读属性
对于具有 get/set 方法的成员变量称之为属性
就算属性没有对应的成员变量，只有 get/set 方法也是可以的
属性的名称就是 get/set 方法去除 get/set 之后把首字母小写

## 课时 25 BeanUtils 的使用

commons-beanutils.jar
commons-logging.jar

配置 pom.xml

```xml
<dependency>
    <groupId>commons-beanutils</groupId>
    <artifactId>commons-beanutils</artifactId>
    <version>1.9.4</version>
</dependency>

<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>

```

```java
package com.pengshiyu.bean;

public class Person {
    private String name;
    private int age ;

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

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

}

```

```java
import org.apache.commons.beanutils.BeanUtils;
import org.junit.Test;

public class TestPersonBean {
    @Test
    public void func1() throws Exception {
        String className = "com.pengshiyu.bean.Person";
        Class clazz = Class.forName(className);
        Object person = clazz.newInstance();

        // 设置属性
        BeanUtils.setProperty(person, "name", "Tom");
        BeanUtils.setProperty(person, "age", 23);

        System.out.println(person);
        // Person{name='Tom', age=23}

        // 读取属性
        String name = BeanUtils.getProperty(person, "name");
        String age = BeanUtils.getProperty(person, "age");

        System.out.println("name:" + name + " age: " + age);
        //  name:Tom age: 23
    }
}

```

```java
/**
* 把map 数据写入到bean中
* @throws Exception
*/
@Test
public void func2() throws Exception {
    Map<String, String> map = new HashMap<String, String>();
    map.put("name", "Tom");
    map.put("age", "23");

    Person person = new Person();

    BeanUtils.populate(person, map);

    System.out.println(person);
//    Person{name='Tom', age=23}

}
```

简单封装

```java
package util;

import org.apache.commons.beanutils.BeanUtils;

import java.util.Map;


public class CommonUtils {
    public static <T> T toBean(Map map, Class<T> clazz) {
        try {
            // 创建指定类型的javabean对象
            T instance = clazz.newInstance();
            // 把数据封装到javabean中
            BeanUtils.populate(instance, map);
            // 返回javabean
            return instance;
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}

```

使用

```java
Map<String, String> map = new HashMap<String, String>();
map.put("name", "Tom");
map.put("age", "23");

Person person  = CommonUtils.toBean(map, Person.class);

System.out.println(person);
//    Person{name='Tom', age=23}
```

## 课时 26 JSP 中的 JavaBean 相关标签

相关标签
`<jsp:useBean>` 创建或查询 bean

```jsp
<!-- 在page域中查找user1，不存在则创建 -->
<jsp:useBean id="user1" class="com.pengshiyu.User" scope="page" />
```

`<jsp:setProperty>` 设置属性

```jsp
<jsp:setProperty name="user1" property="username" value="Tom" />
```

`<jsp:getProperty>` 获取属性

```jsp
<jsp:getProperty name="user1" property="username" />
```
