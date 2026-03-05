import TagViewModel from '@/view_models/todo/TagViewModel';
import type { TagStateItem } from './types';

export function toTagStateItem(model: TagViewModel): TagStateItem {
  return {
    id: model.id,
    name: model.name,
    color: model.color,
  };
}

export function toTagViewModel(item: TagStateItem): TagViewModel {
  return new TagViewModel({
    id: item.id,
    name: item.name,
    color: item.color,
  });
}

