

1、安装Java8(JDK8)
https://www.oracle.com/technetwork/java/javase/downloads/index.html
java version "1.8.0_221"

2、安装eclipse
https://www.eclipse.org/
Version: 2019-06 (4.12.0)


3、eclipse安装e(fx)clipse插件
https://www.eclipse.org/efxclipse/install.html

菜单Help -> Install New Software… -> Add…  ->  输入
Name: e(fx)clipse
Localtion: http://download.eclipse.org/efxclipse/updates-released/2.3.0/site/

-> OK ->  选中两项
a、e(fx)clipse – install
b、e(fx)clipse – single components

-> next完成

4、安装JavaFX Scene Builder可视化布局工具

（1）下载安装JavaFX Scene Builder
https://www.oracle.com/technetwork/java/javase/downloads/javafxscenebuilder-1x-archive-2199384.html

（2）配置Eclipse以使用Scene Builder
菜单Window -> References -> JavaFX
SceneBuilder executable 选择刚刚安装好的程序路径
-> Ok

5、eclipse新建JavaFx项目
（1）创建项目
菜单File -> New -> Others… -> JavaFX -> JavaFX Project
application的子包中，生成名为Main.java的程序

（2）创建布局文件
File -> New -> Other… -> JavaFX -> New FXML Document
右键使用JavaFX Scene Builder打开fxml文件，拖拽控件布局，保存

6、运行应用程序
右键单击Main.java文件空白处，选择Run As -> Java Application




> 参考
> [JavaFX开发环境安装配置](https://www.yiibai.com/javafx/javafx_environment.html)
> [Java-GUI快速入门-WindowBuilder](https://blog.csdn.net/qq_42035966/article/details/82258199)