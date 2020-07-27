# MyBatis 第一个程序

MyBatis 是基于 Java 的数据持久层框架

持久化：数据从瞬时状态变为持久状态
持久层：完成持久化工作的代码块 DAO

简而言之：

MyBatis 将数据存入数据库中，从数据库中取数据

通过框架可以减少重复代码，提高开发效率

MyBatis 是一个半自动化的 ORM 框架
Object Relationship Mapping

文档：
https://mybatis.org/mybatis-3/zh/index.html

1、依赖

```xml
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.4</version>
</dependency>
```

2、配置数据库

mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://127.0.0.1:3306/data"/>
                <property name="username" value="root"/>
                <property name="password" value="123456"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="StudentMapper.xml"/>
    </mappers>
</configuration>
```

3、SQL 工厂类

```java
package com.pengshiyu.mybatis.util;


import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MyBatisUtil {
    public static SqlSessionFactory getSqlSessionFactory() throws IOException {
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        return sqlSessionFactory;
    }

    public static SqlSession getSqlSession() throws IOException {
        SqlSession session = getSqlSessionFactory().openSession();
        return session;
    }
}

```

4、创建实体类

```java
package com.pengshiyu.mybatis.entity;

public class Student {
    private int id;
    private String name;
    private int age;

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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
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

5、编写 SQL 语句映射文件

StudentMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectStudent" resultType="com.pengshiyu.mybatis.entity.Student">
        select * from students where id = #{id}
    </select>
</mapper>
```

6、测试

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;

public class Demo {
    public static void main(String[] args) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        Student student = session.selectOne("com.pengshiyu.mybatis.entity.StudentMapper.selectStudent", 3);
        System.out.println(student);
        session.close();
    //    Student{id=3, name='李白', age=30}
    }
}

```

## curd 操作

StudentMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectStudent" resultType="com.pengshiyu.mybatis.entity.Student">
        select * from students where id = #{id}
    </select>

    <select id="selectAllStudent" resultType="com.pengshiyu.mybatis.entity.Student">
        select * from students
    </select>

    <insert id="insertStudent" parameterType="com.pengshiyu.mybatis.entity.Student">
        insert into students(name, age) values(#{name}, #{age})
    </insert>

    <update id="updateStudent" parameterType="com.pengshiyu.mybatis.entity.Student">
        update students set name = #{name}, age = #{age} where id = #{id}
    </update>

    <delete id="deleteStudent">
        delete from students where id = #{id}
    </delete>
</mapper>
```

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.List;

public class StudentDao {
    public Student select(int id) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        Student student = session.selectOne("com.pengshiyu.mybatis.entity.StudentMapper.selectStudent", id);
        session.close();
        return student;
    }

    public List<Student> selectAll() throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        List<Student> students = session.selectList("com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent");
        session.close();
        return students;
    }

    public int insert(Student student) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        int result = session.insert("com.pengshiyu.mybatis.entity.StudentMapper.insertStudent", student);
        session.commit();
        session.close();
        return result;
    }

    public int update(Student student) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        int result = session.update("com.pengshiyu.mybatis.entity.StudentMapper.updateStudent", student);
        session.commit();
        session.close();
        return result;
    }

    public int delete(int id) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        int result = session.delete("com.pengshiyu.mybatis.entity.StudentMapper.deleteStudent", id);
        session.commit();
        session.close();
        return result;
    }
}

```

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {
        StudentDao studentDao = new StudentDao();

        // 查询
        Student student = studentDao.select(3);
        System.out.println(student);
        // Student{id=3, name='李白', age=30}

        // 写入
        Student student = new Student();
        student.setName("Jack");
        student.setAge(23);
        System.out.println(studentDao.inset(student));
        // 1

        // 更新
        Student student = studentDao.select(16);
        student.setAge(33);
        student.setName("Tom");
        System.out.println(studentDao.update(student));
        // 1

        // 删除数据
        System.out.println(studentDao.delete(12));
        // 1

        // 查询多条数据
        List<Student> students = studentDao.selectAll();
        for(Student student: students){
            System.out.println(student);
        }
    }
}

```

## 配置文件解析

配置文件

每个数据库对应一个 SqlSessionFactory 实例

dataSource：

1. UNPOOLED 每次请求时打开和关闭连接
2. POOLED 使用连接池
3. JNDI 能在如 EJB 或应用服务器这类容器中使用

mapper 文件

namespace 命名规则：
包名+类名/包名+mapper 文件名

1. parameterType 参数类型
2. resultType 返回结果类型
3. useGeneratedKeys="true" 使用自增主键

## 配置优化

执行流程

1. 读取核心配置文件
2. sqlSessionFactory 类
3. sqlSession
4. 执行相关操作

1、可以将数据库配置单独放在一个文件里边

db.properties

```
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://127.0.0.1:3306/data
username=root
password=123456
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <!-- 加载数据库配置 -->
    <properties resource="db.properties" />

