# 电商秒杀项目

应用简介：

商品列表
商品详情
确认下单并支付

项目技术
IDEA + Maven + SpringBoot + MyBatis

## 创建项目

使用模板：

```
maven-archetype-quickstart
```

添加依赖

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.2.RELEASE</version>
    <relativePath/> <!-- lookup parent from repository -->
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

配置简单的 web 服务

```java
package org.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


// 开启Spring自动化配置
@EnableAutoConfiguration
@RestController
public class App
{
    @RequestMapping("/")
    public String index(){
        return "hello spring";
    }

    public static void main( String[] args )
    {
        // 启动Spring项目
        SpringApplication.run(App.class, args);
    }
}

```

修改默认配置
resources/application.properties

```
server.port=8090
mybatis.mapperLocation=classpath:mapping/*.xml

```

## 代码自动生成

修改依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>flashsale</artifactId>
    <version>1.0-SNAPSHOT</version>

    <name>flashsale</name>
    <!-- FIXME change it to the project's website -->
    <url>http://www.example.com</url>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.7</maven.compiler.source>
        <maven.compiler.target>1.7</maven.compiler.target>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.11</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.20</version>
        </dependency>

        <!-- 连接池-->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.1.3</version>
        </dependency>

        <dependency>
            <groupId>org.mybatis.spring.boot</groupId>
            <artifactId>mybatis-spring-boot-starter</artifactId>
            <version>1.3.1</version>
        </dependency>

    </dependencies>

    <build>
        <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
            <plugins>
                <!-- clean lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#clean_Lifecycle -->
                <plugin>
                    <artifactId>maven-clean-plugin</artifactId>
                    <version>3.1.0</version>
                </plugin>
                <!-- default lifecycle, jar packaging: see https://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_jar_packaging -->
                <plugin>
                    <artifactId>maven-resources-plugin</artifactId>
                    <version>3.0.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.8.0</version>
                </plugin>
                <plugin>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <version>2.22.1</version>
                </plugin>
                <plugin>
                    <artifactId>maven-jar-plugin</artifactId>
                    <version>3.0.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-install-plugin</artifactId>
                    <version>2.5.2</version>
                </plugin>
                <plugin>
                    <artifactId>maven-deploy-plugin</artifactId>
                    <version>2.8.2</version>
                </plugin>
                <!-- site lifecycle, see https://maven.apache.org/ref/current/maven-core/lifecycles.html#site_Lifecycle -->
                <plugin>
                    <artifactId>maven-site-plugin</artifactId>
                    <version>3.7.1</version>
                </plugin>
                <plugin>
                    <artifactId>maven-project-info-reports-plugin</artifactId>
                    <version>3.0.0</version>
                </plugin>
                <plugin>
                    <groupId>org.mybatis.generator</groupId>
                    <artifactId>mybatis-generator-maven-plugin</artifactId>
                    <version>1.3.5</version>

                    <dependencies>

                        <!--要想加载mybatis-generator-core
                        先把pluginManagement标签删除，
                        等在本地仓库中下载到generator这个包后，
                        在把pluginManagement这层添加上-->
                        <dependency>
                            <groupId>org.mybatis.generator</groupId>
                            <artifactId>mybatis-generator-core</artifactId>
                            <version>1.3.5</version>
                        </dependency>

                        <!--自动代码生成失败，修改mysql连接jar包的版本为5.1.30正常-->
                        <dependency>
                            <groupId>mysql</groupId>
                            <artifactId>mysql-connector-java</artifactId>
                            <version>8.0.20</version>
                        </dependency>

                    </dependencies>

                    <executions>
                        <execution>
                            <id>mybatis generator</id>
                            <phase>package</phase>
                            <goals>
                                <goal>generator</goal>
                            </goals>
                        </execution>
                    </executions>
                    <configuration>
                        <!--允许移动生成的文件-->
                        <verbose>true</verbose>
                        <!--允许自动覆盖文件-->
                        <overwrite>true</overwrite>
                        <configurationFile>
                            src/main/resources/mybatis-generator.xml
                        </configurationFile>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>

```

数据库字符集
utf-8 utf8-unicode-ci

用户信息和密码分开存储

```sql
CREATE TABLE `user_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `gender` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0代表男性，1代表女性',
  `age` int(11) NOT NULL DEFAULT '0',
  `telphone` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `register_mode` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '注册方式:byweixin,byphone,byweibo',
  `third_party_id` varchar(64) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `telphone_unique_index` (`telphone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

