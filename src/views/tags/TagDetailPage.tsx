import { ROUTE_PATHS } from '@/constants/route_paths';
import useTagDetailController from '@/views/tags/hooks/useTagDetailController';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

export default function TagDetailPage(): React.ReactNode {
  const params = useParams();
  const navigate = useNavigate();
  const id = Number(params.tagId);
  const isValidTagId = !Number.isNaN(id);

  const { item, isInitialLoading, isActionLoading, errorMessage, onRetry, onSave, onDelete } =
    useTagDetailController({
      id,
      isEnabled: isValidTagId,
    });

  if (!isValidTagId) {
    return <Navigate to={ROUTE_PATHS.NOT_FOUND} replace />;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '').trim();
    const color = String(formData.get('color') ?? '').trim() || '#000000';

    if (!name) return;

    await onSave({ name, color });
  };

  const handleBackClick = (): void => {
    navigate(-1);
  };

  const handleDeleteClick = (): void => {
    void onDelete();
  };

  return (
    <main>
      <h1>태그 상세</h1>

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
                이름
                <input name="name" defaultValue={item.name} />
              </label>
            </div>
            <div>
              <label>
                색상
                <input name="color" type="color" defaultValue={item.color} />
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

