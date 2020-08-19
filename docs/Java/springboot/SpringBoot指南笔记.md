# Spring Boot 指南

学习地址：https://snailclimb.gitee.io/springboot-guide/

## RESTful Web 服务

新建 SpringBoot 项目

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>

<!-- 需要下载 IDEA 中支持 lombok 的插件 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

相关注解

```
@Controller    返回一个页面
@ResponseBody  数据直接以 JSON 或 XML 形式返回
@RestController = @Controller + @ResponseBody
@PathVariable  地址参数
@RequestParam  查询参数
@RequestBody  body 中的 JSON 类型数据反序列化为合适的 Java 类型
```

实体类

```java
package com.example.demo.entity;

import lombok.Data;

@Data
public class Book {
    private String name;
    private String description;
}

```

控制器

```java
package com.example.demo.controller;

import com.example.demo.entity.Book;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class BookController {

    private List<Book> books = new ArrayList<>();

    // 获取列表
    @GetMapping("/books")
    public ResponseEntity<List<Book>> list() {
        return ResponseEntity.ok(this.books);
    }

    // 获取单个
    @GetMapping("/book/{id}")
    public ResponseEntity<Book> getBook(@PathVariable("id") int id) {
        return ResponseEntity.ok(this.books.get(id));
    }

    // 查询数据
    @GetMapping("/book")
    public ResponseEntity<List<Book>> getBookByName(@RequestParam("name") String name) {
        List<Book> result = this.books.stream()
                .filter(book -> book.getName().equals(name))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // 删除数据
    @DeleteMapping("/book/{id}")
    public ResponseEntity<Boolean> deleteBook(@PathVariable("id") int id) {
        this.books.remove(id);
        return ResponseEntity.ok(true);
    }

    // 添加数据
    @PostMapping("/book")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        this.books.add(book);
        return ResponseEntity.ok(book);
    }
}

```

测试
http/http-client.private.env.json

```json
{
  "dev": {
    "BASE_URL": "http://localhost:8080"
  }
}
```

http/books.http

```
GET {{BASE_URL}}/api/books

###

POST {{BASE_URL}}/api/book
content-type: application/json

{
"name": "《三国演义》",
"description": "一本书"
}

###

POST {{BASE_URL}}/api/book
content-type: application/json

{
  "name": "《西游记》",
  "description": "第2本书"
}

###

POST {{BASE_URL}}/api/book
content-type: application/json

{
  "name": "《红楼梦》",
  "description": "第3本书"
}

###

GET {{BASE_URL}}/api/book/1

###

GET {{BASE_URL}}/api/book?name=《红楼梦》

###

DELETE {{BASE_URL}}/api/book/0

```

## 返回视图

添加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

控制器

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HelloController {
    @GetMapping("/hello")
    public String hello(@RequestParam(name = "name", required=false, defaultValue = "World") String name,
                        Model model){
        model.addAttribute("name", name);
        return "hello";
    }
}

```

视图文件
templates/hello.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <h2 th:text="'hello ' + ${name}"></h2>
  </body>
</html>
```

http://localhost:8080/hello

返回

```
hello World
```

## Servlet 生命周期的注解

@PostConstruct 和@PreDestroy

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Configuration
public class MyConfig {
    public MyConfig(){
        System.out.println("MyConfig");
    }

    @PostConstruct // 项目启动的时候执行方法
    public void init(){
        System.out.println("PostConstruct");
    }

    @PreDestroy // 释放 bean 所持有的资源
    public void destroy(){
        System.out.println("destroy");
    }
}

```

## 读取配置文件

application.properties

```bash
# 自定义配置
person.name=Tom
person.age=23
```

接收配置

```java
package com.example.demo.bean;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "person") // 指定前缀
@Data
public class PersonBean {
    private String name;
    private Integer age;
}

```

控制器

```java
package com.example.demo.controller;

