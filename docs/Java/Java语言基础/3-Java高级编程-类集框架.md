# 第28 章 ： 类集框架简介
## 123 类集框架简介

数组长度固定

重要的数据结构：
链表与树

类集：
JDK >= 1.2 Object
JDK >= 1.5 泛型
JDK >= 1.8 性能提升

核心接口:
```java
Collection
List
Set
Map
Iterator
Enumeration
Queue
ListIterator
```

继承体系

```java
// 接口关系
@Iterable
    @ListIterator
    @Collection
        @List
        @Set
            @SortedSet
                @NavigableSet
        @Queue      // 队列
            @Deque  // 双端队列
@Map
    @SortedMap
        @NavigableMap


// 实现类关系
AbstractCollection(Collection)
    - AbstractList(List)
        -ArrayList(List, RandomAccess, Cloneable, Serializable)
        -Vector(List, RandomAccess, Cloneable, Serializable)
            -Stack
        -AbstractSequentialList
            -LinkedList(List, Deque, Cloneable, Serializable)

    -AbstractSet(Set)
        -HashSet(Set, Cloneable, java.io.Serializable) 
        -TreeSet(NavigableSet, Cloneable, java.io.Serializable)
        
    -AbstractQueue(Queue)
        -PriorityQueue(Serializable)


AbstractMap(Map)
    -HashMap(Map, Cloneable, Serializable)
        -LinkedHashMap(Map)
    -TreeMap(NavigableMap, Cloneable, Serializable)


Dictionary
    -Hashtable(Map, Cloneable, Serializable)
        -Properties

```

## 124 Collection接口简介
单值数据处理
```
add 增加一个数据
addAll 追加一组数据
clear 清空集合
contains 包含 需要equals方法支持
remove 删除
size   获取数据长度
toArray 集合变对象数组
iterator 集合变Iterator接口返回
```

JDK < 1.5 Collection
JDK >= 1.5 List Set

```java
public interface Iterable<T>
public interface Collection<E> extends Iterable<E>
public interface List<E> extends Collection<E>
public interface Set<E> extends Collection<E>

// 继承关系
Iterable
    - Collection
        - List
        - Set
```

# 第29 章 ： List集合
## 125 List接口简介
允许保存重复数据

List新的方法
```java
E get(int index);
E set(int index, E element);
ListIterator<E> listIterator();
```

三个常用子类
```
ArrayList  90%
Vector     8%
LinkedList 2% 
```

定义
```java
public class ArrayList<E> 
    extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable

public class Vector<E>
    extends AbstractList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable

public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable

```

## 126 ArrayList子类
继承结构
```java
@Iterable
    -@Collection
        -@List


AbstractCollection(Collection)
    - AbstractList(List)
        -ArrayList(List, RandomAccess, Cloneable, java.io.Serializable)
```

List特征
1、保存顺序就是存储顺序
2、允许有重复数据

JDK >= 1.8 Iterable接口中有forEach方法

```java
import java.util.ArrayList;
import java.util.List;

class Demo{
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("Hello");
        list.add("Hello");
        list.add("World");
        System.out.println(list);
        // [Hello, Hello, World]

        list.forEach((str)->{
            System.out.println(str);
        });
        /**
         * Hello
         * Hello
         * World
         */
        System.out.println(list.size());  // 3
        System.out.println(list.isEmpty());  // false
    }
}
```

ArrayList 实际包含一个对象数组
默认使用空数组
添加新元素时，如果长度不够，会开辟一个新的数组

版本不一样实现也不一样
JDK < 1.9 默认使用长度为10的数组
JDK >= 1.9 默认空数组

如果超过10个数据，考虑使用有参构造，避免垃圾数组的产生

## 127 ArrayList保存自定义类对象
如果需要remove，contains方法，要覆写equals方法
```java
import java.util.ArrayList;
import java.util.List;

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj == this) {
            return true;
        }
        if (!(obj instanceof Person)) {
            return false;
        }
        Person other = (Person) obj;

        return this.name.equals(other.name) && this.age == other.age;

    }

}

class Demo {
    public static void main(String[] args) {
        List<Person> list = new ArrayList<Person>();
        list.add(new Person("Tom", 23));
        list.add(new Person("Jack", 24));
        list.add(new Person("Steve", 25));

        System.out.println(list.contains(new Person("Tom", 23)));
        // true
    }
}
```

