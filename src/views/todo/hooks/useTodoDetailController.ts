import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTodoApi } from '@/api';
import { ROUTE_PATHS } from '@/constants/route_paths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toTodoStateItem, toTodoViewModel } from '@/store/slices/todo/adapters';
import { selectTodoItemById } from '@/store/slices/todo/selectors';
import { removeTodoById, upsertTodo } from '@/store/slices/todo/slice';
import { LOAD_STATES, type LoadState } from '@/types/load_state';
import type TodoViewModel from '@/view_models/todo/TodoViewModel';
import { createTodoViewModel } from '@/view_models/todo/TodoViewModel';
import { useNavigate } from 'react-router-dom';

interface UseTodoDetailControllerParams {
  id: number;
  isEnabled: boolean;
}

interface UseTodoDetailControllerReturn {
  item: TodoViewModel | null;
  loadState: LoadState;
  isInitialLoading: boolean;
  isActionLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onSave: (params: { title: string; description: string }) => Promise<void>;
  onToggleComplete: () => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function useTodoDetailController(
  params: UseTodoDetailControllerParams,
): UseTodoDetailControllerReturn {
  const api = useTodoApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const todoItem = useAppSelector((state) => selectTodoItemById(state, params.id) ?? null);
  const item = useMemo(() => {
    if (!todoItem) {
      return null;
    }

    return toTodoViewModel(todoItem);
  }, [todoItem]);
  const [loadState, setLoadState] = useState<LoadState>(
    params.isEnabled && !todoItem ? LOAD_STATES.INITIAL_LOADING : LOAD_STATES.IDLE,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTodo = useCallback(async (nextState: LoadState): Promise<void> => {
    setLoadState(nextState);
    if (nextState !== LOAD_STATES.IDLE) {
      setErrorMessage(null);
    }

    try {
      const result = await api.getTodoById({ id: params.id });

      if (result.success && result.data) {
        const model = createTodoViewModel(result.data);
        dispatch(upsertTodo(toTodoStateItem(model)));
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? '할 일을 불러오는 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('할 일을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch, params.id]);

  useEffect(() => {
    if (!params.isEnabled) {
      return;
    }

    if (todoItem) {
      return;
    }

    void fetchTodo(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTodo, params.isEnabled, todoItem]);

  const onRetry = useCallback(() => {
    if (!params.isEnabled) {
      return;
    }

    void fetchTodo(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTodo, params.isEnabled]);

  const onSave = useCallback(
    async (payload: { title: string; description: string }): Promise<void> => {
      const current = item;

      if (!current) return;

      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.updateTodo({
          id: current.id,
          title: payload.title,
          description: payload.description,
        });

        if (result.success && result.data) {
          const model = createTodoViewModel(result.data);
          dispatch(upsertTodo(toTodoStateItem(model)));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '할 일을 저장하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('할 일을 저장하는 중 오류가 발생했습니다.');
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch, item],
  );

  const onToggleComplete = useCallback(async (): Promise<void> => {
    const current = item;

    if (!current) return;

    setLoadState(LOAD_STATES.ACTION_LOADING);
    setErrorMessage(null);

    try {
      const result = await api.updateTodo({
        id: current.id,
        isCompleted: !current.isCompleted,
      });

      if (result.success && result.data) {
        const model = createTodoViewModel(result.data);
        dispatch(upsertTodo(toTodoStateItem(model)));
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? '할 일을 업데이트하는 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('할 일을 업데이트하는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch, item]);

  const onDelete = useCallback(async (): Promise<void> => {
    const current = item;

    if (!current) return;

    setLoadState(LOAD_STATES.ACTION_LOADING);
    setErrorMessage(null);

    try {
      const result = await api.deleteTodo({ id: current.id });

      if (!result.success) {
        setErrorMessage(result.message ?? '할 일을 삭제하는 중 오류가 발생했습니다.');

        return;
      }

      dispatch(removeTodoById(current.id));
      navigate(ROUTE_PATHS.TODO_LIST);
    } catch {
      setErrorMessage('할 일을 삭제하는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch, item, navigate]);

  return {
    item,
    loadState,
    isInitialLoading: loadState === LOAD_STATES.INITIAL_LOADING,
    isActionLoading: loadState === LOAD_STATES.ACTION_LOADING,
    errorMessage,
    onRetry,
    onSave,
    onToggleComplete,
    onDelete,
  };
}

