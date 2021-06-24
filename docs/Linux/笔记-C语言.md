C语言 

## 简介

C语言的标准：ANSI C

C语言的特点：

- 简单
- 快速
- 高性能
- 兼容性好
- 功能强大
- 易于学习

C语言的应用：
1、Linux嵌入式（小工具）（C语言小巧灵活、语法简单、适合做小工具）
linux/unix系统就是由各种各样的小工具集成得来的。

2、和硬件打交道的程序
a、操作系统：苹果系统，安卓系统，windoows
b、ARM嵌入式、单片机、Arduino

3、有高性能要求的应用程序
著名的WEB服务器，NGINX=apache\*10

## 环境

- centos [https://www.centos.org/](https://www.centos.org/)
- ubuntu [https://ubuntu.com/](https://ubuntu.com/)

## 常用指令

```bash
# ubuntu 安装vim编辑器
$ apt-get update
$ apt-get install vim

# 编译器
$ cc -v
$ gcc -v
```

VIM命令模式
```
i    （插入模式 或 当前光标前插入字符）
Esc     （返回命令行模式）
:w    （保存）
a    （当前光标后插入字符）
:q     （退出VIM）
Shitf + a   （在行尾插入字符）
Shift + i   （在行手插入字符）
o      （下一行插入字符）
Shift + o   （在当前行上行插入字符）
x     （删除单个字符）
dd    （删除整行字符）
```

## C程序

hello.c

```c
#include <stdio.h>

int main(){
    printf("hello world\n");
    return 0;
}
```

编译执行
```bash
# 编译
$ cc hello.c 
# 或者
$ gcc hello.c

# 执行
$ ./a.out
```

## 代码分布在多个源文件

1、放在一个文件

hello.c
```c
#include <stdio.h>  // 系统目录中查找

int max(int a, int b){
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

int main(){
    int a = 1;
    int b = 2;
    int ret = max(a, b);
    printf("max value is %d\n", ret);
    // max value is 2
    return 0;
}
```

编译执行 执行输出文件，默认是`a.out`

```bash
$ gcc hello.c -o hello.out

$ ./hello.out
```

2、放在多个文件

hello.c
```c
#include <stdio.h>  // 系统目录中查找

int main(){
    int a = 1;
    int b = 2;
    int ret = max(a, b);
    printf("max value is %d\n", ret);
    // max value is 2
    return 0;
}
```

max.c
```c
int max(int a, int b){
    if (a > b) {
        return a;
    } else {
        return b;
    }
}
```

多文件编译执行

```bash
$ gcc max.c hello.c -o hello.out

$ ./hello.out
```
此时会有警告


3、声明引用

hello.c

```c
#include <stdio.h>  // 系统目录中查找
#include "max.c"    // 相对目录中查找

int main(){
    int a = 1;
    int b = 2;
    int ret = max(a, b);
    printf("max value is %d\n", ret);
    // max value is 2
    return 0;
}
```

编译执行

```bash
$ gcc hello.c -o hello.out

$ ./hello.out
```

## 头文件与函数定义分离

1、两个文件分别编译

gcc参数:

```
-c compile 只编译源文件但不链接 *.o
-o out 指定输出文件名 默认a.out
```

分开编译需要注释include

```c
#include <stdio.h>  // 系统目录中查找
// #include "max.c"    // 相对目录中查找

int main(){
    int a = 1;
    int b = 3;
    int ret = max(a, b);
    printf("max value is %d\n", ret);
    // max value is 2
    return 0;
}
```

编译源文件
```bash
# 先编译max.c文件
$ gcc -c max.c -o max.o

# 再编译hello.c文件
$ gcc max.o hello.c
```

2、三个文件分别编译

min.c
```c
int min(int a, int b){
    if (a > b) {
        return a;
    } else {
        return b;
    }
}
```

hello.c
```c
#include <stdio.h>

int main(){
    int a = 1;
    int b = 3;
    
    int maxValue = max(a, b);
    printf("max value is %d\n", maxValue);

    int minValue = min(a, b);
    printf("min value is %d\n", minValue);
    
    return 0;
}
```

```bash
# 编译min.c
$ gcc -c min.c

# 编译hello.c
$ gcc min.o max.o hello.c -o hello.out
```

3、引入头文件

min.h
```c
int min(int a, int b);
```

max.h
```c
int max(int a, int b);
```

hello.c
```c
#include <stdio.h>  // 系统目录中查找
#include "min.h"    // 引入头文件
#include "max.h"    

int main(){
    int a = 1;
    int b = 3;
    
    int maxValue = max(a, b);
    printf("max value is %d\n", maxValue);

    int minValue = min(a, b);
    printf("min value is %d\n", minValue);
    
    return 0;
}
```

编译执行
```bash
$ gcc min.o max.o hello.c -o hello.out

$ ./hello.out
```

## Makefile

```bash
# 删除所有.o结尾的文件
$ rm *.o
```

make工具可以将大型的开发项目分成若干个模块

make内部使用了gcc

```bash
$ apt-get install make

$ make -v
```

Makefile 使用<tab>缩进
```bash
# 注释
hello.out:max.o min.o hello.c
    gcc max.o min.o hello.c -o hello.out
max.o:max.c
    gcc -c max.c
min.o:min.c
    gcc -c min.c
```

执行编译
```bash
$ make
```

## main函数中的return

main.c
```c
# include <stdio.h>

int main(int argv, char* argc[]){
    printf("hello world\n");
    return 0;
}
```

查看程序返回

```bash
# 编译并执行程序
gcc main.c -o main.out && ./main.out

# 查看程序运行结果
$ echo $?
```

## main函数中的参数

main.c
```c
# include <stdio.h>

int main(int argv, char* argc[]){
    for(int i=0; i < argv; i++){
        printf("argc[%d]=%s\n", i, argc[i]);
    }
    return 0;
}
```

```bash
$ ./main.out name age
argc[0]=./main.out
argc[1]=name
argc[2]=age
```

argv 参数的个数
argc 参数的内容


## 标准输入流输出流以及错误流

```c
# include <stdio.h>

int main(){
    // 接收输入
    int a;
    scanf("%d", &a);

    // 输出数据
    printf("input value is %d\n", a);
    return 0;
}
```

```
stdin  标准输入 eg: 键盘输入
stdout 标准输出 eg: 终端输出
stderr 标准错误 eg: 错误输出
```

```c
# include <stdio.h>

int main(){
    // printf("please input a value\n");
    fprintf(stdout, "please input a value\n");

    int a;
    // scanf("%d", &a);
    fscanf(stdin, "%d", &a);

    if(a < 0){
        fprintf(stderr, "the value must > 0\n");
        return 1;
    } else{
        return 0;
    }
}

```

## 标准输入输出流以及错误流重定向

加法计算器小程序

接收两个输入，计算两个数字的和，并输出

```c
#include <stdio.h>

int main(){
    int a; 
    int b;
    
    printf("input a:\n");
    scanf("%d", &a);

    printf("input b:\n");
    scanf("%d", &b);

    int ret = a + b;
    printf("a + b = %d\n", ret);
    return 0;
}
```


1、输出流重定向

```bash
# 追加
$ ./mian.out 1>> a.txt 

# 或者
$ ./mian.out >> a.txt 

# 覆盖
$ ./mian.out > a.txt  
```

输出结果 a.txt
```
input a:
input b:
a + b = 8

```

2、输入流重定向

输入文件 input.txt
```
3
4
```

```bash
$ ./main.out < input.txt
input a:
input b:
a + b = 7
```

3、错误流重定向

```c
#include <stdio.h>

int main(){
    int a;
    printf("input value:\n");
    scanf("%d", &a);

    if( a > 0){
        printf("value %d > 0\n", a);
        return 0;
    } else{
        fprintf(stderr, "value %d < 0\n", a);
        return 1;
    }
}
```

```bash
$ ./main.out 1>stdout.txt 2>stderr.txt
```

4、同时操作标准输入、标准输出、错误流
stdin.txt
```
-10
```

执行程序

```bash
$ ./main.out 1>stdout.txt 2>stderr.txt < stdin.txt
```

stdout.txt
```
input value:

```

stderr.txt
```
value -10 < 0:

```


## 管道原理及应用

前一个命令的输出，作为后一个命令的输入

```bash
# 查看当前目录下文件
ls

# 查看根目录下文件
ls / 

# 查看/etc目录下文件
ls /etc

# 在/etc目录下查找包含ab字符的文件名
ls /etc | grep ab

# 查询进程
ps -e | grep ssh
```

sum.c
```c
#include <stdio.h>

/**
对输入求和，并输出求和结果和输入个数
格式：sum:count
eg: 400,2
*/
int main(){
    int sum = 0;
    int count = 0;
    int var;

    while(1){
        scanf("%d", &var);
        if(var == 0){
            break;
        } else{
            sum += var;
            count++;
        }
    }
    printf("%d,%d\n", sum, count);
    return 0;
}
```

avg.c
```c
#include <stdio.h>
/**
对输入计算平均值
格式：sum,count
eg: 500,2
输出：250.000
*/
int main(){
    int sum;
    int count;
    
    scanf("%d,%d", &sum, &count);

    float avg = sum / count;
    printf("%f\n", avg);

    return 0;
}
```

input.txt
```
500
400
600
0
```

```bash
# 编译
$ gcc sum.c -o sum.out
$ gcc avg.c -o avg.out

# 通过重定向输入和管道处理，先求和再计算平均值
$ ./sum.out < input.txt | ./avg.out
500.000000
```