    <settings>
        <!-- 打印sql日志 -->
        <setting name="logImpl" value="STDOUT_LOGGING"/>
    </settings>

    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>

    <mappers>
        <mapper resource="StudentMapper.xml"/>
    </mappers>

</configuration>
```

2、别名配置

```xml
<configuration>
    <typeAliases>
        <!-- 指定单个类的别名 -->
        <typeAlias type="com.pengshiyu.mybatis.entity.Student" alias="Student"/>

        <!-- 指定整个包下的类都是别名 -->
        <package name="com.pengshiyu.mybatis.entity"/>
    </typeAliases>

</configuration>
```

使用别名

```xml

<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" resultType="Student">
        select * from students
    </select>
</mapper>
```

## 属性名和列名不一致

MyBatis 会根据列名取赋值，会将列名转为小写

1、为列名指定别名

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectStudent" resultType="Student">
        select id, name, age as old from students where id = #{id}
    </select>
</mapper>
```

2、使用结果映射类型

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectStudent" resultMap="StudentMap">
        select id, name, age from students where id = #{id}
    </select>

    <resultMap id="StudentMap" type="Student">
        <!-- id为主键 -->
        <id column="id" property="id" />

        <!-- column是数据库表的列名，property是实体类属性名 -->
        <result column="name" property="name"/>
        <result column="age" property="age"/>
    </resultMap>
</mapper>
```

## 分页的实现

1、sql 中实现
如果将数据看做下标从 0 开始，那么就是数据切片 [startIndex, pageSize）

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" parameterType="Map" resultType="Student">
        select * from students limit #{offset}, #{limit}
    </select>
</mapper>
```

```java

public class StudentDao {
    public List<Student> selectAll(int currentPage, int pageSize) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();

        Map<String, Integer> map = new HashMap<String, Integer>();
        map.put("offset", (currentPage - 1) * pageSize);
        map.put("limit", pageSize);

        List<Student> students = session.selectList(
            "com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent", map);

        session.close();
        return students;
    }

}
```

```java

public class Demo {
    public static void main(String[] args) throws IOException {
        StudentDao studentDao = new StudentDao();

        // 查询第二页的数据，每页2条
        List<Student> students = studentDao.selectAll(2 , 2);
        for(Student student: students){
            System.out.println(student);
        }
    }
}

```

2、使用 RowBounds

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent"  resultType="Student">
        select * from students
    </select>
</mapper>
```

```java
import org.apache.ibatis.session.RowBounds;

public class StudentDao {

    public List<Student> selectAll(int currentPage, int pageSize) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();

        RowBounds rowBounds = new RowBounds((currentPage - 1) * pageSize, pageSize);

        List<Student> students = session.selectList(
            "com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent",
            null, rowBounds);

        session.close();
        return students;
    }

}

```

通过打印的日志发现：

1. sql 限制起始位置和返回数量，currentPage=2, pageSize=2 时返回 2 条数据
2. RowBounds 不限制起始位置，currentPage=2, pageSize=2 时返回 4 条数据

## 注解开发

面向接口编程

扩展性好，分层开发中，上层不用管具体实现，

大家都遵循共同的实现，开发变得容易，规范性更好

DAO 接口

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface IStudentDao {
    @Select("select * from students")
    public List<Student> getList();
}

```

