
# PHP针对字符串开头和结尾的判断方法

## 1、知识准备
```php
// 计算字符串长度
echo strlen("hello") . PHP_EOL;
// 5

// 截取字符串
echo substr("hello world!", 6, 5) . PHP_EOL;
// world

// 查找子串起始位置
echo strpos("hello world!", "world"). PHP_EOL;
// 6
```
## 2、字符串开头结尾判断
```php
//变量：
$s1 = "hello";
$s2 = "hello world!";
$s3 = "world hello";

//php判断字符串开头：
var_dump(substr($s2, 0, strlen($s1)) === $s1); 
// bool(true)

var_dump(strpos($s2, $s1) === 0);
// bool(true)

//php判断字符串结尾：
var_dump(substr($s3, strpos($s3, $s1)) === $s1);
// bool(true)
```

```php
<?php
/**
 * 字符串工具类
 */
class StringUtil{
    public static function startsWith(string $string, string $subString) : bool{
        return substr($string, 0, strlen($subString)) === $subString;
        // 或者 strpos($s2, $s1) === 0
    }
    
    public static function endsWith(string $string, String $subString) : bool{
        return substr($string, strpos($string, $subString)) === $subString;
    }
}

// 测试代码
var_dump(StringUtil::startsWith('hello world', 'hello'));
// bool(true)

var_dump(StringUtil::startsWith('hello world', 'world'));
// bool(false)


var_dump(StringUtil::endsWith('hello world', 'hello'));
// bool(false)

var_dump(StringUtil::endsWith('hello world', 'world'));
// bool(true)
```
