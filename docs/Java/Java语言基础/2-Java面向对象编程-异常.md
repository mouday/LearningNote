# 第27 章 ： 异常的捕获及处理

## 116 认识异常对程序的影响
出现错误后，程序中断执行
为了保证程序出现非致命错误之后，程序依然可以正常完成
异常处理机制保证程序的顺利执行


## 117 处理异常

语法
```java
try{

} catch(异常类型 异常对象){
    // 处理异常

} catch(异常类型 异常对象){
    // 处理异常
}
...
finally{
    // 不管是否出现异常都会执行
}

```

异常
```java
System.out.println(2/0);
// java.lang.ArithmeticException: / by zero
```

异常捕获
```java
try{
    System.out.println(2/0);
}
catch(ArithmeticException e){
    System.out.println(e);
    // java.lang.ArithmeticException: / by zero
}
```

打印完成的异常信息
printStackTrace()
```java
try{
    System.out.println(2/0);
}
catch(ArithmeticException e){
    e.printStackTrace();
    // java.lang.ArithmeticException: / by zero
    // at Demo.main(Demo.java:4)
}
```

## 118 处理多个异常
如果明确知道会发生什么异常，可以使用if做判断

## 119 异常处理流程

Error 程序还未执行性出现的错误，开发者无法处理
Exception 程序中出现的异常，开发者可以处理

异常体系
```
Object
    -Throwable
        -Exception
```

所有异常都可以用 Exception 处理
捕获范围大的异常要放在最后

## 120 throws关键字
告诉调用者可能会出现的异常
如果主方法继续抛出异常，表示此异常交由JVM处理

```java

class Demo{

    public static int div(int x, int y) throws ArithmeticException{
        return x / y;
    }
    
    public static void main(String[] args) {
        try{
            int x = div(1, 0) ;
        }catch(ArithmeticException e){
            e.printStackTrace();
        }
        
    }
}

```

## 121 throw关键字
手动抛出异常
```java
try{
    throw new Exception("主动抛出异常");
}catch(Exception e){
    e.printStackTrace();
    // java.lang.Exception: 主动抛出异常
}
```

区别：throw & throws
throw 在代码块中使用，主动抛出异常对象
throws 在方法定义上使用，明确告诉调用者可能产生的异常

## 122 异常处理模型
```java
try{
    result = x / y;
} catch(Exception e){
    throw e;
}finally{
    System.out.println("结束...");
}

```

简化写法
```java
try{
    result = x / y;
} finally{
    System.out.println("结束...");
}
```

## 123 RuntimeException
函数定义标注了可能抛出的异常，不过并没有要求强制处理

区别 RuntimeException & Exception
RuntimeException 是 Exception子类
RuntimeException 子类不要求强制处理异常
Exception 必须处理

## 124 自定义异常类
继承 RuntimeException（可选处理），Exception（必须处理）
```java
// 如果继承自Exception 
// 错误: 未报告的异常错误MyException; 必须对其进行捕获或声明以便抛出
class MyException extends RuntimeException{
    public MyException(String message){
        super(message);
    }
}

class Demo{
    public static void main(String[] args) {
        throw new  MyException("自定义异常");
        // Exception in thread "main" MyException: 自定义异常
    }
}

```

## 125 assert断言
JDK >= 1.4
确定代码执行到某行之后，一定是所期待的结果
不一定是准确的，也可能出现偏差，但是这种偏差不应该影响程序的正常执行

Java中的断言需要指定运行参数才生效

```java
int x = 9 ;
assert x == 10;
```
编译运行没有任何结果

启用断言
```
java -ea Demo
```

程序抛出异常
```
Exception in thread "main" java.lang.AssertionError
```

