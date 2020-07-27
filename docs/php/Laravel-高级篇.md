# Laravel-高级篇
## 第1章 Composer 快速入门
### 1 Composer简介 

包管理器

```
Java: Maven
NodeJS: NPM
Objective-C: CocoaPods
PHP: PEAR
```

PEAR缺点
依赖处理容易出问题
配置非常复杂
难用的命令行接口

Composer
Composer是PHP的一个依赖（dependency）管理工具，不是包管理器
涉及packages 和 libraries

在项目中声明所依赖的外部工具库，Composer会自动安装这些工具库及依赖的库文件

Composer官网 
[https://getcomposer.org/](https://getcomposer.org/)

Composer中文网 
[https://www.phpcomposer.com/](https://www.phpcomposer.com/)

### 2 安装Composer 
下载 composer.phar
[https://getcomposer.org/download/](https://getcomposer.org/download/)



局部安装
```
php composer.phar
```

全局安装
```
sudo mv composer.phar /usr/local/bin/composer
sudo chmod -R 755 /usr/local/bin/composer
```

### 3 Composer中国全量镜像
https://pkg.phpcomposer.com/

使用阿里镜像
https://mirrors.aliyun.com/composer


启用镜像服务

1、单个项目配置

```bash
echo '{}' > composer.json
composer config repo.packagist composer https://mirrors.aliyun.com/composer
```

2、系统全局配置

```bash
# 查看当前镜像地址
composer config -g repo.packagist.org

# 配置镜像
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer

# 解除镜像
composer config -g --unset repos.packagist
```

### 4 使用Composer 
搜索 search
展示 show
申明依赖 require
安装 install
更新 update

```bash
# 初始化
$ composer init

{
    "name": "demo/demo",
    "description": "demo",
    "type": "library",
    "authors": [
        {
            "name": "pengshiyu",
            "email": "1940607002@qq.com"
        }
    ],
    "require": {}
}

# 搜索
$ composer search monolog

# 显示信息
$ composer show --all monolog/monolog

# 配置依赖并安装
"require": {
    "monolog/monolog": "2.0.1"
}

$ composer install

# 通过require安装
$ composer require symfony/http-foundation

"require": {
        "monolog/monolog": "1.25.2",
        "symfony/http-foundation": "^4.4"
    }

# 更新依赖
"require": {
        "symfony/http-foundation": "^4.4"
    }
$ composer update

```

## 第2章 PHP框架安装之Laravel
https://laravel.com/docs/5.8

Composer 安装Laravel的两种方式

1、通过Composer Create-Project安装
```shell
# 安装最新
composer create-project --prefer-dist laravel/laravel [别名] 

# 安装指定版本
composer create-project --prefer-dist laravel/laravel blog "5.8.*"
```

2、Laravel安装器
安装最新版本
```shell
composer global require "laravel/installer"
```
添加环境变量

```shell
$ vim ~/.bash_profile

# composer
export PATH=$PATH:$HOME/.composer/vendor/bin
```

```shell
laravel new blog
```

## 第3章 Artisan 控制台
Artisan是Laravel自带命令行工具
Symfony Console组件驱动
```shell
# 查看命令 
php artisan 

# 或者 
php artisan list

# 查看帮助
php artisan help migrate

# 创建控制器
php artisan make:controller StudentController

# 创建模型
php artisan make:model Student

# 创建中间件
php artisan make:middleware Activity
```

## 第4章 Laravel中的用户认证（Auth）
### 1、Laravel中生成Auth所需文件
```bash
php artisan make:auth

# 数据库中生成表
php artisan migrate
```
实现了登录注册功能


### 2、Laravel中的数据迁移

```bash
# 新建数据表迁移文件
php artisan make:migration create_students_table

# --table 指定数据表名
# --create 迁移文件是否要建立新的数据表
# eg:
php artisan make:migration create_students_table --create=students

# 生成模型时同时生成迁移文件
php artisan make:model Student -m

```

编辑迁移文件
```php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStudentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->integer('age')->unsigned()->default(0);
            $table->integer('sex')->unsigned()->default(0);
            $table->integer('created_at')->default(0);
            $table->integer('updated_at')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
}

```

用迁移文件创建表
```bash 
php artisan migrate
```

查看表结构
```sql
show create table students

CREATE TABLE `students` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int(10) unsigned NOT NULL DEFAULT '0',
  `sex` int(10) unsigned NOT NULL DEFAULT '0',
  `created_at` int(11) NOT NULL DEFAULT '0',
  `updated_at` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

### 3、Laravel中的数据填充
创建填充文件
```bash
php artisan make:seeder StudentTableSeeder
```

编辑填充文件
```php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StudentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        DB::table('students')->insert([
            ['name'=> 'Tom', 'age'=> 23],
            ['name'=> 'Jack', 'age'=> 24],
            ['name'=> 'Greed', 'age'=> 25],
        ]);
    }
}

```

执行单个填充文件
```bash
php artisan db:seed --class=StudentTableSeeder
```

批量执行填充文件

```php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(StudentTableSeeder::class);
    }
}

