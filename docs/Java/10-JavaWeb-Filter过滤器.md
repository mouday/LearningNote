## 课时 1 过滤器的入门

JavaWeb 三大组件

1、都需要在 web.xml 中进行配置

1. Servlet
2. Filter
3. Listener

2、过滤器

会在一组资源（jsp, servlet, css, html 等等）的前面执行
可以让请求得到目标资源，也可以不让请求达到

过滤器有拦截请求的能力

3、编写过滤器

（1）实现 Filter 接口

（2）在 web.xml 中进行配置

（3）Filter 是单例的

4、配置 web.xml

```xml
<web-app>
    <filter>
        <filter-name>FilerName</filter-name>
        <filter-class>FilerClass</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>FilerName</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

继承示例

```java
package com.pengshiyu.filtrer;

import javax.servlet.*;
import java.io.IOException;

public class Afilter implements Filter {
    /**
     * 创建之后马上执行，用来做初始化
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    /**
     * 每次过滤都会执行
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
        FilterChain filterChain) throws IOException, ServletException {
        System.out.println("进入过滤器");
        // 调用后序方法
        filterChain.doFilter(servletRequest, servletResponse);
        System.out.println("离开过滤器");
    }

    /**
     * 销毁之前的调用，用来释放资源
     */
    @Override
    public void destroy() {

    }
}

```

FilterConfig -> 与 ServletConfig 相似

获取初始化参数 getInitParameter()

获取过滤器名称 getFilterName()

获取 application getServletContext()

FilterChain
放行,执行后序方法 doFilter()

## 课时 2 多个过滤器的执行顺序

执行下一个过滤器或目标资源
FilterChain.doFilter()

```
Afilter进入过滤器
Bfilter进入过滤器
getAge
Bfilter离开过滤器
Afilter离开过滤器
```

## 课时 3 四种拦截方式

1. 请求 REQUEST 默认
2. 转发 FORWARD
3. 包含 INCLUDE
4. 错误 ERROR

```xml
<filter-mapping>
    <filter-name>FilerName</filter-name>
    <url-pattern>/*</url-pattern>
    <dispatcher>REQUEST</dispatcher>
</filter-mapping>
```

页面出错

```xml
<error-page>
    <error-code>500</error-code>
    <location>500.html</location>
</error-page>
```

## 课时 4 使用 filter-mapping 控制多个 Filter 的执行顺序

filter-mapping 的配置顺序决定过滤器执行顺序

## 课时 5 Filter 的应用场景、Filter 的目标资源、小结

预处理：执行目标资源之前做预处理工作，例如设置编码

拦截：通过条件判断是否放行，例如用户登录校验

回程拦截：目标资源执行之后，做一些后序的特殊处理工作，例如目标资源输出的数据进行处理

直接指定 servlet-name

```xml
<filter-mapping>
    <filter-name>FilerName</filter-name>
    <servlet-name>ServletName</servlet-name>
</filter-mapping>
```

小结

1. Filter3 个方法
2. FilterChain 类
3. 4 种拦截方式

## 课时 6 案例 1：分 IP 统计访问次数

数据结构：
ip | count
-|-
192.168.0.1 | 32
192.168.0.2 | 22

统计工作在所有资源之前都执行，使用 Filter
这个过滤器只做统计，不做拦截

数据 Map<String, Integer>
Map 保存到 ServletContext 中
从 request 中获取客户端 ip

使用监听器创建 map
AListener.java

```java
package com.pengshiyu.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import java.util.LinkedHashMap;
import java.util.Map;

public class AListener implements ServletContextListener {
    // 服务器启动时创建map
    public void contextInitialized(ServletContextEvent sce) {
        Map<String, Integer> map = new LinkedHashMap<String, Integer>();
        sce.getServletContext().setAttribute("map", map);
    }

    public void contextDestroyed(ServletContextEvent sce) {
    }
}

```

使用过滤器统计数据
AFilter.java

```java
package com.pengshiyu.filter;

import javax.servlet.*;
import java.io.IOException;
import java.util.Map;

public class AFilter implements Filter {
    private FilterConfig config;

    /**
     * 创建之后马上执行，用来做初始化
     */
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.config = filterConfig;
    }

    /**
     * 每次过滤都会执行
     */
    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
        FilterChain filterChain) throws IOException, ServletException {
        ServletContext app = this.config.getServletContext();
        Map<String, Integer> map = (Map<String, Integer>)app.getAttribute("map");

        String ip  =  request.getRemoteAddr();
        System.out.println("ip: " + ip);

        if(map.containsKey(ip)){
            Integer count = map.get(ip);
            map.put(ip, count+1);
        } else{
            map.put(ip, 1);
        }

        // 放行
        filterChain.doFilter(request, response);

    }

    /**
     * 销毁之前的调用，用来释放资源
     */
    @Override
    public void destroy() {

    }
}

