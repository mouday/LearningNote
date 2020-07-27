ElasticStack：使用FileBeat、Logstash、Elasticsearch、Kibana收集清洗存储查看分析数据

# 环境：
版本均未5.2.0
https://www.elastic.co/cn/downloads/past-releases

1、filebeat:
https://www.elastic.co/cn/downloads/past-releases/filebeat-5-2-0
2、logstash
https://www.elastic.co/cn/downloads/past-releases/logstash-5-2-0
3、elasticsearch: 
https://www.elastic.co/cn/downloads/past-releases/elasticsearch-5-2-0
4、kibana:
https://www.elastic.co/cn/downloads/past-releases/kibana-5-2-0

# 日志准备
使用python脚本定时生成模拟日志

generator_log.py
```python
# -*- encoding:utf-8 -*-

import time
from chinesename import ChineseName

cn = ChineseName()

while True:
    now = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    message = "{} {}\n".format(now, cn.getName())
    print(message)

    with open("demo.log", "a", encoding="utf-8") as f:
        f.write(message)
        
    time.sleep(3)
```
日志示例（日期 姓名）：
```
2019-06-13 18:01:31 容休
```

# filebeat
1、配置
修改配置文件filebeat.yml 
可以选择直接将数据传入Elasticsearch，也可以传入Logstash处理
```yaml
filebeat.prospectors:
- input_type: log
  paths:
# 配置需要收集的文件地址
    - /var/log/*.log 

#-------------------------- Elasticsearch output ------------------------------
# output.elasticsearch:
  # hosts: ["localhost:9200"]

#----------------------------- Logstash output --------------------------------
output.logstash:
  hosts: ["localhost:5044"]
```

2、启动：
```bash
./filebeat -e -c filebeat.yml -d "publish"
```
>参考:[开始使用Filebeat](https://www.cnblogs.com/cjsblog/p/9445792.html)


# logstash
1、匹配说明
（1）内置匹配
```
%{SYNTAX:SEMANTIC}
```
（2）ruby正则
```
(?<name>pattern)
```
关于Ruby的正则：
Ruby 正则表达式： https://www.runoob.com/ruby/ruby-regular-expressions.html
Ruby 正则匹配测试： https://rubular.com/


2、配置
新建一个文件夹存放自定义匹配模式
```
$ mkdir ./patterns
$ cat ./patterns/datetime.re
DATETIME \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}
```

es-pipeline.conf
```ruby
input {
    beats {
        port => "5044"
    }
}
filter {
    grok {
        patterns_dir => ["./patterns"]
        match => { 
            "message" => "%{DATETIME:logdate} (?<text>(.*))"
        }
        remove_field  => "message"
   }
   date {
        match => ["logdate", "yyyy-MM-dd HH:mm:ss"]
    }
}
output {
    stdout { codec => rubydebug }
    elasticsearch {
        hosts => [ "localhost:9200" ]
    }
}

```
3、启动logstash
```
# 解析配置文件并报告任何错误
./bin/logstash -f es-pipeline.conf --config.test_and_exit

# 启用自动配置加载
./bin/logstash -f es-pipeline.conf --config.reload.automatic

```

# 数据结果

# kibana中查询结果
1、启动
```
$ elasticsearch
$ kibana
```

2、查询
```
GET /logstash-2019.06.13/_search
{
  "sort": [
    {
      "@timestamp": {
        "order": "desc"
      }
    }
  ]
}

# 查询结果
{
  "_index": "logstash-2019.06.13",
  "_type": "log",
  "_id": "AWtQTwv8vaBpxF8s4wUp",
  "_score": null,
  "_source": {
    "@timestamp": "2019-06-13T10:08:02.000Z",
    "offset": 197738,
    "logdate": "2019-06-13 18:08:02",
    "@version": "1",
    "beat": {
      "hostname": "bogon",
      "name": "bogon",
      "version": "5.2.0"
    },
    "input_type": "log",
    "host": "bogon",
    "source": "/Users/qmp/Desktop/log/demo.log",
    "text": "伯镟",
    "type": "log",
    "tags": [
      "beats_input_codec_plain_applied"
    ]
  },
  "sort": [
    1560420482000
  ]
}
```

>参考
>[使用Logstash filter grok过滤日志文件](https://www.jianshu.com/p/d46b911fb83e)
>[Logstash使用grok进行日志过滤](https://www.jianshu.com/p/49ae54a411b8)
>[Logstash介绍](https://www.cnblogs.com/cjsblog/p/9459781.html)
