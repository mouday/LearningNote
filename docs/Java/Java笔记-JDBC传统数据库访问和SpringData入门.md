## 一、SpringData简介

SpringData提供一致的，大家都熟悉的编程模型，为了简化数据库的访问。

子项目：

1. Spring Data JPA：减少数据层的开发量 
2. Spring Data Mongo DB：基于分布式数据层的数据库，在大数据层用的比较多 
3. Spring Data Redis：开源，由C语言编写的，支持网络、内存，而且可以持久化的，提供非常多的语言支持 
4. Spring Data Solr：高性能 搜索功能 对查询性能优化

## 二、传统方式访问数据库

1、JDBC

- Connection
- Statement
- ResultSet
- TestCase

项目准备

1. 新建maven 项目
2. 选择maven-archetype-quickstart
3. 设置GAV
4. 添加依赖：
```xml
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>8.0.20</version>
</dependency>

<dependency>
  <groupId>junit</groupId>
  <artifactId>junit</artifactId>
  <version>4.11</version>
  <scope>test</scope>
</dependency>
```

5. 数据库
```sql
create database spring_data;

create table student(
    id int not null auto_increment,
    name varchar(20) not null,
    age int not null,
    primary key(id)
);

insert into student(name, age) values("刘备", 40);
insert into student(name, age) values("关羽", 30);
insert into student(name, age) values("张飞", 20);
```

6. 开发JDBCUtil工具类
获取Connection，关闭Connection,Statement,ResultSet

db.properties
```bash
jdbc.driverClass = com.mysql.cj.jdbc.Driver
jdbc.username = root
jdbc.password = 123456
jdbc.url = jdbc:mysql://127.0.0.1:3306/data
```

```java
package com.mouday.util;

import java.io.InputStream;
import java.sql.*;
import java.util.Properties;

/**
 * JDBC工具类
 * 1. 获取Connection
 * 2. 释放资源
 */
public class JDBCUtil {
    // 配置型内容建议放在配置文件中
    private static final String driverClass = "com.mysql.cj.jdbc.Driver";
    private static final String username = "root";
    private static final String password = "123456";
    private static final String url = "jdbc:mysql://127.0.0.1:3306/data";


    /**
     * 获取Connection
     *
     * @return
     */
    public static Connection getConnection() throws Exception {
        // 读取配置文件
        InputStream inputStream = JDBCUtil.class.getClassLoader().getResourceAsStream("db.properties");
        Properties properties = new Properties();
        properties.load(inputStream);

        String driverClass = properties.getProperty("jdbc.driverClass");
        String username = properties.getProperty("jdbc.username");
        String password = properties.getProperty("jdbc.password");
        String url = properties.getProperty("jdbc.url");

        Class.forName(driverClass);
        Connection connection = DriverManager.getConnection(url, username, password);
        return connection;
    }

    /**
     * 关闭链接
     *
     * @param resultSet
     * @param statement
     * @param connection
     */
    public static void release(ResultSet resultSet,
                               Statement statement,
                               Connection connection) {
        if (resultSet != null) {
            try {
                resultSet.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if (statement != null) {
            try {
                statement.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}

```

注意事项：
配置的属性放在配置文件中

实体类
```java
package com.mouday.domain;

/**
 * 学生实体类
 */
public class Student {
    private Integer id;

    private String  name;

    private Integer age;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

接口类
```java
package com.mouday.dao;

import com.mouday.domain.Student;

import java.util.List;

/**
 * 学生访问接口
 */
public interface StudentDao {
    /**
     * 获取所有学生
     * @return
     */
    List<Student> query();

    /**
     * 插入数据
     * @param student
     * @return
     */
    Integer insert(Student student);
}

```

实现类
```java
package com.mouday.dao.impl;

import com.mouday.dao.StudentDao;
import com.mouday.domain.Student;
import com.mouday.util.JDBCUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * 学生访问接口实现类
 */
