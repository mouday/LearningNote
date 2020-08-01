## 课时 12 什么叫监听器 Listener

AWT、SAX

监听器：

1. 一个接口，内容由用户实现
2. 需要注册
3. 监听器中的方法，会在特殊事件发生时被调用

观察者
事件源
事件
监听器

## 课时 13 监听器概述以及生命周期监听器

事件源

```java
1、ServletContext
    生命周期监听 ServletContextListener
        创建 contextInitialized
        销毁 contextDestroyed
        ServletContextEvent
            -getServletContext()

    属性监听 ServletContextAttributeListener
        添加 attributeAdded
        替换 attributeReplaced
        移除 attributeRemoved
        ServletContextAttributeEvent
            -getName()
            -getValue()


2、HttpSession
    生命周期监听 HttpSessionListener
        创建 sessionCreated
        销毁 sessionDestroyed
        HttpSessionEvent
            -getSession()

    属性监听 HttpSessionAttributeListener
        添加 attributeAdded
        替换 attributeReplaced
        移除 attributeRemoved
        HttpSessionBindingEvent
            -getSession()
            -getName()
            -getValue()


3、ServletRequest
    生命周期监听 ServletRequestListener
        创建 requestDestroyed
        销毁 requestInitialized
        ServletRequestEvent
            -getServletRequest()
            -getServletContext()

    属性监听 ServletRequestAttributeListener
        添加 attributeAdded
        替换 attributeReplaced
        移除 attributeRemoved
        ServletRequestAttributeEvent
            -getName()
            -getValue()

```

编写监听器
继承父类，实现方法

```java
package com.pengshiyu.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class AListener implements ServletContextListener{

    @Override
    public void contextInitialized(ServletContextEvent sce) {

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {

    }
}

```

配置监听器 web.xml

```xml
<listener>
    <listener-class>com.pengshiyu.listener.AListener</listener-class>
</listener>
```

## 课时 14 监听器之属性监听器

设置属性

```java
package com.pengshiyu.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        getServletContext().setAttribute("key", "value");
        response.getWriter().print("Hello");
    }
}

```

监听属性变化

```java
package com.pengshiyu.listener;

import javax.servlet.ServletContextAttributeEvent;
import javax.servlet.ServletContextAttributeListener;

public class AListener implements ServletContextAttributeListener {

    @Override
    public void attributeAdded(ServletContextAttributeEvent event) {
        System.out.println(event.getName() + ":" + event.getValue());
    }

    @Override
    public void attributeRemoved(ServletContextAttributeEvent event) {
        System.out.println(event.getName() + ":" + event.getValue());
    }

    @Override
    public void attributeReplaced(ServletContextAttributeEvent event) {
        System.out.println(event.getName() + ":" + event.getValue() + "->" +
                event.getServletContext().getAttribute(event.getName()));
    }
}

```

## 课时 15 感知监听器

都与 HttpSession 相关
添加到 JavaBean 上
不需要再 web.xml 中注册

```java
package com.pengshiyu.bean;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

public class User implements HttpSessionBindingListener {
    private String name;

    @Override
    public void valueBound(HttpSessionBindingEvent event) {
        System.out.println("session值绑定了: " + event.getName() + "=" + event.getValue());
    }

    @Override
    public void valueUnbound(HttpSessionBindingEvent event) {
        System.out.println("session值解除绑定了: " + event.getName() + "=" + event.getValue());
    }
}
```

```java
package com.pengshiyu.servlet;

import com.pengshiyu.bean.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class AServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        User user = new User();
        request.getSession().setAttribute("user", user);

        response.getWriter().print("Hello");
    }
}

```

## 课时 16 session 的序列化

session 会在程序关闭的时候序列化到硬盘

再次启动程序，硬盘上的 session 会反序列化到内存

## 课时 17 session 的钝化和活化

```xml
<Context reloadable="true">
    <Manager
        className="org.apche.catalina.session.PersistentManager"
        maxIdleSwap="1">
        <Store
        className="org.apche.catalina.session.FileStore"
        directory="mysession">
        </Store>
    </Manager>
</Context>
```

钝化保存，活化重新加载

## 课时 18 监听器之 HttpSessionActivationListener

```java
package com.pengshiyu.bean;

import javax.servlet.http.HttpSessionActivationListener;
import javax.servlet.http.HttpSessionEvent;

public class User implements HttpSessionActivationListener, java.io.Serializable {
    @Override
    public void sessionWillPassivate(HttpSessionEvent se) {

    }

    @Override
    public void sessionDidActivate(HttpSessionEvent se) {

    }
}
```
