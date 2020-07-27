Java
## 1、编程基础自测考试

## 2、Java发展简介
完善的生态系统
OAK（橡树）平台
HotJava浏览器
sun: Stanford University NetWork

Java 标准开发 J2SE、JAVA SE
Java 嵌入式开发 J2ME、JAVA ME
Java 企开开发  J2EE、JAVA EE

## 3、Java语言特点
1、行业内通用的技术实现标准
2、面向对象编程语言
3、提供了内存回收处理机制
4、避免了复杂的指针问题
5、支持多线程编程
6、高效的网络处理能力
7、良好的可移植性
8、语言足够简单

## 4、Java可移植性
JVM Java虚拟机（Java Virtual Machine）
JVM 调优问题

编译型 + 解释型

Java源文件.java -> 字节码.class -> 机器码

## 5、JDK简介
生产环境使用JDK1.8
JDK Java Development Kit（包含JRE）
JRE Java Runtime Envrinment

## 6、JDK安装与配置
环境变量配置
Windows： Path

编译命令：javac.exe
解释命令：java.exe

## 7、编程起步
源代码：Hello.java
```java
public class Hello{
    // 中括号[] 可在变量名前，也可以在后
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}
```

编译执行
```bash
$ ls
Hello.java

$ javac Hello.java  # 编译文件为字节码文件
$ ls
Hello.class Hello.java

$ java Hello        # JVM执行java程序 
Hello World!
```

1、定义类：

```java
public class 类名 {}   // 类名必须与文件名一致
class 类名 {}          // 类名可以与文件名不一致 
```

在一个.java文件中，可以有多个class定义
一个java文件中，只能有一个public class（推荐）

命名规范：每个单词的首字母大写

2、主方法
程序执行起点，一定要定义在类中
主方法所在类，称为主类

3、系统输出

```java
System.out.println();  // 输出换行  line  
System.out.print();    // 输出不换行
```

## 8、JShell工具
JDK > 1.9

```
$jshell
jshell>
```

## 9、CLASSPATH环境属性
默认为当前所在目录
```bash
export CLASSPATH=.  # Linux
set CLASSPATH=.     # Windows 可配置为系统变量
```

```bash
PATH       # 操作系统提供的路径配置，定义所有可执行程序路径
CLASSPATH  # JRE提供的加载类的路径
```

## 10、注释
编译时不处理注释
```java
// 单行注释  
/* 多行注释 */
/** 文档注释 */
```

## 11 标识符与关键字
标识符：
```
包含：字母、数字、_、$ 
字母开头
```
关键字
特殊含义，如`class`
JDK 1.4 assert 用于异常处理
JDK 1.5 enum   用于枚举定义
未使用：goto、const
特殊含义：true、false、null

## 12、Java数据类型简介
分类
```bash
基本数据类型：具体的数字单元
    数值型
        -整型：byte-8、short-16、
              int-32、long-64          # 默认值 0
        -浮点型：float-32、double-64     # 默认值 0
    布尔型：boolean                     # 默认值 false
    字符型：char-16                     # 默认值 \u0000

引用数据类型：涉及内存关系的使用
    数组、类、接口                       # 默认值null
```

参考原则
描述数字：整数int、小数double
数据传输、文字编码转换：byte（二进制操作）
处理中文：char
描述内存或文件大小，自增主键：使用long

## 13、整型数据类型
定义
```java
// int 变量名称 = 常量;
int x = 10;
```

范例：超过int范围
数据溢出

```java

// int int变量 = int数值
int max = Integer.MAX_VALUE;    // 获取int最大值
int min = Integer.MIN_VALUE;    // 获取int最小值
System.out.println("min: " + min);
System.out.println("max: " + max);

// int变量 + int常量 = int结果
System.out.println("max + 1: " + (max + 1));

System.out.println("=================");

// long long变量 = int数值
long long_max = Integer.MAX_VALUE;
long long_min = Integer.MIN_VALUE;
System.out.println("long_min: " + long_min);
System.out.println("long_max: " + long_max);

// long变量 + int常量 = long结果
System.out.println("long_min + 1: " + (long_max + 1));

/*
min: -2147483648
max: 2147483647VAl
max + 1: -2147483648
=================
long_min: -2147483648
long_max: 2147483647
long_min + 1: 2147483648
*/

```

数值常量默认是int
数值常量后面加L（推荐）或l转换为long型
```java
long l = 123L;
```

自动类型转换：小类型 -> 大类型
强制类型转换：大类型 -> 小类型

```java
long l = 123;       // 自动转换
int i = (int)123;   // 强制转换（不建议）

byte b = 200;  // 错误: 不兼容的类型: 从int转换到byte可能会有损失
```
常量会自动转换
变量需要强制转换

