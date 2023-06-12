import type { DependencyList } from 'react';
import { useRef } from 'react';
import depsAreSame from './utils/depsAreSame';

// useMemo 或 useRef 的替代品。
// useMemo存在的问题：useMemo 不能保证被 memo 的值一定不会被重计算。
// useRef存在的问题：对于复杂常量的创建，useRef 却容易出现潜在的性能隐患。
// const instance = useRef(new Subject()) // 每次重渲染，都会执行实例化 Subject 的过程，即便这个实例立刻就被扔掉了
export default function useCreation<T>(factory: () => T, deps: DependencyList) {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = factory();
    current.initialized = true;
  }
  return current.obj as T;
}
