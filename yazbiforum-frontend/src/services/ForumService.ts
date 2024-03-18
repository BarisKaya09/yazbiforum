import axios from "axios";
import {
  type OPForumBody,
  type SuccessResponse,
  type UnsuccessfulResponse,
  type UpdateForumBody,
  type ForumBody,
} from "../types";
import { type ForumCountByTagsT } from "../components/dashboard/Home";

export default class ForumService {
  private static readonly create_forum_endpoint: string = import.meta.env.VITE_CREATE_FORUM_ENDPOINT;
  private static readonly like_forum_endpoint: string = import.meta.env.VITE_LIKE_FORUM_ENDPOINT;
  private static readonly delete_forum_endpoint: string = import.meta.env.VITE_DELETE_FORUM_ENDPOINT;
  private static readonly create_comment_endpoint: string = import.meta.env.VITE_CREATE_COMMENT_ENDPOINT;
  private static readonly update_forum_endpoint: string = import.meta.env.VITE_UPDATE_FORUM_ENDPOINT;
  private static readonly get_all_forums_endpoint: string = import.meta.env.VITE_GET_ALL_FORUMS_ENDPOINT;
  private static readonly get_forum_count_by_tags_endpoint: string = import.meta.env
    .VITE_GET_FORUM_COUNT_BY_TAGS_ENDPOINT;
  private static readonly get_total_likes_endpoint: string = import.meta.env.VITE_GET_TOTAL_LIKES_ENDPOINT;
  private static readonly get_forum_by_id_endpoint: string = import.meta.env.VITE_GET_FORUM_BY_ID_ENDPOINT;
  private static readonly get_user_forum_by_id_endpoint: string = import.meta.env.VITE_GET_USER_FORUM_BY_ID_ENDPOINT;
  private static readonly search_forum_endpoint: string = import.meta.env.VITE_SEARCH_FORUM_ENDPOINT;
  private static readonly search_user_forum_endpoint: string = import.meta.env.VITE_SEARCH_USER_FORUM_ENDPOINT;

  static async createForum(forum: OPForumBody): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.create_forum_endpoint,
        forum,
        {
          withCredentials: true,
        }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async likeForum(owner: string, id: string): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.like_forum_endpoint + owner + "/" + id,
        {},
        { withCredentials: true }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async deleteForum(id: string): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.delete_forum_endpoint + id,
        {},
        { withCredentials: true }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async createComment(
    forumOwner: string,
    id: string,
    comment: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.create_comment_endpoint + forumOwner + "/" + id,
        { content: comment },
        {
          withCredentials: true,
        }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  // implement edilmedi
  static async updateForum(
    id: string,
    updateBody: Partial<UpdateForumBody>
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.update_forum_endpoint + id,
        updateBody,
        { withCredentials: true }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async getAllForums(): Promise<SuccessResponse<ForumBody[]>> {
    try {
      const { data } = await axios.get<SuccessResponse<ForumBody[]>>(this.get_all_forums_endpoint, {
        withCredentials: true,
      });

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumBody[]>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async getForumCountByTags(): Promise<SuccessResponse<ForumCountByTagsT>> {
    try {
      const { data } = await axios.get<SuccessResponse<ForumCountByTagsT>>(this.get_forum_count_by_tags_endpoint, {
        withCredentials: true,
      });

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumCountByTagsT>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async getTotalLikes(): Promise<SuccessResponse<number>> {
    try {
      const { data } = await axios.get<SuccessResponse<number>>(this.get_total_likes_endpoint, {
        withCredentials: true,
      });

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<number>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async getForumById(author: string, id: string): Promise<SuccessResponse<ForumBody>> {
    try {
      const { data } = await axios.get<SuccessResponse<ForumBody>>(this.get_forum_by_id_endpoint + author + "/" + id, {
        withCredentials: true,
      });

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumBody>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async getUserForumById(id: string): Promise<SuccessResponse<ForumBody> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<ForumBody>>(this.get_user_forum_by_id_endpoint + id, {
        withCredentials: true,
      });

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumBody>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async searchForum(searchArg: string): Promise<SuccessResponse<ForumBody[]>> {
    try {
      const { data } = await axios.post<SuccessResponse<ForumBody[]>>(this.search_forum_endpoint, { searchArg });
      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumBody[]>;
    } catch (err: any) {
      throw err.response.data;
    }
  }

  static async searchUserForum(searchArg: string): Promise<SuccessResponse<ForumBody[]>> {
    try {
      const { data } = await axios.post<SuccessResponse<ForumBody[]>>(
        this.search_user_forum_endpoint,
        { searchArg },
        { withCredentials: true }
      );

      return {
        success: true,
        data: data.data,
      } as SuccessResponse<ForumBody[]>;
    } catch (err: any) {
      throw err.response.data;
    }
  }
}
