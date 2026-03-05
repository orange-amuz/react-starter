import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTodoApi } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toTodoStateItem, toTodoViewModel } from '@/store/slices/todo/adapters';
import { selectAllTodoItems } from '@/store/slices/todo/selectors';
import { removeTodoById, setAllTodos, upsertTodo } from '@/store/slices/todo/slice';
import { LOAD_STATES, type LoadState } from '@/types/load_state';
import type TodoViewModel from '@/view_models/todo/TodoViewModel';
import { createTodoViewModel } from '@/view_models/todo/TodoViewModel';

interface UseTodoListControllerReturn {
  items: TodoViewModel[];
  loadState: LoadState;
  isInitialLoading: boolean;
  isActionLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onCreate: (params: { title: string; description?: string }) => Promise<boolean>;
  onToggleComplete: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function useTodoListController(): UseTodoListControllerReturn {
  const api = useTodoApi();
  const dispatch = useAppDispatch();
  const todoItems = useAppSelector(selectAllTodoItems);
  const [loadState, setLoadState] = useState<LoadState>(LOAD_STATES.INITIAL_LOADING);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const items = useMemo(() => todoItems.map((item) => toTodoViewModel(item)), [todoItems]);

  const fetchTodos = useCallback(async (nextState: LoadState): Promise<void> => {
    setLoadState(nextState);
    if (nextState !== LOAD_STATES.IDLE) {
      setErrorMessage(null);
    }

    try {
      const result = await api.getTodos();

      if (result.success) {
        const models = result.data.map((entity) => createTodoViewModel(entity));
        dispatch(setAllTodos(models.map((model) => toTodoStateItem(model))));
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? '할 일을 불러오는 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('할 일을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch]);

  useEffect(() => {
    void fetchTodos(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTodos]);

  const onRetry = useCallback(() => {
    void fetchTodos(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTodos]);

  const onCreate = useCallback(
    async (params: { title: string; description?: string }): Promise<boolean> => {
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.createTodo({
          title: params.title,
          description: params.description ?? null,
        });
        const created = result.data;

        if (result.success && created) {
          const model = createTodoViewModel(created);
          dispatch(upsertTodo(toTodoStateItem(model)));
          setErrorMessage(null);

          return true;
        }

        setErrorMessage(result.message ?? '할 일을 추가하는 중 오류가 발생했습니다.');

        return false;
      } catch {
        setErrorMessage('할 일을 추가하는 중 오류가 발생했습니다.');

        return false;
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch],
  );

  const onToggleComplete = useCallback(
    async (id: number): Promise<void> => {
      const target = items.find((item) => item.id === id);

      if (!target) return;

      const nextCompleted = !target.isCompleted;
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.updateTodo({
          id,
          isCompleted: nextCompleted,
        });

        if (result.success && result.data) {
          const updated = createTodoViewModel(result.data);

          dispatch(upsertTodo(toTodoStateItem(updated)));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '할 일을 업데이트하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('할 일을 업데이트하는 중 오류가 발생했습니다.');
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch, items],
  );

  const onDelete = useCallback(
    async (id: number): Promise<void> => {
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.deleteTodo({ id });

        if (result.success) {
          dispatch(removeTodoById(id));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '할 일을 삭제하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('할 일을 삭제하는 중 오류가 발생했습니다.');
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch],
  );

  return {
    items,
    loadState,
    isInitialLoading: loadState === LOAD_STATES.INITIAL_LOADING,
    isActionLoading: loadState === LOAD_STATES.ACTION_LOADING,
    errorMessage,
    onRetry,
    onCreate,
    onToggleComplete,
    onDelete,
  };
}

