import tagReducer from '@/store/slices/tag/slice';
import todoReducer from '@/store/slices/todo/slice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    todo: todoReducer,
    tag: tagReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

