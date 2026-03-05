export interface TodoTagStateItem {
  id: number;
  name: string;
  color: string;
}

export interface TodoStateItem {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDateLabel: string | null;
  createdAtLabel: string;
  updatedAtLabel: string;
  tags: TodoTagStateItem[];
}

