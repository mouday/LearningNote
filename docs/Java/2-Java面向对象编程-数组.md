# 七、数组的定义与使用
## 25 数组的基本定义
数组：一组相关变量的集合
引用数据类型

数组定义
1、数组动态初始化(默认值是对应类型的默认值)
数据类型 数组名称 [] = new 数据类型[长度];
数据类型[] 数组名称 = new 数据类型[长度];

2、数组静态初始化
简写：
数据类型 数组名称 [] = {数据1， 数据2， 数据3...};

完整格式（推荐）：
数据类型 数组名称 [] = new 数据类型[] {数据1， 数据2， 数据3...};

下标访问元素，下标从0开始
下标范围：0 ~ 长度-1

```java

// 1、动态初始化
int data[] = new int[3];

// 设置值
data[0] = 1;
data[1] = 2;
data[2] = 3;

//遍历，获取值
for (int i = 0; i < data.length ; i++) {
    System.out.println(data[i]);
    // 1 2 3
}


// 2、静态初始化
int[] data = new int[]{1, 2, 3};

//遍历，获取值
for (int i = 0; i < data.length ; i++) {
    System.out.println(data[i]);
    // 1 2 3
}

```

## 26 数组引用传递分析
数组是引用数据类型

```java
int[] data = new int[]{1, 2, 3};
int[] temp = data;
temp[0] = 10;

//遍历，获取值
for (int i = 0; i < data.length ; i++) {
    System.out.println(data[i]);
    // 10 2 3
}
```

## 27 foreach输出
JDK>=1.5 避免操作下标，从.NET引入
语法
```
foreach(数据类型 变量: 数组|集合){}
```

```java
int[] data = new int[]{1, 2, 3};
         
for (int temp : data) {
    System.out.println(temp);
    // 1 2 3
}
```
## 28 二维数组
定义
1、动态初始化
```
数据类型[][] 数组名称 = new 数据类型[行个数][列个数] ;
```

2、静态初始化
```
数据类型[][] 数组名称 = new 数据类型[][] {{数据1, 数据2, ...}, {数据1, 数据2, ...}...} ;
```

```java
int[][] data = new int[][]{{1, 2, 3}, {4, 5, 6}};

// for循环
for (int x = 0 ; x < data.length ; x ++) {
    for (int y = 0 ; y < data[x].length ; y ++) {
        System.out.println(data[x][y]) ;
         // 1 2 3 4 5 6 
    }
}

// foreach 循环
for (int[] row : data) {
    for (int cell : row) {
        System.out.println(cell) ;
        // 1 2 3 4 5 6 
    }
}

```

## 29 数组与方法
同一块堆内存被不同栈变量指向

```java
class ArrayDemo{
    public static int[] getArray(){
        int[] arr = new int[] {1, 2, 3};
        return arr;
    }

    public static void printArray(int[] arr){
        for(int x : arr) {
            System.out.println(x);
        }
    }

    public static void main(String[] args) {
       int[] arr = getArray();
       printArray(arr); 
       // 1 2 3 
    }
}

```

主类：主方法所在的类
主类的功能不能过于复杂

```java
// 封装起来的数组工具类
class ArrayUtil{
    
    public static int getSum(int[] arr){
        int sum = 0 ;

        for(int x : arr){
            sum += x ;
        }
        return sum ;
    }

    public static double getAvg(int[] arr){
        return getSum(arr) / arr.length;
    }

    public static int getMax(int[] arr){
        
        // 假设最大值为第一个元素
        int max = arr[0];

        for(int x : arr){
            if(x > max){
                max = x;
            }
        }
        return max;
    }

    public static int getMin(int[] arr){
        
        // 假设最小值为第一个元素
        int min = arr[0];

        for(int x : arr){
            if(x < min){
                min = x;
            }
        }
        return min;
    }
    
    public static void main(String[] args) {
        int[] arr = new int[] {1, 2, 3, 4, 5};
        System.out.println("sum: " + ArrayUtil.getSum(arr));
        System.out.println("avg: " + ArrayUtil.getAvg(arr));
        System.out.println("max: " + ArrayUtil.getMax(arr));
        System.out.println("min: " + ArrayUtil.getMin(arr));
        /**
        sum: 15
        avg: 3.0
        max: 5
        min: 1
        */
    }
}

```
## 30 数组排序案例分析
类中没有数据，可以使用static 静态方法，直接使用类名调用

