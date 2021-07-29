## Redux

React 数据层解决方案

适用场景： 多交互、多数据源。

## Store

数据保存的地方

```js
import { createStore } from 'redux';
const store = createStore(fn);
```

## State

```js
const state = store.getState();
```

## Action

```js
const action = {
  type: 'ADD_TODO',
  payload: 'Learn Redux',
};
```

## store.dispatch()

## Reducer

State 的计算过程就叫做 Reducer。
Reducer 函数最重要的特征是，它是一个纯函数。

```js
(state = defaultState, action) => {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    default:
      return state;
  }
};
```

## store.subscribe()

监听器
一旦 State 发生变化，就自动执行这个函数。

```js
import { createStore } from 'redux';
const store = createStore(reducer);

store.subscribe(listener);
```

`store.subscribe`方法返回一个函数，调用这个函数就可以解除监听。

```js
let unsubscribe = store.subscribe(() => console.log(store.getState()));

unsubscribe();
```

## 异步解决方案 - 中间件

```js
import { applyMiddleware, createStore } from 'redux';
import createLogger from 'redux-logger';
const logger = createLogger();

const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(logger), //Redux 的原生方法，作用是将所有中间件组成一个数组，依次执行。
);
```

## connect

```js
import { connect } from 'react-redux';

const VisibleTodoList = connect(mapStateToProps, mapDispatchToProps)(TodoList);
```
