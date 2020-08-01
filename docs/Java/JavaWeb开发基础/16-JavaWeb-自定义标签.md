# 第 10 章 ： 自定义标签

## 编写步骤：

1. 标签处理类
2. 编写 tld 文件
3. taglib 导入 tld 文件

## 依赖

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>4.0.1</version>
    <scope>provided</scope>
</dependency>

<dependency>
    <groupId>javax.servlet.jsp</groupId>
    <artifactId>javax.servlet.jsp-api</artifactId>
    <version>2.3.3</version>
    <scope>provided</scope>
</dependency>
```

## 定义无内容标签

```java
package com.pengshiyu.taglibs;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

public class HelloTag extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        this.getJspContext().getOut().println("hello");
    }
}

```

声明

```xml
<?xml version="1.0" encoding="utf-8"?>

<taglib>
    <tlib-version>1.0</tlib-version>
    <jsp-version>2.0</jsp-version>
    <short-name>Example TLD with Body</short-name>

    <tag>
        <name>Hello</name>
        <tag-class>com.pengshiyu.taglibs.HelloTag</tag-class>
        <body-content>empty</body-content>
    </tag>
</taglib>
```

引入声明文件并使用标签

```jsp
<%@ page
    language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    %>

<%@ taglib
    prefix="ext"
    uri="WEB-INF/custom.tld"
    %>

<ext:Hello />
```

## 定义有内容标签

```java
package com.pengshiyu.taglibs;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

public class HelloTag extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        JspWriter out = this.getJspContext().getOut();
        out.write("******");
        this.getJspBody().invoke(out);
        out.write("******");
    }
}

```

```jsp
<%@ page
    language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    %>

<%@ taglib
    prefix="ext"
    uri="WEB-INF/custom.tld"
    %>

<ext:Hello>
你好
</ext:Hello>
```

输出

```
****** 你好 ******
```

## 不再执行标签下面的内容

```java
package com.pengshiyu.taglibs;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.SkipPageException;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

public class HelloTag extends SimpleTagSupport {
    @Override
    public void doTag() throws JspException, IOException {
        this.getJspContext().getOut().write("以下内容不显示");
        throw new SkipPageException();
    }
}

```

带有属性的标签

标签类

```java
package com.pengshiyu.taglibs;

import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;
import java.io.IOException;

public class HelloTag extends SimpleTagSupport {


    private String name = "";

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void doTag() throws JspException, IOException {
        this.getJspContext().getOut().write(this.name);

    }
}

```

tld 配置

```xml
<tag>
    <name>Hello</name>
    <tag-class>com.pengshiyu.taglibs.HelloTag</tag-class>
    <body-content>scriptless</body-content>
    <attribute>
<!--            属性名称-->
        <name>name</name>
<!--            是否可选-->
        <required>true</required>
<!--            支持表达式-->
        <rtexprvalue>true</rtexprvalue>
    </attribute>
</tag>
```

使用

```jsp
<ext:Hello name="Tom"></ext:Hello>
```
