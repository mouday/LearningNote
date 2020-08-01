# 第7 章 ： Java基础类库
## 26 StringBuffer类
String有两个常量池:
静态常量池，运行时常量池

String对象实例化直接赋值形式，可以保存到常量池中以便重用
```java
// 构造方法
public StringBuffer(String str)

// 追加
public synchronized StringBuffer append(String str)

// 插入
public synchronized StringBuffer insert(int offset, String str)

// 删除指定范围数据
public synchronized StringBuffer delete(int start, int end)

// 字符串内容反转
public synchronized StringBuffer reverse()

```
代码示例
```java

class Demo{
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer("hello");
        sb.append(" world");
        System.out.println(sb.toString());
        // hello world
    }
}
```

String 转换为 StringBuffer 使用构造方法
StringBuffer 转换为 String 使用toString

操作示例
```java
class Demo{
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer("hello");

        // 可以连续操作
        sb.append(" ").append("world");
        System.out.println(sb.toString());
        // hello world
        
        // 插入
        sb.insert(5, " Java");
        System.out.println(sb);
        // hello Java world

        // 删除
        sb.delete(5, 10);
        System.out.println(sb);
        // hello world
        
        // 反转
        sb.reverse();
        System.out.println(sb);
        // dlrow olleh

    }
}
```
类似功能类 StringBuilder
JDK >= 1.5

区别
String 字符串，内容不可修改
StringBuffer JDK>=1.0 线程安全, 使用了synchronized
StringBuilder JDK>=1.5 非线程安全

## 27 CharSequence接口
CharSequence描述字符串结构的接口

```java

public final class String
    implements java.io.Serializable, Comparable<String>, CharSequence

public final class StringBuffer
    extends AbstractStringBuilder
    implements java.io.Serializable, CharSequence

public final class StringBuilder
    extends AbstractStringBuilder
    implements java.io.Serializable, CharSequence
```

CharSequence接口方法
```java

public interface CharSequence{
    int length();
    char charAt(int index);
    CharSequence subSequence(int start, int end);
    public String toString();
}

```

## 28 AutoCloseable接口
AutoCloseable接口 用于资源的自动关闭
JDK >= 1.7
```java
public interface AutoCloseable {
    void close() throws Exception;
}
```

不使用自动关闭代码示例
```java

interface IMessage{
    public void send();
}

class MessageImpl implements IMessage{
    private String message;

    public MessageImpl(String message) {
        this.message = message;
    }

    @Override
    public void send() {
        System.out.println("发送消息： " + this.message);
    }

    public boolean open(){
        System.out.println("打开资源");
        return true;
    }

    public void close(){
        System.out.println("关闭资源");
    }
}

class Demo{
    public static void main(String[] args) {
        MessageImpl message = new MessageImpl("消息内容");
        if(message.open()){
            message.send();
            message.close();
        }
        /**
         * 打开资源
         * 发送消息： 消息内容
         * 关闭资源
         */

    }
}
```

结合异常处理语句实现资源自动关闭
```java
interface IMessage extends AutoCloseable{
    public void send();
}

class MessageImpl implements IMessage{
    private String message;

    public MessageImpl(String message) {
        this.message = message;
    }

    @Override
    public void send() {
        System.out.println("发送消息： " + this.message);
    }

    public boolean open(){
        System.out.println("打开资源");
        return true;
    }

    public void close(){
        System.out.println("关闭资源");
    }
}

class Demo{
    public static void main(String[] args) {
        try(MessageImpl message = new MessageImpl("消息内容")){
            if(message.open()){
                message.send();
            }
        }catch(Exception e){

        }

        /**
         * 打开资源
         * 发送消息： 消息内容
         * 关闭资源
         */

    }
}
```

## 29 Runtime类
Runtime描述运行时状态
一个JVM进程只允许提供一个Runtime，使用了单例设计模式
可以使用静态方法获取实例化对象
```java
public static Runtime getRuntime()
```

