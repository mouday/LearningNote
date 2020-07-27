JDBC数据库开发进阶
# 第1 章 ： 事务处理
## 课时1 事务的四大特性（ACID）
原子性 Atomicity   操作不可再分割，要么成功，要么失败
一致性 Consistency 数据状态与业务规则保持一致
隔离性 Isolation   并发事务不会相互干扰
持久性 Durability  数据操作必须被持久化到数据库中

## 课时2：MySQL中开启和关闭事务
默认情况下，MySQL没执行一条SQL语句，都是单独的事务
如果要在一个事务中包含多条SQL语句，那么需要开启事务和结束事务
```sql
-- 开启事务
start transaction

-- 结束事务
commit 
-- 或者
rollback
```
## 课时3 JDBC中完成事务处理
```java
// 开启事务，设置不自动提交， 默认true
conn.setAutoCommit(false);

// 提交事务
conn.commit()

// 回滚事务
conn.rollback()
```

代码格式
```java
try{
    conn.setAutoCommit(false);
    ...
    conn.commit()
}catch(){
    conn.rollback()
}
```

转账示例
```java
import util.JdbcUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * create table account(
 *  id int primary key auto_increment,
 *  username varchar(50),
 *  balance int
 * )
 *
 * insert into account(username, balance) values ('张三', 1000), ('王五', 1000)
 */
class Demo {
    public static void transferMoney(int fromId, int toId, int money) throws SQLException {
        Connection conn = JdbcUtils.getConnection();
        conn.setAutoCommit(false);
        try {
            updateBalance(conn, fromId, -money);
            
            if(true){
                throw new RuntimeException("断网了");
            }

            updateBalance(conn, toId, money);
            conn.commit();
        } catch (Exception e) {
            conn.rollback();
            throw new RuntimeException(e);
        } finally {
            conn.close();
        }

    }

    public static void updateBalance(Connection conn, int id, int money) throws SQLException {
        String sql = "update account set balance = balance + ? where id = ?";
        PreparedStatement statement = conn.prepareStatement(sql);
        statement.setInt(1, money);
        statement.setInt(2, id);
        statement.executeUpdate();
    }

    public static void main(String[] args) throws SQLException {
        transferMoney(1, 2, 100);
    }
}

```

## 课时4 事务的隔离级别
事务并发问题
脏读：读取到另一个事务未提交数据
不可重复读：两次读取不一致
幻读：读到另一个事务已提交数据

四大隔离级别
串行化 不会出现并发，性能最差（坚决不用）
可重复度 防止脏读和不可重复读，不能处理幻读（MySQL默认）
读已提交 防止脏读
读未提交 性能最好
```sql
-- 查看隔离级别
select @@tx_isolation

-- 设置隔离级别
set transaction isolationlevel [1, 2, 3, 4]
```

# 第2 章 ： 连接池
## 课时5 dbcp连接池
1、池参数
初始大小：10个
最小空闲连接数：3个
增量：一次创建最小单位5个
最大空闲连接数：12个
最大连接数：20个
最大等待时间：1000毫秒

2、四大连接参数
连接池也是使用4个连接参数来完成创建连接对象

3、连接池必须实现接口:
javax.sql.DataSource

连接池的close() 方法不是关闭，而是归还

依赖
```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-dbcp2</artifactId>
    <version>2.7.0</version>
</dependency>
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.8.0</version>
</dependency>
```

```java
import org.apache.commons.dbcp2.BasicDataSource;

import java.sql.Connection;
import java.sql.SQLException;

class Demo {

    public static void main(String[] args) throws SQLException {
        // 配置4个必要参数
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/data");
        dataSource.setUsername("root");
        dataSource.setPassword("123456");

        // 配置连接池参数
        dataSource.setMaxWaitMillis(1000);

        // 获取连接对象
        Connection conn = dataSource.getConnection();
        System.out.println(conn.getClass().getName());

        // 归还连接
        conn.close();
    }
}

```

## 课时6 装饰者模式
对象增强的手段
（1）继承
（2）装饰者模式  
（3）动态代理

1、继承：
    会使得类增多
    增强的内容是固定的
    被增强的对象也是固定的

2、装饰者模式
    增强的对象是不能修改的
    被增强的对象可以是任意的

InputStream
FileInputStream 节点流
BufferedInputStream 装饰流

