# 第十二章-SpringBoot 与任务

## 异步任务

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // 开启异步任务
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}

```

```java
package com.example.demo.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncService {

    @Async // 异步任务
    public void task(){

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("task success");

    }
}

```

```java
package com.example.demo.controller;

import com.example.demo.service.AsyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AsyncController {

    @Autowired
    AsyncService asyncService;

    @GetMapping("/task")
    public String task(){
        asyncService.task();
        return "success";
    }
}

```

## 定时任务

@EnableScheduling
@Scheduled

Cron 表达式

| 字段 | 允许值                 | 允许的字符 |
| ---- | ---------------------- | ---------- |
| 秒   | 0-59                   | ,-\*/      |
| 分   | 0-59                   | ,-\*/      |
| 时   | 0-23                   | ,-\*/      |
| 日   | 0-31                   | ,-\*/?LWC  |
| 月   | 0-12                   | ,-\*/      |
| 周   | 0-7 或 SUN-SAT 0,7=SUN | ,-\*/?LC#  |

特殊字符含义

```
,  枚举
-  区间
*  任意
/  步长
?  日/星期冲突匹配
L 最后
W 工作日
C 和Calendar联系后计算过的值
# 星期，4#2 第2个星期四
```

Cron 示例

```bash
# 秒 分 时 日 月 周
0 0/5 14,18 * * ?  # 每天14点和18点整，每隔5分钟执行一次
0 15 10 ？ * 1-6   # 每个月的周一至周六，10:15执行一次
0 0 2 ? * 6L       # 每个月的最后一个周六凌晨2点执行一次
0 0 2 LW * ?       # 每隔月的最后一个工作日凌晨2点执行一次
0 0 2-4 ? * 1#1    # 每个月的第一个周一凌晨2点到4点，每个整点执行一次
```

```java

@EnableScheduling // 开启定时任务
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

```java
package com.example.demo.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduleService {

    /**
     * second, minute, hour, day of month, month, day of week.
     */
    @Scheduled(cron = "0 * * * * MON-FRI")
    public void task(){
        System.out.println("run task");
    }
}

```

## 发送邮件

增加依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

配置账号信息

```yaml
spring:
  # 163邮箱发送邮件
  mail:
    host: smtp.163.com
    port: 25
    username: xxx@163.com
    password: xxx
```

发送邮件

```java
package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@SpringBootTest
public class MailTest {

    @Autowired
    private JavaMailSenderImpl mailSender;

    // 发送简单邮件
    @Test
    public void testSimpleMail(){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setSubject("邮件主题");
        message.setText("邮件内容");

        message.setFrom("xxx@163.com");
        message.setTo("xxx@qq.com");

        mailSender.send(message);
    }

    // 发送复杂邮件
    @Test
    public void testMail() throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setSubject("邮件主题");
        helper.setText("<span style='color:red;'>邮件内容</span>", true);

        helper.setFrom("xxx@163.com");
        helper.setTo("xxx@qq.com");

        // 上传文件
        helper.addAttachment("timg.jpeg", new File("timg.jpeg"));

        mailSender.send(mimeMessage);
    }
}


```
