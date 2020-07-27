
## 安装ftp服务
```bash
# 检查是否安装vsftp
rpm -qa |grep vsftpd  

# 安装vsftpd
yum install vsftpd -y  

# 启动服务
service vsftpd start （启动）
service vsftpd restart （重启）
service vsftpd stop （停止）

# 安装ftp客户端
yum -y install ftp

# 登录测试 用户名：ftp 密码随意输入， 默认允许匿名
ftp localhost 

```

## 配置ftp
取消匿名登录

```
vi /etc/vsftpd/vsftpd.conf

# anonymous_enable=YES
anonymous_enable=NO

```
创建用户
```
groupadd ftpgroups
useradd -d /home/ftp/ftpweb -g ftpgroups ftpweb
passwd ftpweb
usermod -s /sbin/nologin ftpweb   # 不允许用于用户登录
```

使用ftp工具登录, 如果报错
```
ftp连接: 读取目录列表失败
```
修改配置：主动传输


>参考
> [Linux搭建FTP服务器（详情版：限制目录、防火墙设置）](https://www.jianshu.com/p/d7699d2dd2a3)


配置只能访问自身目录
```
vim /etc/vsftpd/vsftpd.conf

chroot_list_enable=YES
# (default follows)
chroot_list_file=/etc/vsftpd/chroot_list #（与conf文件在同一目录下）

#这句可解决"500 OOPS: vsftpd: refusing to run with writable root inside chroot()" 问题
allow_writeable_chroot=YES

# 添加用户
vim /etc/vsftpd.chroot_list
ftpweb
```

>参考
> [ftp限制访问其他目录](https://blog.csdn.net/qq_24142325/article/details/73224828)

修改访问路径
```
local_root=/home/xxx/xxx
```



