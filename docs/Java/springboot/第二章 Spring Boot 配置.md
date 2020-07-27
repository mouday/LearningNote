# 第二章 Spring Boot 配置

## 1、YAML 配置

SpringBoot 全局配置文件

```
application.properties
application.yml
```

YAML 以数据为中心，比 json、xml 更适合作为配置文件

```yml
server:
  port: 8081
```

```xml
<server>
    <port>8081</port>
</server>
```

## 2、YAML 语法

https://yaml.org/

YAML 语言教程：

http://www.ruanyifeng.com/blog/2016/07/yaml.html

1、基本语法

```
key:空格value
```

1. 空格缩进来控制层级关系，左对齐的数据就是一个层级
2. 属性和值大小写敏感
3. 空格必须有

2、值的写法
2.1、字面量：普通的值（数字，字符串，布尔）

字符串默认不用加单引号或者双引号

（1）""双引号不会转义特殊字符。特殊字符会作为本身想表达的意思
eg:

```
name: "张三\n李四"

输出：
张三[换行]
李四
```

（2）''单引号，会转义特殊字符，特殊字符最终只是一个普通的字符串数据
eg:

```
name: "张三\n李四"

输出：
张三\n李四
```

2.2、对象，map（属性和值，键值对）

（1）普通写法

```yml
person:
  name: Tom
  age: 23
```

（2）行内写法

```yml
person: { name: Tom, age: 23 }
```

2.3、数组，（List, Set）

（1）普通写法

```yml
pets:
  - cat
  - dog
  - pig
```

（2）行内写法

```yml
pets: [cat, dog, pig]
```

## 3、YAML 配置文件中值获取

配置文件

src/main/resources/application.yml

```yml
person:
  lastName: Tom
  age: 18
  boss: false
  birth: 2017/12/12
  maps: { k1: v1, k2: v2 }
  lists:
    - cat
    - dog
  dog:
    name: Jack
    age: 2
```

映射类

src/main/java/com/mouday/bean/Person.java

```java
package com.mouday.bean;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 将配置文件中的属性映射到这个组件中
 */
@Component
@ConfigurationProperties(prefix = "person")
public class Person {
    private String name;
    private Integer age;
    private Boolean sex;
    private Date birth;
    private Map<String, Object> maps;
    private List<String> lists;
    private Dog dog;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Boolean getSex() {
        return sex;
    }

    public void setSex(Boolean sex) {
        this.sex = sex;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Map<String, Object> getMaps() {
        return maps;
    }

    public void setMaps(Map<String, Object> maps) {
        this.maps = maps;
    }

    public List<String> getLists() {
        return lists;
    }

    public void setLists(List<String> lists) {
        this.lists = lists;
    }

    public Dog getDog() {
        return dog;
    }

    public void setDog(Dog dog) {
        this.dog = dog;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", sex=" + sex +
                ", birth=" + birth +
                ", maps=" + maps +
                ", lists=" + lists +
                ", dog=" + dog +
                '}';
    }
}
```

src/main/java/com/mouday/bean/Dog.java

```java
package com.mouday.bean;

public class Dog {
    private String name;
    private Integer age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Dog{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

单元测试依赖

pom.xml

```xml
<!--配置文件处理器 导入配置文件导入提示-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.12</version>
    <scope>test</scope>
</dependency>
```

单元测试

src/test/java/com/mouday/DemoApplicationTests.java

```java
package com.mouday;

import com.mouday.bean.Person;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

    @Autowired
    private Person person;

    @Test
    public void contextLoads() {
        System.out.println(person);
    }
}
```

打印结果

```
Person{name='Tom', age=18, sex=false, birth=Tue Dec 12 00:00:00 CST 2017,
    maps={k1=v1, k2=v2},
    lists=[cat, dog],
    dog=Dog{name='Jack', age=2}
}
```

读取 properties 文件配置

src/main/resources/application.properties

```
person.name=TOM
person.age=18
person.sex=false
person.birth=2017/12/12
person.maps.k1=v1
person.maps.k2=v2
person.lists=cat,dog
person.dog.name=Jack
person.dog.age=2
```

## 4、@ConfigurationProperties 与@Value 区别

|                 | @ConfigurationProperties | @Value       |
| --------------- | ------------------------ | ------------ |
| 功能            | 批量注入配置文件中的属性 | 一个一个指定 |
| 松散绑定        | 支持                     | 不支持       |
| SpEL            | 不支持                   | 支持         |
| JSR303 数据校验 | 支持                     | 不支持       |
| 复杂类型封装    | 支持                     | 不支持       |

属性名匹配规则

```
person.firstName
person.first-name
person.first_name
PERSON_FIRST_NAME
```

```java
package com.mouday.bean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 将配置文件中的属性映射到这个组件中
 */
@Component
// @ConfigurationProperties(prefix = "person")
public class Person {
    /**
     * <bean class="Person">
     *     <property name="name" value="Tom" />
     * </bean>
     *
     * value 支持
     * 字面量
     * ${key}从环境变量，配置文件中获取值
     * #{SpEL}表达式
     */
    @Value("Tom")
    private String name;

    @Value("#{12*2}")
    private Integer age;

    @Value("true")
    private Boolean sex;

    @Value("${person.birth}")
    private Date birth;
    private Map<String, Object> maps;
    private List<String> lists;
    private Dog dog;

