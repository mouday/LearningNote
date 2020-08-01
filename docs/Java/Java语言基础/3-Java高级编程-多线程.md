# 第1 章 ： Java多线程编程
## 2 进程与线程

进程  系统进行资源分配和调度的基本单位
线程  在进程基础上划分的更小的程序单元，操作系统能够进行运算调度的最小单位

Java多线程编程语言


## 3 Thread类实现多线程
1、继承Java.lang.Thread实现多线程
覆写run方法
start启动线程

每一个线程对象只能启动一次，多次启动就会抛出异常

native 

JNI Java Nativa Interface 本地接口，针对不同操作系统有不同的实现

```java
class MyThread extends Thread{
    private String name;

    public MyThread(String name){
        this.name = name;
    }

    @Override
    public void run(){
        for (int i =0 ; i< 3; i++) {
            System.out.println(this.name + " -> " + i);    
        }
        
    }
}

class Demo{
    public static void main(String[] args) {
        new MyThread("A").start();
        new MyThread("B").start();
        new MyThread("C").start();
        /**
        A -> 0
        A -> 1
        A -> 2
        C -> 0
        B -> 0
        B -> 1
        B -> 2
        C -> 1
        C -> 2
        */
    }
}

```

## 4 Runnable接口实现多线程
JDK >= 1.8 变为函数式接口
Thread类有单继承局限
```java
class MyThread implements Runnable{
    private String name;

    public MyThread(String name){
        this.name = name;
    }

    @Override
    public void run(){
        for (int i =0 ; i< 3; i++) {
            System.out.println(this.name + " -> " + i);    
        }
        
    }
}

class Demo{
    public static void main(String[] args) {
        Thread t1 = new Thread(new MyThread("A"));
        Thread t2 = new Thread(new MyThread("B"));
        Thread t3 = new Thread(new MyThread("C"));

        t1.start();
        t2.start();
        t3.start();
        /**
        A -> 0
        A -> 1
        A -> 2
        C -> 0
        B -> 0
        B -> 1
        C -> 1
        C -> 2
        B -> 2
        */
    }
}

```

利用Runnable + Lambda实现

```java
class Demo{
    public static void main(String[] args) {
        for(int i=0; i< 3; i++) {
            String name = "对象-" + i ;

            Runnable run = ()->{
                for(int j=0; j< 3; j++) {
                    System.out.println(name + "-> " + j);
                }
            };

            new Thread(run).start();
        }
        
        /**
        对象-0-> 0
        对象-0-> 1
        对象-0-> 2
        对象-1-> 0
        对象-2-> 0
        对象-1-> 1
        对象-1-> 2
        对象-2-> 1
        对象-2-> 2
        */
    }
}

```

利用Thread + Lambda实现
```java
class Demo{
    public static void main(String[] args) {
        for(int i=0; i< 3; i++) {
            String name = "对象-" + i ;

            new Thread(()->{
                for(int j=0; j< 3; j++) {
                    System.out.println(name + "-> " + j);
                }
            }).start();
        }
        
        /**
        对象-0-> 0
        对象-0-> 1
        对象-0-> 2
        对象-1-> 0
        对象-2-> 0
        对象-1-> 1
        对象-1-> 2
        对象-2-> 1
        对象-2-> 2
        */
    }
}

```
多线程优先考虑Runnable 实现，永远都是Thread.start() 启动

## 5 Thread与Runnable关系

```java
class Thread implements Runnable
```

Thread 代理类
MyThread implements Runnable 实际业务

使用了代理设计模式
```java
Thread t = new Thread(new MyThread());
```

Thread类启动多线程调用的是start()方法，而后启动run()方法
Thread类接收Runnable 接口对象，调用start()方法后，会启动Runnable 接口对象的run()方法

多线程实质上在于多个线程可以进行同一资源的抢占

Thread 描述的是线程
Runnable 描述资源

