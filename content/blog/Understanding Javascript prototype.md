---
title: 我理解的Javascript原型
dates:
  published: "2024-02-21"
description: 通过对象字面量与构造函数的方式来创建对象理解原型链，类是构造函数的语法糖，类之间的继承extend是构建原型链的一种方式。
picture: '/fox.png'

---


js只有对象类型才会有原型，原型链是Js实现继承的主要方式，这里通过两种对象创建方法来理解原型。

- 对象字面量

- 使用new操作符调用构造函数

### 对象字面量

```javascript
const coffee = {
  taste: "苦",
};
//它的原型是什么？
console.log(coffee.__proto__ === Object.prototype);//true
console.log(Object.getPrototypeOf(coffee) === Object.prototype);//true
```

这里：

- `coffee.__proto__`链接到`coffee`的原型,实际上指向隐藏特性`[[Prototype]]`。
- `Object.getPrototypeOf(coffee)`,两种方法都可以获取对象的原型，这样获取是推荐的。

那么， `Object.prototype`是什么呢？它是最基础的原型，所有对象默认都拥有它。并且

```javascript
console.log(Object.prototype.__proto__ === null);//true
```

现在，来看看咖啡☕️的原型！

```javascript
const coffee = {
  taste: "苦",
};
const water = {
  taste: "无味",
};
Object.setPrototypeOf(coffee, water)//设置water实例为coffee的原型
console.log(Object.getPrototypeOf(coffee));//获取coffee的原型，就是water
console.log(Object.getPrototypeOf(Object.getPrototypeOf(coffee)));//获取water的原型，就是Object.prototype
console.log(Object.getPrototypeOf(Object.getPrototypeOf(Object.getPrototypeOf(coffee))));//获取Object.prototype的原型，就是null
//此时的原型链  coffee -> water -> Object.prototype -> null，访问属性时也会按照原型链依次查找
```

<!-- > ⚠️这里是我之前自己疑惑，可看可不看，现在只要知道原型链就行。
> `coffee[[Prototype]]`即coffee的原型是water，那么`water[[Prototype]]`应该是`Object`啊,为什么是`Object.prototype`?
>
> ```javascript
> console.log(Object.getPrototypeOf(coffee) === water);//true
> console.log(Object.getPrototypeOf(water) === Object.prototype);//true
> ``` -->

### 使用new操作符调用构造函数

老板，你这咖啡☕️都有什么辅料啊？

```javascript
function Coffee() {
  this.ingredient = ['咖啡']
}
Coffee.prototype.add = function (val) {//给Coffee函数添加原型方法
  this.ingredient.push(val)
}

const milkCoffee = new Coffee();
milkCoffee.add('奶');// ---milkCoffee.ingredient=['咖啡','奶']
// const sugarCoffee = new Coffee()
// sugarCoffee.add('糖')  ---sugarCoffee.ingredient=['咖啡','糖']

console.log(Object.getPrototypeOf(milkCoffee) === Coffee.prototype);//true
console.log(milkCoffee.__proto__.__proto__ === Object.prototype);//true
// 原型链1: 构造函数构造出来的对象的原型链，重点在于对象！  
//milkCoffee --> Coffee.prototype --> Object.prototype --> null
console.log(Object.getPrototypeOf(Coffee) === Function.prototype);//true
console.log(Coffee.__proto__.__proto__ === Object.prototype);//true
// 原型链2: 构造函数本身的原型链，重点在于构造函数！
//Coffee --> Function.prototype --> Object.prototype -->null
```

- PS. 构造函数不只一条原型链。
- PPS.`__proto__`是非标准，不推荐的，这里使用只是使链式更明显，推荐只用`Object.getPrototypeOf()`方法来访问原型。

参考链接：

[MDN-对象学习](https://developer.mozilla.org/zh-CN/docs/Learn/JavaScript/Objects/Object_prototypes#%E5%8E%9F%E5%9E%8B%E9%93%BE){target="_blank" rel="noopener noreferrer"}

[MDN-继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#%E5%9F%BA%E4%BA%8E%E5%8E%9F%E5%9E%8B%E9%93%BE%E7%9A%84%E7%BB%A7%E6%89%BF){target="_blank" rel="noopener noreferrer"}

[stackoverflow](https://stackoverflow.com/questions/74687668/what-is-the-prototype-chain-for-a-function-constructor){target="_blank" rel="noopener noreferrer"}

[JavaScript高级程序设计（第4版）](https://book.douban.com/subject/35175321/){target="_blank" rel="noopener noreferrer"}
