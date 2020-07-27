# Spring

官网：[https://spring.io/](https://spring.io/)

理念：使现有技术更加实用,本身是大杂烩整合现有的框架技术

优点：

1. 轻量级框架
2. Ioc 容器-控制反转 inversion of Control
3. Aop 面向切面编程
4. 对事务支持
5. 对框架的支持

## 一、Ioc 控制反转

Ioc 是一种编程思想，由主动编程变为被动接收

别名：依赖注入 dependency injection

控制：
指谁来控制对象的创建
传统的应用程序对象的创建是由程序本身控制的
使用 spring 之后，由 spring 创建对象

反转：
正转指程序来创建对象
反转指程序本身不创建对象，而变成被动接受对象

总结：
以前对象是由程序本身创建，
使用 spring 之后，程序变为接收 spring 创建好的对象

## 简单示例

1、依赖 pom.xml

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context-support</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>

```

2、Person.java

```java
package com.pengshiyu.bean;

public class Person {
    private String name;


    public void setName(String name) {
        this.name = name;
    }


    public void sayHello() {
        System.out.println("hello " + this.name);
    }
}

```

3、beans.xml

此处是完整写法，之后将采用简写形式

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="name" value="张三" />
    </bean>
</beans>

```

4、Demo.java

```java
package com.pengshiyu.spring;

import com.pengshiyu.bean.Person;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Demo {
    public static void main(String[] args) {
        // 解析beans.xml 文件，生成对应的Bean对象
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        Person person = (Person)context.getBean("person");
        person.sayHello();
    }
}

```

## 二、Dao 管理示例

Ioc: 对象由 spring 来创建

1、UserDao

```java
package com.spring.dao;

public interface UserDao {
    public void getUser();
}

```

2、UserDaoMysqlImpl

```java
package com.spring.dao.impl;

import com.spring.dao.UserDao;

public class UserDaoMysqlImpl implements UserDao {
    @Override
    public void getUser() {
        System.out.println("Mysql 获取用户信息");
    }
}

```

3、UserDaoOracleImpl

```java
package com.spring.dao.impl;

import com.spring.dao.UserDao;

public class UserDaoOracleImpl implements UserDao {
    @Override
    public void getUser() {
        System.out.println("Oracle 获取用户信息");
    }
}

```

4、UserService

```java
package com.spring.service;

public interface UserService {
    public void getUser();
}

```

5、UserServiceImpl

```java
package com.spring.service.impl;

import com.spring.dao.UserDao;
import com.spring.service.UserService;

public class UserServiceImpl implements UserService {

    private UserDao userDao = null;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void getUser() {
        this.userDao.getUser();
    }
}

```

6、beans.xml（简化版）

```xml

<beans >
    <bean id="mysqlDao" class="com.spring.dao.impl.UserDaoMysqlImpl" />
    <bean id="oracleDao" class="com.spring.dao.impl.UserDaoOracleImpl" />
    <bean id="service" class="com.spring.service.impl.UserServiceImpl">
        <property name="userDao" ref="mysqlDao"></property>
    </bean>

</beans>

```

7、TestDemo

```java
package com.spring.test;

import com.spring.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestDemo {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        UserService service = (UserService)context.getBean("service");
        service.getUser();
    }
}

```

## 三、使用 Ioc 来创建对象的 3 种方法

Person 类

```java
package com.pengshiyu.bean;

public class Person {

    private String name;

    public Person() {

    }

    public Person(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("hello " + this.name);
    }
}
```

创建对象

```java
package com.spring.test;


import com.pengshiyu.bean.Person;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Demo {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        Person person = (Person) context.getBean("person");
        person.sayHello();

    }
}

```

beans.xml(简化版)

1、无参构造

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person" />
</beans>
```

2、有参构造

（1）根据参数下标设置

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <!-- index 构造方法下标从 0 开始 -->
        <constructor-arg index="0" value="Tom" />
    </bean>
</beans>
```

（2）根据参数名称设置

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <!-- name 参数名-->
        <constructor-arg name="name" value="Tom" />
    </bean>
</beans>
```

(3)根据参数类型设置

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
         <!-- type 参数类型 -->
        <constructor-arg type="java.lang.String" value="Tom" />
    </bean>
</beans>
```

3、工厂方法创建

(1)静态工厂

```java
package com.pengshiyu.factory;

import com.pengshiyu.bean.Person;

public class PersonFactory {
    public static Person newInstance(String name) {
        return new Person(name);
    }
}

```

```xml
<beans >
    <bean name="person" class="com.pengshiyu.factory.PersonFactory" factory-method="newInstance">
        <constructor-arg name="name" value="Tom" />
    </bean>

</beans>

```

（2）动态工厂

```java
package com.pengshiyu.factory;

import com.pengshiyu.bean.Person;

public class PersonFactory {
    public Person newInstance(String name) {
        return new Person(name);
    }
}

```

```xml
<beans>

    <bean id="factory" class="com.pengshiyu.factory.PersonFactory" />

    <bean name="person" factory-bean="factory" factory-method="newInstance">
        <constructor-arg name="name" value="Tom"/>
    </bean>

</beans>

```

注意静态工厂 `static`

## 四、Spring 配置文件

id 是 bean 的唯一标识符，如果没有配置 id，name 默认为标识符

如果配置了 id，又配置了 name，则 name 是别名
name 可以设置多个别名分隔符可以是空格、逗号、分号

class 是 bean 的全限定名=包名+类名
如果不配置 id 和 name，那么可以可以使用如下方式获取对象

```java
applicationContext.getBean(class)
```

配置如下

```xml
<beans >
    <bean id="person1" name="person user" class="com.pengshiyu.bean.Person" />
</beans>
```

获取方式

```java
Person person = (Person) context.getBean("person1");

// 或者
Person person = (Person) context.getBean("user");

// 或者
Person person = (Person) context.getBean(Person.class);
```

导入文件

```xml
<beans>
    <import resource="person.xml"/>
</beans>
```

## 五、Spring 依赖注入 DI

dependency injection
依赖：指 bean 对象创建依赖于容器，bean 对象的依赖资源

注入：指 bean 对象依赖的资源由容器来设置和装配

spring 注入

测试

```java
package com.spring.test;


import com.pengshiyu.bean.Person;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Demo {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        Person person = (Person) context.getBean("person");
        person.sayHello();

    }
}

```

1. 构造器注入

```java
package com.pengshiyu.bean;

public class Person {

    private String name;

    public Person(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("hello " + this.name);
    }
}

```

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <constructor-arg name="name" value="Tom"/>
    </bean>
</beans>
```

2. setter 注入

（1）常量注入

```java
package com.pengshiyu.bean;

public class Person {

    private String name;

    public void setName(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("hello " + this.name);
    }
}

```

```xml
<beans >
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="name" value="Tom"/>
    </bean>
</beans>

```

（2）bean 注入

```java
package com.pengshiyu.bean;

public class Address {
    private String address;

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddress() {
        return address;
    }
}

```

```java
package com.pengshiyu.bean;

public class Person {

    private String name;
    private Address address;

    public void setAddress(Address address) {
        this.address = address;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void sayHello() {
        System.out.println("hello " + this.name + this.address.getAddress());
    }
}

```

```xml
<beans >

    <bean id="address" class="com.pengshiyu.bean.Address">
        <property name="address" value="北京"/>
    </bean>

    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="name" value="Tom"/>
        <property name="address" ref="address"/>
    </bean>

</beans>

```

（3）数组注入

```java
package com.pengshiyu.bean;

public class Book {
    private  String name;

    public Book(String name){
        this.name = name;
    }

    @Override
    public String toString() {
        return "《" + this.name + "》";
    }
}

```

```java
package com.pengshiyu.bean;

import java.util.Arrays;

public class Person {

    private Book[] books;

    public void setBooks(Book[] books) {
        this.books = books;
    }

    @Override
    public String toString() {
        return "Person{" +
                "books=" + Arrays.toString(books) +
                '}';
    }
}

```

```xml
<beans >
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="books">
            <array>
                <value>水浒传</value>
                <value>红楼梦</value>
                <value>三国演义</value>
                <value>西游记</value>
            </array>
        </property>
    </bean>
</beans>
```

（4）List 注入

```java
package com.pengshiyu.bean;

import java.util.Arrays;
import java.util.List;

public class Person {

    private List<String>[] books;

    public void setBooks(List<String>[] books) {
        this.books = books;
    }

    @Override
    public String toString() {
        return "Person{" +
                "books=" + Arrays.toString(books) +
                '}';
    }
}

```

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="books">
            <list>
                <value>水浒传</value>
                <value>红楼梦</value>
                <value>三国演义</value>
                <value>西游记</value>
            </list>
        </property>
    </bean>
</beans>
```

(5)Map 注入

```java
package com.pengshiyu.bean;

import java.util.Map;

public class Person {

    private Map<String, String> cards;

    public void setCards(Map<String, String> cards) {
        this.cards = cards;
    }

    @Override
    public String toString() {
        return cards.toString();
    }
}

```

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="cards">
            <map>
                <entry key="中国银行" value="123456"></entry>
                <entry key="建设银行" value="123456"></entry>
            </map>
        </property>
    </bean>
</beans>
```

（6）Set 注入

```java
package com.pengshiyu.bean;

import java.util.Set;

public class Person {

    private Set<String> games;

    public void setGames(Set<String> games) {
        this.games = games;
    }

    @Override
    public String toString() {
        return games.toString();
    }
}

```

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="games">
            <set>
                <value>英雄联盟</value>
                <value>王者荣耀</value>
            </set>
        </property>
    </bean>
</beans>

```

(7)null 注入

```java
package com.pengshiyu.bean;

public class Person {

    public void setWife(String wife) {
        this.wife = wife;
    }

    private String wife;

    @Override
    public String toString() {
        return wife;
    }
}

```

```xml
<beans>
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="wife"><null/></property>
    </bean>
</beans>
```

(8) Properties 注入

```java
package com.pengshiyu.bean;

import java.util.Properties;

public class Person {
    private Properties props;

    public void setProps(Properties props) {
        this.props = props;
    }

    @Override
    public String toString() {
        return this.props.toString();
    }
}

```

```xml

<beans >
    <bean name="person" class="com.pengshiyu.bean.Person">
        <property name="props">
            <props>
                <prop key="name">Tom</prop>
                <prop key="sex">Man</prop>
            </props>
        </property>
    </bean>
</beans>

```

(9) p 命名空间注入
需要有对应的 set 方法

```java
package com.pengshiyu.bean;

public class Person {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
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

头文件需要引入

```xml
xmlns:p="http://www.springframework.org/schema/p"
```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="person" class="com.pengshiyu.bean.Person"
          p:name="Tom" p:age="23"/>
</beans>

```

（10）c 命名空间注入
要求有对应的构造方法

```java
package com.pengshiyu.bean;

public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
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

头文件需要引入

```xml
xmlns:c="http://www.springframework.org/schema/c"
```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="person" class="com.pengshiyu.bean.Person"
          c:name="Tom" c:age="23"/>
</beans>

```

## 六、bean 的作用域

spring

```
桥梁
轻量级
易学
ioc di
app
事务
整合框架
```

scope:

1. singleton 单例 整个容器只有一个对象实例（默认）
2. prototype 原型 每次获取 Bean 都产生一个新对象
3. request 每次请求时创建一个新的对象
4. session 会话范围内有一个对象
5. global session 只在 portlet 下有用，表示 applicatio
6. application 在应用范围中有一个对象

## Bean 自动装配

autowire

1. byName
2. byType
3. constructor

不推荐使用自动装配
