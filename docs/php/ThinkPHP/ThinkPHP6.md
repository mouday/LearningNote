# ThinkPHP6.0

【ThinkPHP6.x / PHP框架】【十天精品课堂系列】83P
https://www.bilibili.com/video/BV12E411y7u8


文档《ThinkPHP6.0完全开发手册》
https://www.kancloud.cn/manual/thinkphp6_0/1037479

课程讲义SQL下载：
链接：https://pan.baidu.com/s/16a6yM-IoGTR7QoAlq9zyZw 
提取码：7y9t


李炎恢tp6教程文档
https://www.wodecun.com/blog/8137.html

## 1、环境要求

1、PHP >= 7.1

2、Composer

```bash
# 安装 
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# 国内镜像（阿里云）
composer config -g repo.packagist composer https://mirrors.aliyun.com/composer/
```

## 2、创建项目
```bash
# 创建项目 tp为项目文件夹名
composer create-project topthink/think tp

# 开发环境运行[端口号]
php think run [-p 80]
```

## 配置

```php
// 读取环境变量 .env配置
use think\facade\Env;

Env::get('database.hostname');


// 读取配置
use think\facade\Config;

Config::get('database.connections.mysql.hostname');
```

## URL

单应用模式
```
http://serverName/index.php/控制器/操作[/参数名/参数值...]
```

多应用模式
```
http://serverName/index.php/应用/控制器/操作[/参数名/参数值...]
```

兼容模式
```
http://serverName/index.php?s=/控制器/操作[/参数名/参数值...]
```

## 控制器

启动控制器后缀

config/route.php
```php
// 是否使用控制器后缀
'controller_suffix'     => true,
```

中断测试, 使用助手函数
```php
halt()
```

控制器数据返回
```php
// 字符串
return 'hello world';


// json
return json(['name' => 'Tom']);


// 渲染模板
return view('test/index', ['name' => 'Tom']);
    
```

## 特殊控制器

1、 基础控制器   BaseController 提供了$app $request
2、 空控制器    ErrorController 控制器不存在会调用
3、 多级控制器  /user.blog -> controller/user/BlogController.php

## 数据库配置和Model

数据库配置文件 config/database.php

Model定义

```php
use think\Model;


class ArticleModel extends Model
{
    // 真实的表名
    protected $name = 'tb_article';
}
```

## 数据查询

```php
use think\facade\Db;

// 查询一条数据
$result = Db::table('tb_user')->where('id', '=', 1)->find();

// 获取最后一条查询语句
$sql = Db::getLastSql();
// SELECT * FROM `tb_user` WHERE `id` = 1 LIMIT 1

```

1、单条数据查询

```
查询方法          数据不存在的返回值

find()        -> null
findOrFail()  -> 抛出异常
findOrEmpty() -> 返回空数组 array()
```

2、数据集查询

```
查询方法          数据不存在的返回值

select()        -> 返回空数组 array()
selectOrFail()  -> 抛出异常
```

数据集可以转为数组 `toArray()`

```php
// 需要传入完整表名
Db::table('tb_user')

// 需要省略表前缀
Db::name('user')

// 返回指定的值
value('username')

// 返回键值对 [key => value]
column('value', 'key')

// 分批读取数据
chunk()

// 游标查询，每次读取一条数据
cursor()
```

## 链式查询

```php
// query对象可进行多次查询
$query = Db::table('tb_user');

$query->where('id', '=', 1)->select();
// SELECT * FROM `tb_user` WHERE `id` = 1

// 继续使用同一个查询对象，会保留上一次的查询条件
$query->select();
// SELECT * FROM `tb_user` WHERE `id` = 1

// 查询之前清空where条件
$query->removeOption('where')->select();
// SELECT * FROM `tb_user`
```

## 新增数据

新增一条数据

```php
// 1、插入数据 返回插入成功数量
Db::table('tb_user')->insert($data);


// 2、抛弃不存在的数据
$data = [
    'name'=>  'Jack', // 不存在name字段
    'username'=>  'Jack',
];

Db::table('tb_user')->strict(false)->insert($data);
// INSERT INTO `tb_user` SET `username` = 'Jack'


// 3、replace into
$data = [
    'username' =>  'Tom',
];

Db::table('tb_user')->replace()->insert($data);
// REPLACE INTO `tb_user` SET `username` = 'Tom'


// 4、插入数据后返回自增ID
$data = [
    'username'=>  'Jack',
];

$result = Db::table('tb_user')->insertGetId($data);

```

