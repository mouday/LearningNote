# 第九章 Spring Boot 与缓存

主要内容

```
JSR-107
Spring 缓存抽象
整合 Redis
```

## 1、JSR-107

Java Caching 定义了 5 个核心接口

```
CachingProvider：管理多个CacheManager
CacheManager：管理多个Cache
Cache：类似Map数据结构
Entry：存储在Cache中的key-value对
Expiry： 有效期
```

```
Application
    - CachingProvider
        - CacheManager
            - Cache
                Entry <-> Expiry
```

## Spring 缓存抽象简介

重要概念

```
Cache 缓存接口，实现 RedisCache、EhCacheCache、ConcurrentMapCache
CacheManager 缓存管理器
@Cacheable 根据方法请求参数，对结果进行缓存
@CacheEvict 清空缓存
@CachePut 保证方法被调用，又希望结果被缓存
@EnableCaching 开启基于注解的缓存
keyGenerator 缓存数据时 key 的生成策略
serialize 缓存数据时 value 序列化策略
```

1、搭建环境
引入 Spring 依赖

```
Cache
Web
MySQL
MyBatis
```

- 导入数据库文件，创建出 employee 和 department 表
- 创建 javabean 封装数据
- 整合 MyBatis 操作数据库
  - 配置数据源信息
  - 使用注解版 MyBatis
  - @MapperScan 指定需要扫描的 Mapper 接口所在包

2、使用缓存

- 开启基于注解的缓存 @EnableCaching
- 标注缓存注解 @Cacheable

## @Cacheable

SpEL

```
methodName 方法名
method 方法
target 目标对象
targetClass 目标对象类
args 参数列表
caches 缓存列表
argumentname 参数名
result 返回值
```

参数

```
value 缓存组件名
key 缓存使用的key, 默认使用方法参数值
keyGenerator 指定key的生成器，和key二选一
cacheManager 缓存管理器
cacheResolver 缓存解析器 和缓存管理器二选一
condition 缓存条件 eg: #id>0
unless 否定缓存 条件为true不缓存
sync 使用同步
```

## 缓存工作原理

自动配置类
CacheAutoConfiguration

```
GenericCacheConfiguration"
JCacheCacheConfiguration"
EhCacheCacheConfiguration"
HazelcastCacheConfiguration"
InfinispanCacheConfiguration"
CouchbaseCacheConfiguration"
RedisCacheConfiguration"
CaffeineCacheConfiguration"
SimpleCacheConfiguration"
NoOpCacheConfiguration"
```

默认使用 SimpleCacheConfiguration

cacheManager：ConcurrentMapCacheManager

运行流程：

1. 执行方法之前，先按照 cacheNames 获取 Cache 缓存组件，暗
   第一次获取缓存如果没有 cache 组件就创建
2. 按照某种策略生成 key，查抄内容
3. 没有查找到缓存就调用目标方法
4. 目标方法换回的结果放进缓存中

SimpleKeyGenerator 默认策略

- 如果没有参数 key = new SimpleKey()
- 如果有一个参数 key = 参数值
- 如果有多个参数 key - new SimpleKey(params)

核心：

- 获取 CacheManger(默认 ConcurrentMapCacheManager)
- 使用 KeyGenerator 生成 key 默认 SimpleKeyGenerator

自定义 key 的生成方式

```java
package com.example.demo.config;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Method;
import java.util.Arrays;

@Configuration
public class MyCacheConfig {
    @Bean("myKeyGenerator")
    public KeyGenerator keyGenerator(){
        return new KeyGenerator(){
            @Override
            public Object generate(Object target, Method method, Object... params) {
                System.out.println("generate");
                return method.getName() + "[" + Arrays.asList(params).toString()+ "]";
            }
        };
    }
}

```

```java

// keyGenerator和key二选一

// key 支持SpEL表达式
@Cacheable(value = "department", key = "#id")
public Department getById(Integer id){
    return departmentMapper.getById(id);
}

// keyGenerator
@Cacheable(value = "department", keyGenerator = "myKeyGenerator")
public Department getById(Integer id){
    return departmentMapper.getById(id);
}
```

