如果存在多个匹配location块，则nginx选择具有最长前缀的块

location  ~*^.+$
#请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写

日志文件 /usr/local/var/log/nginx
配置文件 /usr/local/etc/nginx/

配置nginx+php+php-fpm服务器

mysite.conf
```
server {
  listen 8009;
  server_name www.mysite.com;
  root /Users/qmp/www;
  index index.html index.htm index.php;

  location / {
    # 如果带参数,$is_args值为"?"。如果不带参数,则是空字符串
    try_files $uri $uri/ $uri.php$is_args$args;
  }

  location ~ \.php$ {
    try_files $uri = 404;
    include fastcgi.conf;
    fastcgi_pass 127.0.0.1:9999;
  }
}
```
参考：[如何正确配置Nginx + PHP](http://www.php.cn/php-weizijiaocheng-392939.html)