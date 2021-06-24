# Maven软件依赖管理

## 大纲
1. 快速入门
    - 环境搭建
    - IDEA创建项目
    - 目录结构分析

2. 高手进阶
    - repository仓库解析
    - pom.xml配置详解
    - GAV软件定位坐标
    - mvn命令 & 生命周期
    - maven项目手工构建
    - maven项目自动构建

3. 高级应用
    - 依赖范围解析
    - 项目继承下的依赖
    - 项目聚合下的依赖
    - 项目常用插件配置
    - 私有服务器管理

4. 应用拓展
    - 基础应用：Java SE项目
    - 应用升级：Java WEB项目
    - 应用拓展：SSM项目构建
    - 应用拓展：SpringBoot项目
    - 应用拓展：测试项目应用

## 概述
Maven: 一个用于自动化构建项目和管理项目依赖的工具

环境搭建
1、 JDK 
Java Development Kit
JAVA_HOME CLASSPATH PATH

```bash
$ java -version
java version "1.8.0_251"
```

2、 Maven 
MAVEN_HOME version1
M2_HOME    version2
PATH       version3

下载地址
[https://maven.apache.org/](https://maven.apache.org/)

配置环境变量
```bash
vim ~/.bash_profile

# maven
export MAVEN_HOME=/Users/Applications/apache-maven-3.6.3
export PATH=$PATH:$MAVEN_HOME/bin
```

查看maven版本
```bash
$ mvn -version
Apache Maven 3.6.3 (cecedd343002696d0abb50b32b541b8a6ba2883f)
```

3、 IDEA

## Maven创建项目

配置IDEA的Maven路径，选择自定义安装的路径

1、快速构建web项目
选择Maven项目 maven-archetype-webapp

2、管理Maven依赖，分析依赖关系

搜索依赖地址：[https://mvnrepository.com/](https://mvnrepository.com/)

pom.xml添加依赖
```xml
<dependencies>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>javax.servlet-api</artifactId>
      <version>3.1.0</version>
      <scope>provided</scope>
    </dependency>

    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>javax.servlet.jsp-api</artifactId>
      <version>2.2.1</version>
      <scope>provided</scope>
    </dependency>
</dependencies>
```

插件列表：[https://maven.apache.org/plugins/index.html](https://maven.apache.org/plugins/index.html)

pom.xml添加插件

```xml
<plugins>
    <pluginManagement>
        <build>
            <plugin>
              <groupId>org.apache.tomcat.maven</groupId>
              <artifactId>tomcat7-maven-plugin</artifactId>
              <version>2.2</version>
            </plugin>
        </plugins>
    </pluginManagement>
</build>
```

3、运行项目，检测Maven项目

（1）Maven

运行命令
```bash
$ mvn tomcat7:run
```

可以配置到启动命令
```
选择Maven -> Command line添加tomcat7:run
```

（2）添加到Tomcat

配置启动命令
```
选择Tomcat -> Deployment -> Artifact
```

4、防火墙影响访问国外仓库：
[Info] Generating project in Batch mode

配置阿里云中央仓库 

https://maven.aliyun.com/mvn/guide

```bash
$ vim ~/.m2/settings.xml
```

```xml
<mirrors>
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
</mirrors>
```

项目结构
```bash
.
├── pom.xml
├── src               # source
│   └── main
│       ├── java      # 业务代码
│       ├── resources # 资源文件
│       └── webapp
│           ├── WEB-INF
│           │   └── web.xml
│           └── index.jsp
└── target            # 目标文件 

```

pom.xml 
project object model 项目对象模型
package object management 依赖包对象管理器

## Maven基础操作

1、仓库 Repository

配置文件默认路径:`~/.m2/settings.xml`

1. 远程仓库/中央仓库/国内镜像仓库
```xml
<mirror>
    <id>alimaven</id>
    <mirrorOf>central</mirrorOf>
    <name>aliyun maven</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

2. 本地仓库
```xml
<localRepository>~/.m2/repository</localRepository>
```

3. 私有服务器

## Maven配置
全局配置 settings.xml

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                          https://maven.apache.org/xsd/settings-1.0.0.xsd">
    <!-- 本地仓库配置：默认~/.m2/repository[推荐修改配置] -->
    <localRepository>${user.home}/.m2/repository</localRepository>

    <!-- 交互方式配置，读取用户输入信息[使用默认即可，很少修改] -->
    <interactiveMode>true</interactiveMode>

    <!-- 是否启用独立的插件配置文件，一般很少启用[默认即可，很少修改] -->
    <usePluginRegistry>false</usePluginRegistry>

    <!-- 是否启用离线构建模式，一般很少修改[如果长时间不能联网的情况下可以修改] -->
    <offline>false</offline>
  
    <!-- 是否启用插件groupId自动扫描[很少使用，配置插件时建议全信息配置] -->
    <pluginGroups></pluginGroups>

    <!--配置服务端的一些设置如身份认证信息(eg: 账号、密码) -->
    <servers></servers>

    <!-- 镜像位置 -->
    <mirrors></mirrors>

    <!-- 代理 -->
    <proxies></proxies>

    <profiles></profiles>

    <activeProfiles></activeProfiles>

    <activation></activation>

    <properties></properties>

    <repositories></repositories>

</settings>
```

jdk1.8_profile.xml
```xml
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
```

项目配置 pom.xml
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
    http://maven.apache.org/xsd/maven-4.0.0.xsd">  

<!-- 1、项目基本信息配置 -->
<!-- 2、项目构建环境配置 -->
<!-- 3、项目仓库管理配置 -->
<!-- 4、项目依赖管理配置 -->
<!-- 5、项目报表信息配置 -->
<!-- 6、项目部分分发配置 -->
</project>
```

优先级 : 
```
项目配置pom.xml > 用户配置settings.xmlnote > 全局配置settings.xml
```

完整配置：
[Maven: settings.xml、pom.xml完整配置](https://pengshiyu.blog.csdn.net/article/details/111463059)

## GAV坐标
版本号：
```
软件名称.主版本号.小版本号.阶段版本号.字母版本号
```

字母版本号：
alpha 内测版
beta  公测版
rc    候选版
stable 稳定版
release/r/ga 发布版
final 最终版

## Maven命令操作

1、项目构建命令
```
mvn --version
mvn archetype:generate
```
2、项目清理、编译、打包

```
mvn clean
mvn compile
mvn package
```
3、项目运行、测试、发布
```
mvn tomcat:run
mvn test
mvn site
mvn dependency:tree
mvn install
mvn deploy
```
## Maven生命周期

clean lifecycle 项目构建之前的清理环节
default lifecycle 项目编译和打包环节
site lifecycle 项目报告，站点信息，发布环节

## 构建Maven项目

1、手工构建Maven项目

项目结构
```bash
$ tree
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── demo
    │   │           └── Hello.java
    │   └── resources
    └── test
        ├── java
        │   └── com
        │       └── demo
        └── resources
```

pom.xml文件
https://maven.apache.org/guides/getting-started/index.html

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
  http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
 
  <groupId>com.demo</groupId>
  <artifactId>hello</artifactId>
  <version>1.0-SNAPSHOT</version>

  <packaging>jar</packaging>

</project>
```

Hello.java
```java
package com.demo;

public class Hello{
    public static void main(String[] args){
        System.out.println("Hello");
    }
}
```

```bash
# 清理
$ mvn clean

# 编译
$ mvn compile

# 运行
$ mvn exec:java -Dexec.mainClass="com.demo.Hello"
```

2、命令构建Maven项目

创建命令

```bash
# <3.0.5
mvn archetype:create

# >3.0.5
mvn archetype:generate
```

参数
```bash
-DgroupID=""
-DartifactID=""
-DpackageName=""
-DarchetypeArtifactId="maven-archetype-quickstart/maven-archetype-webapp"
-DinteractiveMode=false
```

eg:
```bash
$ mvn archetype:generate \
-DgroupId=com.demo \
-DartifactId=java-demo \
-DpackageName=com.demo \
-DarchetypeArtifactId=maven-archetype-quickstart
```

3、工具构建Maven项目

使用 IDEA创建Maven项目

## archetype项目骨架加载过慢问题

拷贝`archetype-catalog.xml`到目录
```
~/.m2/repository/org/apache/maven/archetype/archetype-catalog/3.1.2
```

IDEA Build Tools -> Maven Runner设置VM Options:
```
-DarchetypeCatalog=local
```

## 自定义archetype项目骨架解决版本问题

windows如果报错需要修改
```
mvn.cmd -> mvn.bat
```


```bash
# 构建项目骨架
$ mvn archetype:create-from-project

# 安装到本地仓库
$ mvn clean install
```

## Maven依赖范围管理

```
软件的依赖：
  - G: groupID
  - A: artifactID  
  - V: Version
  - Scope
    - compile  编译、运行、测试、打包（默认）
    - provided 编译、运行 eg: servlet
    - runtime  运行、打包 eg: mysql
    - test     测试
    - system   编译、运行
```

## Maven父子项目依赖传递

父子项目
优点：
1. 合理有效的复用依赖jar包
2. 子项目互相独立，更加便于敏捷开发和独立管理

缺点：
1. 项目之间的系统集成性能较差


父项目pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
  http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.demo</groupId>
  <artifactId>maven-parent</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>maven-parent</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <!-- 1、父项目的打包方式 -->
  <packaging>pom</packaging>

  <!-- 2、版本统一管理 -->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <log4j.version>1.2.17</log4j.version>
    <junit.version>4.11</junit.version>
    <spring.version>5.1.9.RELEASE</spring.version>
  </properties>

  <!--3、父项目中基本依赖 -->
  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>${junit.version}</version>
      <scope>test</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-core</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-beans</artifactId>
      <version>${spring.version}</version>
    </dependency>
  </dependencies>

  <!--4、父项目中统一管理的依赖，依赖容器，子项目中使用时才会引入-->
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>${log4j.version}</version>
      </dependency>
    </dependencies>
  </dependencyManagement>

</project>

```

子项目pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
  http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!--1、继承关系，继承一个项目 -->
  <parent>
    <groupId>com.demo</groupId>
    <artifactId>maven-parent</artifactId>
    <version>1.0-SNAPSHOT</version>
    <relativePath>../maven-parent/pom.xml</relativePath>
  </parent>

  <!--2、子项目中，会自动继承父项目的groupId-->
  <!--<groupId>com.demo</groupId>-->
  <artifactId>maven-wiki</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>maven-wiki</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>

  <!--  3、使用父项目中，依赖管理器中统一管理的依赖-->
  <!--  可以不写版本号，由父项目进行统一管理 -->
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
    </dependency>
  </dependencies>

</project>

```

## Maven项目聚合统一管理

项目聚合关系：
项目之间整体性较高，便于系统集成和维护

```xml
<modules>
    <module>maven-child1</module>
    <module>maven-child2</module>
</modules>
```

## Maven插件管理
生命周期插件
  - resources
  - source
  - clean
  - compile

常用操作插件
  - tomcat7
  - dependency
  - jar

Maven插件查找
https://maven.apache.org/plugins/index.html

查看依赖插件
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.1.2</version>
</plugin>
```

查看依赖
```bash
$ mvn dependency:tree
```

IDEA中可以右键查看依赖图

## Maven私有服务器

- Apache Archiva
- JFrog Artifactory
- Sonatype Nexus

下载页面：
https://www.sonatype.com/nexus/repository-oss/download

```
Products->Nexus Repository Manager->OSS Edition
```

或者：
https://help.sonatype.com/repomanager3/download

国外地址无法下载，找到一个方法，使用香港的服务器下载后再下载到本地

百度网盘下载：
链接: https://pan.baidu.com/s/1HY3Cwr8KSCm92JByc_BmQg
提取码: 6jwk

操作
```bash
# 启动
cd bin
$ ./nexus start
```

默认端口:
http://localhost:8081/


## 创建私有仓库

私有服务器分类

- proxy 代理远程仓库
- group 分组管理
- hosted 发布本地开发项目
  - releases 稳定版
  - snapshots  快照版

## 依赖下载和项目发布

依赖查找顺序：
```
本地仓库 < 私有仓库 < 中央仓库
```

登录之后可以创建新的仓库

1、从私有仓库通过代理下载依赖 pom.xml

```xml
<!--配置私有仓库地址-->
<!--从私有仓库下载的包会被缓存-->
<repositories>
    <repository>
        <id>my-central</id>
        <name>My Central</name>
        <url>http://localhost:8081/repository/my-central/</url>
        <releases>
            <enabled>true</enabled>
        </releases>
        <snapshots>
            <enabled>true</enabled>
        </snapshots>
    </repository>
</repositories>
```

2、发布项目 pom.xml

```xml
<groupId>com.demo</groupId>
<artifactId>maven-demo</artifactId>

<!-- 快照版 -->
<version>1.0-SNAPSHOT</version>

<!-- 正式版  -->
<version>1.0-RELEASE</version>


<!--配置发布仓库地址-->
<distributionManagement>
    <repository>
        <id>my-release</id>
        <name>My Release</name>
        <url>http://localhost:8081/repository/my-release/</url>
    </repository>

    <snapshotRepository>
        <id>my-snapshot</id>
        <name>My Snapshot</name>
        <url>http://localhost:8081/repository/my-snapshot/</url>
    </snapshotRepository>
</distributionManagement>
```

配置账号密码 `~/.m2/settings.xml`
```xml
<servers>
    <server>
        <id>my-snapshot</id>
        <username>admin</username>
        <password>123456</password>
    </server>
    <server>
        <id>my-release</id>
        <username>admin</username>
        <password>123456</password>
    </server>
</servers>
```

发布

```bash
$ mvn deploy
```

## Maven构建JavaSE项目

通过IDEA创建Maven项目

项目结构
```bash
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── demo
    │   │           └── HelloWorld.java
    │   └── resources
    └── test
        └── java
```

HelloWorld.java

```java
package com.demo;

public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("hello");
    }
}

```

运行方式：

1. 直接运行

2. 配置运行参数
```
exec:java -Dexec.mainClass="com.example.HelloWorld"
```

## Maven构建JavaWeb项目

项目骨架：maven-archetype-webapp

手工创建

项目结构
```
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── demo
    │   │           └── HelloServlet.java
    │   ├── resources
    │   └── webapp
    │       ├── WEB-INF
    │       │   └── web.xml
    │       └── index.jsp
    └── test
        └── java

```
pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.demo</groupId>
    <artifactId>java-web-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 修改打包方式 -->
    <packaging>war</packaging>

    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <!--编译和运行时生效-->
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!--命令行启动：$ mvn tomcat7:run-->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
            </plugin>
        </plugins>
    </build>
</project>
```

web.xml
```xml
<?xml version="1.0" encoding="UTF8"?>

<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1"
         metadata-complete="false">

    <welcome-file-list>
        <welcome-file>index.jsp</welcome-file>
    </welcome-file-list>

</web-app>
```
index.jsp

```html
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Demo</title>
</head>
<body>
    <h2>我的web项目</h2>
</body>
</html>
```

HelloServlet.java

```java
package com.demo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 使用 WebServlet 需要配置 web.xml
 * version > 3.0
 * metadata-complete=false
 *
 * 参考：https://www.cnblogs.com/iCheny/p/10976735.html
 */
@WebServlet(value = "/hello")
public class HelloServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("Hello World.");
    }
}

```

项目构建 Project Structure 创建Web 模块

两种方式启动：

1、命令行运行
```bash
$ mvn tomcat7:run
```

2、配置Tomcat


IDEA的即改即生效都不是太好，开发起来很痛苦啊
Eclipse 生效很及时

以Debug模式运行，编译后就生效了

## 依赖冲突

1、依赖直接冲突

```xml
<dependency>
  <groupId>commons-beanutils</groupId>
  <artifactId>commons-beanutils</artifactId>
  <version>1.9.4</version>
</dependency>

<!-- 优先排除低版本的依赖，一般情况下高版本会兼容低版本 -->
<dependency>
  <groupId>org.apache.poi</groupId>
  <artifactId>poi</artifactId>
  <version>3.5-FINAL</version>
  <exclusions>
    <exclusion>
      <artifactId>commons-logging</artifactId>
      <groupId>commons-logging</groupId>
    </exclusion>
  </exclusions>
</dependency>
```

2、依赖传递冲突


## 课程总结

1. 环境搭建，文件结构

2. 项目构建，配置梳理

3. 仓库，坐标，命令和生命周期

4. 项目依赖的范围管理

5. 父子项目的传递，聚合项目的管理

6. 私有服务器的构建使用

7. 增强项目功能的插件

8. 不同类型项目的构建

9. 解决项目中的依赖冲突