```java

class Demo {
    public static void main(String[] args) {
        Runtime run = Runtime.getRuntime();
        
        // 读取CPU内核数量
        System.out.println(run.availableProcessors());
        //  8

        // 获取最大可用内存空间 1/4
        System.out.println(run.maxMemory());

        // 获取可用内存空间 1/64
        System.out.println(run.totalMemory());

        // 获取空闲内存空间
        System.out.println(run.freeMemory());
        
        // 手工进行GC处理
        run.gc();

    }
}
```
GC (Garbage Collector) 垃圾收集器
由系统自动调用
或者使用Runtime类中的gc()方法，手工清除

## 30 System类
常用方法
```java
// 数组拷贝
public static native void arraycopy(Object src,  int  srcPos,
                                    Object dest, int destPos,
                                    int length);

// 获取时间数值
System.out.println(System.currentTimeMillis());
// 1573918888172

// 垃圾回收
public static void gc() {
    Runtime.getRuntime().gc();
}

```

## 31 Cleaner类
JDK>=1.9
Cleaner类提供对象清理操作
替代finialize()方法
C++提供了构造函数，析构函数
Java垃圾使用GC回收

```java

class Demo {
    public Demo() {
        System.out.println("构造函数");
    }

    @Override
    protected void finalize() throws Throwable {
        System.out.println("垃圾回收");
        super.finalize();
    }

    public static void main(String[] args) {
        Demo demo = new Demo();
        demo = null;
        System.gc();
        /**
         * 构造函数
         * 垃圾回收
         */
    }
}
```
不建议使用 finalize()方法, 使用AutoCloseable接口
使用Cleaner类，使用单独的线程去回收资源，能提高整体性能

## 32 对象克隆
```java
protected native Object clone() throws CloneNotSupportedException;

// 只有接口名，没有任何方法，只是能力标识接口
public interface Cloneable {
}
```
接口作用：
标准
能力
```java

class Demo implements Cloneable{
    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public static void main(String[] args) {
        Demo demo = new Demo();
        Demo demo2 = null;

        try {
            demo2 = (Demo)demo.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }

        System.out.println(demo);
        System.out.println(demo2);
        /**
         * Demo@2503dbd3
         * Demo@4b67cf4d
         */
    }
}
```

# 第8 章 ： 数字操作类
## 33 Math数学计算类
Math提供的方法都是static方法,都是基本数学公式

```java

Math.abs(-10) // 10
Math.max(10, 1) // 10
Math.pow(10, 2) //100.0
Math.sqrt(9) //3.0
Math.round(10.4) // 10
Math.round(10.5) // 11
```

```java

class MathUtil {
    private MathUtil() {
    }

    // 自定义保留位数
    public static double round(double num, int scale) {
        return Math.round(num * Math.pow(10, scale)) / Math.pow(10, scale);
    }
}


class Demo {
    public static void main(String[] args) {
        System.out.println(MathUtil.round(10.98766, 2)); // 10.99

    }
}
```

## 34 Random随机数生成类
```java
import java.util.Random;

class Demo {
    public static void main(String[] args) {
        
        Random random = new Random();
        // 产生随机数范围[0, 10)
        System.out.println(random.nextInt(10));

    }
}
```

彩票号码生成示例
```java
import java.util.Random;

/**
 * 随机示例
 * 36 选 7
 */
class Demo {
    public static int[] getCodeList(){
        int[] data = new int[7];
        int foot = 0;
        Random random = new Random();

        while (foot<7){
            int code = random.nextInt(37);
            if(isUse(code, data)){
                data[foot++] = code;
            }
        }
        return data;
    }

    // 检查号码是否可以使用，不能为0，不能重复
    public static boolean isUse(int code, int[] temp){
        if(code == 0){
            return false;
        }

        for(int x : temp){
            if(code == x){
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        int[] data = getCodeList();

        for(int x : data){
            System.out.print(x + ", ");
        }
        // 15, 19, 9, 11, 33, 2, 21, 

    }
}
```

## 35 大数字处理类
可以使用String保存,不过操作麻烦

继承体系
```
Object
    -Number
        -Integer
        -Byte
        -Long
        -Short
        -Float
        -Double
        -BigInteger
        -BigDecimal
    -Boolean
    -Character
```
BigInteger 和 BigDecimal使用方法基本相似

