## ORM 
Object-Relational Mapping

对应关系
```
ORM   DB
类    数据表
对象  数据行
属性  字段
```

ORM提高开发效率，降低了执行效率

Flask - Sqlalchemy

$ python manage.py migrate

## 字段类型和参数
1、字段类型
```
# 自增长 默认int

Auto = models.AutoField(primary_key=True)
BigAuto = models.BigAutoField()

# 二进制
Binary = models.BinaryField()

# 布尔
Boolean = models.BooleanField()
NullBoolean = models.NullBooleanField()

# 整型
PositiveSmallInteger = models.PositiveSmallIntegerField()  # 5字节
SmallInteger = models.SmallIntegerField()  # 6字节
PositiveInteger = models.PositiveIntegerField()  # 10字节
Integer = models.IntegerField()  # 11字节
BigInteger = models.BigIntegerField()  # 20字节

# 字符串
Char = models.CharField()  # varchar
Text = models.TextField()  # longtext

# 时间日期
Date = models.DateField()
DateTime = models.DateTimeField()
Duration = models.DurationField()  # int python timedelta实现

# 浮点型
Float = models.FloatField()
Decimal = models.DecimalField()

# 其他
Email = models.EmailField()  # 邮箱
Image = models.ImageField()
File = models.FileField()
FilePath = models.FilePathField()
URL = models.URLField()
UUID = models.UUIDField()
GenericIPAddress = models.GenericIPAddressField()
```

2、关系型字段
一对一 OneToOneField
多对一 ForeignKey
多对对 ManyToManyField 默认或自定义中间表

3、字段类型参数
默认表名
应用_模型类名小写
eg: app_student

（1）所有字段都有的参数

db_column="name"  指定数据库字段名
verbose_name="别名"
help_text="表单说明"

primary_key=True  设置主键
unique=True       唯一键
null=True         数据库允许为空，默认都是不能为null的
blank=True    前端提交表单允许为空
db_index=True 建立索引
editable=False 不允许编辑字段

（2）个别字段的参数
CharField
    max_length=100 最大长度

DateField、DateTime
    unique_for_date=True 日期必须唯一
    unique_for_month=True 月份唯一
    auto_now=True       自动更新记录时间
    auto_now_add=True   自动增加记录时间

DecimalField
    max_digits=4   总位数
    decimal_places=2 小数点数
    eg: 11.22 16.34

（3）关系型字段参数
OneToOneField
    related_name="one"  父表查字表数据

ForeignKey
    on_delete=""  外键所关联的对象被删除时进行的操作
        CASCADE： 级联删除。将定义有外键的模型对象同时删除， 默认操作
        PROTECT： 阻止删除。会报完整性错误。
        DO_NOTHING：什么也不做
        SET_NULL：外键设置为 null，前提是 null=True, blank=True。
        SET_DEFAULT：设置为外键的默认值，前提是设置了default参数。
        SET()：会调用外面的值，可以是一个函数。一般情况下使用 CASCADE 就可以了。
eg:
```python

class B(models.Model):
    foreign = models.ForeignKey(A, on_delete=models.CASCADE)
    foreign = models.ForeignKey(A, on_delete=models.PROTECT)
    foreign = models.ForeignKey(A, on_delete=models.DO_NOTHING)
    foreign = models.ForeignKey(A, on_delete=models.SET_NULL, null=True, blank=True)
    foreign = models.ForeignKey(A, on_delete=models.SET_DEFAULT, default=0)
    foreign = models.ForeignKey(A, on_delete=models.SET)

```

4、自关联

示例：地址 省-市-县 级联
```python

class AddressInfo(models.Model):
    address = models.CharField(max_length=200, null=True, blank=True, verbose_name="地址")
    pid = models.ForeignKey("self", null=True, blank=True, verbose_name="自关联", on_delete=models.SET_NULL)

    def __str__(self):
        return self.address
```

## 元数据Meta
修改应用名称
apps.py
```python
class OrmdemoConfig(AppConfig):
    name = 'ormdemo'
    verbose_name = "应用名称"

```

修改model元数据
```python

class AddressInfo(models.Model):
    address = models.CharField(max_length=200, null=True, blank=True, verbose_name="地址")
    note = models.CharField(max_length=200, null=True, blank=True, verbose_name="说明")
    pid = models.ForeignKey("self", null=True, blank=True, verbose_name="自关联", on_delete=models.SET_NULL)

    def __str__(self):
        return self.address

    class Meta:
        db_table = "address"  # 自定义表名
        ordering = ["pid_id"]  # 指定排序字段
        verbose_name = "地址"  # 单数
        verbose_name_plural = verbose_name  # 复数
        abstract = True  # 设置为基类
        permissions = (("定义好的权限", "权限说明"),)
        managed = False  # 按照Django默认方式管理数据表
        unique_together = ("address", "note")  # 联合唯一键，单元组或多元组
        app_label = "ormdemo"  # 定义模型类属于哪个应用
        db_tablespace = "" # 定义数据库表空间
```

