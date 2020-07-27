# Laravel-表单篇
## 第1章 Controller 介绍
1、Request
2、Session
3、Response
4、Middleware

### 1、Request
Laravel请求使用的组件是symfony/http-foundatio
请求中存放了
```
$_GET 
$_POST
$_COOKIE
$_FILES
$_SERVER
```

获取请求中的值
判断请求类型

```php
/**
 * 请求url  
 * http://127.0.0.1:8000/student/list?name=Tom
 */

// 取值
$request->input('name');
// Tom

// 取值，设置默认值
$request->input('age', 'default');
// default

// 判断是否有值
$request->has('name');
// true

// 取出所有参数
$request->all();
// { ["name"]=> "Tom" }

// 获取请求类型
$request->method();
// GET

// 判断请求类型
$request->isMethod('GET');
// true

// 判断是否为ajax请求
$request->ajax();
// false

// 判断路由格式
$request->is('student/*');
// true

// 获取当前url
$request->url();
// http://127.0.0.1:8000/student/list
```

### 2、Session
HTTP协议无状态 Stateless
Session提供一种保存用户数据的方法

支持多种session后端驱动：
Memcached、Redis、数据库

默认使用file的Session驱动
配置文件：config/session.php

启用Session中间件
```php
Route::group(['middleware'=>['web']], function (){
    Route::get('student/list', 'StudentController@list');
});
```

使用方式
1、Request类session()方法
2、session()辅助函数
3、Session facade

使用示例
```php
// 1、HTTP request
$request->session()->put('key', 'value');
$request->session()->get('key');

// 2、session()
session()->put('key', 'value');
session()->get('key');

// 3、Session
Session::put('key', 'value');
Session::get('key', 'default');

// 以数组的形式存储
Session::put(['key' => 'value']);

// 放到Session数组中
Session::push('key', 'value1');
Session::push('key', 'value2');

// 从Session中取数据，取出就删除
Session::pull('key', 'value');

// 取出所有值
Session::all();

// 判断存在
Session::has('key');

// 删除指定key的值
Session::forget('key');

// 清空
Session::flush();

// 暂存数据，第一次访问的时候存在
Session::flash('key', 'value');
```

### 3、Response
常见响应类型：
1、字符串
2、视图
3、Json
4、重定向

```php
// json
$data = [
    'code': 0,
    'data': ['name' => 'Tom'],
    'msg': 'ok',
];
return response()->json($data);

// 重定向，
Route::get('student/list', [
    'as' => 'list', 
    'uses' =>'StudentController@list'
]);


return redirect('student/list');

// 携带Session快闪数据
return redirect('student/list')->with('key', 'value');

// action
return redirect()-action('StudentController@list');

// route
return redirect()-route('list');

// 返回上一页面
return redirect()-back();
```

### 4、Middleware
Laravel中间件提供一个方便的机制来过滤进入应用程序的HTTP请求

步骤：
新建中间件
注册中间件
使用中间件
中间件的前置和后置操作

使用示例
需求：
活动开始前只能访问活动的-介绍页
活动开始后可以访问活动的-活动页

1、新建中间件
app/Http/Middleware/Active.php
```php

namespace App\Http\Middleware;

use Closure;


class Active
{
    public function handle($request, Closure $next)
    {
        if (time() < strtotime('2019-11-01')) {
            return redirect('student/index');
        } else{
            return $next($request);
        }
    }
}

```

2、注册中间件
app/Http/Kernel.php
```php
namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
 protected $routeMiddleware = [
        'active' => \App\Http\Middleware\Active::class,
    ];
}
```

3、使用中间件
app/Http/Controllers/StudentController.php
```php
namespace App\Http\Controllers;


use Illuminate\Http\Request;

class StudentController extends Controller
{
    function list(Request $request)
    {
       return '活动页';
    }

    function index(Request $request)
    {
        return '介绍页';
    }
}

```

routes/web.php
```php
// 活动开始前可以访问活动首页
Route::get('student/index', 'StudentController@index');

// 活动开始后才能访问活动列表页
Route::group(['middleware'=>['active']], function (){
    Route::get('student/list', 'StudentController@list');
});
```

前置操作：请求执行前
后置操作：请求执行后
```php

namespace App\Http\Middleware;

use Closure;


class Active
{
    // 前置操作
    public function handleBefore($request, Closure $next)
    {
        if (time() < strtotime('2019-11-01')) {
            return redirect('student/index');
        } else{
            return $next($request);
        }
    }

    // 后置操作
    public function handleAfter($request, Closure $next)
    {
        $response = $next($request);

        echo '后置操作';
        return $response;
    }
}

```

## 第2章 Laravel表单
 1、静态资源管理及模板布局
 2、表单列表及分页实现 
 3、通过表单实现新增及操作状态提示功能 
 4、表单验证及数据保持详解 
 5、通过模型处理性别 
 6、通过表单实现修改 
 7、表单中查看详情及删除

完整代码
1、配置数据库
.env
```php
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=data
DB_USERNAME=root
DB_PASSWORD=123456
```