import com.example.demo.bean.PersonBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PersonController {
    @Autowired
    PersonBean personBean;

    @GetMapping("/person")
    public PersonBean person(){
        return this.personBean;
    }
}

```

测试接口读取配置

```
GET http://localhost:8080/person

{
  "name": "Tom",
  "age": 23
}
```

## 异常处理

定义异常处理

```java
package com.example.demo.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<Map<String, Object>> exceptionHandler(Exception e){
        Map<String, Object> data = new HashMap<>();
        data.put("errMsg", e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(data);
    }
}

```

抛出异常

```java
package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class ExceptionController {
    @GetMapping("/exception")
    public void exception(){
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "不对");
    }
}

```

自定义异常处理实践

```
ErrorCode                 异常枚举类
ErrorResponse             异常返回数据
BaseException             自定义异常基类
ResourceNotFoundException 资源未找到
GlobalExceptionHandler    全局异常处理
ExceptionController       异常测试
```

```java
package com.example.demo.exception;

import org.springframework.http.HttpStatus;

/**
 * 错误枚举类
 */
public enum ErrorCode {
    UNKNOWN_EXCEPTION(1000, HttpStatus.BAD_REQUEST, "未知错误"),

    RESOURCE_NOT_FOUND(1001, HttpStatus.NOT_FOUND, "未找到该资源"),

    REQUEST_VALIDATION_FAILED(1002, HttpStatus.BAD_REQUEST, "请求数据格式验证失败");


    private final int code;          // 异常码
    private final HttpStatus status; // http状态码
    private final String message;    // 提示消息

    ErrorCode(int code, HttpStatus status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}

```

```java
package com.example.demo.exception;

public class ErrorResponse {

    private int code;

    private int status;

    private String message;

    public ErrorResponse() {
    }

