# Vim插件
vimscript语言编写功能扩展
插件管理器
vim-plug vundle pathogen dein.vim volt

推荐 vim-plug
https://github.com/junegunn/vim-plug

安装开屏插件
vim-startify
https://github.com/mhinz/vim-startify

修改~/.vimrc
```
call plug#begin('~/.vim/plugged')
Plug 'mhinz/vim-startify'
call plug#end()
```

保存:w
重启vim或者 source ~/.vimrc
执行:PlugInstall
重新打开vim就可以看到效果
:qa  # 退出所有窗口

# 搜索vim插件
nerdtree
python-mode

http://www.vimawesome.com

# 美化插件
启动界面 vim-startify:
https://github.com/mhinz/vim-startify

状态栏美化  vim-airline
https://github.com/vim-airline/vim-airline

增加代码缩进 indentline
https://github.com/Yggdroot/indentLine

配色
vim-hybrid
https://github.com/w0ng/vim-hybrid
solarized
https://github.com/altercation/solarized
gruvbox
https://github.com/morhetz/gruvbox

:set background=dark
:colorscheme hybird

# 文件目录和搜索插件
nerdtree
https://github.com/scrooloose/nerdtree

autocmd vimenter * NERDTree

推荐：
nnoremap <C-n> :NERDTreeToggle<CR>

切换
ctrl + w p

文件搜索
ctrip
https://github.com/kien/ctrlp.vim
ctrl + p

# 文件移动
eazymotion
https://github.com/easymotion/vim-easymotion

nmap ss <Plug>(easymotion-s2)

# 成对编辑
vim-surround
https://github.com/tpope/vim-surround
ds delete surround
cs change surround
ys you surround

# 模糊搜索和替换
fzf.vim
https://github.com/junegunn/fzf.vim
搜索字符串 ag
搜索文件   files

far.vim
https://github.com/brooth/far.vim

# vim-go
golang插件
https://github.com/fatih/vim-go

ctrl + o

# Python-mode
https://github.com/python-mode/python-mode

补全
跳转
重构
格式化

# 浏览代码
vim tagbar     代码大纲
https://github.com/majutsushi/tagbar

vim-interestingwords 单词高亮
https://github.com/lfv89/vim-interestingwords

# 代码补全
deoplete.nvim
https://github.com/Shougo/deoplete.nvim

coc.vim
https://github.com/msanders/cocoa.vim

# 代码格式化与静态检查
golint、pylint、eslint

neoformat
https://github.com/sbdchd/neoformat

ale
https://github.com/w0rp/ale

# 快速注释
vim-commentary
https://github.com/tpope/vim-commentary

# vim+git
fugitive
https://github.com/tpope/vim-fugitive

变更查看
vim-gitgutter
https://github.com/airblade/vim-gitgutter

gv.vim
https://github.com/junegunn/gv.vim

# 查找插件
vimawesome

# Tmux
终端复用，分屏

ctrl + b + :

# vim嵌入开发工商局
neovim 异步支持

# 开源配置
Spacevim
PegasusWang

TODO：
practical vim
笨方法学习vim
vim插件