```

显示数据
BServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

public class BServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException {
        ServletContext app = getServletContext();
        Map<String, Integer> map = (Map<String, Integer>) app.getAttribute("map");

        response.setContentType("text/html; charset=UTF-8");
        response.getWriter().println(map.toString());

    }
}


```

配置监听器和过滤器生效
web.xml

```xml
<?xml version="1.0" encoding="utf-8"?>

<web-app>
    <servlet>
        <servlet-name>BServlet</servlet-name>
        <servlet-class>com.pengshiyu.servlet.BServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>BServlet</servlet-name>
        <url-pattern>/b</url-pattern>
    </servlet-mapping>

    <filter>
        <filter-name>AFilter</filter-name>
        <filter-class>com.pengshiyu.filter.AFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>AFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <listener>
        <listener-class>com.pengshiyu.listener.AListener</listener-class>
    </listener>
</web-app>
```

## 课时 7 案例 2：粗粒度权限管理

基于角色的权限控制 RBAC

1. tb_user
2. tb_role
3. tb_userrole
4. tb_menu
5. tb_rolemenu

web.xml

```xml
<?xml version="1.0" encoding="utf-8"?>

<web-app>
    <servlet>
        <servlet-name>AServlet</servlet-name>
        <servlet-class>com.pengshiyu.servlet.AServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>AServlet</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>

    <filter>
        <filter-name>AFilter</filter-name>
        <filter-class>com.pengshiyu.filter.AFilter</filter-class>
    </filter>
    <filter-mapping>
<!--        不能将过滤器设置在login.html上，不然没法登录了-->
        <filter-name>AFilter</filter-name>
        <url-pattern>/hello.html</url-pattern>
    </filter-mapping>

</web-app>
```

AServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String username = request.getParameter("username");
        System.out.println("post: " + username);
        // 设置session
        request.getSession().setAttribute("username", username);
        // 跳转页面
        request.getRequestDispatcher("hello.html").forward(request, response);
    }
}

```

过滤器进行简单的权限校验
AFilter.java

```java
package com.pengshiyu.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class AFilter implements Filter {
    private FilterConfig config;
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.config = filterConfig;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse response,
        FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)req;

        String username = (String) request.getSession().getAttribute("username");
        System.out.println("filter: " + username);

        if(username != null){
            // 放行
            filterChain.doFilter(request, response);
        } else{
            // 跳转到登录页
            request.getRequestDispatcher("login.html").forward(request, response);
        }
    }

    @Override
    public void destroy() {

    }
}

```

## 课时 8 案例 3：全站编码问题

```java
// post编码
request.setCharacterEncoding("utf-8");

// get编码
String username = request.getParameter("username");
username = new String(username.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);

// 响应编码
response.setContentType("text/html; charset=UTF-8");
```

HttpServletRequest 装饰类
EncodingRequest.java

```java
package com.pengshiyu.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.nio.charset.StandardCharsets;

// 装饰器
public class EncodingRequest extends HttpServletRequestWrapper {

    public EncodingRequest(HttpServletRequest request) {
        super(request);
    }

    @Override
    public String getParameter(String name) {
        // 处理编码问题
        String value = super.getParameter(name);
        value = new String(value.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
        return value;

    }
}

```

过滤器 AFilter.java

```java
package com.pengshiyu.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class AFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
        FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String method = httpServletRequest.getMethod();

        // 设置响应编码
        response.setContentType("text/html; charset=UTF-8");