    public ErrorResponse(int code, int status, String message) {
        this.code = code;
        this.status = status;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

```

```java
package com.example.demo.exception;

public abstract class  BaseException extends RuntimeException {
    private final ErrorCode error;

    public BaseException(ErrorCode error) {
        this.error = error;

    }

    public ErrorCode getError() {
        return error;
    }
}
```

```java
package com.example.demo.exception;

public class ResourceNotFoundException extends BaseException{
    public ResourceNotFoundException() {
        super(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
```

```java
package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

@ControllerAdvice
@ResponseBody
public class GlobalExceptionHandler {

    // 自定义异常处理
    @ExceptionHandler({BaseException.class})
    public ResponseEntity<ErrorResponse> baseExceptionHandler(BaseException e){
        ErrorResponse response = new ErrorResponse();
        response.setCode(e.getError().getCode());
        response.setStatus(e.getError().getStatus().value());
        response.setMessage(e.getError().getMessage());

        return ResponseEntity.status(e.getError().getStatus()).body(response);
    }

    // 其他异常处理
    @ExceptionHandler
    public ResponseEntity<ErrorResponse> exceptionHandler(Exception e){
        ErrorResponse response = new ErrorResponse();
        response.setCode(ErrorCode.UNKNOWN_EXCEPTION.getCode());
        response.setStatus(ErrorCode.UNKNOWN_EXCEPTION.getStatus().value());
        response.setMessage(ErrorCode.UNKNOWN_EXCEPTION.getMessage());

        return ResponseEntity.status(ErrorCode.UNKNOWN_EXCEPTION.getStatus()).body(response);
    }
}

```

```java
package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ExceptionController {
    @GetMapping("/resourceException")
    public void resourceException(){
        throw new ResourceNotFoundException();
    }

    @GetMapping("/exception")
    public void exception(){
        throw new RuntimeException();
    }
}

```

## 开发中热部署

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

## 使用 JPA

1、依赖
pom.xml

```xml
<!--数据库相关-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

2、配置数据源
application.properties

```bash

# 数据源配置
spring.datasource.url=jdbc:mysql://localhost:3306/data?useSSL=false&serverTimezone=CTT
spring.datasource.username=root
spring.datasource.password=123456

# 打印出 sql 语句
spring.jpa.show-sql=true

#一定要不要在生产环境使用 ddl 自动生成表结构
spring.jpa.hibernate.ddl-auto=create
spring.jpa.open-in-view=false

# 创建的表的 ENGINE 为 InnoDB
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL55Dialect

```

配置选项 spring.jpa.hibernate.ddl-auto

这个属性常用的选项有四种：

```
create:      每次重新启动项目都会重新创新表结构，会导致数据丢失
create-drop: 每次启动项目创建表结构，关闭项目删除表结构
update:      每次启动项目会更新表结构
validate:    验证表结构，不对数据库进行任何更改
```

一定要不要在生产环境使用 ddl 自动生成表结构

3、实体类

```java
package com.example.demo.entity;


import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Data
@NoArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private Integer age;

    public Person(String name, Integer age) {
        this.name = name;
        this.age = age;
    }

}
```

启动服务的时候 Hibernate 会打印出建表语句

```sql
 drop table if exists person

 create table person (
     id bigint not null auto_increment,
     age integer,
     name varchar(255),
     primary key (id)
) engine=InnoDB

 alter table person add constraint UK_p0wr4vfyr2lyifm8avi67mqw5 unique (name)
```

4、创建 Repository 接口

```java
package com.example.demo.repository;

import com.example.demo.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    // where name = ?
    Optional<Person> findByName(String name);

    // 查询部分属性
    @Query("select p.name from Person p where p.id = :id")
    String findNameById(Long id);

    // 查询全部属性
    @Query("select p from Person p where p.id = :id")
    Person findPersonById(Long id);

    // 更新 需要额外添加两个注解
    // javax.persistence.TransactionRequiredException: Executing an update/delete query
    @Transactional
    @Modifying
    @Query("update Person p set p.name = :name where id = :id")
    void updateNameById(Long id, String name);
}

```

5、创建控制器

省略 Service 服务层

```java
package com.example.demo.controller;

import com.example.demo.entity.Person;
import com.example.demo.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
public class PersonController {

    @Autowired
    PersonRepository personRepository;

    // 保存用户到数据库（无id）, 全量更新数据（有id）
    @PostMapping("/person")
    public Person addPerson(@RequestBody Person person){
        personRepository.save(person);
        return person;
    }

    // 根据 id 查找用户
    @GetMapping("/person/{id}")
    public Person findPerson(@PathVariable("id") Long id){
        Optional<Person> optional = personRepository.findById(id);
        if(optional.isPresent()){
            return optional.get();
        } else{
            return null;
        }
    }

    // 根据 id 删除用户
    @DeleteMapping("/person/{id}")
    public Map<String, Object> deletePerson(@PathVariable("id") Long id){
        personRepository.deleteById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("result", "ok");
        return map;
    }

    // 根据名字查询
    @GetMapping("/findPersonByName")
    public Person findPersonByName(@RequestParam("name") String name){
        Optional<Person> person = personRepository.findByName(name);
        if(person.isPresent()){
            return person.get();
        } else{
            return null;
        }
    }

    // 根据id查找name
    @GetMapping("/findNameById")
    public Map<String, Object> findNameById(@RequestParam("id") Long id){
        String name = personRepository.findNameById(id);
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        return map;
    }

    // 根据id查找person
    @GetMapping("/findPersonById")
    public Person findPersonById(@RequestParam("id") Long id){
        Person person = personRepository.findPersonById(id);
        return person;
    }

    //  更新name字段
    @PostMapping("/updateNameById")
    public Person updateNameById(@RequestBody Person person){
        personRepository.updateNameById(person.getId(), person.getName());
        return person;
    }
}

```

## 连表、分页查询

实体类

```java
@Entity
@Data
@NoArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    private Integer age;

    private Integer schoolId;

    private Integer companyId;
}
```

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

}

```

```java
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;
}

```

DTO 对象

```java
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private String name;
    private Integer age;
    private String companyName;
    private String schoolName;
}
```

查询 Person 的基本信息

有一个 new 对象的操作

```java
// 连接查询
@Query("select new com.example.demo.dto.PersonDTO(p.name, p.age, c.name, s.name) " +
"from Person p left join Company c on p.companyId = c.id " +
"left join School s on p.schoolId = s.id " +
"where p.id = :personId")
Optional<PersonDTO> findPersonInfo(@Param("personId") Long personId);

// 分页查询
@Query(
value = "select new com.example.demo.dto.PersonDTO(p.name, p.age, c.name, s.name) " +
"from Person p left join Company c on p.companyId = c.id " +
"left join School s on p.schoolId = s.id ",
countQuery = "select count(p.id) " +
        "from Person p left join Company c on p.companyId = c.id " +
        "left join School s on p.schoolId = s.id"
)
Page<PersonDTO> findPersonInfoPage(Pageable pageable);

```

使用

```java
@GetMapping("/findPersonInfo")
public PersonDTO findPersonInfo(@RequestParam("id") Long id){
    Optional<PersonDTO> optional = personRepository.findPersonInfo(id);
    if(optional.isPresent()){
        return optional.get();
    } else{
        return null;
    }
}


@GetMapping("/findPersonInfoPage")
public Page<PersonDTO> findPersonInfoPage(
    @RequestParam("page") Integer page, @RequestParam("size") Integer size){
    PageRequest pageRequest = PageRequest.of(page, size, Sort.Direction.DESC, "age");

    Page<PersonDTO> personList = personRepository.findPersonInfoPage(pageRequest);
    return personList;
}
```

between 查询

```java
@Query("select p from Person p where p.age between :small and :big")
List<Person> findPersonByBetween(int small, int big);
```

## 过滤器

1、实现 Filter 接口

```java
package com.example.demo.filter;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import java.io.IOException;

@Component
public class MyFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("MyFilter init");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("处理前1");
        filterChain.doFilter(servletRequest, servletResponse);
        System.out.println("处理后1");
    }

