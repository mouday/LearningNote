# Shell

## 运行
1、作为可执行程序
```bash
#!/bin/bash           # 指定解释此脚本文件的程序

$ chmod a+x test.sh   # 使脚本具有执行权限
$ ./text.sh           # 执行脚本

./test.sh             # 在当前目录找
test.sh               # 去 PATH 里寻找
```

2、作为解释器参数
```bash
$ bash test.sh
```

## 变量

```shell
key="value"     # 定义变量， 变量名和等号之间不能有空格
readonly key    # 只读变量, 再次赋值会报错

echo $key     # 使用变量， 使用变量要在变量名前面加美元符号
echo ${key}   # 识别变量的边界

unset key     # 删除变量
```

变量类型
1) 局部变量 
2) 环境变量 
3) shell变量

## 字符串
字符串可以用单引号，也可以用双引号，也可以不用引号

单引号：原样字符串，不可以有变量和转义字符
双引号：可以有变量和转义字符

字符串拼接
```bash
name="Tom"

echo "hi "$name"!"  # hi Tom!
echo "hi ${name}!"  # hi Tom!
echo 'hi ${name}!'  # hi ${name}!
```

```bash
echo ${#name}      # 字符长度 3
echo ${name:1:4}   # 字符串截取 om 
```

## 数组
Bash Shell只支持一维数组, 下标由0开始
```bash
# 定义数组， "空格"分割
names=("Tom" "Jack")

ages=(
23
24
)

# 数组元素赋值
names[2]="Jimi"

# 获取数组元素
echo ${names[2]}  # Jimi

# 获取数组所有元素
echo ${ages[@]}   # 23 24
echo ${ages[*]}   # 23 24

# 获取数组的长度
echo ${#names[@]}  # 3
```

## 注释
```bash
# 单行注释

:<<EOF
多行注释
再写一行
EOF
```

## 传递参数
```bash
# $ ./1.sh 1 2 3 4

echo $#  # 参数个数 4
echo $*  # 显示所有参数 1 2 3 4
echo $@  # 显示所有参数 1 2 3 4

echo $0  # 文件名 ./1.sh
echo $1  # 第一个参数 1
echo $2  # 第二个参数 2
```

## 基本运算符
1、算术运算符
原生bash不支持数学运算，使用expr
```bash
+   加法      `expr $a + $b`  
-   减法      `expr $a - $b`
*   乘法      `expr $a \* $b`
/   除法      `expr $b / $a`
%   取余      `expr $b % $a`
=   赋值      a=$b
==  相等      [ $a == $b ]  注意空格
!=  不相等     [ $a != $b ] 

# 注意是反引号`, 需要空格
# MAC表达式  $(expr 1 + 1)  
```

2、关系运算符
关系运算符只支持数字
```bash
-eq     相等equal             [ $a -eq $b ]
-ne     不相等not equal       [ $a -ne $b ]
-gt     大于greater than      [ $a -gt $b ] 
-lt     小于lower than        [ $a -lt $b ]
-ge     大于等于greater&equal  [ $a -ge $b ] 
-le     小于等于lower&equal    [ $a -le $b ]
```

3、布尔运算符
```bash
!   非   [ ! false ]
-o  或   [ $a -lt 20 -o $b -gt 100 ]
-a  与   [ $a -lt 20 -a $b -gt 100 ]
```

4、逻辑运算符
```bash
&&  AND [[ $a -lt 100 && $b -gt 100 ]]
||  OR  [[ $a -lt 100 || $b -gt 100 ]]

# [[ 防止脚本中的逻辑错误
```

5、字符串运算符
```bash
=   相等  [ $a = $b ]
!=  不相等 [ $a != $b ]
-z  长度为0 [ -z $a ]
-n  长度为0    [ -n "$a" ]
$   不为空   [ $a ] 
```

6、文件测试运算符
```shell
-b file 设备文件                   [ -b $file ]
-c file 字符设备文件               [ -c $file ]
-d file 目录                      [ -d $file ]
-f file 普通文件                   [ -f $file ]
-r file 可读                      [ -r $file ]
-w file 可写                      [ -w $file ]
-x file 可执行                     [ -x $file ]
-s file 文件不为空（文件大小大于0）    [ -s $file ]
-e file 存在                       [ -e $file ]
```

综合示例
```bash
#!/bin/bash

# 算术计算
echo `expr 1 + 1`  # 注意空格 2

# 数字比较
a=1; b=2

if [ $a == $b ]
then
    echo "a==b"
else
    echo "a!=b"
fi

# 关系比较
if [ $a -eq $b ]
then
    echo "a==b"
