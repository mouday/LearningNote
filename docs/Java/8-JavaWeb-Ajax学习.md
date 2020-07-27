# Ajax学习
## 课时1 1.ajax简介（异步与同步）
asynchronous javascript and xml
异步js和xml

1、异步交互和同步交互
同步 发送，等待 整个页面刷新
异步 发送，不等待 局部刷新

示例：异步刷新
```html
<button id="btn">点击</button> 
<h2 id="text"></h2>

<script>
// 文档加载完成后马上执行
window.onload = function(){
    let btn = document.getElementById("btn");

    // 给btn注册点击事件监听
    btn.onclick = function(){
        let text = document.getElementById("text");
        text.innerHTML= "hello!";
    }
}
</script>
```

## 课时2 2.异步和同步交互图
数据格式
text、xml、json
同步：
```
请求 -> 
响应 <-

请求 -> 
响应 <-
```

异步：
```
请求 -> 
请求 -> 

响应 <-
响应 <-
```

## 课时3 3.ajax的应用场景和优缺点
优点：
异步交互，增强用户体验
性能：只需要响应部分内容，服务器压力减少

缺点：
ajax不能应用在所有场景
ajax增多了对服务器的请求，给服务器增加压力

## 课时4 4.ajax四步操作
1、获取XMLHttpRequest
```js
// 大多数浏览器
var xmlHttp = new XMLHttpRequest();

// IE6.0
var xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");

// IE<=5.5
var xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
```

编写一个创建XMLHttpRequest对象的函数
```js
function createXMLHttpRequest(){
    try{
        // 大多数浏览器
        return new XMLHttpRequest();
    }catch(e){
        try{
            // IE6.0
            new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e){
            try{
                // IE<=5.5
                new ActiveXObject("Microsoft.XMLHTTP");
            }catch(e){
                console.log("浏览器版本太老了！"); 
                throw e;
            }   
        }   
    }
}
```

2、连接服务器
```js
xmlHttp.open("GET", "/url", true);
// 参数：请求方式，请求url，是否为异步
```

3、发送请求
```js
xmlHttp.send(null);
// 参数：请求体内容，如果是GET,必须给出null，不然FireFox可能不发送
```

4、注册事件监听器
（1）5个状态：
```
0 刚创建
1 请求开始，调用open
2 请求发送完成 调用send
3 服务器开始响应
4 服务器响应结束
```

（2）获取响应内容
```js
// 获取状态
var state = xmlHttp.readyState; 

// 得到服务器响应状态码 200, 404, 500
var status = xmlHttp.status;

// 得到服务器响应内容 
var content = xmlHttp.responseText; // 文本格式
var content = xmlHttp.responseXml; // xml格式，document对象
```

（3）注册监听事件
```js
xmlHttp.onreadystatechange = function(){
    // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        var text = xmlHttp.responseText;
    }
}
```

## 课时5 5.ajax第一例：helloworld
为了便于测试，服务端使用Python语言
服务端 hello.py
```python
# pip install flask, flask-cors
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/")
def index():
    return "<h2>Hello!</h2>"


if __name__ == '__main__':
    app.run()
```

客户端 demo.html
```js
<button id="btn">点击</button> 
<h2 id="text"></h2>

<script>

// 获取XMLHttpRequest对象
function createXMLHttpRequest(){
    try{
        // 大多数浏览器
        return new XMLHttpRequest();
    }catch(e){
        try{
            // IE6.0
            new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e){
            try{
                // IE<=5.5
                new ActiveXObject("Microsoft.XMLHTTP");
            }catch(e){
                console.log("浏览器版本太老了！"); 
                throw e;
            }   
        }   
    }
}

// 文档加载完成后马上执行
window.onload = function(){
    let btn = document.getElementById("btn");

    // 给btn点击事件注册监听
    btn.onclick = function(){
        let xmlHttp = createXMLHttpRequest();
        xmlHttp.open("GET", "http://127.0.0.1:5000/", true);
        xmlHttp.send();
        xmlHttp.onreadystatechange = function(){
            // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var text = xmlHttp.responseText;

            let h2 = document.getElementById("text");
            h2.innerHTML= text;
        }
}

        
    }
}
</script>
```

