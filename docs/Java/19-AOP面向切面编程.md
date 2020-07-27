# AOP 面向切面编程

AOP aspect oriented programming
OOP Object oriented programming

1. 提供申明式服务
2. 允许用户实现自定义切面

传统编程模式

自上而下，纵向的编程

```
Jsp
    ->
Action
    ->
Service
    ->
Dao
```

AOP 编程：
在不改变原有的代码，增加新的功能

```
Jsp
    ->
Action
    ->
Service  <- log()
    ->
Dao
```

好处：

1. 使得真实角色处理业务更加纯粹，不再关注公共的问题
2. 公共业务由代理类完成，实现业务的分工
3. 公共业务发生扩展时变得更加集中和方便

关注点：日志，安全，缓存，事务
切面 Aspect：一个关注点的模块化

## 实现 AOP

1、通过 Spring 接口实现

依赖

```xml
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.5</version>
</dependency>

```

```java
package com.spring.service;

public interface UserService {
    public void add();
    public void delete();
}

```

```java
package com.spring.service.impl;

import com.spring.service.UserService;

public class UserServiceImpl implements UserService {

    @Override
    public void add() {
        System.out.println("add");
    }

    @Override
    public void delete() {
        System.out.println("delete");
    }
}

```

```java
package com.spring.aop;

import org.springframework.aop.MethodBeforeAdvice;

import java.lang.reflect.Method;

// 前置通知
public class BeforeLog implements MethodBeforeAdvice {
    @Override
    public void before(Method method, Object[] args, Object target)
    throws Throwable {
        System.out.println(target.getClass().getName() + ": "+ method.getName());
    }
}

```

```java
package com.spring.aop;

import org.springframework.aop.AfterReturningAdvice;

import java.lang.reflect.Method;

// 后置通知
public class AfterLog implements AfterReturningAdvice {
    @Override
    public void afterReturning(
        Object result, Method method, Object[] objects, Object target)
        throws Throwable {
        System.out.println(target.getClass().getName() + ": "+ method.getName());
    }
}

```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">


    <bean id="service" class="com.spring.service.impl.UserServiceImpl"/>

    <bean id="beforeLog" class="com.spring.aop.BeforeLog"/>
    <bean id="AfterLog" class="com.spring.aop.AfterLog"/>

    <aop:config>
        <aop:pointcut id="action"
        expression="execution(* com.spring.service.impl.UserServiceImpl.* (..))"/>
        <aop:advisor advice-ref="beforeLog" pointcut-ref="action"/>
        <aop:advisor advice-ref="AfterLog" pointcut-ref="action"/>
    </aop:config>
</beans>

```

```java
package com.spring.test;


import com.spring.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Demo {
    public static void main(String[] args) {
        ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
        UserService service = (UserService) context.getBean("service");

        service.add();
        service.delete();

    }
}

```

执行结果

```
com.spring.service.impl.UserServiceImpl: add
add
com.spring.service.impl.UserServiceImpl: add

com.spring.service.impl.UserServiceImpl: delete
delete
com.spring.service.impl.UserServiceImpl: delete

```

Spring AOP 本质

就是讲公共的业务（如日期，安全等）和领域业务结合，
当执行领域业务时将会把公共业务加进来，
实现公共业务的重复利用，
领域业务更纯粹，可以专注于领域业务，
本质是动态代理

2、自定义类实现 AOP

UserService、UserServiceImpl、Demo 三个类不变

添加 Log 类和修改配置文件

```java
package com.spring.aop;

public class Log {
    public void before(){
        System.out.println("--before--");
    }

    public void after(){
        System.out.println("--after--");
    }
}

```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">


    <bean id="service" class="com.spring.service.impl.UserServiceImpl"/>
    <bean id="log" class="com.spring.aop.Log"/>

    <aop:config>
        <aop:aspect ref="log">
            <aop:pointcut id="action"
            expression="execution(* com.spring.service.impl.UserServiceImpl.* (..))"/>
            <aop:before method="before" pointcut-ref="action"/>
            <aop:after method="after" pointcut-ref="action"/>
        </aop:aspect>
    </aop:config>
</beans>

```

执行结果

```
--before--
add
--after--
--before--
delete
--after--
```

3、注解实现 AOP
业务类不改变

```java
package com.spring.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
public class Log {
    @Before("execution(* com.spring.service.impl.UserServiceImpl.* (..))")
    public void before(){
        System.out.println("--before--");
    }

    @After("execution(* com.spring.service.impl.UserServiceImpl.* (..))")
    public void after(){
        System.out.println("--after--");
    }

    @Around("execution(* com.spring.service.impl.UserServiceImpl.* (..))")
    public Object Around(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("--Around before--");
        Object result = pjp.proceed();
        System.out.println("--Around after--");
        return result;
    }
}

```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">


    <bean id="service" class="com.spring.service.impl.UserServiceImpl"/>
    <bean id="log" class="com.spring.aop.Log"/>

    <aop:aspectj-autoproxy />

</beans>

```

执行结果

```
--Around before--
--before--
add
--Around after--
--after--

--Around before--
--before--
delete
--Around after--
--after--
```

## 总结

公共业务：
日志，安全，权限，缓存，事务

分离思想

在不改变原有代码的情况下，增加额外的功能
