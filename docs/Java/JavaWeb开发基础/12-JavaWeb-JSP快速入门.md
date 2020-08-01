# 11-JSP 快速入门

# 第 1 章 ： JSP 入门

## 课时 1 JSP 入门

Java Server Pages

jsp 本质就是 Servlet

jsp：在原有 html 基础上添加 java 脚本

分工：

jsp 显示数据

servlet 处理数据

```
jsp -> servlet -> jsp
```

jsp 组成：

1、html + java 脚本 + jsp 标签（指令）

2、9 个内置对象：

```
request
response
session
application
pageContext
config
out
page
exception
```

3、3 种脚本

```
<% %> Java代码片段，多条代码
<%=%> Java表达式，一条代码
<%!%> 声明成员
```

## 课时 2 JSP 中 Java 脚本的演示

html 中的 base 标签

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
// java语句
String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() +  request.getContextPath();
// http://localhost:8080/demo
%>

<%=basePath%>

<%
// 等价于
out.print(basePath);
%>

<br/>

<%!
// 成员变量
int a = 5;

// 成员方法
public void getValue(){
    System.out.print("hi");
}
%>

<% int a = 10; // 局部变量 %>

访问局部变量:
<%=a%>

访问成员变量:
<%=this.a%>

<%
// 调用成员方法
getValue();
%>

列表循环
<ol>
<% for(int i=0; i< 10; i++){ %>
    <li><%=i%></li>
<% } %>
</ol>
```

## 课时 3 JSP 和 Servlet 分工的案例

计算器示例

1. 获取表单数据 form.jsp
2. 把字符串转换成 int 类型
3. 进行加法运算得到结果
4. 保存数据结果到 request 中
5. 转发到 result.jsp

处理流程

```
form.jsp -> servlet ->  result.jsp
```

代码文件

form.jsp

```html
<form action="calculate" method="post">
  <input type="text" name="num1" />
  <input type="text" name="num2" />
  <input type="submit" />
</form>
```

CalculateServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CalculateServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 获取参数
        String s1 = request.getParameter("num1");
        String s2 = request.getParameter("num2");

        // 类型转换
        int num1 = Integer.parseInt(s1);
        int num2 = Integer.parseInt(s2);

        // 求和
        int result = num1 + num2;

        // 赋值
        request.setAttribute("result", result);

        // 转发
        request.getRequestDispatcher("/result.jsp").forward(request, response);
    }
}

```

result.jsp

```jsp
<%=request.getAttribute("result")%>
```

## 课时 4 JSP 的原理

jsp 是一个特殊的 servlet

第一次访问 jsp 页面时，服务器会把 jsp 编译成 java 文件，一个 servlet 类
再把.java 文件编译成.class 文件
创建该类对象
最后调用它的 service()方法

第二次访问同一个 jsp 页面时，直接调用 service()方法

流程图

```
第一次访问：
客户端 -> 服务器 -> jsp -> java -> class -> 创建Servlet对象 -> 调用service()方法

第二次之后访问：
客户端 -> 服务器 -> jsp -> 调用service()方法
```

jsp 编译为 java 类

```
        jsp                 java类
===============================================
头                          定义9个内置对象
                            为9个内置对象赋值
===============================================

体
    html                   out.write()
    <% %>                  原样搬运
    <%=%>                  out.print()
    <%!%>                  声明成员
    <%-- --%>              注释不做翻译
===============================================
尾                         做异常处理

```

## 课时 5 JSP 中的注释

```
<!-- -->   html注释
<%-- --%>  jsp注释，不会输出到html文件中
```

# 第 2 章 ： Cookie 处理

## 课时 6 Cookie 入门

Cookie 是 http 协议

由服务器创建保存到客户端浏览器的一个键值对
服务器响应头

```
Set-Cookie: key1=value1; key2=valu2
```

客户端浏览器下次请求时会带上 Cookie
客户端请求头

```
Cookie: key1=value1; key2=valu2
```

规定：

1. 1 个 Cookie 最大 4kb
2. 一个服务器最多给一个浏览器 20 个 cookie
3. 一个浏览器最多保存 300 个 cookie

用途：
服务器跟踪客户端状态
购物车

JavaWeb 中使用：

```
（1）原始方法
response发送Set-Cookie响应头
request获取Cookie请求头

（2）便捷方法
response.addCookie()
request.getCookies()
```

示例
setCookie.jsp

```jsp
<h2>设置Cookie</h2>
<%
Cookie cookie = new Cookie("key", "value");
response.addCookie(cookie);
%>

```