## 模型类开发实例
```python

"""
讲师 - 助教 一对一
讲师 - 课程表 一对多
课程表 - 学生 多对多
"""


class Teacher(models.Model):
    """讲师信息表"""
    nickname = models.CharField(max_length=30, primary_key=True, db_index=True, verbose_name="昵称")
    introduction = models.TextField(default="这位同学很懒，木有签名的说~", verbose_name="简介")
    fans = models.PositiveIntegerField(default=0, verbose_name="粉丝数")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "讲师信息表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.nickname


class Course(models.Model):
    """课程信息表"""
    title = models.CharField(max_length=100, primary_key=True, db_index=True, verbose_name="课程名")
    type = models.CharField(choices=((0, "其他"), (1, "实战课"), (2, "免费课")), max_length=1, default=0, verbose_name="课程类型")
    price = models.PositiveSmallIntegerField(verbose_name="价格")
    volume = models.BigIntegerField(verbose_name="销量")
    online = models.DateField(verbose_name="上线时间")
    # 删除级联
    teacher = models.ForeignKey(Teacher, null=True, blank=True, on_delete=models.CASCADE, verbose_name="讲师")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "课程信息表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return f"{self.get_type_display()}-{self.title}"


class Student(models.Model):
    """学生信息表"""
    nickname = models.CharField(max_length=30, primary_key=True, db_index=True, verbose_name="学生姓名")
    age = models.PositiveSmallIntegerField(verbose_name="年龄")
    gender = models.CharField(choices=((0, "保密"), (1, "男"), (2, "女")), max_length=1, default=0, verbose_name="性别")
    study_time = models.PositiveIntegerField(default=0, verbose_name="学习时长(h)")
    course = models.ManyToManyField(Course, verbose_name="课程")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "学生信息表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.nickname


class TeacherAssistant(models.Model):
    """助教信息表"""
    nickname = models.CharField(max_length=30, primary_key=True, db_index=True, verbose_name="昵称")
    hobby = models.CharField(max_length=10, null=True, blank=True, verbose_name="爱好")
    # 删除置空
    teacher = models.OneToOneField(Teacher, null=True, blank=True, on_delete=models.SET_NULL, verbose_name="讲师")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "助教信息表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.nickname

```


生成数据表
```
python manage.py makemigrations   # 生成迁移文件
python manage.py migrate          # 执行迁移文件
```

删除某个模型类的完整操作:
（1）在已创建的app下, 首先删除models.py中需要删除的模型类
（2）删除该模型类在迁移脚本migrations中的对应文件
（3）删除该项目在django_migrations中的对应记录
（4）删除数据库中对应的数据表


导入数据
（1）django shell

$ python manage.py shell
```
from app.models import Mode

model = Model()
model.name = "name"
model.save()
```

（2）脚本导入 
```python
# -*- coding: utf-8 -*-
import os
import random
from datetime import date

import django
import sys

# 导入项目配置
project_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_path)
os.environ['DJANGO_SETTINGS_MODULE'] = 'mysite.settings'
django.setup()

from ormdemo.models import Teacher, Course, Student, TeacherAssistant


def import_data():
    # 讲师数据 create
    Teacher.objects.create(nickname="Jack", introduction="Python工程师", fans=666)
    
    # 课程数据 bulk_create
    data = [
        Course(title=f"Python系列教程{i}",
               teacher=Teacher.objects.get(nickname="Jack"),
               type=random.choice([0, 1, 2]),
               price=random.randint(200, 300),
               volume=random.randint(100, 10000),
               online=date(2018, 10, 1)
               )
        for i in range(1, 5)
    ]

    Course.objects.bulk_create(data)


    # 学生数据 update_or_create
    Student.objects.update_or_create(
        nickname="A同学",
        defaults={
            "age": random.randint(18, 58),
            "gender": random.choice([0, 1, 2]),
            "study_time": random.randint(9, 999)
        }
    )

    # 正向添加
    # 销量大于等于1000的课程
    Student.objects.get(nickname="A同学").course.add(*Course.objects.filter(volume__gte=1000))
    
    # 反向添加
    # 学习时间大于等于500小时的同学
    Course.objects.get(title="Python系列教程1").student_set.add(*Student.objects.filter(
        study_time__gte=500
    ))

    # 助教数据 get_or_create()
    TeacherAssistant.objects.get_or_create(
        nickname="助教1",
        defaults={
            "hobby": "慕课网学习",
            "teacher": Teacher.objects.get(nickname="Jack")
        }
    )


if __name__ == '__main__':
    import_data()

```