2、配置路由
routes/web.php
```php
Route::get('/', [
    'uses'=> 'StudentController@index'
]);

Route::any('create', [
    'uses'=> 'StudentController@create'
]);

Route::post('save', [
    'uses'=> 'StudentController@save'
]);

Route::any('update/{id}', [
    'uses'=> 'StudentController@update'
]);

Route::any('detail/{id}', [
    'uses'=> 'StudentController@detail'
]);

Route::any('delete/{id}', [
    'uses'=> 'StudentController@delete'
]);
```

3、Model
app/Student.php

```php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{

    // 定义常量
    const SEX_NULL = 0;
    const SEX_BOY = 1;
    const SEX_GIRL = 2;

    // 指定表名
    protected $table = 'student';

    // 指定主键
    protected $primaryKey = 'id';

    // 自动维护时间戳字段
    public $timestamps = true;

    // 指定允许批量赋值的字段
    protected $fillable = ['name', 'age', 'sex'];

    // 自定义保存时间戳格式
    public function getDateFormat()
    {
        return time();
    }

    // 解决 Call to a member function format() on string
    public function fromDateTime($val)
    {
        return empty($val) ? $val : $this->getDateFormat();

    }

    // 不自动格式化时间戳
    protected function asDateTime($value)
    {
        return $value;
    }

    public function getSex($key = null)
    {
        $arr = [
            self::SEX_NULL => '未知',
            self::SEX_BOY => '男',
            self::SEX_GIRL => '女',
        ];

        if ($key !== null) {
            return array_key_exists($key, $arr) ? $arr[$key] : $arr[self::SEX_NULL];
        } else {
            return $arr;
        }

    }
}

```

5、控制器
app/Http/Controllers/StudentController.php

```php
namespace App\Http\Controllers;


use App\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{

    function index(Request $request)
    {
        // 分页每页数量
        $students = Student::paginate(20);

        return view('student/index',
            ['students' => $students]
        );
    }

    function create(Request $request)
    {
        if ($request->isMethod('POST')) {

            // 数据验证
            // 1、控制器验证
            // 通过会继续执行
            // 未通过会重定向到上一页面，抛出异常，错误信息存储到Session
            // $this->validate($request, [
            //     'Student.name' => 'required|min:2|max:20',
            //     'Student.age' => 'required|integer',
            //     'Student.sex' => 'required|integer',
            // ], [
            //     'required' => ':attribute 为必填项', // 占位符
            //     'integer' => ':attribute 必须为整数',
            //     'min' => ':attribute 长度不符合要求',
            // ], [
            //     'Student.name' => '姓名',
            //     'Student.age' => '年龄',
            //     'Student.sex' => '性别',
            // ]);

            // 2、Validator验证
            $validator = \Validator::make($request->input(), [
                'Student.name' => 'required|min:2|max:20',
                'Student.age' => 'required|integer',
                'Student.sex' => 'required|integer',
            ], [
                'required' => ':attribute 为必填项', // 占位符
                'integer' => ':attribute 必须为整数',
                'min' => ':attribute 长度不符合要求',
            ], [
                    'Student.name' => '姓名',
                    'Student.age' => '年龄',
                    'Student.sex' => '性别',
                ]
            );

            if ($validator->fails()) {
                // 数据保持
                return redirect()->back()->withErrors($validator)->withInput();
            }

            $data = $request->input('Student');

            // 需要设置模型批量赋值字段
            if (Student::create($data)) {
                return redirect('/')->with('success', '添加成功');
            } else {
                return redirect()->back();
            }

        } else {
            $student = new Student();

            return view('student/create', [
                'student' => $student
            ]);
        }
    }

    function save(Request $request)
    {
        $data = $request->input('Student');
        var_dump($data);
        $student = new Student();
        $student->name = $data['name'];
        $student->age = $data['age'];
        $student->sex = $data['sex'];

        if ($student->save()) {
            return redirect('/');
        } else {
            return redirect()->back();
        }
    }

    function update(Request $request, $id)
    {
        $student = Student::find($id);

        if ($request->isMethod('POST')) {
            $data = $request->input('Student');

            $student->name = $data['name'];
            $student->age = $data['age'];
            $student->sex = $data['sex'];

            if ($student->save()) {
                return redirect('/')->with('success', '修改成功-' . $id);
            }
        } else {
            return view('student/create', [
                'student' => $student
            ]);
        }

    }

    function detail(Request $request, $id)
    {
        $student = Student::find($id);

        return view('student/detail', [
                'student' => $student
            ]);
    }

    function delete(Request $request, $id)
    {
        $student = Student::find($id);

        if($student->delete()){
            return redirect('/')->with('success', '删除成功-' . $id);
        }



    }
}

```
6、视图
(1)公共布局
resources/views/common/layouts.blade.php
```php
<html>
<head>
    <meta charset="UTF-8">
    <title>Document - @yield('title')</title>
    <link rel="stylesheet" href="/css/index.css">
</head>
<body>

@section('header')
    <div>
        <h1>学生管理</h1>
    </div>
@show

<div class="main">
    <div class="container">

        @section('left')

            <p><a href="{{url('/')}}" class="{{Request::getPathInfo() == '/'? 'active': ''}}">学生列表</a></p>
            <p><a href="{{url('/create')}}" class="{{Request::getPathInfo() == '/create'? 'active': ''}}">添加学生</a></p>

        @show
    </div>

    <div class="container">
        @include('common/message')

        @section('right')
            主页
        @show
    </div>
</div>

@section('footer')
    <div>
        @2019
    </div>
@show

</body>
</html>
```

