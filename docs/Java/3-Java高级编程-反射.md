# 第21 章 ： 认识反射机制
## 99 反射机制简介
Java的精髓所在
动态获取信息以及动态调用对象方法的功能

所有技术实现的目标只有一点：重用性

正：类 -> 实例对象
反：实例对象 -> 类

找到对象的根源
```java
Object.getClass() 
```

## 100 Class类对象的三种实例化模式
```java
public final class Class<T> implements java.io.Serializable,
                              GenericDeclaration,
                              Type,
                              AnnotatedElement
```

要实例化的类
```java
class Person{}
```

1、Object类支持
Object类可以根据实例化对象获取Class对象

缺点：
如果想获得类对象，则必须产生指定类对象后才能获得

```java
Person person = new Person();
Class cls = person.getClass();

System.out.println(cls.getName());
// Person
```

2、JVM直接支持
采用`类.class` 直接实例化
如果要采用这种模式，则必须导入程序所对应开发包

```java
Class cls = Person.class;

System.out.println(cls.getName());
// Person
```

3、Class类支持
Class类中提供了static方法
```java
public static Class<?> forName(String className)
```

特点：
直接使用字符串形式定义要使用的类型，
程序不需要编写import，不存在则抛出异常

```java
Class cls = Class.forName("Person");

System.out.println(cls.getName());
// Person
```

# 第22 章 ： 反射应用案例
## 101 反射实例化对象
获取Class对象意义：
Class对象提供有一个对象的反射实例化方法

1、JDK<1.9
```java
public T newInstance()
// 等价于关键字new, 只能调用无参构造 JDK>=1.9之后弃用
```

示例
```java
Class cls = Class.forName("Person");
System.out.println(cls.newInstance());
// Person@2503dbd3
```

2、JDK>=1.9 
```java
public Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)
```

示例
```java
Class cls = Class.forName("Person");
System.out.println(cls.getDeclaredConstructor().newInstance());
// Person@2503dbd3
```

任何情况下如果要实例化对象则一定要调用类中的构造方法

## 102 反射与工厂设计模式
工厂设计模式：
通过工厂类获取指定接口实例化对象

接口的主要作用是为不同的层提供有一个操作的标准
如果直接将一个子类设置为接口实例化操作，那么一定会有耦合
工厂设计模式解决子类与客户端的耦合问题

1、静态工厂设计模式
如果子类增加，工厂类一定要做出修改
解决一个子类实例化

```java
IMessage
    -NetMessage
    -CloudMessage

Factory // 通过传入的参数获取子类

Client 
```

```java
interface IMessage {
    public void send(String message);
}

class Message implements IMessage {

    @Override
    public void send(String message) {
        System.out.println("发送: " + message);
    }
}

class Factory {
    private Factory() {
    }

    public static IMessage getInstance(String className) {
        if ("Message".equalsIgnoreCase(className)) {
            return new Message();
        }

        return null;
    }
}

public class Demo {
    public static void main(String[] args) {
        IMessage message = Factory.getInstance("message");
        message.send("nihao");
    }
}

```

2、利用反射实现工厂设计模式
解决一个接口多个子类实例化

修改工厂类代码
```java
class Factory {
    private Factory() {
    }

    public static IMessage getInstance(String className) {
        IMessage message = null;

        try {
            message = (IMessage)Class.forName(className).getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return message;
    }
}
```

3、泛型反射实现工厂设计模式
解决所有接口子类实例化

```java

class Factory {
    private Factory() {
    }

    public static <T> T getInstance(String className, Class<T> clazz) {
        T instance = null;

        try {
            instance = (T)Class.forName(className).getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return instance;
    }
}

public class Demo {
    public static void main(String[] args) {
        IMessage message = Factory.getInstance("Message", IMessage.class);
        message.send("nihao");
    }
}
```

## 103 反射与单例设计模式
单例设计模式：
类的构造函数私有化，通过static方法获取实例化对象
-懒汉式
-饿汉式

```java
class Singleton{
    private static Singleton instance = null;

    private Singleton() {
    }

    public static Singleton getInstance(){
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }

    public void print(){
        System.out.println("Singleton");
    }
}

class Demo{
    public static void main(String[] args) {
        Singleton instance = Singleton.getInstance();
        instance.print();
    }
}
```