```java

class MyThread implements Runnable{
    private int ticket = 5;

    public void run() {
        while (true){
            if(ticket > 0){
                System.out.println(ticket-- );
            }else{
                break;
            }
        }
    }
}

public class Demo {
    public static void main(String[] args) {
        MyThread t = new MyThread();
        Thread t1 = new Thread(t);
        Thread t2 = new Thread(t);
        Thread t3 = new Thread(t);
        t1.start();
        t2.start();
        t3.start();
        /**
         * 5
         * 3
         * 2
         * 1
         * 4
         */
    }
}

```

## 6 Callable接口实现多线程
JDK >= 1.5
java.util.concurrent.Callable

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}

```

继承关系
```java
class Thread implements Runnable

public interface RunnableFuture<V> extends Runnable, Future<V>

public class FutureTask<V> implements RunnableFuture<V> {

```

```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;
import java.util.concurrent.ExecutionException;

class MyThread implements Callable<String>{

    public String call() {
        return "线程执行完毕";
    }
}

public class Demo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        FutureTask<String> task = new FutureTask<String>(new MyThread());
        new Thread(task).start();

        System.out.println(task.get());
        // 线程执行完毕

    }
}

```

区别 Callable Runnable
Runnable JDK1.0  只有run方法，没有返回值
Callable JDK1.5  提供call方法，有返回值

## 7 多线程运行状态
线程生命周期
```
创建 start()
就绪 
运行 run()
阻塞 
终止
```

# 第2 章 ： 线程常用操作方法
## 8 线程的命名和取得

获取当前线程对象
```java
public static native Thread currentThread();
```

线程自动命名，使用 static
```java
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;


class MyThread implements Runnable {
    public void run() {
        System.out.println(Thread.currentThread().getName());
    }
}

public class Demo {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        MyThread t = new MyThread();
        new Thread(t, "线程A").start();
        new Thread(t).start();
        new Thread(t, "线程B").start();
        /**
         * 线程A
         * 线程B
         * Thread-0
         */
    }
}

```

主线程
```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
        System.out.println(Thread.currentThread().getName());
        // main
    }
```

主线程可以创建若干子线程
主线程控制主体流程
子线程执行耗时操作

## 9 线程休眠
线程暂缓执行

Exception 必须处理
```java
class InterruptedException extends Exception

public static native void sleep(long millis) throws InterruptedException;
public static void sleep(long millis, int nanos) throws InterruptedException;
```

休眠线程
```java
public class Demo {
    public static void main(String[] args) {
        new Thread(()->{
            for (int i= 0; i< 3; i++){
                System.out.println(i);
                
                // 暂停一秒
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

        }).start();

    }
}

```

## 10 线程中断

中断线程执行
```java
public void interrupt()
```

判断线程是否被中断
```java
public boolean isInterrupted()
```

所有线程都可以被中断，中断异常必须处理
```java
public class Demo {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            // 暂停10秒
            try {
                Thread.sleep(10 * 1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

        });

        t.start();

        if (!t.isInterrupted()) {
            t.interrupt();
        }
        // 抛出异常 sleep interrupted
    }
}

```

## 11 线程强制运行
线程独占资源，一直到线程执行结束
```java
public final void join() throws InterruptedException
```

```java
public class Demo {
    public static void main(String[] args) {
        Thread mainThread = Thread.currentThread();

        Thread t = new Thread(() -> {
            // 强制执行主线程
            try {
                mainThread.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            for (int i = 0; i < 3; i++) {
                System.out.println(Thread.currentThread().getName() + " " + i);
            }
        });

        t.start();

        for (int i = 0; i < 3; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);
        }

        // 抛出异常 sleep interrupted
    }
}

```

## 12 线程礼让
yield 产生;让步

每一次调用yield()方法只会礼让一次当前的资源
```java
public static native void yield();
```    

```java

public class Demo {
    public static void main(String[] args) {
        Thread t = new Thread(() -> {
            for (int i = 0; i < 30; i++) {
                System.out.println("礼让资源");
                Thread.yield();

                System.out.println(Thread.currentThread().getName() + " " + i);
            }
        });
        t.start();

        for (int i = 0; i < 30; i++) {
            System.out.println(Thread.currentThread().getName() + " " + i);
        }

    }
}