（2）消息组件
resources/views/common/message.blade.php
```php
<div>
    @if(Session::has('success'))
        {{ Session::get('success')}}
    @endif

    @if(count($errors))
        <p>{{$errors->first()}}</p>
    @endif

{{--    @if(count($errors))--}}
{{--        @foreach($errors->all() as $error)--}}
{{--            <p>{{$error}}</p>--}}
{{--        @endforeach--}}
{{--    @endif--}}
</div>
```
（3）首页
resources/views/student/index.blade.php
```php
@extends('common/layouts')

@section('right')


    <table>
        <thead>
        <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>年龄</th>
            <th>性别</th>

            <th>创建日期</th>
            <th>修改日期</th>
            <th>操作</th>


        </tr>
        </thead>

        <tbody>

        @foreach($students as $student)
            <tr>
                <td>{{$student->id}}</td>
                <td>{{$student->name}}</td>
                <td>{{$student->age}}</td>
                <td>{{$student->getSex($student->sex)}}</td>
                <td>{{date('Y-m-d', $student->created_at)}}</td>
                <td>{{date('Y-m-d', $student->updated_at)}}</td>
                <td>
                    <a href="{{url('update', ['id'=> $student->id])}}">修改</a>
                    <a href="{{url('detail', ['id'=> $student->id])}}">详情</a>
                    <a href="{{url('delete', ['id'=> $student->id])}}"
                       onclick="if(confirm('确定删除')===false)return false;">删除</a>
                </td>
            </tr>
        @endforeach
        </tbody>

    </table>

    {{ $students->render() }}
@stop
```

（4）详情页
resources/views/student/detail.blade.php
```php
@extends('common/layouts')

@section('right')
    <table>
        <tr><th>id</th><td>{{$student->id}}</td></tr>
            <tr><th>姓名</th><td>{{$student->name}}</td></tr>
            <tr><th>年龄</th><td>{{$student->age}}</td></tr>
            <tr><th>性别</th><td>{{$student->getSex($student->sex)}}</td></tr>
            <tr><th>添加日期</th><td>{{date('Y-m-d', $student->created_at)}}</td></tr>
            <tr><th>修改日期</th><td>{{date('Y-m-d', $student->updated_at)}}</td></tr>


    </table>
@stop
```

（5）编辑页
resources/views/student/create.blade.php
```php
@extends('common/layouts')

@section('right')
    <div class="form">

    <form action="" method="post">
        {{csrf_field()}}
        <input type="hidden" name="id" value="{{$student->id}}" />

        <p>
            <label for="name">姓名</label>
            <input id="name" name="Student[name]" type="text"
                   value="{{old('Student')['name'] ?  old('Student')['name']: $student->name }}" >
            <span class="error">{{$errors->first('Student.name')}}</span>
        </p>

        <p>
            <label for="age">年龄</label>
            <input id="age" name="Student[age]" type="text"
                   value="{{old('Student')['age']? old('Student')['age']: $student->age }}">
            <span class="error">{{$errors->first('Student.age')}}</span>
        </p>

        <p>
            性别
            @foreach($student->getSex() as $key=> $val)
            <label>
            <input id="sex-man" name="Student[sex]" type="radio" value="{{$key}}"
            {{(old('Student')['sex'] ? old('Student')['sex']: $student->sex) === $key? 'checked': ''}}
            >
                {{$val}}
            </label>
            @endforeach

            <span class="error">{{$errors->first('Student.sex')}}</span>
        </p>

        <p>
            <input type="submit" value="提交">
        </p>
    </form>
    </div>
@stop
```

（6）css文件
public/css/index.scss
```css 
body {
  width: 600px;
  margin: 0 auto;
  text-align: center;
}

.main {
  display: flex;
  width: 100%;

  .container {
    border: 1px solid #DDDDDD;

    a {
      text-decoration: none;
      padding: 3px 5px;

      &:link, &:visited {
        color: #1b1e21;
      }

      &:active {
        color: #1b1e21;
      }

      &:hover, &.active{
        color: #FFFFFF;
        background-color: #DDDDDD;
      }
    }

    .form{
      .error{
        color: red;
        font-size: 12px;
      }
    }
  }

  .pagination {
    ul, li {
      list-style: none;
    }

    display: flex;

    li {
      background-color: #DDDDDD;
      color: #FFFFFF;
      padding: 3px 5px;
      margin: 0 5px;
    }
  }
}

```
## 第3张 总结
Request
Response
Session
Middleware