多线程下执行,产生多个实例化对象
```java
class Singleton{
    private static Singleton instance = null;

    private Singleton() {
        System.out.println("Singleton " + Thread.currentThread().getName());
    }

    public static Singleton getInstance(){
        if(instance == null){
            instance = new Singleton();
        }
        return instance;
    }
    public void print(){
        System.out.println("Singleton print");
    }
}

class Demo{
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            new Thread(()->{
                Singleton instance = Singleton.getInstance();
                instance.print();
            }, "instance" + i).start();
        }

        /**
         * 输出结果
         * Singleton instance0
         * Singleton instance1
         * Singleton print
         * Singleton instance2
         * Singleton print
         * Singleton print
         */
    }
}
```

修改为同步处理
```java
class Singleton{
    // volatile 不使用副本
    private static volatile Singleton instance = null;

    private Singleton() {
        System.out.println("Singleton " + Thread.currentThread().getName());
    }

    // synchronized不在函数上加，而是在内部代码块加，提高执行效率
    public static Singleton getInstance(){
        if(instance == null){
            synchronized (Singleton.class){
                if(instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    
    public void print(){
        System.out.println("Singleton print");
    }
}

class Demo{
    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            new Thread(()->{
                Singleton instance = Singleton.getInstance();
                instance.print();
            }, "instance" + i).start();
        }

        /**
         * 输出结果
         * Singleton instance1
         * Singleton print
         * Singleton print
         * Singleton print
         */
    }
}
```

面试题：单例设计模式
1、实现饿汉式单例设计模式，构造函数私有化
2、Java中用到单例设计模式的类：
Runtime, Pattern, Spring框架
3、懒汉式单例设计模式的问题


# 第23 章 ： 反射与类操作
## 104 反射获取类结构信息
反射机制处理不仅仅只是一个实例化对象的处理，
更多情况下还有类的组成结构操作

任何一个类的组成结构：
父类、父接口、包、属性、方法（构造方法，普通方法）

```java
// 获取包名 
public Package getPackage()

// 获取继承父类
public native Class<? super T> getSuperclass()

// 获取实现父接口
public Class<?>[] getInterfaces()

```

```java
import java.util.Arrays;

abstract class AbstractHuman{
}

interface IConnectService{
    public boolean isConnect();
}

interface IChannelService{
    public void send();
}

class Person extends AbstractHuman implements IConnectService, IChannelService{

    @Override
    public boolean isConnect() {
        return true;
    }

    @Override
    public void send() {
        if(this.isConnect()){
            System.out.println("发送");
        }
    }
}

class Demo{
    public static void main(String[] args) {
        Class<?> cls = Person.class;

        System.out.println(cls.getPackage());
        // null

        System.out.println(cls.getSuperclass());
        // class AbstractHuman

        System.out.println(Arrays.toString(cls.getInterfaces()));
        // [interface IConnectService, interface IChannelService]
    }
}
```

## 105 反射调用构造方法
实例化方法
```java
// 获取指定构造方法
public Constructor<T> getConstructor(Class<?>... parameterTypes)
public Constructor<T> getDeclaredConstructor(Class<?>... parameterTypes)

// 获取全部构造方法
public Constructor<?>[] getConstructors()
public Constructor<?>[] getDeclaredConstructors()


Class.getDeclaredConstructor().newInstance()
```

```java

class Person{
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
}

class Demo{
    public static void main(String[] args) throws Exception {
        Class<?> cls = Person.class;

        // 获取有参构造
        Constructor constructor = cls.getConstructor(String.class, int.class);
        Object obj = constructor.newInstance("小强", 23);
        System.out.println(obj);
        // Person{name='小强', age=23}
    }
}
```

使用反射的类最好提供无参构造方法，便于统一操作

继承关系
```java
AccessibleObject(AnnotatedElement)
    -Executable
        -Constructor
        -Method
    -Field(Member)
```

## 106 反射调用普通方法
了解即可
```java
// 获取指定方法
public Method getMethod(String name, Class<?>... parameterTypes)

// 获取全部方法
public Method[] getMethods()

// 获取本类方法
public Method getDeclaredMethod(String name, Class<?>... parameterTypes)

// 获取本类全部方法
public Method[] getDeclaredMethods()
```