过大的数据也会影响程序性能，优先使用基础数据类型

减法运算
```java

import java.math.BigInteger;

class Demo{
    public static void main(String[] args) {
        BigInteger big1 = new BigInteger("98960973126687599871");
        BigInteger big2 = new BigInteger("98960973126687599872");

        System.out.println(big2.subtract(big1));
        // 1
    }
}
```

求余运算
```java
import java.math.BigInteger;

class Demo{
    public static void main(String[] args) {
        BigInteger big1 = new BigInteger("1001");
        BigInteger big2 = new BigInteger("10");
        BigInteger[] ret = big1.divideAndRemainder(big2);
        System.out.println(ret[0] + ", " +  ret[1]);
        // 100, 1
    }
}
```

使用BigDecimal实现四舍五入进位
```java
import java.math.BigDecimal;
import java.math.RoundingMode;

class MathUtil {
    private MathUtil() {
    }

    // 自定义保留位数
    public static double round(double num, int scale) {
        return new BigDecimal(num).divide(
            new BigDecimal(1.0), scale, RoundingMode.HALF_UP).doubleValue();
    }
}


class Demo {
    public static void main(String[] args) {
        System.out.println(MathUtil.round(10.98766, 2)); // 10.99

    }
}
```

Math使用的是基本数据类型，性能高于大数据处理类

# 第9 章 ： 日期操作类
## 36 Date日期处理类
Date类只是对long数据的一种包装

Date无参构造函数
```java
 public Date() {
        this(System.currentTimeMillis());
    }
 ``` 

示例
```java
import java.util.Date;

class Demo {
    public static void main(String[] args) {
        Date date = new Date();
        System.out.println(date);
        // Sun Nov 17 20:39:41 CST 2019

        // 日期转long
        long time = date.getTime();
        System.out.println(time);
        // 1573994381189

        // long转日期 增加1分钟
        Date date1 = new Date(time + 60 * 1000);
        System.out.println(date1);
        // Sun Nov 17 20:40:41 CST 2019
        
    }
}
```

## 37 SimpleDateFormat日期处理类
继承关系
```
abstract Format
    -abstract DataFormat
        -SimpleDateFormat
```

```java
// 日期格式化
public final String format (Object obj)

// 字符串转日期
public Date parse(String source) throws ParseException

```

日期格式化
```
年 yyyy
月 MM
日 dd
时 HH
分 mm
秒 ss
毫秒 SSS
```
指定字符串定义的时候，日期数字超过指定的范围会自动进位
```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

class Demo {
    public static void main(String[] args) {
        Date date = new Date();

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:MM:ss");

        // 日期转字符串
        String dateStr = sdf.format(date);
        System.out.println(dateStr);
        // 2019-11-17 20:11:35

        // 字符串转日期
        try {
            System.out.println(sdf.parse(dateStr));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        // Sun Nov 17 20:00:35 CST 2019

    }
}
```

数字格式化
```java

import java.text.NumberFormat;

class Demo {
    public static void main(String[] args) {
        double money = 323223210.09;

        System.out.println(NumberFormat.getInstance().format(money));
        // 323,223,210.09
    }
}
```
String 字符串可以向任何类型转换

# 第10 章 ： 正则表达式
## 38 认识正则表达式
JDK >= 1.4
使用正则方便进行数据验证处理，复杂字符串修改

实现字符串转数字
```java

class Demo {
    public static boolean isNumber(String temp){
        char[] chars = temp.toCharArray();
        for(char c : chars){
            if(c > '9' || c < '0'){
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        String number = "123";
        if(isNumber(number)){
            int i  = Integer.parseInt(number);
            System.out.println(i);
            // 123
        }
    }
}
```

使用正则表达式
```java
String number = "123";
if(number.matches("\\d+")){
    int i  = Integer.parseInt(number);
    System.out.println(i);
    // 123
}
```

