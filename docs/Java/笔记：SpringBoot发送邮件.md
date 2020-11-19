# SpringBoot发送邮件

## 课程目录

1、第一部分 背景
- 使用场景
- 发送原理
- 发送历史
- SpringBoot介绍
- 前置知识

2、第二部分 实践
- 文本邮件
- HTML邮件
- 附件邮件
- 图片邮件
- 邮件模板
- 邮件系统

## 第一部分 背景

1、邮件使用场景
- 注册验证
- 网站营销
- 安全防线
- 提醒监控
- 触发机制

2、邮件发送原理
- SMPTP协议 发送协议
- POP3协议 接收协议
- IMAP协议 对POP3补充
- Mime协议 

3、邮件发送历史
- 1969年10月世界第一封
- 1987年9月14日中国第一封

4、SpringBoot介绍
- 约定大于配置
- 简单快速开发
- 强大生态链

5、前置知识
- Spring 
- Maven 
- HTML 
- Thymeleaf

## 第二部分 实践

1、学习路径

- 基础配置
- 文本邮件
- HTML邮件
- 附件邮件
- 图片邮件
- 邮件模板
- 异常处理
- 邮件系统

2、环境配置

初始化SpringBoot项目
https://start.spring.io/

版本：2.3.5.RELEASE

Service示例

```java
package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class HelloService {
    public void sayHello(){
        System.out.println("Hello");
    }
}

```

测试类
```java
package com.example.demo;

import com.example.demo.service.HelloService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class DemoApplicationTests {
    @Autowired
    HelloService helloService;

    @Test
    void sayHelloTest() {
        helloService.sayHello();
    }

}

```

3、项目配置

- 引入jar包
```xml
<!-- 邮件 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- 模板引擎 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

- 配置邮箱参数
```bash
spring.mail.host=smtp.163.com
spring.mail.username=username@163.com
# 户端授权码
spring.mail.password=password
spring.mail.default-encoding=UTF-8

```

4、发送邮件

- 封装SimpleMailMessage
- JavaMailSender进行发送

```java
package com.example.demo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;

@Service
public class MailService {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Value("${spring.mail.username}")
    private String fromUser;

    @Autowired
    private JavaMailSender mailSender;

    /**
     * 文本邮件
     *
     * @param toUser
     * @param subject
     * @param content
     */
    public void sendSimpleMail(
            String toUser, String subject,
            String content) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromUser);
        message.setTo(toUser);
        message.setSubject(subject);
        message.setText(content);

        mailSender.send(message);

    }

    /**
     * html邮件
     *
     * @param toUser
     * @param subject
     * @param content
     */
    public void sendHtmlMail(
            String toUser, String subject,
            String content) {

        logger.info("html邮件开始：{} {} {}", toUser, subject, content);

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = null;

        try {
            helper = new MimeMessageHelper(message, true);
            helper.setFrom(fromUser);
            helper.setTo(toUser);
            helper.setSubject(subject);
            helper.setText(content, true);

            mailSender.send(message);

            logger.info("html邮件成功");

        } catch (MessagingException e) {
            e.printStackTrace();
            logger.error("html邮件失败：", e);

        }

    }

    /**
     * 附件邮件
     *
     * @param toUser
     * @param subject
     * @param content
     * @param filePath 绝对路径
     * @throws MessagingException
     */
    public void sendAttachmentsMail(
            String toUser, String subject,
            String content, String filePath)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromUser);
        helper.setTo(toUser);
        helper.setSubject(subject);
        helper.setText(content, true);

        FileSystemResource file = new FileSystemResource(new File(filePath));

        // 可以多次添加附件
        helper.addAttachment(file.getFilename(), file);

        mailSender.send(message);
    }

    /**
     * 图片邮件
     *
     * @param toUser
     * @param subject
     * @param content
     * @param resourcePath
     * @param resourceId
     * @throws MessagingException
     */
    public void sendInlineResourceMail(
            String toUser, String subject,
            String content, String resourcePath, String resourceId)
            throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(fromUser);
        helper.setTo(toUser);
        helper.setSubject(subject);
        helper.setText(content, true);

        FileSystemResource resource = new FileSystemResource(new File(resourcePath));

        // 可以多次添加图片
        helper.addInline(resourceId, resource);

        mailSender.send(message);
    }
}

```

- 发送测试

```java
package com.example.demo;

import com.example.demo.service.MailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import java.io.IOException;

@SpringBootTest
class DemoApplicationTests {
    @Autowired
    MailService mailService;

    @Autowired
    TemplateEngine templateEngine;

    @Test
    void sendSimpleMailTest() {
        mailService.sendSimpleMail(
                "pengshiyuyx@163.com",
                "文本邮件标题",
                "邮件内容"
        );
    }

    @Test
    void sendHtmlMailTest() {
        String content = "<html>" +
                "<body>" +
                "<h3>这是邮件内容</h3>" +
                "</body>" +
                "</html>";
        mailService.sendHtmlMail(
                "pengshiyuyx@163.com",
                "HTML邮件标题",
                content
        );
    }

    @Test
    void sendAttachmentsMailTest() throws MessagingException, IOException {
        String filePath = "name.txt";

        ClassPathResource resource = new ClassPathResource(filePath);

        mailService.sendAttachmentsMail(
                "pengshiyuyx@163.com",
                "附件邮件标题",
                "邮件内容",
                resource.getFile().getAbsolutePath()
        );
    }

    @Test
    void sendInlineResourceMailTest() throws IOException, MessagingException {
        String imagePath = "demo.jpg";
        String resourceId = "image001";
        String content = "<html>" +
                "<body>" +
                "<h3>这是邮件内容</h3>" +
                "<img src='cid:" + resourceId + "'>" +
                "</body>" +
                "</html>";

        ClassPathResource resource = new ClassPathResource(imagePath);

        mailService.sendInlineResourceMail(
                "pengshiyuyx@163.com",
                "图片邮件标题",
                content,
                resource.getFile().getAbsolutePath(),
                resourceId
        );
    }


    @Test
    void sendTemplateMailTest() {
        Context content = new Context();
        content.setVariable("id", "007");
        String mailContent = templateEngine.process("mail", content);

        mailService.sendHtmlMail(
                "pengshiyuyx@163.com",
                "模板邮件标题",
                mailContent
        );
    }


}


```

模板
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="https://www.thymeleaf.org/">
<head>
    <meta charset="UTF-8"/>
    <title>Title</title>
</head>
<body>
    <p>感谢注册</p>
    <p><a href="" th:href="@{https://www.baidu.com/{id}(id=${id})}">点击激活</a></p>
</body>
</html>
```

常见错误
- 421 HL:ICC 该IP同事并发连接数过大
- 451 Requested mail action not taken: too much fail
登录失败次数过多，被临时禁止登录
- 553 authentication is required 认证失败

更多错误
http://help.163.com/09/1224/17/5RAJ4LMH00753VB8.html

## 邮件系统
- 独立微服务MQ
- 异常处理
- 定时重试邮件
- 异步发送

## 总结
- 邮件发送历史和原理
- SpringBoot 和邮件系统
- 各种类型邮件的发送
- 邮件系统




