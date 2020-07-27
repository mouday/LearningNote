
# Laravel-基础篇
## 一、Laravel简介

框架提供的功能：
1、数据库DB
2、缓存Cache
3、会话Session
4、文件上传

流行框架的优点
文档齐全
社区活跃
后期支持

Laravel简介
1、简洁，优雅
2、验证，路由，session缓存，数据库迁移功能，单元测试

版本选择
长期支持 LTS Long Time support

## 二、环境配置
服务器环境
```
$ php -v
PHP 7.1.23
```
Laravel 5.8  要求：PHP >= 7.1.3
文档：[https://laravel.com/docs/5.8](https://laravel.com/docs/5.8)

MVC数据交互
```
视图View <-> 控制器Controller <-> 模型Model
```

Mac MAMP
Win XAMPP

phpinfo.php
```php
<?php

phpinfo();
```

设置国内镜像
```bash
# 查看全局设置
composer config -gl

# 设置镜像
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer

# 解除镜像
composer config -g --unset repos.packagist

```
>参考[国内的Composer全量镜像汇总](https://qq52o.me/2692.html)

创建项目
```
$ composer create-project laravel/laravel=5.8.* demo --prefer-dist
$ cd demo
$ php artisan --version
Laravel Framework 5.8.35

# 启动服务
$ php artisan serve
```
访问：http://127.0.0.1:8000

整个文件夹大小
Laravel Framework 5.8.35 32.8M
ThinkPHP_5.0.24_with_extend 5.6M

## 三、路由
1、路由简介
路由将用户的请求转发给对应的程序进行处理
作用：建立url和程序之间的映射
请求类型：get、post、put、patch、delete
路由文件：routes/web.php

2、基本路由

```php

Route::get('hello', function () {
    return 'hello world';
});

Route::post('post', function () {
    return 'post';
});
```

3、多请求路由
```php
Route::match(['get', 'post'], 'match', function () {
    return 'match';
});

Route::any('any', function () {
    return 'any';
});
```

4、路由参数

```php

Route::get('detail/{id}', function ($id) {
    return 'detail-id: ' . $id ;
});

// 默认参数
Route::get('detail/{name?}', function ($name = null) {
    return 'detail-name: ' . $name ;
});

// 正则判断参数类型
Route::get('detail/{id}', function ($id) {
    return 'detail-id: ' . $id ;
})->where('id', '\d+');

Route::get('detail/{name?}', function ($name = null) {
    return 'detail-name: ' . $name ;
})->where('name', '[A-Za-z]+');

// 多个参数校验
Route::get('detail/{id}/{name?}', function ($id, $name = null) {
    return 'detail-id: ' . $id  . ' detail-name: ' . $name ;
})->where(['id' => '\d+', 'name' => '[A-Za-z]+']);

```

5、路由别名

```php
Route::get('path', ['as'=>'alias', function(){
    return Route('alias');
}]);
```

6、路由群组
```php
Route::group(['prefix' => 'user'], function (){
   // 访问方式：user/name
   Route::get('name', function (){
       return 'user name';
   });

   // 访问方式：user/age
    Route::get('age', function (){
        return 'user age';
    });
});
```

7、路由中输出视图
```php
Route::get('/', function () {
    return view('welcome');
    // resources/views/welcome.blade.php
});
```

## 四、控制器
路由只接收请求，具体业务逻辑交由控制器处理

1、新建控制器
app/Http/Controllers/MemberController.php
```php

namespace App\Http\Controllers;


class MemberController extends Controller
{
    function info(){
        return 'hello world';
    }
}

```

2、控制器和路由关联
```php
Route::get('member/info', 'MemberController@info');

// 或者
Route::get('member/info', ['uses' => 'MemberController@info']);

```

3、关联控制器后，路由特性使用
```php

// 别名
Route::get('member/info', [
    'uses' => 'MemberController@info',
    'as' => 'memberinfo'
]);
// 控制器中使用别名
// Route('memberinfo');

// 路由参数
Route::get('member/info/{id}', 'MemberController@info');
// 控制器接收参数
// function info($id){
//     return 'info:' . $id;
// }

// 验证路由参数
Route::get('member/info/{id}', 'MemberController@info')
    ->where('id', '[0-9]+');

```

## 五、视图
一个控制器对应一个目录

1、新建视图
如果要输出变量，注意后缀为 `blade.php`
resources/views/member/info.blade.php
```html

<h1>member info</h1>
name: {{$name}}
age: {{$age}}

```

2、输出视图
路由配置

```php
Route::get('member/info', 'MemberController@info');
```

控制器方法
```php
class MemberController extends Controller
{
    function info(){
        $data = [
          'name' => 'Tom',
          'age' => 18
        ];

        return view('member/info', $data);
    }
}
```

## 六、模型
1、新建模型
app/Member.php

```php
namespace App;


use Illuminate\Database\Eloquent\Model;


class Member extends Model
{
   public static function getMember(){
       return [
           'name' => 'Tom',
           'age' => 18
       ];
   }
}

```

2、使用模型

```php

namespace App\Http\Controllers;


use App\Member;


class MemberController extends Controller
{
    function info(){

        $data = Member::getMember();

        return $data
    }
}

```

## 七、数据库
Laravel提供3种操作数据库方式
1、DB facade 原始查找
2、查询构造器query builder
3、Eloquent ORM

## 八、DB facade 原始查找
1、新建数据表与连接数据库
```sql
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `sex` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `created_at` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` int(11) NOT NULL DEFAULT '0' COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学生表'
```

2、配置数据连接库参数
.env
```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=data
DB_USERNAME=root
DB_PASSWORD=123456
```

3、使用DB facade实现CURD
如果配置完数据库信息不生效，可以清理缓存重启服务

```
php artisan cache:clear
php artisan config:clear
php artisan serve
```

CURD函数
```php
static array select(string $query, array $bindings = [])
static bool insert(string $query, array $bindings = [])
static int update(string $query, array $bindings = [])
static int delete(string $query, array $bindings = [])
```

完整示例
```php

namespace App\Http\Controllers;


use Illuminate\Support\Facades\DB;


class StudentController extends Controller
{
    function list()
    {
        # 查询
        $list = DB::select('select * from student');

        // return $list;    // json
        // var_dump($list); // Array
        dd($list);          // 便于查看的Array

    }

    function insert()
    {
        // 插入
        $bool = DB::insert('insert into student(name, age) values(?, ?)',
            ['小白', 23]
        );

        var_dump($bool);
        // bool(true)
    }

    function update()
    {
        // 更新
        $num = DB::update('update student set name = ? where id = ? ',
            ['大白', 1]
        );

        var_dump($num);
        // int(1)
    }

    function delete()
    {
        // 删除
        $num = DB::delete('delete from student where id = ?',
            [2]
        );
        var_dump($num);
        // int(1)
    }

}

```

## 九、查询构造器
Laravel查询构造器query builder
使用PDO参数绑定，SQL注入保护

打印执行的SQL语句
```bash
# 安装
$ composer require "eleven26/listen-sql:~1.0.4" --dev

# 修改 bootstrap/app.php
$app->register(Eleven26\ListenSql\ListenSqlServiceProvider::class);

# 启动
$ php artisan listen-sql:start

```
> 参考 [控制台实时查看 sql](https://learnku.com/articles/33598)

1、新增数据
```php
$data = [
    'name' => '小白',
    'age' => 23
];

// 1、插入
$bool = DB::table('student')->insert($data);
// insert into `student` (`name`, `age`) values ("小白", 23)

var_dump($bool);
// bool(true)

// 2、插入并获取自增id
$id = DB::table('student')->insertGetId($data);
// insert into `student` (`name`, `age`) values ("小白", 23)

var_dump($id);
// int(2)


$list = [
    ['name' => '小白', 'age' => 23],
    ['name' => '大白', 'age' => 24],
];

// 3、插入多条数据
$bool = DB::table('student')->insert($list);
// insert into `student` (`age`, `name`) values (23, "小白"), (24, "大白")

var_dump($bool);
// bool(true)
```

2、更新数据
```php
 // 1、更新， 注意要写where条件
$num = DB::table('student')
    ->where('id', '=',1)
    ->update(['name' =>  '大黄']);
// update `student` set `name` = "大黄" where `id` = 1

var_dump($num);
// int(1)


// 2、自增，默认1
$num = DB::table('student')->increment('age');
// update `student` set `age` = `age` + 1

var_dump($num);
// int(8)


// 3、自减，默认1
$num = DB::table('student')->decrement('age');
// update `student` set `age` = `age` - 1

var_dump($num);
// int(8)


// 4、带条件自增
$num = DB::table('student')
    ->where('id', 1)
    ->increment('age');
// update `student` set `age` = `age` + 1 where `id` = 1

var_dump($num);
// int(1)


// 5、自增额外修改其他字段
$num = DB::table('student')
    ->where('id', 1)
    ->increment('age', 1, ['name' => '大白']);
// update `student` set `age` = `age` + 1, `name` = "大白" where `id` = 1

var_dump($num);
// int(1)
```

3、删除数据
```php
// 1、删除数据
$num = DB::table('student')
    ->where('id', '=', 1)
    ->delete();
// delete from `student` where `id` = 1

var_dump($num);
// int(1)


// 2、清空数据, 危险 谨慎使用
$num = DB::table('student')->truncate();
// truncate `student`

var_dump($num);
// NULL

```

4、查询数据
```php
// 1、get获取列表
$list = DB::table('student')->get();
// select * from `student`

// 2、first获取一条数据
$data = DB::table('student')
    ->orderBy('age', 'desc')
    ->first();
// select * from `student` order by `age` desc limit 1

// 3、where条件
$data = DB::table('student')
    ->where('age', '>=', 24)
    ->get();
// select * from `student` where `age` >= 24

// 4、where多条件
$data = DB::table('student')
    ->whereRaw('id > ? and age > ?', [1, 23])
    ->get();
// select * from `student` where id > 1 and age > 23

// 5、返回键值对，第二个字段是key，第一个字段是value
// 5.3版本弃用了lists，使用pluck
$data = DB::table('student')
    ->pluck('name', 'id');
// select `name`, `id` from `student`

// 6、select 指定字段
$data = DB::table('student')
    ->select('name', 'age')
    ->get();
// select `name`, `age` from `student`

// 7、chunk分段获取，必须加order排序
DB::table('student')
    ->orderBy('id')
    ->chunk(2, function ($list) {
        echo $list;
    });
// select * from `student` order by `id` asc limit 2 offset 0
// select * from `student` order by `id` asc limit 2 offset 2
// ...

```

5、聚合函数
count 计数
max 最大值
min 最小值
avg 平均值
sum 求和

```php
$count = DB::table('student')->count();
// select count(*) as aggregate from `student`

var_dump($count);
// int(3)

$count = DB::table('student')->min('age');
// select min(`age`) as aggregate from `student`
```

## 十、Eloquent ORM
Active Record
每一张表都有一个与之对应的模型Model

1、模型建立及查询数据
默认关联模型名称的复数表名
默认以id为主键
```php
// 1、全部数据
Student::all();
// select * from `student`

// 2、根据主键id查找一条数据
Student::find(1);
// select * from `student` where `student`.`id` = 1 limit 1

// 3、根据主键id查找一条数据,如果没有抛出异常
Student::findOrFail(11);
// select * from `student` where `student`.`id` = 1 limit 1

// 4、获取列表
Student::get();
// select * from `student`

// 5、获取一条数据
Student::where('id', '>', 1)
    ->orderbyDesc('age')
    ->first();
//  select * from `student` where `id` > 1 order by `age` desc limit 1

// 6、chunk分次获取
Student::chunk(2, function ($data){
    var_dump($data);
});
// select * from `student` order by `student`.`id` asc limit 2 offset 0
// select * from `student` order by `student`.`id` asc limit 2 offset 2
// ...

// 7、聚合函数
Student::count();
// select count(*) as aggregate from `student`

Student::where('id', '>=', 1)
    ->max('age');
// select max(`age`) as aggregate from `student` where `id` >= 1

```

2、新增数据，自定义时间戳及批量赋值
（1）通过模型新增，涉及到自定义时间戳
默认维护时间字段created_at, updated_at

[1]新增数据
```php
# 取消自动维护时间字段，一般设置为true
public $timestamps = false;

# 自定义时间戳格式
public function getDateFormat(){
    return time();
}
```

通过模型新增数据
```php
$student = new Student();
$student->name = '小孙';
$student->age = 23;
$bool = $student->save();
// insert into `student` (`name`, `age`, `updated_at`, `created_at`) 
// values ("小孙", 23, "157459359, "1574593597")

```

[2]获取数据
获取数据的时候会自动格式化
```php
$student = Student::find(5);
echo $student->created_at;
// 2019-11-24 10:11:23
```

```php
// 不自动格式化时间戳
protected function asDateTime($value)
{
    return $value;
}

// 自定义格式化
date('Y-m-d H:i:s', $student->created_at);
// 2019-11-24 10:11:23
```

时区设置
方法一：修改php.ini配置文件
```php
// 查看php.ini文件路径
phpinfo()

$ cp php.ini.default php.ini

[Date]
date.timezone = PRC
// 或者
// date.timezone = "Asia/Shanghai"
// PRC是指中华人民共和国 （People's Republic of China）
```

方法二：临时修改
```php
// 查看当前时区
date_default_timezone_get();

// 临时设置时区
date_default_timezone_set('Asia/Shanghai');

```
>参考
[PHP 的 date 日期时间函数库简介](https://www.jianshu.com/p/5f02a3b2ef58)

如果不生效需要修改Laravel配置
config/app.php
```php
// 'timezone' => 'UTC',
'timezone' => 'PRC',
```

（2）使用模型create方法新增数据，涉及批量赋值
```php
// 指定允许批量赋值的字段
protected $fillable = ['name', 'age'];

// 指定不允许批量赋值的字段
protected $guarded = [];
```

```php
$data = [
    'name'=> '小红',
    'age'=> 23
];

$student = Student::create($data);
// insert into `student` (`name`, `age`, `updated_at`, `created_at`) 
// values ("小红", 23, "157459331, "1574593314")

```

查找或创建 firstOrCreate()
```php
// 存在则获取
$data = [
    'name'=> '小红',
    'age'=> 23
];

$student = Student::firstOrCreate($data);
// select * from `student` where (`name` = "小红" and `age` = 23) limit 1

// 不存在则创建
$data = [
    'name'=> '小红',
    'age'=> 25
];

$student = Student::firstOrCreate($data);
// select * from `student` where (`name` = "小红" and `age` = 25) limit 1
// insert into `student` (`name`, `age`, `updated_at`, `created_at`) 
// values ("小红", 25, "157459366, "1574593662")

```

查找或创建实例，保存需要调用save
firstOrNew()

3、修改数据
（1）模型更新
```php
$student = Student::find(4);
// select * from `student` where `student`.`id` = 4 limit 1

$student->name = '大白';

$student->save();
// update `student` 
// set `name` = "大白", `student`.`updated_at` = 1574594275 
// where `id` = 4
```

（2）批量更新
```php
Student::where('id', 1)->update(['name' => '大白']);
// update `student` 
// set `name` = "大白", `student`.`updated_at` = 1574594465 
// where `id` = 1

```

4、删除数据
（1）模型删除
```php
$student = Student::find(4);
//  select * from `student` where `student`.`id` = 4 limit 1

$bool = $student->delete();
// delete from `student` where `id` = 4

```

（2）主键删除
```php
$num = Student::destroy(1);
// select * from `student` where `id` in (1)
// delete from `student` where `id` = 1

$num = Student::destroy(1, 2, 3);
// select * from `student` where `id` in (1, 2, 3)
// delete from `student` where `id` = 2
// delete from `student` where `id` = 3

$num = Student::destroy([1, 2, 3]);
// select * from `student` where `id` in (1, 2, 3)
// delete from `student` where `id` = 1
// delete from `student` where `id` = 2
// delete from `student` where `id` = 3
```

（3）条件删除
```php
$num = Student::where('id', '=', '1')->delete();
// delete from `student` where `id` = "1"
```

## 十一、Blade模板引擎
Blade模板引擎可以使用PHP代码
编译完成后会被缓存

1、模板继承
resources/views/student/layout.blade.php
```php
<h1>@yield('title', '标题')</h1>

<div>
    @section('main')
        主要内容
    @show
</div>

```

resources/views/student/index.blade.php
```php
@extends('student/layout')

@section('title')
    重写标题
@stop

@section('main')
    @parent
    重写内容
@stop

```

Controller返回模板
```php
namespace App\Http\Controllers;


class StudentController extends Controller
{
    function list()
    {
        $data = [
            'name' => 'Tom'
        ];
        return view('student/index', $data);
    }
}

```

编译结果
```php
<h1>重写标题</h1>

<div>主要内容重写内容</div>

```

2、基础语法和include
```php
// 1、模板中输出PHP变量
{{ $name }}

// 2、模板中调用PHP代码
{{ time() }}
{{ date('Y-m-d H:i:s', time()) }}
{{ in_array($name, $arr) ? 'true' : 'false' }}
{{ var_dump($arr) }}

{{ isset($name) ? $name : 'default' }}
{{ $name or 'default' }}

// 3、原样输出
@{{ @name }}

// 4、注释
{{-- 这是模板注释，看不到 --}}
<!-- 这是html注释，可以看到 -->

// 5、引入子视图
@include('student.common', ['key' => 'value'])
```

3、流程控制
```php
// if控制
@if($name == 'Tom')
    Tom
@elseif($name == 'Jack')
    Jack
@else
    else
@endif

// unless === not if
@unless($name != 'Tom')
    Tom
@endunless

// for循环
@for ($i=0; $i < 10; $i++)
    {{$i}}
@endfor

@foreach($students as $student)
    {{$student->name}}
@endforeach

// forelse 数组为空给默认值
@forelse($students as $student)
    {{$student->name}}
@empty
    null
@endforelse
```

4、模板中的URL
url    路由名称生成    
action 控制器和方法名生成
route  别名生成

控制器设置
```php
Route::get('student/list', ['as'=> 'list', 'uses'=> 'StudentController@list']);
```

三种方式结果一样
```php
{{ url('student/list') }}
{{ action('StudentController@list') }}
{{ route('list') }}
```
http://localhost:8000/student/list

## 总结
安装Laravel
核心目录文件
路由
MVC
数据库操作3种
模板引擎



