# 12 章 ： 开发支持类库
## 47 UUID类
UUID 根据时间戳实现自动无重复字符串定义
```java

// 获取UUID
public static UUID randomUUID()

// 根据字符串获取UUID
public static UUID fromString(String name)
```

应用：对文件进行自动命名处理

```java
import java.util.UUID;

class Demo {

    public static void main(String[] args) {
        System.out.println(UUID.randomUUID());
        // 85a8ccb1-88f8-4b3c-833d-d45b58e0204e

        System.out.println(UUID.fromString("85a8ccb1-88f8-4b3c-833d-d45b58e0204e"));
        // 85a8ccb1-88f8-4b3c-833d-d45b58e0204e
    }
}
```
## 48 Optional类
Optional 主要功能是进行null空指针处理
JDK >= 1.8

示例：单独处理null参数
```java

class Message{
    private String message;

    public Message(String message) {
        this.message = message;
    }

    public String getMessage(){
        return this.message;
    }
}

class Demo {
    public static void showMessage(Message message) {
        if(message != null){
            System.out.println(message.getMessage());
        }
    }

    public static void main(String[] args) {
        Message message = new Message("这是消息");
        showMessage(message);

        showMessage(null);
    }
}
```

几个方法
```java
public final class Optional<T> {

     public static<T> Optional<T> empty() {
        @SuppressWarnings("unchecked")
        Optional<T> t = (Optional<T>) EMPTY;
        return t;
    }

    public static <T> Optional<T> of(T value) {
        return new Optional<>(value);
    }

     public static <T> Optional<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    public T get() {
        if (value == null) {
            throw new NoSuchElementException("No value present");
        }
        return value;
    }

    public T orElse(T other) {
        return value != null ? value : other;
    }
}
```
使用示例
```java
import java.util.Optional;

/**
 * 存入
*/
Optional<String> optOf = Optional.of("message");
// Optional<String> optOfNull = Optional.of(null);
// java.lang.NullPointerException

Optional<String> optOfNullable = Optional.ofNullable("message");
Optional<String> optOfNullableNull = Optional.ofNullable(null);


/**
 * 取出
*/
System.out.println(optOf.get());
// message

System.out.println(optOfNullable.get());
// message

// System.out.println(optOfNullableNull.get());
// java.util.NoSuchElementException: No value present

System.out.println(optOf.orElse("default"));
// message

System.out.println(optOfNullable.orElse("default"));
// message

System.out.println(optOfNullableNull.orElse("default"));
// default
```

自定义函数实现
```java

class Demo {
    public static String getDefault(String object, String defaultValue){
        return object != null ? object : defaultValue;
    }

    public static void main(String[] args) {
        System.out.println(getDefault("message", "default"));
        // message

        System.out.println(getDefault(null, "default"));
        // default
    }
}
```

## 49 ThreadLocal类
ThreadLocal解决线程同步问题
```java
public T get() 
public void set(T value)
public void remove()
```

定义发送消息类

```java

class Message{
    private  String message ;

    public Message(String message) {
        this.message = message;
    }

    public String getMessage(){
        return this.message;
    }
}

class Channel{
    private static Message message;

    public static void setMessage(Message msg){
        message = msg;
    }

    public static void send(){
        System.out.println(message.getMessage());
    }

}
```

单线程下运行
```java
class Demo {
    public static void main(String[] args) {
        Message message = new Message("你好");
        Chanel.setMessage(message);
        Chanel.send();
        // 你好
    }
}
```

多线程下运行，出现数据覆盖现象
```java

class Demo {
    public static void main(String[] args) {
        new Thread(()->{
            Channel.setMessage(new Message("你好-1"));
            Channel.send();
        }, "线程-1").start();

        new Thread(()->{
            Channel.setMessage(new Message("你好-2"));
            Channel.send();
        }, "线程-2").start();

        new Thread(()->{
            Channel.setMessage(new Message("你好-3"));
            Channel.send();
        }, "线程-3").start();
        /**
         * 线程-2 你好-3
         * 线程-1 你好-1
         * 线程-3 你好-3
         */
    }
}
```

改造 Channel
```java

class Channel{

    // private static Message message;
    private static final ThreadLocal<Message> THREAD_LOCAL  = new ThreadLocal<Message>();

    public static void setMessage(Message msg){
        THREAD_LOCAL.set(msg);
    }

    public static void send(){
        System.out.println(Thread.currentThread().getName()
                + " "
                + THREAD_LOCAL.get().getMessage());
    }    
}

// 执行后数据对应
/**

线程-2 你好-2
线程-1 你好-1
线程-3 你好-3
*/
```
ThreadLocal， 只允许保存一个数据

