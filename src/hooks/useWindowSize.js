import { useState, useEffect, useCallback } from "react";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  const handleResize = useCallback(() => {
    setWindowSize((prevSize) => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      // Only update if there's a significant change to prevent excessive re-renders
      if (
        Math.abs(prevSize.width - newWidth) > 10 ||
        Math.abs(prevSize.height - newHeight) > 10
      ) {
        return {
          width: newWidth,
          height: newHeight,
        };
      }
      return prevSize;
    });
  }, []);

  useEffect(() => {
    // Debounce the resize handler to prevent excessive updates
    let timeoutId;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedHandleResize);
    handleResize(); // Call once to set initial size

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, [handleResize]);

  return windowSize;
};
