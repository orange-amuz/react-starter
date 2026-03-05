import type { PayloadAction } from '@reduxjs/toolkit';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { TodoStateItem } from './types';

export const todoAdapter = createEntityAdapter<TodoStateItem>({
  // id 필드(number)를 기본 키로 사용한다.
});

const todoSlice = createSlice({
  name: 'todo',
  initialState: todoAdapter.getInitialState(),
  reducers: {
    setAllTodos(state, action: PayloadAction<TodoStateItem[]>) {
      todoAdapter.setAll(state, action.payload);
    },
    upsertTodo(state, action: PayloadAction<TodoStateItem>) {
      todoAdapter.upsertOne(state, action.payload);
    },
    removeTodoById(state, action: PayloadAction<number>) {
      todoAdapter.removeOne(state, action.payload);
    },
  },
});

export const { setAllTodos, upsertTodo, removeTodoById } = todoSlice.actions;
export type TodoSliceState = ReturnType<typeof todoSlice.reducer>;
export default todoSlice.reducer;

