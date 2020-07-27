# spring 整合 mybatis

## 整合示例

1、依赖

pom.xml

```xml

<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.4</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.4</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>5.2.6.RELEASE</version>
</dependency>
```

2、配置

（1）beans.xml

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
        <property name="configLocation" value="mybatis-config.xml"/>
    </bean>

    <bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg index="0" ref="sqlSessionFactory"/>
    </bean>

    <bean id="StudentDao" class="com.pengshiyu.mybatis.dao.impl.StudentDaoImpl">
        <property name="sqlSession" ref="sqlSessionTemplate"/>
    </bean>
</beans>

```

（2）mybatis-config.xml

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

    <typeAliases>
        <package name="com.pengshiyu.mybatis.entity"/>
    </typeAliases>

    <mappers>
        <mapper resource="StudentMapper.xml"/>
    </mappers>

</configuration>
```

（3）StudentMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" resultType="Student">
        select * from students
    </select>
</mapper>
```

3、实体对象类

```java
package com.pengshiyu.mybatis.entity;

public class Student {
    private int id;
    private String name;
    private Teacher teacher;

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
    }

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

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", teacher=" + teacher +
                '}';
    }
}

```

4、dao

（1）定义接口

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;

import java.util.List;

public interface StudentDao {

    public List<Student> selectAllStudent();

}

```

（2）实现接口

```java
package com.pengshiyu.mybatis.dao.impl;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;
import org.mybatis.spring.SqlSessionTemplate;

import java.util.List;

public class StudentDaoImpl implements StudentDao {
    private SqlSessionTemplate sqlSession;

    @Override
    public List<Student> selectAllStudent() {
        return sqlSession.selectList(
                "com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent");
    }

    public void setSqlSession(SqlSessionTemplate sqlSession) {
        this.sqlSession = sqlSession;
    }
}

```

5、测试

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        StudentDao studentDao = (StudentDao)context.getBean("StudentDao");
        List<Student> students = studentDao.selectAllStudent();

        for(Student student: students){
            System.out.println(student);
        }
    }
}

```

## 实现类继承 SqlSessionDaoSupport

实现类

```java
package com.pengshiyu.mybatis.dao.impl;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;
import org.mybatis.spring.support.SqlSessionDaoSupport;

public class StudentDaoImpl extends SqlSessionDaoSupport implements StudentDao {
    @Override
    public Student getById(int id) {
        return getSqlSession().selectOne("com.pengshiyu.mybatis.entity.StudentMapper.getById", id);
    }
}

```

配置修改

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
        <property name="configLocation" value="mybatis-config.xml"/>
    </bean>

    <!--    不需要单独配置 sqlSessionTemplate-->
    <!--    <bean id="sqlSessionTemplate" class="org.mybatis.spring.SqlSessionTemplate">-->
    <!--        <constructor-arg index="0" ref="sqlSessionFactory"/>-->
    <!--    </bean>-->

    <bean id="StudentDao" class="com.pengshiyu.mybatis.dao.impl.StudentDaoImpl">
        <!-- 将 sqlSession 注入，改为 sqlSessionFactory 注入-->
        <!-- <property name="sqlSession" ref="sqlSessionTemplate"/>-->
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>

</beans>

```

## 注解方式

1、DAOMapper

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import org.apache.ibatis.annotations.Select;

public interface StudentMapper {
    @Select("select * from students where id = #{id}")
    public Student getById(int id);

}

```

2、Service

（1）接口

```java
package com.pengshiyu.mybatis.service;

import com.pengshiyu.mybatis.entity.Student;

public interface StudentService {
    public Student getById(int id);
}

```

(2)实现

```java
package com.pengshiyu.mybatis.service.impl;

import com.pengshiyu.mybatis.dao.StudentMapper;
import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.service.StudentService;

public class StudentServiceImpl implements StudentService {
    private StudentMapper studentMapper;

    public void setStudentMapper(StudentMapper studentMapper) {
        this.studentMapper = studentMapper;
    }

    public Student getById(int id) {
        return studentMapper.getById(id);
    }
}

```

3、配置
beans.xml

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
        <property name="configLocation" value="mybatis-config.xml"/>
    </bean>

    <bean id="studentMapper"
    class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="mapperInterface"
        value="com.pengshiyu.mybatis.dao.StudentMapper"/>
        <property name="sqlSessionFactory" ref="sqlSessionFactory"/>
    </bean>

    <bean id="studentService"
    class="com.pengshiyu.mybatis.service.impl.StudentServiceImpl">
        <property name="studentMapper" ref="studentMapper"/>
    </bean>

</beans>

```

4、测试

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentMapper;
import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.service.StudentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.io.IOException;

public class Demo {
    public static void main(String[] args) throws IOException {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");

        StudentService studentService = (StudentService) context.getBean("studentService");

        Student student = studentService.getById(1);
        System.out.println(student);
    }
}

```

## 指定配置文件目录

beans.xml

```xml
<!-- 配置 sqlSessionFactory-->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>

    <!-- <property name="configLocation" value="mybatis-config.xml"/>-->
    <!-- 指定配置文件目录 -->
    <property name="mapperLocations" value="classpath:*Mapper.xml"/>

</bean>
```
