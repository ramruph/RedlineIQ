import { useCallback, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const run = useCallback(async (fn: () => Promise<T>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await fn();
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown request error';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, []);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  return { ...state, run, setData };
}
