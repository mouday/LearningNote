# 启动Linux
5个阶段
- 内核的引导
- 运行 init
- 系统初始化
- 建立终端
- 用户登录系统


实际脚本 /etc/rc.d/init.d/目录 （rc.d: runlevel control directory）
链接文件 /etc/rc.d/rc5.d/

S 开头 以start参数来运行
K 打头 以stop为参数停止, 然后再重新运行
S（start）、K（kill,stop) 或D（disable）

chkconfig
```shell
shutdown  # 关机
reboot    # 重启 = shutdown –r now
halt      # 关闭系统 = shutdown –h now = poweroff
```
# 终端利用ssh登录远程服务器
```bash
yum install ssh  # 安装ssh

service sshd start  # 启动ss

ssh -p 50022 my@127.0.0.1  # 登录远程服务器 p端口
```

# 目录
/etc：系统配置文件
/bin：程序和指令
/tmp：临时文件
/opt：安装额外软件

特殊目录
```shell
~：            # 家目录
-：            # 上一个目录
. or ./：      # 当前目录
.. or ../ ：   # 上一层目录
一个点 . 开始:  # 隐藏目录或文件
```

目录的常用命令

```
ls: 列出目录 
    -a ：全部的文件 
    -d ：仅列出目录本身
    -l ：长数据串列出
cd：切换目录 Change Directory
pwd：显示目前的目录 Print Working Directory
    -P ：显示出确实的路径
mkdir：创建一个新的目录 make directory
    -m ：配置文件的权限
    -p ：递归创建
rmdir：删除一个空的目录
    -p ：递归删除
cp: 复制文件或目录
    -r：递归持续复制
    -p：连同文件的属性
    -i: 覆盖时先询问(常用)
rm: 移除文件或目录
    -f ：force
    -i ：删除前询问(常用)
    -r ：递归删除
mv: 移动文件与目录，或修改文件与目录的名称
    -f ：force 强制
    -i ：询问是否覆盖
    -u ：source 比较新升级 (update)
```

# 文件

常见文件类型
```
d 目录
- 文件
l 链接文档(link file)
```

修改所属
```bash
chown [–R] 属主名 文件名         # 更改文件属主
chown [-R] 属主名：属组名 文件名  # 同时更改文件属组
chgrp [-R] 属组名 文件名         # 更改文件属组
```
-R : 进行递归(recursive)

修改文件属性
chmod [-R] ugo 文件或目录 
r:4 + w:2 + x:1 （read/write/execute）
eg: 
```
$ chmod 770 1.txt
-rwxrwx---
```

chmod u=rwx,g=rx,o=r 文件名
身份 u、g、o、a（user、 group、others、all）
操作 +(加入)、-(除去)、=(设定)
权限 r、w、x
eg: 
```
$ chmod u=rw 1.txt
-rw-rwx---
```


文件内容查看
```
cat  由第一行开始显示文件内容
    -n ：列印出行号
tac  从最后一行开始显示
nl   显示的时候，顺道输出行号！
more 一页一页的显示文件内容
    空白键 (space)：代表向下翻一页；
    Enter         ：代表向下翻『一行』；
    /字串         ：代表在这个显示的内容当中，向下搜寻『字串』这个关键字；
    :f            ：立刻显示出档名以及目前显示的行数；
    q             ：代表立刻离开 more ，不再显示该文件内容。
    b 或 [ctrl]-b ：代表往回翻页，不过这动作只对文件有用，对管线无用。
less 与 more 类似，但是比 more 更好的是，他可以往前翻页！
    空白键    ：向下翻动一页；
    [pagedown]：向下翻动一页；
    [pageup]  ：向上翻动一页；
    /字串     ：向下搜寻『字串』的功能；
    ?字串     ：向上搜寻『字串』的功能；
    n         ：重复前一个搜寻 (与 / 或 ? 有关！)
    N         ：反向的重复前一个搜寻 (与 / 或 ? 有关！)
    q         ：离开 less 这个程序；

head 只看头几行
    -n ：后面接数字，代表显示几行的意思
tail 只看尾巴几行
    -n ：后面接数字，代表显示几行的意思
    -f ：表示持续侦测后面所接的档名，要等到按下[ctrl]-c才会结束tail的侦测
```

Linux 链接
```
$ ln f1 f2     # 硬链接（Hard Link）f1 和f2指向了同一个文件节点
$ ln -s f1 f3  # 符号链接（Symbolic Link） 软链接文件类似于 Windows 的快捷方式


# f3 -> f1  ->  real file
#       f2  ->  real file
```

# 用户账号的管理
```bash
useradd 选项 用户名  # 添加新的用户账号
    -c comment 指定一段注释性描述
    -g 用户组 指定用户所属的用户组
    -G 所属的附加组
userdel 选项 用户名  # 删除帐号
    -r，用户的主目录一起删除

usermod 选项 用户名   # 修改

cat /etc/passwd     # 查看用户
cat /etc/shadow     # 查看密码

passwd 选项 用户名 # 用户口令的管理
    -l 锁定口令，即禁用账号
    -u 口令解锁
    -d 使账号无口令
    -f 强迫用户下次登录时修改口令

newgrp  用户名  # 切换用户组

伪用户不能登录
```

# 用户组的管理
```bash
cat /etc/group  #  查看用户组

groupadd 选项 用户组   # 增加一个新的用户组
groupdel 用户组       # 删除一个已有的用户组
groupmod 选项 用户组   # 修改用户组
    -n新用户组 将用户组的名字改为新名字

```

# 磁盘管理
```bash
df -h [目录或文件名]  # 检查文件系统的磁盘空间占用情况
du -hd 1            # 文件和目录磁盘使用的空间

mount /dev/hdc6 /mnt/hdc6  # 磁盘挂载
umount /dev/hdc6           # 磁盘卸除
```
# yum常用命令
```bash
yum install <package_name>  # 安装软件
yum check-update            # 列出所有可更新
yum update                  # 更新所有软件
yum update <package_name>   # 更新软件
yum list                    # 可安裝的软件
yum remove <package_name>   # 删除软件包
yum search <keyword>        # 查找软件包
```

>参考
>[Linux 教程-菜鸟教程](https://www.runoob.com/linux/linux-tutorial.html)