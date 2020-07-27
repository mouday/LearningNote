# Java 定时任务调度工具详解之 Quartz 篇

官网
http://www.quartz-scheduler.org/

特点

1. 强大的调度功能
2. 灵活的应用方式
3. 分布式和集群能力

主要用到的设计模式

1. Builder 模式
2. Factory 模式
3. 组件模式
4. 链式写法

三个核心概念

1. 调度器
2. 任务
3. 触发器

Quartz 体系结构

```
JobDetail
scheduler
trigger
    -SimpleTrigger
    -CronTrigger
```

重要组成

```
Job
JobDetail
JobBuilder
JobStore

Trigger
TriggerBuilder
ThreadPool

Scheduler
Calendar

监听器
JobListener
TriggerListener
SchedulerListener
```

## Quartz 实例

依赖

```xml
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.25</version>
    <scope>compile</scope>
</dependency>
```

定义任务 MyJob.java

```java
package timer;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MyJob implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(dateFormat.format(new Date()));
    }
}

```

调度任务 QuartzDemo.java

```java
package timer;

import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;


public class QuartzDemo {
    public static void main(String[] args) throws SchedulerException {
        // 创建JobDetail
        JobDetail jobDetail = JobBuilder
                .newJob(MyJob.class)
                .withIdentity("myJob", "group1")
                .build();

        // 每2s执行一次，无限循环
        SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
                .simpleSchedule()
                .withIntervalInSeconds(2)
                .repeatForever();

        // 创建Trigger
        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("myTrigger", "group1")
                .startNow()
                .withSchedule(scheduleBuilder)
                .build();

        // 通过工厂方法创建Scheduler实例
        SchedulerFactory factory = new StdSchedulerFactory();
        Scheduler scheduler = factory.getScheduler();
        scheduler.start();
        scheduler.scheduleJob(jobDetail, trigger);

    }
}

```

## Job 和 JobDetail

1、Job 源码：

```java
package org.quartz;

public interface Job {
    void execute(JobExecutionContext context)
        throws JobExecutionException;
}
```

2、Job 的生命周期：

每次调度器执行 Job 时，调用 execute 方法前会创建一个新的 Job 实例
调用完成后，关联的 Job 对象实例会被释放，释放的实例会被垃圾回收机制回收

3、JobDetail：

JobDetail 为 Job 实例提供了许多设置属性，以及 JobDataMap 成员变量属性，
它用来存储特定 Job 实例的状态信息，调度器需要借助 JobDetail 对象来添加 Job 实例

4、JobDetail 重要属性

```
name
group 默认值DEFAULT
jobClass
jobDataMap
```

```java
// 创建JobDetail
JobDetail jobDetail = JobBuilder
        .newJob(MyJob.class)
        .withIdentity("myJob", "group1")
        .build();

// 打印jobDetail属性
System.out.println(jobDetail.getKey().getName()); // myJob
System.out.println(jobDetail.getKey().getGroup()); // group1
System.out.println(jobDetail.getJobClass().getName()); // timer.MyJob
```

## JobExecutionContext & JobDataMap

1、JobExecutionContext：

Scheduler 给 Job 传递参数

2、JobDataMap:

可以装载任何可序列化的数据对象
实现了 Map 接口

设置 JobDataMap 部分代码

```java
// 创建JobDetail
JobDetail jobDetail = JobBuilder
        .newJob(MyJob.class)
        .withIdentity("myJob", "group1")
        .usingJobData("name", "jobDetail")
        .build();

// 每2s执行一次，无限循环
SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
        .simpleSchedule()
        .withIntervalInSeconds(2)
        .repeatForever();

// 创建Trigger
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .startNow()
        .usingJobData("name", "trigger")
        .withSchedule(scheduleBuilder)
        .build();
```

获取 JobDataMap

方法一：直接从 JobDataMap 对象中获取

