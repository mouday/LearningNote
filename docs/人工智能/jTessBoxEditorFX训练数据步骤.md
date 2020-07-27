
## 字库训练
下载jTessBoxEditorFX
https://sourceforge.net/projects/vietocr/files/jTessBoxEditor/

文件名必须是如下格式：
```
[lang].[fontname].exp[num]
```
lang:语言名(训练生成的示为语言)
fontname:字体名
num:序号(无所谓)
于是可以得到一个命名为 num.peng.exp1.tif 的文件

1、准备样本图片，合并为.tif文件
jTessBoxEditorFX -> tools->merge tiff

2、生成.bok文件
```
tesseract num.peng.exp1.tif num.peng.exp1 batch.nochop makebox
```

3、字符矫正
jTessBoxEditorFX -> Box Editor->Open，num.peng.exp1.tif，调整校正

## 生成训练数据
示例假设有3个文件，tif文件

1、创建font_properties文件
文件内容为 ：
```
<fontname> <italic> <bold> <fixed> <serif> <fraktur>

# eg:
echo peng 0 0 0 0 0 > font_properties
```

2、产生字符特征文件.tr
```
tesseract num.peng.exp1.tif num.peng.exp1 nobatch box.train
tesseract num.peng.exp2.tif num.peng.exp2 nobatch box.train
tesseract num.peng.exp3.tif num.peng.exp3 nobatch box.train
```

3、计算字符集文件 unicharset
```
unicharset_extractor num.peng.exp1.box num.peng.exp2.box num.peng.exp3.box
```

4、聚集字符特征 生成文件 shapetable
```
shapeclustering -F font_properties -U unicharset num.peng.exp1.tr num.peng.exp2.tr num.peng.exp3.tr

mftraining -F font_properties -U unicharset -O num.unicharset num.peng.exp1.tr num.peng.exp2.tr num.peng.exp3.tr
 
cntraining num.peng.exp1.tr num.peng.exp2.tr num.peng.exp3.tr
```

5、重命名
```
mv shapetable num.shapetable && \
mv normproto num.normproto && \
mv inttemp num.inttemp && \
mv pffmtable num.pffmtable
```

6、生成字库
```
combine_tessdata num.
```