批量新增

```php
$data = [
    ['foo' => 'bar', 'bar' => 'foo'],
    ['foo' => 'bar1', 'bar' => 'foo1'],
    ['foo' => 'bar2', 'bar' => 'foo2']
];

Db::name('user')->insertAll($data);

// replace
Db::name('user')->replace()->insertAll($data);

// 分批插入
Db::name('user')
    ->limit(100)
    ->insertAll($data);
```

save新增，自动判断新增还是更新
```php
Db::name('user')
    ->save(['id' => 1, 'name' => 'thinkphp']);
```

## 修改数据

```php
// update
Db::name('user')
    ->where('id', 1)
    ->update(['name' => 'thinkphp']);
// UPDATE `think_user`  SET `name`='thinkphp'  WHERE  `id` = 1


// save
Db::name('user')
    ->save(['id' => 1, 'name' => 'thinkphp']);
// UPDATE `think_user`  SET `name`='thinkphp'  WHERE  `id` = 1


// 使用SQL函数
Db::name('user')
    ->where('id',1)
    ->exp('name','UPPER(name)')
    ->update();
// UPDATE `think_user`  SET `name` = UPPER(name)  WHERE  `id` = 1


// 自增/自减
Db::table('think_user')
    ->where('id', 1)
    ->inc('score')
    ->update();
// UPDATE `think_user`  SET `score` = `score` + 1  WHERE  `id` = 1 


// raw方法
Db::name('user')
    ->where('id', 1)
    ->update([
        'name'      =>  Db::raw('UPPER(name)'),
        'score'     =>  Db::raw('score-3'),
        'read_time' =>  Db::raw('read_time+1')
    ]);
```

## 删除数据

```php
// 根据主键删除
Db::table('think_user')->delete(1);
// DELETE FROM `think_user` WHERE  `id` = 1 

Db::table('think_user')->delete([1,2,3]);
// DELETE FROM `think_user` WHERE  `id` IN (1,2,3) 


// 条件删除
Db::table('think_user')->where('id',1)->delete();
// DELETE FROM `think_user` WHERE  `id` = 1 

Db::table('think_user')->where('id','<',10)->delete();
// DELETE FROM `think_user` WHERE  `id` < 10

// 删除所有数据
Db::name('user')->delete(true);
// DELETE FROM `think_user`

```

## 查询方式
比较查询
```php
where('字段名','查询表达式','查询条件');

```

区间查询
```php
// Like
Db::name('user')->whereLike('name','thinkphp%')->select();
Db::name('user')->whereNotLike('name','thinkphp%')->select();

// Between
Db::name('user')->whereBetween('id','1,8')->select();
Db::name('user')->whereNotBetween('id','1,8')->select();

// Null
Db::name('user')->whereNull('name')->select();
Db::name('user')->whereNotNull('name')->select();

// In
Db::name('user')->whereIn('id','1,5,8')->select();
Db::name('user')->whereNotIn('id','1,5,8')->select();

```

自定义查询
```php
// Exp
Db::name('user')->whereExp('id', 'IN (1,3,8) ')->select();
```

## 时间查询

传统查询
```php
// 大于某个时间
Db::table('tb_user')
    ->where('create_time', '>=', '1970-10-1')
    ->select();
// SELECT * FROM `tb_user` WHERE `create_time` >= '1970-10-1'
```

快捷查询
```php
// 大于某个时间
Db::table('tb_user')
    ->whereTime('create_time', '>=', '1970-10-1')
    ->select();
// SELECT * FROM `tb_user` WHERE `create_time` >= '1970-10-01 00:00:00'

Db::table('tb_user')
    ->whereBetweenTime('create_time', '2017-01-01', '2017-06-30')
    ->select();
// SELECT * FROM `tb_user` 
// WHERE `create_time` BETWEEN '2017-01-01 00:00:00' AND '2017-06-30 00:00:00'
```

