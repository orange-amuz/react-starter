import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoListController from '@/views/todo/hooks/useTodoListController';

export default function TodoListPage(): React.ReactNode {
  const {
    items,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onCreate,
    onToggleComplete,
    onDelete,
  } = useTodoListController();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title) return;

    const isCreated = await onCreate({ title, description });

    if (isCreated) {
      event.currentTarget.reset();
    }
  };

  const toggleHandlers = useMemo(() => {
    const map = new Map<number, () => void>();

    for (const item of items) {
      map.set(item.id, () => {
        void onToggleComplete(item.id);
      });
    }

    return map;
  }, [items, onToggleComplete]);

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
      <h1>Todo 목록</h1>

      <nav>
        <Link to={ROUTE_PATHS.TAG_LIST}>태그 관리</Link>
      </nav>

      <section>
        <h2>새 할 일 추가</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              제목
              <input name="title" placeholder="제목을 입력하세요" />
            </label>
          </div>
          <div>
            <label>
              설명
              <input name="description" placeholder="설명을 입력하세요" />
            </label>
          </div>
          <button type="submit" disabled={isActionLoading}>
            추가
          </button>
        </form>
      </section>

      <section>
        <h2>목록</h2>

        {isInitialLoading && <p>불러오는 중...</p>}

        {!isInitialLoading && errorMessage && (
          <div>
            <p>{errorMessage}</p>
            <button type="button" onClick={onRetry}>
              다시 시도
            </button>
          </div>
        )}

        {!isInitialLoading && !errorMessage && items.length === 0 && <p>등록된 할 일이 없습니다.</p>}

        <ul>
          {items.map((todo) => (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.isCompleted}
                  disabled={isActionLoading}
                  onChange={toggleHandlers.get(todo.id)}
                />
                <Link to={ROUTE_PATHS.TODO_DETAIL.replace(':todoId', String(todo.id))}>
                  {todo.title}
                </Link>
              </label>
              <button
                type="button"
                disabled={isActionLoading}
                onClick={deleteHandlers.get(todo.id)}
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

