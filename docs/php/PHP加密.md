PHP加密
加密解决的问题
1、防止通信内容被窃听
2、防止通信内容被篡改


对称加密 DES 
Data Encryption Standard
可以被暴力破解
```
加密：明文 + 秘钥 -> DES加密 -> 密文
解密：密文 + 秘钥 -> DES解密 -> 明文
```

对称加密 Triple-DES
3次DES,性能较差

对称加密 AES
Advance Encryption Standard
安全的

```
加密：字节替换 -> 列移动 -> 混合列 -> 与秘钥进行XOR
解密：字节替换 <- 列移动 <- 混合列 <- 与秘钥进行XOR
```

DES代码实例
```php
<?php

// 查看可用方法
// $ciphers = openssl_get_cipher_methods();
// var_dump($ciphers);


// 获取一定长度的秘钥
$key = uniqid();
var_dump($key);

$md5_key = md5($key);
var_dump($md5_key);

$vi = substr($md5_key, 0, 8);
var_dump($vi);

$data = "hello world";
$method = "DES-CBC";

// 加密数据
$content = openssl_encrypt($data, $method, $key, OPENSSL_RAW_DATA, $vi);
var_dump($content);


// 解密数据
$content = openssl_decrypt($content, $method, $key, OPENSSL_RAW_DATA, $vi);
var_dump($content);

```

RSA非对称加密
公钥加密
密文 = 明文 E次方 mod N
公钥 = {E, N}

私钥解密
明文 = 密文 D次方 mod N
私钥 = {D, N}

缺点：运算速度慢

RSA代码示例
```php
<?php

// 秘钥对生成网址：http://web.chacuo.net/netrsakeypair

$public = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0HOTvtgR3rSeaun7RaGl
ECy2DCGVEd2fxCI8/MomgJoHYonpomtk8LzFC6UXApEzBK9Qe05x30cHMI0ejNtI
y9EtCkhgpVe8SDWA6volZjBZSOzF5FZmnMG+LV2eL60TnSHFeVGEl/qQxqM1143d
w4+Ymza+adfFDU2xBMobw5q37++9qwj8mrtviP7P8I+dOVNSCt/qIct+GdcBHSl/
N8V0XLmFnjPUiNGI90moeTMFUR5JQG7wxipsU4O/b2Ik92/2EpJ4/dnJBEKhsA9Z
Wedo0YOWXr0F7dO4xUfYqVvqdR0J67Meb4ah2mFBGLbaJ3I276QelBWvM13Mp+lA
EQIDAQAB
-----END PUBLIC KEY-----';

$private = '-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQc5O+2BHetJ5q
6ftFoaUQLLYMIZUR3Z/EIjz8yiaAmgdiiemia2TwvMULpRcCkTMEr1B7TnHfRwcw
jR6M20jL0S0KSGClV7xINYDq+iVmMFlI7MXkVmacwb4tXZ4vrROdIcV5UYSX+pDG
ozXXjd3Dj5ibNr5p18UNTbEEyhvDmrfv772rCPyau2+I/s/wj505U1IK3+ohy34Z
1wEdKX83xXRcuYWeM9SI0Yj3Sah5MwVRHklAbvDGKmxTg79vYiT3b/YSknj92ckE
QqGwD1lZ52jRg5ZevQXt07jFR9ipW+p1HQnrsx5vhqHaYUEYttoncjbvpB6UFa8z
Xcyn6UARAgMBAAECggEBAJpv9tefJ+YzNWeKwUJ+l1ebeKkWPGaHJ3Zd04eKkeoX
tD76ZKGUJa4CfY66GokpYH4pEVy56r381sPO2gKL+Kwg5tjGdOwrS3DISyJMgGbs
jUntOlSI+u9Kz4a25Jr4BR8WxUKz9aPP3XF9vEdecR4RhoQAlCTA2tqXY/5jaxyI
bs6+kpN7hnKFMCQJ/T7/9UrIaNR9L3mcrQwjpcGBHPx7I2vZtkENMVh6D67ecEo0
i7g116/VexST9XKD1EJXdLlkmbx2YPSyKMnNQxRqWtazSXtMz9FaEMzMzXxwI4vQ
h7JW8LYYosI8hbrToj1AfQsbfl08WI+cnPZptPssUT0CgYEA8+P1cND+OHEMh73K
9HhoJN4rCBxdB7WJAlo7+WvmI5UTKnb4Vwx24Jm2KkAqFZYnrWInARyCjEK2EqBS
4jTiBCWKoG7fYd0YE+M3vOGZ/t8FMeSZLbBf0dcBqDbF8sp7x/SiTUGG8npED/5J
mJT9os6TsRMoCKFDkKhf3gTrYSMCgYEA2s0pI2UQO+ysWvu76339V6RzP4ZJdT5i
Tc+uwoNJ6gisitOovRfhdOiT29AxXKbh1Eib7ug6jlVpIXJQGVEcJIGPGq2dxZ3f
7Rx/XHAzsfw65nCJ80O4bjZkxFPT8P7c04hxUKI29wuSPEgzUnGVLDbKgwKlzUOK
NNbz5ZL4/zsCgYA8F+seBSDen1xLBgS///sJOoS31uVFRQGhRsKIToHCOrUiPXYr
XLLd3IH6Hx0/fGQCYLDjoTa5gKaEKGTDv+wAwY9KwIbiAiwwmkfdjmj3V9Rb2suz
akXx2lxaKkTT8fhV6H0lNAQgMugaWLmhkvR77RKPCv1OQw320sXsWqH0qQKBgFQK
AQcLRlT97qVzkxY8ahZDn9CCb6yMrY1de65SZw1xD3SzH1ih14Lj4gbHzG3d21eC
HAKDSBprS9oA4isXMEwFR0Xj8Xl5zgxwqaqDnhd63dSs3Q+Gr0wFsGaIHBuwiHjn
Kz7hT2NMGnr08GF2Jum4kcgIOE7C5k6tUTiYXvMJAoGBAIc+TEvBmnjPrupmToCI
OCFvUJtKrlEPACHU2Vut/g33/oVartWB4+6Wlmb57cfDdnHZRUNTom/BkGC4WDfa
d30Sc5hqeAINZD6557JkR/ZmIVgN90QFNCSJWOirYNzsLDlF0v6Weun6yQlygGim
+Ck7L+QHMgFEQQCYFd6ET5Cl
-----END PRIVATE KEY-----';

// 公钥加密
$content = "hello world";
$encrypt = "";
$ret = openssl_private_encrypt($content, $encrypt, $private);
var_dump($ret);
var_dump($encrypt);
// bool(true) string(256) ...

// 私钥解密
$decrypt = "";
$ret = openssl_public_decrypt($encrypt, $decrypt, $public);

var_dump($ret);
var_dump($decrypt);
// bool(true) string(11) "hello world"

```