public class StudentDaoImpl implements StudentDao {
    @Override
    public List<Student> query() {

        List<Student> students = new ArrayList<>();

        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        String sql = "select id, name, age from student";
        Student student;

        try {
            connection = JDBCUtil.getConnection();
            statement = connection.prepareStatement(sql);
            resultSet = statement.executeQuery();

            while (resultSet.next()) {
                Integer id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                Integer age = resultSet.getInt("age");

                student = new Student();
                student.setId(id);
                student.setName(name);
                student.setAge(age);

                students.add(student);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JDBCUtil.release(resultSet, statement, connection);
        }

        return students;
    }

    @Override
    public Integer insert(Student student) {

        Connection connection = null;
        PreparedStatement statement = null;
        ResultSet resultSet = null;

        String sql = "insert into student (name, age) values (?, ?)";
        Integer id = null;

        try {
            connection = JDBCUtil.getConnection();
            statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, student.getName());
            statement.setInt(2, student.getAge());

            statement.executeUpdate();

            // 获取自增id
            resultSet = statement.getGeneratedKeys();

            if (resultSet.next()) {
                id = resultSet.getInt(1);
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            JDBCUtil.release(resultSet, statement, connection);
        }

        return id;
    }
}

```

测试类

```java
package com.mouday.util;

import org.junit.Assert;
import org.junit.Test;

import java.sql.Connection;

public class JDBCUtilTest {
    @Test
    public void  testGetConnection() throws Exception{
        Connection connection = JDBCUtil.getConnection();
        Assert.assertNotNull(connection);
    }
}

```

```java
package com.mouday.dao.impl;

import com.mouday.dao.StudentDao;
import com.mouday.domain.Student;
import org.junit.Test;

import java.util.List;

public class StudentDaoImplTest {
    @Test
    public void testQuery() {
        StudentDao studentDao = new StudentDaoImpl();
        List<Student> students = studentDao.query();
        System.out.println(students);
    }

