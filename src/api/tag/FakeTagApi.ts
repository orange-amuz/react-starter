import getTagsJson from '@/assets/dummies/getTags.json';
import TagEntity from '@/entities/TagEntity';
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
import ITagApi from './ITagApi';

export default class FakeTagApi extends ITagApi {
  private fakeTags: unknown[] = getTagsJson;

  async getTags(): Promise<GetTagsResult> {
    return {
      success: true,
      message: null,
      data: this.fakeTags.map((item) => TagEntity.fromJson(item)),
    };
  }

  async getTagById(params: GetTagByIdParams): Promise<GetTagByIdResult> {
    const found = this.fakeTags.find((item) => {
      const parsed = TagEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (!found) {
      return {
        success: false,
        message: `Tag with id ${params.id} not found`,
        data: null,
      };
    }

    return {
      success: true,
      message: null,
      data: TagEntity.fromJson(found),
    };
  }

  async createTag(params: CreateTagParams): Promise<CreateTagResult> {
    const now = new Date().toISOString();
    const maxId = this.fakeTags.reduce<number>((max, item) => {
      const parsed = TagEntity.fromJson(item);

      return Math.max(max, parsed.id);
    }, 0);

    const newTag = {
      id: maxId + 1,
      name: params.name,
      color: params.color,
      created_at: now,
      updated_at: now,
    };

    this.fakeTags.push(newTag);

    return {
      success: true,
      message: null,
      data: TagEntity.fromJson(newTag),
    };
  }

  async updateTag(params: UpdateTagParams): Promise<UpdateTagResult> {
    const index = this.fakeTags.findIndex((item) => {
      const parsed = TagEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (index < 0) {
      return {
        success: false,
        message: `Tag with id ${params.id} not found`,
        data: null,
      };
    }

    const current = TagEntity.fromJson(this.fakeTags[index]);
    const now = new Date().toISOString();
    const updated = {
      id: current.id,
      name: params.name ?? current.name,
      color: params.color ?? current.color,
      created_at: current.createdAt,
      updated_at: now,
    };

    this.fakeTags[index] = updated;

    return {
      success: true,
      message: null,
      data: TagEntity.fromJson(updated),
    };
  }

  async deleteTag(params: DeleteTagParams): Promise<DeleteTagResult> {
    const index = this.fakeTags.findIndex((item) => {
      const parsed = TagEntity.fromJson(item);

      return parsed.id === params.id;
    });

    if (index < 0) {
      return {
        success: false,
        message: `Tag with id ${params.id} not found`,
      };
    }

    this.fakeTags.splice(index, 1);

    return {
      success: true,
      message: null,
    };
  }
}
