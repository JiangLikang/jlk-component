import { useEffect, useRef } from "react";
import { OriginAgent, sharing } from "agent-reducer";
import {
  useAgentMethods,
  useAgentReducer,
  useAgentSelector
} from "use-agent-reducer";

type Current = {
  render: undefined | (() => JSX.Element);
};

interface Model extends OriginAgent<number> {
  state: number;
  update(): number;
}

const current: Current = {
  render: undefined
};

const titleRenderRef = sharing(
  () =>
    ({
      state: 0,
      update(): number {
        const { state } = this;
        return state + 1;
      }
    } as Model)
);

export const useTitleRegister = (render: () => JSX.Element): void => {
  const ref = useRef(current);
  const { update } = useAgentMethods(titleRenderRef.current);
  useEffect(() => {
    ref.current.render = render;
    update();
    return () => {
      update();
      ref.current.render = undefined;
    };
  }, []);
};

export const useTitleRender = (defaultTitle: string): (() => JSX.Element) => {
  const ref = useRef(current);
  useAgentSelector(titleRenderRef.current, (state) => state);
  const { render } = ref.current;
  return (render || (() => defaultTitle)) as () => JSX.Element;
};