    @Test
    public void testInsert() {
        StudentDao studentDao = new StudentDaoImpl();

        Student student = new Student();
        student.setName("曹操");
        student.setAge(50);

        Integer id = studentDao.insert(student);
        System.out.println(id);

    }
}

```

2、Spring JdbcTemplate

（1）添加依赖
```xml
<!-- spring-jdbc -->
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-jdbc</artifactId>
  <version>5.3.1</version>
</dependency>

<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-context</artifactId>
  <version>5.3.1</version>
</dependency>

```

（2）配置beans.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/data"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"/>
    </bean>

    <bean id="studentDao" class="com.mouday.dao.impl.StudentDaoSpringJdbcImpl">
        <property name="jdbcTemplate" ref="jdbcTemplate"/>
    </bean>
</beans>
```

（3）Dao实现类
```java
package com.mouday.dao.impl;

import com.mouday.dao.StudentDao;
import com.mouday.domain.Student;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 学生访问接口实现类
 */
public class StudentDaoSpringJdbcImpl implements StudentDao {

    private JdbcTemplate jdbcTemplate;

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Student> query() {

        List<Student> students = new ArrayList<>();
        String sql = "select id, name, age from student";

        jdbcTemplate.query(sql, new RowCallbackHandler() {
            @Override
            public void processRow(ResultSet resultSet) throws SQLException {
                Integer id = resultSet.getInt("id");
                String name = resultSet.getString("name");
                Integer age = resultSet.getInt("age");

                Student student = new Student();
                student.setId(id);
                student.setName(name);
                student.setAge(age);

                students.add(student);
            }
        });

        return students;
    }

    @Override
    public Integer insert(Student student) {
        String sql = "insert into student (name, age) values (?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, student.getName());
                ps.setInt(2, student.getAge());
                return ps;
            }
        }, keyHolder);

        return keyHolder.getKey().intValue();

    }
}

```

测试类
```java
package com.mouday;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class DataSourceTest {
    ApplicationContext context = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans.xml");
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testDataSource() {
        DataSource dataSource = context.getBean("dataSource", DataSource.class);
        System.out.println(dataSource);
        Assert.assertNotNull(dataSource);
    }

    @Test
    public void testJdbcTemplate() {
        JdbcTemplate jdbcTemplate = context.getBean("jdbcTemplate", JdbcTemplate.class);
        System.out.println(jdbcTemplate);
        Assert.assertNotNull(jdbcTemplate);
    }
}

```

```java
package com.mouday.dao.impl;

import com.mouday.dao.StudentDao;
import com.mouday.domain.Student;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

public class StudentDaoSpringJdbcImplTest {
    ApplicationContext context = null;
    StudentDao studentDao = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans.xml");
        studentDao = context.getBean("studentDao", StudentDao.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
        studentDao = null;
    }

    @Test
    public void testQuery() {
        List<Student> students = studentDao.query();
        System.out.println(students);
    }

    @Test
    public void testInsert() {
        Student student = new Student();
        student.setName("曹操");
        student.setAge(50);

        Integer id = studentDao.insert(student);
        System.out.println(id);
    }

}


```

3、优缺点分析

弊端：
Dao有大量代码
DaoImpl有重复代码


## 三、SpringData 快速开始
1、开发环境搭建

依赖
```xml
 <dependency>
  <groupId>org.springframework.data</groupId>
  <artifactId>spring-data-jpa</artifactId>
  <version>2.4.0</version>
</dependency>


<dependency>
  <groupId>org.hibernate</groupId>
  <artifactId>hibernate-entitymanager</artifactId>
  <version>5.4.24.Final</version>
</dependency>

```

配置beans-jpa.xml
```xml
<?xml version="1.0" encoding="UTF-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:jpa="http://www.springframework.org/schema/data/jpa"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/data/jpa
        http://www.springframework.org/schema/data/jpa/spring-jpa-1.3.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-4.0.xsd">

    <!--1 配置数据源-->
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource">
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
        <property name="url" value="jdbc:mysql://127.0.0.1:3306/data"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
    </bean>

    <!--2 配置EntityManagerFactory-->
    <bean id="entityManagerFactory" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <property name="jpaVendorAdapter">
            <bean class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"/>
        </property>
        <property name="packagesToScan" value="com.mouday"/>

        <property name="jpaProperties">
            <props>
                <prop key="hibernate.ejb.naming_strategy">org.hibernate.cfg.ImprovedNamingStrategy</prop>
                <prop key="hibernate.dialect">org.hibernate.dialect.MySQL5InnoDBDialect</prop>
                <prop key="hibernate.show_sql">true</prop>
                <prop key="hibernate.format_sql">true</prop>
                <prop key="hibernate.hbm2ddl.auto">update</prop>
            </props>
        </property>
    </bean>

    <!--3 配置事务管理器-->
    <bean id="transactionManager" class="org.springframework.orm.jpa.JpaTransactionManager">
        <property name="entityManagerFactory" ref="entityManagerFactory"/>
    </bean>

    <!--4 配置支持注解的事务-->
    <tx:annotation-driven transaction-manager="transactionManager"/>

    <!--5 配置spring data-->
    <jpa:repositories base-package="com.mouday" entity-manager-factory-ref="entityManagerFactory"/>

    <context:component-scan base-package="com.mouday"/>

</beans>
```

定义实体
```java
package com.mouday.domain;

import javax.persistence.*;

/**
 * 雇员表 先开发实体->自动生成数据表
 */
@Entity
public class Employee {


    private Integer id;
    private String name;
    private Integer age;

    // 主键自增
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Id
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Column(length = 20)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Employee{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

自动建表测试

```java
package com.mouday;

import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;

public class SpringDataJpaTest {
    ApplicationContext context = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testEntityManagerFactory() {

    }
}

```

2、Spring Data JPA 开发

定义接口
```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.repository.Repository;

public interface EmployeeRepository extends Repository<Employee, Integer> {

