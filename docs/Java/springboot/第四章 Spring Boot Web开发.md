# 第四章 Spring Boot Web 开发

## 1、web 开发简介

https://start.spring.io/

1. 创建 SpringBoot 应用，选中需要的模块
2. 使用 SpringBoot 自动配置
3. 编写业务代码

```
*AutoConfiguration 自动配置组件
*Properties 封装配置文件的内容
```

## webjars&静态资源映射规则

1、webjars

配置类：WebMvcAutoConfiguration

webjars 以 jar 包的方式引入静态资源

https://www.webjars.org/

资源路径映射

```
/webjars/**

=>

classpath:/META-INF/resources/webjars/
```

添加 jquery 依赖

```xml
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.5.1</version>
</dependency>
```

访问路径

/webjars/jquery/3.5.1/jquery.js

2、静态资源映射规则

静态资源文件夹

```
classpath:/META-INF/resources/
classpath:/resources/
classpath:/static/
classpath:/public/
/ 当前项目根路径
```

默认静态文件下查找

```bash
# 欢迎页面
index.html

# 图标路径
favicon.ico
```

自定义静态资源文件路径,默认资源路径失效

```
spring.resources.static-locations=classpath:/hello/
```

## 引入 thymeleaf

JSP、Velocity、Thymeleaf、Freemarker

模板引擎

```
Template ${name}  + Data {"name": "Tom"}

=> TemplateEngine =>

output

```

Thymeleaf 依赖

```xml
<properties>
    <java.version>1.8</java.version>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

    <!-- 切换 thymeleaf version -->
    <!-- thymeleaf3 适配 layout2 -->
    <springboot-thymeleaf.version>2.1.1.RELEASE</springboot-thymeleaf.version>
    <thymeleaf-layout-dialect.version>2.0.0</thymeleaf-layout-dialect.version>
</properties>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
    <version>${springboot-thymeleaf.version}</version>
</dependency>
```

## thymeleaf 语法

https://www.thymeleaf.org/

默认配置

```java
public class ThymeleafProperties {
    private String prefix = "classpath:/templates/";
    private String suffix = ".html";
}
```

模板使用示例

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;

@Controller
public class IndexController {

    @RequestMapping("/hello")
    public String hello(HashMap<String, Object> map){
        map.put("name", "Tom");

        // 模板路径
        // src/main/resources/templates/about.html
        return "hello";
    }
}
```

模板：

src/main/resources/templates/about.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>

  <body>
    <h1>Hello</h1>
    <!-- 设置文本内容 -->
    <div th:text="${name}"></div>
  </body>
</html>
```

语法规则

```
th: 任意html属性，用来替换原生属性的值

th:text 改变文本内容(转义)
th:utext 改变文本内容(不转义)

th:attr
th:href
th:src

th:each
th:for
```

表达式

```
${} 变量表达式
    获取变量值
    获取变量属性
    调用方法
    内置基本对象: #ctx #session...
    内置工具对象：

*{} 选择表达式
    配合th:object使用

#{} 获取国际化内容

@{} 定义url

~{} 片段表达式

字面量
数学运算
布尔运算
比较运算
条件运算
特殊操作
```

示例

```html
<!--文本输出-->
<div th:text="${name}"></div>

<!--循环遍历-->
<div th:each="pet: ${pets}">
  <div>[[${pet}]]</div>
</div>

<!--循环遍历-->
<div th:each="pet: ${pets}" th:text="pet"></div>
```

## SpringMVC 自动配置原理

SpringBoot 对 SpringMVC 默认配置

自动配置

```
ViewResolver 视图解析器
根据方法返回值的到视图对象（View）
视图对象决定如何渲染、转发、重定向

Converter 类型转换器
Formatter 格式化器
HttpMessageConverters 转换请求响应
MessageCodesResolver 定义错误代码生成规则
WebDataBinder 数据绑定器
```

修改 SpringBoot 默认配置

优先使用用户配置@Bean/@Component
如果没有才自动配置
有些组件可以有多个

eg: ViewResolver 将用户配置和默认配置组合起来

## 扩展与全面接管 SpringMVC

1、扩展配置

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class CustomVmcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // super.addViewControllers(registry);
        // 浏览器的请求 /demo 到视图 /hello
        registry.addViewController("demo").setViewName("hello");
    }
}

```

2、全面接管

增加 `@EnableWebMvc` 后，自动配置失效

```java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@EnableWebMvc
@Configuration
public class CustomVmcConfig extends WebMvcConfigurerAdapter {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // super.addViewControllers(registry);
        // 浏览器的请求 /demo 到视图 /hello
        registry.addViewController("demo").setViewName("hello");
    }
}

```

## 引入资源

模板资源: https://getbootstrap.net/

模板语法: https://www.thymeleaf.org/

webjars: https://www.webjars.org/

目录设置

```
resources/
    templates   模板文件
    static      静态文件
```

首页设置

```java
package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@Configuration
public class CustomVmcConfig extends WebMvcConfigurerAdapter {


