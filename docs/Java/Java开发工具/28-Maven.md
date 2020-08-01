# Maven

## Maven 简介

版本控制工具 cvs,svn,git

项目构建工具 make, ant, maven gradle

1、配置文件

pom.xml

project object model

2、Maven 优势

1. 跨平台
2. 服务于构建：清理，编译，测试，生成报告，打包，部署
3. 标准化
4. 封装构建过程
5. 依赖管理工具
6. 项目规范化：约定优于配置

## 安装和配置

下载地址：https://maven.apache.org/download.cgi

Mac 安装步骤：

```
wget https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz

tar -xvf apache-maven-3.6.3-bin.tar.gz

vim ~/.bash_profile

# Maven
export MAVEN_HOME=/usr/local/apache-maven-3.6.3-bin
export PATH=${PATH}:${MAVEN_HOME}/bin

mvn -v
Apache Maven 3.6.3
```

## GAV

```xml
<groupId>org.example</groupId>
<artifactId>spring-mvc-demo</artifactId>
<version>1.0-SNAPSHOT</version>
```

示例

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 常量 -->
    <modelVersion>4.0.0</modelVersion>

    <!-- GAV -->
    <groupId>org.example</groupId>
    <artifactId>spring-mvc-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <!-- 依赖 -->
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.2.6.RELEASE</version>
            <!-- 作用域 -->
            <scope></scope>
        </dependency>

    </dependencies>
</project>
```

目录结构

```
${basedir}	存放pom.xml和所有的子目录
${basedir}/src/main/java	项目的java源代码
${basedir}/src/main/resources	项目的资源，比如说property文件，springmvc.xml
${basedir}/src/test/java	项目的测试类，比如说Junit代码
${basedir}/src/test/resources	测试用的资源
${basedir}/src/main/webapp/WEB-INF	web应用文件目录，web项目的信息，比如存放web.xml、本地图片、jsp视图页面
```

## 项目示例

项目结构

```
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── Hello.java
    │   └── resources
    └── test
```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0-SNAPSHOT</version>

</project>
```

Hello.java

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello");
    }
}
```

## 操作命令

常用操作

```bash
# 创建项目
mvn archetype:generate \
"-DgroupId=com.companyname.bank" \
"-DartifactId=consumerBanking" \
"-DarchetypeArtifactId=maven-archetype-quickstart" \
"-DinteractiveMode=false"

参数说明：

-DgourpId: 组织名，公司网址的反写 + 项目名称
-DartifactId: 项目名-模块名
-DarchetypeArtifactId: 指定 ArchetypeId，
    maven-archetype-quickstart，创建一个简单的 Java 应用
-DinteractiveMode: 是否使用交互模式

# 编译源码
mvn compile

# 编译测试代码
mvn test-compile

# 运行测试
mvn test

# 产生site
mvn site

# 打包
mvn package

# 本地Repository 中安装jar
mvn install

# 清除产生的项目
mvn clean

# 生成eclipse项目
mvn eclipse:eclipse

# 生成idea项目
mvn idea:idea

# 只打包不测试
mvn -Dtest package

# 只打包jar
mvn jar:jar

# 只测试不编译也不编译测试
mvn test -skipping compile -skipping test-compile

```

## Version

X.Y.Z-里程碑

1. X 大版本
2. Y 小版本 修改 bug，增加功能
3. Z 更新
4. 里程碑

- SNAPSHOT 快照，开发版
- alpha 内部测试
- beta 公开测试
- Release | RC 发布版 release condidate
- GA 正常版本

## 坐标

groupId 组织名
artifactId 项目名
version 版本号
packaging 打包方式 默认 jar
classifier 文档和源代码

## 仓库

1、本地仓库
Mac 下默认仓库位置

```
~/.m2/repository
```

2、远程仓库
（1）中央仓库
[https://mvnrepository.com/](https://mvnrepository.com/)

（2）私服
Nexus

（3）公共库

使用阿里云仓库

```xml
<mirrors>
    <mirror>
      <id>alimaven</id>
      <name>aliyun maven</name>
      <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
      <mirrorOf>central</mirrorOf>
    </mirror>
</mirrors>
```

## 依赖范围

Compile 编译、测试、运行 默认
Test 测试 eg: junit
Provided 编译、测试 eg: Servlet-API
Runtime 测试、运行 eg: jdbc
System 系统范围，一般不用

## 依赖冲突

1、第一声明者优先

2、路径最近的优先

3、排除依赖

```xml
 <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.6.RELEASE</version>
    <exclusions>
        <exclusion>
            <groupId></groupId>
            <artifactId></artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

聚合打包
继承
