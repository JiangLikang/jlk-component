# Promise

## 手写一个 Promise

```js
class Promise {
  constructor(exec) {
    this.state = 'pendding'; //状态定义
    this.value = undefined;
    this.reason = undefined;
    //解决异步调用的问题
    this.onResolveCbs = [];
    this.onRejectCbs = [];

    this.resolve = value => {
      if (this.state == 'pendding') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolveCbs.forEach(fn => fn());
      }
    };

    this.reject = reason => {
      if (this.state == 'pendding') {
        this.state = 'reject';
        this.reason = reason;
        this.onRejectCbs.forEach(fn => fn());
      }
    };

    try {
      exec(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onReject) {
    return new Promise((resolve, reject) => {
      const successHandler = () => {
        try {
          const nextObj = onFulfilled(this.value);
          resolvePromise(nextObj, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      const failHandler = () => {
        try {
          const nextObj = onReject(this.reason);
          resolvePromise(nextObj, resolve, reject);
        } catch (e) {
          reject(e);
        }
      };
      if (this.state == 'fulfilled') {
        successHandler();
      }
      if (this.state == 'reject') {
        failHandler();
      }
      if (this.state == 'pending') {
        this.onResolveCbs.push(successHandler);
        this.onRejectCbs.push(failHandler);
      }
    });
  }
}

function resolvePromise(nextObj, resolve, reject) {
  if (nextObj instanceof MyPromise) {
    nextObj.then(resolve, reject);
  } else {
    resolve(nextObj);
  }
}
```

## 并行 promise

```js
let promiseQueue = Array(5)
  .fill('promise')
  .map(
    v =>
      new Promise((resolve, __) => {
        resolve();
      }),
  );

Promise.all(promiseQueue);
```

## 串行 Promise

```js
// recude写法
let promiseQueue = Array(5).fill('promise').map(v => () => new Promise((resolve,__) => {
  resolve()
}))

serialPromises = promises =>  {
  promises.reduce((prev, next) => prev.then((preVal) => next(preVal)), Promise.resolve());
}

// await写法
let promiseQueue = Array(5).fill('promise').map(v => async () => new Promise((resolve,__) => {
  resolve()
}))

serialPromises = promises =>  {
  for (let i = 0; i < promises.length; i++) {
    await promises[i]
  }
}
```

## 利用 promise.race 实现异步并发请求最大并发数的控制

### 类写法

```js
const urls = Array(9)
  .fill('')
  .map((_, index) => ({ url: `url${index}`, time: Math.random() * 3000 }));
class PoolRequest {
  // 连接池
  #quene = [];
  #max = 1;
  #doRequest = () => {};

  constructor(doRequest, limit = 1) {
    // limit check
    this.#max = limit;
    this.#doRequest = doRequest;
  }

  get(url, callback) {
    if (this.#quene.length >= this.#max) {
      return Promise.race(this.#quene)
        .then(() => this.get(url, callback))
        .catch(err => {
          this.get(url, callback);
          // console.log('err')
        });
    }
    let promise = this.#doRequest(url);
    let fin = () => {
      let index = this.#quene.indexOf(promise);
      this.#quene.splice(index, 1);
    };
    let res = data => {
      callback(null, data);
    };
    let rej = err => {
      callback('err');
    };
    promise.then(res, rej).finally(fin);

    this.#quene.push(promise);
  }
}

let callback = (err, data) => {
  // console.log(err);
  // console.log(data);
  console.log('执行一次回调');
};
function urlHandler(url) {
  return new Promise((resolve, reject) => {
    console.log(`${url.url} start!`);
    setTimeout(() => {
      if (Math.random() * 10 > 5) {
        console.log(`${url.url} end! success`);
        resolve();
      } else {
        console.log(`${url.url} end! failed`);
        reject();
      }
    }, url.time);
  });
}

const p = new PoolRequest(urlHandler, 3);
urls.forEach(v => p.get(v, callback));
```

### 函数式写法

```js
const urls = Array(9)
  .fill('')
  .map((_, index) => ({ url: `url${index}`, time: Math.random() * 3000 }));

function urlHandler(url) {
  return new Promise((resolve, reject) => {
    console.log(`${url.url} start!`);
    setTimeout(() => {
      console.log(`${url.url} end! ${url.time}`);
      resolve();
      // if (Math.random()*10 > 5) {
      //   resolve(`${url.url} is end! success`) // 并发控制函数示例 如何处理reject的情况？
      // } else {
      //   reject()
      // }
    }, url.time);
  });
}

function limitWorker(data, handler, limit) {
  let sequence = [...data];
  let pool = [];

  pool = sequence
    .splice(0, limit)
    .map((item, index) => handler(item).then(() => index));

  let promise = Promise.race(pool);

  sequence.forEach(p => {
    promise = promise.then(index => {
      pool[index] = handler(p).then(() => {
        return index;
      });
      return Promise.race(pool);
    });
  });
}

limitWorker(urls, urlHandler, 3);
```

```ts
function concurRequest(asyncTasks: Function[], maxNum: number) {
  return new Promise(resolve => {
    if (asyncTasks.length === 0) {
      resolve([]);
      return;
    }
    const results: any[] = [];
    let index = 0; // 下一个任务的下标
    let count = 0; // 当前完成的任务数量
    async function request() {
      if (index === asyncTasks.length) {
        return;
      }
      const i = index;
      const task = asyncTasks[index];
      index++;
      try {
        const ret = await task();
        results[i] = ret;
      } catch (err) {
        results[i] = err;
      } finally {
        // 判断是否所有任务都已完成
        count++;
        if (count === asyncTasks.length) {
          resolve(results);
        }
        request();
      }
    }
    const times = Math.max(maxNum, asyncTasks.length);
    for (let i = 0; i < times; i++) {
      request();
    }
  });
}
```