（3）fixtures 
Django serialization -> model保存
python manage.py dumpdata > data.json  # 导出数据
python manage.py loaddata data.json    # 导入数据


（4）mysqldump
MySQL数据库导入导出数据

(5)PyCharm
PyCharm自带的导入导出工具


## ModelAPI
1、查询，检索，过滤
```python
Teacher.objects.all()  # 返回多个结果
Teacher.objects.get(id=1)  返回一条结果
Teacher.objects.filter(fans__gte=500) # 返回多个结果
```

2、数据匹配大小写敏感
```python
# 双下划线开头`__`
Teacher.objects.filter(fans__in=[500, 600])

# i开头表示大小写敏感
Teacher.objects.filter(nickname__icontains="A")

```
3、结果切片、排序、链式查询
```python
Teacher.objects.all()[:1]
Teacher.objects.all().order_by("-age")  # 负号表示降序
Teacher.objects.filter(fans__gte=500).order_by("nickname")  # 查询集可以继续使用排序
```

4、查看执行的原生SQL
```python
Teacher.objects.all().order_by("-nickname").query
"""
SELECT `ormdemo_teacher`.`nickname`, 
FROM `ormdemo_teacher` 
ORDER BY `ormdemo_teacher`.`nickname` DESC
"""
```

## 返回新的QuerySet的API
读操作大部分都返回

1、第一类
all 全部
filter 过滤
order_by 排序
exclude  排除
reverse  逆序 需要在元数据中设置ordering
distinct 去重
```python
Student.objects.all().exclude(nickname="A同学")
# SELECT `ormdemo_student`.`nickname` 
# FROM `ormdemo_student` 
# WHERE NOT (`ormdemo_student`.`nickname` = A同学)

Student.objects.all().exclude(nickname="A同学").reverse()
"""
ELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
WHERE NOT (`ormdemo_student`.`nickname` = A同学)
"""
```

2、第二类
extra   别名
defer   排除一些字段
only    选择一些字段
```python
Student.objects.all().extra(select={"name": "nickname"})
"""
SELECT (nickname) AS `name`, `ormdemo_student`.`nickname`, `ormdemo_student`.`age`
FROM `ormdemo_student`
"""

Student.objects.all().only("nickname", "age")
"""
SELECT `ormdemo_student`.`nickname`, `ormdemo_student`.`age` FROM `ormdemo_student`
"""
```

3、第三类
values  获取字典形式
values_list 获取元组形式
```python
Student.objects.values("nickname", "age")
# <QuerySet [{'nickname': 'A同学', 'age': 54}, {'nickname': 'B同学', 'age': 36}]>

Student.objects.values_list("nickname", "age")
# <QuerySet [('A同学', 54), ('B同学', 36)]>

Student.objects.values_list("nickname", flat=True) # 单个字段返回列表
# <QuerySet ['A同学', 'B同学']>
```

4、第四类
dates、datatimes根据时间日期获取查询集
```python
Student.objects.dates("created_at", "month")
"""
SELECT DISTINCT CAST(DATE_FORMAT(`ormdemo_student`.`created_at`, '%Y-%m-01') AS DATE) AS `datefield` 
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`created_at` IS NOT NULL 
ORDER BY `datefield` ASC
"""

```

5、第五类
union 并集
intersection 交集 需要数据库支持
difference 差集 需要数据库支持

```python
ret1 = Student.objects.filter(nickname="同学A")
ret2 = Student.objects.filter(nickname="同学B")
ret1.union(ret2)
"""
(SELECT `ormdemo_student`.`nickname
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = '同学A') 
UNION 
(SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = '同学B')  
LIMIT 2
```

6、第六类
select_related   一对一，多对一查询优化
prefetch_related  一对多，多对多查询优化
```python
Course.objects.all().select_related("teacher")
"""
 SELECT `ormdemo_course`.`title`,  `ormdemo_teacher`.`nickname`
 FROM `ormdemo_course` 
 LEFT OUTER JOIN `ormdemo_teacher`
 ON (`ormdemo_course`.`teacher_id` = `ormdemo_teacher`.`nickname`)  
 LIMIT 21;
"""

Student.objects.all().prefetch_related("course")
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student`  LIMIT 21;

SELECT (`ormdemo_student_course`.`student_id`) AS `_prefetch_related_val_student_id`, `ormdemo_course`.`title`
FROM `ormdemo_course` 
INNER JOIN `ormdemo_student_course` 
ON (`ormdemo_course`.`title` = `ormdemo_student_course`.`course_id`) 
WHERE `ormdemo_student_course`.`student_id` IN ('A同学', 'B同学', 'C同学', 'D同学');
"""

```

