
Java笔记：SpringBoot热部署与热加载

## 课程介绍

1、热部署使用场景

- 本地调试
- 线上发布

2、优点

- 本地、线上都适用
- 无需重启服务器

3、前置知识

- Java语言
- Spring开发经验
- 构建SpringBoot项目

4、课程大纲

- 热部署原理分析
- 案例分析
- 项目演示
- 测试
- 发布程序
- 课程总结

## 热部署与热加载

1、Java热部署与热加载联系
- 不重启服务器编译/部署项目
- 基于Java的类加载器实现

2、Java热部署与热加载区别
2.1、部署方式
   - 热部署在服务器运行时重新部署项目
   - 热加载在运行时重新加载class

2.2、实现原理
   - 热部署直接重新加载整个应用
   - 热加载在运行时重新加载class

2.3、使用场景
   - 热部署多用于生产环境
   - 热加载多用于开发环境

## 热部署原理解析

1、Java类加载过程

```
初始化JVM
-> 产生启动类加载器（子类，自动加载）
-> 标准扩展类加载器
-> 系统类加载器
-> 加载class文件

```

2、类加载的5个阶段

```
加载 允许用户参与
验证
准备
解析
初始化
```

3、初始化时机5个

```
1、new (final修饰的类会放在常量池)
2、反射
3、初始化类的时候其父类没有初始化
4、主类
5、static
```

4、Java类加载器特点
- 由AppClass Loader（系统类加载器）开始加载执行的类
- 类加载器将加载任务交给其父，如果其父找不到，再由自己去加载
- Bootstrap Loader（启动类加载器）是最顶级的类加载器

5、Java类的热部署

- 类的热加载实现
- 配置Tomcat实现热部署
    1. 直接把项目web文件夹放在webapps里
    2. 在`tomcat\conf\server.xml`中 `<host></host>`内部添加`<Context/>`标签
    3. 在`%tomcat_home%\conf\Catalina\localhost`中添加一个XML


tomcat\conf\server.xml
```xml
<Context  path="/hot" docBase="webapps" crossContext="true" debug="0" privileged="true"  reloadable="true">
</Context>
```

tomcat\conf\Catalina\localhost\demo.xml

使用文件名作为路径名
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Context docBase="websites"  reloadable="true"/>
```

## Java类热加载案例分析
实现：
1、类层次结构清晰，修改某一个java类文件不需要重启服务或者重新编译运行程序
2、可以适当的运用一些设计模式使代码结构更加清晰明了，比如工厂模式

核心类MyClassLoader

## SpringBoot

简化开发，库的集合

Restful、微服务

spring-tool-suite

## Spring Boot热部署的实现

方式：
1. Spring Loaded

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>

            <dependencies>
                <!-- https://mvnrepository.com/artifact/org.springframework/springloaded -->
                <dependency>
                    <groupId>org.springframework</groupId>
                    <artifactId>springloaded</artifactId>
                    <version>1.2.8.RELEASE</version>
                </dependency>
            </dependencies>
        </plugin>
    </plugins>
</build>
```

运行项目
```bash
$ mvn spring-boot:run
```

2. Spring-boot-devtools

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

IDEA修改项目文件后需要重新编译


## SpringBoot发布方式

- 构建Jar包，命令行运行SpringBoot程序
- 构建war包，发布到Tomcat

1、构建Jar包

```bash
# 打包
$ mvn package

# 运行
$ java -jar target/demo-0.0.1-SNAPSHOT.jar
```

2、构建war包

(1)修改配置文件3处

```xml
<packaging>war</packaging>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-tomcat</artifactId>
    <scope>provided</scope>
</dependency>

<build>
    <!--生成war包的名称-->
    <finalName>demoapp</finalName>
</build>
```

(2) 新建类，Application为主类名

```java
package com.example.demo;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

}

```

打包
```bash
$ mvn clean package
```
将打包后的war包放入webapps目录下，会自动解压

还可以在新建SpringBoot项目的时候直接选择war包方式

## 遇到的问题:

使用 Apache Tomcat/7.0.100没有访问成功 出现404

Apache Tomcat/9.0.39 可以成功访问到


>参考
> [SpringBoot应用War包形式部署到外部Tomcat](https://www.imooc.com/article/49247)