## 14、浮点型数据
小数常量对应double
```java
// 定义double
double x = 10.2;

// double + int = double

// 定义float
float x = (float)10.2;  // 强制转换
float y = 10.2F;   

// int / int => int    
// 10/4=2

// (double)int / int => double   
// (double)10/4 = 2.5
```

## 15、字符型
单引号''描述
1、定义字符变量
```java
// 定义字符变量
char c = 'B';

// 获取字符编码
int num = c;

```
任何编程语言的字符都可以与int进行转换

字符集  | 字符范围  | 数值
- | - | -
大写字母 | 'A'-'Z'  | 65-90
小写字母 | 'a'-'z'  | 97-122
数字范围 | '0'-'9'  | 48-57

2、小写转大写示例
```java
char a = 'a';
int num = a;
num = num - 32;

System.out.println((char)num); // A
```

3、保存中文数据
java使用Unicode十六进制的编码，可以包含任意字符

```java
char a = '中';
int num = a;
System.out.println(num); // 20013
```

## 16、布尔型
```java
// 定义布尔型
boolean flag = true;

// 执行判断逻辑
if (flag){
   System.out.println("true");
}else{
System.out.println("false");
}
// true
```
部分编程语言不提供布尔型，使用0替代false，其他值替代true
java中布尔型的取值为：true，false

## 17、String字符串
任何编程语言里都没有提供所谓字符串这种基本数据
双引号`""`描述字符串
```java
String str = "Hello";  // 字符串描述
str = str + " World";  // 字符串连接
str += "!";
System.out.println(str); 
// Hello World!
```

Java中：数据范围大类型 + 数据范围小类型（自动转为范围大的类型）
如果有字符串String，所有数据类型都会转为String类型

```java
System.out.println("数值计算结果：" + (1 + 1)); 
// 数值计算结果：2

System.out.println("字符拼接结果：" + 1 + 1); 
// 字符拼接结果：11
```

转义字符, 多用于打印输出
```
Tab    \t
换行    \n
引号    \"
单引号   \'
斜线    \\
```

## 18、运算符简介
所有的程序开发，都是一种数字的处理游戏
对于数字处理的操作模式就称为运算符
程序会提供基础运算符，存在优先级（括号优先级最高）

## 19、数学运算符
支持四则运算
简化运算符
```
+=、-=、*=、/=、%=

++变量、--变量：先进行变量自增自减，而后再进行数字计算
变量++、变量--：先使用变量进行计算，再进行变量自增自减
```
内存较少的时候使用，现在不推荐使用
```java
int x = 10;
int y = 20;

// (++x) + (y--) => 11 + 20 = 31; x=11; y=19 
int result = ++ x + y--;

System.out.println("result: " + result); 
System.out.println("x: " + x); 
System.out.println("y: " + y); 

// result: 31
// x: 11
// y: 19
```

## 20、关系运算符
```
>、< 
>=、<=
==   比较
// = 赋值
```
所有的关系判断返回值都是boolean
数据类型之间提供自动转型支持，字符判断会自动转为int
```java
char c = '中';
boolean flag = c > 1; 

System.out.println(flag);
// true
```

## 21、逻辑运算符
三目运算符
```
关系运算 ？ 满足时的内容: 不满足时的内容
```

判断字符大小, 嵌套层数不宜过多
```java
int x = 10;
int y = 20;

// int max = x > y ? x : y;
int max;
if (x > y){
    max = x;
} else{
    max = y;
}

System.out.println(max);   
// 20
```

## 22、位运算
直接进行二进制数据的计算处理
```
与 &
或 |
异或 ^
反码 ~
移位 << >> 
```
十进制与二进制转换
数字除2取余
```bash
# 十进制转二进制
13 / 2 = 6 ...1
6 / 2 = 3  ...0
3 / 2 = 1  ...1
1 / 2 = 0  ...1

13 => 1101

# 将10从十进制转二进制
$ echo "obase=2;10"|bc

# 二进制转为十进制
8 4 2 1
1 1 0 1 => 8 + 4 + 1 = 13
```

位运算
```
13 1101
7  0111

&  0101 => 5
|  1111 => 15
^  1010 => 10
```
移位计算
```java
// 2的3次方  8
2 << 2 = 8

2 -> 0010 -> 1000 -> 8
```

区别 & && | ||

1、& | 位运算和逻辑运算
逻辑判断的时候，所有判断都要执行
位运算的时候只是对当前数据进行与和或处理

2、&& || 短路运算
&& 如果前面条件返回false，后续条件不再执行
|| 如果前面条件返回true，后续条件不再执行

## 23、IF分支结构
顺序结构，分支结构，循环结构

if语句 针对关系表达式进行判断处理的分支操作
```java
if (boolean){

} [else {
// 可选
}]
```

## 24、SWITCH开关语句
可以判断
```
int、char、枚举、String（JDK >= 1.7）
```