    public Employee findByName(String name);
}

```

插入数据
```sql
insert into employee(name, age) values("刘备", 40);
insert into employee(name, age) values("关羽", 30);
insert into employee(name, age) values("张飞", 20);
```

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class EmployeeRepositoryTest {
    ApplicationContext context = null;
    EmployeeRepository repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeeRepository.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testFindByName() {
        Employee employee = repository.findByName("刘备");
        System.out.println(employee);

    }
}

```

SpringDATA：
1. Repository核心
2. Repository Definition 定义
3. Repository Query Specifications 查询规则 规范 技术参数
4. Query Annotation 查询注解
5. Update/Delete/Transaction 对事务的细粒度优秀支持


## 四、SpringData JPA 进阶

Responsitory类的定义

```java
public interface Repository<T,ID extends Serializable>{
}
```

1）Responsitory是一个空接口，标记接口
没有包含方法的声明接口

2）我们定义的接口 
```java
public interface EmployeeRepository extends Repository<Employee, Integer>{
}
```
表示此接口纳入spring管理，需按一定规则定义方法

或者使用注解方式定义
```java
@RepositoryDefinition(domainClass = Employee.class, idClass = Integer.class)
public interface EmployeeRepository {

}

```

Repository继承体系
```bash
CrudRepository                    # 实现了CRUD相关方法
    - PagingAndSortingRepository  # 实现了分页排序方法
        - JpaRepository           # 实现了Jpa规范相关方法

JpaSpecificationExecutor
```

Repository查询方法定义规则和使用

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.repository.RepositoryDefinition;

import java.util.List;

@RepositoryDefinition(domainClass = Employee.class, idClass = Integer.class)
public interface EmployeeRepository
{
    // where name = ?
    public Employee findByName(String name);

    // where name like ?% and age > ?
    List<Employee> findByNameStartingWithAndAgeGreaterThan(String name, Integer age);

    // where name like %? and age > ?
    List<Employee> findByNameEndingWithAndAgeGreaterThan(String name, Integer age);
}

```

测试
```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.List;

public class EmployeeRepositoryTest {
    ApplicationContext context = null;
    EmployeeRepository repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeeRepository.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testFindByName() {
        Employee employee = repository.findByName("刘备");
        System.out.println(employee);
    }

    @Test
    public void testFindByNameStartingWithAndAgeGreaterThan() {
        List<Employee> employees = repository.findByNameStartingWithAndAgeGreaterThan("刘", 10);
        System.out.println(employees);
    }