## 6.ajax第二例：发送POST请求
多添加一个请求头
```js
// 设置请求头
xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

// 发送请求体
xmlHttp.send("username=Tom&age=23");
```

服务端接收函数 hello.py
```python

@app.route("/post", methods=['POST'])
def post():
    username = request.form.get("username")
    age = request.form.get("age")
    return f"<h2>username: {username}, age: {age}</h2>"

```

客户端修改 demo.html
```js
xmlHttp.open("POST", "http://127.0.0.1:5000/post", true);
xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xmlHttp.send("username=Tom&age=23");
```

## 课时7 7.ajax第三例：用户名是否已被注册
客户端要求：
1、注册表单
2、监听用户名文本框失去焦点onblur事件
3、获取文本框内容，通过ajax异步发送给服务器
4、如果为1 显示：用户名已被注册
   如果为0 什么都不显示
```html
<meta charset="utf-8">

<style>
    #errorText {
        color: red;
    }
</style>

<form action="">
    <input type="text" name="username" id="username">
    <span id="errorText"></span>
</form>

<script>

    // 获取XMLHttpRequest对象
    function createXMLHttpRequest() {
        try {
            // 大多数浏览器
            return new XMLHttpRequest();
        } catch (e) {
            try {
                // IE6.0
                new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    // IE<=5.5
                    new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    console.log("浏览器版本太老了！");
                    throw e;
                }
            }
        }
    }

    // 文档加载完成后马上执行
    window.onload = function () {
        let username = document.getElementById("username");

        // 失去焦点注册事件监听
        username.onblur = function () {
            let xmlHttp = createXMLHttpRequest();

            xmlHttp.open("POST", "http://127.0.0.1:5000/validate", true);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xmlHttp.send("username=" + username.value);

            xmlHttp.onreadystatechange = function () {
                // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    var text = xmlHttp.responseText;

                    let errorText = document.getElementById("errorText");
                    if (text == '1') {
                        errorText.innerHTML = "用户名已被注册";
                    } else {
                        errorText.innerHTML = "";
                    }

                }
            }


        }
    }
</script>
```
服务端要求：
1、获取客户端传递的用户名参数
2、判断是否为demo，是返回1，否返回0
```python
@app.route("/validate", methods=['POST'])
def validate():
    username = request.form.get("username")
    if username == "demo":
        return "1"
    else:
        return "0"
```

## 课时8 8.ajax第四例：响应内容为xml
服务端响应头
```
Content-Type: text/xml; charset=utf-8
```

客户端设置
```js
var doc = xmlHttp.responseXML; // 得到Document对象
```

服务端代码
```python
@app.route("/xml")
def xml():
    data = """
        <person>
            <name>Tom</name>
            <age>23</age>
        </person>
    """
    res = make_response(data)
    res.headers['Content-Type'] = 'text/xml; charset=utf-8'
    return res
```

客户端代码
```html
<button id="btn">点击</button>
<h2 id="text"></h2>

<script>

    // 获取XMLHttpRequest对象
    function createXMLHttpRequest() {
        try {
            // 大多数浏览器
            return new XMLHttpRequest();
        } catch (e) {
            try {
                // IE6.0
                new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    // IE<=5.5
                    new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    console.log("浏览器版本太老了！");
                    throw e;
                }
            }
        }
    }

    // 判断是否为IE浏览器
    function isIE() {
        if (window.addEventListener) {
            return false;
        } else {
            return true;
        }
    }

    // 文档加载完成后马上执行
    window.onload = function () {
        let btn = document.getElementById("btn");

        // 注册事件监听
        btn.onclick = function () {
            let xmlHttp = createXMLHttpRequest();

            xmlHttp.open("GET", "http://127.0.0.1:5000/xml", true);
            xmlHttp.send(null);

            xmlHttp.onreadystatechange = function () {
                // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    // 获取响应结果
                    var doc = xmlHttp.responseXML;

                    // IE 和非IE有所区别
                    let name = doc.getElementsByTagName("name")[0].textContent;
                    let age = doc.getElementsByTagName("age")[0].textContent;

                    let text = document.getElementById("text");
                    text.innerHTML = `name: ${name}, age: ${age}`;
                }
            }


        }
    }
</script>
```