```java
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Arrays;

class Person {
    public String geMessage(String message) {
        return message;
    }
}

class Demo {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Person.class;
        Method method = cls.getMethod("geMessage", String.class);

        System.out.println(method);
        // public java.lang.String Person.geMessage(java.lang.String)

        System.out.println(Modifier.toString(method.getModifiers()));
        // public

        System.out.println(method.getReturnType().getName());
        // java.lang.String

        System.out.println(method.getName());
        // geMessage

        System.out.println(Arrays.toString(method.getParameterTypes()));
        // [class java.lang.String]
    }
}
``` 

Method类 重要方法 invoke
```java
// 反射调用类中的方法
public Object invoke(Object obj, Object... args)
```

整个操作形式上没有任何明确的类对象产生，依靠反射操作，避免耦合问题
```java
import java.lang.reflect.Method;

class Person {
    private String name;

    public Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

class Demo {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Class.forName("Person");
        String key = "name";
        String value = "Tom";
        
        // 获取指定方法
        Method setNameMethod = cls.getMethod("setName", String.class);
        Method getNameMethod = cls.getMethod("getName");

        // 调用无参构造方法实例化
        Object obj = cls.getDeclaredConstructor().newInstance();

        setNameMethod.invoke(obj, value); // 等价于 person.setName(value)
        System.out.println(getNameMethod.invoke(obj));
        // Tom

    }
}
```

## 107 反射调用成员
```java
// 获取本类全部成员
public Field[] getDeclaredFields() 

// 获取本类指定成员
public Field getDeclaredField(String name)

// 获取父类全部成员
public Field[] getFields()

// 获取父类指定成员
public Field getField(String name)
```

Field 类
```java
// 设置属性内容
public void set(Object obj, Object value)

// 获取属性内容
public Object get(Object obj)

// 解除封装
public void setAccessible(boolean flag)
```

```java
import java.lang.reflect.Field;

class Person {
    private String name;

    public Person() {

    }
}

class Demo {
    public static void main(String[] args) throws Exception {
        Class<?> cls = Class.forName("Person");
        Object obj = cls.getDeclaredConstructor().newInstance();

        Field nameField = cls.getDeclaredField("name");

        // 解除封装性，访问私有成员
        nameField.setAccessible(true);

        nameField.set(obj, "Tom");
        System.out.println(nameField.get(obj));
        // Tom
    }
}
```
不建议打破封装机制

Field类重要方法 getType
```java
public Class<?> getType()
```

```java
Class<?> cls = Class.forName("Person");

Field nameField = cls.getDeclaredField("name");

System.out.println(nameField.getType());
// class java.lang.String

System.out.println(nameField.getType().getName());
// 获取包.类 java.lang.String

System.out.println(nameField.getType().getSimpleName());
// 获取类名称 String

```

## 108 Unsafe工具类
通过反射获取对象，并且直接使用底层的C++代码
可以绕过JVM相关管理机制，就无法使用内存管理和垃圾回收

Unsafe 类
```java
public final class Unsafe {
    private static final Unsafe theUnsafe;
    private Unsafe() {}
}
```

Unsafe绕过实例化对象的管理
```java
import sun.misc.Unsafe;

import java.lang.reflect.Field;

// 将构造函数私有化
class Person{
    private Person(){};
    public void print(){
        System.out.println("hi");
    }
}

class Demo {
    public static void main(String[] args) throws Exception {

        Field theUnsafeField = Unsafe.class.getDeclaredField("theUnsafe");
        theUnsafeField.setAccessible(true);
        Unsafe unsafeObject = (Unsafe) theUnsafeField.get(null);

        // 通过unsafe 实例化构造函数私有化的对象
        Person person = (Person) unsafeObject.allocateInstance(Person.class);
        person.print();
        // hi

    }
}
```
如果不是必须的情况下，不建议使用 
Unsafe 类也是单例设计

# 第24 章 ： 反射与简单Java类
## 109 传统属性赋值弊端
简单Java类，setter，getter过多，代码重复
通过反射（Object类直接操作属性或方法）实现相同功能类的重复操作的抽象处理

## 110 属性自动赋值实现思路
类设计的基本机构：
应该由一个专门的ClassInstanceFactory类负责反射处理
接收反射对象与要设置的属性内容，同时可以获取指定类的实例化对象

