# 第30 章 ： 链表的定义与使用

## 134 链表实现简介
链表本质是一个动态的对象数组，它可以实现若干个对象的存储

链表利用引用的逻辑关系来实现类似于数组的数据处理操作

实现链表，需要一个公共结构-节点：
1、保存数据
2、连接下一个结构
```
Node<E>
-E data
-next
```
还需要一个管理Node节点的类

```
客户端：数据的增删改查
链表LinkImpl：处理Node细节 -> ILink<T>
Node：存储数据
```

```java
private class Node<T>{
    private T data;   // 数据
    private Node<T> nextNode; // 下一节点

    public Node(T data){
        this.data = data ;
    }

    public void setNextNode(Node<T> nextNode){
        this.nextNode = nextNode ;
    }

    public Node<T> getNextNode(){
        return this.nextNode ;
    }

    public T getData(){
        return this.data;
    }
}

```

简单的单向链表实现
135 数据增加
```java
public void add(E e);
```

136 获取数据集合个数
```java
public int size();
```

137 空集合判断
```java
public boolean isEmpty();
```

138 返回集合数据
```java
public Object[] toArray();
```

139 根据索引取得数据
```java
public E get(int index);
```

数组获取数据的时间复杂度为1
链表获取数据的时间复杂度为n

140 修改链表指定索引数据
```java
public void set(int index, E data);
```

141 判断链表数据是否存在
```java
public boolean contains(E data);
```

142 删除链表数据
```java
public void remove(E data);
```
两种情况
删除根节点数据
删除非根节点数据

引用修改

143 清空链表
```java
public void clean();
```
只用设置头节点为空即可