## 课时9-10 ajax第五例：省市联动
```
<select name="province" id="">
    <option value="">请选择省份</option>
</select>

<select name="city" id="">
    <option value="">请选择城市</option>
</select>
```

服务端提供两个接口
province
city?province=北京

完整代码
一、前端代码
1、util.js
```js
// 获取XMLHttpRequest对象
function createXMLHttpRequest() {
    try {
        // 大多数浏览器
        return new XMLHttpRequest();
    } catch (e) {
        try {
            // IE6.0
            new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                // IE<=5.5
                new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.log("浏览器版本太老了！");
                throw e;
            }
        }
    }
}

// 判断是否为IE浏览器
function isIE() {
    if (window.addEventListener) {
        return false;
    } else {
        return true;
    }
}
```

2、demo.html
```html
<select name="province" id="province">
    <option value="">请选择省份</option>
</select>

<select name="city" id="city">
    <option value="">请选择城市</option>
</select>

<script src="./util.js"></script>

<script>
    
    function createOption(name) {
        // 创建option元素
        let option = document.createElement("option");
        option.value = name;

        // 创建文本节点
        let textNode = document.createTextNode(name);
        option.appendChild(textNode);
        return option;
    }

    // 文档加载完成后马上执行
    window.onload = function () {
        // 第一步：先获取省级列表
        let xmlHttp = createXMLHttpRequest();
        xmlHttp.open("GET", "http://127.0.0.1:5000/provinces", true);
        xmlHttp.send(null);

        let province = document.getElementById("province");

        xmlHttp.onreadystatechange = function () {
            // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                // 获取响应结果
                var text = xmlHttp.responseText;
                let list = text.split("|"); // 拆分数据得到数组
                for (let item of list) {
                    let option = createOption(item);
                    province.appendChild(option);
                }
            }
        }

        // 第二步：监听省级列表变动，获取城市列表
        province.onchange = function () {
            if (province.value == "") {
                return
            }

            let xmlHttp = createXMLHttpRequest();
            xmlHttp.open("POST", "http://127.0.0.1:5000/cities", true);
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xmlHttp.send(`province=${province.value}`);

            xmlHttp.onreadystatechange = function () {
                // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {

                    // 移除所有结果
                    let city = document.getElementById("city");
                    let optionList = city.getElementsByTagName("option");
                    while (optionList.length > 1) {
                        city.removeChild(optionList[1]);
                    }

                    // 获取响应结果
                    var doc = xmlHttp.responseXML;
                    let cities = doc.getElementsByTagName("city");

                    for (let item of cities) {
                        let cityName = "";
                        // 兼容IE浏览器和其他浏览器
                        if (isIE()) {
                            cityName = item.text; // IE
                        } else {
                            cityName = item.textContent; // FireFox等
                        }
                        let option = createOption(cityName);
                        city.appendChild(option);
                    }

                }
            }
        }

    }
</script>
```

二、后端代码
1、数据文件china.xml
```xml
<china>
    <province name="北京">
        <city>东城区</city>    
        <city>西城区</city>
    </province>    
    <province name="天津">
        <city>和平区</city>    
        <city>河东区</city>
    </province>  
</china>
```

2、数据解析文件demo.py
```python
# pip install lxml
from lxml import etree


class China():
    path = "china.xml"

    @classmethod
    def getProvinces(cls):
        """获取省份
        """
        tree = etree.parse(cls.path)
        return tree.xpath('//province/@name')

    @classmethod
    def getCities(cls, province):
        """获取城市
        """
        tree = etree.parse(cls.path)
        result = tree.xpath(f"//province[@name='{province}']")
        if result:
            return etree.tostring(result[0], encoding="UTF-8")
        else:
            return ""


if __name__ == "__main__":
    print(China.getProvinces())
    print(China.getCities("北京"))

```

3、接口文件
```python
from flask import Flask, request, make_response
from flask_cors import CORS
from demo import China

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/provinces")
def provinces():
    return "|".join(China.getProvinces())


@app.route("/cities", methods=['POST'])
def cities():
    province = request.form.get("province")
    res = make_response(China.getCities(province))
    res.headers['Content-Type'] = 'text/xml; charset=utf-8'
    return res


if __name__ == '__main__':
    app.run(debug=True)

```

