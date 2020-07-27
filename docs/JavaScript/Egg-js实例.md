前后端环境
```
$ node -v
v10.16.0
```

## 前端部分

1、项目环境
```bash
# 创建项目
cnpm install -g @vue/cli
vue create client && cd client

# 安装依赖
cnpm i vant -S  # vant
cnpm i babel-plugin-import -D
cnpm i vue-router --save  # 路由
cnpm i moment --save   # 时间处理

# 启动服务
npm run serve
```

2、项目目录
```
├── .babelrc   // 新建
├── .gitignore
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   │   └── logo.png
│   ├── main.js
│   ├── router    // 新建
│   │   └── index.js
│   └── view      // 新建
│       ├── Add.vue
│       ├── Detail.vue
│       └── Home.vue
└── vue.config.js  // 新建
```

3、文件内容
.babelrc
```js
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "vant",
        "libraryDirectory": "es",
        "style": true
      }
    ]
  ]
}
```

vue.config.js
```js
module.exports = {
    // 处理跨域请求
    devServer: {
        proxy: {
            '/article': {
                target: "http://127.0.0.1:7001/",
                ws: true, // 允许websockt服务
                changeOrigin: true // 开启虚拟服务器，请求代理服务器
            }
        }
    }
}
```

/src/router/index.js
```js
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'hash',
    routes: [
        { path: '/', component: () => import('../view/Home.vue') },
        { path: '/detail', component: () => import('../view/Detail.vue') },
        { path: '/add', component: () => import('../view/Add.vue') }
    ]
})

export default router

```

/src/main.js
```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

```

/src/App.vue
```html
<template>
  <div id="app">
    <router-view></router-view>
    
    <van-tabbar route>
      <van-tabbar-item replace to="/" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item replace to="/add" icon="plus">发布</van-tabbar-item>
    </van-tabbar>

  </div>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";

export default {
  name: "app",

  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  }
};
</script>

<style>

</style>

```

/src/view/Home.vue
```html
<template>
  <div>
    <van-list v-model="loading" 
    :finished="finished" 
    finished-text="没有更多了" 
    @load="onLoad">

      <van-cell v-for="item in list" 
      :key="item.id" 
      @click="handleItemClick(item.id)">

        <div class="item">
          <div class="left">
            <img :src="item.image" />
          </div>

          <div class="right">
            <div class="title">{{item.title}}</div>
            <div class="create_time">{{item.create_time}}</div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { List, Cell, Toast } from "vant";
import moment from "moment";

export default {
  components: {
    [List.name]: List,
    [Cell.name]: Cell
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false
    };
  },

  methods: {
    handleItemClick(uid) {
      console.log(uid);

      this.$router.push({
        path: "/detail",
        query: {
          id: uid
        }
      });
    },

    onLoad() {
      fetch("/article/list")
        .then(res => res.json())
        .then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.finished = true;
            
            // 处理返回的时间格式
            this.list = res.data.map(item => {
              if (item.create_time) {
                item.create_time = moment(item.create_time).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
              }
              return item;
            });
          } else {
            Toast.fails(res.msg);
          }
        });
    }
  }
};
</script>

<style scoped>
.item {
  display: flex;
  flex-direction: row;
}

.item .left, .item img {
  height: 100px;
  width: 150px;
  border-radius: 10px;
}

.item .right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 15px;
}

.item .right .title {
  font-size: 18px;
}

.item .right .create_time {
  font-size: 12px;
  color: #9e9e9e;
}
</style>

```

/src/view/Detail.vue
```html
<template>
  <div class="detail">
    <div class="title">{{detail.title}}</div>
    <div class="create-time">{{detail.create_time}}</div>
    <div class="summary">{{detail.summary}}</div>
    <div class="content">{{detail.content}}</div>
  </div>
</template>

<script>
import moment from "moment";
import { Toast } from 'vant';

export default {
  data() {
    return {
      detail: {}
    };
  },

  created() {
    fetch("/article/detail/" + this.$route.query.id)
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          this.detail = res.data;
          this.detail.create_time = this.detail.create_time
            ? moment(this.detail.create_time).format("YYYY-MM-DD HH:mm:ss")
            : undefined;
        } else {
          Toast.fail(res.msg);
        }
      });
  }
};
</script>

<style scoped>
.detail {
  padding: 20px;
  text-align: left;
}
.detail .title {
  font-size: 25px;
  margin-bottom: 20px;
}
.detail .create-time {
  text-align: right;
  color: #9e9e9e;
  margin-bottom: 20px;
}

.detail .summary {
  padding: 20px;
  background: #dcdcdc;
  margin-bottom: 20px;
}

.detail .content {
  text-indent: 2em;
  line-height: 200%;
}
</style>
```

