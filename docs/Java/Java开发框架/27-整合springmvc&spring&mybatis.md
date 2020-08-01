# 整合 SSM

项目结构

```
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── pengshiyu
        │           ├── controller
        │           │   └── UserController.java
        │           ├── dao
        │           │   ├── UserDao.java
        │           │   └── impl
        │           │       └── UserDaoImpl.java
        │           ├── interceptor
        │           │   └── MyInterceptor.java
        │           ├── service
        │           │   ├── UserService.java
        │           │   └── impl
        │           │       └── UserServiceImpl.java
        │           └── vo
        │               └── User.java
        ├── resources
        │   ├── applicationContext.xml
        │   ├── db.properties
        │   ├── mappers
        │   │   └── user.mapper.xml
        │   ├── mybatis-config.xml
        │   └── spring-mvc.xml
        └── webapp
            ├── WEB-INF
            │   └── web.xml
            ├── detail.jsp
            ├── edit.jsp
            └── list.jsp
```

## 依赖

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>spring-mvc-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <build>

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
        <!-- https://mvnrepository.com/artifact/org.springframework/spring-core -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.springframework/spring-beans -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework/spring-web -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.springframework/spring-webmvc -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework/spring-aop -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework/spring-expression -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-expression</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>


        <!-- https://mvnrepository.com/artifact/commons-logging/commons-logging -->
        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <groupId>taglibs</groupId>
            <artifactId>standard</artifactId>
            <version>1.1.2</version>
        </dependency>

        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <!-- 文件上传-->
        <!-- https://mvnrepository.com/artifact/commons-io/commons-io -->
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.7</version>
        </dependency>

        <!-- https://mvnrepository.com/artifact/commons-fileupload/commons-fileupload -->
        <dependency>
            <groupId>commons-fileupload</groupId>
            <artifactId>commons-fileupload</artifactId>
            <version>1.4</version>
        </dependency>

        <!-- JSON-->
        <!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-annotations -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>2.11.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-databind -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.11.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/com.fasterxml.jackson.core/jackson-core -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.11.0</version>
        </dependency>

        <dependency>
            <groupId>org.aspectj</groupId>
            <artifactId>aspectjweaver</artifactId>
            <version>1.9.5</version>
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
            <artifactId>spring-jdbc</artifactId>
            <version>5.2.6.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.18</version>
        </dependency>

    </dependencies>
</project>
```

## 配置

1、web.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <!-- Spring-->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
    </context-param>

    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>

    <!-- Spring MVC-->
    <servlet>
        <servlet-name>spring-mvc</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>

        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>

        <!-- 表示容器在启动时立即加载servlet -->
        <load-on-startup>1</load-on-startup>
    </servlet>

    <servlet-mapping>
        <servlet-name>spring-mvc</servlet-name>
        <!-- 处理所有URL -->
        <url-pattern>/</url-pattern>
    </servlet-mapping>

    <!-- 处理乱码-->
    <filter>
        <filter-name>CharacterEncodingFilter</filter-name>
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>utf-8</param-value>
        </init-param>
    </filter>

    <filter-mapping>
        <filter-name>CharacterEncodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

</web-app>
```

2、applicationContext.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd
       http://www.springframework.org/schema/tx
       http://www.springframework.org/schema/tx/spring-tx.xsd
">

    <!-- 读取数据库配置-->
    <bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        <property name="location" value="classpath:db.properties"/>
    </bean>

    <!-- 配置dataSource-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
    </bean>

    <!-- 配置工厂-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="configLocation" value="classpath:mybatis-config.xml"/>
    </bean>

    <!-- 申明式事务-->
    <!-- 事务管理器-->
    <bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <tx:advice id="txAdvice" transaction-manager="txManager">
        <tx:attributes>
            <tx:method name="save" propagation="REQUIRED"/>
            <tx:method name="get" read-only="true"/>
            <tx:method name="*" propagation="REQUIRED"/>
        </tx:attributes>
    </tx:advice>

    <aop:config>
        <aop:pointcut id="pointcut" expression="execution(* com.pengshiyu.service.impl.*.* (..))"/>
        <aop:advisor advice-ref="txAdvice" pointcut-ref="pointcut"/>
    </aop:config>

    <!-- 扫描包下的注解-->
    <context:component-scan base-package="com.pengshiyu"/>

