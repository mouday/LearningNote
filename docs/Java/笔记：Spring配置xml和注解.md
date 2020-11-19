Spring

## Java Web发展历史

- 第一阶段 JavaBean + Servlet + JSP
- 第二阶段 EJB重量级框架
- 第三阶段 SpringMVC/Struts + Spring + Hibernate/MyBatis
- 第四阶段 SpringBoot 约定大于配置
- 第五阶段 Dubbo为代表的SOA微服务架构体系
- 第六阶段 SpringCloud 微服务框架爱技术生态圈

## 课程内容IoC

- 介绍IoC并编写一个简单的IoC容器
- 介绍通过xml方式完成SpringIoC对Bean的管理
- 介绍SpringIoC相关注解的使用

## IoC介绍

IoC Inversion of Control 控制反转，依赖注入

控制：控制对象的创建及销毁（生命周期）
反转：将对象的控制权交给IoC容器

简化约定
- 所有的Bean的生命周期都交由IoC容器管理
- 所有被依赖的Bean通过构造函数方法执行注入
- 被依赖的Bean需要优先创建

## IoC实现
依赖关系
```bash
Car
    +start()
    +stop()
    +turnLeft()
    +turnRight()

    <- AudiCar
    <- BuickCar


Human
    +goHome()

    <- HumanWithCar
        -car
        +goHome()

        <- LisiHuman
        <- ZhangsanHuman

```

代码实现

```java
package com.demo.ioc.car;

/**
 * 汽车
 */
public interface Car {
    void start();
    void stop();
    void turnLeft();
    void turnRight();
}

```

```java
package com.demo.ioc.car;

/**
 * 奥迪车
 */
public class AudiCar implements Car{
    @Override
    public void start() {
        System.out.println("AudiCar start");
    }

    @Override
    public void stop() {
        System.out.println("AudiCar stop");
    }

    @Override
    public void turnLeft() {
        System.out.println("AudiCar turnLeft");
    }

    @Override
    public void turnRight() {
        System.out.println("AudiCar turnRight");
    }
}

```

```java
package com.demo.ioc.car;

/**
 * 别克车
 */
public class BuickCar implements Car{

        @Override
        public void start() {
            System.out.println("BuickCar start");
        }

        @Override
        public void stop() {
            System.out.println("BuickCar stop");
        }

        @Override
        public void turnLeft() {
            System.out.println("BuickCar turnLeft");
        }

        @Override
        public void turnRight() {
            System.out.println("BuickCar turnRight");

    }

}

```

```java
package com.demo.ioc.human;

/**
 * 人类接口
 */
public interface Human {
    void goHome();
}

```

```java
package com.demo.ioc.human;

import com.demo.ioc.car.Car;

/**
 * 有车人
 */
public abstract class HumanWithCar implements Human {
    protected Car car;

    public HumanWithCar(Car car) {
        this.car = car;
    }

    public abstract void goHome();
}

```

```java
package com.demo.ioc.human;

import com.demo.ioc.car.Car;

/**
 * 张三
 */
public class ZhangsanHuman extends HumanWithCar{
    public ZhangsanHuman(Car car) {
        super(car);
    }

    @Override
    public void goHome() {
        this.car.start();
        this.car.turnLeft();
        this.car.stop();
    }
}

```

```java
package com.demo.ioc.human;

import com.demo.ioc.car.Car;

/**
 * 李四
 */
public class LisiHuman extends HumanWithCar{
    public LisiHuman(Car car) {
        super(car);
    }

    @Override
    public void goHome() {
        this.car.start();
        this.car.turnRight();
        this.car.stop();
    }
}

```

```java
package com.demo.ioc;


import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 1. 实例化Bean
 * 2. 保存Bean
 * 3. 提供Bean
 * 4. 每个Bean要与唯一的id对应
 */
public class IocContainer {
    private Map<String, Object> beans = new ConcurrentHashMap<>();

    /**
     * 根据 beanId获取Bean
     *
     * @param beanId
     * @return
     */
    public Object getBean(String beanId) {
        return beans.get(beanId);
    }

    /**
     * 委托IoC容器创建一个Bean
     *
     * @param clazz        Bean的class
     * @param beanId       Bean 的id
     * @param paramBeanIds class构造函数所需参数的beanId
     */
    public void setBean(Class<?> clazz, String beanId, String... paramBeanIds) {
        //  1. 组装构造方法所需要的参数值
        Object[] paramBeans = new Object[paramBeanIds.length];
        for (int i = 0; i < paramBeanIds.length; i++) {
            paramBeans[i] = beans.get(paramBeanIds[i]);
        }

        //  2. 调用构造方法实例化Bean
        Object bean = null;
        for (Constructor<?> constructor: clazz.getConstructors()){
            try {
                bean = constructor.newInstance(paramBeans);
            } catch (InstantiationException e) {
            } catch (IllegalAccessException e) {
            } catch (InvocationTargetException e) {
            }
        }

        if(bean == null){
            throw new RuntimeException("Bean实例化失败");
        }

        //  3. 将示例化的bean放入beans
        beans.put(beanId, bean);

    }
}

```

