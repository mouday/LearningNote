XML快速入门
# 第1 章 ： XML入门
## 课时1 XML简介
eXtensible Markup Language
主要使用1.0版本

语言 | 中文名称 | 用途 
- | - | - 
html | 标记型语言      | 显示数据
xml  | 可扩展标记型语言 | 存储数据 

## 课时2 XML的应用
1、传输数据
2、表示有关系的数据
3、配置文件

## 课时3 XML的文档声明
(1)xml的文档声明
(2)定义元素（标签）
(3)注释
(4)特殊字符
(5)CDATA区
(6)PI指令

文件`*.xml`

1、xml的文档声明
必须写在第一行第一列
```xml
<?xml version="1.0" encoding="gbk" ?>

```
属性：
version 版本 1.0
encoding 编码 gbk/utf-8
standalone 依赖其他文件 yes/no

## 课时4 XML中文乱码问题解决
```xml
<?xml version="1.0" encoding="gbk" ?>
<person>
    <name>张三</name>
    <age>23</age>
</person>  
```

## 课时5 XML元素的定义
1、只能有一个根标签
2、合理嵌套
3、空格和换行都会当做原始内容解析
4、有开始必须有结束
```xml
<person></person>  
```

5、标签没有内容，可以在标签内结束
```xml
<person /> 
```
标签命名规则
（1）区分大小写
（2）不能以数字下划线开头
（3）不能以xml、XML、Xml等开头
（4）不能包含空格和冒号
（5）标签可以是中文

## 课时6 XML属性的定义
html和xml都是标记型文档，可以有属性
```xml
<person id="001"></person>
```
属性要求
（1）一个标签可以有多个属性
（2）属性名称不能相同
（3）属性名称与属性值之间使用等号（=）
（4）属性值使用引号（单引号或双引号）包起来
（5）属性名命名贵方和元素的命名规范一致

## 课时7 XML注释
```xml
<!--  这里是注释 -->
```
注释不能嵌套
注释不能放到第一行

## 课时8 XML特殊字符
`>`： `&gt;`
`<`：`&lt;`

## 课时9 XML的CDATA区
可以解决多个字符都需要转义的操作
特殊字符会当做文本内容
```xml
<![CDATA[ 内容 ]]>
```

## 课时10 XML的PI指令
Processing Instruction
可以在xml中设置样式
只能对英文标签起作用
```xml
<?xml version="1.0" encoding="utf-8" ?>
<?xml-stylesheet type="text/css" href="./demo.css" ?>
<person>
    <name>张三</name>
    <age>23</age>
</person>  
```

demo.css
```css
name{
    color: green;
}
```

## 课时11 XML约束简介
1、xml语法总结
（1）所有xml元素都必须有关闭标签
（2）xml标签对大小写敏感
（3）xml必须正确嵌套
（4）xml必须有且只有一个根元素
（5）xml属性值需要加引号
（6）特殊字符必须转义
（7）原样输出文本使用`<![CDATA[]]>`
（8）xml中的空格、回车换行在解析时会被保留

2、xml的约束
（1）dtd约束
（2）scheme约束

# 第2 章 ： DTD（文档类型定义）

## 课时12 DTD快速入门
文件`*.dtd`，使用idea打开会提示
文档类型定义（DTD，Document Type Definition）

1、复杂元素：有子元素的元素
```
<!ELEMENT 元素名称 (子元素)>

eg:
<!ELEMENT person (name,age)>
```

2、简单元素
```
<!ELEMENT 元素名称 (#PCDATA)>

eg:
<!ELEMENT age (#PCDATA)>
```

3、引入dtd文件
```
<!DOCTYPE person SYSTEM "demo.dtd">
```

示例
```xml
<?xml version="1.0" encoding="utf-8" ?>
<!DOCTYPE person SYSTEM "demo.dtd">
<person>
    <name>张三</name>
    <age>23</age>
</person>
```

demo.dtd
```
<!ELEMENT person (name, age)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT age (#PCDATA)>
```

## 课时13 DTD的三种引入方式
1、引入外部
```
<!DOCTYPE 根元素名称 SYSTEM "dtd路径">
```

