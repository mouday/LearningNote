# 第10 章 ： String类特点分析
## 42 String类简介
双引号定义
+连接字符串

字符创串不是基本数据类型
其中定义了一个数组，每一个字符都保存到数组中

JDK 1.9支持的字符串形式增多了
JDK 1.9 之后字符串数组使用byte类型
JDK 1.8 字符串数组使用char类型

字符串数组是字符的包装
字符串不可变

```java
// 直接赋值
String name = "字符串" ;

// 构造方法实例化
String company = new String("实例化字符串") ;
```

## 43 字符串比较
int型变量使用 == 判断相等
String 类型使用 equals(String str)

```java
String name1 = "字符串" ;
String name2 = "字符串" ;
String name3 = new String("字符串") ;

System.out.println(name1 == name2) ; // true
System.out.println(name1 == name3) ; // false

System.out.println(name1.equals(name2)); // true
System.out.println(name1.equals(name3)); // true
```

区别
== 比较数值, 如果用于对象比较，则比较内存地址
equals 比较字符串内容

## 44 字符串常量
双引号描述的是String类的一个匿名对象
字符串直接赋值，是将一个匿名字符串对象引用赋值

字符串比较的时候，字符串常量写前面
```java
String name = null ;

System.out.println("字符串".equals(name));
// false

System.out.println(name.equals("字符串"));
// NullPointerException
```

## 45 String类对象两种实例化方式比较
字符串池
直接赋值字符串，会在字符串数据池自动保存，实例重用，提高操作性能
构造方法实例化，会开辟新的堆内存空间

手工入池
Strint("").intern()

```java
String name1 = new String("字符串") ;

String name2 = "字符串" ;

System.out.println(name1== name2) ; // false

```

```java
String name1 = new String("字符串").intern() ;

String name2 = "字符串" ;

System.out.println(name1== name2) ; // true
```

## 46 String对象常量池
对象池主要目的是实现数据的共享处理

静态常量池：类.class加载时自动分配
```java
String name1 = "字符串";

String name2 = "字" + "符" + "串" ;

System.out.println(name1== name2) ; // true
```

运行时常量池：类.class加载后的常量池

```java
String name1 = "字符串";

String str = "符" ;
String name2 = "字" + str + "串" ;

System.out.println(name1== name2) ; // false

```
程序加载时并不确定str 是什么内容，可以被修改

## 47 字符串修改分析
字符串内容不可修改
String类是一个字符数组，长度不可以被改变

字符串拼接，并不是修改修改了字符串，而是修改了字符串的指向
String类不要进行频繁修改，会产生垃圾
```java
String str = "字"; // -> 字
str += "符" ;      // -> 符  字符
str += "串" ;      // -> 串  字符串

System.out.println(str) ; // 字符串
```

## 48 主方法组成分析
```java
public static void main(String[] args) {
    
}
```

主方法是一切的开始点

public 权限公开
static 由类直接调用
void   无返回
main   固定方法名
String[] args 接收启动参数；参数本身有空格，需要用双引号

```java
class Demo{
    public static void main(String[] args) {
        
        for(String arg : args){
            System.out.println(arg) ; 
        }
    }
}
```

```bash
$ java Demo first "你 好"
first
你 好
```

# 第11 章 ： String类常用方法

## 49 JavaDoc文档简介
Java JDK 1.9之前 加载JVM就加载常用类库
Java JDK 1.9 模块化

文档结构：
完整定义
相关说明
成员属性摘要
构造方法摘要 Deprecated 表示不建议使用
方法摘要
方法和成员的详细解释

https://docs.oracle.com/javase/8/docs/api/

## 50 字符串与字符数组
JDK 1.9以前，使用字符数组包装实现字符串

构造方法
String(char[] value)
String(char[] value, int offset, int count)

普通方法
char charAt(int index) 获取指定索引字符，下标从0开始
char[] toCharArray() 字符串转字符数组

实例代码：
1、将小写字符转为大写
```java
String str = "helloworld"; 
char[] str_list = str.toCharArray();

for (int i=0; i < str_list.length; i++){
    str_list[i] -= 32 ; // a 97 -> A 65 相差32
} 

System.out.println(new String(str_list));
// HELLOWORLD

System.out.println(new String(str_list, 0, 5));
// HELLO
```

2、判断字符串中所有字符是否都由数字组成
```java
class Demo{
    public static void main(String[] args) {
        
        System.out.println(isNumber("hello")); // false
        System.out.println(isNumber("123")); // true
    }

    public static boolean isNumber(String str){
        char[] charList = str.toCharArray();

        for (char c: charList){
            if(c < '0' || c > '9'){
                return false;
            }
        } 
        return true;
    }
}
```
中文处理使用char字符

## 51 字符串与字节数组
构造方法
String(byte[] bytes)
String(byte[] bytes, inf offset, int length)

