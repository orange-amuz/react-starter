import { createContext } from 'react';
import type ITodoApi from './ITodoApi';

const TodoApiContext = createContext<ITodoApi | null>(null);

export default TodoApiContext;
