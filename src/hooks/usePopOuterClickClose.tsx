import React, { useEffect, useRef } from "react";

const usePopOuterClickClose = (closeMethod: () => any) => {
  const popOuterClickCloseRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hide = (event: MouseEvent) => {
      const autoCloseDiv = popOuterClickCloseRef.current;
      if (!autoCloseDiv) {
        return;
      }
      if (
        event.target === autoCloseDiv ||
        autoCloseDiv.contains(event.target as Node)
      ) {
        return;
      }
      closeMethod();
    };
    document.addEventListener("click", hide);
    return () => {
      document.removeEventListener("click", hide);
    };
  }, []);

  return popOuterClickCloseRef;
};

export default usePopOuterClickClose;