固定查询
```php
Db::table('tb_user')
    ->whereYear('create_time', 'last year')
    ->select();   
// SELECT * FROM `tb_user` 
// WHERE `create_time` BETWEEN '2020-01-01 00:00:00' AND '2020-12-31 23:59:59'

Db::table('tb_user')
    ->whereMonth('create_time', 'last month')
    ->select();
// SELECT * FROM `tb_user` WHERE `create_time`
// BETWEEN '2021-05-01 00:00:00' AND '2021-05-31'

Db::table('tb_user')
    ->whereWeek('create_time', 'last week')
    ->select();
// SELECT * FROM `tb_user` 
// WHERE `create_time` BETWEEN '2021-05-31 00:00:00' AND '2021-06-06 23:59:59'

Db::table('tb_user')
    ->whereDay('create_time', 'yesterday')
    ->select();
// SELECT * FROM `tb_user` 
// WHERE `create_time` BETWEEN '2021-06-12 00:00:00' AND '2021-06-12 23:59:59'
```

其他查询
```php
// 查询两个小时内的博客
Db::name('tb_user')
    ->whereTime('create_time','-2 hours')
    ->select();
// SELECT * FROM `tb_user` WHERE `create_time` >= '2021-06-13 14:23:25'

// 查询有效期内的活动
Db::table('tb_user')
    ->whereTime('start_time', '<=', time())
    ->whereTime('end_time', '>=', time())
    ->select();
// SELECT * FROM `tb_user` 
// WHERE `start_time` <= '2021-06-13 16:18:43' AND `end_time` >= '1623572323' 
```

## 聚合、原生、子查询

聚合查询

```php
// 统计数量
Db::table('tb_user')->count();
// SELECT COUNT(*) AS think_count FROM `tb_user`

// 获取最大值
Db::table('tb_user')->max('id');
// SELECT MAX(`id`) AS think_max FROM `tb_user`

// 获取最小值
Db::table('tb_user')->min('id');
// SELECT MIN(`id`) AS think_min FROM `tb_user`

// 获取平均值
Db::table('tb_user')->avg('id');
// SELECT AVG(`id`) AS think_avg FROM `tb_user`

// 获取总分
Db::table('tb_user')->sum('id');
// SELECT SUM(`id`) AS think_sum FROM `tb_user`
```

SQL构建
```php
// 直接返回SQL而不是执行查询
Db::table('tb_user')->fetchSql()->select();
// SELECT * FROM `tb_user`

// 返回SQL，可以带括号
Db::table('tb_user')->buildSql();
( SELECT * FROM `tb_user` )
```

子查询
```php
// 手动拼接
$subQuery = Db::table('tb_user')->where('id', '>', 5)->buildSql();
$sql = Db::table('tb_user')->where('id', 'exp', 'IN' . $subQuery)->select();
// SELECT * FROM `tb_user` 
// WHERE ( `id` IN( SELECT `id` FROM `tb_user` WHERE `id` > 5 ) )


// 使用闭包
Db::table('tb_user')->where('id', 'in', function ($query){
    $query->table('tb_user')->field('id')->where('id', '>', 5);
})->select();
// SELECT * FROM `tb_user` WHERE `id` IN (SELECT `id` FROM `tb_user` WHERE `id` > 5)
```

原生查询
```php
// 查询
Db::query('select * from tb_user');

// 写入
Db::execute('insert into tb_user (name, age) values ("Tom", 23)');
```

## 链式查询

where 查询操作

参数支持的变量类型: 字符串、数组、闭包

```php
// 表达式查询(推荐)
Db::table('think_user')
    ->where('id','>',1)
    ->where('name','thinkphp')
    ->select(); 

// 数组条件
Db::table('think_user')->where([
    'name'  =>  'thinkphp',
    'status'=>  1
])->select(); 

// 字符串条件
Db::table('think_user')
    ->whereRaw('type=1 AND status=1')
    ->select(); 

// 变量预处理
Db::table('think_user')
    ->whereRaw("id=:id and username=:name", ['id' => 1 , 'name' => 'thinkphp'])
    ->select();
```

field

```php
// 指定查询字段
Db::table('user')->field('id,title,content')->select();
Db::table('user')->field(['id','title','content'])->select();

// 设置别名
Db::table('user')->field('id,nickname as name')->select();
Db::table('user')->field(['id','nickname'=>'name'])->select();

// 使用函数
Db::table('user')->fieldRaw('id,SUM(score)')->select();

// 获取所有字段，两者等价
Db::table('user')->field('*')->select();
Db::table('user')->select();

// 字段排除
Db::table('user')->withoutField('user_id,content')->select();
Db::table('user')->withoutField(['user_id','content'])->select();

// 字段合法性检测
Db::table('user')->field('title,email,content')->insert($data);
```

