# 4.2-SQL进阶：约束、关系、连接

## 课时1 1.单表的查询练习
可视化客户端 SQLyog
```sql
-- 查询部门编号为30的所有员工
select * from emp where deptno=30;

-- 查询所有销售员的姓名、编号和部门编号
select ename, empno, deptno from emp where job='销售员'

-- 查询奖金高于工资的员工
select * from emp where comm > sal;

-- 查询奖金高于工资60%的员工
select * from emp where comm > sal * 0.6;

-- 查询部门编号为10中所有经理，和部门编号编号为20中所有销售员的详细资料
select * from emp 
where (deptno=10 and job='经理')
or (deptno=20 and job='销售员');

-- 查询部门编号为10中所有经理，和部门编号编号为20中所有销售员，
-- 还有既不是经理又不是销售员但工资大于等于20000的所有员工详细资料
select * from emp 
where (deptno=10 and job='经理')
or (deptno=20 and job='销售员')
or (job not in ('经理', '销售员') and sal >= 2000);

-- 无奖金或奖金低于1000的员工
select * from emp where comm is null or comm < 1000;

-- 查询名字由3个字组成的员工(3个下划线)
select * from emp where ename like '___';

-- 查询2000年入职的员工
select * from emp where hiredate like '2000-%';

-- 查询所有员工，用编号升序排序
select * from emp order by empno asc;

-- 查询所有员工详细信息，用工资降序排序，如果工资相同使用入职日期升序排序
select * from emp order by sal desc, hiredate asc;

-- 查询每个部门的平均工资
select deptno, avg(sal) from emp group by deptno;

-- 查询每个部门雇员数量
select deptno, count(*) from emp group by deptno;

-- 查询每种工作的最高工资，最低工资，人数
select job, max(sal), min(sal), count(*) from emp group by job;
```

## 课时2 2.mysql编码问题
```sql
-- 查看MySQL的数据库编码
show variables like 'char%';

-- 临时设置变量
set character_set_client=utf8
set character_set_results=utf8
```

永久设置:
my.ini中配置

## 课时3 3.mysql备份与恢复数据库

1、备份：数据库->SQL语句
```shell
$ mysqldump -u用户名 -p密码 数据库名 > 要生成的SQL脚本路径
```

2、恢复：SQL语句->数据库
```shell
$ mysql -u用户名 -p密码 数据库名 < 要生成的SQL脚本路径

# 或者
> source 要生成的SQL脚本路径
```

## 课时4 4.约束之主键约束
特点：唯一，非空，被引用

指定id列为主键列
```sql
-- 1、创建表时指定主键
create table stu(
    id int primary key,
    name varchar(20)
)

-- 或者
create table stu(
    id int,
    name varchar(20),
    primary key(id)
)

-- 2、已存在表添加主键
alter table stu add primary key(id);

-- 3、删除主键
alter table stu drop primary key;
```

## 课时5 5.主键自增长
保证插入数据时主键唯一非空
```sql
-- 1、创建表时指定主键自增长
create table stu(
    id int primary key auto_increment,
    name varchar(20)
)

-- 设置字段自增长
alter table stu change id id int auto_increment;

-- 删除自增长
alter table stu change id id int;
```
uuid作为主键

## 课时6 6.非空和唯一约束
非空约束：不能为null
not null

唯一约束:不能重复
unique

```sql
create table stu(
    id int primary key auto_increment,
    name varchar(20) not null unique 
)
```

## 课时7 7.概述模型、对象模型、关系模型
1、对象模型
is a  继承
has a 关联 1对1 1对多 多对多
use a 

2、关系模型
数据库中的表

代码实现
```java
// 一对一关系 丈夫-妻子
class  Husband{
    private Wife wife;
}

class Wife{
    private Husband husband;
}

// 一对多关系 部门-员工
class Employee{
    private Department department;
}

class Department{
    private List<Employee> employee;
}

// 多对多关系 老师-学生
class Student{
    private List<Teacher> teachers
}

class Teacher{
    private List<Student> students
}
```

外键约束
外键引用主键，必须引用另一张表主键
外键可以重复
外键可以为空
一张表中可以有多个外键