    @Override
    public void destroy() {
        System.out.println("MyFilter destroy");
    }
}

```

```java
package com.example.demo.filter;

import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@Component
public class MyFilter2 implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("MyFilter2 init");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        System.out.println("处理前2");
        filterChain.doFilter(servletRequest, servletResponse);
        System.out.println("处理后2");
    }

    @Override
    public void destroy() {
        System.out.println("MyFilter2 destroy");

    }
}

```

2、配置中注册

```java
package com.example.demo.config;

import com.example.demo.filter.MyFilter;
import com.example.demo.filter.MyFilter2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;


// 注册自定义的过滤器
@Configuration
public class MyFilterConfig {
    @Autowired
    MyFilter myFilter;

    @Autowired
    MyFilter2 myFilter2;

    @Bean
    public FilterRegistrationBean<MyFilter> filterRegistrationBean() {
        FilterRegistrationBean<MyFilter> filter = new FilterRegistrationBean<>();

        filter.setFilter(this.myFilter);
        filter.setOrder(2); // 执行顺序
        filter.setUrlPatterns(Arrays.asList("/api/*"));

        return filter;
    }

    @Bean
    public FilterRegistrationBean<MyFilter2> filterRegistrationBean2() {
        FilterRegistrationBean<MyFilter2> filter = new FilterRegistrationBean<>();

        filter.setFilter(this.myFilter2);
        filter.setOrder(1);
        filter.setUrlPatterns(Arrays.asList("/api/*"));

        return filter;
    }
}

```

## 拦截器 Interceptor

1、定义拦截器

```java
package com.example.demo.interceptor;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyInterceptor extends HandlerInterceptorAdapter{
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("preHandle");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("postHandle");
    }
}

```

2、注册拦截器

```java
package com.example.demo.config;

import com.example.demo.interceptor.MyInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //  可注册多个
        registry.addInterceptor(new MyInterceptor())
        .addPathPatterns("/api/*");
    }
}

