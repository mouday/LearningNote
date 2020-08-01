# 第十五章-SpringBoot 与部署

方式一：spring-loaded
-javaagent:springloaded.jar -noverify

方式二：JRebel 收费

方式三：springboot devtools
依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

保存后需要重新编译