    /**
    * 略setter/getter toString()
    */

}

```

打印结果

```
Person{name='Tom', age=24, sex=true, birth=Tue Dec 12 00:00:00 CST 2017,
maps=null, lists=null, dog=null}
```

配置文件注入值数据校验

```java
import org.hibernate.validator.constraints.Email;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@ConfigurationProperties(prefix = "person")
@Validated
public class Person {
    @Email
    private String name;
}
```

使用方式

1. 只是在某个业务逻辑中获取一个配置文件中的某项值，使用@Value
2. 专门编写一个 javaBean 来映射配置文件，那么使用@ConfigurationProperties

@Value 用法示例

```java
package com.mouday.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RestController
public class HelloController {

    @Value("${person.name}")
    private String name;

    @RequestMapping("/hello")
    @ResponseBody
    public String hello(){
        return "Hello world! " + this.name;
    }
}

```

## 5、@PropertySource、@ImportResource、@Bean

@ConfigurationProperties 默认加载全局配置

5.1、@PropertySource 加载指定配置文件

```java
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.PropertySource;

@Component
// @ConfigurationProperties(prefix = "person")
@PropertySource(value = {"classpath:person.properties"})
public class Person {}
```

5.2、@ImportResource 导入 Spring 配置文件

src/main/resources/beans.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean name="dog" class="com.mouday.bean.Dog"/>
</beans>


```

@ImportResource 标注在配置类上

```java
package com.mouday;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ImportResource;

@ImportResource(value = {"classpath:beans.xml"})
@SpringBootApplication
public class ApplicationMain {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationMain.class, args);
    }
}

```

测试方法

```java
package com.mouday;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

    @Autowired
    private ApplicationContext context;

    @Test
    public void TestDog(){
        System.out.println(this.context.containsBean("dog"));
    }
}
```

5.3、@Bean 用于配置类中给容器添加组件

```java
package com.mouday.config;

import com.mouday.bean.Dog;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @Configuration 指明当前类是一个配置类
 * 替代Spring的配置文件
 */
@Configuration
public class MyConfig {
    // 将方法的返回值添加到容器，容器中组件默认id是方法名
    @Bean
    public Dog dog(){
        return new Dog();
    }
}

```

Spring 推荐使用全注解方式给容器添加组件

## 6、配置文件占位符

RandomValuePropertySource 配置文件中可以使用随机数

```
${random.value}
${random.int}
${random.uuid}
${random.long}
${random.int(10)}
${random.int[1024,65536]}
```

属性配置占位符

```
app.name=MyApp
app.description=${app.name:默认值}
```

## 7、Profile 多环境支持

Profile 对不同环境提供不同配置功能的支持

1、多 Profile 文件

application-{profile}.properties

默认使用
application.properties
通过 spring.profiles.active=prod 指定配置文件

eg:
application.properties

```
server.port=8080
spring.profiles.active=prod
```

application-dev.properties

```
server.port=8081
```

application-prod.properties

```
server.port=8082
```

2、yaml 文档块模式

application.yml

```yml
server:
  port: 8080
spring:
  profiles:
    active: dev

---
server:
  port: 8081
spring:
  profiles: dev

---
server:
  port: 8082
spring:
  profiles: prod
```

3、激活方式

```
1、命令行
--spring.profiles.active=dev

2、配置文件
spring.profiles.active=dev

3、jvm参数
-Dspring.profiles.active=dev
```

## 8、配置文件的加载位置

Spring Boot 会自动扫描一下位置的
application.properties 或者 application.yml 文件作为配置文件

优先级从高到低，所有文件都被加载，

互补配置：高优先级覆盖低优先级

```
./config/
./
classpath:/config/
classpath:/
```

spring.config.location 修改默认位置

## 9、外部配置加载顺序

优先级从高到低如下

```
1. 命令行参数
$ java -jar springboot-helloword-1.0-SNAPSHOT.jar --server.port=8005

2. java:comp/env的JNDI属性
3. java系统属性System.getProperties()
4. 操作系统环境变量
5. RandomValuePropertySource配置的random.*属性
6. jar包外部的application-{profile}.properties或application.yml（带spring.profile）配置文件
7. jar包内部的application-{profile}.properties或application.yml（带spring.profile）配置文件
8. jar包外部的application.properties或application.yml（不带spring.profile）配置文件
9. jar包内部的application.properties或application.yml（不带spring.profile）配置文件
10. @Configuration注解类上的@PropertySource
11. 通过SpringApplication.setDefualtProperties指定的默认属性
```

总结：

1. 高优先级配置会覆盖低优先级配置
2. 所有配置会形成互补配置

## 10、自动配置原理

扫描配置文件内容包装成 properties 对象

将配置内容加载到容器中

1. AutoConfiguration 自动配置类
2. Properties 封装属性
3. @Condition 判断条件成立，决定配置类是否生效

## 11、@Conditional&自动配置报告

```
@ConditionalOnJava
@ConditionalOnMissingBean
@ConditionalOnClass
...
```

自动配置类必须在一定的条件下才生效

开启调试模式

```
debug=true
```

打印自动配置报告

```
=========================
AUTO-CONFIGURATION REPORT
=========================
Positive matches: 启动的自动配置类
Negative matches: 没启用启动的自动配置类
Exclusions:
Unconditional classes:
```
