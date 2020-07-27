# 5-JDBC数据库开发入门
## 课时1-2 1.什么是JDBC
JDBC 数据库访问规范
```
应用程序 <-> JDBC <-> MySQL驱动 <-> MySQL
                 <-> Oracle驱动 <-> Oracle
```
导入jar包
加载驱动 Class.forName('类名')
给出url、username、password
使用DriverManager类得到Connection类

maven导入依赖
```xml
<dependencies>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.18</version>
    </dependency>
</dependencies>
```

连接示例
```java
import java.sql.Connection;
import java.sql.DriverManager;

class Demo {

    // MySQL >= 8.0 配置参数
    private static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/data";
    private static final String USER = "root";
    private static final String PASSWORD = "123456";


    public static void main(String[] args) throws Exception {
        // 注册 JDBC 驱动
        Class.forName(JDBC_DRIVER);

        // 等效于
        // com.mysql.cj.jdbc.Driver driver = new com.mysql.cj.jdbc.Driver();
        // DriverManager.registerDriver(driver);

        // 打开链接
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
        
        // 关闭链接
        conn.close();

    }

}
```
所有的java.sql.Driver实现类，都提供了static代码块，
块内代码把自己注册到DriverManager中

jdbc4.0之后 每个驱动jar包中，在META-INF/services目录下提供了一个java.sql.Driver文件
内容就是该接口的实现类名称

## 课时3 3.JDBC完成增、删、改、查
1、增、删、改
```java
// 发送DML, DDL
int Statement.executeUpdate(String sql);
```

代码示例
```java
// 注册 JDBC 驱动
Class.forName(JDBC_DRIVER);

// 打开链接
Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
Statement statement = conn.createStatement();

// 增删改
// String sql = "insert into student(sname) values('陆小凤')";
// String sql = "update student set sname='花无缺' where sid=4";
String sql = "delete from student where sid=4";

int ret = statement.executeUpdate(sql);
System.out.println(ret);

// 关闭链接
conn.close();
```

2、查询
```java
ResultSet executeQuery(String querySql);
boolean ResultSet.next();

// 获取列数据
ResultSet.getString()
ResultSet.getObject()
ResultSet.getInt()
ResultSet.getDouble()
```
行光标
```
beforeFirst <- 默认光标位置
first
last
AfterLast
```
```java
// 打开链接
Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);
Statement statement = conn.createStatement();

// 查询
String sql = "select * from student";

ResultSet ret = statement.executeQuery(sql);
while (ret.next()){
    // 通过列序号获取
    int uid = ret.getInt(1);
    // 通过列名称获取
    String name = ret.getString("sname");
    System.out.println(uid + ", " + name);
}

// 关闭资源
ret.close();
statement.close();
conn.close();
```

## 课时4 4.JDBC之代码规范化　
```java
// 定义
try{
    // 实例化
}
finally{
    // 关闭资源
}

```

## 课时5 5.结果集光标与元数据
JBDC主要的类
```java
DriverManager

Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

Statement statement = conn.createStatement(); 
    int executeUpdate(String sql)    // 执行增、删、改
    ResultSet executeQuery(String sql)  // 执行查询
    boolean execute(String sql)         // 执行增、删、改、查
```

ResultSet滚动结果集
一个二维表格，内部维护了一个行光标（游标）

```java
next() // 最常用

beforeFirst()
afterLast()
first()
last()
getRow()
absolute()
relative()

isBeforeFirst()
isAfterLast()
isFirst()
isLast()
```

元数据
```java
// 元数据 
ResultSetMetaData ResultSet.getMetaData()

// 获取结果集列数
int ResultSetMetaData.getColumnCount()

// 获取指定列的列名
String ResultSetMetaData.getColumnName(int colIndex)
```

## 课时6 6.结果集的特性（是否可滚动、是否敏感、是否可更新）
确定结果集特性
1、是否可滚动
2、是否敏感
3、是否可更新

