import type TagEntity from '@/entities/TagEntity';
import type BaseResult from '@/types/BaseResult';

export interface GetTagsResult extends BaseResult {
  data: TagEntity[];
}

export interface GetTagByIdParams {
  id: number;
}

export interface GetTagByIdResult extends BaseResult {
  data: TagEntity | null;
}

export interface CreateTagParams {
  name: string;
  color: string;
}

export interface CreateTagResult extends BaseResult {
  data: TagEntity | null;
}

export interface UpdateTagParams {
  id: number;
  name?: string;
  color?: string;
}

export interface UpdateTagResult extends BaseResult {
  data: TagEntity | null;
}

export interface DeleteTagParams {
  id: number;
}

export type DeleteTagResult = BaseResult;