代码回顾
所有的依赖关系被集中统一的管理起来，清晰明了
每个类只需要关注自己的业务逻辑
修改依赖关系将是一件很容易的事情

## Spring IoC

依赖pom.xml

```xml
 <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>4.3.7.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>4.3.7.RELEASE</version>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
    <scope>test</scope>
</dependency>

```

```java
package com.demo.ioc;

public class Bean {

}

```

spring.xml
```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <!--将bean交由Spring创建并管理-->
    <bean id="bean" class="com.demo.ioc.Bean"/>

</beans>
```

测试
```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanTest {
    @Test
    public void testBean(){
        // 获取上下文
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

        // 获取bean
        Bean bean = context.getBean("bean", Bean.class);

        System.out.println(bean);
    }
}

```

## 实例化Bean方式

- 通过构造方法实例化Bean
- 通过静态方法实例化Bean
- 通过实例方法实例化Bean
- Bean的别名

1、通过构造方法实例化Bean
```java
package com.demo.ioc;

public class Bean {
    public Bean(){}
}

```

```xml
<bean id="bean" class="com.demo.ioc.Bean"/>
```

2、通过静态方法实例化Bean
```java
package com.demo.ioc;

public class BeanFactory {
    public static Bean createBean(){
        return new Bean();
    }
}
```

```xml
<bean id="bean" class="com.demo.ioc.BeanFactory" factory-method="createBean"/>
```

3、通过实例方法实例化Bean
```java
package com.demo.ioc;

public class BeanFactory {
    public Bean createBean(){
        return new Bean();
    }
}

```

```xml
<bean id="beanFactory" class="com.demo.ioc.BeanFactory"/>
<bean id="bean" class="com.demo.ioc.Bean" factory-bean="beanFactory" factory-method="createBean"/>

```

4、Bean的别名

```xml
<bean id="bean" class="com.demo.ioc.Bean" name="bean1,bean2"/>
<!-- alias不支持逗号分隔 -->
<alias name="bean" alias="bean3"/>

```

## 注入Bean方式

通过构造方法注入Bean
通过set方式注入Bean
集合类Bean的注入（List、Set、Map、Properties）
null注入
注入时创建内部Bean

1、通过构造方法注入Bean

```java
package com.demo.ioc;

public class Bean {
    private String name;
    private AnotherBean anotherBean;

    public Bean(String name, AnotherBean anotherBean) {
        this.name = name;
        this.anotherBean = anotherBean;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AnotherBean getAnotherBean() {
        return anotherBean;
    }

    public void setAnotherBean(AnotherBean anotherBean) {
        this.anotherBean = anotherBean;
    }

    @Override
    public String toString() {
        return "Bean{" +
                "name='" + name + '\'' +
                ", anotherBean=" + anotherBean +
                '}';
    }
}


package com.demo.ioc;

public class AnotherBean {
}

```

```xml
<bean id="anotherBean" class="com.demo.ioc.AnotherBean"/>

<bean id="bean" class="com.demo.ioc.Bean">
    <!-- index、name、type三个属性组合确定参数 -->
    <!-- value用于简单数据类型 -->
    <!-- ref用于复杂数据类型 -->
    <constructor-arg index="0" name="name" type="java.lang.String" value="Tom"/>
    <constructor-arg index="1" name="anotherBean" type="com.demo.ioc.AnotherBean" ref="anotherBean"/>

</bean>
```

简化写法
```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="anotherBean" class="com.demo.ioc.AnotherBean"/>

    <bean id="bean" class="com.demo.ioc.Bean"
          c:name="Jack" c:anotherBean-ref="anotherBean"/>

</beans>


```

2、通过set方式注入Bean

```java
package com.demo.ioc;

public class Bean {
    private String name;
    private AnotherBean anotherBean;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AnotherBean getAnotherBean() {
        return anotherBean;
    }

    public void setAnotherBean(AnotherBean anotherBean) {
        this.anotherBean = anotherBean;
    }

    @Override
    public String toString() {
        return "Bean{" +
                "name='" + name + '\'' +
                ", anotherBean=" + anotherBean +
                '}';
    }
}

```

