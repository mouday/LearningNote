# orator

安装
```
pip install orator
```

文档

[https://orator-orm.com/docs/](https://orator-orm.com/docs/)

Orator文档不是很完整，不过可以结合Laravel和ThinkPHP文档，思想和操作基本一致
（英文）[https://www.kancloud.cn/manual/thinkphp5/135176](https://laravel.com/docs/5.8/database)
（中文）[https://www.kancloud.cn/manual/thinkphp5/135176](https://www.kancloud.cn/manual/thinkphp5/135176)

和Laravel一样，支持三种操作方式：
1、Query
2、Query Builder
3、ORM

## 一、配置
测试使用的表
```sql
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `sex` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '性别',
  `created_at` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `updated_at` int(11) NOT NULL DEFAULT '0' COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COMMENT='学生表'
```

1、设置查询日志，打印sql
```python
import logging

logger = logging.getLogger('orator.connection.queries')
logger.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(elapsed_time)s ms %(query)s')

handler = logging.StreamHandler()
handler.setFormatter(formatter)

logger.addHandler(handler)

```

2、配置数据库连接参数
```python
from orator import DatabaseManager

# 配置支持多个数据库连接，支持读写分离
config = {
    'default': 'mysql',

    'mysql': {
        'read': [
            {
                'host': 'localhost'
            }
        ],
        'write': [
            {
                'host': 'localhost'
            }
        ],

        'driver': 'mysql',
        'database': 'data',
        'user': 'root',
        'password': '123456',
        'prefix': '',
        'log_queries': True,  # 开启日志
        'use_qmark': True,    # 使用 ? 替代变量
    }
}

db = DatabaseManager(config)

```

## 二、Query
1、读操作
```python

# select return list
results = db.select('select * from student where id = ?', [2])
print(results)
# ({'id': 2, 'name': '李白', 'age': 24, 'sex': 1, 'created_at': 1575127010, 'updated_at': 1575187008},)
```

2、写操作
```python
# insert return int
result = db.insert('insert into student (age, name) values (?, ?)', [23, 'John'])
print(result)
# 1


# update return int
result = db.update('update student set age = 10 where name = ?', ['John'])
print(result)
# 1


# delete return int
result = db.delete('delete from student where id = ?', [132])
print(result)
# 1
```

3、表操作和事务
```python
# statement
result = db.statement('drop table student')
print(result)
# 0

# 执行事务
with db.transaction():
    db.table('student').update({'age': 1})
    # db.table('posts').delete()

```

## 三、Query Builder
1、select
```python
# select all row from table
users = db.table('student').get()
# 'SELECT * FROM `student`'

for user in users:
    print(user['name'])  # 或者 user.name

# chunk 每次获取5个
for users in db.table('student').chunk(5):
    print('==')
    for user in users:
        print(user['name'])

# 获取single row(None) from a table
user = db.table('student').where('name', 'John').first()
"SELECT * FROM `student` WHERE `name` = 'John' LIMIT 1"
print(user['name'])

# 返回single column from a row
user = db.table('student').where('name', 'John').pluck('name')
"SELECT `name` FROM `student` WHERE `name` = 'John' LIMIT 1"
print(user)

# 返回 某列值的列表
sql = db.table('student').lists('name')
'SELECT `name` FROM `student`'
print(list(sql))

# 返回一个字典列表
roles = db.table('student').lists('age', 'name')
print(roles)
'SELECT `age`, `name` FROM `student`'
# {'John': 1}

# select
users = db.table('student').select('name', 'age').get()
# 'SELECT `name`, `age` FROM `student`'

users = db.table('student').distinct().get()
# 'SELECT DISTINCT * FROM `student`'

users = db.table('student').select('name as user_name').get()
# 'SELECT `name` AS `user_name` FROM `student`'

# where
users = db.table('student').where('age', '>', 25).get()
# 'SELECT * FROM `student` WHERE `age` > 25'


users = db.table('student').where('age', '>', 25).or_where('name', '--"John').get()
# 'SELECT * FROM `student` WHERE `age` > 25 OR `name` = \'--\\"John\''

users = db.table('student').where_between('age', [25, 35]).get()
# 'SELECT * FROM `student` WHERE `age` BETWEEN 25 AND 35'

users = db.table('student').where_not_between('age', [25, 35]).get()
# 'SELECT * FROM `student` WHERE `age` NOT BETWEEN 25 AND 35'

users = db.table('student').where_in('id', [1, 2, 3]).get()
# 'SELECT * FROM `student` WHERE `id` IN (1, 2, 3)'

users = db.table('student').where_not_in('id', [1, 2, 3]).get()
# 'SELECT * FROM `student` WHERE `id` NOT IN (1, 2, 3)'

users = db.table('student').where_null('updated_at').get()
# 'SELECT * FROM `student` WHERE `updated_at` IS NULL'

query = db.table('student').select('age').order_by('age')
query.group_by('age')
query.having('age', '>', 100)

users = query.get()
# SELECT `age` FROM `student` GROUP BY `age` HAVING `age` > 100 ORDER BY `age` ASC'
```

2、 insert
```python
db.table('student').insert(name='Tom', age=12)
# "INSERT INTO `student` (`name`, `age`) VALUES ('Tom', 12)"

db.table('student').insert({
    'name': 'Tom',
    'age': 13
})
# "INSERT INTO `student` (`name`, `age`) VALUES ('Tom', 13)"

uid = db.table('student').insert_get_id({
    'name': 'Tom',
    'age': 13
})
# "INSERT INTO `student` (`age`, `name`) VALUES (13, 'Tom')"

db.table('student').insert([
    {'name': 'Tom', 'age': 13},
    {'name': 'Tom', 'age': 14}
])
# "INSERT INTO `student` (`age`, `name`) VALUES (13, 'Tom'), (14, 'Tom')"
```

3、update
```python
db.table('student').where('id', 1).update(age=1)
# 'UPDATE `student` SET `age` = 1 WHERE `id` = 1'

db.table('student').where('id', 1).update({'age': 1})
# 'UPDATE `student` SET `age` = 1 WHERE `id` = 1'
```

4、increment /decrement
```python
db.table('student').increment('age')  # Increment the value by 1
'UPDATE `student` SET `age` = `age` + 1'

db.table('student').increment('age', 5)  # Increment the value by 5
'UPDATE `student` SET `age` = `age` + 5'

db.table('student').decrement('age')  # Decrement the value by 1
'UPDATE `student` SET `age` = `age` - 1'

db.table('student').decrement('age', 5)  # Decrement the value by 5
'UPDATE `student` SET `age` = `age` - 5'

db.table('student').increment('votes', 1, name='John')
# TypeError: increment() got an unexpected keyword argument 'name'

db.table('student').increment('age', 1, {'name': 'John'})
"UPDATE `student` SET `age` = `age` + 1, `name` = 'John'"

```

5、delete
```python
db.table('student').where('age', '<', 25).delete()
# 'DELETE FROM `student` WHERE `age` < 25'

db.table('student').delete()
'DELETE FROM `student`'

db.table('student').truncate()
'TRUNCATE `student`'
```

## 四、Model

定义model
```python
from orator import Model, SoftDeletes

Model.set_connection_resolver(db)


class User(SoftDeletes, Model):
    # 设置真正的表名
    __table__ = 'student'

    # 设置可以批量赋值的字段
    __fillable__ = ['name', 'age']

    # 设置不允许赋值字段
    __guarded__ = ['id']

    # 禁用时间自动更新 created_at updated_at
    __timestamps__ = False

    # 需要继承 SoftDeletes 使用软删除, 好像不起作用
    __dates__ = ['deleted_at']

```

1、select

```python
users = User.all()
'SELECT * FROM `student`'

user = User.find(1)
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'

# 如果没有抛出异常
model = User.find_or_fail(1)

model = User.where('age', '>', 100).first_or_fail()
'SELECT * FROM `student` WHERE `age` > 100 LIMIT 1'

users = User.where('age', '>', 100).take(10).get()
'SELECT * FROM `student` WHERE `age` > 100 LIMIT 10'

count = User.where('age', '>', 100).count()
'SELECT COUNT(*) AS aggregate FROM `student` WHERE `age` > 100'

# 使用原样查询
users = User.where_raw('id > ? and age = 100', [25]).get()
'SELECT * FROM `student` WHERE id > 25 AND age = 100'

# 分次取回数据
for users in User.chunk(100):
    for user in users:
        pass
    
```

2 insert

```python
# Save新增数据
user = User()
user.name = 'John'
user.save()
"INSERT INTO `student` (`name`) VALUES ('John')"

# Create
user = User.create(name='John')
"INSERT INTO `student` (`name`) VALUES ('John')"

# 查询数据，如果不存在则创建一条数据
user = User.first_or_create(name='Jini')
"SELECT * FROM `student` WHERE (`name` = 'Jini') LIMIT 1"
"INSERT INTO `student` (`name`) VALUES ('Jini')"

# 查询数据，如果不存在则创建一个实例
user = User.first_or_new(name='java')
"SELECT * FROM `student` WHERE (`name` = 'java') LIMIT 1"
```

3、 Update
```python
# find ->save
user = User.find(14)
'SELECT * FROM `student` WHERE `student`.`id` = 14 LIMIT 1'
user.name = 'Foo'

user.save()
"UPDATE `student` SET `name` = 'Foo' WHERE `id` = 14"

# update
User.where('age', '>', 100).update(name='Jack')
"UPDATE `student` SET `name` = 'Jack' WHERE `age` > 100"

```

4、 delete
```python
# find -> delete
user = User.find(14)
# 'SELECT * FROM `student` WHERE `student`.`id` = 14 LIMIT 1'
user.delete()
# 'DELETE FROM `student` WHERE `id` = 14'

User.destroy(15)
'SELECT * FROM `student` WHERE `id` IN (15)'
'DELETE FROM `student` WHERE `id` = 15'

User.destroy(16, 17, 18)
'SELECT * FROM `student` WHERE `id` IN (16, 17, 18)'
'DELETE FROM `student` WHERE `id` = 16'
'DELETE FROM `student` WHERE `id` = 17'
'DELETE FROM `student` WHERE `id` = 18'

User.where('age', '>', 100).delete()
'DELETE FROM `student` WHERE `age` > 100'


# User.where('id', '=', 19).delete()
'DELETE FROM `student` WHERE `id` = 19'


# 使用软删除后，查询结果没有删除后的数据
phone = User.find(20)
'SELECT * FROM `student` WHERE (`student`.`id` = 20) AND (`student`.`deleted_at` IS NULL) LIMIT 1'

# 包含软删除后的数据
User.with_trashed().where('id', 1).get()
'SELECT * FROM `student` WHERE `id` = 1'
```

## 五、Model关联查询
引入模块
```python
from orator import Model

Model.set_connection_resolver(db)

from orator.orm import (
    has_one,
    belongs_to,
    has_many,
    belongs_to_many,
    has_many_through,
    morph_to,
    morph_one,
    morph_many,
    morph_to_many, 
    morphed_by_many
   )

```

1、一对一
```python

"""
student <- -> phone

student
    id - integer    
    name - string

phone
    id - integer
    number - string
    student_id - integer
"""

class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    # 指定外键
    @has_one('student_id')
    def phone(self):
        return Phone


class Phone(Model):
    # 指定本表中的外键字段
    @belongs_to('student_id')
    def student(self):
        return Student


phone = Student.find(20).phone
'SELECT * FROM `student` WHERE `student`.`id` = 20 LIMIT 1'

print(phone)
'SELECT * FROM `phones` WHERE `phones`.`student_id` = 20 LIMIT 1'


ret = Phone.find(1).student
'SELECT * FROM `phones` WHERE `phones`.`id` = 1 LIMIT 1'
print(ret)
'SELECT * FROM `student` WHERE `student`.`id` = 20 LIMIT 1'

```


2、一对多
```python
"""
student <- => comment

表结构和一对一样，查询的时候没有limit 1限制

student
    id - integer    
    name - string

comment
    id - integer
    name - string
    student_id - integer
"""

class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many('student_id', 'id')
    def comments(self):
        return Comment


class Comment(Model):
    # 定义反向关系
    @belongs_to
    def student(self):
        return Student


comments = Student.find(20).comments
print(comments)
'SELECT * FROM `student` WHERE `student`.`id` = 20 LIMIT 1'
'SELECT * FROM `comments` WHERE `comments`.`student_id` = 20'

print(Comment.find(1).student)
'SELECT * FROM `comments` WHERE `comments`.`id` = 1 LIMIT 1'
'SELECT * FROM `student` WHERE `student`.`id` = 20 LIMIT 1'

```

3、多对多
```python
"""
student <- => roles_student <= -> roles

student
    id - integer    
    name - string

roles
    id - integer
    name - string

roles_student
    id - integer
    role_id - integer
    student_id - integer

"""

class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @belongs_to_many
    def roles(self):
        return Role


class Role(Model):

    @belongs_to_many
    def students(self):
        return Student


roles = Student.find(20).roles
print(roles)

'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'

"""
SELECT `roles`. *, `roles_student`. 
`student_id` AS `pivot_student_id`, 
`roles_student`. `role_id` AS `pivot_role_id` 
FROM `roles` INNER JOIN `roles_student` 
ON `roles`. `id` = `roles_student`. `role_id`
 WHERE `roles_student`. `student_id` = 20
 """


print(Role.find(1).students)


'SELECT * FROM `roles` WHERE `roles`.`id` = 1 LIMIT 1'

"""
SELECT `student`. *, `roles_student`. 
`role_id` AS `pivot_role_id`, 
`roles_student`. `student_id` AS `pivot_student_id` 
FROM `student` INNER JOIN `roles_student` 
ON `student`. `id` = `roles_student`. `student_id` 
WHERE `roles_student`. `role_id` = 1
"""
```


4、跨中间表一对多
```python
"""
countries <- => students <- => roles

countries
    id - integer
    name - string

students
    id - integer
    name - string
    country_id - integer

roles
    id - integer
    title - string
    student_id - integer

"""

class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many
    def roles(self):
        return Role


class Role(Model):

    @belongs_to
    def students(self):
        return Student


class Country(Model):
    __table__ = 'countrys'

    # 定义反向关系
    @has_many_through(Student, 'country_id', 'student_id')
    def roles(self):
        return Role


print(Country.find(1).roles)

'SELECT * FROM `countrys` WHERE `countrys`.`id` = 1 LIMIT 1'

"""
SELECT `roles`.*, `student`.`country_id` FROM `roles` 
INNER JOIN `student` ON `student`.`id` = `roles`.`student_id` 
WHERE `student`.`country_id` = 1
"""

```

## 六、Model多态关联

1、多态一对一关联
和一对一关系相比，多了一个type类型字段，标记多个表
```python

# 一个模型属于一个模型
"""
Staff <- -> Photo 
Order <- -> Photo 

staff
    id - integer
    name - string

orders
    id - integer
    price - integer

photos
    id - integer
    path - string
    imageable_id - integer
    imageable_type - string

"""
from orator.orm import morph_one, morph_to

class Photo(Model):

    @morph_to
    def imageable(self):
        return


class Staff(Model):

    @morph_one('imageable')
    def photo(self):
        return Photo


class Order(Model):

    # 重写多态关联字段
    __morph_name__ = 'order'

    @morph_one('imageable')
    def photo(self):
        return Photo


staff = Staff.find(1)
'SELECT * FROM `staffs` WHERE `staffs`.`id` = 1 LIMIT 1'

print(staff.photo)
"""
SELECT * FROM `photos` 
WHERE `photos`.`imageable_id` = 1 
AND `photos`.`imageable_type` = 'staffs'
LIMIT 1
"""

photo = Photo.find(1)
'SELECT * FROM `photos` WHERE `photos`.`id` = 1 LIMIT 1'

```

2、多态一对多关联
没有和多态一对多相比，没有limit
```python
from orator.orm import morph_to, morph_many
"""
# 一个模型属于多个模型

Staff <- => Photo 
Order <- => Photo  

staff
    id - integer
    name - string

orders
    id - integer
    price - integer

photos
    id - integer
    path - string
    imageable_id - integer
    imageable_type - string
"""


class Photo(Model):

    @morph_to
    def imageable(self):
        return


class Staff(Model):

    @morph_many('imageable')
    def photos(self):
        return Photo


class Order(Model):
    # 重写多态关联字段
    __morph_name__ = 'order'

    @morph_many('imageable')
    def photos(self):
        return Photo


staff = Staff.find(1)
'SELECT * FROM `staffs` WHERE `staffs`.`id` = 1 LIMIT 1'

for photo in staff.photos:
    pass

"""

SELECT * FROM `photos` 
WHERE `photos`.`imageable_id` = 1 
AND `photos`.`imageable_type` = 'staffs'


photo = Photo.find(1)
'SELECT * FROM `photos` WHERE `photos`.`id` = 1 LIMIT 1'

imageable = photo.imageable
print(imageable)
# 'SELECT * FROM `staffs` WHERE `staffs`.`id` = 1 LIMIT 1'
"""

```

3、多态多对多
```python
"""
posts
    id - integer
    name - string

videos
    id - integer
    name - string

tags
    id - integer
    name - string

taggables
    tag_id - integer
    taggable_id - integer
    taggable_type - string

"""
from orator.orm import morph_to_many,  morphed_by_many


class Tag(Model):

    @morphed_by_many('taggable')
    def posts(self):
        return Post

    @morphed_by_many('taggable')
    def videos(self):
        return Video


class Post(Model):

    @morph_to_many('taggable')
    def tags(self):
        return Tag


class Video(Model):

    @morph_to_many('taggable')
    def tags(self):
        return Tag


print(Video.find(1).tags)

'SELECT * FROM `videos` WHERE `videos`.`id` = 1 LIMIT 1'

"""
SELECT `tags`.*, 
`taggables`.`taggable_id` AS `pivot_taggable_id`, 
`taggables`.`tag_id` AS `pivot_tag_id` 
FROM `tags` INNER JOIN `taggables` 
ON `tags`.`id` = `taggables`.`tag_id` 
WHERE `taggables`.`taggable_id` = 1 
AND `taggables`.`taggable_type` = 'videos'
"""

```


## 七、其他操作
1、动态属性
```python

from orator import Model, SoftDeletes

Model.set_connection_resolver(db)


class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many('student_id', 'id')
    def comments(self):
        return Comment


class Comment(Model):
    # 定义反向关系
    @belongs_to
    def student(self):
        return Student


print(Student.find(1).comments.count())
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
'SELECT * FROM `comments` WHERE `comments`.`student_id` = 1'
# 2

# 增加条件查询
print(Student.find(1).comments().where('id', '>', 1).first())
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
'SELECT * FROM `comments` WHERE `comments`.`student_id` = 1 AND `id` > 1 LIMIT 1'

```


2、预加载数据
```python

from orator import Model, SoftDeletes

Model.set_connection_resolver(db)


class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many('student_id', 'id')
    def comments(self):
        return Comment


class Comment(Model):
    # 定义反向关系
    @belongs_to
    def student(self):
        return Student


for comment in Comment.all():
    print(comment.student.name)

"""
'SELECT * FROM `comments`'
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
'SELECT * FROM `student` WHERE `student`.`id` = 2 LIMIT 1'
"""

# 预加载 解决  N + 1  次查询问题

for comment in Comment.with_('student').get():
    print(comment.student.name)

"""
'SELECT * FROM `comments`'
'SELECT * FROM `student` WHERE `student`.`id` IN (1, 2)'
"""

# 增加查询条件
Comment.with_({
    'student': Student.query().where('id', '>', 1)
}).get()

"""
'SELECT * FROM `comments`'
'SELECT * FROM `student` WHERE `student`.`id` IN (1, 2) AND `id` > 1'
"""

# load加载
comments = Comment.all()
comments.load('student')
'SELECT * FROM `comments`'
'SELECT * FROM `student` WHERE `student`.`id` IN (1, 2)'

# 添加条件
comments.load({
   'student': Student.query().where('name', 'like', '%foo%')
})
"SELECT * FROM `student` WHERE `student`.`id` IN (1, 2) AND `name` like '%foo%'"

```

3、插入关联数据
```python

Model.set_connection_resolver(db)


class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many('student_id', 'id')
    def comments(self):
        return Comment


class Comment(Model):

    __fillable__ = ['number']

    __timestamps__ = False

    # 定义反向关系
    @belongs_to
    def student(self):
        return Student


# 插入一条关联数据
comment = Comment(number='A new comment')

student = Student.find(1)
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'

comment = student.comments().save(comment)
"INSERT INTO `comments` (`number`, `student_id`) VALUES ('A new comment', 1)"


# 插入多条关联数据
comments = [
    Comment(number='Comment 1'),
    Comment(number='Comment 2'),
    Comment(number='Comment 3')
]

student = student.find(1)

student.comments().save_many(comments)
"""
"INSERT INTO `comments` (`number`, `student_id`) VALUES ('Comment 1', 1)"
"INSERT INTO `comments` (`number`, `student_id`) VALUES ('Comment 2', 1)"
"INSERT INTO `comments` (`number`, `student_id`) VALUES ('Comment 3', 1)"
"""

# create方法
student = Student.find(1)
student.comments().create(number="123")
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
"INSERT INTO `comments` (`number`, `student_id`) VALUES ('123', 1)"

```

4、一对多关系维护 
```python
from orator import Model, SoftDeletes

Model.set_connection_resolver(db)


class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @has_many('student_id', 'id')
    def comments(self):
        return Comment


class Comment(Model):

    __fillable__ = ['number']

    __timestamps__ = False

    # 定义反向关系
    @belongs_to
    def student(self):
        return Student

# belongs_to 关系更新
comment = Comment.find(1)
student = Student.find(22)

# # 添加关系
comment.student().associate(student)
comment.save()

"""
'SELECT * FROM `comments` WHERE `comments`.`id` = 1 LIMIT 1'
'SELECT * FROM `student` WHERE `student`.`id` = 22 LIMIT 1'
'UPDATE `comments` SET `student_id` = 22 WHERE `id` = 1'
"""

# 解除关系
comment.student().dissociate()
comment.save()
'UPDATE `comments` SET `student_id` = NULL WHERE `id` = 1'
```

5、多对多关系维护
```python

from orator import Model, SoftDeletes

Model.set_connection_resolver(db)


class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @belongs_to_many
    def roles(self):
        return Role


class Role(Model):

    @belongs_to_many
    def students(self):
        return Student

user = Student.find(1)
role = Role.find(1)

# 添加关联
user.roles().attach(role)

"""
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
'SELECT * FROM `roles` WHERE `roles`.`id` = 1 LIMIT 1'

'INSERT INTO `roles_student` (`role_id`, `student_id`) VALUES (1, 1)'
"""

# 解除关联
# user.roles().detach(1)
'DELETE FROM `roles_student` WHERE `student_id` = 1 AND `role_id` IN (1)'

# 同步关系
user.roles().sync([1, 2, 3])
"""
'SELECT `role_id` FROM `roles_student` WHERE `student_id` = 1'

'DELETE FROM `roles_student` WHERE `student_id` = 1 AND `role_id` IN (NULL)'

'INSERT INTO `roles_student` (`role_id`, `student_id`) VALUES (1, 1)'
'INSERT INTO `roles_student` (`role_id`, `student_id`) VALUES (2, 1)'
'INSERT INTO `roles_student` (`role_id`, `student_id`) VALUES (3, 1)'
"""

```

6、修改时间字段格式
```python

class User(Model):

    def get_date_format(self):
        return 'DD-MM-YY'
```

7、scope重用查询
```python
class Student(Model):
    # 设置真正的表名
    __table__ = 'student'

    @scope
    def popular(self, query):
        return query.where('age', '>', 100)

    @scope
    def women(self, query, sex='womem'):
        return query.where('sex', sex)


users = Student.popular().women().order_by('created_at').get()
"SELECT * FROM `student` WHERE (`age` > 100) AND (`sex` = 'womem') ORDER BY `created_at` ASC"

```

8、accessor、mutator
```python

from orator import Model, SoftDeletes
from orator.orm import scope, accessor, mutator


Model.set_connection_resolver(db)


# scope重用查询
class Student(Model):
    # 设置真正的表名
    __table__ = 'student'
    __timestamps__ = False

    # 设置序列化字段
    __hidden__ = ['created']
    __visible__ = ['name', 'age', 'is_man']

    # 添加额外字段
    __appends__ = ['is_man']

    # 类型自动转换
    # 支持 int, float, str, bool, dict, list.
    __casts__ = {
        'age': 'str'
    }

    sex_map = {
        0: '女',
        1: '男'
    }

    # 访问器
    @accessor
    def get_sex(self):
        sex = self.get_raw_attribute('sex')
        sex_map = {
            0: '女',
            1: '男'
        }
        return sex_map.get(sex)

    # 设置器
    @mutator
    def set_sex(self, value):
        sex_map_reverse = {v: k for k, v in self.sex_map.items()}
        self.set_raw_attribute('sex', sex_map_reverse.get(value, 1))

    @accessor
    def is_man(self):
        return self.get_raw_attribute('sex') == 1


# users = Student.popular().women().order_by('created_at').get()
"SELECT * FROM `student` WHERE (`age` > 100) AND (`sex` = 'womem') ORDER BY `created_at` ASC"

# print(Student.find(1).first_name)
'SELECT * FROM `student` WHERE `student`.`id` = 1 LIMIT 1'
# John

student = Student.find(1)
# student.set_first_name = 'JAcK'
# student.save()
print(student.get_sex)
student.set_sex = '男'
print(type(student.age)) # <class 'str'>
student.save()

print(student.to_json())
{"name": "1", "age": "0"}

print(student.serialize())
{'name': '1', 'age': '0'}


# 添加额外字段后输出
{'name': '1', 'age': '0', 'is_man': True}

```


9、Pagination分页
```python
users = db.table('student').paginate(15, 2)
'SELECT COUNT(*) AS aggregate FROM `student`'
'SELECT * FROM `student` LIMIT 15 OFFSET 15'
print(dir(users))
"""
[
'count', 'current_page', 'current_page_resolver', 
'first_item', 'get_collection', 'has_more_pages', 
'has_pages', 'is_empty', 'items', 'last_item', 
'last_page', 'next_page', 'per_page', 'previous_page', 
'resolve_current_page', 'serialize', 
'to_dict', 'to_json', 'total'
]
"""

# 转换为json数据
print(users.to_json())
"""
[
{"id": 35, "name": "John", "age": 0, "sex": 0, "created_at": 0, "updated_at": 0, "deleted_at": null, "country_id": null}, 
{"id": 36, "name": "John", "age": 0, "sex": 0, "created_at": 0, "updated_at": 0, "deleted_at": null, "country_id": null}
]
"""
some_users = Student.where('age', '>', 100).paginate(15, 2)
'SELECT COUNT(*) AS aggregate FROM `student` WHERE `age` > 100'
'SELECT * FROM `student` WHERE `age` > 100 LIMIT 15 OFFSET 15'


# simple-pagination

ret = Student.simple_paginate(15, 2)
'SELECT * FROM `student` LIMIT 16 OFFSET 15'
print(dir(ret))
"""
['count', 'current_page', 'current_page_resolver', 'first_item', 
'get_collection', 'has_more_pages', 'has_pages', 'is_empty', 'items', 
'last_item', 'next_page', 'per_page', 'previous_page', 'resolve_current_page', 
'serialize', 'to_dict', 'to_json']
"""
```
