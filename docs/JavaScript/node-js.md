npm其实是Node.js的包管理工具（package manager)
```
$ node -v 
>.exit

$ nmp -v

# 严格模式运行
$ node hello.js --use_strict
```

模块

demo.js
```
"use strict";

function hello(){
    console.log("hello world");
}

module.exports = hello;
```

main.js
```
"use strict";

var hello = require("./demo.js")

hello();
```