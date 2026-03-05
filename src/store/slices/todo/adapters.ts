import TodoViewModel from '@/view_models/todo/TodoViewModel';
import TagViewModel from '@/view_models/todo/TagViewModel';
import type { TodoStateItem, TodoTagStateItem } from './types';

function toTodoTagStateItem(model: TagViewModel): TodoTagStateItem {
  return {
    id: model.id,
    name: model.name,
    color: model.color,
  };
}

function toTagViewModel(item: TodoTagStateItem): TagViewModel {
  return new TagViewModel({
    id: item.id,
    name: item.name,
    color: item.color,
  });
}

export function toTodoStateItem(model: TodoViewModel): TodoStateItem {
  return {
    id: model.id,
    title: model.title,
    description: model.description,
    isCompleted: model.isCompleted,
    dueDateLabel: model.dueDateLabel,
    createdAtLabel: model.createdAtLabel,
    updatedAtLabel: model.updatedAtLabel,
    tags: model.tags.map((tag) => toTodoTagStateItem(tag)),
  };
}

export function toTodoViewModel(item: TodoStateItem): TodoViewModel {
  return new TodoViewModel({
    id: item.id,
    title: item.title,
    description: item.description,
    isCompleted: item.isCompleted,
    dueDateLabel: item.dueDateLabel,
    createdAtLabel: item.createdAtLabel,
    updatedAtLabel: item.updatedAtLabel,
    tags: item.tags.map((tag) => toTagViewModel(tag)),
  });
}