## 39 常用正则标记
1、字符匹配
```
x   任意字符
\\  \
\n  换行
\t  制表符
```
2、字符集
```
[abc] 任意一个
[^abc]  不在其中任意一个
[a-zA-Z] 任意字母
[0-9] 一个数字
```
3、简化字符集
```
. 任意一个字符
\d 数字[0-9]
\D 等价于[^0-9]
\s 匹配任意空格，换行，制表符
\S 匹配非空格数据
\w 字母、数字、下划线等价于[a-zA-Z_0-9]
\W 非字母、数字、下划线等价于[^a-zA-Z_0-9]
```
4、边界匹配
```
^ 匹配开始
$ 匹配结束
```
5、数量
```
? 0次或1次
* 0次、1次或多次
+ 1次或多次
{n} 长度=n次
{n,} 长度>=n次
{n,m} 长度>=n and 长度<=m次
```
6、逻辑表达式,多个正则
```
XY X之后是Y
X|Y 或
() 整体描述
```

```java
String str = "123";
String regex = "\\d+";
System.out.println(str.matches(regex));
// true
```

## 40 String类对正则的支持
```java
public boolean matches(String regex)
public String replaceFirst(String regex, String replacement) 
public String replaceAll(String regex, String replacement)
public String[] split(String regex)
public String[] split(String regex, int limit) 
```

示例1：删除非字母和非数字
```java
String str = "asfasdfw3414^&*^&%^&wefwerfdc^&*&*fafdasd";
String regex = "[^a-zA-Z0-9]+";
System.out.println(str.replaceAll(regex, ""));
// asfasdfw3414wefwerfdcfafdasd
```

示例2：数字分隔拆分字符串
```java
String str = "sdasdf123123ffsadfsda232edasf";
String regex = "\\d+";
String[] list = str.split(regex);
for(String s : list){
    System.out.println(s);
}
/**
 * sdasdf
 * ffsadfsda
 * edasf
 */
```

示例3：判断字符串是否为数字
```java
String str = "10.1";
String regex = "\\d+(\\.\\d+)?";

if(str.matches(regex)){
    System.out.println(Double.parseDouble(str));
    // 10.1
}
```

示例4：判断字符串是否为日期
```java
import java.text.ParseException;
import java.text.SimpleDateFormat;

class Demo {

    public static void main(String[] args) throws ParseException {
        String str = "2019-11-17";
        String regex = "\\d{4}-\\d{2}-\\d{2}";

        if (str.matches(regex)) {
            System.out.println(new SimpleDateFormat("yyyy-MM-dd").parse(str));
            // Sun Nov 17 00:00:00 CST 2019
        }
    }
}
```
示例5：判断电话号码
电话号码
```
51283346      \\d{7,8}
010-51283346  (\\d{3}-)?
(010)51283346 (\(\\d{3}\))?
```
```java

class Demo {

    public static void main(String[] args) {
        String[] numbers = new String[]{
                "51283346",
                "010-51283346",
                "(010)51283346"
        };

        String regex = "((\\d{3}-)|(\\(\\d{3}\\)))?\\d{7,8}";

        for(String number : numbers){
            System.out.println(number.matches(regex));
        }
        /**
         * true
         * true
         * true
         */
    }
}
```
示例6：邮箱验证
用户名：数字、字母、下划线(不能开头)
域名：数字、字母、下划线
域名后缀：com、cn、net、com.cn、org

```java
String email = "google@qq.com";
String regex = "[0-9a-zA-Z]\\w+@\\w+\\.(com|cn|net|com.cn|org)";
System.out.println(email.matches(regex));
// true
```

## 41 java.util.regex包支持
Pattern 正则表达式编译
```java
private Pattern(String p, int f)
public static Pattern compile(String regex)

```
Mather 正则匹配
```java
public Matcher matcher(CharSequence input)
public boolean matches()
```

Pattern示例
```java
import java.text.ParseException;
import java.util.regex.Pattern;

class Demo {

    public static void main(String[] args) throws ParseException {
        String email = "ooxx12ooxx000ooxx";
        Pattern pattern = Pattern.compile("\\d+");
        String[] list = pattern.split(email);
        for (String s : list) {
            System.out.println(s);
        }

        /**
         * ooxx
         * ooxx
         * ooxx
         */
    }
}
```

Matcher示例
```java
import java.text.ParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Demo {

    public static void main(String[] args) throws ParseException {
        String number = "6687";
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(number);
        System.out.println(matcher.matches());
        // true

    }
}
```