```

## 13 线程优先级

线程优先级越高，越可能先执行，可能优先抢占到资源

```java
public final int getPriority()

public final void setPriority(int newPriority)
```

优先级常量
```java
MIN_PRIORITY = 1;
NORM_PRIORITY = 5;
MAX_PRIORITY = 10;
```

主线程优先级,和默认优先级都是中等优先级 5
```java
public class Demo {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getPriority());
        // 5
    }
}
```


# 第3 章 ： 线程的同步与死锁
## 14 同步问题引出
Thread描述每一个线程对象
Runnable描述多个线程操作的资源
多个线程访问同一资源的时候，如果处理不当会产生数据错误

3个线程卖票程序，会出现多张同号的票
```java
class MyThread implements Runnable {
    private int ticket = 10;

    @Override
    public void run() {
        while (true) {
            if (this.ticket > 0) {
                System.out.println(
                        Thread.currentThread().getName()
                                + "卖第" + this.ticket + " 张票"
                );
                this.ticket--;

            } else {
                System.out.println("票卖光了");
                break;
            }
        }
    }
}

public class Demo {
    public static void main(String[] args) {
        MyThread thread = new MyThread();
        new Thread(thread).start();
        new Thread(thread).start();
        new Thread(thread).start();
        // 5
    }
}

```

## 15 线程同步处理
同步：多个操作在同一时间段内只能有一个线程进行，
其他线程要等待此线程完成之后才可以继续还行

解决同步问题的方式是锁
synchronized定义同步方法或同步代码块，里边的代码只允许一个线程执行

加入同步之后，程序整体性能下降了

1、同步代码块
```java
synchronized(同步对象){}
```

举例
```java
synchronized (this) {
    if (this.ticket > 0) {
        System.out.println(Thread.currentThread().getName() +
                "卖第" + this.ticket + " 张票");
        this.ticket--;

    } else {
        System.out.println("票卖光了");
        break;
    }
}
```

2、同步函数
```java
public synchronized boolean method(){}
```


举例
```java
public synchronized boolean sale(){
    if (this.ticket > 0) {
        System.out.println(Thread.currentThread().getName() +
                "卖第" + this.ticket + " 张票");
        this.ticket--;
        return true;
    } else {
        System.out.println("票卖光了");
        return false;
    }
}
```

## 16 线程死锁
死锁是在进行多线程同步处理之中有可能产生的一种问题
是指若干个线程彼此互相等待的状态


若干线程访问同一资源时，一定要进行同步处理
而过多的同步会造成死锁

```java
public class Demo {

    public static void main(String[] args) {
        //o1 o2 代表资源
        Object o1 = new Object();
        Object o2 = new Object();

        System.out.println("go go go!");

        Thread t1 = new Thread(new Runnable() {
            public void run() {
                synchronized (o1) {   //线程t1获取o1的锁才能继续执行
                    try {
                        Thread.sleep(3000);      //睡3秒，确保线程t2把o2锁拿走
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("t1获得了哦O1");
                    synchronized (o2) {                 //线程t1获取o2的锁才能继续执行
                        System.out.println("t1获得了哦O2");
                    }
                }
            }
        });

        Thread t2 = new Thread(new Runnable() {
            public void run() {
                synchronized (o2) {  //线程t2获取o2的锁才能继续执行
                    try {
                        Thread.sleep(3000);     //睡3秒，确保线程t1把o1锁拿走
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    System.out.println("t2获得了哦O2");
                    synchronized (o1) {             //线程t2获取o1的锁才能继续执行
                        System.out.println("t2获得了哦O1");
                    }
                }
            }
        });

        t1.start();
        t2.start();       //启动线程
    }

}
```

# 第4 章 ： 综合实战：“生产者-消费者”模型
## 17 生产者与消费者基本程序模型

生产者负责信息内容生产
消费者取走信息

消费者要等待生产者生产完成再取走
生产者需要等待消费者消费完成再生产

不加锁示例
```java
class Message {
    private String content;

    public void setContent(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }
}

class Producer implements Runnable {
    private Message message;
    private static int count;

    public Producer(Message message) {
        this.message = message;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            this.message.setContent("这是第" + count + " 个消息");
            count++;
        }
    }
}


class Consumer implements Runnable {
    private Message message;

