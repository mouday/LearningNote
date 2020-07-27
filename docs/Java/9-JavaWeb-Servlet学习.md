# Servlet 学习

## 课时 1 Servlet 是什么

Servlet 作用是处理请求

1. 接收请求
2. 处理请求
3. 完成响应

## 课时 2 实现 Servlet 方式

依赖

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>
```

实现方式

```java
// 实现接口：
javax.servlet.Servlet

// 继承类：
javax.servlet.GenericServlet

// 继承类：
javax.servlet.HttpServlet
```

继承示例
AServlet.java

```java
import javax.servlet.*;
import java.io.IOException;

public class AServlet implements Servlet{

    // 创建时执行
    @Override
    public void init(ServletConfig servletConfig) throws ServletException {

    }

    // 获取配置信息
    @Override
    public ServletConfig getServletConfig() {
        return null;
    }

    // 处理请求
    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {

    }

    // 获取servlet信息
    @Override
    public String getServletInfo() {
        return null;
    }

    // 销毁前调用
    @Override
    public void destroy() {

    }
}

```

## 课时 3 Servlet 的生命周期

生命周期

```
init    实例化调用
service 每次处理请求都调用
destroy 销毁调用
```

特性

（1）单例，每个类只有一个对象

（2）线程不安全，效率最高

Servlet 类由用户自定义，对象由服务器来创建，并有服务器调用对应的方法

浏览器访问 Servlet
给 Servlet 配置一个路径
web.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<web-app>
    <!-- 注册 Servlet，帮助web服务器反射该类 -->
    <servlet>
        <servlet-name>demo</servlet-name>
        <servlet-class>AServlet</servlet-class>
    </servlet>

    <!-- 映射 Servlet 资源，用url-pattern元素标示 URL -->
    <servlet-mapping>
        <servlet-name>demo</servlet-name>
        <url-pattern>demo</url-pattern>
    </servlet-mapping>
</web-app>
```

目录结构

```
webapp
    └── WEB-INF
        ├── classes
        │   └── AServlet.class
        └── web.xml
```

## 课时 4 ServletConfig 介绍

```java

interface ServletConfig{
    // 获取servlet-name中的内容
    String getServletName()

    // 获取Servlet上下文对象
    ServletContext getServletContext()

    // 获取指定初始化参数值
    String getInitParameter(String name)

    // 获取所有初始化参数值
    Enumeration<String> getInitParameterNames()

}
```

```xml
<servlet>
    <init-param>
        <param-name>name</param-name>
        <param-value>Tom</param-value>
    </init-param>
</servlet>
```

获取参数

```java
@Override
public void init(ServletConfig servletConfig) throws ServletException {
    System.out.println(servletConfig.getInitParameter("name"));
}
```

## 课时 5 ServletRequest 和 Servletresponse 对象

```java
interface ServletRequest;

interface ServletResponse;
```

## 课时 6 GenericServlet 介绍

GenericServlet 可以只覆写 service 方法，不用全写

基本原理

```java
import javax.servlet.*;
import java.io.IOException;

public class AServlet implements Servlet {
    private ServletConfig config = null;

    @Override
    public void init(ServletConfig servletConfig) {
        this.config = servletConfig;
        this.init();
    }

    // 实现此方法，初始化后可以调用
    public void init() {

    }

    @Override
    public ServletConfig getServletConfig() {
        return this.config;
    }

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {

    }

    @Override
    public String getServletInfo() {
        return null;
    }

    @Override
    public void destroy() {

    }
}

```

使用示例

```java
import javax.servlet.*;
import java.io.IOException;

public class AServlet extends GenericServlet {

    @Override
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws IOException {
        servletResponse.getWriter().write("<h2>hello<h2>");
    }
}

```

## 课时 7 HttpServlet 介绍

源码

```java

package javax.servlet.http;


public abstract class HttpServlet extends GenericServlet {
    // 重写
    protected void doGet(HttpServletRequest req, HttpServletResponse resp);

    // 重写
    protected void doPost(HttpServletRequest req, HttpServletResponse resp);

    protected void service(HttpServletRequest req, HttpServletResponse resp);

    public void service(ServletRequest req, ServletResponse res){
        if (req instanceof HttpServletRequest && res instanceof HttpServletResponse) {
            HttpServletRequest request = (HttpServletRequest)req;
            HttpServletResponse response = (HttpServletResponse)res;
            this.service(request, response);
        } else {
            throw new ServletException("non-HTTP request or response");
        }
    }
}

```

使用示例: 接收 GET 请求

```java
import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().write("<h2>hello</h2>");
    }
}

```

## 课时 8 Servlet 的细节

1、非线程安全

一个 Servlet 类只有一个实例对象，不是线程安全的，工作效率高

（1）不要在 Servlet 中创建成员，创建局部变量即可

（2）可以创建无状态成员

（3）可以创建有状态的成员，但是状态必须为只读

2、创建时启动
默认情况下，服务器会在第一次访问 Servlet 时创建实例对象

给 load-on-startup 设置一个非负整数
正数的值越小，启动该 servlet 的优先级越高

可以配置创建时启动

```xml
<servlet>
    <servlet-name>servletName</servlet-name>
    <load-on-startup>0</load-on-startup>
</servlet>
```

3、url-pattern
可以有多个访问路径
可以使用前缀或者后缀通配符`*`

