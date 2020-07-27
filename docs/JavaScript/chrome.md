## Chrome DevTools功能介绍
1、Elements 元素：检查、调整页面，调试DOM，调试CSS
2、Network 网络： 调试请求，了解页面静态资源分布，网页性能检测
3、Console 控制台：调试JavaScript、查看log日志，交互式代码调试
4、Sources 源代码资源：调试JavaScript页面源代码，断点调试
5、Application  应用： 查看调试客户端存储，Cookie，LocalStorage，SessionStorage
6、Performance 性能：查看页面性能细节，细粒度对网页载入进行性能优化（高阶）
7、Memory 内存 CPU分析，内存堆栈分析器（高阶）
8、Security 安全：页面安全，证书
9、Audits 性能分析，使用Google Lighthouse辅助性能分析，给出优化建议（高阶）

## 打开Chrome开发者工具方式
1、菜单 -> 更多工具 -> 开发者工具
2、页面右键 -> 检查
3、快捷键 
（1）打开最近关闭的状态 
Mac： Command + Option + I
Windows： Ctrl + Shift + I
（2）快速进入Elements查看DOM或样式
Mac：Command + Option + C
Windows： Ctrl + Shift + C
（3）快速进入Console查看log运行JavaScript
Mac：Command + Option + J
Windows： Ctrl + Shift + J
（4）切换开发者工具位置
Mac：Command + Option + D
Windows： Ctrl + Shift + D

## 在Console中访问DOM节点
1、document.querySelectAll
2、使用$0访问选中的元素
3、拷贝 -> JS Path

## 在DOM中断点调试
1、属性修改时打断点 break on -> attribute modifications
2、节点删除时打断点 break on -> node removal
3、子树修改时打断点 break on -> subtree modifications

## CSS调试
1、提升优先级
!important

2、动画效果
animation.css
https://daneden.github.io/animate.css/