    // 设置首页位置，默认访问 public/index.html 没有经过模板引擎处理
    @Bean
    public WebMvcConfigurerAdapter CustomVmcConfig() {
        WebMvcConfigurerAdapter adapter = new WebMvcConfigurerAdapter() {
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addViewController("/").setViewName("login");
                registry.addViewController("/index.html").setViewName("login");
            }
        };

        return adapter;
    }
}

```

## 国际化

默认根据浏览器语言获取对应国际化信息

1、配置语言文件

resources 资源文件夹下

```
├── i18n
│   ├── login.properties
│   ├── login_en_US.properties
│   └── login_zh_CN.properties

```

默认配置 login.properties

```
login.button=登录~
login.title=登录~
login.username=用户名~
login.password=密码~
login.remember=记住我~
```

英文配置 login_en_US.properties

```
login.button=Sign In
login.title=Login
login.username=UserName
login.password=Password
login.remember=Remenber Me
```

中文配置 login_zh_CN.properties

```
login.button=登录
login.title=登录
login.username=用户名
login.password=密码
login.remember=记住我
```

2、配置 application.yml

```yml
spring:
  messages:
    basename: i18n.login
```

3、模板文件中使用

```html
<button th:text="#{login.button}"></button>
```

根据浏览器请求头设置语言

```
GET http://localhost:8080/
Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7

```

4、自定义国际化处理器

```java
package com.example.demo.component;

import org.springframework.util.StringUtils;
import org.springframework.web.servlet.LocaleResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Locale;


/**
 * 区域信息解析器
 * 自定义国际化参数，支持链接上携带区域信息
 */
public class MyLocaleResolver implements LocaleResolver {

    @Override
    public Locale resolveLocale(HttpServletRequest request) {
        String lang = request.getParameter("lang");

        Locale locale = Locale.getDefault();

        if (!StringUtils.isEmpty(lang)) {
            String[] list = lang.split("_");

            if (list.length == 2) {
                locale = new Locale(list[0], list[1]);
            }
        }

        return locale;
    }

    @Override
    public void setLocale(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Locale locale) {

    }
}

```

启用自定义国际化处理器

```java
package com.example.demo.config;

import com.example.demo.component.MyLocaleResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


/**
 * 配置首页视图
 */
@Configuration
public class CustomVmcConfig extends WebMvcConfigurerAdapter {
    @Bean
    public MyLocaleResolver localeResolver() {
        return new MyLocaleResolver();
    }
}

```

优先获取查询参数返回语言设置

```
http://localhost:8080/?lang=zh_CN
http://localhost:8080/?lang=en_US
```

## 登陆&拦截器

开发期间模板引擎修改要实时生效

1. 禁用模板引擎缓存
2. 重新编译

```html
<!--登录错误消息提示-->
<p
  style="color: red;"
  th:text="${msg}"
  th:if="${not #strings.isEmpty(msg)}"
></p>
```

拦截器进行登录检查

登录

```java
package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
public class LoginController {
    @PostMapping("/user/login")
    // 等价于 @RequestMapping(value = "/user/login", method = {RequestMethod.POST})
    public String login(@RequestParam("username") String username,
                        @RequestParam("password") String password,
                        Map<String, Object> map,
                        HttpSession session
    ) {
        if (!StringUtils.isEmpty(username) && "123".equals(password)) {
            session.setAttribute("loginUser", username);
            // 登录成功 防止表单重新提交，做一个重定向
            return "redirect:/dashboard.html";
        } else {
            // 登录失败
            map.put("msg", "账号或密码不正确");
            return "login";
        }
    }
}

```

拦截器

```java
package com.example.demo.component;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 登录检查
 */
public class LoginHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Object loginUser = request.getSession().getAttribute("loginUser");
        // 未登录，返回登录页面
        if (loginUser == null) {
            request.setAttribute("msg", "没有权限，请先登录");
            request.getRequestDispatcher("/index.html").forward(request, response);
            return false;
        }
        // 已登录，放行
        else {
            return true;
        }

    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }
}

```

注册拦截器

```java
package com.example.demo.config;

import com.example.demo.component.LoginHandlerInterceptor;
import com.example.demo.component.MyLocaleResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


/**
 * 配置首页视图
 */

@Configuration
@SuppressWarnings("all")
public class CustomVmcConfig extends WebMvcConfigurerAdapter {
    // 设置首页位置，默认访问 public/index.html 没有经过模板引擎处理

    @Bean
    public WebMvcConfigurerAdapter CustomVmcConfig() {
        WebMvcConfigurerAdapter adapter = new WebMvcConfigurerAdapter() {
            /**
             * 注册视图控制器
             * @param registry
             */
            @Override
            public void addViewControllers(ViewControllerRegistry registry) {
                registry.addViewController("/").setViewName("login");
                registry.addViewController("/index.html").setViewName("login");
                registry.addViewController("/dashboard.html").setViewName("dashboard");
            }

            /**
             * 注册拦截器
             * @param registry
             */
            @Override
            public void addInterceptors(InterceptorRegistry registry) {
                // super.addInterceptors(registry);

                // 拦截任意路径下的所有请求, 排除请求
                registry.addInterceptor(new LoginHandlerInterceptor())
                        .addPathPatterns("/**")
                        .excludePathPatterns("/index.html", "/", "/user/login", "/static/**");
            }
        };

        return adapter;
    }

}

