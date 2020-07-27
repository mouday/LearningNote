Vim学习笔记

vim是vi改进版
windows 体验版 gvim

# 基本命令
```
$ vim # normal模式

:q(quit)  # 退出

# 进入编辑insert模式（6种）
i(insert)            # 光标前插入
a(append)            # 光标后插入
o(open a line below) # 行下插入

I insert before line # 行首 
A append after line  # 行尾 
O open a line above  # 行上插入

ESC 回到normal模式
:wq  # 保存退出write quit
```

# vim4种模式
Normal普通模式（浏览）
    Esc插入模式回到普通模式
    普通模式下进行各种命令操作和移动
    大部分情况下，使用的是浏览

Insert插入模式（编辑）
    a/i/o 光标进入插入模式
    A/I/O 行进入插入模式

Command命令模式（操作）
    Normal模式下:进入命令模式
    :q退出 :w保存 
    :vs(vertical split)垂直左右分屏 :sp(split) 水平上下分屏
    :set nu 设置行号
    :% s/java/python/g  全部替换java->python
    :syntax on 语法高亮

Visual可视模式（选择）
    Nomal模式下进入Visual模式
    v选择字符
    V选择行
    ctrl+v块状选择

# 插入模式小技巧
ctrl + h 删除上一个字符
ctrl + w 删除上一个单词
ctrl + u 删除当前行

终端：
ctrl + a 移动到行首
ctrl + e 移动到行尾