## 50 定时调度
定时器进行定时任务处理，实现了一种间隔触发操作

java.util.TimerTask  定时任务处理 
java.util.Timer      任务启动

```java
// 定时启动
public void schedule(TimerTask task, long delay)

// 间隔任务
public void scheduleAtFixedRate(TimerTask task, long delay, long period)
```

定义任务
```java
import java.util.TimerTask;

class MyTask extends TimerTask{

    @Override
    public void run() {
        System.out.println("任务启动 " + System.currentTimeMillis());
    }
}
```

示例：定时启动，会卡主
```java
import java.util.Timer;

class Demo {
    public static void main(String[] args) {
        Timer timer = new Timer();
        timer.schedule(new MyTask(), 100);
        // 任务启动 1574260837613
    }
}
```

示例：间隔任务
```java
class Demo {
    public static void main(String[] args) {
        Timer timer = new Timer();
        timer.scheduleAtFixedRate(new MyTask(), 100, 1000);
    }
}
```

## 51 Base64加密与解密
加密解密示例
```java
String message = "Hello Java";
String encodeMessage = new String(Base64.getEncoder().encode(message.getBytes()));
System.out.println(encodeMessage);
// SGVsbG8gSmF2YQ==

String decodeMessage = new String(Base64.getDecoder().decode(encodeMessage));
System.out.println(decodeMessage);
// Hello Java
```

最好的方法是使用2-3中加密程序，进行多次加密

加密解密示例
```java
import java.util.Base64;

class Crypto{
    // 加密重复次数，越高越安全
    private static final int REPEAT = 3;

    /**
     * 加密处理
     * @param message
     * @return
     */
    public static String encode(String message){
        byte[]  data = message.getBytes();

        // 重复加密
        for (int i = 0; i < REPEAT; i++) {
            data = Base64.getEncoder().encode(data);
        }

        return new String(data);
    }

    public static String decode(String message){
        byte[] data = message.getBytes();

        for (int i = 0; i < REPEAT; i++) {
            data = Base64.getDecoder().decode(data);
        }

        return new String(data);
    }
}

class Demo {
    public static void main(String[] args) {
        String message = "Hello Java";

        String encodeMessage = Crypto.encode(message);
        System.out.println(encodeMessage);
        // VTBkV2MySkhPR2RUYlVZeVdWRTlQUT09

        String decodeMessage = Crypto.decode(encodeMessage);
        System.out.println(decodeMessage);
        // Hello Java
    }
}
```


# 第13 章 ： 比较器
## 52 比较器问题引出
比较器：大小关系判断

示例：对象数组排序
```java
Integer[] data = new Integer[]{1, 4, 5, 8, 6};
Arrays.sort(data);
System.out.println(Arrays.toString(data));
// [1, 4, 5, 6, 8]
```

## 53 Comparable比较器
接口：Comparable
```java
public interface Comparable<T> {
    public int compareTo(T o);
}
```

大于返回正数
等于返回0
小于返回负数

示例：自定义类型数组排序
```java
import java.util.Arrays;

class Person implements Comparable<Person>{
    private String name ;
    private int age ;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        return this.age - other.age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}


class Demo {
    public static void main(String[] args) {
        Person[] data = {
                new Person("小王", 23),
                new Person("小刘", 27),
                new Person("小张", 25),
        };

        Arrays.sort(data);
        System.out.println(Arrays.toString(data));
        // [
        // Person{name='小王', age=23}, 
        // Person{name='小张', age=25}, 
        // Person{name='小刘', age=27}
        // ]
    }
}
```

## 54 Comparator比较器
解决没有实现Comparable接口的对象比较

```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

排序方法
```java
import java.util.Arrays;

public static void sort(Object[] a)

public static <T> void sort(T[] a, Comparator<? super T> c)
```   

使用示例
```java
import java.util.Arrays;
import java.util.Comparator;