        if ("GET".equals(method)) {
            // 放行
            EncodingRequest encodingRequest = new EncodingRequest(httpServletRequest);
            filterChain.doFilter(encodingRequest, response);
        } else if ("POST".equals(method)) {
            request.setCharacterEncoding("utf-8");
            filterChain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {

    }
}

```

响应处理 AServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        System.out.println(request.getParameter("name"));
        response.getWriter().print("你好");
    }
}

```

web.xml

```xml
<?xml version="1.0" encoding="utf-8"?>

<web-app>
    <!-- 注册 Servlet，帮助web服务器反射该类 -->
    <servlet>
        <servlet-name>AServlet</servlet-name>
        <servlet-class>com.pengshiyu.servlet.AServlet</servlet-class>
    </servlet>
    <!-- 映射 Servlet 资源，用url-pattern元素标示 URL -->
    <servlet-mapping>
        <servlet-name>AServlet</servlet-name>
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>

    <filter>
        <filter-name>AFilter</filter-name>
        <filter-class>com.pengshiyu.filter.AFilter</filter-class>
    </filter>
    <filter-mapping>
<!--        不能将过滤器设置在login.html上，不然没法登录了-->
        <filter-name>AFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
```

## 课时 9 案例 4：页面静态化之准备工作（图书管理小项目）

```
功能：
查询所有
按分类查看

BookServlet
    findAll()       查询全部
    findByCategory() 按分类查询

BookService: 省略

BookDao:
    List<Book> findAll()
    List<Book> findByCategory()

Book：
    bid
    bname
    price
    category
```

静态化：
第一次访问从数据库取数据，保存到 html 中
第二次之后访问就直接从 html 中读取，不再从数据库中取数据

数据准备：

```sql
create table tb_book(
    bid int primary key auto_increment,
    bname varchar(50),
    price decimal(10, 2),
    category int
);

insert into tb_book(bname, price, category) values("Java", 12, 1);
insert into tb_book(bname, price, category) values("Python", 12, 1);
insert into tb_book(bname, price, category) values("JavaScript", 12, 1);
insert into tb_book(bname, price, category) values("Go", 12, 1);

insert into tb_book(bname, price, category) values("三国演义", 12, 2);
insert into tb_book(bname, price, category) values("西游记", 12, 2);
insert into tb_book(bname, price, category) values("水浒传", 12, 2);
insert into tb_book(bname, price, category) values("红楼梦", 12, 2);
```

创建对应的 Book 类

```java
package com.pengshiyu.bean;

public class Book {
    private int bid;
    private String bname;
    private double price;
    private int category;

    public Book() {
    }

    public int getBid() {
        return bid;
    }

    public void setBid(int bid) {
        this.bid = bid;
    }

    public String getBname() {
        return bname;
    }

    public void setBname(String bname) {
        this.bname = bname;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Book{" +
                "bid=" + bid +
                ", bname='" + bname + '\'' +
                ", price=" + price +
                ", category=" + category +
                '}';
    }
}

```

BookDao.java

```java
package com.pengshiyu.dao;

import com.pengshiyu.bean.Book;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.handlers.BeanListHandler;
import util.TxQueryRunner;

import java.sql.SQLException;
import java.util.List;

public class BookDao {
    private QueryRunner qr = new TxQueryRunner();

    public  List<Book> findAll() {
        String sql = "select * from tb_book";

        try {
            List<Book> list = qr.query(sql, new BeanListHandler<Book>(Book.class));
            System.out.println(list);
            return list;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public  List<Book> findByCategory(int category) {
        String sql = "select * from tb_book where category = ?";

        try {
            return qr.query(sql, new BeanListHandler<Book>(Book.class), category);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}

```

BookServlet

```java
package com.pengshiyu.servlet;

import com.pengshiyu.dao.BookDao;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class BookServlet extends BaseServlet {
    private BookDao bookDao = new BookDao();

    public void findAll(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        request.setAttribute("bookList", bookDao.findAll());
        request.getRequestDispatcher("book.jsp").forward(request, response);
    }

    public void findByCategory(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int category = Integer.parseInt(request.getParameter("category"));
        request.setAttribute("bookList", bookDao.findByCategory(category));
        request.getRequestDispatcher("book.jsp").forward(request, response);

    }
}

```

用到的工具类 TxQueryRunner.java

```java
package util;

import java.sql.Connection;
import java.sql.SQLException;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;

public class TxQueryRunner extends QueryRunner {

    @Override
    public int[] batch(String sql, Object[][] params) throws SQLException {
        Connection con = JdbcUtil.getConnection();
        int[] result = super.batch(con, sql, params);
        JdbcUtil.releaseConnection(con);
        return result;
    }

    @Override
    public <T> T query(String sql, ResultSetHandler<T> rsh, Object... params)
            throws SQLException {
        Connection con = JdbcUtil.getConnection();
        T result = super.query(con, sql, rsh, params);
        JdbcUtil.releaseConnection(con);
        return result;
    }

    @Override
    public <T> T query(String sql, ResultSetHandler<T> rsh) throws SQLException {
        Connection con = JdbcUtil.getConnection();
        T result = super.query(con, sql, rsh);
        JdbcUtil.releaseConnection(con);
        return result;
    }

    @Override
    public int update(String sql) throws SQLException {
        Connection con = JdbcUtil.getConnection();
        int result = super.update(con, sql);
        JdbcUtil.releaseConnection(con);
        return result;
    }

    @Override
    public int update(String sql, Object param) throws SQLException {
        Connection con = JdbcUtil.getConnection();
        int result = super.update(con, sql, param);
        JdbcUtil.releaseConnection(con);
        return result;
    }

    @Override
    public int update(String sql, Object... params) throws SQLException {
        Connection con = JdbcUtil.getConnection();
        int result = super.update(con, sql, params);
        JdbcUtil.releaseConnection(con);
        return result;
    }
}

```

JdbcUtil.java

```java
package util;

import com.mchange.v2.c3p0.ComboPooledDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class JdbcUtil {
    // 需要配置c3p0-config.xml
    private static ComboPooledDataSource dataSource = new ComboPooledDataSource();

    // 返回连接对象
    public static Connection getConnection() {
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // 返回连接池对象
    public static DataSource getDataSource() {
        return dataSource;
    }

    // 释放连接
    public static void releaseConnection(Connection connection) {

        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

}

```

book.jsp

```html
<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%> <%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c"%>

<h2>图书列表</h2>
分类：
<a href="book?method=findAll">全部</a>
<a href="book?method=findByCategory&category=1">第一类</a>
<a href="book?method=findByCategory&category=2">第二类</a>

<table border="1">
  <tr>
    <th>ID</th>
    <th>书名</th>
    <th>价格</th>
    <th>分类</th>
  </tr>
  <c:forEach items="${bookList}" var="book">
    <tr>
      <td>${book.bid}</td>
      <td>${book.bname}</td>
      <td>${book.price}</td>
      <td>${book.category}</td>
    </tr>
  </c:forEach>
</table>
```

配置文件

pom.xml

```xml
<dependency>
    <groupId>jstl</groupId>
    <artifactId>jstl</artifactId>
    <version>1.2</version>
</dependency>
<dependency>
    <groupId>taglibs</groupId>
    <artifactId>standard</artifactId>
    <version>1.1.2</version>
</dependency>
```

web.xml

```xml
<servlet-mapping>
    <servlet-name>BookServlet</servlet-name>
    <url-pattern>/book</url-pattern>
</servlet-mapping>

<servlet>
    <servlet-name>BookServlet</servlet-name>
    <servlet-class>com.pengshiyu.servlet.BookServlet</servlet-class>
</servlet>
```

c3p0-config.xml

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
        <property name="acquireIncrement">2</property>
        <property name="initialPoolSize">2</property>
        <property name="minPoolSize">2</property>
        <property name="maxPoolSize">10</property>
    </default-config>
</c3p0-config>
```

访问路径

http://localhost:8080/demo/book?method=findAll

http://localhost:8080/demo/book?method=findByCategory&category=1

## 课时 10 案例 4：页面静态化之如果文件存在直接重定向到 html

使用一个过滤器，把 servlet 请求的资源输出保存到 html 中
第二次访问资源的时候，如果已存在就直接重定向到 html 文件

## 课时 11 案例 5：页面静态之生成 html 页面

CacheFilter.java

```java
package com.pengshiyu.filter;

import com.pengshiyu.response.StaticResponse;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

public class CacheFilter implements Filter {
    private FilterConfig config;
    private final String cacheFileName = "cache";
    private String cacheFilePath = null;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.config = filterConfig;
        this.cacheFilePath = this.config.getServletContext().getRealPath(this.cacheFileName);