## 课时8 8.外键约束
```sql
create table dept(
    deptno int primary key auto_increment,
    dname varchar(50)
)

insert into dept values(10, '人力部');
insert into dept values(20, '研发部');
insert into dept values(30, '财务部');

-- 创建表时添加外键约束
create table emp(
    empno int primary key auto_increment,
    ename varchar(50),
    dno int,
    constraint fk_emp_dept foreign key(dno) references dept(deptno)
)

-- 添加外键约束
alter table emp add constraint fk_emp_dept foreign key(dno) references dept(deptno)

insert into emp(ename) values('张三');
insert into emp(ename, dno) values('李四', 10);
insert into emp(ename, dno) values('王五', 20);
```

## 课时9 9.一对一关系
从表的主键就是外键
```sql
create table husband(
    hid int primary key auto_increment,
    hname varchar(50)
)

insert into husband(hname) values ('刘备'), ('关羽'), ('张飞')

create table wife(
    wid int primary key auto_increment,
    wname varchar(50),
    constraint fk_wife_husband foreign key(wid) references husband(hid)
)
-- wid 非空，唯一，引用hid

insert into wife(wid, wname) values(1, '杨贵妃');
insert into wife(wid, wname) values(2, '西施');

```

## 课时10 10.多对多关系
```sql
create table student(
    sid int primary key auto_increment,
    sname varchar(50)
)

create table teacher(
    tid int primary key auto_increment,
    tname varchar(50)
)

create table stu_tea(
    sid int,
    tid int,
    constraint fk_student foreign key(sid) references student(sid),
    constraint fk_teacher foreign key(tid) references teacher(tid)
)

insert into student(sname) values('段誉');
insert into student(sname) values('乔峰');
insert into student(sname) values('虚竹');

insert into teacher(tname) values('黄老师');
insert into teacher(tname) values('刘老师');
insert into teacher(tname) values('李老师');

insert into stu_tea(sid, tid) values(1, 1);
insert into stu_tea(sid, tid) values(2, 1);
insert into stu_tea(sid, tid) values(3, 1);

insert into stu_tea(sid, tid) values(1, 2);
insert into stu_tea(sid, tid) values(3, 2);

insert into stu_tea(sid, tid) values(1, 3);
insert into stu_tea(sid, tid) values(2, 3);
```

## 课时11 11.合并结果集
要合并的结果集表结构一样(列数, 列类型)
```sql
create table tb_a(id int, a_name varchar(50));
insert into tb_a(id, a_name) values(1, '1');
insert into tb_a(id, a_name) values(2, '2');
insert into tb_a(id, a_name) values(3, '3');

create table tb_b(id int, b_name varchar(50));
insert into tb_b(id, b_name) values(3, '3');
insert into tb_b(id, b_name) values(4, '4');
insert into tb_b(id, b_name) values(5, '5');

-- 不合并重复行
select * from tb_a union all select * from tb_b;

-- 合并重复行
select * from tb_a union select * from tb_b;
```

## 课时12 12.连接查询之内连接（方言）
```sql
-- 方言
select * from 表1 别名1, 表2 别名2 where 别名1.xx = 别名2.xx;

-- 标准 (推荐)
select * from 表1 别名1 inner join 表2 别名2 on 别名1.xx = 别名2.xx;

-- 自然
select * from 表1 别名1 natural join 表2 别名2
```

笛卡尔积:
```
(a, b, c) X (1, 2)

-> 
a1, a2, b1, b2, c1, c2
```

```sql
-- 笛卡尔积
select * from emp, dept

-- 员工对应部门信息
select * from emp, dept where emp.dno=dept.deptno;

-- 打印所有员工的姓名，部门名称, 取别名
select e.ename, d.dname
from emp e, dept d
where e.dno=d.deptno;
```

## 课时13 13.连接查询之内连接（标签和自然）
```sql
-- 标准推荐
select * from emp inner join dept on emp.dno=dept.deptno;

-- 自动加where条件
select * from emp natural join dept
```

## 课时14 14.连接查询之外连接
主表中所有记录都会打印, 副表没有null补位
```sql
-- 左外连接, 左表为主
select e.ename, ifnull(d.dname, '无部门') as dname
from emp e left outer join dept d
on e.dno=d.deptno;

-- 右外连接, 右表为主
select e.ename, d.dname
from emp e right outer join dept d
on e.dno=d.deptno;

-- 全外连接
select e.ename, d.dname
from emp e left outer join dept d
on e.dno=d.deptno;
union
select e.ename, d.dname
from emp e right outer join dept d
on e.dno=d.deptno;
```

