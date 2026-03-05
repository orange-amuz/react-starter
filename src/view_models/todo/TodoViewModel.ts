import TodoEntity from '@/entities/TodoEntity';
import BaseViewModel from '@/view_models/BaseViewModel';
import TagViewModel, { createTagViewModel } from './TagViewModel';

interface TodoViewModelProps {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDateLabel: string | null;
  createdAtLabel: string;
  updatedAtLabel: string;
  tags: TagViewModel[];
}

export default class TodoViewModel extends BaseViewModel {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly isCompleted: boolean;
  readonly dueDateLabel: string | null;
  readonly createdAtLabel: string;
  readonly updatedAtLabel: string;
  readonly tags: TagViewModel[];

  constructor(props: TodoViewModelProps) {
    super();

    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.isCompleted = props.isCompleted;
    this.dueDateLabel = props.dueDateLabel;
    this.createdAtLabel = props.createdAtLabel;
    this.updatedAtLabel = props.updatedAtLabel;
    this.tags = props.tags;
  }
}

function formatDateTimeLabel(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleString();
}

export function createTodoViewModel(entity: TodoEntity): TodoViewModel {
  return new TodoViewModel({
    id: entity.id,
    title: entity.title,
    description: entity.description ?? '',
    isCompleted: entity.isCompleted,
    dueDateLabel: formatDateTimeLabel(entity.dueDate ?? null),
    createdAtLabel: formatDateTimeLabel(entity.createdAt) ?? '',
    updatedAtLabel: formatDateTimeLabel(entity.updatedAt) ?? '',
    tags: entity.tags.map((tag) => createTagViewModel(tag)),
  });
}

