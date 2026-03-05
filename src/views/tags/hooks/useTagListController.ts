import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTagApi } from '@/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toTagStateItem, toTagViewModel } from '@/store/slices/tag/adapters';
import { selectAllTagItems } from '@/store/slices/tag/selectors';
import { removeTagById, setAllTags, upsertTag } from '@/store/slices/tag/slice';
import { LOAD_STATES, type LoadState } from '@/types/load_state';
import type TagViewModel from '@/view_models/todo/TagViewModel';
import { createTagViewModel } from '@/view_models/todo/TagViewModel';

interface UseTagListControllerReturn {
  items: TagViewModel[];
  loadState: LoadState;
  isInitialLoading: boolean;
  isActionLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onCreate: (params: { name: string; color: string }) => Promise<boolean>;
  onUpdate: (id: number, params: { name: string; color: string }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function useTagListController(): UseTagListControllerReturn {
  const api = useTagApi();
  const dispatch = useAppDispatch();
  const tagItems = useAppSelector(selectAllTagItems);
  const [loadState, setLoadState] = useState<LoadState>(LOAD_STATES.INITIAL_LOADING);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const items = useMemo(() => tagItems.map((item) => toTagViewModel(item)), [tagItems]);

  const fetchTags = useCallback(async (nextState: LoadState): Promise<void> => {
    setLoadState(nextState);
    if (nextState !== LOAD_STATES.IDLE) {
      setErrorMessage(null);
    }

    try {
      const result = await api.getTags();

      if (result.success) {
        const models = result.data.map((entity) => createTagViewModel(entity));
        dispatch(setAllTags(models.map((model) => toTagStateItem(model))));
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? '태그를 불러오는 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('태그를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch]);

  useEffect(() => {
    void fetchTags(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTags]);

  const onRetry = useCallback(() => {
    void fetchTags(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTags]);

  const onCreate = useCallback(
    async (params: { name: string; color: string }): Promise<boolean> => {
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.createTag({
          name: params.name,
          color: params.color,
        });
        const created = result.data;

        if (result.success && created) {
          const model = createTagViewModel(created);
          dispatch(upsertTag(toTagStateItem(model)));
          setErrorMessage(null);

          return true;
        }

        setErrorMessage(result.message ?? '태그를 추가하는 중 오류가 발생했습니다.');

        return false;
      } catch {
        setErrorMessage('태그를 추가하는 중 오류가 발생했습니다.');

        return false;
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch],
  );

  const onUpdate = useCallback(
    async (id: number, params: { name: string; color: string }): Promise<void> => {
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.updateTag({
          id,
          name: params.name,
          color: params.color,
        });

        if (result.success && result.data) {
          const updated = createTagViewModel(result.data);

          dispatch(upsertTag(toTagStateItem(updated)));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '태그를 수정하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('태그를 수정하는 중 오류가 발생했습니다.');
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch],
  );

  const onDelete = useCallback(
    async (id: number): Promise<void> => {
      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.deleteTag({ id });

        if (result.success) {
          dispatch(removeTagById(id));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '태그를 삭제하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('태그를 삭제하는 중 오류가 발생했습니다.');
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
    onUpdate,
    onDelete,
  };
}

