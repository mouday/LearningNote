ElasticStack

https://www.elastic.co/cn/

# ElasticSearch
下载、解压、启动
http://127.0.0.1:9200

1、参数配置
jvm配置  jmv.options 如果运行有问题-> 256M
log配置  log4j2.properties
es的配置  elasticsearch.yml
-cluster.name   集群名称
-node.name      节点名称
-network.host   网络地址
-http.port      端口
-path.data      数据存储地址
-path.log       日志存储地址

启动时修改参数：
```
bin/elasticsearch -Ehttp.port=19200
```

2、运行模式
以network.host参数为判断标准
Development
Production

3、本地启动集群
```
elasticsearch
elasticsearch -Ehttp.port=8200 -Epath.data=node2
elasticsearch -Ehttp.port=7200 -Epath.data=node3
```

查看集群
http://127.0.0.1:9200/_cat/nodes?v
http://127.0.0.1:9200/_cluster/stats

4、常用术语
Document 文档数据
Index 索引
Type 索引中的数据类型
Field 字段，文档属性
Query DSL 查询语法

5、CURD
```
Create    创建    PUT       /index/type/id(data)
Read      读取    GET       /index/type/id
Update    更新    POST      /index/type/id/_update(doc)
Delete    删除    DELETE    /index/type/id
```

6、查询语法2种
Query String
```
GET /index/type/_search?q=Tom
```
Query DSL
```
GET /index/type/_search
{
    "query": {
        "match": {
            "name": "Tom"
        }
    }
}
```
# Kibana

http://127.0.0.1:5601
1、默认配置
```
server.host         地址
server.port         端口
elasticsearch.url   es地址
```

2、常用功能
Discover    数据搜索查看
Visualize   图表制作
Dashboard   仪表盘
Timelion    时序数据的高级可视化分析
DevTools    开发者工具
Management  配置


# Beats
Filebeat   日志文件
Metricbeat 度量数据
packetbeat 网络数据
Winlogbeat Windows数据
Heartbeat  健康检查

1、Filebeat
```
Input   输入
    -Prospector
        -log/stdin
    -Havester
Filter  处理
    -Input
        -Include_lines
        -exclude_lines
        -exclude_files
    -Output Processors
        -drop_event
        -drop_fields
        -decode_json_fields
        -include_fields
Output  输出
    -ElasticSearch
    -Logstash
    -Kafka
    -Redis
    -Console
    -File
```
Filebeat Module
nginx
apach
mysql
最佳实践参考

```
head -n 2 demo.log|filebeat -e -c nginx.yml
```

2、packetbeat
实时抓取网络包
自动解析应用层协议
ICMP(v4 and v6)
DNS
HTTP
MySQL
Redis

类似Wireshark
```
sudo packetbeat -e -c es.yml -strict.perms=false
```

# Logstash
ETL Extract Transform Load

处理流程
Input
    -file
    -redis
    -beats
    -kafka
Filter
    -grok 基于正则表达式，非结构化作结构化处理
    -mutate 增删改查
    -drop
    -date  时间字符串转为时间戳类型
Output
    -stdout
    -elasticsearch
    -kafka

Grok示例
```
55.3.244.1 GET /index.html 15824 0.043

->
{%IP:client} %{WORD:method} %{URIPATHPARAM:requst} %{NUMBER:bytes} %{NUMBER:duration}

->
{
    "client": "55.3.244.1",
    "method": "GET",
    "requst": "/index.html",
    "bytes": "15824",
    "duration": "0.043"
}
```
测试
```
head -n 2 demo.log | logstash -f conf.yml
```

# 实战
Packetbeat + logstash  收集数据
kibana + elasticsearch 数据分析

方案(不能是同一个集群)
Production Cluster
ElasticSearch  http://127.0.0.1:9200
Kibana http://127.0.0.1:5601

Monitoring Cluster
ElasticSearch  http://127.0.0.1:8200
```
elasticsearch -Ecluster.name=sniff_search -Ehttp.port=8200 -Ehttp.data=sniff
```
Kibana http://127.0.0.1:8601
```
kibana -e http://127.0.0.1:8200 -p 8601
```
