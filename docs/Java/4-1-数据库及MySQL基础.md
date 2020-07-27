# 数据库及SQL/MySQL基础 
## 课时1 数据库概述

1、常见数据库
Oracle 甲骨文
DB2 IBM
SQL Server 微软
Sybase 赛尔斯
MySQL 甲骨文


2、理解数据库
RDBMS = Manager + Database
Relational Database Management System
关系型数据库管理系统

Database = N 个 Table
Table: 表结构、表记录

## 课时2 Java应用与数据库的关系
...

## 课时3-4 安装/删除MySQL
安装路径不要有中文

MAC brew安装/卸载mysql
```shell
$ brew install mysql

$ brew uninstall mysql
```

## 课时5 MySQL安装路径以及配置信息
mysqld 服务端
mysql 客户端

## 课时6 开启关闭服务器以及登录退出客户端
mysql启动/关闭服务
```shell
$ mysql.server start

$ mysql.server stop
```

登录退出客户端
```shell
# 登录
$ mysql -uroot -p

# 查看数据库
> show databases;

# 退出
> exit/quit;
```

## 课时7 SQL语言的概述
SQL 
Structured Query Language
结构化查询语言

SQL方言
某些数据库的独有语法，
例如：limit语句只在MySQL中使用

SQL语法
1、单行或多行书写，分号结尾
2、可以使用空格或缩进增强可读性
3、MySQL不区分大小写，建议使用大写

SQL语句分类

| 简称 | 全称 | 中文 | 说明 |
| - | - | - | -  |
| DDL | Data Definition Language | 数据定义语言 | 定义库、表、列结构 |
| DCL | Data Control Language | 数据控制语言 | 定义访问权限和安全级别 |
| DML | Data Manipulation Language | 数据操作语言 | 操作数据，增、删、改 |
| DQL | Data Query Language | 数据查询语言 | 查询数据 |

## 课时8 DDL（数据定义语言）之操作数据库
```sql
-- 查看所有数据库：
show databases;

-- 选择数据库：
use <database_name>;

-- 创建数据库：
create database [if not exists] <database_name> [charset=utf8];

-- 删除数据库：
drop database [if exists] <database_name>;

-- 修改数据库编码：
alter database <database_name> character set utf8
```

## 课时9-10 数据类型介绍
int 整型
double 浮点型，例如 double(5, 2) 表示最多5位，其中2位小数,即最大999.99
decimal 浮点型，货币使用，不会出现精度缺失
char 定长字符串，char(255)，长度不足指定长度会补足到指定长度，比变长节省空间
varchar 变长字符串 varchar(65535) 

text(clob) 字符串
    tynytext(255B), 
    text(64K), 
    mediumtext(16M), 
    longtext(4G)

blob 字节类型 
    tynyblob(255B),  
    blob(64K), 
    mediumblob(16M),  
    longblob(4G)

date 日期 yyyy-MM-dd
time 时间 hh:mm:ss
timestamp 时间戳

## 课时11 DDL（数据定义语言）之操作表
1、创建表, 注意最后一列没有逗号 
```sql
create table [if not exists] <table_name>(
    <列名> <列类型>,
    ...
    <列名> <列类型>
);
```
eg:
```sql
-- 创建数据库
create database school;

-- 切换数据库
use school;

-- 创建数据表
create table tb_stu(
    number char(11),
    name varchar(50),
    age int,
    gender varchar(10)
);

-- 查看当前数据库中所有表
show tables;

-- 查看指定表的创建语句
show create table tb_stu;
show create table stu \G
d
-- 查看表结构
desc tb_stu;

-- 删除表
drop table ts_stu;

show tables;
```

2、修改表

```sql
-- 前缀
alter table <table_name> 

-- 添加列
alter table <table_name> add (
    <列名> <列类型>,
    ...
    <列名> <列类型>
);

-- 修改列类型
-- 如果已存在数据，新类型可能会影响到已存在数据
alter table <table_name> modify 列名 列类型;

-- 修改列名称
alter table <table_name> change 原列名 新列名 列类型;

-- 删除列
alter table <table_name> drop 列名;

-- 修改表名
alter table 原表名 rename to 新表名;
```

## 课时12-13-14 DML（数据操作语言）
查询所有记录
```sql
select * from <table_name>;
```