getCookie.jsp

```jsp
<h2>获取Cookie</h2>
<%
Cookie[] cookies = request.getCookies();

if(cookies != null){
    for(Cookie c: cookies){
        out.print(c.getName() + ": "+ c.getValue());
    }
}
%>
```

## 课时 7 Cookie 的生命

maxAge：Cookie 保存的最大时间，以秒为单位

```
maxAge>0 会保存到客户端硬盘
maxAge<0 只会在内存中，浏览器关闭就删除
maxAge=0 删除cookie

eg:
cookie.setMaxAge(60)
```

## 课时 8 Cookie 的路径

path 设置需要归还的 cookie 作用域
默认值为当前路径的父级目录

```
eg:
cookie.setPath('/')

eg:
cookieA /demo
cookieB /demo/jsp/
cookieC /demo/jsp/html/

/demo/index.jsp -> cookieA
/demo/jsp/index.jsp -> cookieA、cookieB
/demo/jsp/html/index.jsp -> cookieA、cookieB、cookieC
```

## 课时 9 Cookie 的域

domain 指定共享域名

```
eg:
cookie.setDomain('.baidu.com')
cookie.setPath('/')

共享：www.baidu.com、zhidao.baidu.com
```

# 第 3 章 ： HttpSession

## 课时 10 HttpSession 入门

HttpSession 用于会话跟踪，保存在服务器端

1、Servlet 三大域对象:

1. request
2. session
3. application

2、HttpSession 底层依赖:
Cookie 或是 Url 重写

3、会话范围
用户首次访问服务器开始，到该用户关闭浏览器结束

4、Servlet 中获取 session

```java
HttpSession = request.getSession()
```

5、jsp 中的 session 是内置对象，可以直接使用

```
<%
void session.setAttribute(String name, String value);
Object session.getAttribute(String name);
void session.getAttribute(String name);
%>
```

## 课时 11-12 HttpSession 第一例

创建和获取 session

setSession.jsp 创建 session

```jsp
<h2>设置Session</h2>
<%
session.setAttribute("name", "Tom");
%>
```

getSession.jsp 获取 session

```jsp
<h2>获取Session</h2>

<%=session.getAttribute("name")%>
```

## 课时 13 HttpSession 第二例

登录

思路

```
login.jsp
-> LoginServlet 登录失败跳转回 login.jsp
-> admin.jsp    未登录跳转回 login.jsp

```

使用 session 关闭浏览器后就消失

可以使用 cookie 设置保存时长，持久化到浏览器中

login.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
// 如果有msg就显示
String msg = (String)session.getAttribute("msg");
if(msg == null){
    msg = "";
}
%>

<h2>登录</h2>

<div style="color: red"><%=msg%></div>

<%
  // 清空session中的msg
  session.removeAttribute("msg");
%>

<form action="/demo/login" method="post">
    <input type="text" name="username"><br/>
    <input type="text" name="password"><br/>
    <input type="submit">
</form>
```

LoginServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        HttpSession session = request.getSession();

        if ("admin".equals(username) && "123456".equals(password)) {
            session.setAttribute("username", username);

            // 添加Cookie
            Cookie cookie = new Cookie("username", username);
            cookie.setMaxAge(60 * 60 * 24); // 保存一天
            response.addCookie(cookie);

            response.sendRedirect("session/admin.jsp");
        } else {
            session.setAttribute("msg", "账号或密码不正确");
            response.sendRedirect("session/login.jsp");
        }
    }
}
```

admin.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
// 从session中获取
// String username =(String)session.getAttribute("username");

// 从cookie中获取
String username = null;
Cookie[] cookies = request.getCookies();
for (Cookie c :cookies){
    if(c.getName().equals("username")){
        username = c.getValue();
        break;
    }
}

if(username == null){
    request.getSession().setAttribute("msg", "用户未登录");
    response.sendRedirect("login.jsp");
}
%>

<h2>欢迎<%=username%></h2>

```

## 课时 14 HttpSession 原理

sessionId 保存到 cookie 中

```java
request.getSession(false) // 不会创建sessionId
request.getSession(true)  // 会创建sessionId
request.getSession()      // 会创建sessionId
```

## 课时 15 配置 session 最大不活动时间

```java

public interface HttpSession {
    long getCreationTime();

    String getId();  // 获取sessionId

    long getLastAccessedTime();

    ServletContext getServletContext();

    // 设置最大不活动时间，默认30分钟
    void setMaxInactiveInterval(int var1);