is a
has a
use a
```java
// MyConnection is Connection
class MyConnection implements Connection{
    // MyConnection has Connection
    private Connection conn; // 底层对象，被增强的对象

    // 通过构造器传递底层对象
    public MyConnection(Connection conn){
        this.conn = conn;
    }

    public Statement createStatement(){
        return this.conn.createStatement();
    }

    // 增强点
    public void close(){

    }
}
```
3、动态代理
    被增强的对象可以切换
    增强的内容也可以切换

## 课时7 c3p0连接池的基本使用方式
依赖
```xml
<dependency>
    <groupId>com.mchange</groupId>
    <artifactId>c3p0</artifactId>
    <version>0.9.5.5</version>
</dependency>
```

```java
import com.mchange.v2.c3p0.ComboPooledDataSource;

import java.beans.PropertyVetoException;
import java.sql.Connection;
import java.sql.SQLException;

class Demo {

    public static void main(String[] args) throws PropertyVetoException, SQLException {
        // 配置4个必要参数
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
        dataSource.setDriverClass("com.mysql.cj.jdbc.Driver");
        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/data");
        dataSource.setUser("root");
        dataSource.setPassword("123456");

        // 配置连接池参数
        dataSource.setAcquireIncrement(5);
        dataSource.setInitialPoolSize(3);
        dataSource.setMinPoolSize(3);
        dataSource.setMaxPoolSize(20);

        // 获取连接对象
        Connection conn = dataSource.getConnection();
        System.out.println(conn.getClass().getName());

        // 归还连接
        conn.close();
    }
}

```

## 课时8 c3p0连接的配置文件使用
必须命名为：c3p0-config.xml
必须放在src目录下

```xml
<?xml version="1.0" encoding="utf-8"?>
<c3p0-config>
    <!-- 这是默认配置信息 -->
    <default-config>
        <!-- 连接四大参数配置 -->
        <property name="driverClass">com.mysql.cj.jdbc.Driver</property>
        <property name="jdbcUrl">jdbc:mysql://localhost:3306/data</property>
        <property name="user">root</property>
        <property name="password">123456</property>

        <!-- 池参数配置 -->
        <property name="acquireIncrement">3</property>
        <property name="initialPoolSize">10</property>
        <property name="minPoolSize">2</property>
        <property name="maxPoolSize">10</property>
    </default-config>
</c3p0-config>

```

连接会报错：java.sql.SQLException: No suitable driver
```java
import com.mchange.v2.c3p0.ComboPooledDataSource;

import java.sql.Connection;
import java.sql.SQLException;

class Demo {

    public static void main(String[] args) throws SQLException {
        
        ComboPooledDataSource dataSource = new ComboPooledDataSource();
 
        // 获取连接对象
        Connection conn = dataSource.getConnection();
        System.out.println(conn.getClass().getName());

        // 归还连接
        conn.close();
    }
}

```

# 第3 章 ： JDBC工具类

## 课时9-10 JdbcUtils小工具
```java
import com.mchange.v2.c3p0.ComboPooledDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class JdbcUtil {
    // 需要配置c3p0-config.xml
    private static ComboPooledDataSource dataSource = new  ComboPooledDataSource();

    // 返回连接对象
    public static Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    // 返回连接池对象
    public static DataSource getDataSource(){
        return dataSource;
    }

}

```
## 课时11 JNDI配置
JNDI(Java Naming and Directory Interface, Java命名和目录接口)

## 课时12 ThreadLocal
解决多线程并发问题的工具类,它为每个线程提供了一个本地的副本变量机制，
实现了和其它线程隔离，并且这种变量只在本线程的生命周期内起作用，
可以减少同一个线程内多个方法之间的公共变量传递的复杂度

```java
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

class Demo {

    public static void main(String[] args) throws SQLException {
        ThreadLocal<String> tl = new ThreadLocal<String>();
        // 添加
        tl.set("Tom");

        // 获取
        String name = tl.get();
        System.out.println(name);

        // 移除
        tl.remove();

    }
}
```

ThreadLocal的核心代码
```java
class TL<T>{
    private Map<Thread, T> map = new HashMap<Thread, T>();

    public void set(T value){
        this.map.put(Thread.currentThread(), value);
    }

    public T get(){
        return this.map.get(Thread.currentThread());
    }

    public void remove(){
        this.map.remove(Thread.currentThread());
    }
}
```

