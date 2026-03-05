import BaseViewModel from '@/view_models/BaseViewModel';
import TagEntity from '@/entities/TagEntity';

interface TagViewModelProps {
  id: number;
  name: string;
  color: string;
}

export default class TagViewModel extends BaseViewModel {
  readonly id: number;
  readonly name: string;
  readonly color: string;

  constructor(props: TagViewModelProps) {
    super();

    this.id = props.id;
    this.name = props.name;
    this.color = props.color;
  }
}

export function createTagViewModel(entity: TagEntity): TagViewModel {
  return new TagViewModel({
    id: entity.id,
    name: entity.name,
    color: entity.color,
  });
}

