Tampermonkey

下载安装
https://www.tampermonkey.net/

实用脚本
https://greasyfork.org/zh-CN/scripts

接口文档
https://www.tampermonkey.net/documentation.php


下面简单介绍下 UserScript Header 的一些参数定义。 

•@name：脚本的名称，就是在控制面板显示的脚本名称。
•@namespace：脚本的命名空间。
•@version：脚本的版本，主要是做版本更新时用。
•@author：作者。
•@description：脚本描述。
•@homepage, @homepageURL, @website，@source：作者主页，用于在Tampermonkey选项页面上从脚本名称点击跳转。请注意，如果 @namespace 标记以 http://开头，此处也要一样。
•@icon, @iconURL and @defaulticon：低分辨率图标。
•@icon64 and @icon64URL：64x64 高分辨率图标。
•@updateURL：检查更新的网址，需要定义 @version。
•@downloadURL：更新下载脚本的网址，如果定义成 none 就不会检查更新。
•@supportURL：报告问题的网址。
•@include：生效页面，可以配置多个，但注意这里并不支持 URL Hash。例如：
```
// @include http://www.tampermonkey.net/*
// @include http://*
// @include https://*
// @include *
```

•@match：约等于 @include 标签，可以配置多个。
•@exclude：不生效页面，可配置多个，优先级高于 @include 和 @match。
•@require：附加脚本网址，相当于引入外部的脚本，这些脚本会在自定义脚本执行之前执行，比如引入一些必须的库，如 jQuery 等，这里可以支持配置多个 @require 参数。例如：

// @require https://code.jquery.com/jquery-2.1.4.min.js
// @require https://code.jquery.com/jquery-2.1.3.min.js#sha256=23456...
// @require https://code.jquery.com/jquery-2.1.2.min.js#md5=34567...,sha256=6789...

•@resource：预加载资源，可通过 GM_getResourceURL 和 GM_getResourceText 读取。
•@connect：允许被 GM_xmlhttpRequest 访问的域名，每行一个。
•@run-at：脚本注入的时刻，如页面刚加载时，某个事件发生后等等。例如：
•document-start：尽可能地早执行此脚本。
•document-body：DOM 的 body 出现时执行。
•document-end：DOMContentLoaded 事件发生时或发生后后执行。
•document-idle：DOMContentLoaded 事件发生后执行，即 DOM 加载完成之后执行，这是默认的选项。
•context-menu：如果在浏览器上下文菜单（仅限桌面 Chrome 浏览器）中点击该脚本，则会注入该脚本。注意：如果使用此值，则将忽略所有 @include 和 @exclude 语句。
•@grant：用于添加 GM 函数到白名单，相当于授权某些 GM 函数的使用权限。例如：

// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
如果没有定义过 @grant 选项，Tampermonkey 会猜测所需要的函数使用情况。

•@noframes：此标记使脚本在主页面上运行，但不会在 iframe 上运行。
•@nocompat：由于部分代码可能是专门为专门的浏览器所写，通过此标记，Tampermonkey 会知道脚本可以运行的浏览器。例如：

// @nocompat Chrome
这样就指定了脚本只在 Chrome 浏览器中运行。

除此之外，Tampermonkey 还定义了一些 API，使得我们可以方便地完成某个操作，如：

•GM_log：将日志输出到控制台。
•GM_setValue：将参数内容保存到 Storage 中。
•GM_addValueChangeListener：为某个变量添加监听，当这个变量的值改变时，就会触发回调。
•GM_xmlhttpRequest：发起 Ajax 请求。
•GM_download：下载某个文件到磁盘。
•GM_setClipboard：将某个内容保存到粘贴板。


参考：
https://mp.weixin.qq.com/s/r3MUVEPos2Rm5uKno8HysQ