```java

class ClassInstanceFactory{
    private ClassInstanceFactory(){}

    /**
     * 实例化对象的创建方法，该对象可以根据传入的字符串结构“属性:内容|属性:内容”
     * @param clazz 要进行反射实例化的Class对象，有Class就可以反射实例化对象
     * @param value 要设置给对象的属性内容
     * @return 一个已经配置好属性内容的Java类对象
     */
    public static <T> T getInstance(Class clazz, String value){
        return null;
    }
}
```

## 111 单级属性赋值
完成2项内容：
1、通过反射进行指定类对象的实例化处理
2、进行内容设置 Field Method

必须要有无参构造

处理流程
```
Class<?>
    -Field 
    -Method 调用setter

Utils
    -BeanUtils   获取类型，属性设置
    -StringUtils 首字母大写

ClassInstanceFactory<T> 对象实例化并设置属性

main 测试类

```
即使类中的属性再多，也可以实现属性赋值

StringUtil.java
```java
package util;

class StringUtil{
    /**
     * 首字母大写
     */
    public static String capitalize(String str){
        if(str == null || "".equals(str)){
            return str;
        }
        if(str.length() == 1){
            return str.toUpperCase();
        } else{
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        }
    }
}

```

BeanUtil.java
```java
package util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class BeanUtil {
    /**
     * 对象属性赋值
     * @param obj
     * @param value 数据结构"key:value|key:value"
     */
    public static void setValue(Object obj, String value){
        String[] attrs = value.split("\\|");
        // System.out.println(Arrays.toString(attrs));

        for(String attr : attrs){
            String[] keyValue = attr.split(":");
            String key = keyValue[0];
            String val = keyValue[1];
            
            String setName = "set" + StringUtil.capitalize(key);
            // System.out.println(key + val + setName);

            try{
                Field field = obj.getClass().getDeclaredField(key);
                Method method = obj.getClass().getDeclaredMethod(setName, field.getType());
                method.setAccessible(true);
                method.invoke(obj, val);
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}

```

Demo.java
```java
import util.BeanUtil;

class Person{
    private String name;

    public Person() {
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                '}';
    }
}

/**
 * 属性赋值工厂类
 */
class ClassInstanceFactory{
    private ClassInstanceFactory(){}

    public static <T> T getInstance(Class<T> clazz, String value) {
        try {
            Object obj = clazz.getDeclaredConstructor().newInstance();
            BeanUtil.setValue(obj, value);
            return (T) obj;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}

class Demo{
    public static void main(String[] args) {
        Person person = ClassInstanceFactory.getInstance(Person.class, "name:Tom");
        System.out.println(person);
        // Person{name='Tom'}
    }
}
```

## 112 设置多种数据类型
简单Java类中属性类型
long（Long）
int(Integer)
double(Double)
String

在 BeanUtil.java中添加类型转换方法
```java
package util;

import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class BeanUtil {
    public static void setValue(Object obj, String value){
        String[] attrs = value.split("\\|");        

        for(String attr : attrs){
            String[] keyValue = attr.split(":");
            String key = keyValue[0];
            String val = keyValue[1];

            String setName = "set" + StringUtil.capitalize(key);

            try{
                Field field = obj.getClass().getDeclaredField(key);

                Method method = obj.getClass().getDeclaredMethod(setName, field.getType());
                method.setAccessible(true);
                Object convertVal = convertValue(field.getType().getName(), val);
                method.invoke(obj, convertVal);
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    public static Object convertValue(String type, String value){
        if ("java.lang.String".equals(type)){
            return value;
        } else if("int".equals(type)){
            return Integer.parseInt(value);
        } else{
            return null;
        }
    }
}

```

Person类添加int类型的age属性，和修改测试Demo类传入参数
```java
import util.BeanUtil;

class Person{
    private String name;
    private int age;

    public void setAge(int age) {
        this.age = age;
    }

    public Person() {
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

class Demo{
    public static void main(String[] args) {
        Person person = ClassInstanceFactory.getInstance(Person.class, "name:Tom|age:23");
        System.out.println(person);
        // Person{name='Tom', age=23}
    }
}
```

如果要做一个完整的产品，需要考虑所有可能的类型

## 113 级联对象实例化
例如：
一个员工属于一个部门，一个部门属于一个公司

约定使用`.`作为级联关系
eg:
```
company.dept.dname:财务部
```

考虑代码简洁性


## 114 级联属性赋值

完整代码