```java
package timer;

import org.quartz.*;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MyJob implements Job {
    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {

        // 获取 jobkey
        JobKey jobKey = jobExecutionContext.getJobDetail().getKey();
        System.out.println(jobKey.getName()); // myJob
        System.out.println(jobKey.getGroup()); // group1

        // 获取JobDetail的DataMap
        JobDataMap jobDetailDataMap = jobExecutionContext.getJobDetail().getJobDataMap();
        System.out.println(jobDetailDataMap.getString("name"));
        // jobDetail

        // 获取Trigger的DataMap
        JobDataMap triggerDataMap = jobExecutionContext.getTrigger().getJobDataMap();
        System.out.println(triggerDataMap.getString("name"));
        // trigger

        // 获取合并后的DataMap
        JobDataMap dataMap = jobExecutionContext.getMergedJobDataMap();
        System.out.println(dataMap.getString("name"));
        // trigger
    }
}

```

方法二：定义同名变量获取

```java
package timer;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

public class MyJob implements Job {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        System.out.println(this.name);
    }
}

```

## Trigger

Trigger 是触发器，用来告诉调度程序作业什么时候触发

触发器通用属性

```
JobKey： Job 实例的标识，触发器被触发时，指定的 job 实例会执行
StartTime：触发器的时间表首次被触发的时间，类型是 Java.util.Date
EndTime：触发器不再被触发的时间 Java.util.Date
```

设置部分代码

```java
// 获取3秒后的时间
Date startDate = new Date();
startDate.setTime(startDate.getTime() + 3000);

// 获取6秒后的时间
Date endDate = new Date();
endDate.setTime(endDate.getTime() + 3000);

// 创建Trigger
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .startAt(startDate)
        .endAt(endDate)
        .usingJobData("name", "trigger")
        .withSchedule(scheduleBuilder)
        .build();
```

Job 中获取 Trigger 数据

```java
package timer;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;

import java.text.SimpleDateFormat;

public class MyJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Trigger trigger = jobExecutionContext.getTrigger();

        // 获取开始时间和结束时间
        System.out.println(dateFormat.format(trigger.getStartTime()));
        System.out.println(dateFormat.format(trigger.getEndTime()));

        // 获取JobKey
        System.out.println(trigger.getJobKey().getName());
        System.out.println(trigger.getJobKey().getGroup());
    }
}

```

## SimpleTrigger

指定时间段内执行一次作业任务
或者在指定的时间间隔内多次执行作业任务

任务

```java
package timer;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

import java.text.SimpleDateFormat;
import java.util.Date;

public class MyJob implements Job {

    @Override
    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(dateFormat.format(new Date()));
    }
}

```

示例 1

```java
// 获取3秒后的时间
Date startDate = new Date();
startDate.setTime(startDate.getTime() + 3000);

// 3秒钟之后执行一次
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .startAt(startDate)
        .build();
```

示例 2

```java
// 获取3秒后的时间
Date startDate = new Date();
startDate.setTime(startDate.getTime() + 3000);

// 每2s执行一次，无限循环
SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
        .simpleSchedule()
        .withIntervalInSeconds(2)
        .withRepeatCount(3);

// 3s之后执行第一次，之后每隔2s执行一次，重复3次
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .startAt(startDate)
        .withSchedule(scheduleBuilder)
        .build();
```

示例 3

```java
// 获取3秒后的时间
Date startDate = new Date();
startDate.setTime(startDate.getTime() + 3000L);

// 获取6秒后的时间
Date endDate = new Date();
endDate.setTime(endDate.getTime() + 6000L);

// 每2s执行一次，无限循环
SimpleScheduleBuilder scheduleBuilder = SimpleScheduleBuilder
        .simpleSchedule()
        .withIntervalInSeconds(2)
        .withRepeatCount(3);

// 3s之后执行第一次，之后每隔2s执行一次，6秒之后结束
Trigger trigger = TriggerBuilder.newTrigger()
        .withIdentity("myTrigger", "group1")
        .startAt(startDate)
        .endAt(endDate)
        .withSchedule(scheduleBuilder)
        .build();
```

注意：