    @Test
    public void testFindByNameEndingWithAndAgeGreaterThan() {
        List<Employee> employees = repository.findByNameEndingWithAndAgeGreaterThan("羽", 10);
        System.out.println(employees);
    }
}

```
命名规则的弊端
- 方法名比较长
- 复杂查询很难实现

Query查询注解
1、在Respository方法中使用，不需要遵循查询方法命名规则
2、只需要将@Query定义在Respository中的方法之上即可
3、命名参数及索引参数的使用
4、本地查询

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;

import java.util.List;

@RepositoryDefinition(domainClass = Employee.class, idClass = Integer.class)
public interface EmployeeRepository
{
    // where name = ?
    public Employee findByName(String name);

    // where name like ?% and age > ?
    List<Employee> findByNameStartingWithAndAgeGreaterThan(String name, Integer age);

    // where name like %? and age > ?
    List<Employee> findByNameEndingWithAndAgeGreaterThan(String name, Integer age);

    // where name in (?...) and age > ?
    List<Employee> findByNameInAndAgeGreaterThan(List<String> names, Integer age);

    @Query("select o from Employee o where id = (select max(id) from Employee t1)")
    Employee getEmployeeByMaxId();

    @Query("select o from Employee o where o.name = ?1 and o.age =?2")
    Employee getEmployeeByName1(String name, Integer age);

    @Query("select o from Employee o where o.name = :name and o.age = :age")
    Employee getEmployeeByName2(@Param("name") String name, @Param("age") Integer age);

    @Query("select o from Employee o where o.name like %?1%")
    Employee getEmployeeByNameLike1(String name);

    @Query("select o from Employee o where o.name like %:name%")
    Employee getEmployeeByNameLike2(@Param("name") String name);

    // 开启原生查询
    @Query(nativeQuery=true, value = "select count(*) from employee")
    Integer getEmployeeCount();
}

```

测试
```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.ArrayList;
import java.util.List;

public class EmployeeRepositoryTest {
    ApplicationContext context = null;
    EmployeeRepository repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeeRepository.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testFindByName() {
        Employee employee = repository.findByName("刘备");
        System.out.println(employee);
    }

    @Test
    public void testFindByNameStartingWithAndAgeGreaterThan() {
        List<Employee> employees = repository.findByNameStartingWithAndAgeGreaterThan("刘", 10);
        System.out.println(employees);
    }

    @Test
    public void testFindByNameEndingWithAndAgeGreaterThan() {
        List<Employee> employees = repository.findByNameEndingWithAndAgeGreaterThan("羽", 10);
        System.out.println(employees);
    }

    @Test
    public void testFindByNameInAndAgeGreaterThan() {
        List<String> names = new ArrayList<>();
        names.add("刘备");
        names.add("张飞");

        List<Employee> employees = repository.findByNameInAndAgeGreaterThan(names, 10);
        System.out.println(employees);
    }

    @Test
    public void testGetEmployeeByMaxId() {

        Employee employee = repository.getEmployeeByMaxId();

        System.out.println(employee);
    }

    @Test
    public void testGetEmployeeByName1() {

        Employee employee = repository.getEmployeeByName1("刘备", 40);

        System.out.println(employee);
    }

    @Test
    public void testGetEmployeeByName2() {

        Employee employee = repository.getEmployeeByName2("刘备", 40);

        System.out.println(employee);
    }

    @Test
    public void testGetEmployeeByNameLike1() {

        Employee employee = repository.getEmployeeByNameLike1("刘");

        System.out.println(employee);
    }

    @Test
    public void testGetEmployeeByNameLike2() {

        Employee employee = repository.getEmployeeByNameLike2("刘");

        System.out.println(employee);
    }
    @Test
    public void testGetEmployeeCount() {

        Integer total = repository.getEmployeeCount();

        System.out.println(total);
    }



}

```

事务在 Spring Data 中的应用:
1) 事务一般是在 service 层,保证事务的完整性

2）注解的使用
@Query       查询
@Modifying      修改  更新和删除必用
@Transactional   事务  更新和删除必用

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.RepositoryDefinition;
import org.springframework.data.repository.query.Param;

import java.util.List;

@RepositoryDefinition(domainClass = Employee.class, idClass = Integer.class)
public interface EmployeeRepository
{
    // 修改操作
    @Modifying
    @Query("update Employee o set o.name = :name where id = :id")
    void updateNameById(@Param("id") Integer id, @Param("name") String name);
}

```

```java
package com.mouday.service;

import com.mouday.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository repository;

    @Transactional
    public void update(Integer id, String name){
        repository.updateNameById(id, name);
    }

}

```

测试
```java
package com.mouday.service;

import com.mouday.repository.EmployeeRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class EmployeeServiceTest {
    ApplicationContext context = null;
    EmployeeService service = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        service = context.getBean(EmployeeService.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testUpdate(){
        service.update(1, "曹操");
    }

}

```

## 五、SpringData JPA 高级

Repository接口
```java
public interface Repository<T, ID> {

}
```
CrudRepository接口
```java
public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S entity);
    <S extends T> Iterable<S> saveAll(Iterable<S> entities);
    Optional<T> findById(ID id);
    boolean existsById(ID id);
    Iterable<T> findAll();
    Iterable<T> findAllById(Iterable<ID> ids);
    long count();
    void deleteById(ID id);
    void delete(T entity);
    void deleteAll(Iterable<? extends T> entities);
    void deleteAll();
}