拆分，替换，匹配使用String类就可以实现

String不具备的功能：

示例：提取sql中的变量名
```java
import java.text.ParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Demo {

    public static void main(String[] args) throws ParseException {
        String sql = "insert into student(name, age) values(#{name}, #{value})";

        Pattern pattern = Pattern.compile("#\\{\\w+\\}");
        Matcher matcher = pattern.matcher(sql);

        while (matcher.find()){
            System.out.println(matcher.group(0).replaceAll("#|\\{|\\}", ""));
        }
        /**
         * name
         * value
         */


    }
}
```

## 第11 章 ： 国际化程序实现
## 42 国际化程序实现原理
统一程序代码，根据不同国家实现不同语言描述
需要解决问题：
1、定义保存文字信息
2、根据不同区域语言编码读取文件信息

## 43 Locale类
Locale类：专门描述区域和语言编码的类

构造方法
```java
public Locale(String language)
public Locale(String language, String country)
```

国家语言代码
中文：zh_CN
美国：en_US

使用示例
```java
import java.util.Locale;

class Demo {

    public static void main(String[] args){

        Locale loc = new Locale("zh", "CN");
        System.out.println(loc);
        // zh_CN

    }
}
```

读取本地默认环境
```java
Locale loc = Locale.getDefault();
System.out.println(loc);
// zh_CN
```

使用常量
```java
Locale loc = Locale.CHINA;
System.out.println(loc);
// zh_CN
```

## 44 ResourceBundle读取资源文件
```java
public static final ResourceBundle getBundle(String baseName)
// baseName 没有后缀的文件名
```

资源文件 message.properties
```java
info="这是消息"
```

读取实例
```java
import java.io.UnsupportedEncodingException;
import java.util.ResourceBundle;

class Demo {

    public static void main(String[] args) throws UnsupportedEncodingException {

        ResourceBundle bundle = ResourceBundle.getBundle("message");

        // 解决中文乱码问题
        String message = new String(bundle.getString("info").getBytes("ISO-8859-1"), "utf-8");

        System.out.println(message);
        // "这是消息"

    }
}
```

## 45 实现国际化程序开发
CLASSPATH 下建立文件 
```
cat Message.properties
info=默认资源 

cat Message_zh_CN.properties
info=中文资源 

cat Message_en_US.properties
info=英文资源
```

执行程序会读取中文资源
```java
import java.io.UnsupportedEncodingException;
import java.util.ResourceBundle;

class Demo {

    public static void main(String[] args) throws UnsupportedEncodingException {

        ResourceBundle bundle = ResourceBundle.getBundle("message");

        // 解决中文乱码问题
        String message = new String(bundle.getString("info").getBytes("ISO-8859-1"), "utf-8");

        System.out.println(message);
        // 中文资源
    }
}
```

getBundle方法默认加载`Locale.getDefault()`

```java
public static final ResourceBundle getBundle(String baseName)
    {
        return getBundleImpl(baseName, Locale.getDefault(),
                             getLoader(Reflection.getCallerClass()),
                             getDefaultControl(baseName));
    }

```

使用重载函数，读取英文资源
```java
Locale locale = Locale.US;
ResourceBundle bundle = ResourceBundle.getBundle("message", locale);

// 解决中文乱码问题
String message = new String(bundle.getString("info").getBytes("ISO-8859-1"), "utf-8");

System.out.println(message);
// 英文资源
```

如果没有对应区域编码的资源文件，读取默认资源
读取流程：
```
指定区域的资源文件 > 默认的本地资源文件 > 公共的资源文件
```

## 46 格式化文本显示

格式化方法
```java
public class MessageFormat extends Format {
    public static String format(String pattern, Object ... arguments)
}
```

代码示例
```java

import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

class Demo {

    public static void main(String[] args) {
        // 占位符{}
        String message = "hello {0} date: {1}";
        System.out.println(MessageFormat.format(message, "admin", new SimpleDateFormat("yyyy-MM-dd").format(new Date())));
        // hello admin date: 2019-11-18
    }
}
```




