## Console面板
1、运行JavaScript代码，交互式编程
2、查看程序中打印的Log日志
3、断点调试代码Debugging

```js
// 查看cookie
document.cookie

// 选择元素
document.querySelectorAll("img")


// shift + enter 换行不执行

// 斐波那契

var fibo = function(n){
    return n<3 ? 1 : fibo(n-1) + fibo(n-2); 
}
```

## Console打印Log日志
```js
// 1、信息 ,支持多个参数
console.log("hello", ", ", "world")
// hello ,  world

// 变量替换
var s = "hi";
console.log("%s hello", s);
// hi hello

// 2、警告 
console.warn()

// 3、错误 
console.error()

// 4、表格形式打印json 
console.table({name: "tom"})

// 5、group信息组
console.group("start");
console.log("log");
console.info("info");
console.groupEnd("start");

// 6、自定义样式
console.log("%c这是绿色的日志", "color: green")

document.querySelector("#log").addEventListener("click",()=>{
    console.log("log");
})

// 断言
console.assert(1===2)


// 运行时间
console.time()
// do something
console.timeEnd()

// 清屏
console.clear()
```

## 调试JavaScrip基本流程
1、console.log() 或者 alert() 运行时调试
2、JavaScript断点调试
3、运行时变量调试，修改源代码临时保存调试

（1）debugger
（2）事件断点
（3）源代码断点

```html
<html>

<body>
    <!-- 计算器实例 -->
    <input type="text">
    <input type="text">
    <button>计算</button>
    <p></p>

    <script>
        // 选取button元素
        var button = document.querySelector("button");

        // 添加按钮点击事件
        button.addEventListener("click", () => {
            var inputs = document.querySelectorAll("input");
            
            let a = parseInt(inputs[0].value);
            let b = parseInt(inputs[1].value);

            document.querySelector("p").textContent = a + b;
        })
    </script>
</body>

</html>
```

Snippets
```js
// 添加jQuery
let script = document.createElement("script");
script.src="https://code.jquery.com/jquery-3.4.1.js";

// 防止 CDN 篡改 javascript
script.integrity = "sha256-WpOohJOqMqqyKL9FccASB9O0KwACQJpFTUBLTYOVvVU=";

// 会发起一个跨域请求（即包含Origin: HTTP头）。
// 但不会发送任何认证信息（即不发送cookie, X.509证书和HTTP基本认证信息）。
// 如果服务器没有给出源站凭证（不设置Access-Control-Allow-Origin: HTTP头），这张图片就会被污染并限制使用。 
script.crossOrigin = "anonymous";

document.head.appendChild(script);
```

## Application客户端存储
1、Cookies
添加cookie
document.cookie="a=2"

获取cookie
document.cookie
https://www.runoob.com/js/js-cookies.html

2、LocalStorage 永久存储
LocalStorage.getItem("key")
LocalStorage.setItem("key", "value")

3、SessionStorage 临时存储
sessionStorage.setItem("key", "value")
sessionStorage.getItem("key")


## 其他
网页截屏
comamnd + shifit +p
搜索 Capture full size screenshot

移动端开发调试
Sensors
NetWork conditions

