Map从入门到性能分析

## 课程目标

1. HashMap的构造方法，合适的遍历，复制转换
2. HashMap的底层原理（存取、初始化、扩容）
3. TreeMap、LinkedHashMap的用法
4. 性能分析

## 运行环境：
1. Idea
2. Java Version 1.8

## Map接口及其实现类

1、继承关系
```
Map
    -HashMap 
        -LinkedHashMap
    -SortedMap
        -TreeMap
```

2、Map接口通用的方法

```java
// 存
V put(K key, V value)

// 取
V get(Object key)

// 数量
int size()

// 删除
V remove(Object key)

// 包含测试
boolean containsKey(Object key)

```

3、HashMap构造方法

```java
HashMap()

// initialCapacity 初始化大小
HashMap(int initialCapacity)

// loadFactor 负载因子
HashMap(int initialCapacity, float loadFactor)
```

4、HashMap基本用法

```java
package com.demo.map;

import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        Map<String, Integer> userMap = new HashMap<>();

        userMap.put("Tom", 23);

        System.out.println(userMap.get("Tom"));
        // 23
    }
}

```

5、HashMap的Entry结构

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

6、使用示例

```java
Map<String, Integer> userMap = new HashMap<>();

userMap.put("Tom", 21);
userMap.put("Jack", 22);
userMap.put("Steve", 23);

System.out.println(userMap.get("Tom"));
// 21

System.out.println(userMap);
// {Tom=21, Steve=23, Jack=22}
```

7、HashMap的遍历-keySet

获取key, 再通过key取到value

```java
for (String key : userMap.keySet()) {
    System.out.println(key + ": " + userMap.get(key));
}
// Tom: 21
// Steve: 23
// Jack: 22
```

8、HashMap的遍历-values

只能获取value

```java
for (Integer value : userMap.values()) {
    System.out.println(value);
}
// 21
// 23
// 22
```

9、HashMap的遍历-entrySet

获取Map.Entry 对象

```java
for (Map.Entry<String, Integer> entry : userMap.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
// Tom: 21
// Steve: 23
// Jack: 22
```

10、HashMap的遍历-Iterator

```java
import java.util.Iterator;

Iterator<Map.Entry<String, Integer>> iterator = userMap.entrySet().iterator();

while (iterator.hasNext()){
    Map.Entry<String, Integer> entry = iterator.next();
    System.out.println(entry.getKey() + ": " + entry.getValue());
}

// Tom: 21
// Steve: 23
// Jack: 22
```

11、性能分析

完整代码

```java
package com.demo.map;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MapDemo {

    public static void showMapByKeySet(Map<String, Integer> userMap) {
        long start = System.currentTimeMillis();

        Integer value;
        for (String key : userMap.keySet()) {
            // System.out.println(key + "=" + userMap.get(key));
            value = userMap.get(key);
        }

        long end = System.currentTimeMillis();
        System.out.println("keySet=" + (end - start));
    }


    public static void showMapByValues(Map<String, Integer> userMap) {
        long start = System.currentTimeMillis();

        Integer value;
        for (Integer v : userMap.values()) {
            // System.out.println(value);
            value = v;
        }

        long end = System.currentTimeMillis();
        System.out.println("values=" + (end - start));
    }


    public static void showMapByEntrySet(Map<String, Integer> userMap) {
        long start = System.currentTimeMillis();

        Integer value;
        for (Map.Entry<String, Integer> entry : userMap.entrySet()) {
            // System.out.println(entry.getKey() + ": " + entry.getValue());
            value = entry.getValue();
        }

        long end = System.currentTimeMillis();
        System.out.println("entrySet=" + (end - start));
    }


    public static void showMapByIterator(Map<String, Integer> userMap) {
        long start = System.currentTimeMillis();
        Iterator<Map.Entry<String, Integer>> iterator = userMap.entrySet().iterator();

        Integer value;
        while (iterator.hasNext()) {
            Map.Entry<String, Integer> entry = iterator.next();
            // System.out.println(entry.getKey() + ": " + entry.getValue());
             value = entry.getValue();
        }

        long end = System.currentTimeMillis();
        System.out.println("iterator=" + (end - start));
    }


    public static void main(String[] args) {
        Map<String, Integer> userMap = new HashMap<>();

        String[] keys = new String[]{
                "a", "b", "c", "d", "e",
                "f", "g", "h", "i", "j"
        };

        String key;

        for (int i = 0; i < 100000; i++) {
            // 让key接近真实环境
            key = keys[(int) (Math.random() * keys.length)] + i * 100;
            userMap.put(key, i);
        }

        showMapByKeySet(userMap); // keySet=16
        showMapByValues(userMap); // values=9
        showMapByEntrySet(userMap); // entrySet=10
        showMapByIterator(userMap); // iterator=9
        
    }
}

```

结论：

- 推荐 Iterator
- 避免 keySet
- 常用 EntrySet

