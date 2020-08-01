
# 第20 章 ： 接口的定义与使用
## 87 接口基本定义

抽象类比普通类的
优势：可以对子类覆写方法控制，
缺点：涉及安全操作问题

接口：纯粹的抽象类，抽象方法和全局常量
JDK 1.8 Lambda

定义，接口名前加入字母I
```
interface I类名{}
```
1、接口需要被子类实现implements,一个子类可以实现多个父接口
2、子类如果不是抽象类，一定要覆写接口中全部抽象方法
3、接口对象可以利用子类对象的向上转型进行实例化

实现接口类增加后缀：Impl
```java
// 定义接口
interface IMessage{
    // 全局常量
    public static final String NAME = "Tom" ;
        
    // 抽象方法
    public abstract String getInfo() ; 
}
   
interface IChanel{     
    // 抽象方法
    public abstract boolean connect() ; 
}

// 实现接口
class MessageImpl implements IMessage, IChanel{
    public  String getInfo() {
        return "hi " + NAME ;
    } 

    public boolean connect() {
        return true;
    }
}


class Demo{
    public static void main(String[] args) {
        IMessage message = new MessageImpl();
        System.out.println(message.getInfo());
    }
}


```
利用接口，子类可以实现多实现
MessageImpl 是 IMessage, IChanel 两个接口的实现子类
接口不能继承父类

Object类对象可以接收所有数据类型
包括：基本数据类型，类对象，接口对象，数组

接口描述的公共定义标准，默认public， 覆写只能是public

以下两种写法等价
```java
interface IMessage{
    public static final String NAME = "Tom" ;
        
    public abstract String getInfo() ; 
}

interface IMessage{
    String NAME = "Tom" ;
        
    String getInfo() ; 
}
```
一个抽象类可以实现多个父接口
一个普通类可以继承一个抽象类，实现多个父接口， 先继承再实现

接口中可以省略 abstract， 抽象类中不能省略

```java
// 定义接口
interface IMessage{
    // 全局常量
    public static final String NAME = "Tom" ;
        
    // 抽象方法
    public abstract String getInfo() ; 
}
   

interface IChanel{     
    // 抽象方法
    public abstract boolean connect() ; 
}


abstract class DatabaseAbstract{
    public abstract boolean getConnect();
}

// 单继承多实现
class MessageImpl extends DatabaseAbstract implements IMessage, IChanel{
    public  String getInfo() {
        return "hi " + NAME ;
    } 

    public boolean connect() {
        return true;
    }

    public boolean getConnect(){
        return true;
    }
}


class Demo{
    public static void main(String[] args) {
        IMessage message = new MessageImpl();
        System.out.println(message.getInfo());
    }
}

```

接口多继承
接口无法继承一个父类，可以继承多个父接口

```java
// 定义接口
interface IMessage{
    public abstract String getInfo() ; 
}
   

interface IChanel{     
    public abstract boolean connect() ; 
}


interface IServer extends IMessage, IChanel{
    public abstract boolean getConnect();
}


class MessageImpl implements IServer{
    public  String getInfo() {
        return "";
    } 

    public boolean connect() {
        return true;
    }

    public boolean getConnect(){
        return true;
    }
}


class Demo{
    public static void main(String[] args) {
        IMessage message = new MessageImpl();
    }
}

```

接口三种使用形式
1、进行标准设置
2、表示一种操作能力
3、暴露远程方法视图，一般在RPC分布式开发使用


## 88 接口定义加强
JDK < 1.8
如果接口设计不当，增加方法难以维护
增加过渡抽象类实现接口，再用子类继承抽象类

JDK >= 1.8
允许接口中定义普通方法


```java
// 定义接口
interface IMessage{
    public abstract String getInfo() ; 
}
   

// 过渡抽象类
abstract class MessageImpl implements IMessage{
    public abstract String getInfo();

    // 扩充的新方法
    public String getMessage(){
        return "message" ;
    }
}


class Message extends MessageImpl{
    public String getInfo(){
        return "info";
    }
}

class Demo{
    public static void main(String[] args) {
        Message message = new Message();
        System.out.println(message.getInfo()); // info

        // 调用新方法
        System.out.println(message.getMessage()); // message
    }
}

```

