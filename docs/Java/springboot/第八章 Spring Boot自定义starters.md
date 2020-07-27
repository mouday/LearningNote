# 第八章 Spring Boot 自定义 starters

自动配置类

```java
@Configuration   // 指定这个类是配置类
@Conditionalxxx  // 指定条件成立的情况下自动配置类生效
@AutoConfigureAfter // 指定自动配置类的顺序
@Bean // 给容器中添加组件
@ConfigurationProperties  // 结合相关Properties类来绑定相关的配置
@EnableConfigurationProperties // 让Properties生效加入到容器中

```

启动器 Starter

启动器模块是一个空的 JAR 文件，仅提供辅助性依赖管理，这些依赖可能用于自动装配或者其他类库

命名规约：
推荐使用一下命名规约

官方命名空间：
前缀：spring-boot-starter-
模式：spring-boot-starter-模块名
举例：spring-boot-starter-web、spring-boot-starter-jdbc

自定义命名空间：
前缀：-spring-boot-starter
模式：模块名-spring-boot-starter
举例：mybatis-spring-boot-starter

## 自定义 starter

1、Idea 创建空工程 Empty Project

2、新建 spring 自动配置模块

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
    https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.1.RELEASE</version>
        <relativePath/>
        <!-- lookup parent from repository -->
    </parent>
    <groupId>com.mouday</groupId>
    <artifactId>mouday-spring-boot-starter-autoconfigurer</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>mouday-spring-boot-starter-autoconfigurer</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <!--所有starter的基本配置-->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
    </dependencies>
</project>
```

属性文件 HelloProperties.java

```java
package com.mouday.starter;

import org.springframework.boot.context.properties.ConfigurationProperties;


@ConfigurationProperties(prefix = "mouday.hello")
public class HelloProperties {
    private String prefix;
    private String suffix;

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }
}

```

HelloService.java

```java
package com.mouday.starter;

public class HelloService {
    HelloProperties properties;

    public String  sayHello(String name){
        return properties.getPrefix() + name + properties.getSuffix();
    }

    public HelloProperties getProperties() {
        return properties;
    }

    public void setProperties(HelloProperties properties) {
        this.properties = properties;
    }
}

```

配置类

```java
package com.mouday.starter;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnWebApplication // web应用才生效
@EnableConfigurationProperties(HelloProperties.class)
public class HelloServiceAutoConfiguration {
    @Autowired
    HelloProperties helloProperties;

    @Bean
    public HelloService helloService(){
        HelloService service = new HelloService();
        service.setProperties(helloProperties);
        return service;
    }
}

```

src/main/resources/META-INF/spring.factories

```
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
com.mouday.starter.HelloServiceAutoConfiguration

```

3、新建 maven starter 模块

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.mouday</groupId>
    <artifactId>mouday-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>com.mouday</groupId>
            <artifactId>mouday-spring-boot-starter-autoconfigurer</artifactId>
            <version>0.0.1-SNAPSHOT</version>
        </dependency>
    </dependencies>
</project>
```

## 测试

引入依赖 pom.xml

```xml
<dependency>
    <groupId>com.mouday</groupId>
    <artifactId>mouday-spring-boot-starter</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

修改配置文件 application.properties

```
mouday.hello.prefix=hello
mouday.hello.suffix=hi
```

新建测试 Controller

```java
package com.example.demo.controller;

import com.mouday.starter.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {

    @Autowired
    HelloService helloService;

    @GetMapping("/hello")
    @ResponseBody
    public String hello(String name){
        return helloService.sayHello(name);
    }
}

```

http://localhost:8080/hello?name=Tom

访问结果

```
helloTomhi
```

学习新技术：

一看文档，二看源码
