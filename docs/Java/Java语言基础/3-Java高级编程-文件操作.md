# 第15 章 ： 文件操作
## 67 File类基本操作

文件操作系统操作类：
java.io.File

文件创建，删除，重命名

File类基本使用
File 实现了Comparable接口
```java
// 构造方法
public File(String pathname)
public File(String parent, String child)

// 创建文件
public boolean createNewFile() throws IOException

// 文件存在
public boolean exists()

// 删除文件
public boolean delete()
```

示例：
```java
import java.io.File;
import java.io.IOException;

class Demo {
    public static void main(String[] args) throws IOException {
        File file = new File("./demo.txt");

        if(file.exists()){
            boolean ret = file.delete();
            System.out.println("删除结果：" + ret);

        } else{
            boolean ret =  file.createNewFile();
            System.out.println("创建结果：" + ret);
        }
    }
}
```

## 68 File类操作深入
1、路径分隔符
Windows分隔符 "\"
Linux分隔符  "/"
路径分隔符常量 File.separator

2、文件操作流程
```
程序 -> JVM -> 操作系统函数 -> 文件处理
```

重复删除或创建的时候会有延时情况，
建议：文件名不要重名

3、创建文件的时候父级目录必须存在
```java
// 获取父路径
public File getParentFile()

// 创建目录
public boolean mkdirs()
```

示例
```java
import java.io.File;
import java.io.IOException;

class Demo {
    public static void main(String[] args) throws IOException {
        File file = new File("./dir/demo/demo.txt");
        File parentFile = file.getParentFile();

        if (!parentFile.exists()) {
            parentFile.mkdirs();
        }

        file.createNewFile();
    }
}
```

## 69 获取文件信息
涉及文件本身操作，不涉及文件内容处理
```java
// 是否可读
public boolean canRead()

// 是否可写
public boolean canWrite()

// 是否可执行
public boolean canExecute()

// 是否为文件
public boolean isFile()

// 是否为目录
public boolean isDirectory()

// 获取文件长度 字节
public long length()

// 最后修改时间 13位时间戳
public long lastModified()

// 列出目录内容
public File[] listFiles()

```
示例
```java
import java.io.File;

class Demo {
    public static void main(String[] args) {
        File file = new File("./dir/demo");

        System.out.println(file.canRead()); // true
        System.out.println(file.canWrite());  // true
        System.out.println(file.canExecute()); // false

        System.out.println(file.isFile()); // true
        System.out.println(file.isDirectory());  // false

        System.out.println(file.length());  // 135 字节

        System.out.println(file.lastModified()); // 1574952161000

        File[] list = file.listFiles();
        for (File f : list) {
            System.out.println(f);
        }
        // ./dir/demo/demo.txt

    }
}
```

## 70 综合案例：列出目录结构
```java
import java.io.File;

class Demo {
    public static void main(String[] args) {
        File file = new File("./dir");
        listDir(file);
    }

    public static void listDir(File file){
        if(file.isDirectory()){
            File[] files = file.listFiles();
            
            if(files != null){
                for(File f: files){
                    listDir(f);
                }
            }
        } else{
            System.out.println(file);
        }
    }
}
```

## 71 综合案例：文件批量更名

```java
import java.io.File;

class Demo {
    public static void main(String[] args) {
        long start = System.currentTimeMillis();

        File file = new File("./dir");
        renameDir(file);

        long end = System.currentTimeMillis();
        System.out.println("花费时间：" + (end - start));
    }

    public static void renameDir(File file){
        if(file.isDirectory()){
            File[] files = file.listFiles();

            if(files != null){
                for(File f: files){
                    renameDir(f);
                }
            }
        } else{

            if (file.getName().contains(".")){
                int endPos = file.getName().lastIndexOf(".");
                String name = file.getName().substring(0, endPos);

                File newFile = new File(file.getParent(), name + ".txt");

                System.out.println(file.getName());
                System.out.println(newFile);
                
                file.renameTo(newFile);
            }
        }
    }
}
```

# 第16章 字节流与字符流
## 72 流的基本概念
File类是唯一一个与文件本身有关的程序处理类
File类只能够操作文件本身，而不能操作文件内容

IO操作：输入输出操作

java.io 抽象类
```
        输出            输入
字节流：OutputStream, InputStream
字符流：Writer,       Reader
```

