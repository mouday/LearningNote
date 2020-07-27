# MySQLi扩展
## 简介
MySQL增强扩展 PHP>=5

面向过程 + 面向对象
支持预处理语句
支持事务

## 安装配置
1、php配置文件 开启php_mysqli.dll
2、配置extension_dir= ext目录所在位置
3、重启服务器
4、检测扩展开启四种方式
```php
<?php
// 1、查看环境信息
phpinfo();

// 2、检测扩展是否加载 true/false
var_dump(extension_loaded('mysqli'));

// 3、检测函数是否存在
var_dump(function_exists('mysqli_connect'));

// 4、得到当前已经开启的扩展
print_r(get_loaded_extensions());

```

## MySQLi扩展面向对象的使用
1. 建立MySQL连接
2. 打开指定数据库
3. 设置默认客户端字符集 utf-8
4. 执行SQL查询
5. 释放结果集
6. 关闭数据库

MySQLi常用方法
方法 | 说明
-|-
new mysqli() |  实例化
connect()  | 连接
close() |  关闭
select_db() |  选择数据库
connect_errno |  连接错误号
connect_error |  连接错误
client_info |  客户端信息
get_client_info() | 客户端信息
client_version |  客户端版本
server_info |  服务器信息
get_server_info() | 服务器信息
server_version | 服务器版本
set_charset() | 设置字符编码
query() | 执行查询(bool, 获取result_set)
insert_id | 获取自增id
affected_rows |  影响行数（受影响条数>0, 没有影响条数=0, sql有问题=-1）
errorno | 执行错误号
error | 执行错误编码
multi_query() | 执行多条sql，分号分隔
use_result()/store_result() | 获取结果集
more_results() | 检测是否还有更多结果集
next_result() | 结果集指针向下移动一位
prepare() | 预处理语句 占位符：?
$stmt->bind_param() | 绑定参数
$stmt->execute() | 执行sql

结果集方法
方法 | 说明
-|-
$result->num_rows | 结果集数量
$result->fetch_all() | 获取结果集所有数据， 
$result->fetch_row() | 获取结果集一条数据
$result->fetch_assoc() | 获取结果集一条关联数据
$result->fetch_array() | 获取结果集索引+关联数据
$result->fetch_object() | 获取结果集对象
$result->data_seek(0) | 移动结果集内部指针
$result->close() | 释放结果集

fetch_all可选常量参数可省略
索引 MYSQLI_NUM
关联 MYSQLI_ASSOC
索引+关联 MYSQLI_BOTH

使用示例
1、配置信息
```php
$host = 'localhost';
$user = 'root';
$password = '123456';
$database = 'data';
```

2、连接数据库
```php
// 方式一
$mysqli = new mysqli();
$mysqli->connect($host, $username, $password);
$mysqli->select_db($database);

// 方式二
$mysqli = new mysqli($host, $username, $password);
$mysqli->select_db($database);

// 方式三
$mysqli = new mysqli($host, $username, $password, $database);

// 获取连接产生的错误编号和错误信息
if($mysqli->connect_errno){
    die($mysqli->connect_error);
}
 
// 关闭链接
$mysqli->close();
```

3、获取信息
```php
// 客户端信息
echo $mysqli->client_info . PHP_EOL;

echo $mysqli->get_client_info(). PHP_EOL;

// 客户端版本
echo $mysqli->client_version . PHP_EOL;

// 服务端信息
echo $mysqli->server_info . PHP_EOL;

echo $mysqli->get_server_info() . PHP_EOL;

// 服务端版本
echo $mysqli->server_version . PHP_EOL;

```

4、实现sql查询
```php
// @取消警告Warning
$mysqli = @new mysqli($host, $username, $password, $database);

// 获取连接产生的错误编号和错误信息
if($mysqli->connect_errno){
    die($mysqli->connect_error);
}

// 设置编码方式
$mysqli->set_charset('utf8');

// 执行sql 
$sql = 'insert into student(name, age) values("Tom", 25)';
$res = $mysqli->query($sql);
var_dump($res); // bool(true)

if($res){
    // 获取自增id
    echo "自增id：" . $mysql->insert_id;
    echo "插入条数：" . $mysql->affected_rows;
} else{
    // 获取错误号和错误信息
    echo "error" . $mysql->errorno . $mysql->error;
}

// 返回结果 2种 
// select/desc/describe/show/explain 成功返回结果集mysqli_result对象，失败返回false
// 其他执行成功返回true，其他返回false

// 关闭连接
$mysqli->close();
```

php和html混写示例
```php
<!-- 定义变量 -->
<!-- 替代语法 -->
<!-- https://www.jb51.net/article/23252.htm -->
<?php $items = ['Tom', 'Jack', 'Steve']?>

<!-- 循环输出 -->
<?php  $i = 1; foreach($items as $item): ?>

<li><?php echo $i . ' - '. $item ?></li>

<?php $i++; endforeach; ?>

```
输出结果
```
1 - Tom
2 - Jack
3 - Steve
```

示例：执行多条sql
```php

$sql = 'select * from student limit 1;';
$sql .= 'select now()';

$mysqli->multi_query($sql);

do{
    if($mysqli_result = $mysqli->store_result()){
        $rows[] = $mysqli_result->fetch_assoc();
    }
} while($mysqli->more_results() && $mysqli->next_result());

var_dump($rows);
```
   