1、插入数据
```sql
insert into <table_name>(列名1, 列名2,...) values(列值1, 列值1,...);
```
没有指定的列等同于插入默认值
值的顺序与指定列顺序对应
列名可省略（不建议）

字符串类型使用单引号，不能使用双引号
日期类型也要使用单引号

2、修改数据
```sql
update 表名 set 列名1=列值1, 列名2=列值2,...[where条件]
```
条件必须是一个boolean类型的值或表达式
运算符：=、!=、<>、>、<、>=、<=、between...and、in(...)、is null、not、or、and

3、删除数据
```sql
delete from 表名 [where条件]

-- truncate是DDL语句，先删除drop，在创建creae，无法回滚
truncate table 表名 
```

## 课时15 DCL（数据控制语言）
1、创建用户
一个项目创建一个用户，一个项目对应的数据库只有一个
```sql
-- 用户只能在指定的ip地址上登录
create user 用户名@ip地址 identified by 密码;

-- 用户可以在任意ip地址上登录
create user 用户名@'%' identified by 密码;
```

2、用户授权
(1) 给用户分派指定权限
```sql
grant 权限1,...权限n on 数据库.* to 用户名@ip地址
```
eg:
```sql
grant create, alter, drop, insert, update, delete, select on db1.* to user1@localhost;
```

(2) 给用户分派所有权限
```sql
grant all on 数据库.* to 用户名@ip地址
```

3、撤销授权
(1) 撤销指定权限
```sql
revoke 权限1,...权限n on 数据库.* from 用户名@ip地址
```
eg:
```sql
revoke create, alter, drop on db1.* from user1@localhost;
```

(2) 撤销指定权限
```sql
revoke 权限1,...权限n on 数据库.* from 用户名@ip地址
```

4、查看权限
```sql
show grants for 用户名@ip地址;
```

5、删除用户
```sql
drop user 用户名@ip地址;
``` 

## 课时16 DQL（数据查询语言）之基础查询之列控制
```sql
-- 查询所有列
select * from 表名;

-- 查询指定列
select 列名1, 列名2... 列名n from 表名;

-- 记录去重
select distinct * from 表名;
select distinct 列名 from 表名;

-- 列运算
-- （1）加减乘除
select age-1 from table

-- （2）字符串连接，不能用加号连接+
select concat('$', salary) from table;

-- （3）转换null值， 任何值与null相加都是null
select ifnull(salary, 0) + 1000 from table;
-- ifnull(salary, 0) 如果salary is null 那么 salary->0

-- （4）列别名
select name as 姓名 from table;
select name 姓名 from table;
```

## 课时17 DQL（数据查询语言）之条件查询
使用where子句控制记录
```sql
select * from table where salary>500;
select * from table where name in ('李白', '杜甫');
select * from table where salary between 200 and 500;
```

## 课时18 DQL（数据查询语言）之模糊查询
下划线`_`代表一个字符
百分号`%`代表[0,n]个字符
```sql
select * from table where name like '张_';
select * from table where name like '张%';
```

## 课时19 DQL（数据查询语言）之排序
默认升序排序
```sql
-- 升序 默认, asc可省略
select * from table order by id asc;

-- 降序
select * from table order by id desc;

-- 多列排序
select * from table order by salary asc, id desc;
```

## 课时20 DQL（数据查询语言）之聚合函数
```sql
-- 统计有效行数，整行全是null不计数
select count(*) from table;

-- 统计不是null的行数
select count(id) from table;

-- 求和
select sum(salary) from table;

-- 最小值
select min(salary) from table;

-- 最大值
select max(salary) from table;

-- 平均值
select avg(salary) from table;

select count(*) 人数, 
sum(salary) 总和, avg(salary) 平均值,
max(salary) 最高,  min(salary) 最低 
from table;
```

## 课时21 DQL（数据查询语言）之分组查询
```sql
select job, count(*) from table group by job;

-- 先过滤再分组
select job, count(*) from table where salary > 1500 group by job;

-- 先过滤，再分组，再对分组结果过滤
select job, count(*) from table where salary > 1500 group by job having count(*)  >= 2;
```

## 课时22 DQL（数据查询语言）之limit方言
计算公式：
```
跳过行数 = ( 当前页 - 1 ) * 每页记录数
```
```sql
select * from table limit count;
select * from table limit count OFFSET offset;
select * from table limit offset, count;
```
