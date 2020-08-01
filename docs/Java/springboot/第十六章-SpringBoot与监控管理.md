# 第十六章-SpringBoot 与监控管理

## 监管端点测试

spring-boot-starter-actuator 生产环境下的应用监控和管理功能

```
端点名 描述
autoconfig 自动配置信息
auditevents 审计事件
beans Bean 信息
configprops 配置信息
dump 线程状态信息
env 当前环境信息
health 应用健康状况
info 当前应用信息
metrics 应用的各项指标
mappings 应用@RequestMapping 映射路径
shutdown 关闭当前应用（默认关闭）
trace 追踪信息最新的 http 请求
```

application.properties

```bash
management.endpoint.shutdown.enabled=true
management.endpoints.web.exposure.include=shutdown
```

关闭应用

```
$ curl -X POST localhost:8080/actuator/shutdown
```
