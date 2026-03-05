import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTagApi } from '@/api';
import { ROUTE_PATHS } from '@/constants/route_paths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toTagStateItem, toTagViewModel } from '@/store/slices/tag/adapters';
import { selectTagItemById } from '@/store/slices/tag/selectors';
import { removeTagById, upsertTag } from '@/store/slices/tag/slice';
import { LOAD_STATES, type LoadState } from '@/types/load_state';
import type TagViewModel from '@/view_models/todo/TagViewModel';
import { createTagViewModel } from '@/view_models/todo/TagViewModel';
import { useNavigate } from 'react-router-dom';

interface UseTagDetailControllerParams {
  id: number;
  isEnabled: boolean;
}

interface UseTagDetailControllerReturn {
  item: TagViewModel | null;
  loadState: LoadState;
  isInitialLoading: boolean;
  isActionLoading: boolean;
  errorMessage: string | null;
  onRetry: () => void;
  onSave: (params: { name: string; color: string }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function useTagDetailController(
  params: UseTagDetailControllerParams,
): UseTagDetailControllerReturn {
  const api = useTagApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tagItem = useAppSelector((state) => selectTagItemById(state, params.id) ?? null);
  const item = useMemo(() => {
    if (!tagItem) {
      return null;
    }

    return toTagViewModel(tagItem);
  }, [tagItem]);
  const [loadState, setLoadState] = useState<LoadState>(
    params.isEnabled && !tagItem ? LOAD_STATES.INITIAL_LOADING : LOAD_STATES.IDLE,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTag = useCallback(async (nextState: LoadState): Promise<void> => {
    setLoadState(nextState);
    if (nextState !== LOAD_STATES.IDLE) {
      setErrorMessage(null);
    }

    try {
      const result = await api.getTagById({ id: params.id });

      if (result.success && result.data) {
        const model = createTagViewModel(result.data);
        dispatch(upsertTag(toTagStateItem(model)));
        setErrorMessage(null);
      } else {
        setErrorMessage(result.message ?? '태그를 불러오는 중 오류가 발생했습니다.');
      }
    } catch {
      setErrorMessage('태그를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoadState(LOAD_STATES.IDLE);
    }
  }, [api, dispatch, params.id]);

  useEffect(() => {
    if (!params.isEnabled) {
      return;
    }

    if (tagItem) {
      return;
    }

    void fetchTag(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTag, params.isEnabled, tagItem]);

  const onRetry = useCallback(() => {
    if (!params.isEnabled) {
      return;
    }

    void fetchTag(LOAD_STATES.INITIAL_LOADING);
  }, [fetchTag, params.isEnabled]);

  const onSave = useCallback(
    async (payload: { name: string; color: string }): Promise<void> => {
      const current = item;

      if (!current) return;

      setLoadState(LOAD_STATES.ACTION_LOADING);
      setErrorMessage(null);

      try {
        const result = await api.updateTag({
          id: current.id,
          name: payload.name,
          color: payload.color,
        });

        if (result.success && result.data) {
          const model = createTagViewModel(result.data);
          dispatch(upsertTag(toTagStateItem(model)));
          setErrorMessage(null);
        } else {
          setErrorMessage(result.message ?? '태그를 저장하는 중 오류가 발생했습니다.');
        }
      } catch {
        setErrorMessage('태그를 저장하는 중 오류가 발생했습니다.');
      } finally {
        setLoadState(LOAD_STATES.IDLE);
      }
    },
    [api, dispatch, item],
  );

  const onDelete = useCallback(async (): Promise<void> => {
    const current = item;

    if (!current) return;

    setLoadState(LOAD_STATES.ACTION_LOADING);
    setErrorMessage(null);

    try {
      const result = await api.deleteTag({ id: current.id });

      if (!result.success) {
        setErrorMessage(result.message ?? '태그를 삭제하는 중 오류가 발생했습니다.');

        return;
      }

      dispatch(removeTagById(current.id));
      navigate(ROUTE_PATHS.TAG_LIST);
    } catch {
      setErrorMessage('태그를 삭제하는 중 오류가 발생했습니다.');
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
    onDelete,
  };
}