CREATE TABLE `user_password` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `encrypt_password` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
```

代码自动生成

src/main/resources/mybatis-generator.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>

    <!--数据库连接-->
    <context id="DB2Tables" targetRuntime="MyBatis3">
        <!--注释-->
        <commentGenerator>
            <property name="suppressAllComments" value="true"/>
            <property name="suppressDate" value="true"/>
        </commentGenerator>

        <!--数据库连接地址及账号密码-->
        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://127.0.0.1:3306/data"
                        userId="root"
                        password="123456">
        </jdbcConnection>

        <javaTypeResolver >
            <property name="forceBigDecimals" value="false" />
        </javaTypeResolver>

        <!--生成DataObject类存放位置-->
        <javaModelGenerator targetPackage="org.example.dataobject"
                            targetProject="src/main/java">
            <!--是否对model添加构造函数-->
            <property name="constructorBased" value="false"/>
            <!--是否允许子包-->
            <property name="enableSubPackages" value="true"/>
            <!--建立的model对象是否不可变，也就是生成的model没有setter方法-->
            <property name="immutable" value="false"/>
            <property name="trimStrings" value="true"/>
        </javaModelGenerator>

        <!--生成映射文件存放位置-->
        <sqlMapGenerator targetPackage="mapping"
                         targetProject="src/main/resources">
            <property name="enableSubPackages" value="true" />
        </sqlMapGenerator>

        <!--生成Dao类的存放位置-->
        <!-- 客户端代码,生成易于使用的正对Model对象和XML配置文件的代码
        type="ANNOTATEDMAPPER", 生成Java Model和基于注解的Mapper对象
        type="MIXEDMAPPER", 生成基于注解的Java Model和相应的Mapper对象
        type="XMLMAPPER", 生成SQLMap XML文件和独立的Mapper接口
        -->
        <javaClientGenerator type="XMLMAPPER"
                             targetPackage="org.example.dao"
                             targetProject="src/main/java">
            <property name="enableSubPackages" value="true" />
        </javaClientGenerator>

        <!--生成对应表及类名-->
        <!--<table schema="mybatis" tableName="user_info" domainObjectName="UserDO"
                enableInsert="true" enableSelectByExample="false"
                enableDeleteByPrimaryKey="false" enableDeleteByExample="false"
                enableCountByExample="false" enableUpdateByExample="false"
                enableSelectByPrimaryKey="true" enableUpdateByPrimaryKey="true"/>-->

        <!--避免example复杂映射的sql查询-->
        <table tableName="user_info"
               domainObjectName="UserDao"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false"
               enableInsert="true"
               enableDeleteByPrimaryKey="false"
                />

        <table tableName="user_password"
               domainObjectName="UserPasswordDao"
               enableCountByExample="false"
               enableUpdateByExample="false"
               enableDeleteByExample="false"
               enableSelectByExample="false"
               selectByExampleQueryId="false"
               enableInsert="true"
               enableDeleteByPrimaryKey="false"
                />

    </context>

</generatorConfiguration>
```

执行命令，生成 dao

```
mybatis-generator:generate
```

src/main/java/org/example/App.java

```java
package org.example;

import org.example.dao.UserDaoMapper;
import org.example.dataobject.UserDao;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



/**
 * Hello world!
 *
 */
// 开启Spring自动化配置
// @EnableAutoConfiguration
@SpringBootApplication(scanBasePackages = {"org.example"})
@RestController
@MapperScan("org.example.dao")
public class App
{

    @Autowired
    private UserDaoMapper userDaoMapper;

    @RequestMapping("/")
    public String index(){
        UserDao userDao = userDaoMapper.selectByPrimaryKey(1);
        if (userDao == null){
            return "用户对象不存在";
        } else{
            return userDao.getName();
        }

    }

    public static void main( String[] args )
    {
        SpringApplication.run(App.class, args);
    }
}

```

启动服务就可以进行数据查询操作了

问题：
Unknown system variable 'query_cache_size'

升级 mysql 连接驱动版本

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.20</version>
</dependency>
```

## MVC 配置

daoobject 数据库表映射
service/model 领域模型
controller/viewobject UI 数据

业务需求处理：

先设计领域模型
