```html
<html lang="en">
<head>
	<title>Document</title>
	<!-- 1、引入必要的文件 -->
	<link rel="stylesheet" href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css">
	<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
	<script src="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/js/bootstrap.min.js"></script>
</head>

<body>
	<h2>创建模态框（Modal）</h2>
	<!-- 2、按钮触发模态框 -->
	<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">点击弹出模态框</button>


	<!-- 3、模态框（Modal） -->
	<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
					<h4 class="modal-title" id="myModalTitle">模态框（Modal）标题</h4>
				</div>
				<div class="modal-body" id="myModalBody">在这里添加一些文本</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
					<a type="button" href="https://www.baidu.com/" class="btn btn-primary" id="myModalAction">确定</a>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
```