import type { RootState } from '@/store';
import { todoAdapter } from './slice';
import type { TodoSliceState } from './slice';

const selectors = todoAdapter.getSelectors<TodoSliceState>((state) => state);

function selectTodoSlice(state: RootState): TodoSliceState {
  return state.todo as TodoSliceState;
}

export function selectAllTodoItems(state: RootState) {
  return selectors.selectAll(selectTodoSlice(state));
}

export function selectTodoItemById(state: RootState, id: number) {
  return selectors.selectById(selectTodoSlice(state), id);
}