class Person{
    private String name ;
    private int age ;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

class PersonComparator implements Comparator<Person> {
    @Override
    public int compare(Person person1, Person person2) {
        return person1.getAge() - person2.getAge();
    }
}

class Demo {
    public static void main(String[] args) {
        Person[] data = {
                new Person("小王", 23),
                new Person("小刘", 27),
                new Person("小张", 25),
        };

        Arrays.sort(data, new PersonComparator());
        System.out.println(Arrays.toString(data));
        // [
        // Person{name='小王', age=23},
        // Person{name='小张', age=25},
        // Person{name='小刘', age=27}
        // ]
    }
}

```


Comparable优先使用

区别 Comparable Comparator
Comparable 定义类的时候实现父接口，定义排序规则
```java
public int compareTo(T o)
```

Comparator 挽救的比较器操作，需要单独设置比较规则实现排序
```java
int compare(T o1, T o2);
```

可以使用匿名类
```java
Arrays.sort(data, new Comparator<Person>() {
    @Override
    public int compare(Person o1, Person o2) {
        return o1.getAge() - o2.getAge();
    }
});
```

也可以使用Lambda表达式
```java
Comparator<Person> comparator = (Person o1, Person o2)->{
    return o1.getAge() - o2.getAge();
};

Arrays.sort(data, comparator);
```

或者
```java
Arrays.sort(data, (p1, p2)->{
            return p1.getAge() - p2.getAge();
        });
```

## 55 二叉树结构简介
链表的时间复杂度是O(n)
二叉树查找的时间复杂度是O(logn)

数据位置
```
         父节点-中  

左子树-小          右子树-大
```

遍历数据
1、前序遍历 根-左-右
2、中序遍历 左-根-右
3、后序遍历 左-右-根

## 56 二叉树基础实现
```java
import java.util.Arrays;

class Person implements Comparable<Person> {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    @Override
    public int compareTo(Person other) {
        return this.age - other.age;
    }
}

class BinaryTree<T extends Comparable<T>> {
    private class Node {
        private Comparable<T> data;
        private Node parent;
        private Node left;
        private Node right;

        public Node(Comparable<T> data) {
            this.data = data;
        }

        public void addNode(Node node) {
            // 数据比当前节点小，添加到左子树
            if (node.data.compareTo((T) this.data) <= 0) {
                if (this.left == null) {
                    this.left = node;
                    node.parent = this;  // 保存父节点
                } else {
                    this.left.addNode(node);
                }
            }
            // 数据比当前节点大，添加到右子树
            else {
                if (this.right == null) {
                    this.right = node;
                    node.parent = this;
                } else {
                    this.right.addNode(node);
                }
            }
        }

        public void toArrayNode(){
            if(this.left != null){
                this.left.toArrayNode();
            }

            BinaryTree.this.dataList[BinaryTree.this.foot++] = this.data;

            if(this.right != null){
                this.right.toArrayNode();
            }
        }
    }

    private Node root; // 根节点
    private int count ;

    private int foot ;
    private Object[] dataList;

    /**
     * 数据添加
     *
     * @param data 要添加的数据
     */
    public void add(Comparable<T> data) {
        if (data == null) {
            throw new NullPointerException("数据不允许为空");
        }

        Node node = new Node(data);

        if (this.root == null) {
            this.root = node;
        } else {
            this.root.addNode(node);
        }

        this.count ++;
    }

    public Object[] toArray(){
        if(this.count == 0){
            return null;
        }

        this.foot = 0;
        this.dataList = new Object[this.count];

        this.root.toArrayNode();

        return this.dataList;
    }
}

class Demo {
    public static void main(String[] args) {
        BinaryTree<Person> tree = new BinaryTree<>();

        tree.add(new Person("小王", 23));
        tree.add(new Person("小刘", 27));
        tree.add(new Person("小张", 25));

        System.out.println(Arrays.toString(tree.toArray()));
        /**
         * [
         * Person{name='小王', age=23},
         * Person{name='小张', age=25},
         * Person{name='小刘', age=27}
         * ]
         */

    }
}
```

## 57 二叉树数据删除
要删除的节点情况：
1、没有子节点，直接删除
2、只有一个子节点（左节点或右节点），删除后用子节点顶替
3、有左右节点，在右子树中找最左边节点顶替
4、需要特殊考虑根节点
```java
import java.util.Arrays;

class BinaryTree<T extends Comparable<T>> {
    private class Node {
        private Comparable<T> data;
        private Node parent;
        private Node left;
        private Node right;

        public Node(Comparable<T> data) {
            this.data = data;
        }

