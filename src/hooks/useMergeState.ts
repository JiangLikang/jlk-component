import { useCallback } from 'react';
import useSafeState from './useSafeState';
import { isFunction } from './utils';

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null),
) => void;

// 管理 object 类型 state 的 Hooks，用法与 class 组件的 this.setState 基本一致。
// 集成了安全修改数据的机制，详见：useSafeState
const useMergeState = <S extends Record<string, any>>(
  initialState: S | (() => S),
): [S, SetState<S>] => {
  const [state, setState] = useSafeState<S>(initialState);

  const setMergeState = useCallback((patch) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  }, []);

  return [state, setMergeState];
};

export default useMergeState;