alias 设置数据表别名

```php
Db::table('think_user')
    ->alias('a')
    ->select();
```

limit
```php
// limit
Db::name('user')->limit(5)->select();

// offset limit
Db::name('user')->limit(1, 5)->select();
```

page 分页
```php
// page, limit
Db::name('user')->page(1, 5)->select();
```

order
```php
Db::name('user')->order('id', 'desc')->select();

Db::name('user')->order(['create_time'=>'desc', 'price'=>'asc'])->select();

Db::name('user')->orderRaw('FIELD(username,"Tom") DESC')->select();
```

group

```php
Db::name('user')
    ->fieldRaw('gender, SUM(price)')
    ->group('gender')
    ->select();
```

having

```php
Db::name('user')
    ->fieldRaw('gender, SUM(price)')
    ->group('gender')
    ->having('SUM(price)>600')
    ->select();
```

## 高级查询

```php
// |OR &AND
Db::table('tb_user')
    ->where('username|nick_name', 'like', '%高%')
    ->where('id&age', '>', 12)
    ->select();
// SELECT * FROM `tb_user` 
// WHERE ( `username` LIKE '%高%' OR `nick_name` LIKE '%高%' ) 
// AND ( `id` > 12 AND `age` > '12' )


// 关联数组原样查询条件
Db::table('tb_user')
    ->where([
        ['username', 'like', '%王%'],
        ['age', 'exp', Db::raw('>18')],
    ])
// SELECT * FROM `tb_user` 
// WHERE `username` LIKE '%王%' AND ( `age` >18 )


// 条件优先级，增加一个中括号
$data = [
    ['username', 'like', '%王%'],
    ['age', 'exp', Db::raw('>18')],
];

$sql = Db::table('tb_user')
    ->where([$data])
    ->where('id', '>', 1)
// SELECT * FROM `tb_user` 
// WHERE ( `username` LIKE '%王%' AND ( `age` >18 ) ) 
// AND `id` > 10


// 多组条件查询
$data1 = [
    ['username', 'like', '%王%'],
    ['age', 'exp', Db::raw('>18')],
];

$data2 = [
    ['username', 'like', '%孙%'],
    ['age', '>', 18],
];

$sql = Db::table('tb_user')->whereOr([$data1, $data2])
// SELECT * FROM `tb_user` 
// WHERE ( `username` LIKE '%王%' AND ( `age` >18 ) ) 
// OR ( `username` LIKE '%孙%' AND `age` > '18' )


// 闭包查询
Db::table('tb_user')
    ->where(function ($query){
        $query->where('id', '>', 1);
    })
// SELECT * FROM `tb_user` WHERE ( `id` > 1 )


// 原样sql查询条件和参数绑定
Db::table('tb_user')->whereRaw('id > ?', [12])
Db::table('tb_user')->whereRaw('id > :id', ['id' => 12])
// SELECT * FROM `tb_user` WHERE ( id > '12' )
```

## 快捷查询

```php
Db::table('tb_user')
    ->whereColumn('create_time', '>', 'update_time')
// SELECT * FROM `tb_user` WHERE ( `create_time` > `update_time` )
```

## 事务和获取器

事务

```php
// 自动处理，出错自动回滚；
Db::transaction(function () {
    Db::name('user')->where('id', 19)->save(['price'=>Db::raw('price - 3')]);
    Db::name('user1')->where('id', 20)->save(['price'=>Db::raw('price + 3')]);
});


// 手动处理
//启动事务
Db::startTrans();
try {
    Db::name('user')->where('id', 19)->save(['price'=>Db::raw('price - 3')]);
    Db::name('user1')->where('id', 20)->save(['price'=>Db::raw('price + 3')]);
    //提交事务
    Db::commit();
} catch (\Exception $e) {
    echo '执行 SQL 失败！';
    //回滚
    Db::rollback();
}
```

获取器

```php
Db::name('user')->withAttr('email', function ($value, $data) {
    return strtoupper($value);
})->select();
```

## 数据集和代码提示

1、TP6.0 编辑器没有代码提示问题解决

将TP5.1的代码注释复制过来即可

```
TP5.1 think\Db
TP6.0 think\facade\Db
```

2、数据集Collection对象
