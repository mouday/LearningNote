CSS 预处理器-Sass（SCSS）

## Sass 和 SCSS 
不同之处：
1、文件扩展名不同
2、语法书写方式不同
（1）Sass 缩进式
（2）SCSS 类似 CSS 语法

Sass 语法
```
$font-stack: Helvetica, sans-serif  //定义变量
$primary-color: #333 //定义变量

body
  font: 100% $font-stack
  color: $primary-color
```

SCSS 语法
```
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```