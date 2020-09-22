import { useEffect, useRef, useCallback } from 'react';

export function useDebounce(fn: Function, delay: number, dep: Array<any> = []) {
  const { current } = useRef<any>({ fn, timer: null });
  useEffect(() => {
    current.fn = fn;
  }, [fn]);

  return useCallback((...args) => {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn(...args);
    }, delay);
  }, dep);
}
