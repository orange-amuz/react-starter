import IApi from '@/api/IApi';
import type {
  CreateTodoParams,
  CreateTodoResult,
  DeleteTodoParams,
  DeleteTodoResult,
  GetTodoByIdParams,
  GetTodoByIdResult,
  GetTodosResult,
  UpdateTodoParams,
  UpdateTodoResult,
} from './ITodo';

export default abstract class ITodoApi extends IApi {
  abstract getTodos(): Promise<GetTodosResult>;

  abstract getTodoById(params: GetTodoByIdParams): Promise<GetTodoByIdResult>;

  abstract createTodo(params: CreateTodoParams): Promise<CreateTodoResult>;

  abstract updateTodo(params: UpdateTodoParams): Promise<UpdateTodoResult>;

  abstract deleteTodo(params: DeleteTodoParams): Promise<DeleteTodoResult>;
}
