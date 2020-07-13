###### JavaScript中数组处理方法简单介绍

forEach(),map(),filter(),find(),every(),some(),reduce()

`Array`对象提供了多个方法方便我们遍历数据，使得代码更加简洁、易读

- `Array.prototype.forEach()`
- `Array.prototype.map()`
- `Array.prototype.filter()`
- `Array.prototype.find()`
- `Array.prototype.every()`
- `Array.prototype.some()`
- `Array.prototype.reduce()`







1. **forEach()**

该方法没有返回值，或者说返回`undefined`，对数组的每个元素执行一次回调函数。

无法break中途跳出循环，不可控，不支持return操作输出  

```javascript
var array = [1, 2, 3, 4, 5];
// 遍历数组中的每一项，不对原来数组进行修改
array.forEach(function(item, index) {
  console.log(item); // 1 2 3 4 5
});

// 可以自己通过数组的索引来修改原来的数组
var ret = array.forEach(function (item,index,input) {  
       input[index] = item * 10;  
})  
console.log(ret); // undefined;  
console.log(array); // [10, 20, 30, 40, 50]
```







2. **map()**

`map()`返回一个新的数组，由数组遍历时执行回调函数的返回值组成。

不会对空数组进行检测，不会改变原始数组

```javascript
var array = [1, 2, 3, 4, 5];
var map1 = array.map(function(item){
    return item * 2;
});
// [2, 4, 6, 8, 10]
```







3. **filter()**

对于数组中的每个元素，`filter()`都会调用回调 函数一次（采用升序索引顺序），返回一个由原数组中满足回调函数里指定条件的元素组成的新数组。不为数组中缺少的元素调用该回调函数。

```javascript
var array = [1, 2, 3, 4, 5];
var newArr = array.filter(item => item >= 3);
// [3, 4, 5]

var array1 = [{name: name1, age: 18}, {name: name2, age: 20}]
var newArr1 = array1.filter(item => item.age > 18);
// {name: name2, age: 20}
```







4. **find()**

`find()` 返回数组中第一个符合条件的元素，当已找到符合条件的元素，之后的值不会再调用回调函数。如果没有符合条件的元素则返回 `undefined`。

```javascript
var array = [1, 2, 3, 4, 5];
// 找到大于等于3的元素
array.find(item => item >= 3);
// 3
```







5. **every()**

用于检测数组所有元素是否都符合回调函数内指定的条件。如果数组中检测到有一个元素不满足，则整个表达式返回 `false`，且剩余的元素不会再进行检测。如果所有元素都满足条件，则返回 `true`。

```javascript
var array = [1, 2, 3, 4, 5];
array.every(item => item > 0);
// true
array.every(item => item > 3);
// false
```







6. **some()**

和`every()`的功能相似，判断数组中是否至少有一个元素满足条件,只要有一个满足就返回 `true` 只有都不满足时才返回`false`

```javascript
var array = [1, 2, 3, 4, 5];
array.some(item => item > 3);
// true
```







7. reduce()

> `reduce()` 方法对数组中的每个元素执行一个由您提供的**reducer**函数(升序执行)，将其结果汇总为单个返回值。
> 
> `arr.reduce(callback,[initialValue])`
> 
> callback 执行数组中每个值的函数，有四个参数：
> accumulator 上一次调用回调返回的值，或者是提供的初始值(initialValue)
> currentValue 数组中正在处理的当前元素
> currentIndex 数组中正在处理的当前元素的索引。如果提供了initialValue，从0开始；否则从1开始
> array 调用reduce的数组
> initialValue 可选，其值用于第一次调用 callback 的第一个参数

```javascript
var array = [1, 2, 3, 4, 5];
var reducer = (accumulator, currentValue) => accumulator + currentValue;
// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15

// 二维数组合并成一维数组
var data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
var result = data.reduce((prev, current) => {
  return [...prev, ...current];
}, []);
console.log(result); 
// [1, 2, 3, 4, 5, 6, 7, 8, 9]

// 可以用来对数组进行切片
function chunk(arr, size) {
    return arr.reduce((newarr, _, i) => (i % size ? newarr : [...newarr, arr.slice(i, i + size)]), []);
}
```