文件处理流程：
1、File找到一个文件
2、通过字节流或字符流的子类为父类对象实例化
3、利用字节流或字符流中的方法实现数据出入与输出操作
4、流的操作属于资源操作，资源操作必须进行关闭

## 73 OutputStream字节输出流

实现代码
```java
public interface AutoCloseable {
    void close() throws Exception;
}

public interface Closeable extends AutoCloseable {
    public void close() throws IOException;
}

public interface Flushable {
    void flush() throws IOException;
}

public abstract class OutputStream 
    implements Closeable, Flushable{

    public abstract void write(int b) throws IOException;
    public void write(byte b[]) throws IOException;
    public void write(byte b[], int off, int len) throws IOException;
}

// 子类
public class FileOutputStream extends OutputStream{
    // 覆盖
    public FileOutputStream(File file) throws FileNotFoundException

    // 追加
    public FileOutputStream(File file, boolean append) 
        throws FileNotFoundException;
}

```

内容输出到文件
```java
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

class Demo{
    public static void main(String[] args) throws IOException {
        File file = new File("demo/demo.txt");

        // 父级目录不存在则创建
        if(!file.getParentFile().exists()){
            file.getParentFile().mkdir();
        }

        String message = "这是输出的内容";

        // 将字符串转换为字节数组输出到文件，并关闭文件
        FileOutputStream output = new FileOutputStream(file);
        output.write(message.getBytes());
        output.close();
    }
}
```

自动关闭的写法
```java
try(FileOutputStream output = new FileOutputStream(file)){
    output.write(message.getBytes());
}catch (IOException e){
    e.printStackTrace();
}
```

使用追加换行输出
```java
String message = "这是输出的内容\r\n";

FileOutputStream output = new FileOutputStream(file, true);
output.write(message.getBytes());
output.close();
```

## 74 InputStream字节输入流

```java
public abstract class InputStream implements Closeable{
    // 读取单个字节数据，读到文件底部返回-1
    public abstract int read() throws IOException;

    // 读取一组字节数据，返回读取的个数，文件底部返回-1
    public int read(byte b[]) throws IOException;
    public int read(byte b[], int off, int len) throws IOException;
}
```

文件尾部返回 -1， 表示文件读取完成

子类
```java
public class FileInputStream extends InputStream{
    public FileInputStream(String name) throws FileNotFoundException
    public FileInputStream(File file) throws FileNotFoundException
}
```

读取示例
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

class Demo{
    public static void main(String[] args) throws IOException {
        File file = new File("demo/demo.txt");

        FileInputStream input = new FileInputStream(file);

        // 开辟缓冲区读取数据
        byte[] data = new byte[1024];
        int len = input.read(data);
        System.out.println("["  + new String(data, 0, len) + "]");

        input.close();

    }
}
```

## 75 Writer字符输出流
Writer可以直接输出字符串

```java
public abstract class Writer 
    implements Appendable, Closeable, Flushable{
        public void write(char cbuf[]) throws IOException;
        public void write(String str) throws IOException;
    }

public class OutputStreamWriter extends Writer

public class FileWriter extends OutputStreamWriter{
    public FileWriter(String fileName, boolean append);
    public FileWriter(String fileName)
    public FileWriter(File file)
    public FileWriter(File file, boolean append)
}
```
代码实例
```java
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;


class Demo{
    public static void main(String[] args) throws IOException {
        File file = new File("demo/demo.txt");

        FileWriter writer = new FileWriter(file);

        writer.write("hello java");
        writer.append("你好！java!");

        writer.close();

    }
}
```

## 76 Reader字符输入流
继承关系
```java
public abstract class Reader implements Readable, Closeable

public class InputStreamReader extends Reader

public class FileReader extends InputStreamReader{
    public FileReader(File file);
    public FileReader(String fileName);    
}

```

读取示例
```java
import java.io.File;
import java.io.FileReader;
import java.io.IOException;


class Demo{
    public static void main(String[] args) throws IOException {
        File file = new File("demo/demo.txt");

        FileReader reader = new FileReader(file);

        char[] data= new char[1024];
        int len = reader.read(data);
        System.out.println(new String(data, 0, len));

        reader.close();

    }
}
```

字符流读取只能按照数组数据读取

## 77 字节流与字符流的区别

不使用close关闭
使用字节流输出 OutputStream 正常输出
使用字符流输出 Writer 无法输出，使用了缓冲区

close会强制刷新缓冲区（flush）

字节流不使用缓冲区，字符流使用缓冲区

## 78 转换流
字节流与字符流操作的功能转换

```java
import java.io.*;