</beans>

```

3、db.properties

```
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/data
username=root
password=123456
```

4、spring-mvc.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 扫描包下的注解-->
    <context:component-scan base-package="com.pengshiyu.controller"/>

</beans>


```

5、mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>

    <typeAliases>
        <package name="com.pengshiyu.vo"/>
    </typeAliases>

    <mappers>
        <mapper resource="mappers/user.mapper.xml"/>
    </mappers>

</configuration>
```

6、user.mapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.pengshiyu.vo.user.mapper">
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
    <select id="selectList" resultType="User">
        select * from users
    </select>

    <select id="selectOne" resultType="User">
        select * from users where id = #{id}
    </select>

    <!-- 自增主键封装到了对象的id属性上 -->
    <insert id="insert" useGeneratedKeys="true" keyProperty="id">
        insert into users(name, password) values(#{name}, #{password})
    </insert>

    <delete id="delete">
        delete from users where id = #{id}
    </delete>

    <update id="update">
        update users set name = #{name}, password = #{password} where id = #{id}
    </update>

</mapper>
```

## 实体类

```java
package com.pengshiyu.vo;

public class User {
    private int id;
    private String name;
    private String password;

    public User(int id, String name, String password) {
        this.id = id;
        this.name = name;
        this.password = password;
    }

    public User() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}

```

## Dao

```java
package com.pengshiyu.dao;

import com.pengshiyu.vo.User;

import java.util.List;

public interface UserDao {
    public List<User> list();
    public User detail(int id);
    public int delete(int id);
    public int update(User user);
    public int insert(User user);
}

```

实现类

```java
package com.pengshiyu.dao.impl;

import com.pengshiyu.dao.UserDao;
import com.pengshiyu.vo.User;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("userDao")
public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {
    @Autowired
    @Override
    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        super.setSqlSessionFactory(sqlSessionFactory);
    }

    public List<User> list() {
        return getSqlSession().selectList("com.pengshiyu.vo.user.mapper.selectList");
    }

    public User detail(int id) {
        return getSqlSession().selectOne("com.pengshiyu.vo.user.mapper.selectOne", id);
    }

    public int delete(int id) {
        return getSqlSession().delete("com.pengshiyu.vo.user.mapper.delete", id);
    }

    public int update(User user) {
        return getSqlSession().update("com.pengshiyu.vo.user.mapper.update", user);
    }

    public int insert(User user) {
        return getSqlSession().insert("com.pengshiyu.vo.user.mapper.insert", user);
    }
}

```

## Service

```java
package com.pengshiyu.service;

import com.pengshiyu.vo.User;

import java.util.List;

public interface UserService {
    public List<User> list();
    public User detail(int id);
    public int delete(int id);
    public int update(User user);
    public int insert(User user);
}

```

实现类

```java
package com.pengshiyu.service.impl;

import com.pengshiyu.dao.UserDao;
import com.pengshiyu.service.UserService;
import com.pengshiyu.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public List<User> list() {
        return userDao.list();
    }

    public User detail(int id) {
        return userDao.detail(id);
    }

    public int delete(int id) {
        return userDao.delete(id);
    }

    public int update(User user) {
        return userDao.update(user);
    }

    public int insert(User user) {
        return userDao.insert(user);
    }
}

```

## Controller