    public Consumer(Message message) {
        this.message = message;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(this.message.getContent());
        }
    }
}

class Demo {
    public static void main(String[] args) {
        Message message = new Message();
        new Thread(new Producer(message)).start();
        new Thread(new Consumer(message)).start();
    }
}
/**
这是第0 个消息
这是第0 个消息
这是第1 个消息
这是第2 个消息
这是第3 个消息
这是第4 个消息
这是第5 个消息
这是第6 个消息
这是第7 个消息
这是第8 个消息
*/
```

## 18 解决生产者-消费者同步问题
增加关键字 synchronized


## 19 利用Object类解决重复操作
等待机制
(1)一直等待  
```java
public final void wait()
```
(2)等待一段时间 
```java
public final native void wait(long timeout)
```

唤醒线程
(1)唤醒一个等待线程, 唤醒第一个等待的线程
```java
 public final native void notify();
```
(2)唤醒全部等待线程,谁优先级高谁先执行
```java
 public final native void notifyAll();
```

 完整代码
```java
 class Message {
    private String content;
    private boolean flag = false; // 生产完成就为true

    public synchronized void setContent(String content) {
        if (this.flag == true) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        this.content = content;
        this.flag = true;
        notify();
    }

    public synchronized String getContent() {
        if (this.flag == false) {
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        try {
            return content;
        } finally {
            this.flag = false;
            notify();
        }
    }
}

class Producer implements Runnable {
    private Message message;
    private static int count;

    public Producer(Message message) {
        this.message = message;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            this.message.setContent("这是第" + count + " 个消息");
            count++;
        }
    }
}


class Consumer implements Runnable {
    private Message message;

    public Consumer(Message message) {
        this.message = message;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println(this.message.getContent());
        }
    }
}

class Demo {
    public static void main(String[] args) {
        Message message = new Message();
        new Thread(new Producer(message)).start();
        new Thread(new Consumer(message)).start();
    }
}
```

# 第5 章 ： 多线程深入话题
## 20 优雅的停止线程
已废除的方法，可能会导致线程死锁，不建议使用
```java
// 停止线程 
public final void stop()

// 销毁线程 
public void destroy()

// 挂起线程 
public final void suspend()

// 恢复线程 
public final void resume()
```

使用flag 标志位不会立刻停止，而是当前线程自己判断
```java
class Demo{
    private static boolean flag = true;

    public static void main(String[] args) {
        new Thread(()->{
            while (flag){

                try {
                    Thread.sleep(600);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                System.out.println(Thread.currentThread().getName()+"正在执行");
            }
        }, "自定义线程").start();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("时间到");
        flag = false;
    }
}
```

## 21 后台守护线程
守护线程，如果主线程退出，守护线程就退出
GC就是守护线程

设置为守护线程
```java
public final void setDaemon(boolean on)
```

判断是否为守护线程
```java
public final boolean isDaemon()
```

示例
设置线程为守护线程后，主程序执行完毕就退出了，并不会打印任何内容
```java
class MyThread implements Runnable{

    @Override
    public void run() {
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(Thread.currentThread().getName()+" 正在执行");
    }
}

class Demo{
    public static void main(String[] args) {
        Thread t = new Thread(new MyThread());
        t.setDaemon(true);
        t.start();
    }
}
```

## 22 volatile关键字
volatile 用于属性定义， 中文意思：易变的

变量处理的步骤：
（1）获取变量原有的数据内容副本
（2）利用副本为变量进行数学计算
（3）建计算后的变量，保存到原始空间中
```
读取read <- 数据副本
加载load
使用use
赋值asign
存储store
写入write  -> 原始空间
```
属性上加了volatile, 没有中间拷贝过程，直接使用原始数据

区别：volatile 和 synchronized
volatile： 主要在属性上使用，无法描述同步，直接内存处理，避免副本操作
synchronized： 代码块与方法上使用


```java
class MyThread implements Runnable{
    private volatile int count = 10;