    int getMaxInactiveInterval();

    // 让session失效
    void invalidate();

    // 查看是否为新的，判断客户端第一次请求
    boolean isNew();


    Enumeration<String> getAttributeNames();
    Object getAttribute(String var1);
    void setAttribute(String var1, Object var2);
    void removeAttribute(String var1);

}
```

web.xml 中配置 session 最大不活动时间

```xml
<session-config>
    <!-- 单位：分钟 -->
    <session-timeout>30</session-timeout>
</session-config>
```

## 课时 16 session 之 url 重写

如果浏览器的 cookie 被禁用了，可以将 sessionId 在 url 参数中传递

```java
// 如果cookie中没有会加到url上
response.encodeURL()
```

# 第 4 章 ： 验证码

## 课时 17 生成图片(VerfiyCode 类)

```java
package util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;

public class ImageUtil {
    public static void main(String[] args) throws IOException {
        // 创建图片缓冲区
        BufferedImage bi = new BufferedImage(50, 50, BufferedImage.TYPE_3BYTE_BGR);
        // 得到绘制环境
        Graphics2D g = (Graphics2D) bi.getGraphics();
        // 设置白色
        g.setColor(Color.WHITE);
        // 绘制矩形，相当于绘制背景色
        g.fillRect(0, 0, 50, 50);
        // 设置红色
        g.setColor(Color.RED);
        // 写字
        g.drawString("hello", 2, 35);
        // 保存输出
        ImageIO.write(bi, "JPEG", new FileOutputStream("1.jpg"));
    }
}

```

结合登录验证的完整代码

```
login.jsp(VerifyCodeServlet) -> LoginServlet -> admin.jsp
```

login.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
String msg = (String)session.getAttribute("msg");
if(msg == null){
    msg = "";
}
%>

<h2>登录</h2>

<div style="color: red"><%=msg%></div>

<%
  // 清空session
  session.removeAttribute("msg");
%>

<form action="/demo/login" method="post">
    用户名：<input type="text" name="username"><br/>
    密码：<input type="text" name="password"><br/>
    验证码：<input type="text" name="verify_code">
    <img src="/demo/code" id="code">  <a href="javascript:changeImage()">换一张</a>
    <br/>
    <input type="submit">
</form>

<script>
function changeImage(){
    let code = document.getElementById("code");
    code.src = "/demo/code?" + new Date().getTime();
}
</script>
```

admin.jsp

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
// 从session中获取
// String username =(String)session.getAttribute("username");

// 从cookie中获取
String username = null;
Cookie[] cookies = request.getCookies();
if(cookies != null){
    for (Cookie c :cookies){
        if(c.getName().equals("username")){
            username = c.getValue();
            break;
        }
    }
}
if(username == null){
    request.getSession().setAttribute("msg", "用户未登录");
    response.sendRedirect("login.jsp");
}
%>

<h2>欢迎<%=username%></h2>

```

LoginServlet.java

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        String verifyCode = request.getParameter("verify_code");

        HttpSession session = request.getSession();
        String code = (String) session.getAttribute("code");

        // 验证码校验
        if(!code.equalsIgnoreCase(verifyCode)){
            session.setAttribute("msg", "验证码不正确");
            response.sendRedirect("session/login.jsp");
            return;
        }

        if ("admin".equals(username) && "123456".equals(password)) {

            session.setAttribute("username", username);

            // 添加Cookie
            Cookie cookie = new Cookie("username", username);
            cookie.setMaxAge(60 * 60 * 24); // 保存一天
            response.addCookie(cookie);

            response.sendRedirect("session/admin.jsp");
        } else {
            session.setAttribute("msg", "账号或密码不正确");
            response.sendRedirect("session/login.jsp");
        }
    }
}
```

VerifyCodeServlet.java

```java
package com.pengshiyu.servlet;

import util.ImageUtil;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class VerifyCodeServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String code = ImageUtil.getVerifyCode(4);
        request.getSession().setAttribute("code", code);
        ImageUtil.writeImage(code, response.getOutputStream());
    }
}

```

ImageUtil.java

