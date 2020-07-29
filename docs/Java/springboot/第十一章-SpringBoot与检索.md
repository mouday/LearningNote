# 第十一章-SpringBoot 与检索

ElasticSearch 分布式搜索服务,底层基于 Lucene

安装 elasticsearch

```
docker search elasticsearch

docker pull elasticsearch

docker images

docker run -e ES_JAVA_OPTS="-Xms256m -Xmx256m" -d -p 9200:9200 -p 9300:9300 --name ES01 elasticsearch
```

http://localhost:9200/

## Elasticsearch 快速入门

文档：https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html

```
ES: 集群-索引-类型-文档-属性
MySQL: ?-数据库-表-记录-列
```

使用 PostMan 发送请求

请求方式

```
POST /{index}/{type}/{id}
```

基本操作

```bash
# 存入文档
PUT /data/employee/1
{
  "name": "Tom",
  "age": 23
}

# 获取文档
GET /data/employee/1

# 检查存在
HEAD /data/employee/4

# 返回状态码
# 存在：200
# 不存在：404

# 删除
DELETE http://localhost:9200/data/employee/3

# 更新文档
PUT /data/employee/1
{
  "name": "Tom",
  "age": 24
}

# 搜索数据
GET /data/employee/_search

# 使用查询字符串
GET /data/employee/_search?q=name:Tom

# 使用查询体
POST /data/employee/_search
{
  "query": {
    "match": {
      "name": "Tom"
    }
  }
}

# 复杂查询
POST /data/employee/_search
{
  "query": {
    "bool": {
      "must": {
        "match": {
          "name": "Tom"
        }
      },
      "filter": {
        "range": {
          "age": {
            "gt": 20
          }
        }
      }
    }
  }
}

# 短语搜索(必须完全匹配)

POST /data/employee/_search
{
  "query": {
    "match_phrase": {
      "name": "Tom Steve"
    }
  }
}


# 高亮结果 会增加em标签
POST /data/employee/_search
{
  "query": {
    "match_phrase": {
      "name": "Tom Steve"
    }
  },
  "highlight": {
    "fields": {
      "name": {}
    }
  }
}

```

## SpringBoot 整合 Jest 操作 ES

依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
</dependency>
```

SpringBoot 支持两种技术和 ES 交互

- Jest 默认不生效 io.searchbox.client.JestClient
- SpringData ElasticSearch 操作 ES
  - Client
  - ElasticsearchTemplate
  - ElasticSearchRepository

1、使用 Jest

Github: https://github.com/searchbox-io/Jest

```xml
<dependency>
    <groupId>io.searchbox</groupId>
    <artifactId>jest</artifactId>
    <version>5.3.4</version>
</dependency>
```

版本适配

```bash
# 拉取
docker pull elasticsearch:7.6.2

# 单节点启动
docker run -d \
-e ES_JAVA_POTS="-Xms256m -Xmx256m" \
-e "discovery.type=single-node" \
-p 9200:9200 \
-p 9300:9300 \
--name ES1 \
elasticsearch:7.6.2

# 查看所有容器
docker ps -a

# 删除
docker rm <容器ID>

# 查看日志
docker logs -f <容器ID>
```

查看数据
http://localhost:9200/data/_search

SpringBoot 操作 elasticsearch

文档：
https://github.com/spring-projects/spring-data-elasticsearch

```java
package com.example.demo.pojo;

import org.springframework.data.elasticsearch.annotations.Document;

@Document(indexName="data")
public class Book {
    private Integer id;
    private String name;
    private String author;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}

```

```java
package com.example.demo.repository;

import com.example.demo.pojo.Book;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface BookRepository extends ElasticsearchRepository<Book, Integer> {
    List<Book> findByNameLike(String name);
}

```

```java
package com.example.demo;


import com.example.demo.pojo.Book;
import com.example.demo.repository.BookRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
public class ElasticSearchTest {
    @Autowired
    public BookRepository bookRepository;


    @Test
    public void testSave(){
        Book book = new Book();
        book.setId(1);
        book.setName("<tom>");
        book.setAuthor("Jack");

        bookRepository.save(book);
    }

    @Test
    public void testQuery01(){
        Optional result= bookRepository.findById(1);
        if(result.isPresent()){
            System.out.println(result.get());
        }
    }

    @Test
    public void testQuery02(){
        List<Book> list =  bookRepository.findByNameLike("To");
        System.out.println(list);
    }

}

```
