---
title: javascript中的事件循环
dates:
  published: "2024-02-29"
description: 事件循环总是理解不够全面，我想我现在理清了。
picture: '/elon_musk.png'
---



首先，介绍函数的执行栈，它是事件循环的一部分，把它理解好，就不会与之后的事件队列搞混。

### 函数执行栈

栈（stack）是一种**后进先出（LIFO，Last In First Out）**的线性数据结构。

举例：

```js
function multiply(a, b) {
  return a * b;
}
function square(n) {
  return multiply(n, n);
}
function printSquare(n) {
  let squared = square(n);
  console.log(squared);
}

printSquare(4);
```

![my image](/bolgImg/EventLoop/1.png){width=50% height=50%}

1. 首先`main()`入栈；
2. 执行`printSquare(4)`,`printSquare(4)`入栈；
3. 读取`let squared = square(n);`时，执行`square(n)`,`square(n)`入栈；
4. `square(n)`函数内，执行`multiply(n, n)`,同样入栈；
5. `multiply(a, b)`函数内，没有其他函数了，开始return（multiply --> square -->  console.log --> printSquare --> main )，同时出栈（Pop）。

注：console.log没有返回，默认返回undefined。

### 事件队列

队列（`queue`）是一种遵循“**先进先出**”原则（First In First Out，简称FIFO）的线性存储结构。

同时，在这里引入**宏任务**与**微任务**：

- 每个宏任务之后，引擎会立即执行微任务队列中的所有任务，然后再执行其他的宏任务，或渲染，或进行其他任何操作。
- Q：宏任务有哪些？A：`setTimeout`，`setInterval`， `setImmediate`， `I/O`， `UI rendering`。
- Q：微任务有哪些？A： `process.nextTick`，`Promises.then`。

### 事件循环

看以下代码：

```js
console.log('Hi! Nero Bag!');
setTimeout(function () {
  console.log('Today I ate eggs.');
}, 5000)
console.log('Tomorrow I will eat beef!');

/*输出
Hi! Nero Bag!
Tomorrow I will eat beef!
（5s后）Today I ate eggs.
*/
```

Q：js是单线程的，运行时一次只能做一件事，那这里的输出应该是`Hi! Nero Bag!`之后等待5秒然后输出`Today I ate eggs.`最后输出`Tomorrow I will eat beef!`吗？

来看图（二张图差不多）：

![my image](/bolgImg/EventLoop/2.png){width=50% height=50%}

![my image](/bolgImg/EventLoop/3.png){width=50% height=50%}


- js发起异步函数（setTimeout，ajax）时，它都会被发送到*浏览器 API（WebApis）*，API 充当**单独的线程**将操作发送到事件队列。现在不是有两个线程了吗?一个js的，另一个浏览器的，是不是可以异步了？

回头看之前的代码：

```js
console.log('Hi! Nero Bag!');
setTimeout(function () {
  console.log('Today I ate eggs.');
}, 5000)
console.log('Tomorrow I will eat beef!');
```

1. 首先`main()`入栈，执行第一个宏任务（代码一开始就是一个宏任务）；

2. `console.log('Hi! Nero Bag!')`入栈，打印*Hi! Nero Bag!*，出栈；

3. `setTimeout`直接去调用浏览器API，由API执行后，将结果放入事件队列；而`setTimeout`是一个宏任务，放入宏任务队列；

    > 注意：这里我自己把事件队列分为了宏任务队列和微任务队列，这样我能理解，但是我没看到官方明确说要把事件队列分为两个。

4. `console.log('Tomorrow I will eat beef!')`入栈，打印*Tomorrow I will eat beef!*，出栈；

5. `main()`出栈，栈为空，第一次循环结束！开始从事件队列里把`function () { console.log('Today I ate eggs.')`放入栈中，打印*Today I ate eggs*，出栈，此时，事件队列为空，栈为空，over！

注意点：

- 只有栈为空时，事件队列里的操作才会按顺序一个一个执行。
- 每一次循环，都会有宏任务接着微任务，宏任务总是在微任务的前面。

再来看一个比较复杂的例子：

```js
console.log(1);

setTimeout(() => console.log(2));

Promise.resolve().then(() => console.log(3));

Promise.resolve().then(() => setTimeout(() => console.log(4)));

Promise.resolve().then(() => console.log(5));

setTimeout(() => console.log(6));

console.log(7);
// 1 7 3 5 2 6 4
```

1. `main()`入栈，`console.log(1)`入栈，打印*1*，出栈；
2. `setTimeout`发送给浏览器API，浏览器API再发送给事件队列的宏任务队列；
3. `Promise.resolve().then()`是微任务，进入事件队列的微任务队列；
4. `Promise.resolve().then()`是微任务，进入事件队列的微任务队列,此时的微任务队列（`console.log(3)`，`setTimeout(() => console.log(4))`）;
5. `Promise.resolve().then()`是微任务,此时的微任务队列（`console.log(3)`，`setTimeout(() => console.log(4))`，`console.log(5)`）;
6. `setTimeout`发送给浏览器API，浏览器API再发送给事件队列的宏任务队列；此时的宏任务队列（ `console.log(2)`， `console.log(6)`）;
7. `console.log(7)`入栈，打印*7*，出栈；
8. 开始执行第一次循环的微任务，（不要忘了代码一开始就是一个宏任务），打印*3*；
9. ``setTimeout(() => console.log(4))``发送给浏览器API，浏览器API再发送给事件队列的宏任务队列；此时宏任务队列（ `console.log(2)`， `console.log(6)`，`console.log(4)`）;
10. `console.log(5)`入栈，打印*5*，出栈；
11. `main()`出栈，栈为空，第一次循环结束；开始从宏任务队列向栈中按顺序压栈（push）；
12. `console.log(2)`入栈，打印*2*，出栈；
13. `console.log(6)`入栈，打印*6*，出栈；
14. `console.log(4)`入栈，打印*4*，出栈；栈为空，队列（包括宏队列与微队列）为空，over。

参考链接：

[事件循环：微任务和宏任务](https://zh.javascript.info/event-loop#hong-ren-wu-he-wei-ren-wu){target="_blank" rel="noopener noreferrer"}

[JavaScript 中的事件循环是什么？](https://www.educative.io/answers/what-is-an-event-loop-in-javascript){target="_blank" rel="noopener noreferrer"}

[菲利普·罗伯茨：到底什么是Event Loop呢？](https://www.youtube.com/watch?v=8aGhZQkoFbQ){target="_blank" rel="noopener noreferrer"}