12、HashMap示例
```java
Map<String, String> user1 = new HashMap<>();
user1.put("name", "Tom");
user1.put("age", "23");

Map<String, String> user2 = new HashMap<>();
user2.put("name", "Jack");
user2.put("age", "24");


Map<String, String> user3 = new HashMap<>();
user3.put("name", "Steve");
user3.put("age", "25");


// 将数据放入Map
Map<String, Map> userMap = new HashMap<>();
userMap.put("Tom", user1);
userMap.put("Jack", user2);
userMap.put("Steve", user3);

System.out.println(userMap);
// {
//  Tom={name=Tom, age=23},
//  Steve={name=Steve, age=25},
//  Jack={name=Jack, age=24}
// }


// 将数据放入List
List<Map> userList = new ArrayList<>();
userList.add(user1);
userList.add(user2);
userList.add(user3);

System.out.println(userList);
// [
//  {name=Tom, age=23},
//  {name=Jack, age=24},
//  {name=Steve, age=25}
// ]
```

## HashMap底层原理

1、HashMap默认参数

- 初始化大小=16
- 负载因子=0.75  有效长度：16\*0.75 = 12
- 扩容倍数=2

```java
HashMap()

// 等同于
HashMap(16, 0.75f)
```

根据hash码取余数来决定位置

key是字符串类型
先使用hashCode()方法将key转换成hash码后并进行优化

对优化后的hash码进行取址，确定在HashMap中的位置

```java
int indexFor(int h, int length)
```

数字key存放原理

```
初始大小 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15

要存入的值 
120 % 16  = 8
37 % 16   = 5
61 % 16   = 13 
40 % 16   = 8
92 % 16   = 12
78 % 16   = 14

存放位置 0 1 2 3 4  5   6  7 8    9 10 11 12  13  14 15
                   37       120          92  61  78
                            40

```


验证代码

```java
Map<Integer, String> map = new HashMap<>();

map.put(120, "120");
map.put(37, "37");
map.put(61, "61");
map.put(40, "40");
map.put(92, "92");
map.put(78, "78");

System.out.println(map);
//  {37=37, 120=120, 40=40, 92=92, 61=61, 78=78}
```

2、带参构造方法

```java
HashMap(int initialCapacity, float loadFactor)
HashMap(int initialCapacity)

HashMap(5)
```

initialCapacity 初始化长度内部计算

```java
// 1073741824
static final int MAXIMUM_CAPACITY = 1 << 30;

static final int tableSizeFor(int cap) {
    int n = cap - 1; // 4 => 100
    n |= n >>> 1;  // 100 | 010 => 110
    n |= n >>> 2;  // 110 | 001 => 111
    n |= n >>> 4;  // 111 | 000 => 111
    n |= n >>> 8;  // 111 | 000 => 111
    n |= n >>> 16; // 111 | 000 => 111
    // 111 => 7 + 1 => 8
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}

// 取到大于5，最小的2的n次方
tableSizeFor(5) // 8
```

2倍扩容后重新计算位置

```bash
120 % 16 = 8   ->  120 % 32 = 24
37  % 16 = 5   ->  37  % 32 = 5
61  % 16 = 13  ->  61  % 32 = 29
40  % 16 = 8   ->  40  % 32 = 8
92  % 16 = 12  ->  92  % 32 = 28
78  % 16 = 14  ->  78  % 32 = 14
```

3、问题：

```java
// 问题1：初始化长度是多少？
new HashMap(5) // 8

// 问题2：以下初始化后存入10000条数据，会发生扩容吗？
new HashMap(10000, 0.75f)
// 后台优化：2^14 = 16384 * 0.75 = 12288
// 所以，不会扩容
```

4、性能测试
```java
package com.demo.map;

import java.util.HashMap;
import java.util.Map;

/**
 * 创建10个HashMap,每个HashMap添加1万条数据
 * 传递不同的构造参数，比较速度
 *
 * initialCapacity=16      avg=2318299
 * initialCapacity=10000   avg=1926625
 */
public class MapDemo {

    public static void main(String[] args) {
        long sum = 0L;

        for (int i = 0; i < 10; i++) {
            sum += inputMap(10000);
        }

        System.out.println("avg=" + (sum/10));

    }

    public static long inputMap(int initialCapacity) {
        Map<String, Object> map = new HashMap<>(initialCapacity);
        String key;

        // 获取纳秒
        long start = System.nanoTime();

        for (int i = 0; i < 10000; i++) {
            key = String.valueOf(i);
            map.put(key, "value");
        }

        long end = System.nanoTime();
        long timespan = end - start;
        System.out.println("timespan=" + timespan);
        return timespan;
    }

}

```

## HashMap常用方法

添加元素put putIfAbsent
判断是否为空isEmpty，删除节点remove，清空clear
判断是否有key(containsKey)，是否有value(containsValue)
替换某个key的value（replace， put）

代码实例

```java
Map<String, Object> map = new HashMap<>();

// 添加数据
map.put("name", "Tom");
map.put("age", "12");

// 替换数据
map.put("name", "Jack");
// 替换数据
map.replace("name", "Steve");

//存在则不替换
map.putIfAbsent("name", "Seven");

// 移除数据
map.remove("age");

// 判断key存在，值存在
System.out.println(map.containsKey("name")); // true
System.out.println(map.containsValue("name")); // false

// 判空
System.out.println(map.isEmpty());

System.out.println(map);
// {name=Steve, age=12}

// 清空数据
map.clear();

```

