# Web Worker

## 什么是 Web Worker？

### 背景

JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

### 诞生

Web Worker 的作用，就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。

## 优势

一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢。

> Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断。这样有利于随时响应主线程的通信。但是，这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

## 限制

### 同源限制

分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。

### DOM 限制

Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用`document`、`window`、`parent`这些对象。但是，Worker 线程可以`navigator`对象和`location`对象。

### 通信联系

Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。

### 脚本限制

Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。

### 文件限制

Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

## 基本用法

### 创建实例 Worker

主线程采用`new`命令，调用`Worker()`构造函数，新建一个 Worker 线程。

```js
var worker = new Worker('work.js');
```

`Worker()`构造函数的参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务。由于 Worker 不能读取本地文件，所以这个脚本必须来自网络。如果下载没有成功（比如 404 错误），Worker 就会默默地失败。

然后，主线程调用`worker.postMessage()`方法，向 Worker 发消息。

### 发送消息 postMessage

postMessage(data,origin)方法接受两个参数：

1. data:要传递的数据，html5 规范中提到该参数可以是 JavaScript 的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用`JSON.stringify()`方法对对象参数序列化，在低版本 IE 中引用 json2.js 可以实现类似效果，

2. origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL 会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将 message 传递给指定窗口，当然如果愿意也可以建参数设置为"\*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"；

```js
worker.postMessage('Hello World');
worker.postMessage({ method: 'echo', args: ['Work'] });
```

接着，主线程通过`worker.onmessage`指定监听函数，接收子线程发回来的消息。

### 接受消息 onmessage

```js
worker.onmessage = function(event) {
  console.log('Received message ' + event.data);
  doSomething();
};

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!');
}
```

上面代码中，事件对象的`data`属性可以获取 Worker 发来的数据。

Worker 完成任务以后，主线程就可以把它关掉。

### 关闭 Worker terminate/close

```js
// 主线程
worker.terminate();

// worker线程
self.close();
```

> `self`代表子线程自身，即子线程的全局对象。

## Worker 加载脚本

Worker 内部如果要加载其他脚本，有一个专门的方法`importScripts()`。

```js
importScripts('script1.js');
importScripts('script1.js', 'script2.js');
```

## 错误处理

主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的`error`事件。

```js
worker.onerror(function(event) {
  console.log(
    ['ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join(''),
  );
});

// 或者
worker.addEventListener('error', function(event) {
  // ...
});
```

## 数据通信

主线程与 Worker 之间的通信内容，可以是文本，也可以是对象。需要注意的是，这种通信是拷贝关系，即是传值而不是传址，Worker 对通信内容的修改，不会影响到主线程。事实上，浏览器内部的运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原。

线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送。

但是，拷贝方式发送二进制数据，会造成性能问题。比如，主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝。为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面。这种转移数据的方法，叫做`Transferable Objects`。这使得主线程可以快速把数据交给 Worker，对于影像处理、声音处理、3D 运算等就非常方便了，不会产生性能负担。

如果要直接转移数据的控制权，就要使用下面的写法。

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer]);

// 例子
var ab = new ArrayBuffer(1);
worker.postMessage(ab, [ab]);
```

## 同一个页面的 Web Worker

通常情况下，Worker 载入的是一个单独的 JavaScript 脚本文件，但是也可以载入与主线程在同一个网页的代码。

```html
<!DOCTYPE html>
  <body>
    <script id="worker" type="app/worker">
      addEventListener('message', function () {
        postMessage('some message');
      }, false);
    </script>
  </body>
</html>
```

上面是一段嵌入网页的脚本，注意必须指定`<script>`标签的 type 属性是一个浏览器不认识的值，上例是`app/worker`。

然后，读取这一段嵌入页面的脚本，用 Worker 来处理。

```js
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function(e) {
  // e.data === 'some message'
};
```

上面代码中，先将嵌入网页的脚本代码，转成一个二进制对象，然后为这个二进制对象生成 URL，再让 Worker 加载这个 URL。这样就做到了，主线程和 Worker 的代码都在同一个网页上面。

函数式写法:

```js
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var worker = createWorker(() => {
  //  ...Web Worker task
});

worker.onmessage = e => {
  console.log(e.data);
};
```

## 共享线程 SharedWorker

共享线程是为了避免线程的重复创建和销毁过程，降低了系统性能的消耗，共享线程 SharedWorker 可以同时有多个页面的线程链接。

使用 SharedWorker 创建共享线程，也需要提供一个 javascript 脚本文件的 URL 地址或 Blob,该脚本文件中包含了我们在线程中需要执行的代码，如下：

```js
var worker = new SharedWorker('sharedworker.js');
```

共享线程也使用了 message 事件监听线程消息，但使用 SharedWorker 对象的 port 属性与线程通信如下。

```js
worker.port.onmessage = function(e){
    ...
}
```

同时我们也可以使用 SharedWorker 对象的 port 属性向共享线程发送消息如下。

```js
worker.port.postMessage('message');
```

### 使用 SharedWorker

1. ShareWorker.js

```js
var clients = [];
onconnect = function(e) {
  var port = e.ports[0];
  clients.push(port);
  port.addEventListener('message', function(e) {
    for (var i = 0; i < clients.length; i++) {
      var eElement = clients[i];
      eElement.postMessage(e.data);
    }
  });
  port.start();
};
```

2. 在需要推送的页面里面添加开启共享线程的代码。

```js
myWorker = new SharedWorker('ShareWorker.js');
myWorker.port.onmessage = function(e) {
  var result = e.data; //此处就是共享现成推送过来的数据可以是字符串、数组、json
  /***********上面拿到数据后，就可以在下面做一些你想造做的事************/
};

myWorker.port.postMessage(newData);
```
