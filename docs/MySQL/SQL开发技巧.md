SQL开发技巧

结构化查询语言 Structured Query Language

SQL分类

DDL：数据定义语言  Data Definition Language
    - CREATE、ALTER、DROP、TRUNCATE 
TPL：事务处理语言 
    - COMMIT、ROLLBACK、SAVEPOINT、SET TRANSACTION
DCL：数据控制语言 
    - GRANT、REVOKE
DML：数据操作语言 
    - SELECT、UPDATE、INSERT、DELETE


正确使用SQL很重要吗？

※ 增加数据库处理效率，减少应用相应时间
※ 减少数据库服务器负载，增加服务器稳定性
※ 减少服务器间通讯的网络流量


join类型

内连接 inner join   交集
全外连接 full outer join  
左外连接 left outer join 
右外连接 right outer join
交叉连接 cross join

优化查询

更新表自身

1、更新字段的内容

update user1 
set over='齐天大圣' 
where user1.username in(
select a.username 
from user1 a inner join user2 b 
on a.username=b.username);

报错：要更新的表不能出现在from从句中

2、解决方法

update user1 a join (
select a.username 
from user1 a inner join user2 b 
on a.username=b.username) c 
on a.username = c.username 
set a.over ='齐天大圣'


join优化子查询技巧：
一般子查询写法：(数据小时，没有多大影响，如果数据量大时，则要消耗大量的查询)
select a.user_name , a.over , (select over from user2 where a.user_name = b,user_name) as over2
from user1 a;
如果这两张表的记录相当多 那么这个子查询相当于对A标的每一条记录都要进行一次子查询。

join优化（左连接）后的写法：
select a.user_name , a.over , b.over from user1 a
left join user2 b on a.user_name = b.user_name



@MySQL---JOIN优化聚合子查询
1.一般写法，未能解决

SELECT g.user_name,MAX(k.kills),k.time 
FROM `group` AS g 
JOIN kills AS k ON g.id=k.user_id 
GROUP BY g.user_name 
ORDER BY g.user_name;
2.使用JOIN优化聚合子查询

SELECT a.user_name,b.timestr,b.kills FROM user1 a
JOIN user_kills b ON a.id = b.user_id 
JOIN user_kills c ON c.user_id = b.user_id
GROUP BY a.user_name,b.timestr,b.kills
HAVING b.kills = MAX(c.kills);

实现分组选择
分类聚合方式查询每一个用户某一个字段数据最大的两条数据：
```
SELECT d.user_name,c.ctimestr,kills 
FROM (
SELECT user_id,timestr,kills,(
SELECT COUNT(*) 
FROM user_kills b 
WHERE b.user_id=a.user_id AND a.kills<=b.kills) AS cnt 
FROM user_kills a 
GROUP BY user_id,timestr,kills) AS c 
JOIN user1 d ON c.user_id=d.id 
WHERE cnt<=2
```


MySQL数据文件存储位置的查看
show global variables like "%datadir%";