```

## Restful CRUD

Rest 风格
URI： /资源/资源标识 HTTP 请求方式区分对资源 CRUD

| 说明 | 普通 CRUD(URI 区分操作) | RestfulCRUD     |
| ---- | ----------------------- | --------------- |
| 查询 | getEmp                  | GET emp         |
| 添加 | addEmp                  | POST emp        |
| 修改 | updateEmp?id=1          | PUT emp/{id}    |
| 删除 | deleteEmp?id=1          | DELETE emp/{id} |

查询接口定义

| 说明         | 请求方式 | 请求 URI |
| ------------ | -------- | -------- |
| 查询所有员工 | GET      | emps     |
| 查询某个员工 | GET      | emp/{id} |
| 添加页面     | GET      | emp      |
| 添加员工     | POST     | emp      |
| 修改页面     | GET      | emp/{id} |
| 修改员工     | PUT      | emp      |
| 删除员工     | DELETE   | emp/{id} |

## 员工列表-公共页抽取

公共片段抽取

```html
<!-- 1、抽取公共片段 -->
<div th:fragment="copy">content</div>

<!-- 2、引入公共片段 -->
<div th:insert="~{footer::copy}">content</div>

<!-- 3、默认效果 -->
<!-- insert功能片段在div标签中 -->
```

```
~{templateName::selector} 模板名::选择器
~{templateName::fragmentName}模板名::片段名
```

3 种方式引入片段

```
th:insert 插入
th:replace 替换
th:include 引入片段内容

使用th:insert可以不写~{}
转义[[~{}]]
不转义[(~{})]
```

引入片段时候传入参数

链接高亮&列表完成

redirect 重定向
forward 转发

日期格式化

```
spring.mvc.format.date: yyyy-MM-dd
```

## HiddenHttpMethodFilter

SpringMVC 中配置 HiddenHttpMethodFilter
页面创建一个 Post 表单
创建一个 input 项 name="\_method"，值就是请求方式

```html
<input type="hidden" name="_method" value="put" th:if="${emp!=null}" />
```

有些版本可能需要配置
application.yml

```yml
spring.mvc.hiddenmethod.filter.enabled = true
```

## 错误页面

ErrorMvcAutoConfiguration

有模板引擎的情况下

```
error/状态码

eg:
精确匹配
error/404.html

模糊匹配
error/4xx.html
error/5xx.html
```

自定义异常处理

1、返回 JSON 数据

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class ExceptionController {

    @ResponseBody
    @ExceptionHandler
    public Map<String, Object> handleException(Exception e){
        Map<String, Object> map = new HashMap<>();
        map.put("code", -1);
        map.put("msg", e.getMessage());
        return map;
    }
}

```

```json
{
  "msg": "用户不存在",
  "code": -1
}
```

## 嵌入式 Servlet 容器配置修改

Tomcat
通用配置

```bash
# servlet配置
server.port=8001
server.context-path=/demo

# Tomcat配置
server.tomcat.uri-encoding=UTF-8

```

## 注册 servlet 三大组件

Servlet/Filter/Listener

1、Servlet

```java
package com.example.demo.servlet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class MyServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.getWriter().println("MyServlet");
    }
}

```

2、Filter

```java
package com.example.demo.filter;

import javax.servlet.*;
import java.io.IOException;

public class MyFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        System.out.println("MyFilter");
        chain.doFilter(request, response);
    }
}

```

3、Listener

```java
package com.example.demo.listener;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class MyListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        System.out.println("contextInitialized");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        System.out.println("contextDestroyed");
    }
}

```

注册组件

```java
package com.example.demo.config;

import com.example.demo.filter.MyFilter;
import com.example.demo.listener.MyListener;
import com.example.demo.servlet.MyServlet;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

/**
 * 注册Servlet/Filter/Listener组件
 */
@Configuration
public class MyServletConfig {
    @Bean
    public ServletRegistrationBean myServlet(){
        ServletRegistrationBean registrationBean = new ServletRegistrationBean();
        registrationBean.setServlet(new MyServlet());
        registrationBean.setUrlMappings(Arrays.asList("/servlet"));
        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean myFilter(){
        FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(new MyFilter());
        registrationBean.setUrlPatterns(Arrays.asList("/servlet"));
        return registrationBean;
    }

    @Bean
    public ServletListenerRegistrationBean myListener(){
        ServletListenerRegistrationBean registrationBean = new ServletListenerRegistrationBean(new MyListener());
        return registrationBean;
    }
}


```

访问

http://localhost:8080/servlet

默认拦截: /
修改 server.servletPath

## 其他 Servlet 容器

Tomcat 默认
Jetty 长连接
Undertow 不支持 jsp

嵌入式容器
外部容器

jar 包：执行 SpringBoot 主类的 main 方法，启动 IOC 容器，创建嵌入式的 Servlet 容器
war 包：启动服务器，服务器启动 SpringBoot，启动 IOC 容器