```java
// 封装起来的数组工具类
class ArrayUtil{

    public static void sort(int[] arr){
        // 第一层 控制比较次数 length - 1
        for(int y = 0; y < arr.length - 1; y++){
            // 第二层 无序区做比较即可 length - n - 1
            for(int x = 0 ; x < arr.length - y - 1; x++){
                if(arr[x] > arr[x+1]){
                    int temp = arr[x];
                    arr[x] = arr[x + 1];
                    arr[x+1] = temp;
                }
            }
        }
    }

    public static void printArray(int[] arr){
        System.out.print("[ ");

        for(int x : arr){
            System.out.print(x);
            System.out.print(" ");
        }

        System.out.println("]");
    }

    public static void main(String[] args) {
        int[] arr = new int[] {4, 5, 1, 3, 2};
        ArrayUtil.sort(arr) ;
        ArrayUtil.printArray(arr);
        // [ 1 2 3 4 5 ]
    }
}

```
## 31 数组转置案例分析
方式一：
使用临时数组，增加了垃圾
```java
public static int[] reverse(int[] arr){
    int[] temp = new int[arr.length] ;
    int foot = arr.length - 1 ;

    for(int i = 0; i < arr.length ; i++){
        temp[foot--] = arr[i];
    }
    return temp;
}

public static void main(String[] args) {
    int[] arr = new int[] {1, 2, 3, 4, 5};
    arr = ArrayUtil.reverse(arr) ;
    ArrayUtil.printArray(arr);
    // [ 5 4 3 2 1 ]
}
```

java中整数相除，向下取整
```java
System.out.println(5/3); // 1
System.out.println(5.0/3); // 1.66
```

方式二：
使用数组自身交换，使用if，增加了时间复杂度
```java
public static void reverse(int[] arr){
    int center = arr.length / 2;

    int head = 0;
    int tail = arr.length - 1;

    for(int i = 0; i < center ; i++){
        int temp = arr[head];
        arr[head] = arr[tail];
        arr[tail] = temp;
        head ++;
        tail --;
    }
}

public static void main(String[] args) {
    int[] arr = new int[] {1, 2, 3, 4, 5};
    ArrayUtil.reverse(arr) ;
    ArrayUtil.printArray(arr);
    // [ 5 4 3 2 1 ]
}
```

## 32 数组相关类库
1、数组排序 
java.util.Arrays.sort(数组)
```java
int[] arr = new int[] {5, 4, 2, 3, 1};
java.util.Arrays.sort(arr);
ArrayUtil.printArray(arr);
// [ 1 2 3 4 5 ]
```

2、数组拷贝
System.arraycopy(源数组, 源数组开始点, 目标数组, 目标数组开始点, 拷贝长度)
```java
int[] arr1 = new int[] {1, 2, 3, 4, 5};
int[] arr2 = new int[] {11, 22, 33, 44, 55};
System.arraycopy(arr1, 1, arr2, 1, 3) ;

ArrayUtil.printArray(arr2);
// [ 11 2 3 4 55 ]
```

自定义方法实现
```java
public static void arraycopy(int[] source, int sourceIndex, int[] target, int targetIndex, int length){
        for(int i = 0 ; i < length; i++){
            target[targetIndex + i] = source[sourceIndex + i];
        }
    }

public static void main(String[] args) {
    int[] arr1 = new int[] {1, 2, 3, 4, 5};
    int[] arr2 = new int[] {11, 22, 33, 44, 55};
    ArrayUtil.arraycopy(arr1, 1, arr2, 1, 3) ;
    
    ArrayUtil.printArray(arr2);
    // [ 11 2 3 4 55 ]
}
```

## 33 方法可变参数
JDK >= 1.5

```java
// 接收可变参数
public static int getSum(int ... arr){
    int sum = 0 ;

    for(int x : arr){
        sum += x ;
    }
    return sum ;
}

public static void main(String[] args) {
    
    int sum1 = ArrayUtil.getSum(1, 2, 3, 4, 5);
    int sum2 =  ArrayUtil.getSum(new int[] {1, 2, 3, 4, 5});
    
    System.out.println(sum1); // 15
    System.out.println(sum1); // 15 
}

```
## 34 对象数组
```java

class Person{
    private String name;
    private int age;

    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }
    
    public String getInfo(){
        return  "name: " + this.name + 
                " age: " + this.age ;
    }

}
```

动态初始化
```java

Person[] persons = new Person[3];
persons[0] = new Person("张三", 23) ;
persons[1] = new Person("李四", 24) ;
persons[2] = new Person("王五", 25) ;

for (Person person : persons) {
    System.out.println(person.getInfo());
}
/**
name: 张三 age: 23
name: 李四 age: 24
name: 王五 age: 25
*/
```