```

PagingAndSortingRepository接口
```java
public interface PagingAndSortingRepository<T, ID> extends CrudRepository<T, ID> {
    Iterable<T> findAll(Sort sort);
    Page<T> findAll(Pageable pageable);
}
```

JpaRepository接口

```java
public interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
    @Override
    List<T> findAll();

    @Override
    List<T> findAll(Sort sort);

    @Override
    List<T> findAllById(Iterable<ID> ids);

    @Override
    <S extends T> List<S> saveAll(Iterable<S> entities);

    void flush();

    <S extends T> S saveAndFlush(S entity);

    void deleteInBatch(Iterable<T> entities);

    void deleteAllInBatch();

    T getOne(ID id);

    @Override
    <S extends T> List<S> findAll(Example<S> example);

    @Override
    <S extends T> List<S> findAll(Example<S> example, Sort sort);
}

```

代码实例

CrudRepository

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.repository.CrudRepository;


public interface EmployeeCrudRepository extends CrudRepository<Employee, Integer> {
}

```

PagingAndSortingRepository

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;


/**
 * 分页，排序
 */
public interface EmployeePagingAndSortingRepository extends PagingAndSortingRepository<Employee, Integer> {
}

```

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.ArrayList;
import java.util.List;

public class EmployeePagingAndSortingRepositoryTest {
    ApplicationContext context = null;
    EmployeePagingAndSortingRepository repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeePagingAndSortingRepository.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testPaging() {
        // page从0开始
        Pageable pageable = PageRequest.of(1, 5);
        Page<Employee> page = repository.findAll(pageable);
        System.out.println(page);

        System.out.println("总数" + page.getTotalElements());
        System.out.println("当前页面数据" + page.getContent());
    }

    @Test
    public void testSort() {
        // 排序
        Sort.Order order = new Sort.Order(Sort.Direction.DESC, "id");
        Sort sort = Sort.by(order);

        // page从0开始
        Pageable pageable = PageRequest.of(1, 5, sort);
        Page<Employee> page = repository.findAll(pageable);
        System.out.println(page);

        System.out.println("总数" + page.getTotalElements());
        System.out.println("当前页面数据" + page.getContent());
    }

}

```

JpaRepository
```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;


public interface EmployeeJpaRepository extends JpaRepository<Employee, Integer> {
}

```
```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class EmployeeJpaRepositoryTest {
    ApplicationContext context = null;

    EmployeeJpaRepository repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeeJpaRepository.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    @Test
    public void testFind() {

        Employee employee = repository.getOne(1);
        System.out.println(employee);

    }


}

```

JpaSpecificationExecutor

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;


public interface EmployeeJpaSpecificationExecutor extends JpaRepository<Employee, Integer>, JpaSpecificationExecutor<Employee> {
}

```

```java
package com.mouday.repository;

import com.mouday.domain.Employee;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

public class EmployeeJpaSpecificationExecutorTest {
    ApplicationContext context = null;

    EmployeeJpaSpecificationExecutor repository = null;

    @Before
    public void setup() {
        System.out.println("StudentDaoSpringJdbcImplTest.setup");
        context = new ClassPathXmlApplicationContext("beans-jpa.xml");
        repository = context.getBean(EmployeeJpaSpecificationExecutor.class);
    }

    @After
    public void tearDown() {
        System.out.println("StudentDaoSpringJdbcImplTest.tearDown");
        context = null;
    }

    /**
     * 条件 age > 10
     * 排序 order by id desc
     * 分页 offset 0 limit 5
     */
    @Test
    public void testFind() {

        /**
         * root 查询类型
         * query 查询条件
         * criteriaBuilder 构建Predicate
         */
        Specification specification = new Specification<Employee>() {
            @Override
            public Predicate toPredicate(Root<Employee> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                Path path = root.get("age");
                return criteriaBuilder.gt(path, 10);
            }
        };

        Sort sort = Sort.by(Sort.Direction.DESC, "id");
        Pageable pageable = PageRequest.of(0, 5, sort);
        Page<Employee> page = repository.findAll(specification, pageable);
        System.out.println(page);

        System.out.println("总数" + page.getTotalElements());
        System.out.println("当前页面数据" + page.getContent());

    }
}

```
## 总结
1. Spring Data概览
2. 传统方式访问数据库
3. Spring Data快速起步
4. Spring Data JPA进阶
5. Spring Data JPA高级
