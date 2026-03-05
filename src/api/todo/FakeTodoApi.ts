import getTodosJson from '@/assets/dummies/getTodos.json';
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

export default class FakeTodoApi extends ITodoApi {
  private fakeTodos: unknown[] = getTodosJson;

  async getTodos(): Promise<GetTodosResult> {
    return {
      success: true,
      message: null,
      data: this.fakeTodos.map((item) => TodoEntity.fromJson(item)),
    };
  }

  async getTodoById(params: GetTodoByIdParams): Promise<GetTodoByIdResult> {
    const found = this.fakeTodos.find((item) => {
      const parsed = TodoEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (!found) {
      return {
        success: false,
        message: `Todo with id ${params.id} not found`,
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: TodoEntity.fromJson(found),
    };
  }

  async createTodo(params: CreateTodoParams): Promise<CreateTodoResult> {
    const now = new Date().toISOString();
    const maxId = this.fakeTodos.reduce<number>((max, item) => {
      const parsed = TodoEntity.fromJson(item);

      return Math.max(max, parsed.id);
    }, 0);

    const newTodo = {
      id: maxId + 1,
      title: params.title,
      description: params.description ?? null,
      is_completed: false,
      due_date: params.dueDate ?? null,
      created_at: now,
      updated_at: now,
      tags: [],
    };

    this.fakeTodos.push(newTodo);

    return {
      success: true,
      message: null,
      data: TodoEntity.fromJson(newTodo),
    };
  }

  async updateTodo(params: UpdateTodoParams): Promise<UpdateTodoResult> {
    const index = this.fakeTodos.findIndex((item) => {
      const parsed = TodoEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (index < 0) {
      return {
        success: false,
        message: `Todo with id ${params.id} not found`,
        data: null,
      };
    }

    const current = TodoEntity.fromJson(this.fakeTodos[index]);
    const now = new Date().toISOString();
    const updated = {
      id: current.id,
      title: params.title ?? current.title,
      description: params.description ?? current.description ?? null,
      is_completed: params.isCompleted ?? current.isCompleted,
      due_date: params.dueDate ?? current.dueDate ?? null,
      created_at: current.createdAt,
      updated_at: now,
      tags: current.tags.map((tag) => tag.toJson()),
    };

    this.fakeTodos[index] = updated;

    return {
      success: true,
      message: null,
      data: TodoEntity.fromJson(updated),
    };
  }

  async deleteTodo(params: DeleteTodoParams): Promise<DeleteTodoResult> {
    const index = this.fakeTodos.findIndex((item) => {
      const parsed = TodoEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (index < 0) {
      return {
        success: false,
        message: `Todo with id ${params.id} not found`,
      };
    }

    this.fakeTodos.splice(index, 1);

    return {
      success: true,
      message: null,
    };
  }
}
