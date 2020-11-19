## 数据一致性

安全感
单一数据源Single Source Of Truth
低耦合，高内聚

一致性问题：
发生在【多个主体】对【同一份数据】无法达成共识
包括：分布式一致性问题，并发问题

一致性问题解决办法(额外开销)
排队：锁、互斥锁、管程、锁障
投票：Paxos、Raft

避免：ThreadLocal

重视本质

代码是写出来是为了阅读，偶尔用于执行

## ThreadLocal
定义：提供【线程局部】变量，一个线程局部变量在多个线程中，分别有独立的值（副本）
特点：简单、快速、线程安全
场景：多线程场景（资源持有、线程一致性、并发计算、线程安全）
实现：Java中用哈希表实现
应用范围：几乎所有提供多线程特征的语言

## ThreadLocal基本API
```java
构造函数  ThreadLocal<T>()
初始化    initialValue()
访问器    get/set
回收      remove
```

示例

构造函数

```java
public class ThreadLocalDemo {
    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();

    public static void main(String[] args) {
        System.out.println(threadLocal.get());
        // null

        threadLocal.set(100L);
        System.out.println(threadLocal.get());
        // 100
    }
}

```

初始化

```java
public static ThreadLocal<Long> threadLocal = new ThreadLocal(){
        @Override
        protected Long initialValue() {
            return 100L;
        }
    };
```

多线程示例

```java
package com.demo.threadlocal;

public class ThreadLocalDemo {

    public static ThreadLocal<Long> threadLocal = new ThreadLocal() {
        @Override
        protected Long initialValue() {
            return Thread.currentThread().getId();
        }
    };


    public static void main(String[] args) {
        new Thread() {
            @Override
            public void run() {
                System.out.println("thread: " + threadLocal.get());
                // thread: 11
            }
        }.start();

        System.out.println("main: " + threadLocal.get());
        // main: 1
        
        threadLocal.set(100L);

        System.out.println("main: " + threadLocal.get());
        // main: 100

        threadLocal.remove();

        System.out.println("main: " + threadLocal.get());
        // main: 1

    }
}

```

总结
资源持有：持有线程资源供线程的各个部分使用，全局获取，减少编程难度
线程一致性：帮助需要保持线程一致的资源（如：数据库事务），维护一致性，降低编程难度
并发计算：帮助分布式计算场景的各个线程累计局部计算结果
线程安全：帮助只考虑了单线程的程序库，无缝向多线程场景迁移

## 并发场景分析

例1：200QPS压测统计接口
观察：Spring框架的执行情况
目标：理解并发，竞争条件，临界区等概念
代表场景：交易

Spring代码
```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}

```

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatController {
    static Integer count = 0;

    @RequestMapping("/stat")
    public Integer stat(){
        return count;
    }

    @RequestMapping("/add")
    public Integer add(){
        count++;
        return count;
    }

}

```
apache2-utils压力测试工具

参考
Mac下的Web性能压力测试工具:ab(ApacheBench)
https://www.cnblogs.com/liuyu2014/p/11855681.html

Mac下自带apache
```bash
查看版本号
$apachectl -v

$ ab -V

使用方式
$ ab -n 请求数 -c 并发数  URL

eg:
$ ab -n 10000 -c 1 localhost:8080/add
$ curl localhost:8080/stat
10000


$ ab -n 10000 -c 10 localhost:8080/add
$ curl localhost:8080/stat
9250
```

分析：
```
理想情况：
a=0
A:read(a) -> A:write(a+1)  a=1
B:read(a) -> B:write(a+1)  a=2 

并发情况
a=0
A:read(a) -> B:read(a) -> A:write(a+1) -> B:write(a+1) a=1
 
```
并发：多个程序同时执行
竞争条件：多个进程（线程）同时访问同一个内存资源，最终的执行结果依赖于多个进程执行时的精准时序
临界区：访问共享内存的程序片段


1、让add方法增加延迟

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatController {
    static Integer count = 0;

    @RequestMapping("/stat")
    public Integer stat(){
        return count;
    }

    @RequestMapping("/add")
    public Integer add() throws InterruptedException {
        Thread.sleep(100L);
        count++;
        return count;
    }

}

```

```bash
$ ab -n 10000 -c 100 localhost:8080/add
$ curl localhost:8080/stat
9097
```

2、加锁测试

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatController {
    static Integer count = 0;

    @RequestMapping("/stat")
    public Integer stat(){
        return count;
    }

    @RequestMapping("/add")
    public Integer add() throws InterruptedException {
        // Thread.sleep(100L);
        // count++;
        __add();
        return count;
    }

    synchronized void __add() throws InterruptedException {
        Thread.sleep(100L);
        count++;
    }

}

