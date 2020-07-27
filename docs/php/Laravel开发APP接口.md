## 环境简介
LNMP
1、Linux
2、Nginx
3、MySQL
4、PHP

APP接口
客户端与服务端数据的交换

HTTP通讯三要素
1、URL    地址
2、Method 方式
3、Params 内容

客户端传递参数
1、URl参数 GET
2、Request Body POST
（1）form-url
（2）form-data
（3）json

## 环境搭建
环境要求
PHP >= 7.0.0

全局安装composer
```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
```

配置路径
```
cat ~/.bash_profile

# composer
export PATH=$PATH:$HOME/.composer/vendor/bin
```

安装 Laravel
```
composer global require "laravel/installer"
```

创建新应用
```
laravel new blog
```

本地开发服务器
```
php artisan serve
```

http://localhost:8000

## jquery.ajax

jQuery.ajax([settings])

type 类型：String
默认值: "GET"。请求方式 POST/GET/PUT/DELETE

url 类型：String
默认值: 当前页地址。发送请求的地址

contentType 类型：String
默认值: "application/x-www-form-urlencoded"。发送信息至服务器时内容编码类型。

data 类型：String
发送到服务器的数据

dataType 类型：String
预期服务器返回的数据类型。xml/html/script/json/jsonp/text

success 类型：Function
请求成功后的回调函数。

jsonp 类型：String
在一个 jsonp 请求中重写回调函数的名字

jsonpCallback  类型：String
为 jsonp 请求指定一个回调函数名

ajax发送各种请求
```html
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
</head>

<body>
    <h1>hello</h1>

    <script>
        var data = {
            "name": "Tom",
            "age": 23
        };
        
        // 发送GET请求
        $.ajax({
            type: "GET",
            url: "/api/get",
            dataType: "json",
            data: data,
            success: function(data) {
                console.log(data);
            }
        });
        
        // 发送POST请求 
        // Content-Type: application/x-www-form-urlencoded; charset=UTF-8
        $.ajax({
            type: "POST",
            url: "/api/post-form",
            dataType: "json",
            data: data,
            success: function(data) {
                console.log(data);
            }
        });

        // 发送POST请求  不编码
        // Content-Type: multipart/form-data; charset=UTF-8
        var formData = new FormData();
        formData.append("name", "Tom");
        formData.append("age", "23");

        $.ajax({
            type: "POST",
            url: "/api/post-form-data",
            dataType: "json",
            contentType: false,
            processData: false,  
            data: formData,
            success: function(data) {
                console.log(data);
            }
        });

        // 发送json数据
        // Content-Type: application/json; charset=UTF-8
        $.ajax({
            type: "POST",
            url: "/api/post-json",
            dataType: "json",
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            success: function(data) {
                console.log(data);
            }
        });

        // 发送jsonp数据
        $.ajax({
            type: "GET",
            url: "/api/get-jsonp",
            dataType: "jsonp",
            data: data,
            success: function(data) {
                console.log(data);
            }
        });

    </script>
</body>

</html>
```

PHP后端接收参数

routes/web.php
```php
Route::get('/', function () {
    // return view('welcome');
    return view('index');
});
```

routes/api.php
```php

Route::get('/get', function () {
    $name = $_GET["name"];
    $age = $_GET["age"];
    echo json_encode([$name => $age]); 
});

Route::post('/post-form', function () {
    $name = $_POST["name"];
    $age = $_POST["age"];
    echo json_encode([$name => $age]); 
});

Route::post('/post-form-data', function () {
    $name = $_POST["name"];
    $age = $_POST["age"];
    echo json_encode([$name => $age]); 
});

Route::post('/post-json', function () {
    $ret = file_get_contents("php://input");
    $data = json_decode($ret, true);

    $name = $data["name"];
    $age = $data["age"];
    echo json_encode([$name => $age]); 

});

Route::get('/get-jsonp', function () {
    $callback = $_GET["callback"];

    $name = $_GET["name"];
    $age = $_GET["age"];
    
    echo $callback . "(" . json_encode([$name => $age]) . ")";
});
```

Laravel 接收GET或POST参数
```php
Route::get('/getOrPost', function (Request $request) {
    $name = $request->input("name");
    $age = $request->input("age");

    echo json_encode([$name => $age]); 
});
```

## XML和JSON
APP接口输出格式三要素
code 错误码
msg 错误码描述
data 接口数据

封装app接口数据格式

app/Http/Response/ResponseJson.php
```php
<?php

namespace App\Http\Response;

/**
 * https://www.php.net/manual/zh/language.oop5.traits.php
 * traits 通过组合，代码复用
 */
trait ResponseJson
{   
    /**
     * 接口数据错误时返回
     */
    public function jsonData($code, $message, $data=[])
    {
        return $this->jsonResponse($code, $message, $data);
    }

    /**
     * 接口数据成功时返回
     */
    public function jsonSuccessData($data=[])
    {
        return $this->jsonResponse(0, "success", $data);
    }

    /**
     * 封装接口数据格式
     */
    private function jsonResponse($code, $message, $data)
    {
        $content = [
            "code"    =>  $code,
            "message" =>  $message,
            "data"    =>  $data
        ];
        return json_encode($content);
    }

}

```

app/Http/Controllers/Controller.php
```php

<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use App\Http\Response\ResponseJson;

class Controller extends BaseController
{
    use ResponseJson;

    public function index()
    {
        return $this->jsonSuccessData(["name" => "Tom"]);
    }
}

```

routes/api.php
```php

Route::get('/index', "Controller@index");

```

访问测试
http://127.0.0.1:8000/api/index

```
{
    code: 0,
    message: "success",
    data: {
        name: "Tom"
    }
}
```

## App接口鉴权
客户端需要带着凭证来调用APP接口

传统web cookie session鉴权

Json Web Token JWT
Header
Payload
Signature

Base64URL 算法：
Base64 有三个字符+、/和=，在 URL 里面有特殊含义，
所以要被替换掉：=被省略、+替换成-，/替换成_

问题：
Python binascii.Error: Incorrect padding

解决：
参数最后加上等于号"="(一个或者两个)

http://www.ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html
https://jwt.io/

composer require lcobucci/jwt
composer dump-autoload

## 错误码
错误码是用来描述当前接口处理的结果
错误码是前后端共同的一个约束

```php
class ApiErrDesc
{
    /**
    * 通用错误码
    */
    const SUCCESS = [0, "Success"];
    const UNKNOWN_ERR = [1, "位置错误"];
    

    /**
    * 其他错误码
    */
    const URL_ERR = [2, "url错误"];
}

ApiErrDesc::SUCCESS[0], ApiErrDesc::SUCCESS[1]
```

##  异常处理
设置默认的异常处理程序，用于没有用 try/catch 块来捕获的异常
set_exception_handler

用户信息接口
1、数据库用户信息设计
2、开发用户信息接口
3、使用redis缓存加速用户信息接口

用户表
id、name、sex、email、password、create_time、update_time

unique email

密码hash和密码校验
```shell
$ php -a
Interactive shell

php > $ret = password_hash("123456", PASSWORD_DEFAULT);
php > echo $ret;
$2y$10$6AOQgUCZ7ukn.MAnilB0uuWxu4vrveWCMdPzFg4UyDVI5G7QR.fki
php > echo password_verify("123456", $ret);
1
```

redis 缓存信息加快访问速度