## 课时11 11.XStream(可把Javabean转换成XMl的小工具)
依赖
```xml
<dependency>
    <groupId>xstream</groupId>
    <artifactId>xstream</artifactId>
    <version>1.2.2</version>
</dependency>
```

代码实例
```java
import com.thoughtworks.xstream.XStream;

import java.util.ArrayList;
import java.util.List;


class City {
    private String name;

    public City(String name) {
        this.name = name;
    }
}

class Province {
    private String name;
    private List<City> cities = new ArrayList<>();

    public void addCity(City city){
        cities.add(city);
    }

    public Province(String name) {
        this.name = name;
    }
}

public class TestXStream {
    public static void main(String[] args) {
        // 数据准备
        List<Province> list = new ArrayList<Province>();
        Province province = new Province("北京");
        province.addCity(new City("东城区"));
        province.addCity(new City("昌平区"));
        list.add(province);


        XStream xStream = new XStream();

        // 指定别名
        xStream.alias("china", List.class);
        xStream.alias("province", Province.class);
        xStream.alias("city", City.class);

        // 属性设置
        xStream.useAttributeFor(Province.class, "name");

        // 去除无用的标签
        xStream.addImplicitCollection(Province.class, "cities");

        String str = xStream.toXML(list);
        System.out.println(str);
    }
}

```

## 课时12 12.JSON的概述
js提供的一种数据交换格式
Json语法
属性名必须使用双引号括起来
```
对象：{}
属性：
    null、数值、字符串、数组[]、boolean(true/false)
```
```js
var s = "1 + 2";
eval(s); 
// 3
```

1、示例
（1）服务端代码
```python
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/json")
def json():
    return jsonify({"name": "Tom"})


if __name__ == '__main__':
    app.run(debug=True)

```

（2）客户端代码
```html
<button id="btn">点击</button>
<h2 id="text"></h2>

<script src="./util.js"></script>

<script>
    // 文档加载完成后马上执行
    window.onload = function () {
        let btn = document.getElementById("btn");

        btn.onclick = function () {
            let xmlHttp = createXMLHttpRequest();
            xmlHttp.open("GET", "http://127.0.0.1:5000/json", true);
            xmlHttp.send(null);

            xmlHttp.onreadystatechange = function () {
                // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    // 获取响应结果
                    let text = xmlHttp.responseText;
                    let obj = JSON.parse(text);
                    document.getElementById("text").innerHTML = `name: ${obj.name}`;
                }
            }

        }
    }
</script>
```

json与xml比较
可读性
解码难度
流行度

## 课时13 13.json-lib的应用
继承关系
```java
public final class JSONArray extends AbstractJSON 
    implements JSON, List, Comparable

public final class JSONObject extends AbstractJSON 
    implements JSON, Map, Comparable
```
依赖
```xml
<dependency>
    <groupId>net.sf.json-lib</groupId>
    <artifactId>json-lib</artifactId>
    <version>2.4</version>
    <classifier>jdk15</classifier>
</dependency>
```

示例
```java
import net.sf.json.JSONObject;

class Demo {

    public static void main(String[] args)   {
        JSONObject map = new JSONObject();
        map.put("name", "Tom");
        map.put("age", 23);

        String str = map.toString();
        System.out.println(str);
        // {"name":"Tom","age":23}
    }
}

```

java对象转为json

Person.java
```java

public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
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
}

```

Demo.java
```java
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Demo {

    public static void main(String[] args) {
        // 对象转JSONObject
        Person person = new Person("Tom", 23);
        JSONObject obj = JSONObject.fromObject(person);
        System.out.println(obj.toString());
        // {"name":"Tom","age":23}

        // List转 JSONArray
        List<Person> list = new ArrayList<Person>();
        list.add(new Person("Tom", 23));
        list.add(new Person("Jack", 23));
        JSONArray array = JSONArray.fromObject(list);
        System.out.println(array.toString());
        // [{"age":23,"name":"Tom"},{"age":23,"name":"Jack"}]

        // map转JSONObject
        Map<String ,String> map = new HashMap<String ,String>();
        map.put("name", "Tom");
        map.put("sex", "male");
        System.out.println(JSONObject.fromObject(map).toString());
        // {"sex":"male","name":"Tom"}

    }
}

```