```xml
<bean id="anotherBean" class="com.demo.ioc.AnotherBean"/>

<bean id="bean" class="com.demo.ioc.Bean">
    <property name="name" value="Jack"/>
    <property name="anotherBean" ref="anotherBean"/>
</bean>
```

简化写法

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:c="http://www.springframework.org/schema/c"
       xmlns:p="http://www.springframework.org/schema/p"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd">


    <bean id="anotherBean" class="com.demo.ioc.AnotherBean"/>

    <bean id="bean" class="com.demo.ioc.Bean"
          p:name="Jack" p:anotherBean-ref="anotherBean"/>
</beans>
```

3、集合类Bean的注入（List、Set、Map、Properties）

```java
package com.demo.ioc;


import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class Bean {
    private List<String> stringList;
    private List<AnotherBean> anotherBeanList;

    private Set<String> stringSet;
    private Set<AnotherBean> anotherBeanSet;


    private Map<String, String> stringMap;
    private Map<String, AnotherBean> anotherBeanMap;

    private Properties properties;

    private AnotherBean anotherBean1;

    private AnotherBean anotherBean2;

    public void setAnotherBean1(AnotherBean anotherBean1) {
        this.anotherBean1 = anotherBean1;
    }

    public void setAnotherBean2(AnotherBean anotherBean2) {
        this.anotherBean2 = anotherBean2;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

    public void setStringList(List<String> stringList) {
        this.stringList = stringList;
    }

    public void setAnotherBeanList(List<AnotherBean> anotherBeanList) {
        this.anotherBeanList = anotherBeanList;
    }

    public void setStringSet(Set<String> stringSet) {
        this.stringSet = stringSet;
    }

    public void setAnotherBeanSet(Set<AnotherBean> anotherBeanSet) {
        this.anotherBeanSet = anotherBeanSet;
    }

    public void setStringMap(Map<String, String> stringMap) {
        this.stringMap = stringMap;
    }

    public void setAnotherBeanMap(Map<String, AnotherBean> anotherBeanMap) {
        this.anotherBeanMap = anotherBeanMap;
    }
}

```

```xml
<bean id="anotherBean" class="com.demo.ioc.AnotherBean"/>

<bean id="bean" class="com.demo.ioc.Bean">
    <property name="stringList">
        <list>
            <value>Tom</value>
            <value>Jack</value>
        </list>
    </property>

    <property name="anotherBeanList">
        <list>
            <ref bean="anotherBean"/>
            <ref bean="anotherBean"/>
        </list>
    </property>

    <property name="stringSet">
        <set>
            <value>Tom</value>
            <value>Jack</value>
        </set>
    </property>

    <property name="anotherBeanSet">
        <set>
            <ref bean="anotherBean"/>
            <ref bean="anotherBean"/>
        </set>
    </property>

    <property name="stringMap">
        <map>
            <entry key="name" value="Tom"/>
            <entry key="age" value="23"/>
        </map>
    </property>

    <property name="anotherBeanMap">
        <map>
           <entry key="name" value-ref="anotherBean"/>
           <entry key="age" value-ref="anotherBean"/>
        </map>
    </property>

    <property name="properties">
        <props>
            <prop key="name">Tom</prop>
        </props>
    </property>

    <property name="anotherBean1">
        <!-- null注入 -->
        <null/>
    </property>

    <property name="anotherBean2">
        <!-- 注入时创建内部Bean -->
        <bean class="com.demo.ioc.AnotherBean"/>
    </property>
</bean>
```

## Bean作用域

- singleton作用域（单例，限定在一个上下文环境中）
- prototype作用域（多例）
- Web环境作用域
    - request作用域
    - session作用域
    - application作用域
    - websocket作用域
- 自定义作用域
    - SimpleThreadScope作用域


```xml
<!-- 单例 默认singleton -->
<bean id="bean" class="com.demo.ioc.Bean"/>

<!-- 多例 -->
<bean id="bean" class="com.demo.ioc.Bean" scope="prototype"/>
```

总结

配置
```xml
<bean id="bean2" class="com.demo.ioc.Bean2" scope="prototype"/>

<bean id="bean1" class="com.demo.ioc.Bean1">
    <property name="bean2" ref="bean2"/>
</bean>
```
-|      Bean1-singleton | Bean1-prototype
-|-|-
Bean2-singleton| bean1单实例、bean2单实例 | bean1多实例、bean2单实例
Bean2-prototype| bean1单实例、bean2单实例 | bean1多实例、bean2多实例


## 方法注入
场景：
Bean1是singleton, Bean2是prototype, Bean1依赖于Bean2
我们希望每次调用Bean1某个方法时候，该方法每次拿到Bean2都是新的实例

```java
package com.demo.ioc;

public class Bean2 {

}

package com.demo.ioc;

public abstract class Bean1 {
    protected abstract Bean2 createBean2();
}

```

```xml
<bean id="bean2" class="com.demo.ioc.Bean2" scope="prototype"/>

<bean id="bean1" class="com.demo.ioc.Bean1" scope="singleton">
    <lookup-method name="createBean2" bean="bean2"/>
</bean>
```

## Web环境作用域
项目结构
```bash
$ tree
.
├── pom.xml
└── src
   └── main
      ├── java
      │   └── com
      │       └── demo
      │           ├── ApplicationController.java
      │           ├── RequestController.java
      │           └── SessionController.java
      ├── resources
      │   └── spring.xml
      └── webapp
          └── WEB-INF
              └── web.xml

```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>spring-mvc</groupId>
    <artifactId>com.demo</artifactId>
    <version>1.0-SNAPSHOT</version>
    <!--打包方式为war-->
    <packaging>war</packaging>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>5.1.3.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.1.3.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-web</artifactId>
            <version>5.1.3.RELEASE</version>
        </dependency>

        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.1.3.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

web.xml

```xml
<?xml version="1.0" encoding="utf-8" ?>

<web-app version="3.0"
         xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
         http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
>
    <!-- 建立SpringWeb上下文环境-->
    <servlet>
        <servlet-name>SpringServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring.xml</param-value>
        </init-param>
    </servlet>

    <servlet-mapping>
        <servlet-name>SpringServlet</servlet-name>
        <url-pattern>/*</url-pattern>
    </servlet-mapping>
</web-app>

```

RequestController.java

```java
package com.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RequestController {
    @RequestMapping("/request")
    @ResponseBody
    public String test(){
        return this.toString();
    }
}

```

SessionController.java

```java
package com.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class SessionController {
    @RequestMapping("/session")
    @ResponseBody
    public String test(){
        return this.toString();
    }
}

```

ApplicationController.java

```java
package com.demo;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class ApplicationController {
    @RequestMapping("/application")
    @ResponseBody
    public String test(){
        return this.toString();
    }
}

```
总结

reuqest：每个request请求都会创建一个单独的实例。

session：每个session都会创建一个单独的实例。

application：每个sercletContext都会创建一个单独的实例。

websocket：每个websocket链接都会创建一个单独的实例。

## 自定义作用域

双例模式

```java
package com.demo.ioc;


import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.config.Scope;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 自定义作用域
 * 实现双例模式（每一个Bean对应两个实例）
 */
public class MyScope implements Scope {
    Map<String, Object> map1 = new ConcurrentHashMap<>();
    Map<String, Object> map2 = new ConcurrentHashMap<>();

    @Override
    public Object get(String name, ObjectFactory<?> objectFactory) {
        //先从map1取
        if (!map1.containsKey(name)) {
            Object obj = objectFactory.getObject();
            map1.put(name, obj);
            return obj;
        }

        //再从map2取
        if (!map2.containsKey(name)) {
            Object obj = objectFactory.getObject();
            map2.put(name, obj);
            return obj;
        }

        // 如果map1和map2中都存在则随机返回
        int i = new Random().nextInt(2);
        if (i == 0) {
            return map1.get(name);
        } else {
            return map2.get(name);
        }
    }

    @Override
    public Object remove(String name) {
        // 和添加顺序正好相反

        if(map2.containsKey(name)){
            Object obj = map2.get(name);
            map2.remove(name);
            return obj;
        }

        if(map1.containsKey(name)){
            Object obj = map1.get(name);
            map1.remove(name);
            return obj;
        }

        return null;
    }

    @Override
    public void registerDestructionCallback(String name, Runnable callback) {

    }

    @Override
    public Object resolveContextualObject(String key) {
        return null;
    }

    @Override
    public String getConversationId() {
        return null;
    }
}

```

```java
package com.demo.ioc;

public class Bean {

}

```

```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:jee="http://www.springframework.org/schema/jee"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd
                        http://www.springframework.org/schema/jee
                        http://www.springframework.org/schema/jee/spring-jee.xsd">

    <bean id="myScope" class="com.demo.ioc.MyScope"/>

    <bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
        <property name="scopes">
            <map>
                <entry key="myScope" value-ref="myScope"/>
            </map>
        </property>
    </bean>

    <bean class="com.demo.ioc.Bean" id="bean" scope="myScope"/>
</beans>


```

测试
```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanTest {
    @Test
    public void testBean(){
        // 获取上下文
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

        for (int i = 0; i < 10; i++) {
            Bean bean = context.getBean("bean", Bean.class);
            System.out.println(bean);
        }
    }
}

```

## simpleThreadScope

每个线程都会创建一个单独的实例

```xml
<!--单线程中只有一个实例-->
<bean id="simpleThreadScope" class="org.springframework.context.support.SimpleThreadScope"/>

<bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
    <property name="scopes">
        <map>
            <entry key="simpleThreadScope" value-ref="simpleThreadScope"/>
        </map>
    </property>
</bean>

<bean class="com.demo.ioc.Bean" id="bean" scope="simpleThreadScope"/>
```

```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanTest {
    @Test
    public void testBean(){
        // 获取上下文
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

        for (int i = 0; i < 10; i++) {
            Bean bean = context.getBean("bean", Bean.class);
            System.out.println(bean);
        }

        for (int i = 0; i < 10; i++) {
            new Thread(new Runnable() {
                @Override
                public void run() {
                    Bean bean = context.getBean("bean", Bean.class);
                    System.out.println(bean);
                }
            }).start();
        }
    }
}

```

## Bean的懒加载

Spring容器会在创建容器时，提前初始化Singleton（单例）作用域的bean，
但是如果Bean被标注了lazy-init="true"，
则该Bean只有在其在被需要的时候才会被初始化。

注意：只对Singleton（单例）作用域的bean有效，其他作用域如多例并不知道什么这个bean才会被需要实例化。

为某个Bean设定为懒加载
```xml
<bean class="com.demo.ioc.Bean" id="bean" lazy-init="true"/>
```

为所有Bean设定为懒加载
```xml
<beans default-lazy-init="true">
    <bean class="com.demo.ioc.Bean" id="bean"/>
</beans>
```

适用场景

如果某个Bean在程序整个运行周期都可能不会被使用，那么可考虑设定该Bean为懒加载。

优点：尽可能的节省了资源。

缺点：可能会导致某个操作响应时间增加。


## Bean的初始化及销毁逻辑处理

1、如果需要在Bean实例化之后执行一些逻辑，有两种方法：

- 使用init-method属性

- 让Bean实现InitializingBean接口

2、如果需要在Bean销毁之前执行一些逻辑，有两种方法： 

- 使用destory-method属性

- 让Bean实现DisposableBean接口

3、通过指定方法名实现

```java
package com.demo.ioc;

public class Bean {

    public void onInit(){
        System.out.println("onInit");
    }

    public void onDestroy(){
        System.out.println("onDestroy");
    }

}

```

单个Bean初始化和销毁方法执行
```xml
<bean class="com.demo.ioc.Bean" id="bean" init-method="onInit" destroy-method="onDestroy"/>
```

所有Bean初始化和销毁方法执行
```xml
<beans 
       default-init-method="onInit"
       default-destroy-method="onDestroy"
>
    <bean class="com.demo.ioc.Bean" id="bean" />
</beans>
```

```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanTest {
    @Test
    public void testBean(){
        // 获取上下文
        AbstractApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        // 关闭上下文
        context.close();
    }
}

```

4、通过实现接口
```java
package com.demo.ioc;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

public class Bean implements InitializingBean, DisposableBean {

    @Override
    public void destroy() throws Exception {
        System.out.println("destroy");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("afterPropertiesSet");
    }
}

```

## Bean属性继承

```java
package com.demo.ioc;

public class Parent {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}


package com.demo.ioc;

public class Child1 extends Parent{
    private String name1;

    public String getName1() {
        return name1;
    }

    public void setName1(String name1) {
        this.name1 = name1;
    }

    @Override
    public String toString() {
        return "Child1{" +
                "name='" + getName() + '\'' +
                "name1='" + name1 + '\'' +
                '}';
    }
}


package com.demo.ioc;

public class Child2 extends Parent{
    private String name2;

    public String getName2() {
        return name2;
    }

    public void setName2(String name2) {
        this.name2 = name2;
    }

    @Override
    public String toString() {
        return "Child1{" +
                "name='" + getName() + '\'' +
                "name2='" + name2 + '\'' +
                '}';
    }
}

```

继承关系配置

```xml
<!-- 这个javaBean不需要实例化 -->
<bean id="parent" class="com.demo.ioc.Parent" abstract="true">
    <property name="name" value="name"/>
</bean>

<bean id="child1" class="com.demo.ioc.Child1" parent="parent">
    <property name="name1" value="name1"/>
</bean>

<bean id="child2" class="com.demo.ioc.Child2" parent="parent">
    <property name="name2" value="name1"/>
</bean>

```

或者非继承关系，有相同的属性
```xml
<bean id="parent" abstract="true">
    <property name="name" value="name"/>
</bean>

<bean id="child1" class="com.demo.ioc.Child1" parent="parent">
    <property name="name1" value="name1"/>
</bean>

<bean id="child2" class="com.demo.ioc.Child2" parent="parent">
    <property name="name2" value="name1"/>
</bean>
```


## SpringIoC注解的基本使用

pom.xml依赖
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.1.3.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>5.1.3.RELEASE</version>
</dependency>
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13</version>
    <scope>test</scope>
</dependency>

```

1、使用xml文件


```java
package com.demo.ioc;

public class Bean{
}

```

创建spring.xml配置文件
```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd"

>
    <!-- 将Bean交由Spring创建并管理 -->
    <bean id="bean" class="com.demo.ioc.Bean"/>

</beans>

```

获取Bean

```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class BeanTest {
    @Test
    public void testBean() {
        // 获取上下文
        ApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
        
        // 获取Bean
        Bean bean = context.getBean("bean", Bean.class);
        System.out.println(bean);

    }
}

```

2、使用annotation

```java
package com.demo.ioc;

public class Person {
}

```

```java
package com.demo.ioc.human;

import com.demo.ioc.Person;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// 创建配置文件
@Configuration
public class MyConfiguration {
    // 将Bean交由Spring创建并管理
    // name参数可以省略，默认方法名就是bean的名称
    @Bean(name = "person")
    public Person person(){
        return new Person();
    }
}

```

获取Bean
```java
package com.demo.ioc;

import com.demo.ioc.human.MyConfiguration;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class BeanTest {
    @Test
    public void testBean() {
        // 获取上下文
        ApplicationContext context =
                new AnnotationConfigApplicationContext(MyConfiguration.class);

        // 获取Bean
        Person bean = context.getBean("person", Person.class);
        System.out.println(bean);

    }
}

```

## 包扫描

1、xml方式
```xml
<?xml version="1.0" encoding="utf-8" ?>

<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                        http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd"

>
    <!--开启包扫描-->
    <context:component-scan base-package="com.demo.ioc"/>
</beans>

```

2、注解方式
```java
package com.demo.ioc;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

// 创建配置文件,可以认为是一个xml配置文件
@Configuration
// 设置需要扫描的包
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

}

```

```java
package com.demo.ioc;

import org.springframework.stereotype.Component;

// 增加注解后会被Spring扫描到, 默认的Id是类名首字母小写
@Component(value = "person")
public class Person {
}

```

注解
```java
@Component     // 通用型注解
@Controller    // Controller层
@Service       // Service层
@Repository    // Dao层
```

## Bean别名

xml形式
```xml
<bean id="person" name="person1, person2" class="com.demo.ioc.Person"/>
<alias name="person" alias="person3"/>
```

注解方式
```java
package com.demo.ioc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// 创建配置文件,可以认为是一个xml配置文件
@Configuration
public class MyConfiguration {
    @Bean(name = {"person1", "person2"})
    public Person person(){
        return new Person();
    }
}

```

## 通过注解注入Bean

- 通过方法注入Bean
    - 通过构造方法注入Bean
    - 通过Set方法注入Bean
- 通过属性注入Bean
- 集合类Bean类型注入
    - 直接注入集合实例
    - 将多个泛型的实例注入到集合
        - 将多个泛型实例注入到List
        - 控制泛型示实例在List中的顺序
        - 将多个泛型的实例注入到Map
- String、Integer等类型直接赋值
- SpringIoC容器内置接口示例注入


准备Bean
```java
package com.demo.ioc;

import org.springframework.stereotype.Component;

@Component
public class Cat {
}

package com.demo.ioc;

import org.springframework.stereotype.Component;

@Component
public class Dog {

}

package com.demo.ioc;

import org.springframework.stereotype.Component;

@Component
public class Pig {
}

```

配置文件

```java
package com.demo.ioc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// 创建配置文件,可以认为是一个xml配置文件
@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

    @Bean(name = "stringList")
    public List<String> stringList() {
        List<String> list = new ArrayList<>();
        list.add("Tom");
        list.add("Jack");
        return list;
    }

    // 此优先级高于 List<String>
    @Bean
    @Order(2) // 指定优先级
    public String string1(){
        return "string1";
    }

    @Bean
    @Order(1)
    public String string2(){
        return "string2";
    }

    @Bean
    public Map<String, Integer> stringIntegerMap(){
        Map<String, Integer> map = new HashMap<>();
        map.put("dog", 23);
        map.put("pig", 24);
        return map;
    }

    // 优先级高于 Map<String, Integer>
    @Bean
    public Integer integer1(){
        return 222;
    }

    @Bean
    public Integer integer2(){
        return 223;
    }
}

```

注入实例

```java
package com.demo.ioc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;


@Component
public class Person {
    private Dog dog;

    // 1、构造方法注入
    @Autowired
    public Person(Dog dog) {
        this.dog = dog;
    }

    private Cat cat;

    // 2、Set方法注入
    @Autowired
    public void setCat(Cat cat) {
        this.cat = cat;
    }

    // 3、通过属性注入
    @Autowired
    private Pig pig;

    private List<String> stringList;

    // 4、注入List类型
    @Autowired
    // 指定Bean的ID
    // @Qualifier(value = "stringList")
    public void setStringList(List<String> stringList) {
        this.stringList = stringList;
    }

    public List<String> getStringList() {
        return stringList;
    }

    // 5、Map类型注入
    private Map<String, Integer> stringIntegerMap;

    public Map<String, Integer> getStringIntegerMap() {
        return stringIntegerMap;
    }

    @Autowired
    public void setStringIntegerMap(Map<String, Integer> stringIntegerMap) {
        this.stringIntegerMap = stringIntegerMap;
    }


    private String name;

    // 6、String、Integer等类型直接赋值
    @Value("Tom") // 如果是Integer会自动转型
    public void setName(String name) {
        this.name = name;
    }

    // 7、容器内置接口注入
    private ApplicationContext context;

    @Autowired
    public void setContext(ApplicationContext context) {
        this.context = context;
    }

    public ApplicationContext getContext() {
        return context;
    }

    @Override
    public String toString() {
        return "Person{" +
                "dog=" + dog +
                ", cat=" + cat +
                ", pig=" + pig +
                ", stringList=" + stringList +
                ", stringIntegerMap=" + stringIntegerMap +
                ", name='" + name + '\'' +
                '}';
    }
}

```
测试
```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class BeanTest {
    @Test
    public void testBean() {
        // 获取上下文
        ApplicationContext context =
                new AnnotationConfigApplicationContext(MyConfiguration.class);

        // 获取Bean
        Person bean = context.getBean("person", Person.class);
        System.out.println(bean);
        System.out.println(bean.getStringList());
        System.out.println(bean.getStringIntegerMap());

        System.out.println(bean.getContext().getBean("cat"));

    }
}

```

测试输出
```
Person{dog=com.demo.ioc.Dog@441772e, 
    cat=com.demo.ioc.Cat@7334aada, 
    pig=com.demo.ioc.Pig@1d9b7cce, 
    stringList=[string2, string1], 
    stringIntegerMap={integer1=222, integer2=223}, 
    name='Tom'
}
[string2, string1]
{integer1=222, integer2=223}
com.demo.ioc.Cat@7334aada
```


## 通过注解设定Bean的作用域

1、Spring预定义作用域

xml形式
```xml
<bean id="bean" class="com.demo.ioc.Person" scope="singleton"/>
```

注解形式

```java
@Component
@Scope("singleton")  // prototype
public class Person {

}

// 或者

@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

    @Bean
    @Scope("singleton")
    public Person person() {
        return new Person();
    }
```


2、自定义Scope作用域

回忆之前的自定义Scope代码

```java
package com.demo.ioc;


import org.springframework.beans.factory.ObjectFactory;
import org.springframework.beans.factory.config.Scope;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 自定义作用域
 * 实现双例模式（每一个Bean对应两个实例）
 */
public class MyScope implements Scope {
    Map<String, Object> map1 = new ConcurrentHashMap<>();
    Map<String, Object> map2 = new ConcurrentHashMap<>();

    @Override
    public Object get(String name, ObjectFactory<?> objectFactory) {
        //先从map1取
        if (!map1.containsKey(name)) {
            Object obj = objectFactory.getObject();
            map1.put(name, obj);
            return obj;
        }

        //再从map2取
        if (!map2.containsKey(name)) {
            Object obj = objectFactory.getObject();
            map2.put(name, obj);
            return obj;
        }

        // 如果map1和map2中都存在则随机返回
        int i = new Random().nextInt(2);
        if (i == 0) {
            return map1.get(name);
        } else {
            return map2.get(name);
        }
    }

    @Override
    public Object remove(String name) {
        // 和添加顺序正好相反

        if(map2.containsKey(name)){
            Object obj = map2.get(name);
            map2.remove(name);
            return obj;
        }

        if(map1.containsKey(name)){
            Object obj = map1.get(name);
            map1.remove(name);
            return obj;
        }

        return null;
    }

    @Override
    public void registerDestructionCallback(String name, Runnable callback) {

    }

    @Override
    public Object resolveContextualObject(String key) {
        return null;
    }

    @Override
    public String getConversationId() {
        return null;
    }
}

```

xml形式

```xml
<!-- 1、将Scope交由Spring管理 -->
<bean id="myScope" class="com.demo.ioc.MyScope"/>

<!-- 2、配置 -->
<bean class="org.springframework.beans.factory.config.CustomScopeConfigurer">
    <property name="scopes">
        <map>
            <entry key="myScope" value-ref="myScope"/>
        </map>
    </property>
</bean>

<!-- 3、使用 -->
<bean class="com.demo.ioc.Bean" id="bean" scope="myScope"/>
```

注解形式

```java
package com.demo.ioc;

import org.springframework.beans.factory.config.CustomScopeConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

// 创建配置文件,可以认为是一个xml配置文件
@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

    // 1、交由Spring管理
    @Bean
    public MyScope myScope(){
        return new MyScope();
    }

    // 2、配置
    @Bean
    public CustomScopeConfigurer customScopeConfigurer(){
        CustomScopeConfigurer configurer = new CustomScopeConfigurer();
        configurer.addScope("myScope", myScope());
        return configurer;
    }

    // 3、使用
    @Bean
    @Scope("myScope")
    public Person person() {
        return new Person();
    }
}

```


测试
```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class BeanTest {
    @Test
    public void testBean() {
        // 获取上下文
        ApplicationContext context =
                new AnnotationConfigApplicationContext(MyConfiguration.class);

        // 获取Bean
        for (int i = 0; i < 10; i++) {
            Person bean = context.getBean("person", Person.class);
            System.out.println(bean);
        }
        
    }
}

```

## Bean注解的方式进行方法注入

回顾方法注入场景：
Bean1是singleton, Bean2是prototype, Bean1依赖于Bean2
我们希望每次调用Bean1某个方法时候，该方法每次拿到Bean2都是新的实例

```java
package com.demo.ioc;

public class Bean2 {

}

package com.demo.ioc;

public abstract class Bean1 {
    protected abstract Bean2 createBean2();
}

```

xml方式
```xml
<bean id="bean2" class="com.demo.ioc.Bean2" scope="prototype"/>

<bean id="bean1" class="com.demo.ioc.Bean1" scope="singleton">
    <lookup-method name="createBean2" bean="bean2"/>
</bean>
```

注解形式

```java
package com.demo.ioc;

@Component
@Scope("prototype")
public class Bean2 {

}

package com.demo.ioc;

@Component
public abstract class Bean1 {
    @Lookup
    protected abstract Bean2 createBean2();
}

```

## 通过注解开启Bean的懒加载

xml形式

```xml
<!-- 单个 -->
<bean class="com.demo.ioc.Bean" id="bean" lazy-init="true"/>

<!-- 全局 -->
<beans default-lazy-init="true"></beans>
```

注解形式

```java
/**
 * 单个
 */
@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

    @Bean
    @Lazy
    public Person person() {
        return new Person();
    }
}

// 或者

@Component
@Lazy
public class Person {

}


/**
 * 全局
 */
@Configuration
@ComponentScan(value = "com.demo.ioc")
@Lazy
public class MyConfiguration {

    @Bean
    public Person person() {
        return new Person();
    }
}
```

## 通过注解编写Bean初始化及销毁

配置文件

```java
package com.demo.ioc;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

// 创建配置文件,可以认为是一个xml配置文件
@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

}

```

上下文测试
```java
package com.demo.ioc;

import org.junit.Test;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.support.AbstractApplicationContext;

public class BeanTest {
    @Test
    public void testBean() {
        // 获取上下文
        AbstractApplicationContext context =
                new AnnotationConfigApplicationContext(MyConfiguration.class);

        Person bean = context.getBean("person", Person.class);

        context.close();
    }
}

```

方式一：

```java
package com.demo.ioc;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Component;


@Component
public class Person implements InitializingBean, DisposableBean {

    @Override
    public void destroy() throws Exception {
        System.out.println("Person.destroy");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("Person.afterPropertiesSet");
    }
}

```

方式二：

```java
package com.demo.ioc;

import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;


@Component
public class Person {
    @PostConstruct
    public void onInit(){
        System.out.println("Person.onInit");
    }

    @PreDestroy
    public void onDestroy(){
        System.out.println("Person.onDestroy");
    }
}

```

方式三
```java
package com.demo.ioc;

public class Person {

    public void onInit() {
        System.out.println("Person.onInit");
    }


    public void onDestroy() {
        System.out.println("Person.onDestroy");
    }
}

```

通过Bean设置参数

```java
package com.demo.ioc;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;


@Configuration
@ComponentScan(value = "com.demo.ioc")
public class MyConfiguration {

    @Bean(initMethod = "onInit", destroyMethod = "onDestroy")
    public Person person() {
        return new Person();
    }
}

```