else
    echo "a!=b"
fi

# 布尔运算
if [ $a -eq $b -o $a -gt $b ]
then
    echo "a==b or a>b"
else
    echo "a!=b and a<b"
fi

# 逻辑运算
if [[ $a -eq $b || $a -gt $b ]]
then
    echo "a==b or a>b"
else
    echo "a!=b and a<b"
fi

# 字符串运算符
if [ $a ]
then 
    echo "a不为空"
else
    echo "a为空"
fi

# 文件
if [ -f "1.sh" ]
then
    echo "是文件"
else
    echo "不是文件"
fi
```

## echo
```shell
echo "hello world"            # 普通字符串, 自动添加换行符
echo hello world              # 双引号可以省略
echo "\"hello world\""        # 显示转义字符  "hello world"
echo -e "hello\n world"       # -e开启转义 \n换行
echo -e "hello world \c"      # -e开启转义 \c不换行
echo `date`                   # 显示命令结果 Thu Jul 4 12:44:11 CST 2019

name="Tom"
echo ${name}                  # 输出变量

echo "hi" > file.txt          # 结果重定向
```

示例：读取输入并输出
```shell
#!/bin/bash

read -p "请输出用户名：" content   # -p提示文字
read -p "请输出密码：" -s password  # -s 隐藏输入内容
echo -e "\n用户名: ${content}\n密码: ${password}"

:<<EOF
$ ./1.sh
请输出用户名：Tom
请输出密码：
用户名: Tom
密码: 123
EOF
```

## printf 命令

示例
```shell
printf "%-10s |%10.4f\n" "小明" 2.3 # 不会自动添加换行符
# -表示左对齐，没有则表示右对齐
# 10个字符宽的字符内
# 保留4位小数
```
格式化
```shell
d: Decimal 十进制整数
s: String 字符串
c: Char 字符
f: Float 浮点
```

转义字符
```bash
\c  不显示换行字符
\n  换行
\r  回车（Carriage return）
\t  水平制表符
\v  垂直制表符
\\  一个字面上的反斜杠字符
```

## test测试
```shell
# 算数运算
echo $[1+1]  # 2

# 比较
a=1
b=1

if test $a -eq $b
then
    echo "a==b"
else
    echo "a!=b"
fi
# a==b
```

## 流程控制
if
```shell
if condition1
then
    command1
elif condition2 
then 
    command2
else
    commandN
fi

```

for
```shell
for var in item1 item2 ... itemN
do
    command1
    command2
    ...
    commandN
done
```

while
```shell
while condition
do
    command
done
```

until 
```shell
until condition
do
    command
done
```

case
```shell
case 值 in
模式1)    # 右圆括号分支
    command1
    ;;   # 两个分号表示break
模式2）
    command2
    ;;
*)
    command3
    ;;
esac
```

跳出循环
break和continue

综合示例
```shell
read -p "输入start 或者 stop: " user_command 

case $user_command in
"start")
    echo "start..."
    ;;
"stop")
    echo "stop..."
    ;;
*)
    echo "输入不对啊"
    ;;
esac
```

## 函数
```shell
# 定义函数，function可以加也可以省略， 不带任何参数
function func(){
    echo "第一个参数 $1"  # $1获取第一个参数
    echo "参数个数 $#"    # $#获取参数个数
    echo "所有参数 $@"    # $@获取所有参数
    return 0  # 函数返回值(0-255)
}

# 调用函数，不加括号
func hi 你好
# 第一个参数 hi
# 参数个数 2
# 所有参数 hi 你好

echo $?   # 显示最后命令的退出状态
# 0
```

## 输入/输出重定向
文件描述符 
0 通常是标准输入（STDIN）
1 是标准输出（STDOUT）
2 是标准错误输出（STDERR）

```shell
command1 > file1          # 输出重定向
command1 >> file1         # 追加输出重定向
command 2 > file          # stderr重定向
command > file 2>&1       # 合并stdout和stderr
command1 < file1          # 输入重定向
command > /dev/null 2>&1  # 屏蔽输出
```

示例
```shell
$ echo -e 'hello world\nhi china' > text.txt

$ cat text.txt
hello world
hi china

$ wc -l < text.txt
       2
```

## 文件包含
1.sh
```shell
#!/bin/bash

function func(){
    echo "hi"
    return 0
}

```

2.sh
```shell
#!/bin/bash

# . ./1.sh  # 使用.引入文件， 注意空格

source ./1.sh  # 使用source引入文件

func
```



> 参考
>
> [Shell 教程-菜鸟教程](<https://www.runoob.com/linux/linux-shell.html>)