## 课时14 14.打包ajax生成小工具
参数
```
option{
    method
    url
    asyn
    type
    callback
    params
    data
}
```
xml
text
json

后端接口
```python
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/json", methods=["GET", "POST"])
def json():
    username = request.args.get("username")

    if request.method == "POST":
        username = request.form.get("username")
        if request.is_json:
            username = request.json.get("username")

    return jsonify({"name": username})


if __name__ == '__main__':
    app.run(debug=True)

```

封装的工具 ajax-util.js
```js
// 获取XMLHttpRequest对象
function createXMLHttpRequest() {
    try {
        // 大多数浏览器
        return new XMLHttpRequest();
    } catch (e) {
        try {
            // IE6.0
            new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                // IE<=5.5
                new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.log("浏览器版本太老了！");
                throw e;
            }
        }
    }
}

// 判断是否为IE浏览器
function isIE() {
    if (window.addEventListener) {
        return false;
    } else {
        return true;
    }
}

/**
 * 将对象转为url查询参数
 * @param {*} data 
 * { "name": "Tom", "age": 23 }
 * -> name=Tom&age=23
 */
function encodeData(data) {
    if (!data) {
        return null;
    }

    let list = [];

    for (let [key, value] of Object.entries(data)) {
        list.push(`${key}=${value}`);
    }

    return list.join("&");
}

const CONTENT_TYPE = "Content-Type";

const contentTypeMap = {
    html: "text/html; charset=utf-8",
    xml: "text/xml; charset=utf-8",
    json: "application/json; charset=utf-8",
    form: "application/x-www-form-urlencoded"
}

/**
 * 
 * @param {*} option:
 *   method
 *   url
 *   asyn
 *   type
 *   callback
 *   params
 *   data 
 */
function ajax(option) {
    // 必传参数
    let url = option.url;
    let callback = option.callback;

    // 可选参数
    let method = option.method || "GET";
    let asyn = option.asyn || true;
    let params = option.params || {};
    let type = option.type || "html";
    let data = option.data || {};

    let xmlHttp = createXMLHttpRequest();

    // 处理响应数据
    xmlHttp.onreadystatechange = function () {
        // 双重判断 xmlHttp状态为服务器响应结束，服务器状态响应结束
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            // 获取响应结果
            let responseData = null;

            if (xmlHttp.responseXML) {
                responseData = xmlHttp.responseXML;
            }
            else {
                responseData = xmlHttp.responseText;
                try {
                    responseData = JSON.parse(responseData);
                } catch (e) {

                }
            }

            callback(responseData);
        }
    }

    // 处理请求数据
    if (params) {
        url = url + "?" + encodeData(params);
    }

    xmlHttp.open(method, url, asyn);
    xmlHttp.setRequestHeader(CONTENT_TYPE, contentTypeMap[type]);

    let sendData = null;
    if (type == "json") {
        sendData = JSON.stringify(data);
    } else {
        sendData = encodeData(data);
    }

    xmlHttp.send(sendData);
}

// console.log(encodeData(undefined));


```

测试代码
```html
<button id="get-btn">GET</button>
<h2 id="get-text"></h2>

<button id="post-btn">POST</button>
<form action="">
    <input type="text" name="username" id="username">
</form>
<h2 id="post-text"></h2>

<script src="./ajax-util.js"></script>
<script>
    // 文档加载完成后马上执行
    window.onload = function () {

        // get方法
        let getBtn = document.getElementById("get-btn");

        getBtn.onclick = function () {
            ajax({
                url: "http://127.0.0.1:5000/json",
                method: "GET",
                params: {
                    "username": "Tom"
                },
                callback: function (data) {
                    console.log(data);
                    document.getElementById("get-text").innerHTML = data.name;
                }
            })
        };

        // post方法
        let postBtn = document.getElementById("post-btn");

        postBtn.onclick = function () {
            ajax({
                url: "http://127.0.0.1:5000/json",
                method: "POST",
                type: "json",
                params: {
                    "username": "Tom"
                },
                data: {
                    "username": document.getElementById("username").value
                },
                callback: function (data) {
                    console.log(data);
                    document.getElementById("post-text").innerHTML = data.name;
                }
            })
        }

    }
</script>
```

