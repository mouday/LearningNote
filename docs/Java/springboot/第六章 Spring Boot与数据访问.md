# 第六章 Spring Boot 与数据访问

## 数据访问简介

JDBC
MyBatis
SpringDataJPA

## JDBC&自动配置原理

依赖

```xml
<!--数据库访问-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
```

配置数据源
支持的数据源

```
HikariDataSource
org.apache.tomcat.jdbc.pool.DataSource
org.apache.commons.dbcp2.BasicDataSource
自定义 DataSource
```

DataSourceInitializer

自动运行建表语句
运行插入数据的 sql 语句

文件名命名规则

```
scheme-*.sql
data-*.sql
```

或者指定文件名

application.yml

```yaml
spring:
  # 配置数据源
  datasource:
    username: root
    password: 123456
    url: jdbc:mysql://localhost:3306/data
    driver-class-name: com.mysql.cj.jdbc.Driver

    # 始终执行初始化
    initialization-mode: ALWAYS
    # 指定自动建表sql
    schema:
      - classpath:schema-all.sql
```

schema-all.sql

```sql
create table if not exists `person` (
    `id` int,
    `name` varchar(255)
);
-- 注意需要有分号结尾
```

查询数据

```java
package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 人物数据接口
 */
@RestController
@RequestMapping("/person")
public class PersonController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/list")
    public List<Map<String, Object>> list(){
        String sql = "select * from person";
        List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
        return list;
    }
}

```

## 整合 Druid&配置数据源监控

Druid 能够提供强大的监控和扩展功能

druid 的配置

```bash
initialSize: 5
minIdle: 5
maxActive: 20
maxWait: 60000
timeBetweenEvictionRunsMillis: 60000
minEvictableIdleTimeMillis: 300000
validationQuery: select 1 from dual
testWhileIdle: true
testOnBorrow: false
testOnReturn: false
poolPreparedStatements: true
# 配置监控系统拦截的filters,去掉后监控见面sql无法统计，wall用于防火墙
filters: stat,wall,log4j
maxPoolPreparedStatementPerConnectionSize: 20
useGlobalDataSourceStat: true
connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMills=500
```

依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.21</version>
</dependency>
```

配置

```bash
spring:
  # 配置数据源
  datasource:
    # 自定义数据源
    type: com.alibaba.druid.pool.DruidDataSource
    # 统计sql
    filters: stat,wall

```

自定义配置类

```java
package com.example.demo.config;

import com.alibaba.druid.pool.DruidDataSource;
import com.alibaba.druid.support.http.ResourceServlet;
import com.alibaba.druid.support.http.StatViewServlet;
import com.alibaba.druid.support.http.WebStatFilter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class DruidConfig {
    // 加载druid的自定义参数
    @ConfigurationProperties(prefix="spring.datasource")
    @Bean
    public DataSource druid(){
        return new DruidDataSource();
    }

    // 配置Druid监控
    @Bean
    public ServletRegistrationBean statViewServlet(){
        ServletRegistrationBean bean = new ServletRegistrationBean(new StatViewServlet(), "/druid/*");
        Map<String, String> params = new HashMap<>();
        params.put(ResourceServlet.PARAM_NAME_USERNAME, "admin");
        params.put(ResourceServlet.PARAM_NAME_PASSWORD, "123456");

        bean.setInitParameters(params);
        return bean;
    }

    // 配置filter
    @Bean
    public FilterRegistrationBean webStatFilter(){
        FilterRegistrationBean bean = new FilterRegistrationBean();
        bean.setFilter(new WebStatFilter());
        bean.setUrlPatterns(Arrays.asList("/*"));

        Map<String, String> params = new HashMap<>();
        params.put(WebStatFilter.PARAM_NAME_EXCLUSIONS, "*.js,*.css");

        bean.setInitParameters(params);

        return bean;
    }

}

```

后台监控地址

```
http://localhost:8080/druid/
```

## 整合 MyBatis（一）-基础环境搭建

mybatis-spring-boot-starter

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.3</version>
</dependency>
```

## 整合 MyBatis（二）-注解版 MyBatis

src/main/java/com/example/demo/mapper/DepartmentMapper.java