## 128 LinkedList子类

继承关系
```java
@Iterable
    -@Collection
        -@List

AbstractCollection(Collection)
    -AbstractList(List)
        -AbstractSequentialList
            -LinkedList(List, Deque, Cloneable, java.io.Serializable)
```
代码实例
```java
import java.util.LinkedList;
import java.util.List;

class Demo{
    public static void main(String[] args) {
        List<String> list = new LinkedList<String>();
        list.add("Hello");
        list.add("Hello");
        list.add("World");
        System.out.println(list);
        // [Hello, Hello, World]

        list.forEach(System.out::println);
        /**
         * Hello
         * Hello
         * World
         */
    }
}
```
LinkedList和ArrayList接口一致，实现不一样
区别：
```
ArrayList   数组实现 get查找复杂度为O(1) 
LinkedList  链表实现 get查找复杂度为O(n)
```
ArrayList默认初始化大小为10，长度会自动扩容，保存大数据会产生垃圾，这时使用LinkedList

## 129 Vector子类
Vector和ArrayList继承关系一致

Vector 的方法加了同步处理synchronized ，多线程安全，性能不如ArrayList
```java
import java.util.List;
import java.util.Vector;

class Demo{
    public static void main(String[] args) {
        List<String> list = new Vector<String>();
        list.add("Hello");
        list.add("Hello");
        list.add("World");
        System.out.println(list);
        // [Hello, Hello, World]

        list.forEach(System.out::println);
        /**
         * Hello
         * Hello
         * World
         */
    }
}
```

总结
集合 | 说明
- | -
ArrayList | 数组实现，读>写
Vector  | 数组实现，线程安全
LinkedList | 链表实现，写>读

继承关系
```java
@Iterable
    -@Collection
        -@List


AbstractCollection(Collection)
    - AbstractList(List)
        -ArrayList(List, RandomAccess, Cloneable, java.io.Serializable)
        -Vector(List, RandomAccess, Cloneable, java.io.Serializable)
        -AbstractSequentialList
            -LinkedList(List, Deque, Cloneable, java.io.Serializable)
```

# 第30 章 ： Set集合
## 130 Set接口简介
Set集合不允许保存重复数据
继承关系
```java
-@Iterable
    -@Collection
        -@Set
            -@SortedSet
                -@NavigableSet


AbstractCollection(Collection)
    -AbstractSet(Set)
        -HashSet(Set, Cloneable, java.io.Serializable) 
        -TreeSet(NavigableSet, Cloneable, java.io.Serializable)
```

## 131 HashSet子类
HashSet元素无序

```java
import java.util.HashSet;
import java.util.Set;

class Demo{
    public static void main(String[] args) {
        Set<String> list = new HashSet<String>();
        list.add("Hello");
        list.add("Hello");
        list.add("World");
        System.out.println(list);
        // [Hello, World]

        list.forEach(System.out::println);
        /**
         Hello
         World
         */

    }
}
```

## 132 TreeSet子类
TreeSet数据有序，按照升序排序
```java
import java.util.Set;
import java.util.TreeSet;

class Demo{
    public static void main(String[] args) {
        Set<String> list = new TreeSet<String>();
        list.add("Hello");
        list.add("Hello");
        list.add("World");
        System.out.println(list);
        // [Hello, World]

        list.forEach(System.out::println);
        /**
         Hello
         World
         */
    }
}
```
## 133 分析TreeSet子类排序操作
TreeSet 通过TreeMap实现
需要实现Comparable接口
自定义类需要将所有属性进行比对，首选HashSet

```java
import java.util.Set;
import java.util.TreeSet;

class Person implements Comparable<Person> {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person other) {
        if (this.age > other.age) {
            return 1;
        } else if (this.age < other.age) {
            return -1;
        } else {
            return this.name.compareTo(other.name);
        }
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
        Set<Person> list = new TreeSet<Person>();

        list.add(new Person("Jack", 24));
        list.add(new Person("Tom", 23));
        list.add(new Person("Tom", 23));
        System.out.println(list);
        // [Person{name='Tom', age=23}, Person{name='Jack', age=24}]

        list.forEach(System.out::println);
        /**
         Person{name='Tom', age=23}
         Person{name='Jack', age=24}
         */
    }
}
```