## @CachePut

@CachePut 既调用方法，又更新缓存数据
修改了数据库的某个数据，同时更新缓存
运行时机：先调用目标方法，再将方法的结果缓存

```java
@CachePut(value = "department", key="#department.id")
public Department update(Department department){
    departmentMapper.update(department);
    return department;
}
```

## @CacheEvict

@CacheEvict 缓存删除

参数

```
key 清除指定缓存
allEntries  清除所有缓存
beforeInvocation 清除缓存在方法运行之前执行 默认false=方法之后执行
```

```java
// 清除单个缓存
@CacheEvict(value = "department", key="#id")
public String  delete(Integer id){
    return "success";
}

// 清除所有缓存
@CacheEvict(value = "department", allEntries = true)
    public String  deleteAllCache(){
        return "success";
    }
```

## @Caching&@CacheConfig

```java
public @interface Caching {

	Cacheable[] cacheable() default {};

	CachePut[] put() default {};

	CacheEvict[] evict() default {};

}
```

CacheConfig 抽取缓存公共配置

```java
@CacheConfig(cacheNames={"department"})
@Service
public class DepartmentService {

    @Autowired
    private DepartmentMapper departmentMapper;

    // 缓存数据
    @Cacheable(key = "#id")
    public Department getById(Integer id){
        return departmentMapper.getById(id);
    }
}
```

## 搭建 redis 环境&测试

本机安装

```bash
# 启动
$ redis-server

# 停止本机redis
$ redid-cli shutdown
```

可以使用 Docker 方式安装

https://hub.docker.com/

```bash
# 安装
docker pull redis

# 启动
docker run  -d -p 6379:6379  --name my-redis redis

# 查看运行状态
docker ps
```

Redis 命令
http://www.redis.cn/commands.html

## RedisTemplate&序列化机制

引入依赖

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

指定 redis 地址

```yaml
spring:
  redis:
    host: localhost
```

redis 常见 5 中数据类型

```
String 字符串
List 列表
Set 集合
Hash 散列
ZSet 有序集合
```

测试使用

```java
package com.example.demo;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;

@SpringBootTest
public class RedisTest {

    // k-v字符串形式
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // k-v对象形式
    @Autowired
    private RedisTemplate redisTemplate;


    @Test
    public void testRedis(){
        stringRedisTemplate.opsForValue().set("name", "Tom");
        String name = stringRedisTemplate.opsForValue().get("name");
        System.out.println(name);
    }
}

```

保存对象：序列化后再保存
1、手动转换数据为 json
2、自定义序列化规则

```java
package com.example.demo.config;

import com.example.demo.pojo.Employee;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;

@Configuration
public class MyRedisConfig {
    @Bean
    public RedisTemplate<Object, Employee> employeeRedisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<Object, Employee> redisTemplate = new RedisTemplate<Object, Employee>();
        redisTemplate.setConnectionFactory(factory);

        // 设置序列化器
        Jackson2JsonRedisSerializer<Employee> serializer = new Jackson2JsonRedisSerializer<>(Employee.class);
        redisTemplate.setDefaultSerializer(serializer);
        return redisTemplate;
    }
}

```

测试

```java
package com.example.demo;

import com.example.demo.pojo.Employee;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;


@SpringBootTest
public class RedisTest {

    @Autowired
    RedisTemplate<Object, Employee> employeeRedisTemplate;

    @Test
    public void testRedisSerializer(){
        Employee employee = new Employee();
        employee.setName("Tom");
        employee.setAge(23);
        employeeRedisTemplate.opsForValue().set("emp", employee);
    }

}

```

引入 redis-starter 之后，缓存组件使用 RedisCache

利用序列化保存数据，都是以 Object 形式保存，默认使用 jdk 序列化机制
可以保存为 json
