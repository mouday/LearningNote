# 第 8 章 ： EL（表达式语言）入门及 EL 函数库

## 课时 27 EL 入门

EL 是 JSP 内置的表达式语言

jsp2.0 开始，EL 表达式和动态标签来替代 java 脚本
EL 替代 `<%=%>`

```jsp
<% pageContext.setAttribute("name", "pageContext");%>
<% request.setAttribute("name", "request");%>
<% session.setAttribute("name", "session");%>
<% application.setAttribute("name", "application");%>

<!-- 全域查找 -->
${name} <br/>
<!-- pageContext -->

<!-- 指定域查找 -->
${requestScope.name} <br/>
${pageScope.name} <br/>
${sessionScope.name} <br/>
${applicationScope.name} <br/>

```

## 课时 28 EL 11 个内置对象

无需创建即可使用

```
pageScope
requestScope
sessionScope
applicationScope
param
paramValues
header
haderValues
iniParam
cookie
pageContext
```

```jsp
<jsp:useBean id="person" class="com.pengshiyu.bean.Person" scope="page" />

<jsp:setProperty name="person" property="name" value="Tom" />


<jsp:getProperty name="person" property="name"  />

<!-- 等价于 -->
${person.name}

```

1、param 和 paramValues
param 获取单值
paramValues 获取多值

请求地址 /?name=Tom&numbers=1&numbers=2

```jsp
${param.name}

${paramValues.numbers[0]}
${paramValues.numbers[1]}
```

2、header 和 haderValues

```jsp
${header['user-agent']}
${header["User-Agent"]}
```

3、iniParam
iniParam 可以获取 `<context-param>` 配置参数

```xml
<context-param>
    <param-name>key1</param-name>
    <param-value>value1</param-value>
</context-param>
<context-param>
    <param-name>key2</param-name>
    <param-value>value2</param-value>
</context-param>
```

4、cookie

```jsp
<!-- 获取cookie对象再获取值 -->
${cookie.JSESSIONID.value}

<!-- 等价于 -->
${pageContext.session.id}
```

5、pageContext

```jsp
${pageContext.request.contextPath}
```

## 课时 29 EL 函数库

由 JSTL 提供
引人

```jsp
<%@ taglib prefix="fn"
           uri="http://java.sun.com/jsp/jstl/functions" %>
```

函数

```
函数	描述
fn:contains()	测试输入的字符串是否包含指定的子串
fn:containsIgnoreCase()	测试输入的字符串是否包含指定的子串，大小写不敏感
fn:endsWith()	测试输入的字符串是否以指定的后缀结尾
fn:escapeXml()	跳过可以作为XML标记的字符
fn:indexOf()	返回指定字符串在输入字符串中出现的位置
fn:join()	将数组中的元素合成一个字符串然后输出
fn:length()	返回字符串长度
fn:replace()	将输入字符串中指定的位置替换为指定的字符串然后返回
fn:split()	将字符串用指定的分隔符分隔然后组成一个子字符串数组并返回
fn:startsWith()	测试输入字符串是否以指定的前缀开始
fn:substring()	返回字符串的子集
fn:substringAfter()	返回字符串在指定子串之后的子集
fn:substringBefore()	返回字符串在指定子串之前的子集
fn:toLowerCase()	将字符串中的字符转为小写
fn:toUpperCase()	将字符串中的字符转为大写
fn:trim()	移除首尾的空白符
```

使用实例

```jsp
<%@ taglib prefix="fn"
           uri="http://java.sun.com/jsp/jstl/functions" %>

${fn:toUpperCase("hello")}
<!-- HELLO -->
```

## 课时 30 EL 自定义函数库

1、定义函数

com/pengshiyu/fn/MyFunctions.java

```java
package com.pengshiyu.fn;

public class MyFunctions {
    public static String hello(){
        return "hello";
    }
}

```

2、配置函数

webapp/WEB-INF/custom.tld

```xml
<?xml version="1.0" encoding="utf-8"?>

<taglib>
    <tlib-version>1.0</tlib-version>
    <jsp-version>2.0</jsp-version>
    <short-name>Example TLD with Body</short-name>

    <function>
        <name>hello</name>
        <function-class>com.pengshiyu.fn.MyFunctions</function-class>
        <function-signature>java.lang.String hello()</function-signature>
    </function>
</taglib>
```

3、使用函数
webapp/demo.jsp

```jsp
<%@ taglib prefix="fn"
           uri="/WEB-INF/custom.tld" %>

${fn:hello()}

```