1. 重复次数可以为 0、正整数、SimpleTrigger.REPEAT_INDEFINITELY
2. 重复执行间隔必须为 0 或长整数
3. 一旦执行了 endTime 参数，那么会覆盖重复次数参数的效果

## CronTrigger

基于日历的作业调度器，而不是像 SimpleTrigger 那样精确指定时间间隔，较为常用

格式：

```
秒 分 时 日 月 周 年
```

特殊符号说明

```
, 或 10,12
- 区间 10-12
/ 每 */5
* 所有值 *
? 不指定
```

提示

1. L 和 W 可以组合使用
2. 周字段不区分大小写 mon 与 MON 相同
3. 利用在线生成工具

示例

```java
// 每2秒执行一次
Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("myTrigger", "group1")
                .withSchedule(CronScheduleBuilder.cronSchedule("*/2 * * * * ? *"))
                .build();
```

## Scheduler

StdSchedulerFactory

配置参数一般存储在 quartz.properties

主要函数

```java
// 将job和trigger注册到scheduler
Date scheduleJob(JobDetail jobDetail, Trigger trigger)

// 启动
void start()

// 暂停
void standby()

// 关闭
// true 等待所有任务执行完成再关闭
// false 直接关闭
void shutdown()
```

## quartz.properties

文档位置和加载顺序

jar 包下有默认配置

组成部分

1. 调度器属性
2. 线程池属性
3. 作业存储位置
4. 插件配置

## SpringMVC 整合 Quartz

新建 maven webapp

依赖

```
webmvc
context
aop
core
```

配置 Quartz 的两种方式：

1. MethodInvokingJobDetailFactoryBean 适合调用特定 bean 方法时很方便
2. JobDetailFactoryBean 支持传入一些参数

项目结构

```
$ tree -I target
.
├── pom.xml
├── src
│   └── main
│       ├── java
│       │   └── com
│       │       └── mouday
│       │           ├── controller
│       │           │   └── IndexController.java
│       │           └── quartz
│       │               ├── ComplexJob.java
│       │               └── SimpleJob.java
│       ├── resources
│       │   └── dispatcher-servlet.xml
│       └── webapp
│           ├── WEB-INF
│           │   └── web.xml
│           └── index.jsp
```

1、pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>spring-mvc-demo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <spring.version>5.2.6.RELEASE</spring.version>
    </properties>

    <build>
        <finalName>springquartz</finalName>
        <plugins>
            <!-- tomcat7插件 maven 命令 tomcat7:run 启动项目-->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <port>8080</port>
                    <path>/</path>
                    <uriEncoding>UTF-8</uriEncoding>
                    <!--添加忽略war包检查标签，则可以让tomcat7：run指令正常启动tomcat-->
                    <ignorePackaging>true</ignorePackaging>
                    <contextFile>src/main/webapp/WEB-INF/web.xml</contextFile>
                    <contextReloadable>true</contextReloadable>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context-support</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aop</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-expression</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <dependency>
            <groupId>commons-logging</groupId>
            <artifactId>commons-logging</artifactId>
            <version>1.2</version>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <groupId>jstl</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>

        <!-- 需要 context-support tx 的支持-->
        <dependency>
            <groupId>org.quartz-scheduler</groupId>
            <artifactId>quartz</artifactId>
            <version>2.3.2</version>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.25</version>
            <scope>compile</scope>
        </dependency>
    </dependencies>
</project>

```

2、src/main/webapp/index.jsp

```jsp
<html>
    <body>
        <h2>Hello World!</h2>
    </body>
</html>
```

3、src/main/webapp/WEB-INF/web.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

  <!-- 配置分发器 默认加载配置文件：名字-servlet.xml -->
  <servlet>
    <servlet-name>dispatcher</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>

    <!-- 指定配置文件 -->
    <init-param>
      <param-name>contextConfigLocation</param-name>
      <param-value>classpath:dispatcher-servlet.xml</param-value>
    </init-param>

    <!-- 表示容器再启动时立即加载servlet -->
    <load-on-startup>1</load-on-startup>
  </servlet>

  <servlet-mapping>
    <servlet-name>dispatcher</servlet-name>
    <!-- 处理所有URL -->
    <url-pattern>/</url-pattern>
  </servlet-mapping>

  <welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>

</web-app>

```

