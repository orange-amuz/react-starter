import IApi from '@/api/IApi';
import type {
  CreateTagParams,
  CreateTagResult,
  DeleteTagParams,
  DeleteTagResult,
  GetTagByIdParams,
  GetTagByIdResult,
  GetTagsResult,
  UpdateTagParams,
  UpdateTagResult,
} from './ITag';

export default abstract class ITagApi extends IApi {
  abstract getTags(): Promise<GetTagsResult>;

  abstract getTagById(params: GetTagByIdParams): Promise<GetTagByIdResult>;

  abstract createTag(params: CreateTagParams): Promise<CreateTagResult>;

  abstract updateTag(params: UpdateTagParams): Promise<UpdateTagResult>;

  abstract deleteTag(params: DeleteTagParams): Promise<DeleteTagResult>;
}