        public void addNode(Node node) {
            // 数据比当前节点小，添加到左子树
            if (node.data.compareTo((T) this.data) <= 0) {
                if (this.left == null) {
                    this.left = node;
                    node.parent = this;  // 保存父节点
                } else {
                    this.left.addNode(node);
                }
            }
            // 数据比当前节点大，添加到右子树
            else {
                if (this.right == null) {
                    this.right = node;
                    node.parent = this;
                } else {
                    this.right.addNode(node);
                }
            }
        }

        public Node getMostLeftNode() {
            if (this.left != null) {
                return this.left.getMostLeftNode();
            } else {
                return this;
            }
        }

        public Node getNode(Comparable<T> data) {
            if (this.data.compareTo((T) data) == 0) {
                return this;
            }
            // 查找子节点
            else {
                // 右边节点
                if (data.compareTo((T) this.data) > 0) {
                    if (this.right != null) {
                        return this.right.getNode(data);
                    } else {
                        return null;
                    }
                    // 左边节点
                } else {
                    if (this.left != null) {
                        return this.left.getNode(data);
                    } else {
                        return null;
                    }
                }
            }
        }

        public void toArrayNode() {
            if (this.left != null) {
                System.out.println(this.data + " left-> " + this.left.data);
                this.left.toArrayNode();
            }

            BinaryTree.this.dataList[BinaryTree.this.foot++] = this.data;

            if (this.right != null) {
                System.out.println(this.data + " right-> " + this.right.data);
                this.right.toArrayNode();
            }
        }
    }

    private Node root; // 根节点
    private int count;

    private int foot;
    private Object[] dataList;

    /**
     * 数据添加
     *
     * @param data 要添加的数据
     */
    public void add(Comparable<T> data) {
        if (data == null) {
            throw new NullPointerException("数据不允许为空");
        }

        Node node = new Node(data);

        if (this.root == null) {
            this.root = node;
        } else {
            this.root.addNode(node);
        }
        this.count++;
    }

    public void addMany(Comparable<T>... list) {
        for (Comparable<T> data : list) {
            this.add(data);
        }
    }

    public void removeRoot() {
        // 右子树不为空
        if (this.root.right != null) {
            Node mostLeftNode = this.root.right.getMostLeftNode();
            System.out.println(mostLeftNode.data);

            mostLeftNode.parent.left = null;

            mostLeftNode.parent = null;
            mostLeftNode.left = root.left;
            mostLeftNode.right = root.right;

            this.root = mostLeftNode;
        }

        // 右子树为空
        else if (this.root.left != null) {
            this.root.left.parent = null;
            this.root = this.root.left;
        }

        // 单独根节点
        else {
            this.root = null;
        }
    }

    public void removeChild(Node node) {
        // 1、没有子节点
        if (node.left == null && node.right == null) {
            if (node.parent.left == node) {
                node.parent.left = null;
            } else {
                node.parent.right = null;
            }
        }

        // 2、有一个子节点
        // 2-1 只有右节点
        else if (node.left == null) {
            if (node.parent.left == node) {
                node.parent.left = node.right;
            } else {
                node.parent.right = node.right;
            }
        }

        // 2-2只有左节点
        else if (node.right == null) {
            if (node.parent.left == node) {
                node.parent.left = node.left;
            } else {
                node.parent.right = node.left;
            }
        }

        // 3、有两个子节点
        else {
            Node mostLeftNode = node.right.getMostLeftNode();
            mostLeftNode.parent.left = null;

            mostLeftNode.parent = node.parent;
            mostLeftNode.left = node.left;
            mostLeftNode.right = node.right;

        }

        node.parent = null;
    }

    public void remove(Comparable<T> data) {

        Node node = this.root.getNode(data);

        if (node == null) {
            return;
        }

        // 单独考虑根节点，没有父节点
        if (this.root == node) {
            this.removeRoot();
        } else {
            this.removeChild(node);
        }

        this.count--;
    }