```

执行批量填充
```bash
php artisan db:seed
```

## 第5章 Laravel框架常用功能
文件上传、邮件、缓存、错误&日志、队列

### 1、Laravel中的文件上传
Laravel文件系统基于Frank de Jonge Flysystem扩展包
配置文件
config/filesystems.php
```php

return [
    'disks' => [
        'uploads' => [
            'driver' => 'local',
            'root' => public_path('uploads'),
        ],
    ],

];

```

模板文件
resources/views/upload.blade.php
```php
<form action="" method="post" enctype="multipart/form-data">
    {{csrf_field()}}
    <input type="file" name="file">
    <input type="submit">
</form>
```

控制器
app/Http/Controllers/FileController.php
```php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    //
    public function upload(Request $request)
    {
        if ($request->isMethod('POST')) {
            $file = $request->file('file');
            if ($file->isValid()) {
                // 原文件名
                $originalName = $file->getClientOriginalName();

                // 扩展名
                $ext = $file->getClientOriginalExtension();

                // 类型
                $type = $file->getMimeType();

                // 临时绝对路径
                $realPath = $file->getRealPath();
                $filename = date('Y-m-d-H-i-s') . '-' . uniqid() . '.' . $ext;

                $bool = Storage::disk('uploads')->put($filename, file_get_contents($realPath));

                var_dump($bool);
            }
        } else {
            return view('upload');
        }
    }
}

```
生成的文件路径
public/uploads/2019-12-01-12-51-38-5de3b75a97f0e.png

### 2、Laravel中的邮件发送
Laravel 邮件功能基于SwiftMailer 函数库

配置
config/mail.php
```php
MAIL_DRIVER=smtp
MAIL_HOST=smtp.163.com
MAIL_PORT=465
MAIL_USERNAME=username@163.com
MAIL_PASSWORD=password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=username@163.com
MAIL_FROM_NAME=username
```
163邮箱要求from和username必须一致

发送

1、Mail::raw()
```php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function mail()
    {
        Mail::raw('邮件内容', function ($message){
           $message->subject('邮件主题');
           $message->to('123456@qq.com');
        });
    }
}

```

2、Mail::send()
邮件模板
resources/views/mail.blade.php
```php
<h1>{{$name}}</h1>
```

```php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function mail()
    {
        Mail::send('mail', ['name'=> 'Laravel'], function ($message){
           $message->subject('邮件主题');
           $message->to('123456@qq.com');
        });
    }
}

```

### 3、Laravel中的缓存使用
Laravel支持常见的后端缓存系统
File、Memcached、Redis

```php
use Illuminate\Support\Facades\Cache;

static bool has(string $key)

static bool put(string $key, $value, \DateTimeInterface|\DateInterval|int $ttl)

# key存在不添加，不存在添加
static bool add(string $key, $value, \DateTimeInterface|\DateInterval|int $ttl)

static mixed get(string $key, mixed $default = null)

// 取出并删除
static mixed pull(string $key, mixed $default = null)

static bool forever(string $key, $value)
static bool forget(string $key)
```

配置默认类型为file
config/cache.php


### 4、Laravel中的错误与日志
1、DEBUG模式
配置
config/app.php
```php
// 本地开发 
APP_DEBUG=true

// 线上环境 
APP_DEBUG=false
```

2、HTTP异常

自定义异常模板
resources/views/errors/500.blade.php
```php
500
```

使用
```php
abort(500);
```
Laravel默认提供404未找到等异常页面

3、日志
Laravel基于Monolog提供日志模式：
single，
daily， 每天生成一个日志文件
syslog，
errorlog

七个错误级别
debug
info
notice
warning
error
critical
alert


日志路径
storage/logs

使用示例
```php

use Illuminate\Support\Facades\Log;

LOG::info('info 级别的日志');

```

### 5、Laravel中的队列应用
队列服务允许推迟耗时任务执行，提高web请求速度
比如发送邮件执行

主要步骤
迁移队列需要的数据表
编写任务类
推送任务到队列
运行队里监听器
处理失败任务


配置
config/queue.php
```php
QUEUE_CONNECTION=database
```

创建队列数据表
```
php artisan queue:table

php artisan migrate

php artisan make:job SendEmail

```

app/Jobs/SendEmail.php
```php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Mail;

class SendEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $email;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($email)
    {
        $this->email = $email;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Mail::raw('邮件内容', function ($message){
            $message->subject('邮件主题 测试');
            $message->to($this->email);
        });
    }
}

```

```php
dispatch(new SendEmail('123456@qq.com'));
```

执行任务
```
php artisan queue:listen

php artisan queue:listen --tries=3
```

迁移失败任务表
```
php artisan queue:failed-table

php artisan migrate
```
失败任务操作
```bash
# 查看失败队列
php artisan queue:failed

# 重试一次，指定id
php artisan queue:retry 1

# 重试所有
php artisan queue:retry all

# 删除失败任务，指定id
php artisan queue:forget 1

# 清空失败任务
php artisan queue:flush
```

报错：Class 'Predis\Client' not found
```
composer require predis/predis ^1.1
```

## 总结
1、安装和使用composer
2、composer安装laravel
3、artisan控制台
4、auth用户验证
5、数据迁移，数据填充
6、文件、邮件、缓存、队列


