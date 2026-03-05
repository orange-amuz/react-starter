import TodoEntity from '@/entities/TodoEntity';
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
import ITodoApi from './ITodoApi';

export default class TodoApi extends ITodoApi {
  async getTodos(): Promise<GetTodosResult> {
    try {
      const response = await this.get('/todos');

      return {
        success: true,
        message: null,
        data: (response.data as unknown[]).map((item: unknown) =>
          TodoEntity.fromJson(item),
        ),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: [],
      };
    }
  }

  async getTodoById(params: GetTodoByIdParams): Promise<GetTodoByIdResult> {
    try {
      const response = await this.get(`/todos/${params.id}`);

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async createTodo(params: CreateTodoParams): Promise<CreateTodoResult> {
    try {
      const response = await this.post('/todos', {
        title: params.title,
        description: params.description ?? null,
        due_date: params.dueDate ?? null,
        tag_ids: params.tagIds ?? [],
      });

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async updateTodo(params: UpdateTodoParams): Promise<UpdateTodoResult> {
    try {
      const body: Record<string, unknown> = {};

      if (params.title !== undefined) body.title = params.title;
      if (params.description !== undefined) body.description = params.description;
      if (params.isCompleted !== undefined) body.is_completed = params.isCompleted;
      if (params.dueDate !== undefined) body.due_date = params.dueDate;
      if (params.tagIds !== undefined) body.tag_ids = params.tagIds;

      const response = await this.put(`/todos/${params.id}`, body);

      return {
        success: true,
        message: null,
        data: TodoEntity.fromJson(response.data),
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
        data: null,
      };
    }
  }

  async deleteTodo(params: DeleteTodoParams): Promise<DeleteTodoResult> {
    try {
      await this.delete(`/todos/${params.id}`);

      return {
        success: true,
        message: null,
      };
    } catch (e) {
      return {
        success: false,
        message: this.extractErrorMessage(e),
      };
    }
  }
}