    @Override
    public void run() {
        while (count>0) {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName()+" 正在执行");
            count --;
        }

    }
}

class Demo{
    public static void main(String[] args) {
        Thread t = new Thread(new MyThread());
        t.start();
    }
}
```


# 第6 章 ： 多线程综合案例
## 23 数字加减
4个线程，2个线程加，2个线程减
循环出现 加一个，减一个

```java

// 资源
class Resource {
    private int count = 0;

    // 为false可以增加,加完了设置为true，
    // 为true可以减少，减完了设置为false
    private boolean flag = false;

    public synchronized void add() {
        if (this.flag == true) {

            try {
                super.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        this.count++;
        System.out.println(Thread.currentThread().getName() + " count=" + count);

        this.flag = true;
        super.notifyAll();
    }

    public synchronized void sub() {
        if (this.flag == false) {
            System.out.println(this.flag);
            try {
                super.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        this.count--;
        System.out.println(Thread.currentThread().getName() + " count=" + count);

        this.flag = false;
        super.notifyAll();
    }
}

// 加法线程
class AddThread implements Runnable {
    private Resource resource;

    public AddThread(Resource resource) {
        this.resource = resource;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            this.resource.add();
        }
    }
}


// 减法线程
class SubThread implements Runnable {
    private Resource resource;

    public SubThread(Resource resource) {
        this.resource = resource;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            this.resource.sub();
        }
    }
}


class Demo {
    public static void main(String[] args) {
        Resource resource = new Resource();

        AddThread at = new AddThread(resource);
        SubThread st = new SubThread(resource);

        new Thread(at, "加法线程-A").start();
        new Thread(at, "加法线程-B").start();
        new Thread(st, "减法线程-X").start();
        new Thread(st, "减法线程-Y").start();
    }
}
```
并没有出现一加一减的现象

## 24 生产电脑
生产一台搬运一台

消费者生产者模型
```java
class Computer{
    private static int count;

    public Computer() {
        count++;
    }

    @Override
    public String toString() {
        return "电脑编号：" + count;
    }
}


class Resource{
    private Computer computer;

    public synchronized void make(){
        if(computer != null){
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        this.computer = new Computer();
        System.out.println("生产：" + this.computer);
        notifyAll();
    }

    public synchronized void get(){
        if(computer == null){
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            Thread.sleep(10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("取走：" + this.computer);
        this.computer = null;
        notifyAll();
    }
}

class Producer implements Runnable{
    private Resource resource;

    public Producer(Resource resource) {
        this.resource = resource;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            resource.make();
        }
    }
}


class Consumer implements Runnable{
    private Resource resource;

    public Consumer(Resource resource) {
        this.resource = resource;
    }

    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            resource.get();
        }
    }
}

class Demo{
    public static void main(String[] args) {
        Resource resource = new Resource();
        new Thread(new Producer(resource)).start();
        new Thread(new Consumer(resource)).start();
    }
}

```

## 25 竞争抢答
3个抢答线程，同时发出抢答指令
成功和失败都给与提示

有数据返回，采用Callable方式
```java
import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

class MyThread implements Callable<String> {
    private boolean flag = false;

    @Override
    public String call() throws Exception {
        synchronized (this) {
            // 如果没有人抢答成功则可以抢答
            if (this.flag == false) {
                this.flag = true;
                return Thread.currentThread().getName() + "抢答成功！";
            } else {
                return Thread.currentThread().getName() + "抢答失败！";
            }
        }
    }
}

class Demo {
    public static void main(String[] args) throws Exception {
        MyThread t = new MyThread();

        FutureTask<String> task1 = new FutureTask<String>(t);
        FutureTask<String> task2 = new FutureTask<String>(t);
        FutureTask<String> task3 = new FutureTask<String>(t);

        new Thread(task1, "抢答者A").start();
        new Thread(task2, "抢答者B").start();
        new Thread(task3, "抢答者C").start();

        System.out.println(task1.get());
        System.out.println(task2.get());
        System.out.println(task3.get());
    }
}
```