```java
// 不滚动, 不敏感，不可更新
Statement createStatement()

// 滚动支持
Statement createStatement(int resultSetType, int resultSetConcurrency)        

resultSetType:
ResultSet.TYPE_FORWARD_ONLY  // 不滚动
ResultSet.TYPE_SCROLL_INSENSITIVE // 滚动，不随数据库变化而变化
ResultSet.TYPE_SCROLL_SENSITIVE // 滚动，不随数据库变化而变化

resultSetConcurrency // 是否通过修改结果集二反向影响数据库
ResultSet.CONCUR_READ_ONLY // 结果集只读 
ResultSet.CONCUR_UPDATABLE // 结果集可更新
```

## 课时7 7.PreparedStatement的用法
PreparedStatement是Statement子接口
1、防止SQL注入攻击
2、提高代码可读性，可维护性
3、提高效率
```java
// 打开链接
Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

// 使用预处理查询， 使用？占位
String sql = "select * from student where sid = ?";
PreparedStatement statement = conn.prepareStatement(sql);

// 为参数赋值
statement.setInt(1, 1);

// 获取数据
ResultSet ret = statement.executeQuery();
while (ret.next()){
    String name = ret.getString("sname");
    System.out.println(name);
}

// 关闭资源
ret.close();
statement.close();
conn.close();
```

## 课时8 8.预处理的原理
服务器工作：
（1）校验：sql语句的语法
（2）编译：为一个与函数相似的东西
（3）执行：调用函数

PreparedStatement
（1）先将sql发给数据库，数据库先进行校验
（2）执行的时候只发送参数

## 课时9 9.mysql的预编译功能默认是关闭的
```sql
prepare myfun from 'select * from student where sid = ?'
set @uid=1
execute myfun using @uid
```

设置连接参数：
useServerPrepStmts=true
cachePrepStmts=true
```java
DB_URL = "jdbc:mysql://localhost:3306/data?useServerPrepStmts=true&cachePrepStmts=true";
```

## 课时10 10.JdbcUtils1.0小工具
JdbcUtils.java
```java
package util;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class JdbcUtils {
    // 配置文件路径
    private static String dbconfig = "dbconfig.properties";

    private static Properties prop = null;

    // 静态代码块只执行一次
    static {
        // 初始化数据库配置参数
        try {
            InputStream in = JdbcUtils.class.getClassLoader().getResourceAsStream(dbconfig);
            prop = new Properties();
            prop.load(in);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        // 加载驱动
        try{
            Class.forName(prop.getProperty("driver"));
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(
                prop.getProperty("url"),
                prop.getProperty("username"),
                prop.getProperty("password")
        );
    }

    public static void main(String[] args) throws SQLException {
        Connection conn = getConnection();
        System.out.println(conn);
    }

}

```

dbconfig.properties
```java
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/data
username=root
password=123456
```

## 课时11 11.面向接口编程
DAO模式
data access object
写一个类，把访问数据库的代码封装起来
DAO在数据库与业务逻辑（service）之间
实体域，即操作的对象

DAO模式步骤
（1）提供一个DAO接口
（2）提供一个DAO接口的实现类
（3）在编写一个DAO工厂，Service通过工厂来获取DAO实现

daoconfig.properties
```java
UserDaoClassName=UserDaoImpl
```

UserDao.java
```java
public interface UserDao {
}

```

UserDaoImpl.java
```java
public class UserDaoImpl implements UserDao{

}

```

DaoFactory.java
```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DaoFactory {
    // 配置文件路径
    private static String dbconfig = "daoconfig.properties";

    private static Properties prop = null;

    // 静态代码块只执行一次
    static {
        // 初始化数据库配置参数
        try {
            InputStream in = DaoFactory.class.getClassLoader().getResourceAsStream(dbconfig);
            prop = new Properties();
            prop.load(in);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 返回一个UserDao的具体实现类
     */
    public static UserDao getUserDao() {
        String daoClassName = prop.getProperty("UserDaoClassName");

        // 通过反射创建实现类的对象
        try {
            Class Clazz = Class.forName(daoClassName);
            return (UserDao) Clazz.newInstance();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

```

## 课时12 12.修改案例，其中dao层为jdbc

User.java
```java
public class User {
    private String username;
    private int age;

    public String getUsername() {
        return username;
    }

    public int getAge() {
        return age;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", age=" + age +
                '}';
    }
}

```

daoconfig.properties
```java
UserDaoClassName=UserDaoImpl
```

UserDao.java
```java
public interface UserDao {
    public void addUser(User user);
    public User getUserByUsername(String username);
}

```

