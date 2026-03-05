import type TodoEntity from '@/entities/TodoEntity';
import type BaseResult from '@/types/BaseResult';

export interface GetTodosResult extends BaseResult {
  data: TodoEntity[];
}

export interface GetTodoByIdParams {
  id: number;
}

export interface GetTodoByIdResult extends BaseResult {
  data: TodoEntity | null;
}

export interface CreateTodoParams {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  tagIds?: number[];
}

export interface CreateTodoResult extends BaseResult {
  data: TodoEntity | null;
}

export interface UpdateTodoParams {
  id: number;
  title?: string;
  description?: string | null;
  isCompleted?: boolean;
  dueDate?: string | null;
  tagIds?: number[];
}

export interface UpdateTodoResult extends BaseResult {
  data: TodoEntity | null;
}

export interface DeleteTodoParams {
  id: number;
}

export type DeleteTodoResult = BaseResult;