## 134 分析重复元素消除
实现重复元素判断
TreeSet Comparable接口
HashSet 对象编码 hashCode方法 ; 对象比较 equals方法

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

class Person implements Comparable<Person> {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age &&
                Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public int compareTo(Person other) {
        if (this.age > other.age) {
            return 1;
        } else if (this.age < other.age) {
            return -1;
        } else {
            return this.name.compareTo(other.name);
        }
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
        Set<Person> list = new HashSet<Person>();

        list.add(new Person("Jack", 24));
        list.add(new Person("Tom", 23));
        list.add(new Person("Tom", 23));
        System.out.println(list);
        // [Person{name='Tom', age=23}, Person{name='Jack', age=24}]

        list.forEach(System.out::println);
        /**
         Person{name='Tom', age=23}
         Person{name='Jack', age=24}
         */
    }
}
```

# 第31 章 ： 集合输出 
## 135 Iterator迭代输出
四种输出形式
```
Iterator迭代输出         95%
ListIterator双向迭代输出  0.1%
Enumeration枚举         4.8%
foreach                相当于Iterator
```

1、Iterator迭代输出
```
hasNext  判断是否有数据
next 取出当前数据
remove  删除(如果不是必须，不推荐使用)
```

java.util.Scanner 是Iterator子类

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

class Demo{
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("Tom");
        list.add("Jack");
        list.add("Steve");

        // 获取Iterator接口对象
        Iterator<String> iter = list.iterator();

        while (iter.hasNext()){
            String str = iter.next();
            System.out.println(str);
        }
    }
}
```

迭代过程中使用Collection.remove()会迭代失败
Iterator.remove() 可以正常删除，不推荐使用

## 136 ListIterator双向迭代输出
继承关系
```java
@Iterator
    -@ListIterator
```
迭代顺序：先从前到后，再由后向前

```java
import java.util.ArrayList;
import java.util.List;
import java.util.ListIterator;

class Demo{
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("Tom");
        list.add("Jack");
        list.add("Steve");

        // 获取Iterator接口对象
        ListIterator<String> iter = list.listIterator();

        // 由前向后
        while (iter.hasNext()){
            System.out.println(iter.next());
        }
        // Tom Jack Steve

        // 由后向前
        while (iter.hasPrevious()){
            System.out.println(iter.previous());
        }
        // Steve Jack Tom
    }
}
```

## 137 Enumeration枚举输出
Enumeration主要是为Vector类提供服务

hasMoreElements 判断是否有下一个元素
nextElement 获取当前元素
```java
import java.util.Enumeration;
import java.util.Vector;

class Demo{
    public static void main(String[] args) {
        Vector<String> list = new Vector<>();
        list.add("Tom");
        list.add("Jack");
        list.add("Steve");

        // 获取接口对象
        Enumeration<String> enu = list.elements();
        
        while (enu.hasMoreElements()){
            System.out.println(enu.nextElement());
        }
        // Tom Jack Steve

    }
}
```

## 138 foreach输出
```java
import java.util.ArrayList;
import java.util.List;

class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        list.add("Tom");
        list.add("Jack");
        list.add("Steve");

        for (String str : list) {
            System.out.println(str);
        }
        // Tom Jack Steve
    }
}
```

# 第32 章 ： Map集合
## 139 Map接口简介
二元偶对象（key=value）

Collection集合保存数据是为了输出
Map集合保存数据是为了key查找

常用方法
```
put 添加数据
get 获取数据
entrySet 将Map转为Set
containsKey  检查存在
keySet  将Map中的key转为Set
remove  删除数据
```

继承关系
```java
@Map
    -@SortedMap
        -@NavigableMap

AbstractMap(Map)
    -HashMap(Map, Cloneable, Serializable)
        -LinkedHashMap(Map)
    -TreeMap(NavigableMap, Cloneable, Serializable)

Dictionary
    -Hashtable(Map, Cloneable, Serializable)
```

## 140 HashMap子类
hash 无序
tree 有序

HashMap 无序存储
```java
import java.util.HashMap;
import java.util.Map;

class Demo {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<>();
        map.put("one", "one");
        map.put("one", "one+"); // key重复 会被覆盖
        map.put("two", null);   // value 为null
        map.put(null, "three"); // key 为null

        System.out.println(map.get("one")); // key重复  one+
        System.out.println(map.get("two")); // key存在  null
        System.out.println(map.get("ten")); // key不存在 null
    }
}
```