修改配置文件

```xml
<configuration>
    <mappers>
<!--        <mapper resource="StudentMapper.xml"/>-->
        <mapper class="com.pengshiyu.mybatis.dao.IStudentDao"/>
    </mappers>
</configuration>
```

测试使用

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.IStudentDao;
import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {

        SqlSession session =  MyBatisUtil.getSqlSession();
        IStudentDao studentDao = session.getMapper(IStudentDao.class);
        List<Student> students = studentDao.getList();
        for(Student student : students){
            System.out.println(student);
        }
    }
}

```

## 多对一的处理

多个学生 student 对一个老师 teacher

1、数据库表设计

```sql
create table teachers(
	id int PRIMARY key auto_increment,
	name varchar(10)
);

create table students(
	id int PRIMARY key auto_increment,
	name varchar(10),
	teacher_id int
);

insert into teachers(name) values("王老师");
insert into teachers(name) values("李老师");
insert into teachers(name) values("赵老师");

insert into students(name, teacher_id) values("宋江", 1);
insert into students(name, teacher_id) values("李逵", 1);
insert into students(name, teacher_id) values("鲁智深", 2);
insert into students(name, teacher_id) values("林冲", 3);
insert into students(name, teacher_id) values("高俅", 3);
```

2、实体类

Teacher

```java
package com.pengshiyu.mybatis.entity;

public class Teacher {
    private int id;
    private String name;

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
        return "Teacher{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}

```

Student

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

3、映射文件

多对一处理方式：

（1）按结果嵌套

查询一次

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" resultMap="StudentMap">
        select s.id sid, s.name sname, t.id tid, t.name tname
        from students as s
        left join teachers as t
        on s.teacher_id = t.id
    </select>

    <resultMap id="StudentMap" type="Student">
        <!-- 主键 -->
        <id column="sid" property="id"/>
        <result column="sname" property="name"/>

        <!-- 关联对象-->
        <association property="teacher" javaType="Teacher">
            <id column="tid" property="id"/>
            <result column="tname" property="name"/>
        </association>
    </resultMap>


</mapper>
```

2. 按查询嵌套

会查询 n 次，n 是 Student 数量

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" resultMap="StudentTeacher">
        select * from students
    </select>

    <resultMap id="StudentTeacher" type="Student">
        <!-- 关联对象-->
        <association  property="teacher"  column="teacher_id"
        javaType="Teacher" select="getTeacher">
            <id column="tid" property="id"/>
            <result column="tname" property="name"/>
        </association>
    </resultMap>

    <select id="getTeacher" resultType="Teacher">
        select * from teachers where id = #{id}
    </select>
</mapper>
```

4、引入映射文件

mybatis-config.xml

```xml
<configuration>
    <typeAliases>
        <package name="com.pengshiyu.mybatis.entity"/>
    </typeAliases>

    <mappers>
        <mapper resource="StudentMapper.xml"/>
    </mappers>

</configuration>
```

5、Dao 编写

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.List;

public class StudentDao {

    public List<Student> selectAll() throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();

        List<Student> students = session.selectList(
                "com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent");
        session.close();
        return students;
    }

}

```

6、测试类

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {

        StudentDao studentDao = new StudentDao();
        List<Student> students = studentDao.selectAll();

        for(Student student: students){
            System.out.println(student);
        }
    }
}

```

查询结果

```
Student{id=1, name='宋江', teacher=Teacher{id=1, name='王老师'}}
Student{id=2, name='李逵', teacher=Teacher{id=1, name='王老师'}}
Student{id=3, name='鲁智深', teacher=Teacher{id=2, name='李老师'}}
Student{id=4, name='林冲', teacher=Teacher{id=3, name='赵老师'}}
Student{id=5, name='高俅', teacher=Teacher{id=3, name='赵老师'}}
```

## 一对多关系

Teacher

```java
package com.pengshiyu.mybatis.entity;

import java.util.List;

public class Teacher {
    private int id;
    private String name;
    private List<Student> students;

    public List<Student> getStudents() {
        return students;
    }