中间人攻击
https

hash函数
md5() -> 32位唯一字符串
可以被撞库反解
数字签名

综合实践
rsa aes md5签名

ak appkey
sk secretkey

客户端代码
```
<?php 

$public = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0HOTvtgR3rSeaun7RaGl
ECy2DCGVEd2fxCI8/MomgJoHYonpomtk8LzFC6UXApEzBK9Qe05x30cHMI0ejNtI
y9EtCkhgpVe8SDWA6volZjBZSOzF5FZmnMG+LV2eL60TnSHFeVGEl/qQxqM1143d
w4+Ymza+adfFDU2xBMobw5q37++9qwj8mrtviP7P8I+dOVNSCt/qIct+GdcBHSl/
N8V0XLmFnjPUiNGI90moeTMFUR5JQG7wxipsU4O/b2Ik92/2EpJ4/dnJBEKhsA9Z
Wedo0YOWXr0F7dO4xUfYqVvqdR0J67Meb4ah2mFBGLbaJ3I276QelBWvM13Mp+lA
EQIDAQAB
-----END PUBLIC KEY-----';

// 1、参数编码
$appkey = "123";
$secretkey = "abc";

$url = "http://127.0.0.1:8009/server.php?";

$params["appkey"] = $appkey;
$params["name"] = "Tom";
$params["password"] = "123456";
$params["time"] = time();

$queryString = http_build_query($params);

// 2、参数生成签名
$sign = getSign($params, $secretkey);
$queryString .="&sign=" . $sign;

// 3、公钥加密
$encrypt = "";
openssl_public_encrypt($queryString, $encrypt, $public);
$encrypt = urlencode($encrypt);

$url .= "q=" . $encrypt;

var_dump($url);
// http://127.0.0.1:8009/server.php?
// appkey=123
// name=Tom
// password=123456
// time=1560870998
// sign=2f8c18c6bf072f6310375a66e7082648

function getSign($params, $secretkey){
    ksort($params); // 按键排序
    $q = http_build_query($params);
    $q .= $secretkey;
    return md5($q);
}

```

