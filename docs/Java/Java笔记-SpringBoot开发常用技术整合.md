# Java笔记：SpringBoot开发常用技术整合

## 一、构建springboot工程
参考源码地址
[https://github.com/leechenxiang/imooc-springboot-starter](https://github.com/leechenxiang/imooc-springboot-starter)

可选IDE
STS Spring Tool Suit

快速开始：[https://spring.io/quickstart](https://spring.io/quickstart)

配置文件 application.properties
```bash

############################################################
#
# 开发模式设置
#
############################################################

# 热部署生效
spring.devtools.restart.enabled=true

# 监听目录
spring.devtools.restart.additional-paths=src/main/java

#spring.devtools.restart.exclude=static/**,public/**
#spring.devtools.restart.exclude=WEB-INF/**


############################################################
#
# server 服务端配置
#
############################################################

server.port=8080

#server.servlet.context-path=/demo
#server.error.path=/error
#server.address=192.168.1.2
#server.session-timeout=60

############################################################
#
# server.tomcat 服务端配置
#
############################################################

#server.tomcat.max-threads=250
server.tomcat.uri-encoding=UTF-8
#server.tomcat.basedir=H:/springboot-tomcat-tmp
#server.tomcat.access-log-enabled=true
#server.tomcat.access-log-pattern=
#server.tomcat.accesslog.directory=
#logging.path=H:/springboot-tomcat-tmp
#logging.file=myapp.log

```


## 二、接口返回json


```bash
# 时间格式化
spring.jackson.date-format=yyyy-MM-dd HH:mm:ss
spring.jackson.time-zone=GMT+8
spring.jackson.serialization.write-dates-as-timestamps=false

```


```java
package com.example.demo.pojo;

/**
 * 统一的返回封装
 */
public class JsonResult {
    private Integer code;
    private String msg;
    private Object data;

    public JsonResult(Integer code, String msg, Object data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }

    public static JsonResult success(Object data){
        return new JsonResult(0, "success", data);
    }

    public static JsonResult error(String errorMessage) {
        return new JsonResult(-1, errorMessage, null);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }
}

```
```java
package com.example.demo.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.Date;

/**
 * jackson注解使用示例
 */
@Data
public class User {

    private String name;
    private Integer age;

    // 忽略显示
    @JsonIgnore
    private String password;

    // 格式化
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", locale="zh", timezone="GMT+8")
    private Date birthday;

    // 为空不显示
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String desc;

}

```

## 三、热部署
```xml
<!--热部署-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

IDEA需要做额外的配置

## 四、资源属性配置

resource.properties
```bash
# 配置文件
com.demo.name=MyBlog
com.demo.language=zh

```

```java
package com.example.demo.pojo;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

/**
 * 资源文件中的配置映射到实体类
 */
@Configuration
@ConfigurationProperties(prefix = "com.demo")
@PropertySource(value = "classpath:resource.properties")
public class Resource {
    private String name;
    private String language;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}

```
## 五、模板引擎

```xml
<!--模板引擎 freemarker-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-freemarker</artifactId>
</dependency>

<!--模板引擎 thymeleaf-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>

```

```bash

############################################################
#
# freemarker
#
############################################################

# 上线改为true
spring.freemarker.cache=false
#spring.freemarker.template-loader-path=classpath:/templates
#spring.freemarker.charset=UTF-8
#spring.freemarker.check-template-location=true
#spring.freemarker.content-type=text/html
#spring.freemarker.expose-request-attributes=true
#spring.freemarker.expose-session-attributes=true
#spring.freemarker.request-context-attribute=request
#spring.freemarker.suffix=.ftl

############################################################
#
# thymeleaf
#
#############################################################
# 上线改为true
spring.thymeleaf.cache=false
#spring.thymeleaf.prefix=classpath:/templates/
#spring.thymeleaf.suffix=.html
#spring.thymeleaf.mode=HTML5
#spring.thymeleaf.encoding=UTF-8
#spring.thymeleaf.servlet.content-type=text/html

# 静态文件
spring.mvc.static-path-pattern=/static/**

```

freemarker

```html
<h2>freemarker</h2>

<p>${resource.name}</p>
<p>${resource.language}</p>
```

thymeleaf

基本使用方式
对象引用方式
时间类型转换
text与utext
URL
引入静态资源文件js/css
条件判断th:if与th:unless
循环th:each
分支th:switch与th:case


```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script th:src="@{/static/js/index.js}"></script>
</head>
<body>

<h2>基本语法</h2>
<p><input type="text" th:value="${user.name}"  th:id="${user.name}" th:name="${user.name}"></p>
<p><input type="text" th:value="${user.age}"></p>
<p><input type="text" th:value="${user.birthday}"></p>

<h2>日期格式化</h2>
<p><input type="text" th:value="${#dates.format(user.birthday, 'yyyy-MM-dd')}"></p>

<h2>简便写法</h2>
<div th:object="${user}">
    <p><input type="text" th:value="*{name}"  th:id="*{name}" th:name="*{name}"></p>
    <p><input type="text" th:value="*{age}"></p>
    <p><input type="text" th:value="*{birthday}"></p>
</div>

<h2>text与utext</h2>
<p>text: <span th:text="${user.desc}"></span></p>
<p>utext: <span th:utext="${user.desc}"></span></p>

<h2>网址</h2>
<a th:href="@{https://www.baidu.com/}">www.baidu.com</a>

<h2>表单</h2>
<form th:action="@{/thymeleaf/user}" method="post" th:object="${user}">
    <!-- field == id, name, value -->
    <input type="text" th:field="*{name}">
    <input type="submit">
</form>

<h2>判断</h2>
<p th:if="${user.age} == 20"> age == 20</p>
<p th:if="${user.age} gt 20"> age > 20</p>
<p th:if="${user.age} lt 20"> age < 20</p>
<p th:if="${user.age} ge 20"> age >= 20</p>
<p th:if="${user.age} le 20"> age <= 20</p>

<h2>选择框</h2>
<select name="" id="">
    <option th:selected="${user.age} == 20">20</option>
    <option th:selected="${user.age} == 18">18</option>
</select>

<h2>循环</h2>
<p th:each="person:${userList}">
    <span th:text="${person.name}"></span>
</p>

<h2>分支</h2>
<p th:switch="${user.name}">
    <span th:case="#{roles.superadmin}">超级管理员</span>
    <span th:case="#{roles.manager}">管理员</span>
    <span th:case="*">普通会员</span>
</p>
</body>
</html>
```

## 六、异常处理

通用异常 web和ajax

```java
package com.example.demo.exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 处理错误页面
 */
@ControllerAdvice
public class CustomExceptionHandler {
    public static final String ERROR_VIEW = "thymeleaf/error";

    @ExceptionHandler(value = Exception.class)
    public Object errorHandler(HttpServletRequest request,
                               HttpServletResponse response, Exception e) throws Exception {

        if (isAjax(request)) {
            ModelAndView model = new ModelAndView(new MappingJackson2JsonView());
            model.addObject("data", null);
            model.addObject("code", -1);
            model.addObject("msg", e.getMessage());
            return model;
        } else {
            ModelAndView model = new ModelAndView();
            model.addObject("exception", e);
            model.addObject("url", request.getRequestURL());
            model.setViewName(ERROR_VIEW);

            return model;
        }

    }

    /**
     * 判断是否为ajax
     *
     * @param request
     * @return
     */
    public boolean isAjax(HttpServletRequest request) {
        String ContentType = request.getHeader("Content-Type");
        String Accept = request.getHeader("Accept");

        if (ContentType != null &&
                ContentType.contains("json")) {
            return true;
        } else if (Accept != null &&
                Accept.contains("json")) {
            return true;
        } else {
            return false;
        }
    }


}

```

处理ajax错误

```java
package com.example.demo.exception;

import com.example.demo.pojo.JsonResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 处理ajax错误
 */
@RestControllerAdvice
public class AjaxExceptionHandler {

    @ExceptionHandler(value = Exception.class)
    public JsonResult errorHandler(HttpServletRequest request,
                               HttpServletResponse response, Exception e) throws Exception {

        return JsonResult.error(e.getMessage());
    }
}

```
## 七、MyBatis

依赖引入pom.xml

```xml
<!--数据库相关-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.20</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.0</version>
</dependency>

<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-starter</artifactId>
    <version>1.1.9</version>
</dependency>

<!--mybatis-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.1</version>
</dependency>

<!--mapper-->
<!--版本过低会报错-->
<!--tk.mybatis.mapper.MapperException: tk.mybatis.mapper.provider.EmptyProvider中缺少selectOne方法!-->
<dependency>
    <groupId>tk.mybatis</groupId>
    <artifactId>mapper-spring-boot-starter</artifactId>
    <version>2.0.0</version>
</dependency>

<!--pagehelper-->
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.3</version>
</dependency>

<dependency>
    <groupId>org.mybatis.generator</groupId>
    <artifactId>mybatis-generator-core</artifactId>
    <version>1.3.2</version>
    <scope>compile</scope>
    <optional>true</optional>
</dependency>
```

参数配置 application.properties
```bash
############################################################
#
# druid
#
############################################################
spring.datasource.url=jdbc:mysql://localhost:3306/data
spring.datasource.username=root
spring.datasource.password=123456
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.druid.initial-size=1
spring.datasource.druid.min-idle=1
spring.datasource.druid.max-active=20
spring.datasource.druid.test-on-borrow=true
#spring.datasource.druid.stat-view-servlet.allow=true


############################################################
#
# mybatis
# https://github.com/abel533/MyBatis-Spring-Boot
############################################################
mybatis.type-aliases-package=com.example.demo.pojo
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl

# 通用mapper
mapper.mappers=com.example.demo.utils.MyMapper
mapper.not-empty=false
mapper.identity=MYSQL

# 分页插件
pagehelper.helperDialect=mysql
pagehelper.reasonable=true
pagehelper.supportMethodsArguments=true
pagehelper.params=count=countSql

```


自动代码生成配置 generatorConfig.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE generatorConfiguration
        PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.0//EN"
        "http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">

<generatorConfiguration>
    <context id="MysqlContext" targetRuntime="MyBatis3Simple" defaultModelType="flat">
        <property name="beginningDelimiter" value="`"/>
        <property name="endingDelimiter" value="`"/>

        <plugin type="tk.mybatis.mapper.generator.MapperPlugin">
            <property name="mappers" value="com.example.demo.utils.MyMapper"/>
        </plugin>

        <jdbcConnection driverClass="com.mysql.jdbc.Driver"
                        connectionURL="jdbc:mysql://localhost:3306/data"
                        userId="root"
                        password="123456">
        </jdbcConnection>

        <!-- 对于生成的pojo所在包 -->
        <javaModelGenerator targetPackage="com.example.demo.pojo" targetProject="src/main/java"/>

        <!-- 对于生成的mapper所在目录 -->
        <sqlMapGenerator targetPackage="mapper" targetProject="src/main/resources"/>

        <!-- 配置mapper对应的java映射 -->
        <javaClientGenerator targetPackage="com.example.demo.mapper" targetProject="src/main/java"
                             type="XMLMAPPER"/>


        <table tableName="sys_user"></table>
         
    </context>
</generatorConfiguration>
```

逆向工程工具

```java
package com.example.demo.utils;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.mybatis.generator.api.MyBatisGenerator;
import org.mybatis.generator.config.Configuration;
import org.mybatis.generator.config.xml.ConfigurationParser;
import org.mybatis.generator.internal.DefaultShellCallback;

public class GeneratorDisplay {

    public void generator() throws Exception{

        List<String> warnings = new ArrayList<String>();
        boolean overwrite = true;
        // 指定 逆向工程配置文件
        File configFile = new File("generatorConfig.xml");
        ConfigurationParser cp = new ConfigurationParser(warnings);
        Configuration config = cp.parseConfiguration(configFile);
        DefaultShellCallback callback = new DefaultShellCallback(overwrite);
        MyBatisGenerator myBatisGenerator = new MyBatisGenerator(config,
                callback, warnings);
        myBatisGenerator.generate(null);

    } 
    
    public static void main(String[] args) throws Exception {
        try {
            GeneratorDisplay generatorSqlmap = new GeneratorDisplay();
            generatorSqlmap.generator();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
    }
}

```

通用Mapper
```java

package com.example.demo.utils;

import tk.mybatis.mapper.common.Mapper;
import tk.mybatis.mapper.common.MySqlMapper;

/**
 * 继承自己的MyMapper
 */
public interface MyMapper<T> extends Mapper<T>, MySqlMapper<T> {
    //TODO
    //FIXME 特别注意，该接口不能被扫描到，否则会出错
}

```

```java
package com.example.demo.mapper;

import com.example.demo.pojo.SysUser;
import com.example.demo.utils.MyMapper;

public interface UserMapper extends MyMapper<SysUser> {
}
```

自定义Mapper
```java
package com.example.demo.mapper;

import com.example.demo.pojo.Person;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

// 自定义Mapper
public interface PersonMapper {
    Person queryUserById(Integer id);

    @Transactional(propagation= Propagation.REQUIRED)
    void deleteById(Integer id);

    @Transactional(propagation= Propagation.REQUIRED)
    void updateById(Person person);
}
```
```java
package com.example.demo.pojo;

import lombok.Data;

@Data
public class Person {

    private Integer id;
    private String name;
    private Integer age;
}

```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.example.demo.mapper.PersonMapper" >

    <select id="queryUserById" resultType="com.example.demo.pojo.Person" parameterType="java.lang.Integer">
    select
        id, name, age
    from
        person
    where
        id = #{id, jdbcType=INTEGER}
    limit 1

 </select>

    <update id="updateById">
        update person
        set name = #{name}, age = #{age}
        where id = #{id}
    </update>

    <delete id="deleteById">
        delete from person
        where id = #{id}
    </delete>
</mapper>
```



mybatis
generatorConfig生成mapper和pojo
实现CURD
mybatis-pagehelper实现分页
自定义mapper实现
xml形式的sql形式有利于后期调优
使用包含pagehelper分页的MyBatis的开源框架:
https://github.com/abel533/MyBatis-Spring-Boot

事务：
事务隔离级别
default
read_uncommitted
read_committed
repeatable_read
serializable

事务传播行为
required 有事务直接用，没有新建事务
supports 有事务直接用，没有也可以
mandatory
requires_new
not_supported
never
nested

使用场景
```
@Transactional(propagation=Propagation.SUPPORTS)查询

@Transactional(propagation=Propagation.REQUIRED)增加，删除，修改
```

解决devtools与Mapper冲突

添加配置文件 META-INF/spring-devtools.properties
```bash
restart.include.hifi=/hifi-[\\w-\\.\\d]+.jar
restart.include.mybatis=/mybatis-[\\w-\\.\\d]+.jar
restart.include.mapper=/mapper-[\\w-\\.\\d]+jar
restart.include.pagehelper=/pagehelper-[\\w-\\.\\d]+jar
```
## 八、redis

引入依赖

```xml
<!-- redis-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

配置

```bash
############################################################
#
# REDIS
#
############################################################

spring.redis.database=1
spring.redis.host=127.0.0.1
spring.redis.port=6379
spring.redis.password=
spring.redis.pool.max-active=1000
spring.redis.pool.max-wait=-1
spring.redis.pool.max-idle=10
spring.redis.pool.min-idle=2
spring.redis.timeout=0

```

使用

```java
package com.example.demo.controller;

import com.example.demo.pojo.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RedisController {
    @Autowired
    private StringRedisTemplate redisTemplate;

    @GetMapping("/redis")
    public JsonResult error() {
        redisTemplate.opsForValue().set("name", "Tom");

        return JsonResult.success(redisTemplate.opsForValue().get("name"));
    }


}
```


## 九、定时任务

```java
@EnableScheduling // 开启定时任务
```

```java
package com.example.demo.task;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class HelloTask {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");
    // 每3秒执行一次
    @Scheduled(fixedRate = 3000)
    public void echo(){
        System.out.println("echo: " + dateFormat.format(new Date()));
    }

  
}

```


## 十、异步任务
```java
@EnableAsync // 开启异步任务
```

```java
package com.example.demo.task;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class HelloTask {
 
    @Async
    public void sayHello() {
        try {
            Thread.sleep(5000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```
## 十一、拦截器

定义拦截器

```java
package com.example.demo.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloInterceptor implements HandlerInterceptor {

    // 请求处理之前
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle");

        if("Tom".equals(request.getParameter("key"))){
            System.out.println("被拦截");
            return false;
        } else{
            System.out.println("放行");
            return true;
        }
    }

    // 请求处理之后
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        System.out.println("afterCompletion");
    }
}

```

注册拦截器

```java
package com.example.demo.config;

import com.example.demo.interceptor.HelloInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//WebMvcConfigurerAdapter已经被废弃了
@Configuration
public class MyWebMvcConfigurer implements WebMvcConfigurer {
    // 拦截器按照顺序执行
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HelloInterceptor()).addPathPatterns("/**");
    }
}

```