UserDaoImpl.java
```java
import util.JdbcUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * create table user(
 * id int primary key auto_increment,
 * username varchar(50),
 * age int
 * )
 */
public class UserDaoImpl implements UserDao {

    /**
     * ORM 对象关系映射
     * @param user
     */
    @Override
    public void addUser(User user) {
        Connection conn = null;
        PreparedStatement statement = null;

        try {
            // 得到连接
            conn = JdbcUtils.getConnection();
            String sql = "insert into user(username, age) values(?, ?)";

            // 准备模板
            statement = conn.prepareStatement(sql);

            // 赋值
            statement.setString(1, user.getUsername());
            statement.setInt(2, user.getAge());

            // 执行
            statement.executeUpdate();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (statement != null) {
                    statement.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {

            }
        }
    }

    @Override
    public User getUserByUsername(String username) {

        Connection conn = null;
        PreparedStatement statement = null;

        try {
            // 得到连接
            conn = JdbcUtils.getConnection();
            String sql = "select * from user where username = ? limit 1";

            // 准备模板
            statement = conn.prepareStatement(sql);

            // 赋值
            statement.setString(1, username);

            // 执行
            ResultSet resultSet = statement.executeQuery();
            if(resultSet.next()){
                User user = new User();
                user.setUsername(resultSet.getString("username"));
                user.setAge(resultSet.getInt("age"));
                return user;
            }
            else{
                return null;
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            try {
                if (statement != null) {
                    statement.close();
                }
                if (conn != null) {
                    conn.close();
                }
            } catch (SQLException e) {

            }
        }
    }
}


```

DaoFactory.java
```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class DaoFactory {
    // 配置文件路径
    private static String dbconfig = "daoconfig.properties";

    private static Properties prop = null;

    // 静态代码块只执行一次
    static {
        // 初始化数据库配置参数
        try {
            InputStream in = DaoFactory.class.getClassLoader().getResourceAsStream(dbconfig);
            prop = new Properties();
            prop.load(in);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 返回一个UserDao的具体实现类
     */
    public static UserDao getUserDao() {
        String daoClassName = prop.getProperty("UserDaoClassName");

        // 通过反射创建实现类的对象
        try {
            Class Clazz = Class.forName(daoClassName);
            return (UserDao) Clazz.newInstance();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}

```

Service.java
```java
// 添加测试
UserDao userDao = DaoFactory.getUserDao();

User user = new User();
user.setUsername("小明");
user.setAge(23);
userDao.addUser(user);

// 查询测试
User user1 = userDao.getUserByUsername("小明");
System.out.println(user1);
```


## 课时13 13.util包下的Date与sql包下的时间类型之间的转换
Data -> java.sql.Data
Time -> java.sql.Time
Timestamp -> java.sql.Timestamp

领域对象中所有属性不能出现java.sql包内容
继承关系
```java
java.util.Date
    -java.sql.Date
```

父类转子类：util.Data -> sql.Date、Time、Timestamp
```java
java.util.Date UtilDate = new java.util.Date();
long longDate = UtilDate.getTime();
java.sql.Date sqlData = new java.sql.Date(longDate);
```

子类转父类：sql.Date、Time、Timestamp -> util.Data
```java
java.util.Date UtilDate = new java.sql.Date(System.currentTimeMillis());
```

## 课时14 14.大数据
可以将文件存入MySQL
my.ini配置
max_allowed_packet=10485760

## 课时15 15.批处理
批处理只针对更新（增，删，改）
一次向服务器发送多条sql语句
开启批处理参数
rewriteBatchedStatements=true

dbconfig.properties
```java
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/data?rewriteBatchedStatements=true
username=root
password=123456
```

```java
import util.JdbcUtils;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

class Demo {
    public static void main(String[] args) throws SQLException {
        Connection conn = JdbcUtils.getConnection();
        String sql = "insert into user(username)values(?)";
        PreparedStatement statement = conn.prepareStatement(sql);

        for(int i=0; i<10000; i++){
            statement.setString(1, "name" + i);
            statement.addBatch(); // 装箱
        }

        long start = System.currentTimeMillis();
        statement.executeBatch(); // 提交数据
        long end = System.currentTimeMillis();
        System.out.println(end - start); // 107
    }
}
```

