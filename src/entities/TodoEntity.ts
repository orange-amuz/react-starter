import { z } from 'zod';
import BaseEntity from './BaseEntity';
import TagEntity, { TagJsonSchema } from './TagEntity';

const TodoJsonSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  is_completed: z.boolean(),
  due_date: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  tags: z.array(TagJsonSchema).default([]),
});

interface TodoEntityProps {
  id: number;
  title: string;
  description?: string | null;
  isCompleted: boolean;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
  tags: TagEntity[];
}

export default class TodoEntity extends BaseEntity {
  readonly id: number;
  readonly title: string;
  readonly description?: string | null;
  readonly isCompleted: boolean;
  readonly dueDate?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly tags: TagEntity[];

  constructor(props: TodoEntityProps) {
    super();

    this.id = props.id;
    this.title = props.title;
    this.description = props.description ?? null;
    this.isCompleted = props.isCompleted;
    this.dueDate = props.dueDate ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.tags = props.tags;
  }

  static fromJson(json: unknown): TodoEntity {
    const parsed = TodoJsonSchema.parse(json);

    return new TodoEntity({
      id: parsed.id,
      title: parsed.title,
      description: parsed.description ?? null,
      isCompleted: parsed.is_completed,
      dueDate: parsed.due_date ?? null,
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
      tags: parsed.tags.map((tag) => TagEntity.fromJson(tag)),
    });
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      is_completed: this.isCompleted,
      due_date: this.dueDate,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      tags: this.tags.map((tag) => tag.toJson()),
    };
  }
}

