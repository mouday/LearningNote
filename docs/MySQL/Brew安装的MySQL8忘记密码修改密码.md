
## 1、修改my.ini
```bash
# 查看my.ini位置
$ mysqld --help --verbose | more


# 找到这一行，挨个试试，看存不存在
# /etc/my.cnf /etc/mysql/my.cnf /usr/local/etc/my.cnf ~/.my.cnf

$ ls /etc/my.cnf
ls: /etc/my.cnf: No such file or directory

$ ls /etc/mysql/my.cnf
ls: /etc/mysql/my.cnf: No such file or directory

$ ls /usr/local/etc/my.cnf
/usr/local/etc/my.cnf    # 注意这个文件存在了


# 修改配置文件， 添加 skip-grant-tables
$ cat /usr/local/etc/my.cnf
# Default Homebrew MySQL server config
[mysqld]
# Only allow connections from localhost
bind-address = 127.0.0.1
skip-grant-tables   # 添加这一行

```

## 2、修改密码
```shell
# 重启MySQL
$ mysql.server restart

# 进入，遇到密码直接回车
$ mysql -u root -p

# 修改前确认版本号，如果是其他版本可能会有差别
mysql> select version();
8.0.16

mysql> flush privileges;   --刷新

mysql> use mysql;
mysql> alter user'root'@'localhost' IDENTIFIED BY 'aBc@123456'; 
# 注意： mysql8.0以上密码策略限制必须要大小写加数字特殊符号
```

## 3、复原my.ini
将第一步中my.ini加入的skip-grant-tables删除或注释

## 4、重启MySQL登录测试
```shell
$ mysql.server restart

# 此时在登录就需要密码了
$ mysql -u root -p
```

>参考
>[mysql5.7忘记密码修改方法](https://blog.csdn.net/lxw983520/article/details/83547779)
>[MYSQL8.0以上版本正确修改ROOT密码](https://blog.csdn.net/yi247630676/article/details/80352655)
>[brew mysql 添加修改mysql配置](https://blog.csdn.net/mijinhuandu/article/details/49614499)


