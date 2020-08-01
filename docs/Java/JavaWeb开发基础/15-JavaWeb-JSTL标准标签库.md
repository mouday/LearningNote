# 第 9 章 ： JSTL（标准标签库）

资料：
[JSP 标准标签库（JSTL）](https://www.runoob.com/jsp/jsp-jstl.html)

JSTL 是对 EL 表达式的扩展标签语言

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

JSTL 四大标签库

1. core 核心标签库 学习重点
2. fmt 格式化标签库 只需要学习日期，数字
3. sql 数据库标签库 过时了
4. xml xml 标签库 过时了

导入标签库

```jsp
<% @taglib prefix="前缀" uri="路径" %>
```

核心标签库 core，c 标签

```
out 和 set
remove
url
if
choose
forEach
```

out 输出

```jsp
<c:out
    value="<string>" 内容
    default="<string>" 默认值
    escapeXml="<true|false>" 转义
    />
```

示例

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:out value="name" default="Tom" />
```

set 设置

```jsp
<c:set
   var="<string>" 变量
   value="<string>" 值
   target="<string>" 对象
   property="<string>" 属性
   scope="<string>" 作用域
   />
```

remove 删除数据

```jsp
<c:remove
    var="<string>" 变量名称
    scope="<string>" 作用域
    />
```

url 将 URL 格式化为一个字符串

```jsp
<c:url
  var="<string>" 变量名
  scope="<string>" 作用域
  value="<string>" 基础URL
  context="<string>" 本地网络应用程序的名称
/>

<!-- 指定参数 -->
<c:param name="<string>" value="<string>"/>
```

示例

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:url value="/name" />
<!-- 输出：/demo/name -->

<!-- 等价于 -->
${pageContext.request.contextPath}/name


<c:url value="/name">
    <c:param name="key" value="value"/>
</c:url>

<!-- 输出 /demo/name?key=value -->
```

if 和 choose 标签

```jsp
<c:set var="name" value="Tom" />

<c:if test="${not empty name}">
    <c:out value="${name}" />
</c:if>
```

forEach 标签

```jsp
<c:forEach var="i" begin="1" end="5">
    ${i}
</c:forEach>
```

```jsp
<% String[] arr = {"big", "pig"};  %>

<% request.setAttribute("arr", arr); %>
<!-- 或者 -->
<c:set var="arr", value="${arr}" />

<c:forEach items="${arr}" var="item" >
    ${item}
</c:forEach>
```

循环状态变量

```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8" import="java.util.ArrayList"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
    ArrayList<String> list = new ArrayList<String>();
    list.add("Tom");
    list.add("Jack");
    list.add("Steve");

    // 加到域对象中
    pageContext.setAttribute("list", list);
%>

<c:forEach items="${list}" var="item" varStatus="status">
    ${status.count}${item}
</c:forEach>
```

属性

```
status.count 元素个数
status.index 元素下标
status.first 是否为第一个元素
status.last 是否为最后一个元素
status.cuttent 当前元素
```

fmt 标签格式化

```jsp
<%@ page
    language="java"
    contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    import="java.util.Date"
    %>

<%@ taglib
    prefix="fmt"
    uri="http://java.sun.com/jsp/jstl/fmt"
    %>

<!-- 格式化日期 -->
<%
Date date = new Date();
pageContext.setAttribute("date", date);
%>

<fmt:formatDate value="${date}" pattern="yyyy-MM-dd HH:mm:ss" />
<!-- 2020-05-16 23:32:34 -->


<!-- 格式化数字 -->
<%
pageContext.setAttribute("num", 3.141592653);
%>

<fmt:formatNumber value="${num}" pattern="0.00" />
<!-- 3.14 -->
```

```
0.00 不足 0 补位
#.## 不足不补位
```