接口中增加default普通方法
```java
// 定义接口
interface IMessage{
    public abstract String getInfo() ; 

    // 扩充的新方法
    public default String getMessage(){
        return "message" ;
    }
}
   

class Message implements IMessage{
    public String getInfo(){
        return "info";
    }
}

class Demo{
    public static void main(String[] args) {
        Message message = new Message();
        System.out.println(message.getInfo()); // info

        // 调用新方法
        System.out.println(message.getMessage()); // message
    }
}

```
接口中可以增加static方法
```java

// 定义接口
interface IMessage{
    public abstract String getInfo() ; 

    public static IMessage getInstance(){
        return new Message();
    }
}
   

class Message implements IMessage{
    public String getInfo(){
        return "info";
    }
}

class Demo{
    public static void main(String[] args) {
        IMessage message = IMessage.getInstance();
        System.out.println(message.getInfo()); // info

    }
}

```
接口中不建议使static 和default

## 89 使用接口定义标准
接口应用：定制标准

电脑 - USB - 键盘、鼠标

```java
// 定义接口
interface IUsb{
    public abstract boolean check() ; 

    public abstract void work();
}


class Computer{
    public void plugin(IUsb usb){
        if(usb.check()){
            usb.work();
        }else{
            System.out.println("设备连接异常");
        }
    }
}

   
class Keyboard implements IUsb{
    public boolean check(){
        return true;
    } 

    public void work(){
        System.out.println("键盘开始工作");
    }
}


class Mouse implements IUsb{
    public boolean check(){
        return false;
    } 

    public void work(){
        System.out.println("鼠标开始工作");
    }
}

class Demo{
    public static void main(String[] args) {
        Computer computer = new Computer();
        
        Keyboard keyboard = new Keyboard();
        Mouse mouse = new Mouse();

        computer.plugin(keyboard);
        // 键盘开始工作

        computer.plugin(mouse);
        // 设备连接异常
    }
}

```

## 90 工厂设计模式 Factory

new关键字 造成代码耦合
JVM，利用虚拟机来运行Java程序
良好的设计应该避免耦合

客户端类与接口类的子类没有关联，通过Factory联系
如果子类进行扩充，修改Factroy类即可

工厂模式可以隐藏实现子类

```java
interface IFood{
    public abstract void eat();
}

class Apple implements IFood{
    public void eat(){
        System.out.println("吃苹果");
    }
}

class Bread implements IFood{
    public void eat(){
        System.out.println("吃面包");
    }
}

class Factory{
    public static IFood getFood(String foodName){
        if("apple".equals(foodName)){
            return new Apple();
        }
        else if ("bread".equals(foodName)){
            return new Bread();
        }
        else{
            return null;
        }
    }
}

class Demo{
    public static void main(String[] args) {
        IFood food = null;
        food = Factory.getFood("apple");
        food.eat();
        // 吃苹果

        food = Factory.getFood("bread");
        food.eat();
        // 吃面包
    }
}

```

## 91 代理设计模式 Proxy
代理模式主要功能是可以帮助用户将所有开发注意力只集中在核心业务功能上

代理模式特点：
一个接口提供两个子类：
（1）其中一个子类是真实业务操作类
（2）另一个子类是代理业务操作类
没有代理业务，真实业务无法正常执行

类似Python的语法糖装饰器

```java
interface IEat{
    public abstract void get();
}

class RealEat implements IEat{
    public void get(){
        System.out.println("RealEat");
    }
}

class ProxyEat implements IEat{
    private IEat eat;

    public ProxyEat(IEat eat){
        this.eat = eat ;
    }

    public void get(){
        this.preEat();

        this.eat.get();

        this.afterEat();
    }

    public void preEat(){
        System.out.println("preEat");
    }

    public void afterEat(){
        System.out.println("afterEat");
    }
}

class Demo{
    public static void main(String[] args) {
        IEat eat = new ProxyEat(new RealEat());
        eat.get();
        /**
        preEat
        RealEat
        afterEat
        */
    }
}

```

## 92 抽象类与接口区别
抽象类和接口定义非常相似
JDK>=1.8 接口可以定义default、static方法

区别
1、定义
（1）abstract class 抽象类名称{}
（2）interface 接口类名称{}

2、组成
（1）构造方法、普通方法、静态方法、全局常量、普通成员
（2）抽象方法、全局常量、default方法、static方法

3、权限
（1）可以使用各种权限
（2）只能够使用public

4、子类使用
（1）子类通过extends 关键字可以继承一个抽象类
（2）子类使用implements 关键字可以实现多个接口

5、两者关系
（1）抽象类可以实现多个接口
（2）接口不允许继承抽象类，但是允许继承多个父接口

6、使用
（1）抽象类或接口必须定义子类
（2）子类一定要覆写抽象类或接口中的全部抽象方法
（3）通过子类向上转型实现抽象类或接口对象实例化