put会返回原来的value
```java
Map<String, Integer> map = new HashMap<>();

System.out.println(map.put("one", 1)); // null
System.out.println(map.put("one", 101)); // key重复 1
```

面试题：HashMap容量扩充
初始容量为16个元素，超过了阈值0.75 相当于 `容量 * 阈值 = 12`，会自动扩充
扩充的时候会成倍扩充

面试题：HashMap工作原理
链表O(n) 
二叉树O(logn)

JDK < 1.8  链表O(n)
JDK >= 1.8 链表O(n) 数量大于8个元素后变为 红黑树，保证查询性能

## 141 LinkedHashMap子类
LinkedHashMap（链表实现）按照添加顺序保存数据

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

class Demo {
    public static void main(String[] args) {
        Map<String, Integer> map = new LinkedHashMap<>();

        map.put("two", 2);
        map.put("one", 1);
        map.put("three", 3);
        System.out.println(map);
        // HashMap {one=1, two=2, three=3}
        // LinkedHashMap {two=2, one=1, three=3}
    }
}
```

## 142 Hashtable子类
与Vector，Enumeration属于最早的动态数组实现类
Hashtable key 和value都不能为null

```java
import java.util.Hashtable;
import java.util.Map;

class Demo {
    public static void main(String[] args) {
        Map<String, Integer> map = new Hashtable<>();

        map.put("two", 2);
        map.put("one", 1);
        map.put("three", 3);
        System.out.println(map);
        // {two=2, one=1, three=3}

    }
}
```

面试题：HashMap与HashTable区别
```
HashMap 异步操作，非线程安全， 允许null
HashTable 同步操作，线程安全，不允许null
```

## 143 Map.Entry内部接口
Map.Entry 作为一个key，value的包装
JDK >= 1.9

## 144 利用Iterator输出Map集合
存储结构
```
Collection(Iterator)     Map
vlaue                    Map.Entry(key, value)
vlaue                    Map.Entry(key, value)
```
Map对象迭代方式
```
Map  - entrySet() -> Set
Set  - iterator() -> Iterator
Iterator -> Map.Entry
```
```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

class Demo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("Tom", 20);
        map.put("Jack", 21);

        // 1、将Map转Set
        Set<Map.Entry<String, Integer>> set = map.entrySet();

        // 2、将Set 转Iterator
        Iterator<Map.Entry<String, Integer>> iterator = set.iterator();

        while (iterator.hasNext()){
            Map.Entry<String, Integer> entry = iterator.next();
            System.out.println(entry.getKey() + "= "+ entry.getValue());
        }
        /**
         * Tom= 20
         * Jack= 21
         */

    }
}
```
简化写法
```java
import java.util.HashMap;
import java.util.Map;

class Demo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("Tom", 20);
        map.put("Jack", 21);

        for(Map.Entry<String, Integer> entry: map.entrySet()){
            System.out.println(entry.getKey() + "= "+ entry.getValue());
        }
        /**
         * Tom= 20
         * Jack= 21
         */

    }
}
```

## 145 自定义Map的key类型
通过key获取hash码
常用key：
```
String
Integer
Long
```

面试体：HashMap出现Hash冲突
Hash冲突会转为链表
```
key    key     key(hash冲突)
value  value   value
               value
               value
```

```java
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

class Person{
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age &&
                Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }
}

class Demo {
    public static void main(String[] args) {
        Map<Person, Integer> map = new HashMap<>();
        map.put(new Person("Tom", 20), 20);

        System.out.println(map.get(new Person("Tom", 20)));
        // 20
    }
}
```

# 第33 章 ： 集合工具类
## 146 Stack栈操作
Stack栈先进后出， 继承自Vector

继承关系
```java
AbstractCollection(Collection)
    - AbstractList(List)
        -ArrayList(List, RandomAccess, Cloneable, java.io.Serializable)
        -Vector(List, RandomAccess, Cloneable, java.io.Serializable)
            -Stack
```

push 入栈
pop  出栈

```java
import java.util.Stack;