```

## MyBatis

项目结构

```
/pom.xml
/src/main/
    java/com/example/demo/
        bean/
            User.java
        controller/
            UserController.java
        dao/
            UserDao.java
        service/
            UserService.java
    resources/
        application.properties
        mapper/
            UserMapper.xml
```

1、依赖 pom.xml

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>
```

2、配置 application.properties

```bash
# 数据源配置
spring.datasource.url=jdbc:mysql://localhost:3306/data?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8
spring.datasource.username=root
spring.datasource.password=123456

# 打印sql
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
# mapper
mybatis.mapper-locations=classpath:mapper/*.xml
```

3、建表语句

```sql
CREATE TABLE `user` (
  `id` int(13) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(33) DEFAULT NULL COMMENT '姓名',
  `age` int(3) DEFAULT NULL COMMENT '年龄',
  `money` double DEFAULT NULL COMMENT '账户余额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

4、bean

```java
package com.example.demo.bean;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private String name;
    private Integer age;
    private Double money;
}

```

5、Dao

```java
package com.example.demo.dao;

import com.example.demo.bean.User;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserDao {
    /**
     * 通过名字查询用户信息, xml配置
     */
    User selectUserByName(String name);

    /**
     * 通过id查询用户信息
     */
    @Select("select * from user where id = #{id} limit 1")
    User selectUserById(Integer id);


    /**
     * 查询所有用户信息
     */
    @Select("select * from user")
    List<User> selectAllUser();

    /**
     * 插入用户信息
     */
    @Insert("insert into user (name, age, money) values (#{name}, #{age}, #{money})")
    void insertUser(User user);

    /**
     * 根据 id 删除用户信息
     */
    @Delete("delete from user where id = #{id}")
    void deleteUser(Integer id);

    /**
     * 根据 id 更新用户信息
     */
    @Update("update user set name = #{name}, age = #{age}, money = #{money} where id = #{id}")
    void updateUser(User user);

}

```

6、Service

```java
package com.example.demo.service;

import com.example.demo.bean.User;
import com.example.demo.dao.UserDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    @Autowired
    UserDao userDao;

    public User selectUserByName(String name) {
        return userDao.selectUserByName(name);
    }

    public List<User> selectAllUser() {
        return userDao.selectAllUser();
    }

    public void insertUser(User user) {
        userDao.insertUser(user);
    }

    public void deleteUser(Integer id) {
        userDao.deleteUser(id);
    }

    public void updateUser(User user) {
        userDao.updateUser(user);
    }

    /**
     * 模拟事务
     */
    @Transactional
    public void changeMoney(){
        User user1 = userDao.selectUserById(1);
        User user2 = userDao.selectUserById(2);

        user1.setMoney(user1.getMoney() - 5);
        user2.setMoney(user2.getMoney() + 5);

        userDao.updateUser(user1);

        int temp = 1 / 0; // 异常

        userDao.updateUser(user2);
    }
}

```

7、Controller

```java
package com.example.demo.controller;

import com.example.demo.bean.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @GetMapping("/selectUserByName")
    public User selectUserByName(String name){
        return userService.selectUserByName(name);
    }

    @GetMapping("/selectAllUser")
    public List<User> selectAllUser(){
        return userService.selectAllUser();
    }

    @PostMapping("/insertUser")
    public List<User> insertUser(@RequestBody User user){
        userService.insertUser(user);
        return userService.selectAllUser();
    }

    @GetMapping("/deleteUser")
    public List<User> deleteUser(Integer id){
        userService.deleteUser(id);
        return userService.selectAllUser();
    }

    @PostMapping("/updateUser")
    public List<User> updateUser(@RequestBody User user){
        userService.updateUser(user);
        return userService.selectAllUser();
    }

    @GetMapping("/changeMoney")
    public List<User> changeMoney(){
        userService.changeMoney();
        return userService.selectAllUser();
    }
}

```
