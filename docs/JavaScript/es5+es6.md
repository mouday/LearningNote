
示例使用的数组
```js
var arr = [1, 2, 3];
```

## ES5 数组方法

不改变原数组
函数 | 说明 | 示例
-| - | -
Array.isArray()  | 判断一个值是否为数组 | `Array.isArray(arr); // true`
valueOf()  | 返回数组本身 | `arr.valueOf(); // [1, 2, 3]`
toString() | 返回数组的字符串形 | `arr.toString(); // "1,2,3"`
join() | 返回数组成员拼接后的字符串，默认逗号分隔| `arr.join("-"); // "1-2-3"`
concat() | 返回一个多个数组合并后的新数组 | `arr.concat([4, 5], 6); // [1, 2, 3, 4, 5, 6]`
slice() | 返回切片后的新数组 | `arr.slice(start, end);`
forEach() | 遍历数组的所有成员 | `arr.forEach((element, index, arr)=> {return element;});`
map() | 映射新数组 | `arr.map((element, index, arr)=> {return element;});`
filter() | 返回过滤后的新数组 | `arr.filter((element)=> {return true;});`
some() | 一个为true就返回true | `arr.some((element, index, arr)=> {return true;});`
every() | 所有为true才返回true | `arr.every((element, index, arr)=> {return true;});`
reduce()| 从左到右处理 | `arr.reduce((total, element, index, arr)=> {return total + element;});`
reduceRight() | 从右到左处理 | `arr.reduceRight((total, element, index, arr)=> {return total + element;});`
indexOf()| 开头查找元素，没有返回-1 | `arr.indexOf(1); // 0`
lastIndexOf() | 尾部查找元素，没有返回-1 | `arr.lastIndexOf(1); //0`


改变原数组
函数 | 说明 | 示例
-| - | -
push() | 数组尾部添加元素，并返回数组长度 | `arr.push(1, 2); // 5`
pop() | 删除数组的最后一个元素，并返回该元素 | `arr.pop(); // 3`
unshift() | 数组头部添加元素，并返回数组长度 | `arr.unshift('a'); //4`
shift() | 删除数组的第一个元素，并返回该元素 | `arr.shift(); // 1`
reverse() | 返回颠倒顺序后的数组 | `arr.reverse(); // [3, 2, 1]`
splice() | 删除数组成员，并添加的数组成员，返回被删除的元素 | `arr.splice(start, deleteCount, ...itmes)`
sort() | 数组排序| `arr.sort(); //[1, 2, 3]`

## ES6 数组方法
函数 | 说明 | 示例
-| - | -
Array.from() | 类数组转换成数组  |`Array.from('123'); // ["1", "2", 3"]`
Array.of() | 将一组值，转换为数组 | `Array.of(1, 2, 3); // [1, 2, 3]`
copyWithin() | 返回替换后的数组 |  `arr.copyWithin(target, start, end)`
find() | 查找元素，没有返回undefined | `arr.find((item)=>item===1)`
findIndex() | 查找元素位置，没有返回-1 | `arr.findIndex((item)=>item===1)`
fill() | 填充一个数组|  `[1, 2, 3].fill(0); // [0, 0, 0]`
entries() | 返回键值对 | arr.entries()
keys() | 返回键 | arr.keys()
values() 返回值 | arr.values()
includes() | 是否包含给定的值 | `arr.includes(1); // true`

## 扩展运算符
(1)函数调用
```js
// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

(2)复制数组
```js
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```
（3）合并数组
```js
// ES5
[1, 2].concat([4, 5])

// ES6
[1, 2, ...[4, 5]]
```
(4)解构赋值
```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```

>参考
>[JS Array对象的方法总结（ES5 与 ES6） 二](https://www.cnblogs.com/z-dl/p/8242960.html)
