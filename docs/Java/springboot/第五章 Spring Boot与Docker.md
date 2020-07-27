## Docker

Docker 开源的应用容器引擎
支持软件编译成一个镜像

## Docker 核心概念

主机 Host：安装了 Docker 程序的机器
客户端 Client：连接主机进行操作
仓库 Registry：保存打包好的软件镜像
镜像 Images：软件打包好的镜像
容器 Container：镜像启动后的实例，容器是独立运行的一个或一组应用

使用 Docker 的步骤

1. 安装 Docker
2. 找到 Docker 仓库

虚拟机 VirtualBox
设置虚拟机网络

重启网络

```
service network restart
```

查看内核版本

Linux 安装 Docker

```bash
# 查看内核版本
$ uname -r

# 升级软件
$ yum update

# 安装Docker
$ yum install docker

# 启动
$ systemctl start docker

# 停止
$ systemctl start docker

# 设置开机启动
$ systemctl enable docker
```

常用操作

https://hub.docker.com/

```bash
# 搜索docker hub
docker search mysql

# 拉取 默认latest
docker pull 镜像名[:tag]

# 查看本地镜像列表
docker images

# 删除本地镜像
docker rmi image-id

```

容器操作
软件镜像 运行镜像 产生一个镜像

```bash
docker search tomcat

# 运行
docker run --name container-name -d image-name
--name 自定义容器名
-d 后台运行
image-name 指定镜像模板

# 查看运行中的容器 -a所有
docker ps [-a]

# 停止
docker stop container-name/container-id

# 启动
docker start container-name/container-id

# 删除
docker rm container-id

# 端口映射 主机端口映射到容器内部端口
docker run -d -p 6379:6379 --name myredis docker.io/redis
-p 6379:6379

# 容器日志
docker logs container-name/container-id

# 防火墙状态
service firewalld status

# 关闭防火墙
service firewalld stop
```

MySQL

```bash

# 需要指定密码：
MYSQL_ROOT_PASSWORD, MYSQL_ALLOW_EMPTY_PASSWORD and MYSQL_RANDOM_ROOT_PASSWORD

# 启动命令
docker run -p 3306:3306 --name mysql01 -e MYSQL_ROOT_PASSWORD=123456 -d mysql

# 将主机目录挂载到容器目录
-v /my/custom:/etc/mysql/conf.d
```

redis
rabbitmq
elasticsearch
