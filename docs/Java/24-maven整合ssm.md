# maven 整合 ssm

项目结构

```
.
├── pom.xml
└── src
    ├── main
    │   ├── java
    │   │   └── com
    │   │       └── pengshiyu
    │   │           ├── action
    │   │           │   └── UserAction.java
    │   │           ├── bean
    │   │           │   └── User.java
    │   │           ├── dao
    │   │           │   ├── UserDao.java
    │   │           │   └── impl
    │   │           │       └── UserDaoImpl.java
    │   │           └── service
    │   │               ├── UserService.java
    │   │               └── impl
    │   │                   └── UserServiceImpl.java
    │   ├── resources
    │   │   ├── beans.xml
    │   │   ├── config
    │   │   │   ├── mybatis
    │   │   │   │   └── user.mapper.xml
    │   │   │   ├── spring
    │   │   │   │   └── user.xml
    │   │   │   └── struts
    │   │   │       └── user.xml
    │   │   ├── mybatis-config.xml
    │   │   └── struts.xml
    │   └── webapp
    │       ├── WEB-INF
    │       │   └── web.xml
    │       ├── index.html
    │       └── list.jsp
    └── test
        └── java

```

## 一、配置

1、Maven

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>spring-mybatis-struts-demo</artifactId>
    <version>1.0-SNAPSHOT</version>


    <build>
        <finalName>maven-springmvc</finalName>

        <resources>
            <!--表示把java目录下的有关xml文件,properties文件编译/打包的时候放在resource目录下-->
            <resource>
                <directory>${basedir}/src/main/java</directory>
                <includes>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                </includes>
            </resource>
            <resource>
                <directory>${basedir}/src/main/resources</directory>
            </resource>
        </resources>

        <plugins>
            <!-- tomcat7插件 maven 命令 tomcat7:run 启动项目-->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <port>8080</port>
                    <path>/</path>
                    <uriEncoding>UTF-8</uriEncoding>
                    <!--添加忽略war包检查标签，则可以让tomcat7：run指令正常启动tomcat-->
                    <ignorePackaging>true</ignorePackaging>
                    <contextFile>src/main/webapp/WEB-INF/web.xml</contextFile>
                    <contextReloadable>true</contextReloadable>
                </configuration>
            </plugin>

        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.18</version>
        </dependency>

        <dependency>
            <groupId>org.apache.struts</groupId>
            <artifactId>struts2-core</artifactId>
            <version>2.5.22</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.4</version>
        </dependency>

        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>2.0.4</version>
        </dependency>

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

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.struts/struts2-spring-plugin -->
        <dependency>
            <groupId>org.apache.struts</groupId>
            <artifactId>struts2-spring-plugin</artifactId>
            <version>2.5.22</version>
        </dependency>

        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <dependency>
            <groupId>taglibs</groupId>
            <artifactId>standard</artifactId>
            <version>1.1.2</version>
        </dependency>

    </dependencies>
</project>
```

2、Tomcat

src/main/webapp/WEB-INF/web.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
        version = "4.0">

    <!-- 配置spring -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:beans.xml</param-value>
    </context-param>

    <listener>
        <listener-class>
            org.springframework.web.context.ContextLoaderListener
        </listener-class>
    </listener>

    <!-- 配置 struts2 -->
    <filter>
        <filter-name>struts2</filter-name>
        <filter-class>org.apache.struts2.dispatcher.filter.StrutsPrepareAndExecuteFilter</filter-class>
    </filter>

    <filter-mapping>
        <filter-name>struts2</filter-name>
        <url-pattern>*.action</url-pattern>
    </filter-mapping>

    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

3、Spring

src/main/resources/beans.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!-- 配置数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/data"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

    <!-- 配置 sqlSessionFactory-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
    </bean>

    <import resource="config/spring/user.xml" />
</beans>

```

4、MyBatis

src/main/resources/mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <settings>
        <!-- 打印sql日志 -->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>

    <mappers>
        <mapper resource="config/mybatis/user.mapper.xml"/>
    </mappers>

</configuration>
```

5、Struts2

src/main/resources/struts.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.5//EN"
        "http://struts.apache.org/dtds/struts-2.5.dtd">

<struts>
    <include file="config/struts/user.xml"/>
</struts>
```

