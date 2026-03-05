import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TagStateItem } from './types';

export const tagAdapter = createEntityAdapter<TagStateItem>({
  // id 필드(number)를 기본 키로 사용한다.
});

const tagSlice = createSlice({
  name: 'tag',
  initialState: tagAdapter.getInitialState(),
  reducers: {
    setAllTags(state, action: PayloadAction<TagStateItem[]>) {
      tagAdapter.setAll(state, action.payload);
    },
    upsertTag(state, action: PayloadAction<TagStateItem>) {
      tagAdapter.upsertOne(state, action.payload);
    },
    removeTagById(state, action: PayloadAction<number>) {
      tagAdapter.removeOne(state, action.payload);
    },
  },
});

export const { setAllTags, upsertTag, removeTagById } = tagSlice.actions;
export type TagSliceState = ReturnType<typeof tagSlice.reducer>;
export default tagSlice.reducer;

