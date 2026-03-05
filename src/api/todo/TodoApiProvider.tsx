import { useMemo, type ReactNode } from 'react';
import { API_CONFIG } from '@/constants/api_config';
import FakeTodoApi from './FakeTodoApi';
import TodoApi from './TodoApi';
import TodoApiContext from './TodoApiContext';

interface TodoApiProviderProps {
  children: ReactNode;
}

export default function TodoApiProvider({
  children,
}: TodoApiProviderProps): ReactNode {
  const api = useMemo(() => {
    if (API_CONFIG.USE_FAKE) {
      return new FakeTodoApi();
    }

    return new TodoApi('/api');
  }, []);

  return <TodoApiContext.Provider value={api}>{children}</TodoApiContext.Provider>;
}