    public Object[] toArray() {
        if (this.count == 0) {
            return null;
        }
        this.foot = 0;
        this.dataList = new Object[this.count];

        this.root.toArrayNode();

        return this.dataList;
    }
}

class Demo {
    public static void main(String[] args) {
        BinaryTree<Integer> tree = new BinaryTree<>();

        tree.addMany(8, 7, 12);

        System.out.println(Arrays.toString(tree.toArray()));

        tree.remove(7);
        System.out.println(Arrays.toString(tree.toArray()));

    }
}
```

## 58 红黑树原理简介
二叉树主要特点：
优点：数据查询的时候可以提供更好的查询性能
缺陷：二叉树结构改变的时候（增加或删除）就有可能出现不平衡的问题

平衡二叉树 别称：二叉查找树，平衡二叉B树
插入，删除，查找的最坏时间复杂度为O(logn)
在节点上追加了一个颜色表示
也可以使用boolean true或false

```java
enum Color{
    RED, BLACK;
}

class BinaryTree<T>{
    private Node left;
    private Node right;
    private Node parent;
    private T data;
    private Color color;
}
```

红黑树的特点
1、每个节点或者黑色或者红色
2、根节点必须是黑色
3、每个叶子节点是黑色
Java实现的红黑树将使用null代表空节点，因此遍历红黑树将看不到黑色的叶子节点，反而看到每个叶子节点都是红色的
4、如果一个节点是红色的，则它的子节点必须是黑色
从每个根节点的路径上不会有两个连续的红色节点，当黑色节点是可以连续的
若给定黑色节点的个数N，最短路径情况是连续的N个黑色，数的高度为N-1;
最长路径的情况为节点红黑相间，树的高度为2(N-1);
5、从一个节点到该节点的子孙节点的所有路径上包含相同数目的黑色节点数量
6、成为红黑树的主要条件，后序的插入、删除操作都是为了遵守这个规定

```java
             黑
       红          红
   null  null  null null 
```

允许黑-黑连接，不允许红-红连接

利用红色节点和黑色节点实现均衡控制

数据插入处理
1、第一次插入，由于原树为空，所以只会违反红-黑树的规则2
要把根节点涂黑
2、如果插入节点的父节点是黑色的，那不会违背红-黑树的原则，什么也不需要做，
但是遇到如下三种情况时，就要开始变色和旋转了
（1）插入节点的父节点和其叔叔节点（祖父节点的另一个子节点）均为红色的
（2）插入节点的父节点是红色，叔叔节点是黑色，且插入节点是其父节点的左子节点
（3）插入节点的父节点是红色，叔叔节点是黑色，且插入节点是其父节点的右子节点

插入节点和父节点，叔叔节点来决定修复处理

数据删除处理

修复的目的是为了保证树结构中黑色节点数量平衡

# 第14 章 ： 类库使用案例分析
## 59 StringBuffer使用
使用StringBuffer追加26个小写字母。逆序输出，并删除前5个字符
StringBuffer允许修改 String不允许修改

```java
StringBuffer buff = new StringBuffer();
for(int i = 'a'; i<='z'; i++){
    buff.append((char)i);
}
System.out.println(buff.reverse().delete(0, 5));
// utsrqponmlkjihgfedcba
```

## 60 随机数组
Rondom 产生5个[1, 30]之间随机数
```java
import java.util.Arrays;
import java.util.Random;

class NumberFactory{
    private static Random random = new Random();

    public static int[] getRandomList(int num){
        int[] list = new int[num];
        int foot = 0;

        while (foot < num) {
            int value = random.nextInt(31);
            if (value !=0 ){
                list[foot++] = value;
            }
        }
        return list;
    }
}

class Demo{
    public static void main(String[] args) {
        int[] list = NumberFactory.getRandomList(5);
        System.out.println(Arrays.toString(list));
        // [27, 3, 9, 4, 12]
    }
}
```

## 61 Email验证
```java
class Validator{
    public static boolean isEmail(String email){
        if(email == null || "".equals(email)){
            return false;
        }

        String regex = "\\w+@\\w+\\.\\w+";
        return email.matches(regex);
    }
}

class Demo{
    public static void main(String[] args) {
        System.out.println(Validator.isEmail("ooxx@qq.com"));
        // true
    }
}
```

## 62 扔硬币
0-1随机数模拟投掷硬币 1000次
```java
import java.util.Random;

class Coin{
    private int front;
    private int back;
    private Random random = new Random();

    public void throwCoin(int num){
        for (int i = 0; i < num; i++) {
            int value = random.nextInt(2);
            if (value == 0){
                this.front ++;
            } else{
                this.back ++;
            }
        }
    }

    public int getFront() {
        return this.front;
    }