服务端代码
```
<?php

// 服务器端

$private = '-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDQc5O+2BHetJ5q
6ftFoaUQLLYMIZUR3Z/EIjz8yiaAmgdiiemia2TwvMULpRcCkTMEr1B7TnHfRwcw
jR6M20jL0S0KSGClV7xINYDq+iVmMFlI7MXkVmacwb4tXZ4vrROdIcV5UYSX+pDG
ozXXjd3Dj5ibNr5p18UNTbEEyhvDmrfv772rCPyau2+I/s/wj505U1IK3+ohy34Z
1wEdKX83xXRcuYWeM9SI0Yj3Sah5MwVRHklAbvDGKmxTg79vYiT3b/YSknj92ckE
QqGwD1lZ52jRg5ZevQXt07jFR9ipW+p1HQnrsx5vhqHaYUEYttoncjbvpB6UFa8z
Xcyn6UARAgMBAAECggEBAJpv9tefJ+YzNWeKwUJ+l1ebeKkWPGaHJ3Zd04eKkeoX
tD76ZKGUJa4CfY66GokpYH4pEVy56r381sPO2gKL+Kwg5tjGdOwrS3DISyJMgGbs
jUntOlSI+u9Kz4a25Jr4BR8WxUKz9aPP3XF9vEdecR4RhoQAlCTA2tqXY/5jaxyI
bs6+kpN7hnKFMCQJ/T7/9UrIaNR9L3mcrQwjpcGBHPx7I2vZtkENMVh6D67ecEo0
i7g116/VexST9XKD1EJXdLlkmbx2YPSyKMnNQxRqWtazSXtMz9FaEMzMzXxwI4vQ
h7JW8LYYosI8hbrToj1AfQsbfl08WI+cnPZptPssUT0CgYEA8+P1cND+OHEMh73K
9HhoJN4rCBxdB7WJAlo7+WvmI5UTKnb4Vwx24Jm2KkAqFZYnrWInARyCjEK2EqBS
4jTiBCWKoG7fYd0YE+M3vOGZ/t8FMeSZLbBf0dcBqDbF8sp7x/SiTUGG8npED/5J
mJT9os6TsRMoCKFDkKhf3gTrYSMCgYEA2s0pI2UQO+ysWvu76339V6RzP4ZJdT5i
Tc+uwoNJ6gisitOovRfhdOiT29AxXKbh1Eib7ug6jlVpIXJQGVEcJIGPGq2dxZ3f
7Rx/XHAzsfw65nCJ80O4bjZkxFPT8P7c04hxUKI29wuSPEgzUnGVLDbKgwKlzUOK
NNbz5ZL4/zsCgYA8F+seBSDen1xLBgS///sJOoS31uVFRQGhRsKIToHCOrUiPXYr
XLLd3IH6Hx0/fGQCYLDjoTa5gKaEKGTDv+wAwY9KwIbiAiwwmkfdjmj3V9Rb2suz
akXx2lxaKkTT8fhV6H0lNAQgMugaWLmhkvR77RKPCv1OQw320sXsWqH0qQKBgFQK
AQcLRlT97qVzkxY8ahZDn9CCb6yMrY1de65SZw1xD3SzH1ih14Lj4gbHzG3d21eC
HAKDSBprS9oA4isXMEwFR0Xj8Xl5zgxwqaqDnhd63dSs3Q+Gr0wFsGaIHBuwiHjn
Kz7hT2NMGnr08GF2Jum4kcgIOE7C5k6tUTiYXvMJAoGBAIc+TEvBmnjPrupmToCI
OCFvUJtKrlEPACHU2Vut/g33/oVartWB4+6Wlmb57cfDdnHZRUNTom/BkGC4WDfa
d30Sc5hqeAINZD6557JkR/ZmIVgN90QFNCSJWOirYNzsLDlF0v6Weun6yQlygGim
+Ck7L+QHMgFEQQCYFd6ET5Cl
-----END PRIVATE KEY-----';


// 1、获取参数之后使用私钥解密
$q = $_GET["q"];
$decrypt = "";
openssl_private_decrypt($q, $decrypt, $private);

// 2、将字符串格式的参数转为数组
$params = [];
parse_str($decrypt, $params);

// 3、时间检验，控制url存活时间
if(abs($params["time"] - time()) >= 60){
    echo "页面超时";
    die;
}

// 4、比对签名是否正确
$sign = getSign($params);
if ($sign != $params["sign"]){
    echo "error";
    die;
}

echo "success";


function getSign($params){
    // 可以配置多个秘钥对
    $config = [
        "123" => "abc"
    ];

    unset($params["sign"]);

    ksort($params);

    $q = http_build_query($params);

    return md5($q . $config[$params["appkey"]]);
}
```



