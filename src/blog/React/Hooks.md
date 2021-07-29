# Hooks

## useMemo useCallback React.memo()

目的： 性能优化

useMemo 返回一个值，useCallback 返回一个函数，这个函数或值在依赖变化之前，依旧指向最初的状态。

React.memo()可接受 2 个参数，
第一个参数为纯函数的组件。
第二个参数用于对比 props 控制是否刷新，与 shouldComponentUpdate()功能类似。

```js
React.memo(Child, (preProps, nextProps) => {});
```

## useRef

useRef 会在每次渲染时返回`同一个ref对象`，即返回的 ref 对象在组件的整个生命周期内保持不变。

- 可以使用 useRef 来跨越渲染周期存储数据，而且`对它修改也不会引起组件渲染`。

```js
import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function App(props) {
  const [count, setCount] = useState(0);

  const doubleCount = useMemo(() => {
    return 2 * count;
  }, [count]);

  const timerID = useRef();

  useEffect(() => {
    timerID.current = setInterval(() => {
      //本质上，useRef就是一个其.current属性保存着一个可变值“盒子”。
      setCount(count => count + 1); // 你可以用它来保存dom，对象等任何可变值。
    }, 1000);
  }, []);

  useEffect(() => {
    if (count > 10) {
      clearInterval(timerID.current);
    }
  });

  return (
    <>
      <button
        ref={couterRef}
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Count: {count}, double: {doubleCount}
      </button>
    </>
  );
}
```

## useReducer

尽管 useReducer 是扩展的 hook， 而 useState 是基本的 hook，但 useState 实际上执行的也是一个 useReducer。`这意味着 useReducer 是更原生的`，你能在任何使用 useState 的地方都替换成使用 useReducer

在某些场景下，useReducer 会比 useState 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。并且，使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数（利用 useContext） 。

```js
const [items, dispatch] = useReducer((state, { type, payload }) => {
  switch (
    type
    // do something with the action
  ) {
  }
}, []);
```

```js
const TodosDispatch = React.createContext(null);

function TodosApp() {
  // 提示：`dispatch` 不会在重新渲染之间变化
  const [todos, dispatch] = useReducer(todosReducer);

  return (
    <TodosDispatch.Provider value={dispatch}>
      <DeepTree todos={todos} />
    </TodosDispatch.Provider>
  );
}

function DeepChild(props) {
  // 如果我们想要执行一个 action，我们可以从 context 中获取 dispatch。
  const dispatch = useContext(TodosDispatch);

  function handleClick() {
    dispatch({ type: 'add', text: 'hello' });
  }

  return <button onClick={handleClick}>Add todo</button>;
}
```
