# Zookeeper单机模式安装

1、下载解压
https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.5.5/
```
$ wget https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.5.5/apache-zookeeper-3.5.5-bin.tar.gz
$ tar -zxvf apache-zookeeper-3.5.5-bin.tar.gz
```

2、修改配置
```
$ cd apache-zookeeper-3.5.5-bin

$ cp conf/zoo_sample.cfg conf/zoo.cfg

$ cat conf/zoo.cfg |grep -v "^#"
tickTime=2000
initLimit=10
syncLimit=5
dataDir=apache-zookeeper-3.5.5/data
clientPort=2181
```

3、配置环境变量
```
$ vim ~/.bash_profile
export ZOO_HOME=apache-zookeeper-3.5.5-bin
export PATH=$PATH:$ZOO_HOME/bin

$ source ~/.bash_profile
```

4、启动zookeeper服务
```
$ zkServer.sh start

# 查看状态/停止
$ zkServer.sh status/stop
```

5、zookeeper客户端
```
$ zkCli.sh
```

# 基本使用
```bash
ls /               # 查看
create /key value  # 创建
get /key           # 获取
set /key value     # 更新
delete /key        # 删除
```

# Zookeeper集群模式安装
1、下载解压（同单机模式）
2、配置3份文件
只需修改dataDir和clientPort不同即可
```bash
$ touch conf/zoo-{1..3}.cfg

$ cat conf/zoo-1.cfg |grep -v "^#"
tickTime=2000
initLimit=10
syncLimit=5
dataDir=data-1
clientPort=2181

server.1=127.0.0.1:2888:3888
server.2=127.0.0.1:2889:3889
server.3=127.0.0.1:2890:3890

$ cat conf/zoo-2.cfg |grep -v "^#"
tickTime=2000
initLimit=10
syncLimit=5
dataDir=data-2
clientPort=2182

server.1=127.0.0.1:2888:3888
server.2=127.0.0.1:2889:3889
server.3=127.0.0.1:2890:3890

$ cat conf/zoo-3.cfg |grep -v "^#"
tickTime=2000
initLimit=10
syncLimit=5
dataDir=data-3
clientPort=2183

server.1=127.0.0.1:2888:3888
server.2=127.0.0.1:2889:3889
server.3=127.0.0.1:2890:3890
```
重要参数说明
dataDir：Zookeeper 保存数据的目录
clientPort：客户端连接 Zookeeper 服务器的端口
server.A=B：C：D：其中
-A 是一个数字，表示这个是第几号服务器；
-B 是这个服务器的 ip 地址；
-C 这个服务器与集群中的 Leader 服务器交换信息的端口；
-D Leader选举时服务器相互通信的端口

3、标识Server ID
myid和服务器server.id要匹配
```
$ mkdir data-{1..3}
$ echo 1 > data-1/myid
$ echo 2 > data-2/myid
$ echo 3 > data-3/myid
```

4、启动服务
```
zkServer.sh start conf/zoo-1.cfg
zkServer.sh start conf/zoo-2.cfg
zkServer.sh start conf/zoo-3.cfg
```

5、客户端连接服务端
```
zkCli.sh -server 127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183
```

# 报错：
```
Starting zookeeper ... FAILED TO START
```
查看log下面的日志
```
错误: 找不到或无法加载主类 org.apache.zookeeper.server.quorum.QuorumPeerMain

```
查看下载包，发现有两个，要下载大的那个
https://mirrors.tuna.tsinghua.edu.cn/apache/zookeeper/zookeeper-3.5.5/
```
apache-zookeeper-3.5.5-bin.tar.gz 2019-05-20 18:40   10M  # 下载这个包
apache-zookeeper-3.5.5.tar.gz     2019-05-20 18:40  3.1M  
```

>参考
[Zookeeper入门看这篇就够了](https://blog.csdn.net/java_66666/article/details/81015302)
[ZooKeeper入门教程（一）](https://www.jianshu.com/p/1f4c70d7ef40)