# 第十四章-SpringBoot 与分布式

## Dubbo 简介

分布式应用，国内常用组合 Zookeeper + Dubbo
SpringBoot 使用 SpringCloud

Zookeeper 分布式应用程序协调服务
Dubbo Alibaba 开源的分布式服务框架，服务提供方 Provider+ 服务消费方 Consumer

安装 zookeeper

```bash
docker pull zookeeper

# EXPOSE 2181 2888 3888 8080
docker run --name zk01 -p 2181:2181 --restart always -d zookeeper
```

创建一个空工程，两个 spring-web 模块

```
provider-ticket
consumer-ticket
```

1、将服务提供者注册到注册中心
2、引入 dubbo 和 zkclient 依赖
3、配置 dubbo 的扫描包和注册中心地址
4、使用@Service 发布服务

https://github.com/alibaba/dubbo-spring-boot-starter

### provider-ticket 提供者

引入依赖 pom.xml

```xml
<dependency>
    <groupId>com.alibaba.spring.boot</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.0.0</version>
</dependency>

<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.9</version>
</dependency>
```

配置 application.properties

```bash
spring.dubbo.application.name=privoder-ticket
spring.dubbo.server=true

#注册中心地址
spring.dubbo.registry.address=zookeeper://127.0.0.1:2181

spring.dubbo.scan=com.example.ticket.service
```

服务接口

```java
package com.example.ticket.service;

public interface TicketService {
    public String getTicket();
}

```

发布服务实现

```java
package com.example.ticket.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.example.ticket.service.TicketService;
import org.springframework.stereotype.Component;

@Component
@Service // 发布服务
public class TicketServiceImpl implements TicketService {
    @Override
    public String getTicket() {
        return "门票";
    }
}

```

开启配置可用

```java
package com.example.ticket;

import com.alibaba.dubbo.spring.boot.annotation.EnableDubboConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableDubboConfiguration
@SpringBootApplication
public class ProviderTicketApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderTicketApplication.class, args);
    }

}

```

### consumer-ticket 消费者

引入依赖

```xml
<dependency>
    <groupId>com.alibaba.spring.boot</groupId>
    <artifactId>dubbo-spring-boot-starter</artifactId>
    <version>2.0.0</version>
</dependency>

<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.9</version>
</dependency>

```

配置 application.properties

```bash
spring.dubbo.application.name=consumer-ticket

#注册中心地址
spring.dubbo.registry.address=zookeeper://127.0.0.1:2181
```

暴露接口

```java
package com.example.ticket.service;

public interface TicketService {
    public String getTicket();
}

```

用户服务接口

```java
package com.example.ticket.service;

public interface UserService {
    public String getTicket();
}

```

用户服务实现

```java
package com.example.ticket.impl;

import com.alibaba.dubbo.config.annotation.Reference;
import com.example.ticket.service.TicketService;
import com.example.ticket.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Reference
    TicketService ticketService;

    @Override
    public String getTicket() {
        return ticketService.getTicket();
    }
}

```

开启配置可用

```java
package com.example.ticket;

import com.alibaba.dubbo.spring.boot.annotation.EnableDubboConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableDubboConfiguration
@SpringBootApplication
public class ConsumerTicketApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsumerTicketApplication.class, args);
    }

}

```

测试

```java
package com.example.ticket;

import com.example.ticket.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ConsumerTicketApplicationTests {

    @Autowired
    UserService userService;

    @Test
    void contextLoads() {
        String ticket = userService.getTicket();
        System.out.println(ticket);
    }

}

```

## SpringCloud-Eureka 注册中心

SpringCloud 是一个分布式的整体解决方案

5 大常用组件

- 服务发现 Netflix Eureka
- 客户端负载均衡 Netflix Ribbon
- 断路器 Netflix Hystrix
- 服务网关 Netflix Zuul
- 分布式配置 Spring Cloud Config

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>eureka-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>eureka-demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>Hoxton.SR6</spring-cloud.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

application.properties

```bash

server.port=8761

#eureka主机名
eureka.instance.hostname=eureka-server

# 不把自己注册在eureka上
eureka.client.register-with-eureka=false

# 不从eureka上获取服务注册信息
eureka.client.fetch-registry=false

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

```java
package com.example.eurekademo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * 注册中心
 * http://localhost:8761/
 */
@EnableEurekaServer  // 启用注册中心
@SpringBootApplication
public class EurekaDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaDemoApplication.class, args);
    }

}

```

启用注册中心：http://localhost:8761/

## 服务注册(服务提供者)

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.3.2.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.example</groupId>
    <artifactId>provider-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>provider-demo</name>
    <description>Demo project for Spring Boot</description>

    <properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>Hoxton.SR6</spring-cloud.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
            <exclusions>
                <exclusion>
                    <groupId>org.junit.vintage</groupId>
                    <artifactId>junit-vintage-engine</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>

```

application.properties

```bash
server.port=8002
spring.application.name=provider-demo

#注册服务的时候使用ip地址
eureka.instance.prefer-ip-address=true

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

```java
package com.example.providerdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 服务提供者
 */
@SpringBootApplication
public class ProviderDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProviderDemoApplication.class, args);
    }

}

```

服务

```java
package com.example.providerdemo.service;

import org.springframework.stereotype.Service;

@Service
public class TicketService {
    public String getTicket(){
        return "电影票8001";
        // return "电影票8002";
    }
}

```

接口

```java
package com.example.providerdemo.controller;

import com.example.providerdemo.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TicketController {
    @Autowired
    TicketService ticketService;

    @GetMapping("/ticket")
    public String getTicket(){
        return ticketService.getTicket();
    }
}

```

## 服务发现&服务消费者

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
    https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.2.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.example</groupId>
	<artifactId>consumer-demo</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>consumer-demo</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>1.8</java.version>
		<spring-cloud.version>Hoxton.SR6</spring-cloud.version>
	</properties>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.cloud</groupId>
			<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
			<exclusions>
				<exclusion>
					<groupId>org.junit.vintage</groupId>
					<artifactId>junit-vintage-engine</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
	</dependencies>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.cloud</groupId>
				<artifactId>spring-cloud-dependencies</artifactId>
				<version>${spring-cloud.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

application.properties

```bash
server.port=8200
spring.application.name=consumer-demo

#注册服务的时候使用ip地址
eureka.instance.prefer-ip-address=true

eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

```java
package com.example.consumerdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

/**
 * 服务消费者
 */
@EnableDiscoveryClient // 开启服务发现
@SpringBootApplication
public class ConsumerDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ConsumerDemoApplication.class, args);
	}

	@LoadBalanced // 开启负载均衡机制
	@Bean
	public RestTemplate restTemplate(){
		return new RestTemplate();
	}
}

```

```java
package com.example.consumerdemo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class UserController {

    @Autowired
    RestTemplate restTemplate;

    @GetMapping("buy")
    public String getTicket(){
        String ticket = restTemplate.getForObject("http://PROVIDER-DEMO/ticket", String.class);
        return "buy" + ticket;
    }
}

```