普通方法
byte[] getBytes()  字符串转字节数组
byte[] getBytes(String charsetName) 编码转换

字节有长度限制 -128 ~ 127

实例：

通过字节数组将字符串字符小写转大写
```java

String str = "helloworld"; 
byte[] byte_list = str.getBytes();

for (int i=0; i < byte_list.length; i++){
    byte_list[i] -= 32 ; // a 97 -> A 65 相差32
} 

System.out.println(new String(byte_list));
// HELLOWORLD

System.out.println(new String(byte_list, 0, 5));
// HELLO
```

## 52 字符串比较
boolean equals(String str) 区分大小写相等判断
boolean equalsIgnoreCase(String str) 不区分大小写相等判断

```java
// 区分大小写 
"HELLO".equals("hello"); // false

// 不区分大小写
"HELLO".equalsIgnoreCase("hello"); // true
```


int compareTo(String str)  进行字符串大小比较
int compareToIgnoreCase(String str)  不区分大小写进行字符串大小比较
大于>0 等于=0 小于<0

```java
"HELLO".compareTo("hello"); // -32

"HELLO".compareToIgnoreCase("hello"); // 0
```

## 53 字符串查找
boolean contains(String str)  判断子串是否存在 JDK>=1.5
int indexOf(String str) 从开头查找子字符串位置 没有查到返回 -1
int indexOf(String str, int fromIndex) 从指定位置查找子字符串位置
int lastIndexOf(String str) 从后向前查找子字符串位置
int lastIndexOf(String str, int fromIndex) 从后向前指定位置查找子字符串位置
boolean startsWith(String prefix) 是否以指定字符开头
boolean startsWith(String prefix, int offset) 指定位置开始是否以指定字符开头
boolean endsWith(String suffix) 是否以指定字符结尾

```java
String str = "Hello World" ;

str.contains("Hello"); // true
str.indexOf("World");  // 6
str.indexOf("World", 6);  // 6
str.lastIndexOf("World");  // 6
str.lastIndexOf("World", 6);  // 6
str.startsWith("World");  // false
str.startsWith("World", 6); // true
str.endsWith("World"); // ture

```

## 54 字符串替换

String  replaceAll(String regex, String replacement)  全部替换 
String  replaceFirst(String regex, String replacement) 替换首个

```java
String str = "Hello World" ;

str.replaceAll("l", "X");  // HeXXo WorXd
str.replaceFirst("l", "X");  // HeXlo World
```

## 55 字符串拆分
String[] split(String regex)   拆分字符串为数组
String[] split(String regex, int limit)   指定拆分次数

```java

String str1 = "Hello World Java" ;

String[] strList1 = str1.split(" ") ;
// {"Hello", "World", "Java"}


String[] strList2 = str1.split(" ", 2) ;
// {"Hello", "World Java"}


// 拆分特殊字符使用 \\ 转义
String str2 = "192.168.0.1" ;

String[] strList2 = str2.split("\\.") ;
// {"192", "168", "0", "1"}

```

## 56 字符串截取
String  substring(int beginIndex)  截取字符串
String  substring(int beginIndex, int endIndex) 指定结束位索引

通过计算确定索引
```java
String str = "http://www.baidu.com/logo.png" ;

// 计算开始结束位置
int beginIndex = str.indexOf("/", str.indexOf("com")) + 1 ; 
int endIndex = str.lastIndexOf(".") ;

// 截取字符串
String name = str.substring(beginIndex, endIndex); 
System.out.println(name); 
//  logo
```

## 57 字符串格式化

static String   format(Locale l, String format, Object... args)
static String   format(String format, Object... args)


常用占位符
字符串 %s
字符 %c
整数 %d
小数 %f

```java
String name = "小明" ;
int age  = 23 ;
double score = 98.995321 ; 

// 保留两位小数
String.format("%s: %d - %5.2f", name, age, score);
// 小明: 23 - 99.00
```

## 58 其它操作方法
String  concat(String str) 运行时拼接
String  intern()   字符串入池
boolean isEmpty()  判断长度为0 不是null 是 ""
int length()       计算长度， 区别数组属性length
String  trim()    去除左右空白
String  toLowerCase()  字母转小写
String  toUpperCase()  字母转大写
static String   join(CharSequence delimiter, CharSequence... elements)
static String   join(CharSequence delimiter, Iterable<? extends CharSequence> elements)

实例
1、首字母转大写
```java
/**
* 首字母转大写
*/
public static String initCap(String str) {
    if(str == null || "".equals(str)){
        return str ; // 原样返回
    }

    if(str.length() == 1){
        return str.toUpperCase();
    }else{
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }
}


initCap(null); // null
initCap(""); // ""
initCap("a"); // "A"
initCap("hello"); // "Hello"

```

2、字符串数组转字符串
```java
String.join("-", "a", "b", "c"); // a-b-c
String.join("-", new String[]{"a", "b", "c"}); // a-b-c
```