        File file = new File(this.cacheFilePath);
        if(file.exists()){
            file.mkdir();
        }

    }

    /**
     * 访问路径
     * http://localhost:8080/demo/book?method=findByCategory&category=4
     */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
                         FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest)servletRequest;
        HttpServletResponse response = (HttpServletResponse)servletResponse;

        String category = request.getParameter("category");

        String filepath = this.cacheFilePath + "/" + category + ".html";
        File file = new File(filepath);

        // 如果页面不存在就缓存页面
        if(!file.exists()){
            StaticResponse staticResponse = new StaticResponse(response, filepath);
            filterChain.doFilter(request, staticResponse);
        }

        System.out.println("文件存在了");
        request.getRequestDispatcher(this.cacheFileName + "/" + category + ".html").forward(request, response);

    }

    @Override
    public void destroy() {

    }
}

```

StaticResponse.java

```java
package com.pengshiyu.response;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;

public class StaticResponse extends HttpServletResponseWrapper {
    private PrintWriter pw;

    public StaticResponse(HttpServletResponse response, String filename) throws FileNotFoundException {
        super(response);
        this.pw = new PrintWriter(filename);
    }

    @Override
    public PrintWriter getWriter() throws IOException {
        // 掉包输出流
        return this.pw;
    }
}

```