2、引入内部
```
<!DOCTYPE 根元素名称 [
        <!ELEMENT person (name, age)>
        <!ELEMENT name (#PCDATA)>
        <!ELEMENT age (#PCDATA)>
]>
```

3、使用网络
```
<!DOCTYPE 根元素名称 PUBLIC "DTD名称" "DTD路径URL">
```

## 课时14 使用DTD定义元素
语法
```
<!ELEMENT 元素名 约束>
```

1、简单元素：没有子元素的元素
```
<!ELEMENT 元素名 (#PCDATA)>
```
(#PCDATA) 字符串（需要加括号）
EMPTY 元素为空
ANY 任意

2、复杂元素
```
<!ELEMENT 元素名 (子元素)>
```

（1）子元素出现次数
`+` 一次或多次
`?` 零次或一次
`*` 零次或多次
 
（2）子元素分隔符
逗号隔开：表示出现顺序
竖线隔开：表示任意一个

eg:
```
<!ELEMENT person (name+, age?, sex, school*)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT age (#PCDATA)>
<!ELEMENT sex EMPTY>
<!ELEMENT school ANY>
```

## 课时15 使用DTD定义属性
语法
```
<! ATTLIST 元素名称
    属性名称 属性类型 属性的约束
>
```

1、属性类型
（1）CDATA 字符串
（2）(a|b|c) 枚举
（3）ID 值只能以字母或下划线开头

2、属性的约束
（1）#REQUIRED 属性必须存在
（2）#IMPLIED 属性可有可无
（3）#FIXED  属性必须是固定值
（4）默认值 不写属性做为默认值

eg:
```
<!ATTLIST 页面作者
    姓名 CDATA #REQUIRED
    年龄 CDATA #IMPLIED
    职位 CDATA #FIXED 作者
    爱好 CDATA 写作
>
```

## 课时16 定义实体
语法
```
定义
<!ENTITY 实体名称 "实体值">

使用
&实体名称
```
实体需要定义在内部dtd

## 课时17 W3C的案例
https://www.w3school.com.cn/dtd/dtd_examples.asp

# 第3 章： XML解析之JAXP
## 课时18 XML解析简介
1、dom方式解析xml过程：
根据xml的层级结构，在内存中分配一个树形结构
把xml中每部分都封装成对象

（1）优点：方便实现增、删、改操作
（2）缺点：如果文件过大，造成内存溢出

2、sax方式解析xml过程：
采用事件驱动，边读边解析，从上到下，一行一行的解析，
解析到一个对象，把对象名称返回

（1）优点：不会造成内存溢出，实现查询
（2）缺点：不能实现增、删、改操作

## 课时19 JAXP API的查看
dom和sax解析器：
（1）sun公司   jaxp
（2）dom4j组织 dom4j（实际开发）
（3）jdom组织  jdom

1、jaxp
jaxp是javese一部分
javax.xml.parses
```java
interface Node{
    // 添加节点
    public Node appendChild(Node newChild);

    // 移除节点
    public Node removeChild(Node oldChild);

    // 获取父节点
    public Node getParentNode();

    // 返回文本内容
    public String getTextContent()

}

interface NodeList{
    // 通过下标获取具体值
    public Node item(int index);

    // 得到集合长度
    public int getLength();
}

interface Document extends Node{
    // 获取标签
    public NodeList getElementsByTagName(String tagname);

    // 创建标签
    public Element createElement(String tagName);

    // 创建文本
    public Text createTextNode(String data);

}

abstract DocumentBuilder{
    public Document parse(File f)
}

abstract DocumentBuilderFactory{
    public static DocumentBuilderFactory newInstance()
    public abstract DocumentBuilder newDocumentBuilder()
}

abstract class SAXParser{}

abstract class SAXParserFactory{}
```

## 课时20-21 使用JAXP查询节点
示例：查询xml中所有name值

demo.xml
```xml
<?xml version="1.0" encoding="utf-8" ?>
<list>
    <person>
        <name>张三</name>
        <age>23</age>
    </person>
    <person>
        <name>李四</name>
        <age>24</age>
    </person>
</list>
```

```java
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

public class Demo {
    /**
     * 1、创建解析器工厂
     * 2、根据解析器工厂创建解析器
     * 3、解析xml返回document
     *
     */
    public static void main(String[] args) throws Exception {
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        DocumentBuilder builder = factory.newDocumentBuilder();

        Document document = builder.parse("demo.xml");

        NodeList list = document.getElementsByTagName("name");

        for (int i = 0; i < list.getLength(); i++) {
            Node node = list.item(i);
            String name = node.getTextContent();
            System.out.println(name);
            // 张三 李四
        }
    }
}

```

## 课时22 使用JAXP添加节点
在person节点下添加sex子节点

```java
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.w3c.dom.Element;
import org.w3c.dom.Text;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

public class Demo {

    public static void main(String[] args) throws Exception {
        // 创建解析器工厂
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        // 根据解析器工厂创建解析器
        DocumentBuilder builder = factory.newDocumentBuilder();

        // 解析xml返回document
        Document document = builder.parse("demo.xml");

        NodeList list = document.getElementsByTagName("person");

        // 获取第一个元素
        Node node = list.item(0);

        // 创建一个元素
        Element element = document.createElement("sex");
        Text text = document.createTextNode("女");

        // 添加创建的元素到节点
        element.appendChild(text);
        node.appendChild(element);

        // 回写到硬盘
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.transform(new DOMSource(document), new StreamResult("demo.xml"));
    }
}

```

## 课时23-24 使用JAXP修改、删除节点
xml读取和保存的工具类
```java
package util;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.IOException;

public class DocumentUtil {
    public static Document loadXml(String filename) throws ParserConfigurationException, IOException, SAXException {
        // 创建解析器工厂
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

        // 根据解析器工厂创建解析器
        DocumentBuilder builder = factory.newDocumentBuilder();

        // 解析xml返回document
        return builder.parse(filename);
    }

    public static void dumpXml(String filename, Document document) throws TransformerException {
        TransformerFactory transformerFactory = TransformerFactory.newInstance();
        Transformer transformer = transformerFactory.newTransformer();
        transformer.transform(new DOMSource(document), new StreamResult(filename));
    }
}

``` 

```java
import org.w3c.dom.*;
import util.DocumentUtil;

public class Demo {

    public static void main(String[] args) throws Exception {
        String filename = "demo.xml";
        // 读取
        Document document = DocumentUtil.loadXml(filename);

        // 查询节点
        NodeList list = document.getElementsByTagName("name");
        Node node = list.item(0);

        // 设置节点内容
        node.setTextContent("大壮");

        // 删除节点
        Node parentNode = node.getParentNode();
        parentNode.removeChild(node);

        // 回写到硬盘
        DocumentUtil.dumpXml(filename, document);
    }
}

```

## 课时25 使用JAXP遍历节点
使用递归遍历
```java
import org.w3c.dom.*;
import util.DocumentUtil;

public class Demo {
    public static void listElement(Node node) {
        // 如果节点类型元素节点则打印
        if(node.getNodeType() == node.ELEMENT_NODE){
            System.out.println(node.getNodeName());
        }

        NodeList list = node.getChildNodes();
        
        for (int i = 0; i < list.getLength(); i++) {
            listElement(list.item(i));
        }
    }

    public static void main(String[] args) throws Exception {
        String filename = "demo.xml";
        // 读取
        Document document = DocumentUtil.loadXml(filename);

        listElement(document);
    }
}

```

# 第4 章 ： Schema：基于XML的DTD替代者
## 课时26 Schema的介绍
dtd语法
```
<!ELEMENT 元素名称 约束>
```
scheme符合xml语法
一个xml可以有多个scheme，使用名称空间区分
dtd有PCDAT类型scheme支持更多数据类型
scheme语法更加复杂

Schema 教程
https://www.w3school.com.cn/schema/index.asp

## 课时27 Schema的开发过程
文件`*.xsd`

1、属性
```xml
<!-- 表示约束文件 -->
xmlns="http://www.w3.org/2001/XMLSchema"

<!-- 约束文件命名空间 url地址保证不会重复 -->
targetNamespace="http://www.w3school.com.cn"

<!-- 质量良好 -->
elementFormDefault="qualified"
```

2、复杂元素
```
<complexType>
    <sequence>
        <element name="name" type="string"></element>
        <element name="age" type="int"></element>
    </sequence>
</complexType>
```

3、引入约束文档
```xml
表示被约束文档，别名xsi
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

路径地址
xsi:schemaLocation="http://www.w3school.com.cn demo.xsd">
```

完整示例
demo.xsd
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<schema xmlns="http://www.w3.org/2001/XMLSchema"
        targetNamespace="http://www.w3school.com.cn"
        elementFormDefault="qualified">
    <element name="person">
        <complexType>
            <sequence>
                <element name="name" type="string"></element>
                <element name="age" type="int"></element>
            </sequence>
        </complexType>
    </element>
</schema>
```

引入xsd文件
```xml
<?xml version="1.0" encoding="utf-8" standalone="no"?>
<person xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns="http://www.w3school.com.cn"
      xsi:schemaLocation="http://www.w3school.com.cn demo.xsd">
        <name>张三</name>
        <age>23</age>
</person>
```

## 课时28 Schema约束API查看
sequence 表示元素出现顺序
all 只能出现一次
choice 出现任意一个
maxOccurs="unbounded" 出现次数没有限制
any 任意元素

复杂元素中定义属性
```
<attribute name="age" type="int" use="required"></attribute>
```
引入多个schema，可以给每个schema取别名

## 课时29 sax解析的过程
dom 内存虚拟树形结构
sax 事件驱动，边读边解析

```java
package org.xml.sax;

public class HandlerBase{
    public void startElement (String name, AttributeList attributes);
    public void characters (char ch[], int start, int length);
    public void endElement (String name);
}


package org.xml.sax.helpers;

public class DefaultHandler{
    public void startElement (String uri, String localName,
                              String qName, Attributes attributes)    

    public void endElement (String uri, String localName, String qName)
    public void characters (char ch[], int start, int length)
}

```

## 课时30 使用Schema的sax方式操作xml

demo.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<person> 
    <name>张三</name>  
    <age>23</age> 
</person>

```

使用jaxp的sax解析只能进行查询操作
```java

import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

public class Demo {
    
    public static void main(String[] args) throws Exception {

        SAXParserFactory factory = SAXParserFactory.newInstance();
        SAXParser parser = factory.newSAXParser();

        // 传入事件处理类
        parser.parse("demo.xml", new MyDefaultHandler());

    }
}

/**
 * 自定义事件处理
 */
class MyDefaultHandler extends DefaultHandler {

    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) {
        System.out.println(qName);
    }

    @Override
    public void endElement(String uri, String localName, String qName) {
        System.out.println(qName);
    }

    @Override
    public void characters(char[] ch, int start, int length) {
        System.out.println(new String(ch, start, length));
    }
}

```

# 第5 章 ： XML解析之dom4j
## 课时31 dom4j的简介
https://dom4j.github.io/
依赖
```xml
<dependency>
    <groupId>org.dom4j</groupId>
    <artifactId>dom4j</artifactId>
    <version>2.0.0</version>
</dependency>
```

demo.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<list> 
  <person> 
    <name>张三</name>  
    <age>23</age> 
  </person>  
  <person> 
    <name>李四</name>  
    <age>24</age> 
  </person> 
</list>
```
## 课时32 使用dom4j实现查询xml操作
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.util.List;

class Demo {

    public static void main(String[] args) throws DocumentException {
        // 创建解析器
        SAXReader reader = new SAXReader();

        // 得到Document
        Document document = reader.read("demo.xml");

        // 获取根元素
        Element root = document.getRootElement();

        // 得到所有person标签
        List<Element> list = root.elements("person");

        // 遍历标签
        for (Element element : list) {
            Element name = element.element("name");

            // 获取值
            String text = name.getText();
            System.out.println(text);
        }
    }
}

```

## 课时33 使用dom4j实现在末尾添加节点的操作
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.FileOutputStream;
import java.io.IOException;

class Demo {

    public static void main(String[] args) throws DocumentException, IOException {
        // 创建解析器， 得到Document
        SAXReader reader = new SAXReader();
        Document document = reader.read("demo.xml");

        // 获取根元素
        Element root = document.getRootElement();

        // 添加元素并设置内容
        Element person = root.element("person");
        Element sex = person.addElement("sex");
        sex.setText("男");

        // 回写并格式化
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter xmlWriter = new XMLWriter(new FileOutputStream("demo.xml"), format);
        xmlWriter.write(document);
        xmlWriter.close();
    }
}

```
## 课时34 使用dom4j实现在在特定位置添加节点的操作
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;

class Demo {

    public static void main(String[] args) throws DocumentException, IOException {
        // 创建解析器， 得到Document
        SAXReader reader = new SAXReader();
        Document document = reader.read("demo.xml");
        Element root = document.getRootElement();

        // 指定位置添加元素
        Element person = root.element("person");
        List<Element> list = person.elements();
        Element sex = DocumentHelper.createElement("sex");
        sex.setText("女");
        list.add(1, sex);

        // 回写并格式化
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter xmlWriter = new XMLWriter(new FileOutputStream("demo.xml"), format);
        xmlWriter.write(document);
        xmlWriter.close();
    }
}

```

## 课时35 dom4j里面封装方法的操作
```java
package util;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.FileOutputStream;
import java.io.IOException;

public class Dom4jUtil {
    public static Document getDocument(String path) throws DocumentException {
        // 创建解析器， 得到Document
        SAXReader reader = new SAXReader();
        return reader.read(path);
    }

    public static void writeXml(String path, Document document) throws IOException {
        // 回写并格式化
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter xmlWriter = new XMLWriter(new FileOutputStream(path), format);
        xmlWriter.write(document);
        xmlWriter.close();
    }
}

```

## 课时36 使用dom4j实现修改的操作
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import util.Dom4jUtil;

import java.io.IOException;

class Demo {

    public static void main(String[] args) throws DocumentException, IOException {
        // 创建解析器， 得到Document
        String path = "demo.xml";
        Document document = Dom4jUtil.getDocument(path);

        // 获取根元素
        Element root = document.getRootElement();

        Element peron = root.element("person");
        Element sex = peron.element("sex");
        sex.setText("男");

        // 回写并格式化
        Dom4jUtil.writeXml(path, document);
    }
}

```

## 课时37 使用dom4j实现删除节点的操作
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import util.Dom4jUtil;

import java.io.IOException;

class Demo {

    public static void main(String[] args) throws DocumentException, IOException {
        String path = "demo.xml";
        Document document = Dom4jUtil.getDocument(path);

        // 获取根元素
        Element root = document.getRootElement();
        Element person = root.element("person");
        Element sex = person.element("sex");

        // 通过父节点删除
        sex.getParent().remove(sex);

        // 回写并格式化
        Dom4jUtil.writeXml(path, document);
    }
}

```

## 课时38 使用dom4j实现获取属性值的操作
demo.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<person id="001">
    <name>张三</name>
    <age>23</age>
</person>

```

```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import util.Dom4jUtil;

import java.io.IOException;

class Demo {

    public static void main(String[] args) throws DocumentException, IOException {
        String path = "demo.xml";
        Document document = Dom4jUtil.getDocument(path);

        Element root = document.getRootElement();
        String id = root.attributeValue("id");
        System.out.println(id); // 001

    }
}

```

# 第6 章 ： XPATH
## 课时39 XPATH简介
dom4j支持xpath操作

可以直接获取元素
```
/a/b/c             一层一层选择
//b                不管层级，直接选择b
/*                 所有元素
/a/b[1]            第一个b元素
/a/b[last()]       最后一个b元素
//b[@id]           只要有id属性 
//b[@name="bbb"]   name属性等于bbb
```

## 课时40 使用dom4j支持XPATH的操作一
jaxen

selectNode()
selectSingleNode()


demo.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<person id="001">
    <name>张三</name>
    <age>23</age>
</person>

```
示例：得到所有name节点
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import util.Dom4jUtil;

import java.util.List;

class Demo {

    public static void main(String[] args) throws DocumentException {
        String path = "demo.xml";
        Document document = Dom4jUtil.getDocument(path);

        // 获取元素
        List<Node> list = document.selectNodes("//name");

        // 遍历集合
        for (Node node : list) {
            String text = node.getText();
            System.out.println(text);
        }

    }
}

```

## 课时41 使用dom4j支持XPATH的操作二
```java
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import util.Dom4jUtil;

class Demo {

    public static void main(String[] args) throws DocumentException {
        String path = "demo.xml";
        Document document = Dom4jUtil.getDocument(path);

        // 获取根元素
        Node name = document.selectSingleNode("/person[@id='001']/name");
        System.out.println(name.getText());
    }
}

```

# 第7 章 ： 案例
## 课时42-44 学生管理系统实现-添加、删除、查询操作
使用xml作为数据库，存储学生数据

依赖
```xml
<dependency>
    <groupId>org.dom4j</groupId>
    <artifactId>dom4j</artifactId>
    <version>2.0.0</version>
</dependency>
```

demo.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>

<list>

</list>

```

Dom4jUtil.java
```java
package util;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.FileOutputStream;
import java.io.IOException;

public class Dom4jUtil {
    public static Document getDocument(String path) throws DocumentException {
        // 创建解析器， 得到Document
        SAXReader reader = new SAXReader();
        return reader.read(path);
    }

    public static void writeXml(String path, Document document) throws IOException {
        // 回写并格式化
        OutputFormat format = OutputFormat.createPrettyPrint();
        XMLWriter xmlWriter = new XMLWriter(new FileOutputStream(path), format);
        xmlWriter.write(document);
        xmlWriter.close();
    }

}

```
Student.java
```java
package com.pengshiyu.student;

public class Student {
    private String id;
    private String name;
    private int age;

    public Student() {
    }

    public Student(String id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }


    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Student{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}

```

StudentService.java
```java
package com.pengshiyu.student;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import util.Dom4jUtil;

import java.io.IOException;
import java.util.List;

public class StudentService {
    private static final String path = "demo.xml";

    /**
     * 添加数据
     *
     * @param student
     * @throws DocumentException
     * @throws IOException
     */
    public static void addStudent(Student student) throws DocumentException, IOException {
        Document document = Dom4jUtil.getDocument(path);
        Element root = document.getRootElement();

        Element person = root.addElement("person");

        Element id = person.addElement("id");
        id.setText(student.getId());

        Element name = person.addElement("name");
        name.setText(student.getName());

        Element age = person.addElement("age");
        age.setText(String.valueOf(student.getAge()));

        Dom4jUtil.writeXml(path, document);
    }

    /**
     * 删除数据
     *
     * @param uid
     * @throws IOException
     * @throws DocumentException
     */
    public static void removeStudent(String uid) throws IOException, DocumentException {
        Document document = Dom4jUtil.getDocument(path);

        // 获取所有的id
        List<Node> list = document.selectNodes("//id");
        for (Node node : list) {
            String nodeId = node.getText();
            // System.out.println(nodeId);

            // 判断id相同，通过祖父节点移除父节点
            if (uid.equals(nodeId)) {
                Element parent = node.getParent();
                Element grandfather = parent.getParent();
                grandfather.remove(parent);
            }
        }
        Dom4jUtil.writeXml(path, document);
    }

    /**
     * 查询数据
     *
     * @param uid
     * @return
     * @throws IOException
     * @throws DocumentException
     */
    public static Student getStudent(String uid) throws DocumentException {
        Document document = Dom4jUtil.getDocument(path);

        // 获取所有的id
        List<Node> list = document.selectNodes("//id");
        for (Node node : list) {
            String nodeId = node.getText();
            // System.out.println(nodeId);

            // 判断id相同，通过祖父节点移除父节点
            if (uid.equals(nodeId)) {
                Element parent = node.getParent();

                Student student = new Student();
                student.setId(parent.element("id").getText());
                student.setName(parent.element("name").getText());
                student.setAge(Integer.parseInt(parent.element("age").getText()));

                return student;
            }
        }
        return null;
    }
}

```

StudentTest.java
```java
package com.pengshiyu.student;

import org.dom4j.DocumentException;
import org.junit.Test;

import java.io.IOException;

public class StudentTest {

    @Test
    public void testAddStudent() throws IOException, DocumentException {
        Student student = new Student("001", "Tom", 23);
        StudentService.addStudent(student);
    }

    @Test
    public void testRemoveStudent() throws IOException, DocumentException {
        StudentService.removeStudent("001");
    }

    @Test
    public void testGEtStudent() throws IOException, DocumentException {
        Student student= StudentService.getStudent("001");
        System.out.println(student);
    }
}

```