```

如果10000个请求会很慢，所以减少请求次数测试
```bash
$ ab -n 100 -c 10 localhost:8080/add
$ curl localhost:8080/stat
100
```

3、使用ThreadLocal

```java
package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatController {
    static ThreadLocal<Integer> count = new ThreadLocal(){
        @Override
        protected Object initialValue() {
            return 0;
        }
    };


    @RequestMapping("/stat")
    public Integer stat(){
        return count.get();
    }

    @RequestMapping("/add")
    public Integer add() throws InterruptedException {
        // Thread.sleep(100L);
        // count++;
        __add();
        return count.get();
    }

    void __add() throws InterruptedException {
        Thread.sleep(100L);
        count.set(count.get()+1);
    }

}

```

```bash
ab -n 10000 -c 100 localhost:8080/add

$ curl localhost:8080/stat
100
$ curl localhost:8080/stat
99
$ curl localhost:8080/stat
100
$ curl localhost:8080/stat
99
$ curl localhost:8080/stat
99

```

总结

- 基于线程池模型synchronize(排队操作很危险)
- 使用ThreadLocal收集数据很快速且安全（如何收集数据）


## ThreadLocal同步

```java
package com.example.demo;

// 自定义一个引用类型
public class Value<T> {
    private T value;

    public void set(T _value) {
        value = _value;
    }

    public T get() {
        return value;
    }
}

```

改造后

```java
package com.example.demo;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;

@RestController
public class StatController {

    static HashSet<Value<Integer>> set = new HashSet<>();

    static ThreadLocal<Value<Integer>> count = new ThreadLocal(){
        @Override
        protected Value<Integer> initialValue() {
            Value<Integer> value  = new Value<>();
            value.set(0);
            addSet(value);
            return value;
        }
    };

    synchronized static void addSet(Value<Integer> value){
        // 临界区操作
        set.add(value);
    }

    void __add() throws InterruptedException {
        Thread.sleep(100L);
        Value<Integer> value = count.get();
        value.set(value.get() + 1);
    }

    @RequestMapping("/stat")
    public Integer stat(){
        return set.stream().map(x->x.get()).reduce((a, b) -> a+b).get();
    }

    @RequestMapping("/add")
    public Integer add() throws InterruptedException {
        __add();
        return count.get().get();
    }
}

```

```bash
$ ab -n 10000 -c 100 localhost:8080/add
$ curl localhost:8080/stat
10000
```

总结

- 完全避免同步（困难）
- 缩小同步范围（简单）+ ThreadLocal解决问题

## 源码分析

- Quartz: SimpleSemaphore
- MyBatis: SqlSessionManager
- Spring

本地事务
A Atomic 原子性 操作不可分割
C Consistency 一致性 任何时刻数据都能保持一致
I Isolation 隔离性 多事务并发执行的时序不影响结果
D Durability 持久性 对数据接收的存储是永久的

## 自定义实现ThreadLocal

```java
package com.demo.threadlocal;


import java.util.HashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * 自定义实现ThreadLocal
 *
 * @param <T>
 */
public class MyThreadLocal<T> {

    // 自增接口保证唯一性
    static AtomicInteger atomic = new AtomicInteger();

    // 高德纳 hash值
    Integer threadLocalHash = atomic.getAndAdd(0x61c88647);

    static HashMap<Thread, HashMap<Integer, Object>> map = new HashMap<>();

    // 临界区上锁
    synchronized static HashMap<Integer, Object> getMap() {
        Thread thread = Thread.currentThread();

        if (!map.containsKey(thread)) {
            map.put(thread, new HashMap<>());
        }

        return map.get(thread);
    }

    protected T initialValue() {
        return null;
    }

    public T get() {
        System.out.println("atomic: " + atomic);
        HashMap<Integer, Object> map = getMap();

        if (!map.containsKey(this.threadLocalHash)) {
            map.put(this.threadLocalHash, this.initialValue());
        }

        return (T) map.get(this.threadLocalHash);
    }

    public void set(T val) {
        HashMap<Integer, Object> map = getMap();
        map.put(this.threadLocalHash, val);
    }

}

```

```java
package com.demo.threadlocal;

public class TestMyThreadLocal {
    static MyThreadLocal<Long> threadLocal = new MyThreadLocal(){
        @Override
        protected Long initialValue() {
            return Thread.currentThread().getId();
        }
    };

    public static void main(String[] args) {

        for (int i = 0; i < 100; i++) {
            new Thread(()->{
                System.out.println(threadLocal.get());
            }).start();
        }
    }
}

```























