# JS 设计模式

## 观察者模式

```js
// 创建对象
var targetObj = {
  name: '小李',
};
var targetObj2 = {
  name: '小李',
};
// 定义值改变时的处理函数（观察者）
function observer(oldVal, newVal) {
  // 其他处理逻辑...
  targetObj2.name = newVal;
  console.info('targetObj2的name属性的值改变为 ' + newVal);
}

// 定义name属性及其set和get方法（name属性为被观察者）
Object.defineProperty(targetObj, 'name', {
  enumerable: true,
  configurable: true,
  get: function() {
    return name;
  },
  set: function(val) {
    //调用处理函数
    observer(name, val);
    name = val;
  },
});

targetObj.name = '张三';
targetObj.name = '李四';
console.log(targetObj2.name); //targetObj2的name属性的值改变为 李四
```

## 工厂模式

```js
let a = new Promise();
```
