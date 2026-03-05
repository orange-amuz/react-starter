import type { RootState } from '@/store';
import { tagAdapter } from './slice';
import type { TagSliceState } from './slice';

const selectors = tagAdapter.getSelectors<TagSliceState>((state) => state);

function selectTagSlice(state: RootState): TagSliceState {
  return state.tag as TagSliceState;
}

export function selectAllTagItems(state: RootState) {
  return selectors.selectAll(selectTagSlice(state));
}

export function selectTagItemById(state: RootState, id: number) {
  return selectors.selectById(selectTagSlice(state), id);
}