原则：
当抽象类和接口都可以使用的情况下，优先考虑接口
因为接口可以避免子类的单继承局限

正常的设计角度，也需要从接口开始进行项目的整体设计

## 93 案例分析一（获取类信息）
抽象类和接口是Java最核心的概念

定义ClassName接口
-抽象方法getClassName

类Company实现接口ClassName
-方法getClassName获取该类名称

应用程序使用Company类
```java
// 接口前缀 I
interface IClassName{
    public String getClassName();
}

class Company implements IClassName{
    public String getClassName(){
        return "Company";
    }
}

class Demo{
    public static void main(String[] args) {
        IClassName className = new Company();
        System.out.println(className.getClassName());
        // Company
    }
}

```

## 94 案例分析二（绘图处理）

```java

interface IGraphical{
    public void paint();
}

class Point{
    private int x;
    private int y;

    public Point(int x, int y){
        this.x = x ;
        this.y = y ;
    }

    @Override
    public String toString(){
        return "Point(" + this.x + ", " + this.y + ")" ;
    }

}

class Triangle implements IGraphical{
    private Point p1;
    private Point p2;
    private Point p3;

    public Triangle(Point p1, Point p2, Point p3){
        this.p1 = p1 ; 
        this.p2 = p2 ; 
        this.p3 = p3 ; 
    }

    public void paint(){
        System.out.println("Triangle: " + this.p1 + this.p2 + this.p3);
    }
}


class Rectangle implements IGraphical{
    private Point p1;
    private Point p2;
    private Point p3;
    private Point p4;

    public Rectangle(Point p1, Point p2, Point p3,  Point p4){
        this.p1 = p1 ; 
        this.p2 = p2 ; 
        this.p3 = p3 ; 
        this.p4 = p4 ; 
    }

    public void paint(){
        System.out.println("Rectangle: " + this.p1 + this.p2 + this.p3 + this.p4);
    }
}


class Factory{
    public static IGraphical getInstance(String className, Point ...points){
        if("Triangle".equalsIgnoreCase(className)){
            return new Triangle(points[0], points[1], points[2]) ;

        } else if ("Rectangle".equalsIgnoreCase(className)){
            return new Rectangle(points[0], points[1], points[2], points[3]) ;

        } else {
            return null;
        }

    }
}

class Demo{
    public static void main(String[] args) {
        IGraphical g1 = Factory.getInstance("rectangle", 
            new Point(1, 2),
            new Point(3, 4),
            new Point(5, 6),
            new Point(7, 8)
            );

        g1.paint();
        // Rectangle: Point(1, 2)Point(3, 4)Point(5, 6)Point(7, 8)


        IGraphical g2 = Factory.getInstance("triangle", 
            new Point(1, 2),
            new Point(3, 4),
            new Point(5, 6)
            );

        g2.paint();
        // Triangle: Point(1, 2)Point(3, 4)Point(5, 6)
    }
}

```

## 95 案例分析三（图形）
定义一个形状Shape
抽象方法：面积area、周长perimeter

定义二维形状 矩形，三角形，椭圆等子类

```java
abstract class AbstractShape{
    // 周长
    public abstract double getPerimeter();

    // 面积
    public abstract double getArea();
}

class Circle extends AbstractShape{
    private double radius ;
    private final double PI = 3.14 ;

    public Circle(double radius){
        this.radius = radius ;
    }

    public double getPerimeter(){
        return 2 * PI * this.radius ;
    }

    public double getArea(){
        return PI * this.radius * this.radius ;
    }
}


class Rectangle extends AbstractShape{
    private double length ;
    private double width ;

    public Rectangle(double length, double width){
        this.length = length ;
        this.width = width ; 
    }

    public double getPerimeter(){
        return 2 * (this.length  + this.width ) ;
    }

    public double getArea(){
        return this.length * this.width ;
    }
}

class Factory{
    public static AbstractShape getInstance(String className, double ...args){
        if("Rectangle".equalsIgnoreCase(className)){
            return new Rectangle(args[0], args[1]) ;

        } else if ("Circle".equalsIgnoreCase(className)){
            return new Circle(args[0]) ;

        } else {
            return null;
        }
    }
}

class Demo{
    public static void main(String[] args) {
        AbstractShape shape = Factory.getInstance("Rectangle", 2.0, 3.0) ;
        System.out.println(shape.getArea());  // 6.0
        System.out.println(shape.getPerimeter());  // 10.0

    }
}

```


