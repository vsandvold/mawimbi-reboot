import { useCallback, useRef } from 'react';

type ThrottledOptions = {
  timeoutMs: number;
};

const useThrottled = (
  callback: (value: any) => void,
  { timeoutMs = 100 }: ThrottledOptions
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const throttled = useCallback(
    (value) => {
      if (timeoutRef.current) {
        return;
      }
      callback(value);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
      }, timeoutMs);
    },
    [callback, timeoutMs]
  );

  return throttled;
};

export default useThrottled;