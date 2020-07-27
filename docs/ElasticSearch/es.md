2.x版本的es string字段

5.x版本的es string字段 被拆分成两种新的数据类型: 
text(分词)用于全文搜索的
keyword（不分词）用于关键词搜索

别名设置
```
#获取所有别名

GET _cat/aliases?v

#获取_index_name模式内所有指定别名为_alias_name模式的index
GET /_index_name/_alias|_aliases/_alias_name
_alias和_aliases的区别为若指定为_aliases在查询时若_index未指定满足要求的别名在返回结果中是否包含但aliasese属性为空, 使用_alias时不包含该index

# 设置别名
PUT /index_name/_alias/alias_name

# 删除别名
DELETE /index_name/_alias/alias_name
```