## 课时15 15.子查询
查询中有查询
```sql
-- 查询本公司工资最高的员工详细信息
select * from emp where sal=(select max(sal) from emp);
```
子查询出现的位置
```
from 后作为表存在(多行多列)
where 后作为条件存在
```
条件
```sql
-- 单行单列 
select * from 表1 别名1 where 列1[=, >, <, >=, <=, !=]
(select 列 from 表2 别名2 where 条件)

-- 多行单列
select * from 表1 别名1 where 列1[in, all, any]
(select 列 from 表2 别名2 where 条件)

-- 单行多列（一个对象）
select * from 表1 别名1 where (列1, 列2) in
(select 列1, 列2 from 表2 别名2 where 条件)

-- 多行多列
select * from 表1 别名1, 
(select ...) 别名2 where 条件
```
eg:
```sql
-- 工资高于平均工资的员工
select * from emp where sal > (select avg(sal) from emp);

-- 大于30部门所有人的工资的员工
select * from emp where sal > all(select sal from emp where deptno=30);

-- 和李白岗位部门都相同的员工
select * from emp where (job, deptno) in (select jobm, deptno from emp where ename ='李白');
```

## 课时16 16.多表查询练习第1题
查询至少有一个员工的部门，显示部门编号，部门名称，部门位置，部门人数
```sql
-- 部门编号，部门名称，部门位置
select * from dept;

-- 部门人数
select deptno, count(*) from emp group by deptno

-- 整合
select d.* e1.cnt from dept d inner join 
(select deptno, count(*) cnt from emp group by deptno) as e1
on d.deptno=e1.deptno
```

## 课时17 17.多表查询练习第2题
列出所有员工的姓名及其直接上级的姓名
```sql
select e.ename, m.ename
from emp e left outer join emp m
on e.mgr=m.empno;
```

## 课时18 18.多表查询练习第4题
列出受雇日期早于直接上级的所有员工编号，姓名，部门名称
```sql
-- 1、先查询员工
select e.empno, e.ename, e.deptno
from emp e, emp m
where e.mgr=m.empno and e.hiredate<m.hiredate

-- 2、查询部门名称
select e.empno, e.ename, d.dname
from emp e, emp m, dept d
where e.mgr=m.empno 
and e.hiredate<m.hiredate 
and e.deptno=d.deptno
```

## 课时19 19.多表查询练习第5题
列出部门名称和这些部门的员工信息，同时列出哪些没有员工的部门
```sql
select *
from emp e right outer join dept d
on e.deptno=d.deptno;
```

## 课时20 20.多表查询练习第7题
列出最低薪金大于15000的各种工作及从事此工作的员工人数
```sql
select job, count(*)
from emp e
group by job
having min(sal) > 15000
```

## 课时21 21.多表查询练习第8题
列出在销售部工作的员工姓名，假定不知道销售部的部门编号
```sql
select ename
from emp e
where e.deptno = (select deptno from dept where dname='销售部')
```

## 课时22 22.多表查询练习第9题
列出薪金高于公司平均薪金的所有员工信息，所在部门名称，上级领导，工资等级
```sql
-- 薪金高于公司平均薪金的所有员工信息
select * from emp where e.sal>(select avg(sal) from emp)

select e.*, d.dname, m.ename, s.grade 
from 
    emp e left outer join dept d on e.deptno=d.deptno
          left outer join emp m on e.mgr=m.empno
          left outer join salgrade s on e.sal between s.losal and s.hisal
where e.sal>(select avg(sal) from emp)
```

## 课时23 23.多表查询练习第10题
列出与庞统从事相同工作的所有员工及部门名称
```sql
select e.*, d.dname
from emp e left outer join dept d
on e.deptno=d.deptno
where e.job=(select job from emp where ename='庞统')

```

## 课时24 24.多表查询练习第11题
列出薪金高于部门30工作的所有员工的薪金的员工姓名和薪金，部门名称
```sql
select e.ename, e.sal, d.dname
from ename e left outer join deptno d
on e.deptno=d.deptno
where e.sal>(select max(sal) from emp where deptno=30)

```

## 课时25 24.多表查询练习第13题
查出年份，利润，年度增长比
```sql
select * from tb_year
year  zz
2000  100
2001  150
2002  250
2003  300

select y1.* ifnull(concat((y1.zz-y2.zz)/y2.zz * 100, '%'), '0%') 增长比
from tb_year y1 left outer join tb_year y2
on y1.year=y2.year+1
```
