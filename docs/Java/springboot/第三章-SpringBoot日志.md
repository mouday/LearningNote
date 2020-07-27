# 第三章 Spring Boot 日志

## 1、日志框架分类和选择

日志框架：

```
日志门面（抽象层）：
JCL Jakarta Commons Logging
SLF4j Simple Logging Facade for Java
Jboss-logging

日志实现：
JUL Java.util.logging
logback
log4j
log4j2
```

SpringBoot 选择：

1. 日志门面 SLF4j
2. 日志实现 logback

## 2、slf4j 使用原理

开发的时候，日志记录方法的调用不应该来直接调用日志的实现类

而是调用日志抽象层里的方法

http://www.slf4j.org/manual.html

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class HelloWorld {
  public static void main(String[] args) {
    Logger logger = LoggerFactory.getLogger(HelloWorld.class);
    logger.info("Hello World");
  }
```

![](img/concrete-bindings.png)

每一个日志的实现框架都有自己的配置文件，

使用 slf4j 以后，配置文件还是做成日志实现框架的配置文件

## 3、其他日志框架统一转换为 slf4j

遗留问题, 各框架使用的日志框架不一样

```
Spring (commons-logging)
Hibernate(jboss-logging)
MyBaits
```

统一日志框架

![](img/legacy.png)

1. 将系统中其他日志框架先排除
2. 用中间包来替换原有的日志框架
3. 引入 slf4j 其他实现

## 4、SpringBoot 日志关系

1. SpringBoot 能自动适配所有日志，底层使用 slf4j+logback 方式记录日志
2. SpringBoot 把其他日志替换成了 slf4j
3. 中间替换包
4. 如果引入其他框架，需要把其他框架默认的日志依赖移除

## 5、SpringBoot 默认配置

日志级别由低到高

```
trace
debug
info  默认级别
warn
error
```

修改日志级别

application.properties

```bash
logging.level.com.className=trace
```

使用示例

```java
package com.mouday;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoApplicationTests {

    Logger logger = LoggerFactory.getLogger(getClass());

    @Test
    public void contextLoads() {
        logger.trace("trace");
        logger.debug("trace");
        logger.info("trace");
        logger.warn("trace");
        logger.error("trace");
    }
}
```

日志配置

```bash
# 指定日志文件(优先作用)
logging.file=spring.log

# 指定日志路径
logging.path=logs

# 控制台输出日志格式
logging.pattern.console=%d{yyyy-MM-dd} [%thread] %-5level %logger{50} - %msg%n

# 文件输出日志格式
logging.pattern.file=%d{yyyy-MM-dd} === [%thread] %-5level %logger{50} - %msg%n
```

日志格式说明

```
%d           日期时间
%thread      线程名
%-5level     级别从左显示5个字符宽度
%logger{50}  logger名字最长显示50个字符，否则按照句点分割
%msg         日志消息
%n           换行
```

## 6、指定日志文件和日志 Profile 功能

建立使用日志框架的配置文件，springboot 将不使用默认配置

```
logback                logback-spring.xml, logback.xml
Log4j2                 log4j2-spring.xml
JUL(Java Util Logging) logging.properties
```

说明

```
logback.xml 直接被日志框架识别
logback-spring.xml 日志框架不直接加载配置文件
```

可以使用高级功能

```xml
<springProfile name="dev">

</springProfile>
```

## 7、切换日志框架

可以按照 slf4j 日志适配图进行切换