    public int getBack() {
        return this.back;
    }
}

class Demo{
    public static void main(String[] args) {
        Coin coin = new Coin();
        coin.throwCoin(1000);

        System.out.println("正面： " + coin.getFront());
        System.out.println("背面： " + coin.getBack());
        // 正面： 495
        // 背面： 505
    }
}
```

## 63 IP验证
eg: 127.0.0.1
第一位 [12]?
第二位 [0-9]{0, 2}

```java
import java.util.Random;

class Validator {
    public static boolean isIp(String ip) {
        String regex = "(\\d{1,3}\\.){3}\\d{1,3}";

        if (!ip.matches(regex)) {
            return false;
        }

        String[] list = ip.split("\\.");
        for (String str : list) {
            int num = Integer.parseInt(str);

            if (num > 255 || !str.equals(Integer.toString(num))) {
                return false;
            }
        }

        return true;
    }
}

class Demo {
    public static void main(String[] args) {
        System.out.println(Validator.isIp("127.0.0"));          // false
        System.out.println(Validator.isIp("127.0.0.1"));        // true
        System.out.println(Validator.isIp("255.255.255.255"));  // true
        System.out.println(Validator.isIp("255.255.255.666"));  // false
        System.out.println(Validator.isIp("255.255.001.1"));    // false
    }
}
```

## 64 HTML拆分
```html
<font face="Arial,Serif" size="+2" color="red"></font>    
```

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;

class Demo {
    public static void main(String[] args) {
        String html  = "<font face=\"Arial,Serif\" size=\"+2\" color=\"red\"></font>";
        String regex = "\\w+=\"[a-zA-Z0-9,\\+]+\"";
        Matcher matcher = Pattern.compile(regex).matcher(html);

        while (matcher.find()){
            String temp = matcher.group(0);
            String[] result = temp.split("=");
            System.out.println(result[0] + "\t" + result[1].replaceAll("\"", ""));
            /**
             * face   Arial,Serif
             * size   +2
             * color  red
             */
        }
    }
}
```

## 65 国家代码
实现国际化应用
输入国家代号，调用资源文件
3个资源文件
```
# message.properties
info=默认资源

# message_en_US.properties
info=英文资源

# message_zh_CN.properties
info=中文资源
```

```java

import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.ResourceBundle;


class MessageUtil {
    // 将固定的内容定义为常量
    private static final String CHINA = "cn";
    private static final String ENGLISH = "en";
    private static final String BASENAME = "message";
    private static final String KEY = "info";

    public static String getMessage(String country) throws UnsupportedEncodingException {
        Locale locale = getLocale(country);

        if (locale == null) {
            return null;
        } else {
            ResourceBundle bundle = ResourceBundle.getBundle(BASENAME, locale);
            return new String(bundle.getString(KEY).getBytes("ISO-8859-1"), "utf-8");
        }
    }

    private static Locale getLocale(String country) {
        switch (country) {
            case CHINA:
                return new Locale("zh", "CN");
            case ENGLISH:
                return new Locale("en", "US");
            default:
                return null;
        }

    }


}

class Demo {
    public static void main(String[] args) throws UnsupportedEncodingException {
        if (args.length < 1) {
            System.out.println("请输入：cn 或者 en");
            System.exit(1);
        }
        System.out.println(MessageUtil.getMessage(args[0]));
        // 中文资源
    }
}
```

## 66 学生信息比较
先用成绩比较，如果相同按年龄比较
数据结构
```
姓名：年龄：成绩|姓名：年龄：成绩
eg:
张三:21:98|李四:23:96|王五:24:94
```

结构化的字符串处理
```java
import java.io.UnsupportedEncodingException;
import java.util.Arrays;


class Student implements Comparable<Student>{
    private String name;
    private int age;
    private double score;

    public Student(String name, int age, double score) {
        this.name = name;
        this.age = age;
        this.score = score;
    }

    @Override
    public int compareTo(Student other) {
        // 先用成绩比较，再用年龄比较
        if(this.score > other.score){
            return 1;
        } else if (this.score < other.score){
            return -1;
        } else{
            return this.age - other.age;
        }
    }

    @Override
    public String toString() {
        return "Student{" + name + ',' + age + ", " + score + "}";
    }
}

class Demo {
    public static void main(String[] args) throws UnsupportedEncodingException {
        String data = "张三:21:98|李四:23:96|王五:24:94";
        String[] list = data.split("\\|");
        Student[] students = new Student[list.length];

        for (int i = 0; i < list.length; i++) {
            String[] temp = list[i].split(":");
            students[i] = new Student(temp[0], Integer.parseInt(temp[1]), Double.parseDouble(temp[2]));
        }

        Arrays.sort(students);
        System.out.println(Arrays.toString(students));
        // [Student{王五,24, 94.0}, Student{李四,23, 96.0}, Student{张三,21, 98.0}]

    }
}
```