```java
package com.pengshiyu.controller;

import com.pengshiyu.service.UserService;
import com.pengshiyu.vo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping("/list")
    public String list(ModelMap modelMap) throws IOException {
        List<User> list = userService.list();
        System.out.println(list);
        modelMap.addAttribute("list", list);
        return "/list.jsp";
    }

    @RequestMapping("/detail")
    public String detail(int id, ModelMap modelMap) throws IOException {
        User user = userService.detail(id);

        modelMap.addAttribute("user", user);
        return "/detail.jsp";
    }

    @RequestMapping("/update")
    public String update(int id, ModelMap modelMap) throws IOException {
        User user = userService.detail(id);

        modelMap.addAttribute("title", "修改");
        modelMap.addAttribute("user", user);

        return "/edit.jsp";
    }

    @RequestMapping("/add")
    public String add(ModelMap modelMap) throws IOException {
        User user = new User();

        modelMap.addAttribute("title", "添加");
        modelMap.addAttribute("user", user);
        return "/edit.jsp";
    }

    @RequestMapping("/delete")
    public String delete(int id) throws IOException {
        userService.delete(id);
        return "redirect:list";
    }

    @RequestMapping(value = "/edit", method = RequestMethod.POST)
    public String edit(User user, ModelMap modelMap) throws IOException {


        if (user.getId() != 0) {
            userService.update(user);
        } else {
            userService.insert(user);
        }

        return "redirect:detail?id=" + user.getId();
    }
}
```

## 拦截器

此项目中并没有配置生效

```java
package com.pengshiyu.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

public class MyInterceptor implements HandlerInterceptor {


    private List<String> allowedUrls;

    // 在请求处理的方法执行之前执行，
    // 返回true执行下一个拦截器，
    // 返回false不执行下一个拦截器
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle");
        // 解决中文打印乱码输出
        response.setContentType("text/html;charset=utf-8");

        // 判断session
        Object user = request.getSession().getAttribute("user");
        if(user != null){
            return true;
        }

        // 判断放行路径
        String url = request.getRequestURL().toString();
        System.out.println(url);

        for(String temp: allowedUrls){
            if(url.endsWith(temp)){
                return true;
            }
        }

        // 如果没有登录就重定向到登录页面
        response.sendRedirect("/login.do");

        return false;
    }

    // 在处理方法执行之后执行
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }

    // 在DispatcherServlet 之后执行 清理工作
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion");
    }

    public List<String> getAllowedUrls() {
        return allowedUrls;
    }

    public void setAllowedUrls(List<String> allowedUrls) {
        this.allowedUrls = allowedUrls;
    }
}

```

## 页面

list.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>

<h2>list</h2>

<button>
  <a href="/user/add">添加</a>
</button>
<table>
  <tr>
    <th>编号</th>
    <th>姓名</th>
    <th>密码</th>
    <th>详细</th>
    <th>删除</th>
  </tr>

  <c:forEach items="${list}" var="item">
    <tr>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.password}</td>
      <td><a href="/user/detail?id=${item.id}">详细</a></td>
      <td><a href="/user/update?id=${item.id}">修改</a></td>
      <td><a href="/user/delete?id=${item.id}">删除</a></td>
    </tr>
  </c:forEach>
</table>

```

detail.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>

<h2>detail</h2>
<p>
  <a href="/user/list">返回列表</a>
</p>

<button><a href="/user/update?id=${user.id}">编辑</a></button>
<p>id: ${user.id}</p>
<p>name: ${user.name}</p>
<p>password: ${user.password}</p>

```

edit.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <%@ taglib prefix="c"
uri="http://java.sun.com/jsp/jstl/core" %>

<h2>${title}</h2>

<p>
  <a href="/user/list">返回列表</a>
</p>

<form action="/user/edit" method="POST">
  <input type="text" name="id" value="${user.id}" hidden />
  <p>
    <label for="name">name</label>
    <input id="" type="text" name="name" value="${user.name}" />
  </p>
  <p>
    <label for="password">password</label>
    <input type="text" name="password" value="${user.password}" />
  </p>
  <p>
    <input type="submit" />
  </p>
</form>

```

项目代码
https://gitee.com/mouday/spring-springmvc-mybatis-demo