```java
package util;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Random;

public class ImageUtil {
    public static void writeImage(String text, OutputStream output) throws IOException {
        // 创建图片缓冲区
        BufferedImage bi = new BufferedImage(50, 20, BufferedImage.TYPE_3BYTE_BGR);
        // 得到绘制环境
        Graphics2D g = (Graphics2D) bi.getGraphics();
        // 设置白色
        g.setColor(Color.WHITE);
        // 绘制矩形，相当于绘制背景色
        g.fillRect(0, 0, 50, 20);
        // 设置红色
        g.setColor(Color.RED);
        // 写字
        g.drawString(text, 8, 16);
        // 保存输出
        ImageIO.write(bi, "JPEG", output);
    }

    public static String getVerifyCode(int length){
        String code  = "1234567890";
        StringBuilder sb = new StringBuilder();

        Random random = new Random();
        for(int i=0; i < length; i ++){
            int index = random.nextInt(code.length());
            sb.append(code.substring(index, index+1));
        }
        return sb.toString();

    }
    public static void main(String[] args) throws IOException {
        ImageUtil.writeImage(ImageUtil.getVerifyCode(4), new FileOutputStream("1.jpg"));
    }
}

```

# 第 5 章 ： JSP 指令

## 课时 19 page 指令

page

1. include 静态包含
2. taglib 导入标签库

指令格式

```
<%@指令名 attr1="" attr2="" %>
```

一般放在文件最上方，可以有多个

page

```
<%@page
language="java"
import="java.util.*,java.net.*"
pageEncoding="UTF-8"
contentType="text/html; charset=utf-8"
errorPage="errorPage.jsp"
%>
```

pageEncoding 指定页面编码
contentType 响应头
如果两个参数只有一个，那么默认为设置的那个
如果两个参数都没有设置，那么默认为 iso

import 导包，可以出现多次
errorPage 页面出错跳转
isErrorPage="true" 是否为处理错误的页面，会设置状态码为 500,可以使用 exception
eg:

```java
exception.printStackTrace(response.getWriter());
```

web.xml 配置错误页面

```xml
<error-page>
    <error-code>404</error-code>
    <location>/error404.jsp</location>
</error-page>

<error-page>
    <error-code>500</error-code>
    <location>/error500.jsp</location>
</error-page>

<error-page>
    <excepiton-type>java.lang.RuntimeException</excepiton-type>
    <location>/error.jsp</location>
</error-page>
```

autoFlush 指定缓冲区满时是否自动刷新

buffer 缓冲区大小，默认 8kb

isELIgnored 是否忽略 EL 表达式，默认为 false，不忽略

基本不用

language 指定当前 jsp 编译后的语言类型，默认为 java

extends 指定当前页面生成 Servlet 的父类

isThreadSafe 是否支持并发访问 默认为 false，为 true 已过时

info 信息

session 是否支持 session，如果为 false，就没有 session 对象

## 课时 20 pageContext 对象

9 大内置对象

1. out JspWriter response.getWriter() 发送文本数据
2. config ServletConfig this.ServletConfig
3. page this,当前 jsp 对象
4. pageContext 页面上下文对象 一个顶 9 个
5. exception 只有在错误页面中使用
6. request HttpServletRequest
7. response HttpServletResponse
8. application ServletContext
9. session HttpSession

Servlet 中有大个域对象，

JSP 中有四个域对象：

1. ServletContext 整个应用程序
2. session 整个会话，一个会话中只有一个用户
3. request 一个请求链
4. pageContext 一个 jsp 页面，当前页面标签之间共享数据

```java
// 代理其他域对象
pageContext.setAttribute("key", "value", PageContext.SESSION_SCOPE)

// 全域查找，从小到大page、request、response、application
pageContext.findAttribute("key");

// 获取其他内置对象

```

## 课时 21 include 和 taglib 指令

1、include 静态包含 jsp 编译成 java 文件时完成

```
<%@include file="demo.jsp" %>
```

2、tablib 导入标签库

```
<%@taglib prefix="s" uri="/tags" %>
<s:text>
```

prefix 指定标签库前缀
uri 指定标签库位置

# 第 6 章 ： JSP 动作标签

## 课时 22 JSP 动作标签

1. `<jsp:forword>` 转发 RequestDispatcher.forword
2. `<jsp:include>` 包含 RequestDispatcher.include
3. `<jsp:param>` 传递参数

a.jsp 动态包含 b.jsp，并传递参数

```jsp
<jsp:forward page="b.jsp">
    <jsp:param name="key1" value="value1"></jsp:param>
    <jsp:param name="key2" value="value2"></jsp:param>
</jsp:forward>
```

b.jsp

```jsp
<%=request.getParameter("key1")%>
<%=request.getParameter("key2")%>
```

## 课时 23 JSP 在 web.xml 中也可以配置

开发自动重启
tomcat/conf/context.xml

```
<Context reloadable="true">

</Context>
```