如果没有在case后面追加break，那么会从case条件开始执行到最后
```java
switch(数据) {
    case 数值: {
        [break;]
    }
    case 数值: {
        [break;]
    }
    default: {

    }
}
```
示例
```java
String s = "Hello";

switch (s){
    case "hello": {
        System.out.println("hello");
        break;
    }
    case "Hello": {
        System.out.println("Hello");
        break;
    }
    default: {
        System.out.println("default");
    }
}
// Hello
```

## 25、while循环
循环结构：某一段代码被重复执行

如果不修改循环条件，会造成死循环
```java
// 至少执行 0 次 常用
while (boolean) {
  
}

// 至少执行 1 次
do {

} while (boolean);  // 注意这里的分号

```

## 26、for循环
```java
for (定义循环初始值; 循环判断; 修改循环参数) {

}

// eg:
int sum = 0;
for (int i = 1; i < 10; i++) {
    sum += i;
}
System.out.println(sum); 
// 45    
```

while 和 for循环选择
1、明确循环次数，优先选择for循环
2、不知道循环次数，但是知道循环结束条件，选择while循环

## 27、循环控制
break    退出整个循环结构
continue 结束当前循环，直接进入下一次循环，可以实现部分goto功能

C语言中的goto 不建议使用
```java
// 使用continue 跳出两层循环 不建议使用
Point: for (int i = 1; i < 3; i++) {
    for (int j = 1; j < 3; j++) {
        if (i == j) {
            continue Point;
        }
        System.out.println(i + " + " + j + " = " + (i + j)); 
    }
}

/*
不使用 continue Point;
1 + 1 = 2
1 + 2 = 3
2 + 1 = 3
2 + 2 = 4

使用 continue Point;
2 + 1 = 3
*/
```

## 28、循环嵌套
循环嵌套：循环语句中嵌套其他循环语句
嵌套层次越多，复杂度越高

实例1、打印乘法口诀表
```java
for (int i = 1; i <= 9; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print(j + " * " + i + " = " + (i * j) + "\t");
    }
    System.out.println();
}
/*
1 * 1 = 1   
1 * 2 = 2   2 * 2 = 4   
1 * 3 = 3   2 * 3 = 6   3 * 3 = 9  
...
*/
```

实例2、打印金字塔
```java
int sum = 5;  // 总行数

// 打印乘法口诀表
for (int i = 1; i <= sum; i++) {
    // 打印空格
    for (int j = 1; j <= sum - i; j++) {
        System.out.print(" ");    
    }
    
    // 打印星星
    for(int k = 1; k <= i; k++) {
        System.out.print("* ");
    }

    System.out.println();
}
/*
    * 
   * * 
  * * * 
 * * * * 
* * * * * 
*/ 
```

## 29、方法的定义
方法method，函数function

方法本质：
方便使用者重复调用的一段代码块

前提：
方法在主类中定义，并且由主方法直接调用

```java
public static 返回值类型 方法名称([参数类型 参数名...]){
    // 方法要执行的代码
    [return[返回值];]
}
```
返回值可以使用基本数据类型和引用数据类型

返回值类型要和定义返回值类型一致
不返回值使用`void`， 可以使用`return`结束调用

方法名命名规范：
第一个单词小写，后续单词首字母大写

## 30、方法重载
定义：方法名相同，参数的类型或个数不同的时候就称为方法重载
和返回值没有关系
开发原则：
方法重载，建议相同的返回值

eg:
```java
System.out.println(10);
System.out.println('A');
System.out.println("hello");
```
自定义方法重载
```java

public static void main(String[] args) {
    int resultA = sum(10, 10);

    int resultB = sum(10, 10, 10);

    double resultC = sum(10.1, 10.2);

    System.out.println(resultA);  // 20
    System.out.println(resultB);  // 30
    System.out.println(resultC);  // 20.299999999999997

}

// 定义求和方法
public static int sum(int a, int b) {
    return a + b;
} 

public static int sum(int a, int b, int c) {
    return a + b + c;
} 

public static double sum(double a, double b) {
    return a + b;
} 
   

```

## 31、方法递归调用
递归调用：一个方法自己调用自己

注意：
1、一定要设置递归调用的结束条件
2、每次调用一定要修改传递的参数条件

递归不建议用，处理不当会造成堆栈溢出

while实现1-10累加
```java
int x = 1;
int sum = 0;

while (x <= 10) {          // 结束条件
    sum += x;
    x++;                   // 参数条件 
}
System.out.println(sum);   // 55
```

递归实现1-10累加
```java
public static void main(String[] args) {
    int s = sum(10);
    System.out.println(s);  // 55
}

public static int sum(int num) {
    if (num == 1) {                   // 结束条件
        return 1;
    } 
    else {
        return num + sum(num - 1);   // 参数变化
    }
} 
```