class Demo{
    public static void main(String[] args) throws IOException {
        File file = new File("demo/demo.txt");

        // 字节流转字符流操作
        OutputStream out = new FileOutputStream(file);
        Writer wirter = new OutputStreamWriter(out);

        wirter.write("你好");

        wirter.close();
    }
}
```

继承关系
```java
OutputStream(Closeable, Flushable)
    -FileOutputStream

InputStream(Closeable)
    -FileInputStream
    
Writer(Appendable, Closeable, Flushable)
    -OutputStreamWriter
        -FileWriter

Reader(Readable, Closeable)
    -InputStreamReader
        -FileReader
```

缓存，程序中间缓冲区

字节数据：101010101...

## 79 综合实战：文件拷贝
实现文件拷贝操作
使用字节流

方案一：
    全部读取，一次性输出
方法二：
    每次读取一部分，输出一部分

```java
import java.io.*;


class FileUtil {

    public static void copyFile(String src, String target) throws IOException {

        InputStream input = new FileInputStream(src);
        OutputStream output = new FileOutputStream(target);

        byte[] data = new byte[1024];
        int len = 0;

        while ((len = input.read(data)) != -1) {
            output.write(data, 0, len);
        }

        input.close();
        output.close();

    }

    public static void copyDir(String src, String target) throws IOException {
        File srcFile = new File(src);
        File targetFile = new File(target);

        if (!targetFile.exists()) {
            targetFile.mkdirs();
        }

        File[] results = srcFile.listFiles();

        if (results != null) {
            for (File file : results) {
                String fileName = targetFile + File.separator + file.getName();

                if (file.isDirectory()) {
                    copyDir(file.getPath(), fileName);
                } else {
                    copyFile(file.getPath(), fileName);
                }
            }
        }
    }
}


class Demo {
    public static void main(String[] args) throws IOException {
        FileUtil.copyDir("demo", "demo2");
        System.out.println("拷贝完成");
    }
}
```

如果拷贝目录则使用递归拷贝

# 第17 章 ： IO操作深入
## 80 字符编码
常用的编码
1、GBK/GB2312 国标编码， GB2312简体中文，GBK包含简体和繁体
2、ISO8859-1 国际通用编码，描述所有字母
3、UNICODE 16进制存储，描述所有问题
4、UTF 象形文字部分使用16进制，普通字母采用ISO8859-1，主要使用UTF-8

列出本机属性
```java
System.getProperties().list(System.out);
```
项目中出现乱码问题就是编码和解码标准不统一

## 81 内存操作流
文件操作流 以文件为操作终端，InputStream、OutputStream

内存操作流
1、字节内存操作流 ByteArrayOutputStream ByteArrayInputStream
2、字符内存操作流 CharArrayWriter CharArrayReader

继承关系
```java
OutputStream
    -FileOutputStream
    -ByteArrayOutputStream

InputStream
    -FileInputStream
    -ByteArrayInputStream 

Writer
    -OutputStreamWriter
        -FileWriter
    -CharArrayWriter

Reader
    -InputStreamReader
        -FileReader
    -CharArrayReader

```

示例：利用内存流小写转大写操作
```java
import java.io.*;

class Demo{
    public static void main(String[] args) throws IOException {
        String message = "hello java";

        // 将数据保存到内存流中
        InputStream input = new ByteArrayInputStream(message.getBytes());
        OutputStream output = new ByteArrayOutputStream();

        int data = 0;

        // 每次读取一个数据
        while ((data = input.read())!=-1){
            output.write(Character.toUpperCase(data));
        }

        System.out.println(output);
        // HELLO JAVA

        output.close();
        input.close();
    }
}
```

## 82 管道流

```
发送信息 <- 管道 -> 接收信息
```

字节管道流 PipedInputStream, PipedOutputStream
字符管道流 PipedReader, PipedWriter


继承关系
```java
InputStream
    -PipedInputStream

OutputStream
    -PipedOutputStream

Reader
    -PipedReader

Writer
    -PipedWriter
```

管道发送接收数据
```java
import java.io.*;

class Sender implements Runnable {
    private PipedOutputStream output;

    public Sender() {
        this.output = new PipedOutputStream();
    }

