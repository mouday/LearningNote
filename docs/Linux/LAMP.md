

## LAMP & LNMP

LAMP = Linux + Apache + MySQL + PHP
LNMP = Linux + Nginx + MySQL + PHP

流行，免费，开源，轻量

Linux VS Windows: 完全免费，稳定高效
MySQL: 关系型数据库
Apache：Web服务器软件
监听端口，接收请求，解析HTTP协议，转发给PHP
Nginx 服务器软件

Apache & Nginx：前景更好，配置轻松，性能更优
Apache： select轮询机制
Nginx： epoll事件监听机制


编译安装
```bash
./configure  # 编译前准备
make         # 编译
make install # 安装
```

安装依赖软件
```bash
yum install -y vim wget gcc gcc++ libxml2-devel
```

## 编译安装php
1、下载
https://www.php.net/downloads.php

```
wget https://www.php.net/distributions/php-7.3.11.tar.gz
tar -zxvf php-7.3.11.tar.gz
cd php-7.3.11
```

2、编译安装
启用支持FPM FastCGI
https://www.php.net/manual/zh/install.fpm.install.php

```bash
./configure --prefix=/usr/local/php7 --enable-fpm
make && make install
```

CGI     公共网关接口，一个协议 fork子进程，处理完释放
FastCGI 语言无关，解释器子进程常驻在内存
FPM     PHP扩展

```bash
$ php -r "phpinfo();"
```

## MySQL
1、下载
https://dev.mysql.com/downloads/mysql/

source code
-> Generic Linux (Architecture Independent), Compressed TAR Archive
```
wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.18.tar.gz
```

2、安装依赖
```bash
yum install -y cmake gcc-c++ ncurses-devel perl-Data-Dumper boost boost-doc boost-devel
```

3、安装
```
cmake \
 -DCMAKE_INSTALL_PREFIX=/usr/local/mysql \
 -DMYSQL_DATADIR=/data/mysql/data \
 -DSYSCONFDIR=/etc \
 -DMYSQL_USER=mysql \
 -DWITH_MYISAM_STORAGE_ENGINE=1 \
 -DWITH_INNOBASE_STORAGE_ENGINE=1 \
 -DWITH_ARCHIVE_STORAGE_ENGINE=1 \
 -DWITH_MEMORY_STORAGE_ENGINE=1 \
 -DWITH_READLINE=1 \
 -DMYSQL_UNIX_ADDR=/var/run/mysql/mysql.sock \
 -DMYSQL_TCP_PORT=3306 \
 -DENABLED_LOCAL_INFILE=1 \
 -DENABLE_DOWNLOADS=1 \
 -DWITH_PARTITION_STORAGE_ENGINE=1 \
 -DEXTRA_CHARSETS=all \
 -DDEFAULT_CHARSET=utf8 \
 -DDEFAULT_COLLATION=utf8_general_ci \
 -DWITH_DEBUG=0 \
 -DMYSQL_MAINTAINER_MODE=0 \
 -DWITH_SSL:STRING=bundled \
 -DWITH_ZLIB:STRING=bundled

make && make install
```

4、启动使用
```
mysqld

mysql
```

## Apache

1、下载
http://httpd.apache.org/

依赖：apr apr-util pcre
```
wget http://mirrors.tuna.tsinghua.edu.cn/apache//httpd/httpd-2.4.41.tar.gz
tar -zxvf  httpd-2.4.41.tar.gz
cd httpd-2.4.41

```

2、编译安装（配置必要的参数略）
```
./configure
make && make install
```

3、启动
```
apachetcl -k start
```
开放80端口sudo
```
firewall-cmd --zone=public --add-port80/tcp --permanent
systemctl restart firewalld.service
```

## Nginx
1、下载
http://nginx.org/en/download.html
```
# 下载
wget  http://nginx.org/download/nginx-1.16.1.tar.gz
tar -zxvf nginx-1.16.1.tar.gz

# 安装 pcre url重写功能
./configure --prefix=/usr/local/nginx --with-pcre=/pcre
make && make install

# 启动
./nginx
```

工作方式
```
请求 <-> Nginx <-> PHP-FPM
```

配置
```
location ~ \.php {
         fastcgi_pass 127.0.0.1:9000;
         fastcgi_index  index.php;
         fastcgi_split_path_info ^(.+?\.php)(/.*)$;
         fastcgi_param PATH_INFO $fastcgi_path_info; 
         fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
         include        fastcgi_params;
    }
```

## 配置php-fpm
php-fpm.conf

```
pm = dynamic 设置动态解析
pm.max_children = 5 最大可以启动多少进程
pm.start_servers = 2 默认启动几个进程
```
## 配置Nginx
nginx.conf

```
worker_processes 1; (启动多少子进程)
```

重启
```
nginx -s reload
```

查看进程
```
ps aux|grep nginx
```