StringUtil.java
```java
package util;

class StringUtil{
    /**
     * 首字母大写
     */
    public static String capitalize(String str){
        if(str == null || "".equals(str)){
            return str;
        }
        if(str.length() == 1){
            return str.toUpperCase();
        } else{
            return str.substring(0, 1).toUpperCase() + str.substring(1);
        }
    }
}

```
BeanUtil.java
```java
package util;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class BeanUtil {
    /**
     * 对象属性赋值
     *
     * @param values 数据结构"key:value|key.subKey.subKey:value"
     */
    public static void setValues(Object obj, String values) {
        String[] attrs = values.split("\\|");

        for (String attr : attrs) {
            String[] keyValue = attr.split(":");
            String key = keyValue[0];
            String val = keyValue[1];

            try {
                // 级联关系，通过点. 分隔 eg: company.name
                if (key.contains(".")) {
                    String[] objKeys = key.split("\\.");
                    Object currentObject = obj;

                    // 对象链
                    for (int i = 0; i < objKeys.length - 1; i++) {
                        String objKey = objKeys[i];

                        Object tempObject = getValue(currentObject, objKey);

                        // 没有实例化
                        if (tempObject == null) {
                            tempObject = getFieldInstance(currentObject, objKey);
                            setValue(currentObject, objKey, tempObject);
                        }

                        currentObject = tempObject;
                    }

                    // 最后一个就是属性
                    String attrKey = objKeys[objKeys.length - 1];
                    setValue(currentObject, attrKey, convertFieldValue(currentObject, attrKey, val));
                }

                // 单级关系
                else {
                    setValue(obj, key, convertFieldValue(obj, key, val));
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 给对象设置属性值
     */
    public static void setValue(Object obj, String key, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(key);
            String setName = "set" + StringUtil.capitalize(key);
            Method method = obj.getClass().getDeclaredMethod(setName, field.getType());
            method.setAccessible(true);
            method.invoke(obj, value);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取对象属性值
     */
    public static Object getValue(Object obj, String key) {
        Object value = null;

        try {
            String getName = "get" + StringUtil.capitalize(key);
            Method getMethod = obj.getClass().getDeclaredMethod(getName);
            getMethod.setAccessible(true);
            value = getMethod.invoke(obj);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return value;
    }

    /**
     * 获取对象属性对应类的实例化对象
     */
    public static Object getFieldInstance(Object obj, String key) {
        Object fieldObj = null;

        try {
            Field field = obj.getClass().getDeclaredField(key);
            Constructor constructor = field.getType().getConstructor();
            constructor.setAccessible(true);
            fieldObj = constructor.newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fieldObj;
    }

    /**
     * 转换字符串为对应类型的值
     */
    public static Object convertValue(String type, String value) {

        if ("java.lang.String".equals(type)) {
            return value;
        } else if ("int".equals(type)) {
            return Integer.parseInt(value);
        } else {
            return null;
        }
    }

    public static Object convertFieldValue(Object obj, String key, String value) {
        Object val = null;

        try {
            Field field = obj.getClass().getDeclaredField(key);
            val = convertValue(field.getType().getName(), value);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return val;
    }
}

```

Demo.java
```java
import util.BeanUtil;

class Person {
    private String name;
    private int age;
    private Company company;

    public Person() {
    }

    public void setAge(int age) {
        this.age = age;
    }


    public Company getCompany() {
        return company;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    @Override
    public String toString() {
        return "Person{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", company=" + company +
                '}';
    }


}

class Dept {
    private String name;

    public Dept() {
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Dept{" +
                "name='" + name + '\'' +
                '}';
    }
}

class Company {
    private String name;
    private Dept dept;

    public Company() {
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    public Dept getDept() {
        return dept;
    }

    @Override
    public String toString() {
        return "Company{" +
                "name='" + name + '\'' +
                ", dept=" + dept +
                '}';
    }
}

/**
 * 属性赋值工厂类
 */
class ClassInstanceFactory {
    private ClassInstanceFactory() {
    }

    public static <T> T getInstance(Class<T> clazz, String values) {
        try {
            Object obj = clazz.getDeclaredConstructor().newInstance();
            BeanUtil.setValues(obj, values);
            return (T) obj;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

class Demo {
    public static void main(String[] args) {
        String values = "name:Tom|age:23|company.name:Tech|company.dept.name:law";
        Person person = ClassInstanceFactory.getInstance(Person.class, values);
        System.out.println(person);
        // Person{name='Tom', age=23, company=Company{name='Tech', dept=Dept{name='law'}}}
    }
}
```

