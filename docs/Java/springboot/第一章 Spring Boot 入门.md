# 第一章 Spring Boot 入门

## 1、SpringBoot 简介

1、简介

1. SpringBoot 简化了 Spring 应用开发，约定大于配置
2. 整个 Spring 技术栈的一个大整合
3. J2EE 开发一站式解决方案

2、优点

1. 快速建立独立运行的 Spring 项目以及与主流框架集成
2. 使用嵌入式的 Servlet 容器，应用无需打成 war 包
3. starts 自动依赖与版本控制
4. 大量的自动配置，简化开发，也可以修改默认值
5. 无需配置 XML,无代码生成，开箱即用
6. 准生产环境的运行时应用监控
7. 与云计算的天然集成

3、缺点

1. 需要学习 Spring

## 2、微服务

2014 年 martin fowler

原文：https://martinfowler.com/articles/microservices.html

译文：http://blog.cuicc.com/blog/2015/07/22/microservices/

1. 微服务是一种架构风格
2. 一个应用应该是一组小型服务
3. 可以通过 HTTP 的方式进行互通
4. 每个功能元素最终都是一个可独立替换和独立升级的软件单元

单体应用 <-> 微服务

## 3、环境准备

```
JDK 1.8
Maven 3.x
IntelliJ IDEA 2017 或者 STS
SpringBoot 1.5.9.RELEASE
```

```
$ java -version
java version "1.8.0_221"

$ mvn -v
Apache Maven 3.6.3
```

1、修改用户级别设置 maven

~/.m2/settins.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
          http://maven.apache.org/xsd/settings-1.0.0.xsd">

    <!-- 配置镜像 -->
    <mirrors>
        <mirror>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <mirrorOf>central</mirrorOf>
            <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        </mirror>
        <mirror>
            <id>alimaven</id>
            <name>aliyun maven</name>
            <mirrorOf>central</mirrorOf>
            <url>http://maven.aliyun.com/nexus/content/repositories/central/</url>
        </mirror>
    </mirrors>

    <profiles>
        <profile>
            <id>jdk-1.8</id>
            <activation>
                <activeByDefault>true</activeByDefault>
                <jdk>1.8</jdk>
            </activation>
            <properties>
                <maven.compiler.source>1.8</maven.compiler.source>
                <maven.compiler.target>1.8</maven.compiler.target>
                <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
            </properties>
        </profile>
    </profiles>
</settings>

```

2、修改 IDEA 的 maven 路径

## 4、SpringBoot HelloWorld

1、创建 Maven 工程

2、导入 SpringBoot 依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.9.RELEASE</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

3、创建主程序

```java
package com.mouday;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// 标注主程序，说明这是一个SpringBoot应用
@SpringBootApplication
public class ApplicationMain {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationMain.class, args);
    }
}

```

4、创建 Controller

```java
package com.mouday.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {
    @RequestMapping("/hello")
    @ResponseBody
    public String hello(){
        return "Hello world!";
    }
}

```

5、启动程序

```bash
$mvn spring-boot:run
```

访问：
http://localhost:8080/hello

6、简化部署
可以将应用打包成一个可执行 jar 包

```bash
# 打包
$ mvn clean package

# 运行
$ java -jar springboot-helloword-1.0-SNAPSHOT.jar
```

## 5、文件说明

pom.xml

1、父项目

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.9.RELEASE</version>
</parent>
```

SpringBoot 版本仲裁中心

1. 我们导入的依赖默认不需要写版本

2. 没有在 dependencies 中管理的依赖需要些版本号

2、导入的依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

spring-boot-start: springBoot 场景启动器

帮我们导入了 web 模块正常运行所依赖的组件

spring-boot 将所有的功能场景都抽取出来，做成一个个的 starters 启动器

## 6、自动配置

```java
package com.mouday;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ApplicationMain {
    public static void main(String[] args) {
        SpringApplication.run(ApplicationMain.class, args);
    }
}

```

@SpringBootApplication 标注 SpringBoot 的主配置类

@SpringBootConfiguration 配置类

@Configuration 标注配置类

配置类 - 配置文件

配置类也是容器的一个组件 @Component

@EnableAutoConfiguration 开启自动配置功能

@AutoConfigurationPackage 自动配置包

将主配置类所在的包及下面子包所有组件扫描到 Spring 容器

@Import 给容器中导入一个组件
从 META-INF/spring.factories 导入自动配置类

自动配置类

org.springframework.boot.autoconfigure

## 7、使用向导快速创建 Spring Boot 应用

https://start.spring.io/

@ReponseBody

1. 用在方法上，方法直接返回给浏览器
2. 用在类上，类中的所有方法直接返回给浏览器，如果是对象转为 JSON

@RestController

等价于：

```
@Controller
@ResponseBody
```

默认生成的 SpringBoot 项目

```
resources/
    static 保存静态资源 js/css/image
    tamplates 模板页面 默认不支持jsp，可以使用模板引擎（freemaker/thymeleaf）
    application.properties 应用配置
```