    public void setStudents(List<Student> students) {
        this.students = students;
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
        return "Teacher{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", students=" + students +
                '}';
    }
}

```

TeacherMapper

查询一次

```xml

<mapper namespace="com.pengshiyu.mybatis.entity.TeacherMapper">
    <select id="selectOneTeacher" resultMap="TeacherStudent">
        select t.id tid, t.name tname, s.id sid, s.name sname
        from teachers t left join students s
        on t.id = s.teacher_id
        where t.id = #{id}
    </select>

    <resultMap id="TeacherStudent" type="Teacher">
        <id column="tid" property="id"/>
        <result column="tname" property="name"/>

        <!-- 关联集合 -->
        <collection property="students" ofType="Student">
            <id column="sid" property="id"/>
            <result column="sname" property="name"/>
        </collection>
    </resultMap>

</mapper>
```

查询两次

```xml

<mapper namespace="com.pengshiyu.mybatis.entity.TeacherMapper">
    <select id="selectOneTeacher" resultMap="TeacherStudent">
        select *
        from teachers
        where id = #{id}
    </select>

    <resultMap id="TeacherStudent" type="Teacher">

        <!-- 关联集合 -->
        <!-- column 是外键 -->
        <collection property="students" column="id" ofType="Student"
                    select="getStudentByTeacherId">
        </collection>
    </resultMap>

    <select id="getStudentByTeacherId" resultType="Student">
        select * from students where teacher_id = #{id}
    </select>
</mapper>
```

mybatis-config.xml

```xml

<configuration>
    <typeAliases>
        <package name="com.pengshiyu.mybatis.entity"/>
    </typeAliases>

    <mappers>
        <mapper resource="TeacherMapper.xml"/>
    </mappers>
</configuration>
```

TeacherDao

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.entity.Teacher;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.List;

public class TeacherDao {

    public Teacher selectOne(int id) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();
        Teacher teacher = session.selectOne(
                "com.pengshiyu.mybatis.entity.TeacherMapper.selectOneTeacher", id);
        session.close();
        return teacher;
    }

}

```

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.dao.TeacherDao;
import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.entity.Teacher;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {

        TeacherDao teacherDao = new TeacherDao();
        Teacher teacher = teacherDao.selectOne(1);
        System.out.println(teacher);

        for(Student student: teacher.getStudents()){
            System.out.println(student);
        }
    }
}

```

输出

```
Teacher{id=1, name='王老师', students=[
    Student{id=1, name='宋江', teacher=null},
    Student{id=2, name='李逵', teacher=null}
    ]
}
Student{id=1, name='宋江', teacher=null}
Student{id=2, name='李逵', teacher=null}
```

## 动态 SQL

根据不同的查询条件，生成不同的 sql

```xml
<mapper namespace="com.pengshiyu.mybatis.entity.StudentMapper">
    <select id="selectAllStudent" resultType="Student">
        select * from students
        <where>
            <if test="name != null">
                name = #{name}
            </if>
        </where>
    </select>
</mapper>
```

sql:

```sql
select * from students WHERE name = ?
```

```java
package com.pengshiyu.mybatis.dao;

import com.pengshiyu.mybatis.entity.Student;
import com.pengshiyu.mybatis.util.MyBatisUtil;
import org.apache.ibatis.session.SqlSession;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class StudentDao {

    public List<Student> selectAllStudent(String name) throws IOException {
        SqlSession session = MyBatisUtil.getSqlSession();

        Map<String, String> map = new HashMap<>();
        map.put("name", name);

        List<Student> students = session.selectList(
                "com.pengshiyu.mybatis.entity.StudentMapper.selectAllStudent",
                map
        );
        session.close();
        return students;
    }

}

```

```java
package com.pengshiyu.mybatis.test;

import com.pengshiyu.mybatis.dao.StudentDao;
import com.pengshiyu.mybatis.entity.Student;

import java.io.IOException;
import java.util.List;

public class Demo {
    public static void main(String[] args) throws IOException {

        StudentDao studentDao = new StudentDao();
        List<Student> students = studentDao.selectAllStudent("宋江");

        for(Student student: students){
            System.out.println(student);
        }
    }
}

```
