import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTagListController from '@/views/tags/hooks/useTagListController';

export default function TagListPage(): React.ReactNode {
  const {
    items,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onCreate,
    onDelete,
  } =
    useTagListController();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? '').trim() || '#000000';

    if (!name) return;

    const isCreated = await onCreate({ name, color });

    if (isCreated) {
      event.currentTarget.reset();
    }
  };

  const deleteHandlers = useMemo(() => {
    const map = new Map<number, () => void>();

    for (const item of items) {
      map.set(item.id, () => {
        void onDelete(item.id);
      });
    }

    return map;
  }, [items, onDelete]);

  return (
    <main>
      <h1>태그 관리</h1>

      <nav>
        <Link to={ROUTE_PATHS.TODO_LIST}>Todo 목록</Link>
      </nav>

      <section>
        <h2>새 태그 추가</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              이름
              <input name="name" placeholder="태그 이름" />
            </label>
          </div>
          <div>
            <label>
              색상
              <input name="color" type="color" defaultValue="#000000" />
            </label>
          </div>
          <button type="submit" disabled={isActionLoading}>
            추가
          </button>
        </form>
      </section>

      <section>
        <h2>태그 목록</h2>

        {isInitialLoading && <p>불러오는 중...</p>}

        {!isInitialLoading && errorMessage && (
          <div>
            <p>{errorMessage}</p>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </div>
        )}

        {!isInitialLoading && !errorMessage && items.length === 0 && <p>등록된 태그가 없습니다.</p>}

        <ul>
          {items.map((tag) => (
            <li key={tag.id}>
              <span>{tag.name}</span>
              <span>({tag.color})</span>
              <Link to={ROUTE_PATHS.TAG_DETAIL.replace(':tagId', String(tag.id))}>상세</Link>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={deleteHandlers.get(tag.id)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