>参考
[文字识别 OCR 训练样本](https://www.jianshu.com/p/f7e89458e25c)
[基于Tesseract的OCR识别](https://www.jianshu.com/p/f0f05ff2dc2e)
[Tesseract-OCR-3.0.5 数字识别训练与合并多次训练数据](https://blog.csdn.net/ruyulin/article/details/89046148)
[python tesseract 4.0 安装踩过的坑（基于macOS ）](https://blog.csdn.net/vola9527/article/details/81130631?utm_source=distribute.pc_relevant.none-task)

## 综合示例
1、数据合成助手
假设只有一个tif文件 `num.peng.exp1.tif`

上面的步骤有点多，合成一个脚本便于使用
备注：需要设置好环境变量：`TESSDATA_PREFIX`

traindata.sh
```bash
#！/bin/bash

# 所用到的变量
lang="num"
fontname="peng"
num="1"
name="${lang}.${fontname}.exp${num}"

# 环境变量中需要设置好资源文件路径 TESSDATA_PREFIX 重启电脑生效

if [ -e "${name}.tif" ]; then
  echo "文件存在"
else
  echo "文件不存在: ${name}.tif"
  exit 0
fi

# 生成box
box=$1
if [[ ${box} == 'box' ]]; then
  echo "生成box"
  tesseract "${name}.tif" ${name} batch.nochop makebox
  exit 0
else
  echo "生成训练数据"
fi

# 1、创建font_properties文件
echo 'peng 0 0 0 0 0' > font_properties  && \

# 2、产生字符特征文件.tr
tesseract "${name}.tif" ${name} nobatch box.train && \

# 3、计算字符集文件 unicharset
unicharset_extractor "${name}.box" && \

# 4. 聚集字符特征 生成文件 shapetable
shapeclustering -F font_properties -U unicharset "${name}.tr" && \

mftraining -F font_properties -U unicharset -O "${lang}.unicharset" "${name}.tr" && \

cntraining "${name}.tr" && \

# 5、重命名
mv shapetable "${lang}.shapetable" && \
mv normproto "${lang}.normproto" && \
mv inttemp "${lang}.inttemp" && \
mv pffmtable "${lang}.pffmtable" && \

# 6、生成字库
combine_tessdata "${lang}." && \

# 拷贝字库
cp *.traineddata ${TESSDATA_PREFIX} && \

echo "完成"
```

使用方式
将文件拷贝到样本数据目录下
```bash
# 生成box文件
bash traindata.sh box

# 生成traineddata文件
bash traindata.sh
```

2、数据准备
执行下面的python代码，在目录sample下生成10个样本

VerifyCode.py
```python
# -*- coding: utf-8 -*-

import random
import string
from PIL import Image, ImageFilter, ImageFont, ImageDraw


class VerifyCode(object):

    @classmethod
    def get_char(cls):
        """获取一个字母或数字
        """
        return random.choice(
            string.ascii_letters + string.digits
        )

    @classmethod
    def get_num(cls):
        """获取一个字母或数字
        """
        return random.choice(string.digits)

    @classmethod
    def get_color1(cls):
        """获取颜色值 3元组
        """
        return (
            random.randint(64, 255),
            random.randint(64, 255),
            random.randint(64, 255)
        )

    @classmethod
    def get_color2(cls):
        return (
            random.randint(32, 127),
            random.randint(32, 127),
            random.randint(32, 127)
        )

    @classmethod
    def get_code(cls, num):
        lst = []
        for idx in range(num):
            lst.append(cls.get_char())
        return ''.join(lst)

    @classmethod
    def get_num_code(cls, num):
        lst = []
        for idx in range(num):
            lst.append(cls.get_num())
        return ''.join(lst)

    @classmethod
    def get_verifycode_image(cls, code, save_path):
        """生成字母验证码图片
        @param n: {int} 字母数量
        @param save_path: {str} 保存路径
        @return: None
        """
        # 图片尺寸
        width = 60 * len(code)
        height = 60

        image = Image.new("RGB", (width, height), (255, 255, 255))
        # 创建Font对象
        font = ImageFont.truetype('Arial.ttf', 36)
        # 创建Draw对象
        draw = ImageDraw.Draw(image)

        # 填充每个像素
        # for x in range(width):
        #     for y in range(height):
        #         draw.point((x, y), fill=cls.get_color1())

        # 输出文字
        for idx in range(len(code)):
            draw.text((60 * idx + 10, 10), code[idx], font=font, fill='black')

        # 模糊处理
        # image = image.filter(ImageFilter.BLUR)

        image.save(save_path, "jpeg", dpi=(300.0, 300.0))


if __name__ == '__main__':
    for i in range(10):
        code = VerifyCode.get_num_code(4)
        VerifyCode.get_verifycode_image(code, f"sample/{code}.jpg")

```

3、数据训练

（1）第一次识别测试
直接使用tesseract 识别生成的数据
```python
# -*- coding: utf-8 -*-
import glob
import os

import pytesseract
from PIL import Image


def to_string(filename):
    name, ext = os.path.splitext(filename)
    code = name.split("/")[-1]

    img = Image.open(filename)
    img = img.convert("L")  # 转为黑白图
    ret = pytesseract.image_to_string(img)
    print(code, ret)


lst = glob.glob("sample/*.jpg")
for file in lst:
    to_string(file)

```

第一次识别结果：
```
实际内容 识别结果
3791 379

1
7455 7455
7195 
8502 5502
1107 
9375 9375
3498 3493
0384 0354
6519 
4631 463

1
```

（2）第二次识别测试

增加参数 `--psm 6`
```
ret = pytesseract.image_to_string(img, config='--psm 6')
```
```
实际内容 识别结果
3791 3791 
7455 7455
7195 7195
8502 5502  <-
1107 1107
9375 9375
3498 3493  <-
0384 0354  <-
6519 6519  
4631 4631
```

（3）第三次识别
上面的步骤总结为4步：
（3.1）先使用jTessBoxEditorFX生成tif文件
jTessBoxEditorFX -> tools->merge tiff

（3.2）生成box文件
```
bash traindata.sh box
```
（3.3）校正数据
jTessBoxEditorFX -> Box Editor->Open，num.peng.exp1.tif，调整校正

（3.4）生成traineddata文件
```
bash traindata.sh
```

添加参数`lang='num'`后，识别数据
```
ret = pytesseract.image_to_string(img, lang='num', config='--psm 6')
```

训练数据后，100%准确率
```
实际内容 识别结果
3791 3791
7455 7455
7195 7195
8502 8502
1107 1107
9375 9375
3498 3498
0384 0384
6519 6519
4631 4631
```
（4）第四次识别
再使用VerifyCode.py文件生成10个新的验证码图片，再试试

新数据的准确率也是100%
```
实际内容 识别结果
2465 2465
8765 8765
1912 1912
5815 5815
3704 3704
0974 0974
9548 9548
4236 4236
2655 2655
3763 3763
```