    @Override
    public void run() {
        try {
            this.output.write("你好".getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            this.output.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public PipedOutputStream getOutput() {
        return this.output;
    }
}

class Receiver implements Runnable {
    private PipedInputStream input;

    public Receiver() {
        this.input = new PipedInputStream();
    }

    @Override
    public void run() {

        try {
            byte[] data = new byte[1024];
            int len = this.input.read(data);
            System.out.println(new String(data, 0, len));
            // 你好
            
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            this.input.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public PipedInputStream getInput() {
        return this.input;
    }
}

class Demo {
    public static void main(String[] args) throws IOException {
        Sender sender = new Sender();
        Receiver receiver = new Receiver();

        // 管道连接
        sender.getOutput().connect(receiver.getInput());

        new Thread(sender).start();
        new Thread(receiver).start();
    }
}
```

## 83 RandomAccessFile
随机读取类，可以移动文件指针

```java
public RandomAccessFile(String name, String mode)
```

```java
import java.io.*;

class Demo {
    public static void main(String[] args) throws IOException {
        // 写入
        RandomAccessFile writer = new RandomAccessFile("demo.txt", "rw");
        writer.write("你好世界".getBytes());
        writer.close();

        // 读取
        RandomAccessFile reader = new RandomAccessFile("demo.txt", "rw");
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }

        writer.close();
    }
}
```

# 第18 章 ： 输入与输出支持
## 84 打印流
设计思想：装饰设计模式
为OutputStream 类实现一层包装
PrintStream
PrintWriter

继承关系
```java
OutputStream
    -FilterOutputStream
        -PrintStream
Writer
    -PrintWriter
```

```java
import java.io.*;

class Demo {
    public static void main(String[] args) throws IOException {

        PrintWriter writer = new PrintWriter(new FileWriter("demo.txt"));
        
        // 换行输出
        writer.println("你好");

        // 格式化输出
        writer.printf("姓名 %s, 年龄: %s", "小强", 23);

        writer.close();
    }
}
```

只要是文件内容输出时都使用打印流

## 85 System类对IO的支持
System是系统类
1、标准输出（显示器）
2、错误输出
3、标准输入（键盘）

```java
public final class System {
    public final static InputStream in = null;
    public final static PrintStream out = null; // 黑色字体
    public final static PrintStream err = null; // 红色字体
}
```

修改输出位置
```java
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;

class Demo {
    public static void main(String[] args) throws IOException {
        System.setErr(new PrintStream(new FileOutputStream(new File("demo.txt"))));
        System.err.println("你好");
    }
}
```

接收键盘输入（一般不用此方法）
```java
import java.io.IOException;
import java.io.InputStream;

class Demo {
    public static void main(String[] args) throws IOException {
        InputStream input = System.in;
        System.out.println("请输入姓名：");
        byte[] data = new byte[1024];
        int len = input.read(data);

        System.err.println(new String(data, 0, len));
    }
}
```

## 86 BufferedReader缓冲输入流
JDK < 1.5

缓冲字符输入流
继承关系
```java
Reader
    -BufferedReader
```

代码示例
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

class Demo {
    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("请输入：");
        String msg = reader.readLine();
        System.out.println(msg);
    }
}
```

## 87 Scanner扫描流
JDK > 1.5
替代BufferedReader

构造函数
判断是否有数据 public boolean hasNext()
读取数据      public String next()
设置分隔符    

```java
import java.io.IOException;
import java.util.Scanner;

class Demo {
    public static void main(String[] args) throws IOException {
        Scanner scanner = new Scanner(System.in);
        System.out.println("请输入年龄：");
        if(scanner.hasNextInt()){
            int age = scanner.nextInt();
            System.out.println("您输入的年龄是：" + age);
        } else{
            System.out.println("输入不正确");
        }
        scanner.close();
    }
}
```

可以结合正则进行判断验证
```java
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Scanner;

class Demo {
    public static void main(String[] args) throws ParseException {
        Scanner scanner = new Scanner(System.in);

        System.out.println("请输入生日：");
        if (scanner.hasNext("\\d{4}-\\d{2}-\\d{2}")) {
            String msg = scanner.next("\\d{4}-\\d{2}-\\d{2}");
            System.out.println("您输入的年龄是：" + new SimpleDateFormat("yyyy-MM-dd").parse(msg));
        } else {
            System.out.println("输入不正确");
        }

        scanner.close();
    }
}
```

读取文件
```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

class Demo {
    public static void main(String[] args) throws FileNotFoundException {
        Scanner scanner = new Scanner(new File("demo.txt"));

        // 设置换行分隔符
        // scanner.useDelimiter("\n");

        while (scanner.hasNext()) {
            System.out.println(scanner.next());
        }

        scanner.close();
    }
}
```

开发中:
输出使用PrintWriter打印流
输入使用Scanner扫描流

# 第19 章 ： 对象序列化
## 88 对象序列化基本概念

对象序列化：
将内存中保存的对象以二进制数据的形式处理，
实现对象的保存或者网络传输

```
                     保存到文件
堆内存 - 二进制转换 ->  保存到数据库
                     发送到服务器
```

要序列化的对象必须实现java.io.Serializable 接口
没有任何方法，只是描述一种能力

示例
```java
import java.io.Serializable;


class Person implements Serializable {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

```

## 89 序列化与反序列化处理
继承关系
```java
InputStream(ObjectInput, ObjectStreamConstants)
    -ObjectInputStream

OutputStream(ObjectOutput, ObjectStreamConstants)
    -ObjectOutputStream
```

代码示例
```java
import java.io.*;

class Person implements Serializable {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}

class Demo {
    private static final File  SAVE_FILE = new File("demo.person");

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        Person person = new Person("Tom", 23);
        // saveObject(person);

        System.out.println(loadObject());
        // Person@15aeb7ab
    }

    // 序列化
    public static void saveObject(Object obj) throws IOException {
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(SAVE_FILE));
        oos.writeObject(obj);
        oos.close();
    }

    // 反序列化
    public static Object loadObject() throws IOException, ClassNotFoundException {
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(SAVE_FILE));
        Object obj = ois.readObject();
        ois.close();
        return obj;
    }
}
```
实际开发中不直接操作ObjectInputStream、ObjectOutputStream

## 90 transient关键字
表示进行序列化处理时，不处理被transient关键字修饰的字段
不常用，知道即可

IO继承体系整合
```java
// 字节流：
OutputStream(Closeable, Flushable)
    -FileOutputStream
    -ByteArrayOutputStream
    -PipedOutputStream
    -FilterOutputStream
        -PrintStream
    -ObjectOutputStream


InputStream(Closeable)
    -FileInputStream
    -ByteArrayInputStream
    -PipedInputStream
    -ObjectInputStream

// 字符流：
Writer(Appendable, Closeable, Flushable)
    -OutputStreamWriter
        -FileWriter      
    -CharArrayWriter
    -PipedReader
    -PrintWriter
    -BufferedWriter

Reader(Readable, Closeable)
    -InputStreamReader
        -FileReader
    -CharArrayReader
    -PipedWriter
    -BufferedReader
```

# 第20 章 ： JavaIO编程案例
## 91 数字大小比较
输入3个整数，并求出3个整数最大值和最小值
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;


class InputUtil {
    /**
     * 读取指定个数的整数输入
     *
     * @param num 指定要输入的整数个数
     * @return 所有读取的整数数组
     * @throws IOException
     */
    public static int[] getIntList(int num) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

        System.out.println("请输入" + num + "个整数：");

        int[] list = new int[num];
        int count = 0;

        while (count < num) {
            String msg = reader.readLine();

            if (msg.matches("\\d+")) {
                list[count++] = Integer.parseInt(msg);
            } else {
                System.out.println("请输入整数");
            }
        }

        reader.close();
        return list;
    }
}


class NumberUtil {
    /**
     * 获取int 型数组中最大值和最小值
     *
     * @param list 整数数组
     * @return int[] {max, min}
     */
    public static int[] getMaxMin(int[] list) {
        int max = list[0];
        int min = list[0];

        for (int x : list) {
            if (x > max) {
                max = x;
            }
            if (min > x) {
                min = x;
            }
        }
        return new int[]{max, min};
    }

}


class Demo {
    public static void main(String[] args) throws IOException {

        // 读取3个数据
        int[] list = InputUtil.getIntList(3);
        int[] data = NumberUtil.getMaxMin(list);

        System.out.println("最大值：" + data[0]);
        System.out.println("最小值：" + data[1]);

    }
}
```

## 92 文件保存
从键盘输入文件名和文件内容，然后将文件内容保存到文件中
1、定义接口
2、工具类
3、实现接口类
4、工厂类
5、测试函数

```java
import java.io.*;


class InputUtil {
    private static final BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

    public static String getInput(String prompt) {

        System.out.println(prompt);
        String msg = null;

        while (true) {
            try {
                msg = reader.readLine();
                if (!"".equals(msg)) {
                    break;
                } else {
                    System.out.println("请输入非空字符串：");
                }
            } catch (IOException e) {

            }
        }
        return msg;
    }
}

interface IFileService {
    public static final String FILE_DIR = "demo";

    public boolean save();
}


class FileServiceImpl implements IFileService {

    private String filename;
    private String content;

    public FileServiceImpl() {
        this.filename = InputUtil.getInput("请输入文件名");
        this.content = InputUtil.getInput("请输入文件内容");
    }

    @Override
    public boolean save() {
        String fullname = this.FILE_DIR + File.separator + this.filename;

        PrintWriter writer = null;
        try {
            writer = new PrintWriter(fullname);
            writer.print(this.content);

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            if (writer != null) {
                writer.close();
            }

        }
        return false;
    }
}


class Factory{
    private Factory(){}

    public static FileServiceImpl getInstance(){
        return new FileServiceImpl();

    }
}

class Demo {
    // 项目启动时创建文件夹
    static {
        File file = new File(IFileService.FILE_DIR);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    public static void main(String[] args) throws IOException {
        FileServiceImpl fileService = Factory.getInstance();
        fileService.save();
    }
}
```

## 93 字符串逆序显示
键盘传入多个字符串到程序中，并将它们按照逆序输出到屏幕

设计考虑：
1、字符串内容随时修改，使用StringBuffer
2、由用户自己决定是否继续输入

实现步骤
1、定义接口 操作标准
2、定义实现类
3、定义工厂类
4、编写辅助类
5、编写测试类

实现代码
IStringService.java
```java
public interface IStringService {
    public void append(String str);
    public String[] reverse();
}
```

StringServiceImpl.java
```java
public class StringServiceImpl implements IStringService{
    private StringBuffer data = new StringBuffer();

    public void append(String str){
        this.data.append(str).append("|");
    }

    public String[] reverse(){
        String[] list = this.data.toString().split("\\|");

        String[] tmp = new String[list.length];

        for(int i=0; i<list.length; i++){
            tmp[i] = list[list.length - i - 1];
        }

        return tmp;
    }
}
```

InputUtil.java
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

class InputUtil {
    private static final BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

    public static String getString(String prompt) {

        System.out.println(prompt);
        String msg = null;

        while (true) {
            try {
                msg = reader.readLine();
                if (!"".equals(msg)) {
                    break;
                } else {
                    System.out.println("请输入非空字符串：");
                }
            } catch (IOException e) {

            }
        }
        return msg;
    }

    public static void main(String[] args) {
        System.out.println(InputUtil.getString("请输入"));
    }
}
```

Factory.java
```java
class Factory{
    private Factory(){}

    public static StringServiceImpl getInstance(){
        return new StringServiceImpl();

    }
}
```

Menu.java
```java
import java.util.Arrays;

public class Menu {
    private StringServiceImpl stringServiceImpl;

    public Menu() {
        this.stringServiceImpl = Factory.getInstance();
        this.choose();
    }

    public void choose() {
        help();

        String msg = InputUtil.getString("请选择：");
        switch (msg) {
            case "1":
                this.stringServiceImpl.append(InputUtil.getString("请输入字符串："));
                choose();

            case "2":
                System.out.println(Arrays.toString(this.stringServiceImpl.reverse()));
                choose();

                case "0":
                System.exit(0);

            default:
                choose();
        }

    }

    public static void help() {
        System.out.println("[1]输入内容：");
        System.out.println("[2]输出反转内容：");
        System.out.println("[0]退出");
    }
}
```

Demo.java
```java
class Demo{
    public static void main(String[] args) {
        new Menu();
    }
}
```

## 94 数据排序处理
键盘输入数据 `姓名:成绩|姓名:成绩`

eg:
```
Tom:89|Jack:91|Tony:86
```

按照成绩由高到低排序

思路：
Comparable + Arrays

代码实现
IStudentService.java
```java
public interface IStudentService {
    Student[] getData();
}

```

Student.java
```java
public class Student implements Comparable<Student>{
    private String name;
    private double score;

    public Student(String name, double score) {
        this.name = name;
        this.score = score;
    }

    @Override
    public String toString() {
        return "Student<" +  name + ", " + score + '>';
    }

    @Override
    public int compareTo(Student obj) {
        return Double.compare(obj.score, this.score);
    }
}

```

StudentServiceImpl.java
```java
import java.util.Arrays;

public class StudentServiceImpl implements IStudentService {
    private String content;
    private Student[] students;

    public StudentServiceImpl(String content) {
        this.content = content;
        this.handle();
    }

    private void handle(){
        String[] list = this.content.split("\\|");
        this.students = new Student[list.length];

        for(int i=0; i<list.length; i++){
            String[] items = list[i].split(":");
            this.students[i] = new Student(items[0], Double.parseDouble(items[1]));
        }
    }

    @Override
    public Student[] getData() {
        Arrays.sort(this.students);
        return this.students;
    }
}

```

Factory.java
```java
public class Factory {
    private Factory(){}

    public static StudentServiceImpl getInstance(){
        return new StudentServiceImpl(InputUtil.getString("请输入数据："));
    }
}

```

Demo.java
```java
import java.util.Arrays;

public class Demo {
    public static void main(String[] args) {
        // Tom:89|Jack:91|Tony:86
        System.out.println(Arrays.toString(Factory.getInstance().getData()));
        // [Student<Jack, 91.0>, Student<Tom, 89.0>, Student<Tony, 86.0>]
    }
}
```

## 95 数据排序处理深入
扩展上一节内容，将输入信息保存到文件中，还可以添加信息，并且查看全部数据

确认保存位置
格式统一

FileUtil.java文件读取工具类
```java
package util;

import java.io.*;
import java.util.Scanner;

public class FileUtil {
    public static String read(File file) throws FileNotFoundException {
        Scanner scanner = new Scanner(file);
        StringBuilder contents = new StringBuilder();

        while (scanner.hasNext()) {
            contents.append(scanner.next());
        }

        scanner.close();

        return contents.toString();
    }

    public static void append(File file, String content) throws IOException {
        PrintWriter writer = new PrintWriter(new FileWriter(file, true));
        writer.write(content);
        writer.close();
    }

    public static void save(File file, String content) throws IOException {
        PrintWriter writer = new PrintWriter(file);
        writer.write(content);
        writer.close();
    }

    public static void main(String[] args) throws IOException {
        File file = new File("demo.txt");

        FileUtil.save(file, "你好");
        FileUtil.append(file, "你也好");
        System.out.println(FileUtil.read(file));
    }
}

```

## 96 奇偶数统计
输入字符串拆分后统计奇数，偶数个数

接口INumberService.java
```java
public interface INumberService {
    public int[] handle();
}

```

实现类 NumberServiceImpl.java
```java
import util.InputUtil;

public class NumberServiceImpl implements INumberService{
    private String str;

    public NumberServiceImpl(){
        this.str = InputUtil.getString("请输入数字串：");
    }

    @Override
    public int[] handle() {

        String[] numbers = this.str.split("");

        // 偶数， 奇数
        int[] result = new int[]{0, 0};
        for(String num : numbers){
            if(Integer.parseInt(num) % 2 == 0){
                result[0] ++;
            } else{
                result[1] ++;
            }
        }
        return result;
    }
}

```

测试类 Demo.java
```java
import java.util.Arrays;

public class Demo {
    public static void main(String[] args) {
        System.out.println(Arrays.toString(new NumberServiceImpl().handle()));

        // 1234567890
        // [5, 5]
    }
}

```

## 97 用户登录
输入用户名和密码 root 123456
如果没有输入则提示输入
输入错误3次退出
提示登录成功

真实业务只实现核心功能，辅助逻辑处理交给代理控制

接口类
IUserService
    isExit
    login

实现类
UserServiceImpl

代理类
UserServiceProxy

工厂类
Factory

测试类
Demo

实现代码
IUserService.java
```java
public interface IUserService {
    public boolean isExit();
    public boolean login(String name, String password);
}

```

UserServiceImpl.java
```java
public class UserServiceImpl implements IUserService{
    private int tryCount = 0;

    @Override
    public boolean isExit() {
        // 超过三次错误
        return this.tryCount >= 3;
    }

    /**
     * 实现核心逻辑
     */
    @Override
    public boolean login(String name, String password) {
        this.tryCount ++;

        if("root".equals(name) && "123456".equals(password)){
            return true;
        } else{
            return false;
        }
    }
}

```

UserServiceProxy.java
```java
import util.InputUtil;

public class UserServiceProxy implements IUserService {
    private IUserService userService;

    public UserServiceProxy(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean isExit() {
        return this.userService.isExit();
    }

    /**
     * 实现辅助逻辑
     */
    @Override
    public boolean login(String name, String password) {
        while (!this.isExit()) {
            String inputName = InputUtil.getString("请输入用户名：");
            String inputPassword = InputUtil.getString("请输入密码：");

            if (this.userService.login(inputName, inputPassword)) {
                System.out.println("登录成功");
                System.exit(0);
            } else {
                System.out.println("用户名或密码错误，请重试");
            }
        }

        System.out.println("重试次数过多，请稍后重试");
        return true;

    }
}

```

Factory.java
```java
import util.InputUtil;

public class Factory {
    private Factory(){}

    public static IUserService getInstance(){
        return new UserServiceProxy(new UserServiceImpl());
    }
}

```

Demo.java
```java
public class Demo {
    public static void main(String[] args) {
        Factory.getInstance().login(null, null);

    }
}

```

## 98 投票选举
1、输入候选人名单
2、统计每个候选人票数
3、显示最终投票结果
思路分析
```
1、定义数据结构：
Student
    name
    sid
    vote

2、操作接口类
IVoteService
    void inc(int sid)
    Student[] result() 排序数据
    Student[] getData() 未排序数据

3、实现类
VoteServiceImpl

4、工厂类
Factory

5、测试类
Demo
```

实现代码

数据结构 Student.java
```java
public class Student implements Comparable<Student> {
    private String name;
    private int sid;
    private int vote;

    public Student(String name, int sid, int vote) {
        this.name = name;
        this.sid = sid;
        this.vote = vote;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getSid() {
        return sid;
    }

    public void setSid(int sid) {
        this.sid = sid;
    }

    public int getVote() {
        return vote;
    }

    public void setVote(int vote) {
        this.vote = vote;
    }

    @Override
    public int compareTo(Student obj) {
        return obj.vote - this.vote;
    }

    @Override
    public String toString() {
        return String.format("[%s] %s - %s", sid, name, vote);
    }
}

```

接口 IVoteService.java
```java
public interface IVoteService {
    public void inc(int sid);

    public Student result();

    public Student[] getData();
}

```

实现类 VoteServiceImpl.java
```java
import util.InputUtil;

import java.util.Arrays;

public class VoteServiceImpl implements IVoteService {
    private Student[] students;

    public VoteServiceImpl() {
        this.students = new Student[]{
                new Student("张三", 1, 0),
                new Student("李四", 2, 0),
                new Student("王五", 3, 0),
        };
    }

    @Override
    public void inc(int sid) {
        for(Student s : this.students){
            if(s.getSid() == sid){
                s.setVote(s.getVote() + 1);
            }
        }
    }

    @Override
    public Student result() {
        Arrays.sort(this.students);
        return this.students[0];
    }

    @Override
    public Student[] getData() {
        return this.students;
    }
}

```

工产类 Factory.java
```java
public class Factory {
    private Factory(){}

    public static IVoteService getInstance(){
        return new VoteServiceImpl();
    }
}

```

菜单类 Menu.java
```java
import util.InputUtil;

import java.util.Arrays;

public class Menu {
    private IVoteService voteService;

    public Menu() {
        this.voteService = Factory.getInstance();
        this.choose();
    }

    public void choose(){
        this.help();
        String num = InputUtil.getString("请选择：");

        switch (num){
            case "1":
                String sid = InputUtil.getString("请输入候选人id");
                this.voteService.inc(Integer.parseInt(sid));
                this.choose();
                break;
            case "2":
                System.out.println(Arrays.toString(this.voteService.getData()));
                this.choose();
                break;
            case "3":
                System.out.println(this.voteService.result());
                this.choose();
                break;
            case "0":
                System.out.println("拜拜...");
                System.exit(0);
            default:
                help();
                this.choose();
        }
    }

    public void help(){
        System.out.println("【1】候选人增加票数");
        System.out.println("【2】显示投票统计");
        System.out.println("【3】显示统计结果");
        System.out.println("【0】退出系统");
    }
}

```

测试类 Demo.java
```java
public class Demo {
    public static void main(String[] args) {
        new Menu();
    }
}

```