## 课时13 dbutils原理
依赖
```xml
<dependency>
    <groupId>commons-dbutils</groupId>
    <artifactId>commons-dbutils</artifactId>
    <version>1.7</version>
</dependency>
```

示例

Student.class
```java
public class Student {
    private int sid;
    private String sname;

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public String getSname() {
        return sname;
    }

    public void setSname(String sname) {
        this.sname = sname;
    }

    public Student() {

    }

    @Override
    public String toString() {
        return "Student{" +
                "sid=" + sid +
                ", sname='" + sname + '\'' +
                '}';
    }
}
```

Demo.class
1、查询操作
```java
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanHandler;

import java.sql.SQLException;


class Demo {

    public static void main(String[] args) throws SQLException {
        // 提供数据库连接池
        QueryRunner qr = new QueryRunner(JdbcUtil.getDataSource());

        // 查询操作
        // sql模板
        String sql = "select * from student where sid = ?";

        // 参数
        Object[] params = {3};

        // 提供结果集处理器
        Student student = qr.query(sql, new BeanHandler<Student>(Student.class), params);
        System.out.println(student);
        // Student{sid=3, sname='杨不悔'}

    }
}

```

2、更新操作
```java
String sql = "update student set sname=? where sid = ?";
Object[] params = {"杨不悔", 3};
qr.update(sql, params);
```

## 课时14 dbUtils结果集处理器介绍
common-dbutils.jar
QueryRunner
```java
// update执行增，删，改
int update(String sql, Object... params)
int update(Connection conn, String sql, Object... params)

// query执行查询
T query(String sql, ResultSetHandler rsh, Object... params)
T query(Connection conn, String sql, ResultSetHandler rsh, Object... params)
```

ResultSetHandler接口
BeanHandler（单行） 一行转换成指定类型的javaBean对象
BeanListHandler(多行) 多行转为list对象
MapHandler(单行) 一行结果转为Map对象
MapListHandler(多行) 多行结果转为Map对象列表
ScalarHandler 单行单列 通常用于`select count(*) from table`

1、BeanListHandler
```java
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;

import java.sql.SQLException;
import java.util.List;


class Demo {

    public static void main(String[] args) throws SQLException {
        // 提供数据库连接池
        QueryRunner qr = new QueryRunner(JdbcUtil.getDataSource());

        String sql = "select * from student";

        List<Student> students = qr.query(sql, new BeanListHandler<Student>(Student.class));
        System.out.println(students);
        
    }
}

```

2、MapListHandler
```java
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.MapListHandler;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;


class Demo {

    public static void main(String[] args) throws SQLException {

        QueryRunner qr = new QueryRunner(JdbcUtil.getDataSource());

        String sql = "select * from student";
        
        List<Map<String, Object>> students = qr.query(sql, new MapListHandler());
        System.out.println(students);


    }
}

```

3、ScalarHandler
```java
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.ScalarHandler;

import java.sql.SQLException;


class Demo {

    public static void main(String[] args) throws SQLException {

        QueryRunner qr = new QueryRunner(JdbcUtil.getDataSource());

        String sql = "select count(*) from student";

        Number cnt = (Number)qr.query(sql, new ScalarHandler());
        long count = cnt.longValue();
        System.out.println(count);

    }
}

```

## 课时15 编写TxQueryRunner配合JdbcUtils来处理事务
```java
class TxQueryRunner extends QueryRunner{
    // 重写部分方法
}
```

## 课时16 JdbcUtils处理多线程并发访问问题
使用 ThreadLocal

# 第4 章 ： 分页
## 课时17 分页准备工作
分页优点：只查询一页，不用查询所有页
```java
class pageBean<T>{
    // 当前页码
    private int currentPage;

    // 总页数
    private int totalPage;

    // 总记录数
    private int totalRecord;

    // 页面大小
    private int pageSize;

    // 页面数据
    private List<T> beanList;

}
```

## 课时18：处理分页各层分工

第n页/共N页 首页 上一页 1 2 3 4 5 6 下一页 尾页

## 课时19 分页处理第一阶段完成

## 课时20 分页之页面页码列表计算
计算公式
pageSize = 10
begin = currentPage - 5
end = currentPage + 4
如果总页数<=10, 那么bedin=1, end=总页数
头溢出：当begin<1, 那么begin=1
尾溢出：当end>总页数, 那么end>总页数

## 课时21 分页之查询条件丢失问题
超链接中要保留参数

## 课时22 分页之查询条件保存到PageBean的url中