```xml
<servlet>
    <servlet-name>servletName</servlet-name>
    <!-- 后缀匹配 -->
    <url-pattern>/demo/*</url-pattern>
    <!-- 前缀匹配 -->
    <url-pattern>*.do</url-pattern>
    <!-- 匹配所有url -->
    <url-pattern>/*</url-pattern>
</servlet>
```

## 课时 9 在 conf 下的 web.xml 文件内容介绍

\${CATALINA_HOME}/conf/web.xml

```xml
<!-- 优先级最低 -->
<servlet-mapping>
    <servlet-name>default</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>

<!-- 过期时间30分钟 -->
<session-config>
    <session-timeout>30</session-timeout>
</session-config>

<!-- 类型映射 -->
<mime-mapping>
    <extension>xml</extension>
    <mime-type>application/xml</mime-type>
</mime-mapping>
```

## 课时 10 Servlet 与反射

Servlet 通过反射，获取配置文件的类名，进行实例化和方法调用

## 课时 11 ServletContext 概述

一个项目只有一个 ServletContext 对象
可以在多个 Servlet 中传递对象

Tomcat 启动时创建，关闭时销毁

## 课时 12 获取 ServletContext 对象

获取 ServletContext

```java

class ServeletConfig{
    ServletContext getServletContext();
}

class GenericServlet{
    ServletContext getServletContext();
}
```

## 课时 13 演示 ServletContext

域对象: 在多个 Servlet 中传递数据

```java
class ServletContext{
    // 设置 多次调用会覆盖
    void setAttribute(String name, Object vlaue);
    // 获取
    Object getAttribute(String name);
    // 移除
    void removeAttribute(String name);
    // 获取全部属性名称
    Enumeration getAttributeNames();
}

```

例如: AServlet 的数据可以传递到 BServlet
AServlet.java

```java
package com.pengshiyu;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String name = request.getParameter("name");
        ServletContext context = getServletContext();
        context.setAttribute("name", name);
        response.getWriter().write("<h2>" + name +"</h2>");
    }

}

```

BServlet.java

```java
package com.pengshiyu;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class BServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletContext context = getServletContext();
        String name = (String)context.getAttribute("name");
        response.getWriter().println(name);
    }
}

```

## 课时 14 ServletContext 获取公共的初始化参数

Servlet 只能获取自己的初始化参数
ServletContext 获取公共的初始化参数

```xml
<web-app>
    <context-param>
        <param-name>key</param-name>
        <param-value>value</param-value>
    </context-param>
</web-app>
```

```java
package com.pengshiyu;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class BServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletContext context = getServletContext();
        String name = context.getInitParameter("key");
        response.getWriter().println(name);
    }
}

```

## 课时 15 ServletContext 获取资源相关方法

以 webapp 文根目录

```java
ServletContext context = getServletContext();

// 获取绝对路径
String path = context.getRealPath("/index.html");

// 获取文件后转为输入流
InputStream in = context.getResourceAsStream("/index.html");

// 获取目录下的文件
Set<String> set = context.getResourcePaths("/");
// [/hello.html, /WEB-INF/]
```

## 课时 16 网站访问量统计小案例

使用 ServletContext 对象共享统计数据

```java
package com.pengshiyu;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class BServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ServletContext context = getServletContext();
        Integer count = (Integer) context.getAttribute("count");

        if (count == null) {
            count = 1; // 第一次访问
        } else {
            count++;
        }

        response.setContentType("text/html; charset=UTF-8");
        response.getWriter().println("<h2>第"+count+"次访问</h2>");
        context.setAttribute("count", count);
    }
}

```

## 课时 17 获取类路径下的资源

依赖

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.6</version>
</dependency>
```

代码实例

```java
package com.pengshiyu;

import org.apache.commons.io.IOUtils;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class Demo {

    public static void main(String[] args) throws IOException {

        Class<Demo> clazz = Demo.class;

        // 1、相对于.class所在目录
        InputStream input1 = clazz.getResourceAsStream("1.txt");
        System.out.println(IOUtils.toString(input1, StandardCharsets.UTF_8));

        // 2、相对于/classes
        InputStream input2 = clazz.getResourceAsStream("/2.txt");
        System.out.println(IOUtils.toString(input2, StandardCharsets.UTF_8));

        ClassLoader loader = clazz.getClassLoader();

        // 3、相对于/classes
        InputStream input3 = loader.getResourceAsStream("3.txt");
        System.out.println(IOUtils.toString(input3, StandardCharsets.UTF_8));

    }
}

```

## 课时 18 BaseServlet

一个 Servlet 中可以有多个请求处理方法

BaseServlet.java

```java
package com.pengshiyu;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.Method;

public class BaseServlet extends HttpServlet {
    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String methodName = req.getParameter("method");

        if(methodName == null || methodName.trim().isEmpty()){
            throw new RuntimeException("method is null or empty");
        }
        System.out.println(methodName);

        // 通过参数获取方法
        Class clazz = this.getClass();

        Method method = null;
        try {
            method = clazz.getMethod(methodName, HttpServletRequest.class, HttpServletResponse.class);
        } catch (NoSuchMethodException e) {
            throw new RuntimeException("方法获取失败");
        }

        // 调用方法
        try {
            method.invoke(this, req, resp);
        } catch (Exception e) {
            throw new RuntimeException("调用失败");
        }

    }
}

```

AServlet.java

```java
package com.pengshiyu;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends BaseServlet {

    public void getAge(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().print("getAge");
    }

    public void getName(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.getWriter().print("getName");
    }

}

```

调用时传入查询参数
http://localhost:8080/demo/hello?method=getAge