静态初始化
```java
Person[] persons = new Person[]{
    new Person("张三", 23), 
    new Person("李四", 24),
    new Person("王五", 25) 
};


for (Person person : persons) {
    System.out.println(person.getInfo());
}
/**
name: 张三 age: 23
name: 李四 age: 24
name: 王五 age: 25
*/
```

数组特征：
1、数组缺点：长度固定
2、数组优势：线性保存，根据索引取值，速度较快，时间复杂度为1

# 八、引用传递实际应用
## 35 类关联结构
```java

class Car{
    private String name;
    private double price;
    private Person person;

    public Car(String name, double price){
        this.name = name;
        this.price = price;
    }

    // 设置、获取车主
    public void setPerson(Person person){
        this.person = person ;
    }

    public Person getPerson(){
        return this.person;
    }
    
    public String getInfo(){
        return  "name: " + this.name + 
                " price: " + this.price ;
    }
}

class Person{
    private String name;
    private int age;
    private Car car;

    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }
    
    public String getInfo(){
        return  "name: " + this.name + 
                " age: " + this.age ;
    }

    // 设置、获取车辆
    public void setCar(Car car){
        this.car = car ;
    }

    public Car getCar(){
        return this.car ;
    }

    public static void main(String[] args) {
        Person person = new Person("张三", 23) ;
        Car car = new Car("特斯拉", 24) ; 

        // 关联车辆和人
        person.setCar(car) ; 
        car.setPerson(person) ; 

        // 通过人获取车辆
        System.out.println( person.getCar().getInfo()) ;
        // name: 特斯拉 price: 24.0

        // 通过车辆获取人
        System.out.println( car.getPerson().getInfo()) ;
        // name: 张三 age: 23
    }
}
```

## 36 自身关联
```java

class Car{
    private String name;
    private double price;
    private Person person;

    public Car(String name, double price){
        this.name = name;
        this.price = price;
    }

    // 设置、获取车主
    public void setPerson(Person person){
        this.person = person ;
    }

    public Person getPerson(){
        return this.person;
    }
    
    public String getInfo(){
        return  "name: " + this.name + 
                " price: " + this.price ;
    }
}

class Person{
    private String name;
    private int age;
    private Car car;
    private Person[] children ;

    public Person(String name, int age){
        this.name = name;
        this.age = age;
    }

    // 增加孩子数组
    public Person[] getChildren(){
        return this.children;
    }

    public void setChildren(Person[] children){
        this.children = children ;
    }
    
    public String getInfo(){
        return  "name: " + this.name + 
                " age: " + this.age ;
    }

    // 设置、获取车辆
    public void setCar(Car car){
        this.car = car ;
    }

    public Car getCar(){
        return this.car ;
    }

    public static void main(String[] args) {
        Person person = new Person("张三", 23) ;

        // 添加孩子
        Person childA = new Person("小张", 19) ; 
        Person childB = new Person("小王", 19) ; 

        // 给孩子买车
        childA.setCar(new Car("法拉利", 2000000.00)) ; 
        childB.setCar(new Car("宾利", 8000000.00)) ; 

        person.setChildren(new Person[] {
            childA,
            childB
        }) ;

       System.out.println(person.getInfo()) ;
       for(Person child : person.getChildren()){
            System.out.println( "\t|" + child.getInfo()) ;
            System.out.println( "\t\t|" + child.getCar().getInfo()) ;
       }
       /**
        name: 张三 age: 23
            |name: 小张 age: 19
                |name: 法拉利 price: 2000000.0
            |name: 小王 age: 19
                |name: 宾利 price: 8000000.0
       */

    }
}
```

## 37 合成设计模式
拆分+组合
```java
class 电脑{
    private 主机 对象;
    private 显示器 对象数组;
}

class 显示器{}

class 主机{
    private CPU 对象;
    private 键盘 对象;
    private 键盘 对象;
}

class CPU {}
class 键盘 {}
class 键盘 {}

```
## 38 综合实战：数据表与简单Java类映射转换
数据表与简单Java类之间基本映射关系
数据实体表设计 = 类的定义
表中的字段 = 类的成员属性
表的一行记录 = 类的一个实例化对象
表的多行记录 = 对象数组
表的外键关联 = 引用关联

雇员和部门关系
一个部门对应多个雇员
一个雇员对应一个部门


定义阶段：
定义实体类
配置关联字段

开发阶段：
定义对象
关联关系
根据关系获取数据

## 39 综合实战：一对多映射
班级对学生

## 40 综合实战：多对多映射
商品和顾客

## 41 综合实战：复杂多对多映射
用户 权限