```java
package com.example.demo.mapper;

import com.example.demo.pojo.Department;
import org.apache.ibatis.annotations.*;


// 指定这是一个操作数据库的mapper
// @Mapper
public interface DepartmentMapper {

    @Select("select * from department where id = #{id}")
    public Department getById(Integer id);

    @Delete("delete from department where id = #{id}")
    public int deleteById(Integer id);

    // 插入数据后自增主键自动设置到department
    @Options(useGeneratedKeys = true, keyProperty = "id")
    @Insert("insert into department(name) values(#{name}) ")
    public int insert(Department department);

    @Update("update department set name = #{name} where id = #{id} ")
    public int update(Department department);
}

```

src/main/java/com/example/demo/controller/DepartmentController.java

```java
package com.example.demo.controller;


import com.example.demo.mapper.DepartmentMapper;
import com.example.demo.pojo.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DepartmentController {

    @Autowired
    private DepartmentMapper departmentMapper;

    @GetMapping("/dept/{id}")
    public Department getDepartment(@PathVariable("id") Integer id){
        return departmentMapper.getById(id);
    }

    @GetMapping("/dept")
    public Department insertDepartment(Department department){
        departmentMapper.insert(department);
        return department;
    }
}

```

src/main/java/com/example/demo/DemoApplication.java

```java
package com.example.demo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


// 自动扫描mapper接口，不用每个mapper都添加@Mapper注解
@MapperScan(value = {"com.example.demo.mapper"})
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

```

## 整合 MyBatis（二）-配置版 MyBatis

文档：
https://mybatis.org/mybatis-3/zh/index.html

application.yml

```yaml
mybatis:
  # 指定全局配置文件路径
  config-location: classpath:mybatis/mybatis-config.xml
  # 指定mapper文件路径
  mapper-locations: classpath:mybatis/mapper/*.xml
```

src/main/resources/mybatis/mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <settings>
        <!--开启驼峰命名自动映射-->
        <setting name="mapUnderscoreToCamelCase" value="true"/>
    </settings>
</configuration>
```

src/main/resources/mybatis/mapper/EmployeeMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.demo.mapper.EmployeeMapper">

    <select id="getById" resultType="com.example.demo.pojo.Employee">
    select * from employee where id = #{id}
  </select>

    <insert id="insert">
        insert into employee (name, age, sex, birth, department_id)
        values (#{name}, #{age}, #{sex}, #{birth}, #{department_id})
    </insert>

    <delete id="deleteById">
        delete from employee where id = #{id}
    </delete>

</mapper>
```

src/main/java/com/example/demo/mapper/EmployeeMapper.java

```java
package com.example.demo.mapper;

import com.example.demo.pojo.Employee;

// @Mapper 或@MapperScan 将接口扫描装配到容器中
public interface EmployeeMapper {

    public Employee getById(Integer id);

    public int deleteById(Integer id);

    public void insert(Employee employee);
}

```

src/main/java/com/example/demo/controller/DepartmentController.java

```java
package com.example.demo.controller;


import com.example.demo.mapper.DepartmentMapper;
import com.example.demo.mapper.EmployeeMapper;
import com.example.demo.pojo.Department;
import com.example.demo.pojo.Employee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DepartmentController {
    @Autowired
    private EmployeeMapper employeeMapper;

    @GetMapping("/getEmp/{id}")
    public Employee getEmployee(@PathVariable("id") Integer id){
        return employeeMapper.getById(id);
    }

}

```

## SpringData JPA

SpringData 为我们提供使用同一的 API 来对数据访问层进行操作

JPA: Java Persistence API

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
    <version>2.3.1.RELEASE</version>
</dependency>
```

配置文件

```yaml
spring:
  jpa:
    hibernate:
      # 更新或创建表结构
      ddl-auto: update
    # 控制台打印sql
    show-sql: true
```

JAP：ORM Object Relation Mapping

编写实体类与数据表进行映射

```java
package com.example.demo.entity;

import javax.persistence.*;

// 使用JPA注解配置映射关系
@Entity // 实体类
@Table(name = "tbl_user") // 指定表名
public class User {

    @Id // 主键
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自增
    private Integer id;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column // 默认类名=属性名
    private String email;
}

```

创建 repository

```java
package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

// 继承JpaRepository来完成对数据库的操作
public interface UserRepository extends JpaRepository<User, Integer> {
}

```

Controller

```java
package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable("id") Integer id){
        Optional<User> user = userRepository.findById(id);

        if(user.isPresent()){
            return user.get();
        } else{
            return null;
        }
    }

    @GetMapping("/user")
    public User insertUser(User user){
        User savedUser = userRepository.save(user);
        return savedUser;
    }
}

```