完整代码
```java
// 定义链表的接口
interface ILink<E>{
    public void add(E e);  // 添加元素
    public int size();     // 获取元素个数
    public boolean isEmpty();  // 判断是否为空
    public Object[] toArray();  //转为对象数组
    public E get(int index);  // 根据索引取得数据
    public void set(int index, E data);  //修改数据
    public boolean contains(E data); // 判断数据是否存在
    public boolean remove(E data);  // 链表数据
    public void clean();  // 清空链表
}


// 实现链表
class LinkImpl<T> implements ILink<T>{
    private Node<T> rootNode;  // 记录头指针

    private int count ;    // 计数统计

    private Object[] dataList; // 数据列表
    private int foot; //角标

    // 链表节点，内部类，便于外部类直接访问其私有属性
    private class Node<T>{
        private T data;   // 数据
        private Node<T> nextNode; // 下一节点

        public Node(T data){
            this.data = data ;
        }

        public void addNode(Node<T> node){
            if(!this.hasNextNode()){
                this.nextNode = node;
            } else{
                this.nextNode.addNode(node);
            }
        }

        public boolean hasNextNode(){
            return this.nextNode != null;
        }

        public void toArrayNode(){
            LinkImpl.this.dataList[LinkImpl.this.foot++] = this.data;

            if(this.hasNextNode()){
                this.nextNode.toArrayNode();
            }
        }

        public Node<T> getNode(int index){
            if(LinkImpl.this.foot++ == index){
                return this ;
            }else{
                return this.nextNode.getNode(index);
            }
        }

        public boolean containsNode(T data){
            // 比较对象 不能是null
            if(this.data.equals(data)){
                return true;
            } else {
                // 有后续节点继续
                if(this.hasNextNode()){
                    return this.nextNode.containsNode(data);
                } else {
                    // 没有找到数据
                    return false;
                }
            }
        }
        public boolean removeNode(Node<T> preNode, T data){
            if(this.data.equals(data)){
                preNode.nextNode = this.nextNode;
                return true;
            } else {
                // 有后续节点，继续移除操作
                if(this.hasNextNode()){
                    return this.nextNode.removeNode(this, data);    
                } else{
                    return false;
                }
            }
        }

    }

    public void add(T data){
        // 不接受null 类型的值
        if(!isValidData(data)){
            return;
        }

        Node<T> newNode = new Node<T>(data);

        // 添加第一个元素的时候，头节点为null
        if (this.count == 0){
            this.rootNode = newNode;
        } else {
            this.rootNode.addNode(newNode);
        }

        this.count++;
    }

    public int size(){
        return this.count;
    }

    public boolean isEmpty(){
        return this.count == 0;
    }


    public Object[] toArray(){
        if(this.isEmpty()){
            return null;
        }

        // 角标清零，创建空数组
        this.foot = 0;
        this.dataList = new Object[this.count];
        
        // 递归获取节点数据
        this.rootNode.toArrayNode();

        return this.dataList;

    }

    // 检查索引是否在有效范围内
    private boolean isValidIndex(int index){
        if(index < 0 || index >= count){
            return false;
        } else{
            return true;
        }
    }

    // 检查是否为有效数据
    private boolean isValidData(T data){
        if(data == null){
            return false;
        } else{
            return true;
        }
    }

    public T get(int index){
        if(!this.isValidIndex(index) || this.isEmpty()){
            return null ;
        }

        // 重置下标
        this.foot = 0;
        return this.rootNode.getNode(index).data;
    }

    public void set(int index, T data){
        if(!this.isValidIndex(index) || this.isEmpty() ){
            return ;
        }

        // 重置下标
        this.foot = 0;
        this.rootNode.getNode(index).data = data;
    }

    public boolean contains(T data){
        if(!isValidData(data) || this.isEmpty()){
            return false;
        }
        return this.rootNode.containsNode(data);
    }

    public boolean remove(T data){
        if(!isValidData(data) || this.isEmpty()){
            return false;
        }

        boolean removeResult = false;

        // 移除头节点
        if(this.rootNode.data.equals(data)){
            this.rootNode = this.rootNode.nextNode; 
            removeResult = true;
        } else{
            removeResult = this.rootNode.nextNode.removeNode(this.rootNode, data);
        }
        
        if(removeResult == true){
            this.count --;
        }

        return removeResult;
    }

    public void clean(){
        this.rootNode = null;
        this.count = 0;
    }

    public void printLink(){
        Object[] list = this.toArray();
        
        if (list == null){
            System.out.println("null");
            return;
        }

        for(int i=0; i < this.count; i++){
            if(i == 0){
                System.out.print("[ ");
            } else {
                System.out.print("-> ");
            }

            System.out.print(list[i]); 

            if (i == count - 1){
                System.out.print(" ]");
            }           
        }

        System.out.println();
    }

}

class Demo{
    public static void main(String[] args) {
        LinkImpl<Integer> link = new LinkImpl<Integer>();
        
        System.out.println("添加前：" + link.size() + " " + link.isEmpty());
        // 添加前：0 true

        link.add(2);
        link.add(3);
        link.add(4);
        link.add(5);

        System.out.println("添加后：" + link.size() + " " + link.isEmpty());
        // 添加后：4 false

        link.printLink();
        // [ 2-> 3-> 4-> 5 ]

        System.out.println(link.get(2));
        // 4

        link.set(2, 6);
        System.out.println(link.get(2));
        // 6

        System.out.println(link.contains(10)); // false
        System.out.println(link.contains(5)); // true

        link.printLink();
        // [ 2-> 3-> 6-> 5 ]

        link.remove(2);
        System.out.println(link.contains(2));

        link.printLink();
        // [ 3-> 6-> 5 ]

        link.clean();
        link.printLink();
        // null

    }
}
```

## 144 综合实战：宠物商店

要求
宠物上架，下架，查询宠物信息

设计
宠物接口
    -猫
    -狗

宠物链表接口
    -宠物链表

宠物商店
    -宠物列表

根据接口标准定义信息

## 145 综合实战：超市购物车

类与标准有关，降低类与类之间耦合

## 146 Eclipse简介
Eclipse  中文意思：日蚀

开发工具 + 操作系统 + 中间件 + 数据库
Eclipse EE + Linux + Tomcat + MySQL

https://www.eclipse.org/downloads/

## 147 使用JDT开发Java程序

项目目录
```
src *.java 
bin *.class
```
UTF-8编码

快捷方式：
自动导包
代码格式化
代码纠正提示
代码提示
复制当前行
单行注释
代码自动生成

## 148 代码调试
断点break point

单步跳入 进入代码
单步跳过 直接到结果
单步返回 进入之后直接返回
恢复执行 取消断点，程序正常执行

## 149 junit测试工具
白盒测试
黑盒测试
用例测试 junit

testCase  一个测试
testSuite 一组测试




