# 概述
DHFS
    -hadoop分布式文件系统  
    -PB，TB
    -高冗余，高容错
    

Hadoop 1.x
    -MapReduce
    -HDSF
        -NameNode & Secondary NameNode（备份元数据） & JobTracker
        -DataNode 每块64M & TaskTracker

Hadoop 2.x
    -MapReduce Others
    -YARN ResourceManager + NodeManager (减少资源消耗，运行Spark，Storm)
    -HDFS
        -NameNode
        -DataNode

# MapReduce过程
海量数据（TB） -> MapReduce -> 目标数据

四个阶段
    -Split
    -Map（编码）Combine
    -Shuffle
    -partition -> Reduce(编码) -> 输出文件 三者相等


HDSF适合存放大文件
小文件可以压缩存储

一般情况 一个节点10-100个任务

mapred.reduce.tasks

# Hadoop分布式缓存