# 第25 章 ： ClassLoader类加载器
## 115 ClassLoader类加载器简介
系统环境变量 CLASSPATH 
```
JVM -> ClassLoader -> CLASSPATH -> .class
```

加载器，由上至下执行
```
Bootstrap 系统类加载器

PlatformClassLoader 平台类加载器

AppClassLoader 应用程序加载器

自定义类加载器（磁盘、网络）
```
系统类加载器都是根据CLASSPATH路径查找类加载

应用场景：
客户端动态更新服务器端的代码

Java类加载器：双亲加载机制
为了保证系统安全性，开发者自定义类与系统类重名，不会被加载



/demo/Person.java
```java
public class Person {
    public void sayHello(){
        System.out.println("hello");
    }
}

```

MyClassLoader.java
```java
import java.io.*;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

class MyClassLoader extends ClassLoader {
    private static final String PERSON_CLASS_PATH = "/demo" + File.separator + "Person.class";

    public Class<?> loadMyClass(String className) throws IOException {
        byte[] data = this.loadClassData();
        if (data != null) {
            return super.defineClass(className, data, 0, data.length);
        }
        return null;
    }

    public byte[] loadClassData() throws IOException {
        InputStream input = null;
        ByteArrayOutputStream bos = new ByteArrayOutputStream(); // 将数据加载到内存
        byte[] data = null;
        byte[] temp = new byte[1024];
        int len = 0;

        try {
            input = new FileInputStream(PERSON_CLASS_PATH);

            while ((len = input.read(temp)) != -1) {
                bos.write(temp, 0, len);
            }

            // 读取所有的字节
            data = bos.toByteArray();

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (input != null) {
                input.close();
            }
            if (bos != null) {
                bos.close();
            }
        }
        return data;
    }

}


class Demo {
    public static void main(String[] args) throws Exception{
        MyClassLoader loader = new MyClassLoader();
        Class<?> cls = loader.loadMyClass("Person");
        Object obj = cls.getDeclaredConstructor().newInstance();
        Method method = cls.getDeclaredMethod("sayHello");
        method.invoke(obj);
        // hello
    }
}
```
# 第26 章 ： 反射与代理设计模式
## 117 静态代理设计模式

传统代理设计
必须有接口

标准的代理设计
```java

// 接口标准
interface IMessage {
    void send();
}

// 业务实现类
class MessageImpl implements IMessage {

    @Override
    public void send() {
        System.out.println("发送");
    }
}

// 代理类
class MessageProxy implements IMessage {
    private IMessage message;

    public MessageProxy(IMessage message) {
        this.message = message;
    }

    @Override
    public void send() {
        if (this.isConnect()) {
            this.message.send();
        }
    }

    public void close() {

    }

    public boolean isConnect() {
        return true;
    }
}

class Demo {
    public static void main(String[] args) {
        IMessage message = new MessageProxy(new MessageImpl());
        message.send();
    }
}
```
客户端和接口子类产生了耦合
最好引入工厂设计模式进行代理对象获取

静态代理类：
一个代理类只为一个接口服务

## 118 动态代理设计模式
最好的做法是为所有功能一致的业务操作接口提供统一的代理处理操作

不管是动态代理类还是静态代理类都一定要接收真实业务实现子类对象

代码实现
```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 接口标准
interface IMessage {
    void send();
}

// 业务实现类
class MessageImpl implements IMessage {

    @Override
    public void send() {
        System.out.println("发送");
    }
}


// 动态代理类
class MyProxy implements InvocationHandler{
    private Object target; // 保存真实业务对象

    // 真实业务对象与代理业务对象之间的绑定
    public Object bind(Object target){
        this.target = target;
        Class cls = target.getClass();
        return Proxy.newProxyInstance(cls.getClassLoader(), cls.getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object obj = null;

        if (this.isConnect()) {
            obj = method.invoke(this.target, args);
            this.close();
        }
        return obj;
    }

    public void close() {

    }

    public boolean isConnect() {
        return true;
    }
}

class Demo {
    public static void main(String[] args) {
        IMessage message =(IMessage)new MyProxy().bind(new MessageImpl());
        message.send();
    }
}
```

