Nginx通过OpenSSL配置Https及二级虚拟目录

1、创建私钥秘钥和证书
```shell
mkdir -p /usr/local/nginx/conf/ssl/
cd /usr/local/nginx/conf/ssl/

# 创建服务器私钥
openssl genrsa -des3 -out server.key 1024

# 创建签名请求的证书（CSR）
openssl req -new -key server.key -out server.csr

# 标记证书使用上述私钥和CSR
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

2、报错处理：密码错误
```
SSL_CTX_use_PrivateKey_file("/etc/nginx/key/server.key") failed 
(SSL: error:0906406D:PEM routines:PEM_def_callback:problems getting password error:0906A068:PEM routines:PEM_do_header:bad password read error:140B0009:SSL routines:SSL_CTX_use_PrivateKey_file:PEM lib) 
```

```
# 输入一次私钥的密码
openssl rsa -in server.key -out unserver.key 

cp unserver.key server.key

# 重启nginx
```

3、配置Nginx
```
server {
    listen       443 ssl;
    server_name  localhost;

    ssl on;
    ssl_certificate      /usr/local/nginx/conf/ssl/server.crt;
    ssl_certificate_key  /usr/local/nginx/conf/ssl/server.key;
    ssl_session_timeout  5m;
    ssl_ciphers  HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers  on;

    # 这是静态主页
    location / {
        root   /www;
        index  index.html index.htm;

    }
}
```

会出现隐私设置错误，继续访问就可以

>参考：
[nginx配置https](https://jingyan.baidu.com/article/8275fc865886cd46a13cf674.html)


4、Nginx配置二级目录
```
server {
    listen       80;
    server_name  localhost;

    # 这是静态主页
    location / {
        root   /www;
        index  index.html index.htm;

    }

    # 这是二级虚拟目录
    # 注意斜杆/: 
    # 访问 https://localhost/data/ 
    # 代理 http://127.0.0.1:5003/
    location /data/ {
        proxy_pass http://127.0.0.1:5003/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

```

5、报错：nginx:[emerg]unknown directive "ssl"

```shell
# 到解压的nginx目录下
yum -y install openssl openssl-devel

./configure --with-http_ssl_module

# 切记不能make install 会覆盖
make  

# 备份
cp /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.bak

# 拷贝新的文件
cp objs/nginx /usr/local/nginx/sbin/nginx

# 检查重启
nginx -t

nginx -s reload
```

>参考：
[nginx:[emerg]unknown directive "ssl"](https://www.cnblogs.com/valu/p/10527284.html)

>参考：
[Nginx 反向代理 虚拟二级目录](https://blog.csdn.net/qq_34489091/article/details/89331433)


6、js后加?v=版本号 可以起到刷新缓存的作用

例如：
```
https://localhost/static/main.js?v=20191227
```
每次更新的时候修改版本号，通知浏览器获取新的文件