反向查询
```python
Teacher.objects.get(nickname="Jack").course_set.all()
"""
SELECT `ormdemo_teacher`.`nickname`
FROM `ormdemo_teacher` 
WHERE `ormdemo_teacher`.`nickname` = 'Jack'

SELECT `ormdemo_course`.`title`
FROM `ormdemo_course` 
WHERE `ormdemo_course`.`teacher_id` = 'Jack'  
LIMIT 21;
"""
```
7、第七类
annotate 聚合计数，求和，平均数，执行原生SQL（分组后的数据进行统计）

```python
from django.db.models import Count, Avg, Max, Min, Sum

Course.objects.values("teacher").annotate(vol=Sum("volume"))
"""
SELECT `ormdemo_course`.`teacher_id`, SUM(`ormdemo_course`.`volume`) AS `vol` 
FROM `ormdemo_course` 
GROUP BY `ormdemo_course`.`teacher_id` 
ORDER BY NULL  LIMIT 21;

"""

Course.objects.values("teacher").annotate(pri=Avg("price"))
"""
SELECT `ormdemo_course`.`teacher_id`, AVG(`ormdemo_course`.`price`) AS `pri` 
FROM `ormdemo_course` 
GROUP BY `ormdemo_course`.`teacher_id` 
ORDER BY NULL  LIMIT 21;
# order by null用途是强制对查询结果禁用排序
"""
``` 

## 不返回QuerySet的API
写操作都不返回结果集
1、获取对象
get, get_or_create, first, last, in_bulk
latest最近记录, earliest 最早记录 需要设置元数据get_latest_by

```python
Student.objects.get(nickname="A同学")  # 返回多个会报错
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = 'A同学'
"""

Student.objects.first()
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
ORDER BY `ormdemo_student`.`nickname` ASC  
LIMIT 1
"""

Student.objects.last()
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
ORDER BY `ormdemo_student`.`nickname` DESC  
LIMIT 1;
"""


Student.objects.in_bulk(["A同学"])
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` IN ('A同学');
"""

Student.objects.latest()
"""
SELECT `ormdemo_student`.`nickname
FROM `ormdemo_student` 
ORDER BY `ormdemo_student`.`created_at` DESC  
LIMIT 1;
"""

Student.objects.earliest()
"""
SELECT `ormdemo_student`.`nickname
FROM `ormdemo_student` 
ORDER BY `ormdemo_student`.`created_at` ASC  
LIMIT 1;

```

2、创建对象
create, bulk_create, update_or_create

3、更新对象
update, update_or_create
```python
Student.objects.filter(nickname="A同学").update(age=13)
"""
UPDATE `ormdemo_student` 
SET `age` = 13 
WHERE `ormdemo_student`.`nickname` = 'A同学'; 
"""

```
4、删除对象
delete 使用filter过滤
```python
Student.objects.filter(nickname="A同学").delete()
"""
SELECT `ormdemo_student`.`nickname 
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = 'A同学';


DELETE FROM `ormdemo_student_course` 
WHERE `ormdemo_student_course`.`student_id` IN ('A同学');

DELETE FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` IN ('A同学');

(13, {'ormdemo.Student_course': 12, 'ormdemo.Student': 1})

"""
```

5、其他操作
exists, count, aggregate(整个数据表统计)
```python
Student.objects.filter(nickname="B同学").exists()
"""
SELECT (1) AS `a` 
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = 'B同学'  
LIMIT 1
"""

Student.objects.filter(nickname="B同学").count()
"""
SELECT COUNT(*) AS `__count` 
FROM `ormdemo_student` 
WHERE `ormdemo_student`.`nickname` = 'B同学'; 
"""

Course.objects.aggregate(Max("price"), Min("price"), Avg("price"), Sum("volum"))
"""
SELECT 
MAX(`ormdemo_course`.`price`) AS `price__max`, 
MIN(`ormdemo_course`.`price`) AS `price__min`, 
AVG(`ormdemo_course`.`price`) AS `price__avg`, 
SUM(`ormdemo_course`.`volume`) AS `volume__sum` 
FROM `ormdemo_course`;

{'price__max': 295, 'price__min': 210, 'price__avg': 250.75, 'volume__sum': 60559}
"""
```

自定义聚合查询（略）
group_contact


## F对象和Q对象
F对象 操作字段数据
Q对象 结合AND OR NOT | ~ & 实现复杂查询
```python
from django.db.models import F, Q
Student.objects.update(age=F("age") + 3)
"""
UPDATE `ormdemo_student` SET `age` = (`ormdemo_student`.`age` + 3);
"""

Student.objects.filter(Q(age__gte=1) & Q(age__lte=10))
"""
SELECT `ormdemo_student`.`nickname`
FROM `ormdemo_student`
WHERE (`ormdemo_student`.`age` >= 1 AND `ormdemo_student`.`age` <= 10) 
LIMIT 21;
"""

```

