切换到Normal模式:
Esc、ctrl + c、 ctrl + [

gi  回到刚才插入位置并进入插入状态

# 快速移动
Normal模式下

1、字符移动
h左 j下 k上 l右
```
     ^
     k
< h     l >
     j
     v
```

2、单词移动
w/W 移动到下一个word/WORD开头
e/E 下一个word/WORD尾
b/B 回到上一个word/WORD开头，backword

word 非空白符分割的单词
WORD 以空白符分割的单词

3、行间搜索移动
f{char} 移动到char字符上
t{char} 移动到char前一个字符上 until
第一次没搜到，可以继续搜该行
分号; 下一个
逗号, 上一个
F反向搜索

4、水平移动
0 移动到行首第一个字符
^ 移动到第一个非空白字符
$ 移动到行尾
g_ 移动到行尾非空白字符

5、垂直移动
括号() 句子间移动
查看帮助 :help (
{} 段落之间移动

6、屏幕移动
H head 屏幕开头
M middle  中间
L lower 结尾
zz 把屏幕置为中间，当前行放中间

7、页面移动
gg 文件开头
G  文件结尾
ctrl + o 快速返回

ctrl + u upword  上翻半页
ctrl + f forword 下翻半页

# 增删改查
1、增加
Normal模式 a/i/o A/I/O

2、删除
Normal模式 
x 删除一个字符
4x 删除4个字符

d(delete)
daw 删除单词和周围空格（delete around word）
diw 删除单词（dw）
dd 删除行
dt{char} 删除直到
d$ 删除到结尾
d0 删除到开头
2dd 删除两行

u undo   撤销操作
ctrl + r 恢复撤销

3、修改
Normal模式下
r replace 替换一个字符 
    eg: 光标下g ra g->a 
c change 
    cw 删除单词进入插入模式 change word
    ct{char} 删除到字符，进入插入模式
s substitute 删除并进入插入模式 eg: 4s 删除4个字符进入插入模式

R 不断替换多个字符
S 删除整行进行插入 
C 删除整行进行插入

4、查询
/ 前向搜索
? 反向搜索
n/N 下一个或者上一个
\*/# 当前单词的前向和后向匹配

搜索结果高亮 :set hls (high light search)
:set incsearch

# 搜索替换
substitute 支持正则

```
:[range] s[ubstitute]/{pattern}/{string}/flags
```

range 范围 
    eg: 
        10,20 表示10-20行
        % 表示全部
pattern 替换模式
string  替换后文本
flags 替换标志位
    g global 全局替换
    c confirm 确认
    n number 查询匹配次数而不替换

eg:
:% s/self/this/g  # 替换 self->this
:1,6 s/self//n    # 查询  计算有1-6行有多少个self
:% s/\<name\>/Name/g # 精确匹配单词

# 多文件操作
Buffer  打开一个文件的缓冲区
Window  可视化分割区域
Tab     组织窗口为一个工作区

1、Buffer
:ls  列举缓冲区
:b n 跳转到第n个缓冲区
:bpre :bnext :bfirst :blast
:b buffer_name  tab补全

:e filename 打开文件

2、Window
一个缓冲区可以分割为多个窗口
每个窗口也可打开不同缓冲区
窗口可以无限分割

（1）窗口分割
<ctrl + w> + s 水平分割  
<ctrl + w> + v 垂直分割  
:sp [filename]  水平分割（打开文件）
:vs [filename]  垂直分割（打开文件）

（2）窗口切换
<ctrl + w> + w 循环切换
<ctrl + w> + h 切换到左边
<ctrl + w> + j 切换到下边
<ctrl + w> + k 切换到上边
<ctrl + w> + l 切换到右边

（3）窗口移动
<ctrl + w> + H 移动到左边
<ctrl + w> + J 移动到下边
<ctrl + w> + K 移动到上边
<ctrl + w> + L 移动到右边

(4)重排窗口
:h window-size
<ctrl + w> + = 所有窗口等宽等高
<ctrl + w> + _  最大化活动窗口高度
<ctrl + w> + |  最大化活动窗口宽度
n + <ctrl + w> + _ 把活动窗口的高度设为n 行
n + <ctrl + w> + | 把活动窗口的宽度设为n 行

3、Tab标签页
一系列窗口的容器:h tabpage
:tabnew {filename}     新标签中打开
:tabe[dit] {filename}  新标签中打开
<ctrl + w> + T 当前窗口移动到一个新标签页
:tabc[lose]  关闭当前标签页及其中的所有窗口 
:tabo[nly]   只保留当前标签页，关闭其他标签页
:tabn[ext] {N} {N}gt  切换到编号N 的标签页
:tabn[ext]       gt    切换到下一个标签页
:tabp[revious]   gT    切换到上一个标签页

插件：ctrlp nerdtree

# 文本对象text object
命令格式：
[number]<command>[text object]
number 次数
command 命令 d(delete), c(change), y(yank), v(visual)
text object 文本对象 w(单词word)， s(句子sentence)，p(段落paragraph)

eg:
iw  插入单词
viw 选择模式插入单词
vaw  around word 选中当前单词和单词之后的空格
vis/vas/vip/vap

vi(/)/</>/{/}/"/"/'/'
va(/)/</>/{/}/"/"/'/'

ciw  删除单词并插入
ci{  删除{内容  

插件 vim-go

# 复制粘贴
Normal模式：
    y(yank) p (put)
    dd 删除一行 p粘贴
Visual模式：选中之后 p粘贴
文本对象：yiw 复制一个单词 yy复制一行

vimrc
:set autoindent 设置自动缩进

粘贴代码格式错乱解决：
:set paste    设置
:set nopaste  取消

Insert模式
ctrl + v/ command + v

# Vim寄存器
无名寄存器
    dw->p 剪切粘贴单词
    x->p 剪切粘贴字符

指定寄存器 ”{register}
eg:
    "ayiw 复制单词到寄存器a中
    "bdd 删除当前行到寄存器b中
    :reg a  查看a寄存器内容
    "ap 粘贴寄存器a中的内容
    ""无名寄存器，默认模式
    "0 寄存器0 
    寄存器a-z
    "+系统剪切板
    "% 当前文件名
    :echo has("clipboard") 1则支持
    :set clipboard=unname 直接使用系统剪切板
    ".上一次插入的文本
    ctrl + r +

:e! 重新加载不保存当前文件


# Vim宏macro批量操作
录制操作，回放操作
q录制 q结束
q{register} 保存到寄存器
@{register} 回放操作

v 模式下选择
:normal @a 回放宏操作

eg:
每行前后加"
V 全选行 G 全选文本
:normal I"  A"

# Vim代码补全
<Ctrl + n>             普通关键字
<Ctrl + x> <Ctrl + n>  当前缓冲区关键字
<Ctrl + x> <Ctrl + i>  包含文件名关键字
<Ctrl + x> <Ctrl + ]>  标签文件关键字
<Ctrl + x> <Ctrl + k>  字段查找
<Ctrl + x> <Ctrl + l>  整行补全
<Ctrl + x> <Ctrl + f>  文件名补全
<Ctrl + x> <Ctrl + o>  全能Omni补全

常用：
<Ctrl + n> <Ctrl + p>  补全单词
<Ctrl + x> <Ctrl + f>  文件名补全
<Ctrl + x> <Ctrl + o>  补全代码，需开启文件类型检查，安装插件

syntax on
:set nu
:set indent
:r! echo %   文件名
:r! echo %:p 文件路径

# 更换配色
:colorscheme 显示当前主题配色 默认default
:colorscheme <ctrl + d> 显示所有配色
:colorscheme 配色名 修改配色


$ vim duck.go duck.py -O  # 两个窗口打开

持久化配置 vim ~/.vimrc
配色方案 hybrid  Monokai
下载配色方案拷贝到文件夹 mkdir ~/.vim/colors

vim插件：https://github.com/flazz/vim-colorschemes

# vim配置
持久化配置
Linux/Unix  vim ~/.vimrc
windows vim $MYVIMRC 环境变量

常用设置
:set nu             # 设置行号
colorscheme hybrid  # 设置主题
vim映射 noremap <leader>w :w<cr> 保存文件
自定义vimscript函数 和插件配置

```
" 常用设置，这是注释
" 设置行号
set number

" 设置主题
colorscheme hybrid

" 按F2进入粘贴模式
set pasttoggle=<F2>

" 高亮搜索
set hlsearch

" 设置折叠方式
set foldmethod=indent

" 一些方便的映射
let mapleader=','
let g:mapleader=','

" 使用 jj 进入 normal 模式 `^上一次插入点
inoremap jj <Esc>`^

" 使用 leader+w 直接保存
inoremap <leader>w <Esc>:w<cr>
noremap <leader>W :w<cr>

" 切换 buffer
nnoremap <silent> [b :bprevious<CR>
nnoremap <silent> [n :bnext<CR>

" 切换窗口
noremap <C-h> <C-w>h
noremap <C-j> <C-w>j
noremap <C-k> <C-w>k
noremap <C-l> <C-w>l

" sudo to write
cnoremap W!! w !sudo tee % >/dev/null


" json格式化
com! FormatJSON %!python3 -m json.tool

```

# 映射
设置leader
let mapleader = ","

重启vim或source生效
:source ~/.vimrc

# 插件脚本
脚本语言 vimscrip

查看配置选项
:h option-list

自定义函数
```
func SetTitle()
    if &filetype == 'python'
        call setline(1, "\#!/usr/bin/env python")
        call setline(2, "\# -*- coding:utf-8 -*-")
        normal G
        normal o
        normal o
        call setline(5, "if __name__ == '__main__':")
        call setline(6, "    pass")
endfunc
```
github: vim-go-tutoria
开源文件：dotfiles

# vim映射
:map - x # 将-映射为x
:map <space> viw 空格映射为选中整个单词
:map <c-d> dd 可以使用ctrl+d执行dd操作
:unmap -  删除映射

模式
nmap normal
vmap visual
imap insert     

v 选中 U/u 转大小写
:imap <c-d> <Esc>ddi # insert模式下删除一行
nnoremap n no re map normal模式下，非递归映射（任何时候都应该使用）

《笨办法学vimscript》

vim8 Neovim




