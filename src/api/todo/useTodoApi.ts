import { useContext } from 'react';
import type ITodoApi from './ITodoApi';
import TodoApiContext from './TodoApiContext';

export default function useTodoApi(): ITodoApi {
  const context = useContext(TodoApiContext);

  if (context === null) {
    throw new Error('useTodoApi must be used within a TodoApiProvider');
  }

  return context;
}
