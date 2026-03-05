import { ROUTE_PATHS } from '@/constants/route_paths';
import useTodoDetailController from '@/views/todo/hooks/useTodoDetailController';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function TodoDetailPage(): React.ReactNode {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.todoId);
  const isValidTodoId = !Number.isNaN(id);

  const {
    item,
    isInitialLoading,
    isActionLoading,
    errorMessage,
    onRetry,
    onSave,
    onToggleComplete,
    onDelete,
  } =
    useTodoDetailController({
      id,
      isEnabled: isValidTodoId,
    });

  if (!isValidTodoId) {
    return <Navigate to={ROUTE_PATHS.NOT_FOUND} replace />;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get('title') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!title) return;

    await onSave({ title, description });
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  const handleToggleComplete: React.ChangeEventHandler<HTMLInputElement> = () => {
    void onToggleComplete();
  };

  const handleDeleteClick = (): void => {
    void onDelete();
  };

  return (
    <main>
      <h1>Todo 상세</h1>

      <button type="button" onClick={handleBackClick}>
        목록으로
      </button>

      {isInitialLoading && <p>불러오는 중...</p>}

      {!isInitialLoading && errorMessage && (
        <div>
          <p>{errorMessage}</p>
          <button type="button" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      )}

      {!isInitialLoading && !errorMessage && item && (
        <section>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                제목
                <input name="title" defaultValue={item.title} />
              </label>
            </div>
            <div>
              <label>
                설명
                <input name="description" defaultValue={item.description} />
              </label>
            </div>
            <div>
              <label>
                완료 여부
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  disabled={isActionLoading}
                  onChange={handleToggleComplete}
                />
              </label>
            </div>
            <button type="submit" disabled={isActionLoading}>
              저장
            </button>
          </form>

          <button type="button" disabled={isActionLoading} onClick={handleDeleteClick}>
            삭제
          </button>
        </section>
      )}
    </main>
  );
}

