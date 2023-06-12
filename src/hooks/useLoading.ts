import { useEffect } from "react";
import { useAgentMethods, useAgentSelector } from "use-agent-reducer";
import { uiRef } from "@/modules/ui";

export const useLoading = (): boolean => {
  const loading = useAgentSelector(uiRef.current, (s) => s.pageLoading);
  const { setPageLoading } = useAgentMethods(uiRef.current);
  useEffect(
    () =>
      function destroy() {
        setPageLoading(false);
      },
    []
  );

  return loading;
};