class Demo {
    public static void main(String[] args) {
        Stack<String> stack = new Stack<>();
        stack.push("Tom");
        stack.push("Jack");

        System.out.println(stack.pop());
        // Jack
    }
}
```

## 147 Queue队列
Queue队列先进先出

```java
@Iterable
    @Collection
        @Queue      // 队列
            @Deque  // 双端队列


AbstractCollection(Collection)
    - AbstractList(List)
        -ArrayList(List, RandomAccess, Cloneable, Serializable)
        -Vector(List, RandomAccess, Cloneable, Serializable)
        -AbstractSequentialList
            -LinkedList(List, Deque, Cloneable, Serializable)

    -AbstractQueue(Queue)
        -PriorityQueue(Serializable)
```

```java
import java.util.LinkedList;
import java.util.Queue;

class Demo {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();
        queue.offer("Tom");
        queue.offer("Jack");

        System.out.println(queue.poll());
        // Tom
    }

}
```

PriorityQueue优先级队列
涉及排序Comparable接口
```java
import java.util.PriorityQueue;
import java.util.Queue;

class Demo {
    public static void main(String[] args) {
        Queue<String> queue = new PriorityQueue<>();
        queue.offer("Tom");
        queue.offer("Jack");

        System.out.println(queue.poll());
        // Jack
    }
}
```

## 148 Properties属性操作
资源文件 `*.properties`

继承关系
```java
Hashtable<Object,Object>
    -Properties
```

Properties常用方法
```java
setProperty // 设置属性
getProperty // 获取属性
store       // 保存
load        // 读取
```

只能操作String类型

范例：资源内容输入与输出，用于读取配置资源
```java
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

class Demo {
    public static void main(String[] args) throws IOException {
        Properties properties = new Properties();

        properties.setProperty("name", "小强");
        properties.setProperty("age", "23");

        // 输出，中文会被转换为unicode码
        properties.store(new FileOutputStream(new File("demo/demo.properties")), "注释");

        // 读取文件
        properties.load(new FileInputStream(new File("demo/demo.properties")));
        System.out.println(properties.getProperty("name"));
        // 小强
    }

}
```

## 149 Collections工具类

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();

        // 多元素添加
        Collections.addAll(list, "Tom", "Jack", "Steve");
        System.out.println(list);
        // [Tom, Jack, Steve]

        // 列表反转
        Collections.reverse(list);
        System.out.println(list);
        // [Steve, Jack, Tom]

        // 排序
        Collections.sort(list);
        // 二分查找
        System.out.println(Collections.binarySearch(list, "Tom"));
        // 2
    }
}
```

面试题：Collection 和 Collections区别
Collection 集合接口
Collections 集合操作工具类


# 第34 章 ： Stream数据流
## 150 Stream基本操作
Stream 主要是对集合数据进行数据分析操作

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        Collections.addAll(list, "Tom", "Jack", "Steve");
        Stream<String> stream = list.stream();
        
        System.out.println(stream.filter(item->item.toUpperCase().contains("J")).count());
        // 1
    }
}
```

示例：数据采集
```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Demo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        Collections.addAll(list, "Tom", "Jack", "Steve");
        Stream<String> stream = list.stream();

        // 符合条件的数据转为列表输出
        List<String> newList = stream.filter(item->
            item.toUpperCase().contains("J")).collect(Collectors.toList());
        System.out.println(newList);
        // [Jack]
    }
}
```

## 151 MapReduce基础模型
MapReduce模型分为两部分
Map
Reduce

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.stream.Stream;

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}


class Demo {
    public static void main(String[] args) {
        List<Person> list = new ArrayList<>();
        Collections.addAll(list,
                new Person("小赵", 21),
                new Person("小钱", 22),
                new Person("小孙", 23),
                new Person("小李", 24),
                new Person("小周", 25),
                new Person("小吴", 26)
        );

        Stream<Person> stream = list.stream();

        IntSummaryStatistics stat = stream.filter(
                item -> item.getName().contains("小")
        ).mapToInt(
                item -> item.getAge() + 1
        ).summaryStatistics();

        System.out.println(stat.getSum());      // 147
        System.out.println(stat.getCount());    // 6
        System.out.println(stat.getAverage());  // 24.5

    }
}
```
这只是一个基础模型，如果实际开发中将大量数据存入内存，那机器就崩了