6、Spring/User

src/main/resources/config/spring/user.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="com.pengshiyu.dao.impl.UserDaoImpl">
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>

    <bean id="userService" class="com.pengshiyu.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>

    <bean id="userAction" class="com.pengshiyu.action.UserAction">
        <property name="userService" ref="userService"/>
    </bean>
</beans>

```

7、Mybatis/User

src/main/resources/config/mybatis/user.mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.pengshiyu.bean.user.mapper">
<!--
创建users表
create table users(
	id int PRIMARY key auto_increment,
	name varchar(20),
	password varchar(20)
)

插入测试数据

insert into users(name, `password`) values("小明", "123456");
insert into users(name, `password`) values("小王", "123457");
insert into users(name, `password`) values("小赵", "123458");
insert into users(name, `password`) values("小四", "123459");
-->
    <select id="getAll" resultType="com.pengshiyu.bean.User">
        select * from users
    </select>
</mapper>
```

8、Struts/User

src/main/resources/config/struts/user.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<!DOCTYPE struts PUBLIC
        "-//Apache Software Foundation//DTD Struts Configuration 2.5//EN"
        "http://struts.apache.org/dtds/struts-2.5.dtd">

<struts>
    <package name="default" namespace="/" extends="struts-default">

        <action name="list" class="userAction" method="list">
            <result>/list.jsp</result>
        </action>
    </package>

</struts>
```

## Java 类

1、User

src/main/java/com/pengshiyu/bean/User.java

```java
package com.pengshiyu.bean;

public class User {
    private int id;
    private String name;
    private String password;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

```

2、UserDao

src/main/java/com/pengshiyu/dao/UserDao.java

```java
package com.pengshiyu.dao;

import com.pengshiyu.bean.User;

import java.util.List;

public interface UserDao {
    List<User> getAll();
}

```

3、UserDaoImpl

src/main/java/com/pengshiyu/dao/impl/UserDaoImpl.java

```java
package com.pengshiyu.dao.impl;

import com.pengshiyu.bean.User;
import com.pengshiyu.dao.UserDao;
import org.mybatis.spring.support.SqlSessionDaoSupport;

import java.util.List;

public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {
    public List<User> getAll() {
        return this.getSqlSession().selectList(
                "com.pengshiyu.bean.user.mapper.getAll");
    }
}

```

4、UserService

src/main/java/com/pengshiyu/service/UserService.java

```java
package com.pengshiyu.service;

import com.pengshiyu.bean.User;

import java.util.List;

public interface UserService {
    List<User> getAll();
}

```

5、UserServiceImpl

src/main/java/com/pengshiyu/service/impl/UserServiceImpl.java

```java
package com.pengshiyu.service.impl;

import com.pengshiyu.bean.User;
import com.pengshiyu.dao.UserDao;
import com.pengshiyu.service.UserService;

import java.util.List;

public class UserServiceImpl implements UserService {
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<User> getAll() {
        return userDao.getAll();
    }
}

```

6、UserAction

src/main/java/com/pengshiyu/action/UserAction.java

```java
package com.pengshiyu.action;

import com.opensymphony.xwork2.ActionSupport;
import com.pengshiyu.bean.User;
import com.pengshiyu.service.UserService;

import java.util.List;

public class UserAction extends ActionSupport {
    private List<User> users;
    private UserService userService;

    public String list(){
        System.out.println("list");

        users = userService.getAll();
        System.out.println(users);
        return SUCCESS;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public UserService getUserService() {
        return userService;
    }

    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}

```

## 页面

1、index

src/main/webapp/index.html

```html
hello spring
```

2、list

src/main/webapp/list.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<table>
<tr>
    <th>编号</th>
    <th>姓名</th>
    <th>密码</th>
</tr>

<c:forEach items="${users}" var="item">
    <tr>
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.password}</td>
    </tr>
</c:forEach>

</table>
```

## 访问测试

GET http://localhost:8080/list.action

```
编号	姓名	密码
1	小明	123456
2	小王	123457
3	小赵	123458
4	小四	123459
```

源码地址：
https://github.com/mouday/spring-struts-mybatis-demo
