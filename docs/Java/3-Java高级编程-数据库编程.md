# 第36 章 ： Java数据库编程基础操作
## 156 JDBC简介
JDBC 属于一种服务，所有服务都必须按照指定的流程进行操作
Java Database Connectivity
开发包 java.sql
核心组成 DriverManager 
接口 Connection、Statement、PreparedStatement、ResultSet

四种连接方式：
JDBC-ODBC 桥连接 JDK支持，性能较差
JDBC 一般只连接本地服务
JDBC网络连接 连接网络数据库
JDBC协议连接

## 157 连接MySQL数据库
需要配置驱动程序路径
通过反射机制加载数据库驱动程序类
整个JDBC设计实现的就是一个工厂类

pom.xml
```
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.18</version>
</dependency>
```

```java
import java.sql.Connection;
import java.sql.DriverManager;

class Demo {
    // MySQL < 8.0
    // static final String JDBC_DRIVER = "com.mysql.jdbc.Driver";
    // static final String DB_URL = "jdbc:mysql://localhost:3306/data";

    // MySQL >= 8.0
    private static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/data?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "123456";


    public static void main(String[] args) throws Exception {
        // 注册 JDBC 驱动
        Class.forName(JDBC_DRIVER);

        // 打开链接
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

        // 关闭链接
        conn.close();

    }

}
```
参考：
https://www.runoob.com/java/java-mysql-connect.html

# 第37 章 ： Statement数据库操作接口
## 158 Statement接口简介
Statement 数据操作

门面设计模式
```
Connection - 创建 -> Statement - 操作 -> SQl数据库
```

常用操作
```java
// 数据更新 insert update delete 返回影响行数
int executeUpdate(String sql)

// 数据查询 select 返回查询结果
ResultSet executeQuery(String sql)
```

## 159 Statement实现数据更新
新建学生表
```sql
create table student(
    id int not null PRIMARY key auto_increment,
    name varchar(20),
    age int
)
```

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

class Demo {

    // MySQL >= 8.0
    private static final String JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DB_URL = "jdbc:mysql://localhost:3306/data?useSSL=false&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "123456";


    public static void main(String[] args) throws Exception {
        // 注册 JDBC 驱动
        Class.forName(JDBC_DRIVER);

        // 打开链接
        Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

        // 执行SQL语句
        Statement statement = conn.createStatement();
        String sql = "insert into student(name, age) values('Tom', 23)";
        int count = statement.executeUpdate(sql);
        System.out.println("insert count: " + count);
        // insert count: 1
        
        // 关闭链接
        conn.close();

    }

}
```

## 160 Statement实现数据查询
避免`SELECT * `查询，跟上具体要返回的字段名称
select查询结果过大也会对程序造成影响，注意加limit限制

```java
// 查询数据
String sql = "select name, age from student";
ResultSet result = statement.executeQuery(sql);

while (result.next()){
    String name = result.getString("name");
    int age  = result.getInt("age");
    System.out.println(String.format("%s %s", name, age));
    // Tom 23
}
```

# 第38 章 ： PreparedStatement数据库操作
## 161 Statement问题分析
Statement问题：
1、不能很好描述日期形式
2、SQL拼凑，造成编写与维护困难
3、对敏感字符数据不能合理拼凑

## 162 PreparedStatement接口简介
数据和SQL语句分离， 问号? 作为占位符
常用操作
```java
// 数据更新
int executeUpdate()

// 数据查询
ResultSet executeQuery()
```

更新数据
```java
String sql = "update student set age = ? where id = ? ";
PreparedStatement statement = conn.prepareStatement(sql);
statement.setInt(1, 16);
statement.setInt(2, 1);

int count = statement.executeUpdate();
System.out.println("update count: " + count);
// 1
```

## 163 使用PreparedStatement实现数据查询操作
```sql
-- 查询全部数据
select name, age from student

-- 根据id查询数据
select name, age from student where id = ?

-- 分页查询
select name, age from student limit ?

-- 统计查询
select count(*) from student
```