/src/view/Add.vue
```html
<template>
  <div>
    <van-uploader v-model="fileList" :after-read="afterRead" :max-count="1" />

    <van-cell-group>
      <van-field v-model="title" label="文章标题" placeholder="文章标题" />
      <van-field v-model="summary" label="文章摘要" placeholder="文章摘要" />
      <van-field v-model="content" label="文章内容" type='textarea' autosize placeholder="文章内容" />
    </van-cell-group>

    <van-button type="primary" @click="handleAdd" class="add-button">提交</van-button>
  </div>
</template>

<script>
import { Field, Button, CellGroup, Uploader, Toast } from 'vant';

export default {
  components: {
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,

  },

  data() {
    return {
      fileList: [],

      title: "",
      summary: "",
      content: "",
      image: ""
    };
  },


  methods: {
    afterRead(file) {
      console.log(file);
      // this.image = file.content
    },

    handleAdd(){
      const data = {
        title: this.title,
        summary: this.summary,
        content: this.content,
        image: this.image,
      }
      fetch('/article/create', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res=>res.json())
      .then(res=>{
        if(res.status===200){
          Toast.success("文章发布成功");
          this.$router.push('/');
        }else{
          Toast.fail(res.msg);
        }
      })
      console.log(data);
    }

  }
};
</script>

<style scoped>
.add-button{
  position: absolute;
  left: 0;
  bottom: 80px;
  width: 100%
}
</style>
```

## 后端部分
1、项目环境
```bash
# 项目环境
mkdir server && cd server
cnpm init egg --type=simple
cnpm i
cnpm i egg-view-ejs  # 模板
cnpm i --save egg-mysql  # 数据库
cnpm i moment --save   # 时间处理

# 启动服务
cnpm run dev

```
2、项目目录
```
.
├── README.md
├── app
│   ├── router.js
│   ├── controller
│   │   ├── article.js
│   ├── service
│   │   ├── article.js
├── config
│   ├── config.default.js
│   └── plugin.js
└── package.json

```

3、文件内容
config/plugin.js
```js
'use strict';


// 模板引擎
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

// mysql
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};
```

config/config.default.js
```js
/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // 关闭scrf
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // 配置模板引擎
  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  // 配置数据库
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'aBc@123456',
      // 数据库名
      database: 'data',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1570720226826_6549';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

```

app/router.js
```js
'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.post('/article/create', controller.article.create);
  router.get('/article/list', controller.article.list);
  router.get('/article/detail/:id', controller.article.detail);
};

```

app/service/article.js
```js
'use strict';

const Service = require('egg').Service;

class ArticleService extends Service {
  async create(params) {
    const { app } = this;

    try {
      const result = await app.mysql.insert('article', params);
      return result;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }

  async list() {
    const { app } = this;
    
    try {
      // 查询所有数据
      const result = await app.mysql.select('article');
      return result;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }

  async detail(id) {
    const { app } = this;
    
    if(!id){
      console.log("id不能为空");
      return null;
    }

    try {
      // 查询数据
      const result = await app.mysql.get('article', {id});
      return result;
    }
    catch (err) {
      console.log(err);
      return null;
    }
  }
}

module.exports = ArticleService;

```

app/controller/article.js
```js
'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

class ArticleController extends Controller {
  async create() {
    const { ctx } = this;
    
    const data = {
      ...ctx.request.body,
      create_time: moment().format('YYYY-MM-DD HH:mm:ss')
    }

    const res = await ctx.service.article.create(data);
    if (res) {
      ctx.body = {
        status: 200,
        data: res,
      }
    } else {
      ctx.body = {
        status: 500,
        data: null,
        msg: '发布失败'
      }
    }
  }

  async list() {
    const { ctx } = this;
    
    const res = await ctx.service.article.list();
    if (res) {
      ctx.body = {
        status: 200,
        data: res,
      }
    } else {
      ctx.body = {
        status: 500,
        data: null,
        msg: '文章列表获取失败'
      }
    }

  }

  async detail() {
    const { ctx } = this;
    
    const res = await ctx.service.article.detail(ctx.params.id);

    if (res) {
      ctx.body = {
        status: 200,
        data: res,
      }
    } else {
      ctx.body = {
        status: 500,
        data: null,
        msg: '文章列表获取失败'
      }
    }
  }
}

module.exports = ArticleController;

```

4、mysql建表语句
```sql
create table article(
    id int(11) primary key not null auto_increment,
    title varchar(255) not null default '' comment '文章标题',
    create_time timestamp default null comment '发布时间',
    summary varchar(255) not null default '' comment '文章简介',
    content text default null comment '文章内容',
    image text default null comment '文章图片'
) engine=InnoDB comment "文章表"
```