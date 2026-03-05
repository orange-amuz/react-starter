import { z } from 'zod';
import BaseEntity from './BaseEntity';

export const TagJsonSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

interface TagEntityProps {
  id: number;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export default class TagEntity extends BaseEntity {
  readonly id: number;
  readonly name: string;
  readonly color: string;
  readonly createdAt: string;
  readonly updatedAt: string;

  constructor(props: TagEntityProps) {
    super();

    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static fromJson(json: unknown): TagEntity {
    const parsed = TagJsonSchema.parse(json);

    return new TagEntity({
      id: parsed.id,
      name: parsed.name,
      color: parsed.color,
      createdAt: parsed.created_at,
      updatedAt: parsed.updated_at,
    });
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}

