import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ROUTE_PATHS } from '@/constants/route_paths';
import TodoDetailPage from '@/views/todo/TodoDetailPage';
import TodoListPage from '@/views/todo/TodoListPage';
import TagDetailPage from '@/views/tags/TagDetailPage';
import TagListPage from '@/views/tags/TagListPage';
import NotFoundPage from '@/views/common/NotFoundPage';

export default function AppRouter(): React.ReactNode {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE_PATHS.ROOT} element={<TodoListPage />} />
        <Route path={ROUTE_PATHS.TODO_LIST} element={<TodoListPage />} />
        <Route path={ROUTE_PATHS.TODO_DETAIL} element={<TodoDetailPage />} />
        <Route path={ROUTE_PATHS.TAG_LIST} element={<TagListPage />} />
        <Route path={ROUTE_PATHS.TAG_DETAIL} element={<TagDetailPage />} />
        <Route path={ROUTE_PATHS.NOT_FOUND} element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to={ROUTE_PATHS.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

