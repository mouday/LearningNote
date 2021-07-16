# Model 模型

## 模型定义

```php
class User extends Model{
    // 完整数据表名称
    protected $table = 'user';

    // 主键
    protected $pk = 'id';
}

```

## 新增数据

```php
$user = User::create([
    'name'  =>  'thinkphp',
    'email' =>  'thinkphp@qq.com'
]);
```

## 删除数据

```php
User::where('id','>',10)->delete();
```

## 更新数据

```php
UserModel::where('id', '=', 12)
    ->update([
        'name' => 'thinkphp'
    ]);
```

## 数据查询

```php
// 单条 不存在返回null
UserModel::find($id);

UserModel::where('id', '=', $id)->find();

// 不存在返回空模型
UserModel::findOrEmpty($id);

// 多条
UserModel::select();
```

## 模型字段

模型的数据字段和数据表的字段对应，
默认会自动获取, 会导致增加一次查询，
在模型中明确定义字段信息避免多一次查询的开销。

```php
class UserModel extends Model
{
    protected $name = 'tb_user';

    // 设置字段信息
    protected $schema = [
        'id'       => 'int',
        'username' => 'string',
    ];
```

执行 SQL

```sql
// 没有$schema查询两次
SHOW FULL COLUMNS FROM `tb_user`
SELECT * FROM `tb_user`

// 设置$schema查询一次
SELECT * FROM `tb_user`
```

缓存字段（多应用模式下不起作用）

```
php think optimize:schema
```

字段缓存默认是关闭状态，需要在 config/database.php 开启

```php
// 开启字段缓存, 线上环境可开启
'fields_cache'    => true,
```

模型字段 2 种获取方式

```php
// 模型外部
$user = UserModel::find(1);
$username = $user->username;
$username = $user['username'];

// 模型内部
$user = $this->find(1);
$username = $user->getAttr('username');
```

## 获取器和设置器

定义方式

```php
public function  getFieldNameAttr($value, $data){
    return $value
}

public function  setFieldNameAttr($value){
    return $value
}
```

## 查询范围

```php
// 定义全局的查询范围
protected $globalScope = ['status'];

public function scopeStatus($query, $value=1) {
    $query->where('status', '=', $value);
}

// 未定义全局
User::status()->select();

// 定义全局后
User::select();
```

## 搜索器

```php
public function searchFieldNameAttr($query, $value, $data){

}
```

数据集 Collection

```php
hidden   隐藏字段
visible  只显示字段
append   添加获取器字段
withAttr 对字段进行函数处理
```

## 自动时间戳

```php
// 全局开启
'auto_timestamp' => true,
// 默认为整型（int）
'auto_timestamp' => 'datetime',

// 模型类单独开启
protected $autoWriteTimestamp = true;
// 定义时间戳字段名
protected $createTime = 'create_at';
protected $updateTime = 'update_at';

// 动态修改
$user->isAutoWriteTimestamp(false)->save();
```

只读字段

```php
// 模型中定义
protected $readonly = ['name', 'email'];

// 动态设置 仅针对模型的更新方法
$user->readonly(['name','email'])->save();
```

类型转换

```php
class User extends Model
{
    protected $type = [
        'status'    =>  'bool',
        'score'     =>  'float',
        'birthday'  =>  'datetime',
        'info'      =>  'array',
    ];
}
```

废弃字段

```php
class User extends Model
{
    protected $disuse = [ 'status', 'type' ];
}
```

json 类型字段

```php
class User extends Model
{
	// 设置json类型字段
	protected $json = ['tags'];
}
```

软删除

```php
use think\model\concern\SoftDelete;

class User extends Model
{
    use SoftDelete;

    // 默认字段
    protected $deleteTime = 'delete_time';

    // 定义软删除字段的默认值
    protected $defaultSoftDelete = 0;
}
```

```php
// 软删除
User::destroy(1);
// 真实删除
User::destroy(1, true);

$user = User::find(1);
// 软删除
$user->delete();
// 真实删除
$user->force()->delete();

// 不包含软删除的数据
User::find();
User::select();

// 包含软删除的数据
User::withTrashed()->find();
User::withTrashed()->select();

// 仅需要查询软删除的数据
User::onlyTrashed()->find();
User::onlyTrashed()->select();

// 恢复被软删除的数据
$user = User::onlyTrashed()->find(1);
$user->restore();

// 真实删除：先还原、再删除
```

模型和数据库事件

| 事件           | 描述   | 事件方法名      |
| -------------- | ------ | --------------- |
| after_read     | 查询后 | onAfterRead     |
| before_insert  | 新增前 | onBeforeInsert  |
| after_insert   | 新增后 | onAfterInsert   |
| before_update  | 更新前 | onBeforeUpdate  |
| after_update   | 更新后 | onAfterUpdate   |
| before_write   | 写入前 | onBeforeWrite   |
| after_write    | 写入后 | onAfterWrite    |
| before_delete  | 删除前 | onBeforeDelete  |
| after_delete   | 删除后 | onAfterDelete   |
| before_restore | 恢复前 | onBeforeRestore |
| after_restore  | 恢复后 | onAfterRestore  |

关联模型

| 类型       | 关联关系       | 相对的关联关系 |
| ---------- | -------------- | -------------- |
| 一对一     | hasOne         | belongsTo      |
| 一对多     | hasMany        | belongsTo      |
| 多对多     | belongsToMany  | belongsToMany  |
| 远程一对多 | hasManyThrough | 不支持         |
| 多态一对一 | morphOne       | morphTo        |
| 多态一对多 | morphMany      | morphTo        |

表结构
```
主表
user id name 

副表
profile id age sex user_id
```

```php
class UserModel extends Model
{
	public function profile()
    {
    	return $this->hasOne(ProfileModel::class);
    }
}

class ProfileModel extends Model
{
	public function user()
    {
    	return $this->belongsTo(UserModel::class);
    }
}
```

关联预载入
```php
UserModel::with(['profile'])->select([1, 2, 3]);
```

关联统计

```php
UserModel::withCount('cards')->select([1,2,3]);
```