## 119 CGLIB实现代理设计模式
如果要实现代理设计模式，那么一定是基于接口的应用
CGLIB开发包实现基于类的代理设计模式
Code Generation Library

pom.xml 引入
```java
<dependencies>
    <dependency>
        <groupId>cglib</groupId>
        <artifactId>cglib</artifactId>
        <version>2.2.2</version>
    </dependency>
</dependencies>
```

代码实现
```java
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;

import java.lang.reflect.Method;

// 业务实现类
class Message {
    public void send() {
        System.out.println("发送");
    }
}

// 动态代理类

class MyProxy implements MethodInterceptor {
    private Object target; // 保存真实业务对象

    // 真实业务对象与代理业务对象之间的绑定
    public MyProxy(Object target) {
        this.target = target;
    }

    @Override
    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        Object obj = null;

        if (this.isConnect()) {
            obj = method.invoke(this.target, args);
            this.close();
        }
        return obj;
    }

    public void close() {

    }

    public boolean isConnect() {
        return true;
    }
}

class Demo {
    public static void main(String[] args) {
        Message message = new Message(); // 真实主体
        Enhancer enhancer = new Enhancer(); // 负责代理操作的程序类
        enhancer.setSuperclass(message.getClass()); // 假定一个父类
        enhancer.setCallback(new MyProxy(message));
        Message proxyMessage = (Message) enhancer.create();
        proxyMessage.send();
    }
}
```
建议：基于接口的设计比较合理

# 第27 章 ： 反射与Annotation
## 120 反射取得Annotation信息
JDK > 1.5


不同的Annotation 有他的存在范围
```java
public enum RetentionPolicy {
    SOURCE,
    CLASS,
    RUNTIME
}

```

```java
import java.lang.annotation.Annotation;

@Deprecated
class Person{

}

class Demo{
    public static void main(String[] args) {
        Annotation[] annotations = Person.class.getAnnotations();
        for (Annotation a: annotations){
            System.out.println(a);
            // @java.lang.Deprecated()
        }
    }
}
```

## 121 自定义Annotation
```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

// 定义运行时策略
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation{
    public String name();
    public int age() default 23; // 设置默认值
}


class Message {
    @MyAnnotation(name="Tom")
    public void send(String msg){
        System.out.println(msg);
    }
}

class Demo{
    public static void main(String[] args) throws Exception {
         Method method = Message.class.getDeclaredMethod("send", String.class);
        MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
        String name = annotation.name(); // Tom
        int age = annotation.age();  // 23

        String msg = String.format("[%s] %s ", name, age);
        method.invoke(Message.class.getDeclaredConstructor().newInstance(), msg);
        // [Tom] 23 
    }
}
```

## 122 工厂设计模式与Annotation整合
```java
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

// 消息接口
interface IMessage {
    public void send(String msg);
}

// 消息实现类
class MessageImpl implements IMessage {
    public void send(String msg) {
        System.out.println("消息发送");
    }
}


// 动态代理类
class MessageProxy implements InvocationHandler {
    private Object target;

    public Object bind(Object target) {
        this.target = target;
        return Proxy.newProxyInstance(
                target.getClass().getClassLoader(),
                target.getClass().getInterfaces(),
                this
        );

    }

    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object obj = null;

        if (this.connect()) {
            obj = method.invoke(this.target, args);
        }
        this.close();
        return obj;
    }

    public boolean connect() {
        System.out.println("打开连接");
        return true;
    }

    public void close() {
        System.out.println("关闭连接");
    }

}

// 工厂类
class Factory {
    private Factory() {
    }

    public static <T> T getInstance(Class<T> clazz) {

        try {
            return (T) new MessageProxy().bind(clazz.getDeclaredConstructor().newInstance());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

@Retention(RetentionPolicy.RUNTIME)
@interface UseMessage {
    public Class<?> clazz();
}

// 利用注解实现类的使用
@UseMessage(clazz = MessageImpl.class)
class MessageService {
    private IMessage message;

    public MessageService() {
        UseMessage use = MessageService.class.getAnnotation(UseMessage.class);
        this.message = (IMessage) Factory.getInstance(use.clazz());
    }

    public void send(String msg) {
        this.message.send(msg);
    }
}

class Demo {
    public static void main(String[] args) {
        MessageService message = new MessageService();
        message.send("发送消息");
    }
}
```


