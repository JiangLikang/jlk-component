/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/*
 * @lastTime: 2021-03-05 15:29:11
 * @Description: 同步hooks，用于解决hook的闭包弊端，保证被代理的函数在调用时拿到的state永远是最新的state，其原理是将被代理的函数的执行时机放在useEffect中。
 */

import { useEffect, useState, useCallback } from 'react';

const useSyncCallback = (callback: any) => {
  const [proxyState, setProxyState] = useState({ current: false });

  const Func = useCallback(() => {
    setProxyState({ current: true });
  }, [proxyState]);

  useEffect(() => {
    if (proxyState.current === true) setProxyState({ current: false });
  }, [proxyState]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    proxyState.current && callback();
  });

  return Func;
};

export default useSyncCallback;
/*
 * @lastTime: 2021-02-26 15:29:11
 * @param: callback为回调函数
 * @Description: 用法 const newFunc = useSyncCallback(yourCallback)
 */
