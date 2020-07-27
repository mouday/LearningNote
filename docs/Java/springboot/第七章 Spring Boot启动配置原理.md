# 第七章 Spring Boot 启动配置原理

启动原理，运行流程，自动配置原理

run()

- 准备环境

  - 执行 ApplicationContextInitializer.initialize()
  - 监听器 SpringApplicationRunListener 回调 contextPrepared
  - 加载主配置类定义信息
  - 监听器 SpringApplicationRunListener 回调 contextLoaded

- 刷新启动 ICO 容器
  扫描加载所有容器中的组件
  包括从 META-INF/spring.factories 中获取所有 EnableAutoConfiguration 组件

回调容器中所有的 ApplicationRunner/CommandLineRunner 的 run 方法
监听器 SpringApplicationRunListener 回调 finished

## 监听器配置示例

配置目录：

```
src/main/java/com/example/demo/listener/
  - MyApplicationContextInitializer.java
  - MySpringApplicationRunListener.java
  - MyApplicationRunner.java
  - MyCommandLineRunner.java
```

实现类

```java
package com.example.demo.listener;

import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;

public class MyApplicationContextInitializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        System.out.println("MyApplicationContextInitializer initialize" + applicationContext);
    }
}

```

```java
package com.example.demo.listener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.SpringApplicationRunListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;

public class MySpringApplicationRunListener implements SpringApplicationRunListener {
    public MySpringApplicationRunListener(SpringApplication application, String[] args) {
    }

    @Override
    public void starting() {
        System.out.println("MySpringApplicationRunListener starting");
    }

    @Override
    public void environmentPrepared(ConfigurableEnvironment environment) {
        Object name = environment.getSystemProperties().get("os.name");
        System.out.println("environmentPrepared" + name);
    }

    @Override
    public void contextPrepared(ConfigurableApplicationContext context) {
        System.out.println("contextPrepared");
    }

    @Override
    public void contextLoaded(ConfigurableApplicationContext context) {
        System.out.println("contextLoaded");
    }

    @Override
    public void started(ConfigurableApplicationContext context) {
        System.out.println("started");
    }

    @Override
    public void failed(ConfigurableApplicationContext context, Throwable exception) {
        System.out.println("failed");
    }

    @Override
    public void running(ConfigurableApplicationContext context) {
        System.out.println("running");
    }
}

```

```java
package com.example.demo.listener;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;


@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("MyApplicationRunner");
    }
}

```

```java
package com.example.demo.listener;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;


@Component
public class MyApplicationRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) throws Exception {
        System.out.println("MyApplicationRunner");
    }
}

```

src/main/resources/META-INF/spring.factories

```
org.springframework.boot.SpringApplicationRunListener=\
com.example.demo.listener.MySpringApplicationRunListener

org.springframework.context.ApplicationContextInitializer=\
com.example.demo.listener.MyApplicationContextInitializer

```