forEach (Lambda表达式)

```java
Map<String, Integer> map = new HashMap<>();

// 添加数据
map.put("a", 1);
map.put("b", 2);

map.forEach((key, value) -> {
    System.out.println(key + ": " + value);
});
// a: 1
// b: 2
```

getOrDefault获取默认值

```java
Map<String, Integer> map = new HashMap<>();

Integer value = map.getOrDefault("a", 666);
System.out.println(value); // 666
```

## LinkedHashMap

性能测试

数据量不同，性能表现也不一样

```java
package com.demo.map;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


public class MapDemo {

    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        Map<String, Integer> linkedMap = new LinkedHashMap<>();

        long start, end;

        // 插入测试
        start = System.currentTimeMillis();
        for (int i = 0; i < 100000; i++) {
            map.put(String.valueOf(i), i);
        }
        end = System.currentTimeMillis();
        System.out.println("map put=" + (end - start));

        start = System.currentTimeMillis();
        for (int i = 0; i < 100000; i++) {
            linkedMap.put(String.valueOf(i), i);
        }
        end = System.currentTimeMillis();
        System.out.println("linkedMap put=" + (end - start));

        // 取出测试
        start = System.currentTimeMillis();
        for (Integer value : map.values()) {
        }
        end = System.currentTimeMillis();
        System.out.println("map get=" + (end - start));

        start = System.currentTimeMillis();
        for (Integer value : map.values()) {
        }
        end = System.currentTimeMillis();
        System.out.println("linkedMap get=" + (end - start));

        // map put = 29
        // linkedMap put = 22
        // map get = 6
        // linkedMap get = 3
    }

}

```

LinkedHashMap实现LRU(Least Recently Used)
LinkedHashMap有序

LRU实现

```java
package com.demo.map;

import java.util.LinkedHashMap;
import java.util.Map;

public class LRUMap<K, V> extends LinkedHashMap<K, V> {

    private int maxSize;

    public LRUMap(int maxSize){
        super(16, 0.75f, true);
        this.maxSize = maxSize;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > this.maxSize;
    }
}

```

测试代码

```java
package com.demo.map;

public class MapDemo {

    public static void main(String[] args) {
        LRUMap<String, Integer> lruMap = new LRUMap<>(3);
        lruMap.put("a", 1);
        lruMap.put("b", 2);

        lruMap.get("a");
        lruMap.put("c", 3);
        lruMap.put("d", 4);

        System.out.println(lruMap);
        //    {a=1, c=3, d=4}
    }

}

```

## TreeMap

默认是key升序排序，可以自定义比较器Comparator

```java
package com.demo.map;

import java.util.Comparator;
import java.util.Map;
import java.util.TreeMap;

public class MapDemo {

    public static void main(String[] args) {
        Map<String, String> treeMap = new TreeMap<>(new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                return o2.compareTo(o1);
            }
        });

        treeMap.put("a", "a");
        treeMap.put("c", "c");
        treeMap.put("b", "b");

        System.out.println(treeMap);
        // 默认： {a=a, b=b, c=c}
        // 比较器排序后：{c=c, b=b, a=a}
    }

}

```

## 耗时对比
```java
package com.demo.map;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;


public class MapDemo {

    public static void main(String[] args) {
        Map<String, Integer> hashMap = new HashMap<>();
        Map<String, Integer> linkedMap = new LinkedHashMap<>();
        Map<String, Integer> treeMap = new TreeMap<>();

        long count = 1000;

        long start, end;

        // 插入测试
        start = System.currentTimeMillis();
        for (int i = 0; i < count; i++) {
            hashMap.put(String.valueOf(i), i);
        }
        end = System.currentTimeMillis();
        System.out.println("map put=" + (end - start));

        start = System.currentTimeMillis();
        for (int i = 0; i < count; i++) {
            linkedMap.put(String.valueOf(i), i);
        }
        end = System.currentTimeMillis();
        System.out.println("linkedMap put=" + (end - start));

        start = System.currentTimeMillis();
        for (int i = 0; i < count; i++) {
            treeMap.put(String.valueOf(i), i);
        }
        end = System.currentTimeMillis();
        System.out.println("treeMap put=" + (end - start));

        // 取出测试
        start = System.currentTimeMillis();
        for (Integer value : hashMap.values()) {
        }
        end = System.currentTimeMillis();
        System.out.println("map get=" + (end - start));

        start = System.currentTimeMillis();
        for (Integer value : linkedMap.values()) {
        }
        end = System.currentTimeMillis();
        System.out.println("linkedMap get=" + (end - start));

        start = System.currentTimeMillis();
        for (Integer value : treeMap.values()) {
        }
        end = System.currentTimeMillis();
        System.out.println("treeMap get=" + (end - start));
    }

}
```

## 课程小结

- Map接口的常见方法
- 对比不同的遍历方法，效率
- 底层原理，创建Map时，针对不同情况选择合适的构造方法
- HashMap、LinkedMap、TreeMap区别与选择