4、src/main/resources/dispatcher-servlet.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       http://www.springframework.org/schema/context/spring-context.xsd
       http://www.springframework.org/schema/mvc
       http://www.springframework.org/schema/mvc/spring-mvc.xsd
">
    <!--防止中文乱码-->
    <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter">
        <property name="messageConverters">
            <list>
                <bean class="org.springframework.http.converter.StringHttpMessageConverter">
                    <property name="supportedMediaTypes">
                        <list>
                            <value>text/html; charset=utf-8</value>
                        </list>
                    </property>
                </bean>
            </list>
        </property>
    </bean>


    <!-- 添加注解驱动-->
    <mvc:annotation-driven/>

    <!-- 默认扫描包路径-->
    <context:component-scan base-package="com.mouday"/>

    <!-- view-controller 可以直接不通过controller处理request，转发到view-->
    <mvc:view-controller path="/" view-name="index"/>

    <!-- 渲染器-->
    <bean id="jspViewResolver" class="org.springframework.web.servlet.view.UrlBasedViewResolver">
        <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
        <!-- 结果视图的前缀-->
        <property name="prefix" value="/"/>
        <!-- 结果视图的后缀-->
        <property name="suffix" value=".jsp"/>
    </bean>

    <!--配置Quartz-->
    <bean id="simpleJobDetail" class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">
        <property name="targetObject" ref="simpleJob"/>
        <property name="targetMethod" value="sayHello"/>
    </bean>

    <bean id="complexJobDetail" class="org.springframework.scheduling.quartz.JobDetailFactoryBean">
        <property name="jobClass" value="com.mouday.quartz.ComplexJob"/>
        <property name="jobDataMap">
            <map>
                <entry key="name" value="Tom"/>
            </map>
        </property>
        <property name="Durability" value="true"/>
    </bean>

    <!--一s之后执行，每隔2s执行一次-->
    <bean id="simpleTrigger" class="org.springframework.scheduling.quartz.SimpleTriggerFactoryBean">
        <property name="jobDetail"  ref="simpleJobDetail"/>
        <property name="startDelay" value="1000"/>
        <property name="repeatInterval" value="2000"/>
    </bean>

    <bean id="cronTrigger" class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
        <property name="jobDetail" ref="complexJobDetail"/>
        <property name="cronExpression" value="0/3 * * * * ? *"/>
    </bean>

    <bean class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
        <property name="jobDetails">
            <list>
                <ref bean="simpleJobDetail"/>
                <ref bean="complexJobDetail"/>
            </list>
        </property>
        <property name="triggers">
            <list>
                <ref bean="simpleTrigger"/>
                <ref bean="cronTrigger"/>
            </list>
        </property>
    </bean>
</beans>
```

5、src/main/java/com/mouday/controller/IndexController.java

```java
package com.mouday.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 仅用于SpringMVC服务测试
 */
@Controller
public class IndexController {
    @GetMapping("/login")
    @ResponseBody
    public String login(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "password", required = false) String password
    ) {
        return "name:" + name + " password:" + password;
    }
}

```

6、src/main/java/com/mouday/quartz/SimpleJob.java

```java
package com.mouday.quartz;

import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component("simpleJob")
public class SimpleJob {
    public void sayHello(){
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("SimpleJob "+ dateFormat.format(new Date()) );
    }
}

```

7、src/main/java/com/mouday/quartz/ComplexJob.java

```java
package com.mouday.quartz;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ComplexJob extends QuartzJobBean {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println("ComplexJob name: " + this.name + " " + dateFormat.format(new Date()));
    }
}

```

## 总结

1. Timer 优缺点
2. Quartz 三大要素
3. Quartz&Spring 融合
