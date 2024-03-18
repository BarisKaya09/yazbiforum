import axios from "axios";
import { type SuccessResponse, type UnsuccessfulResponse, type Interactions } from "../types";

export default class InteractionsService {
  private static get_all_interactions_endpoint: string = import.meta.env.VITE_GET_ALL_INTERACTIONS;
  private static delete_comment_endpoint: string = import.meta.env.VITE_DELETE_COMMENT;

  static async getAllInteractions(): Promise<SuccessResponse<Interactions> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.get<SuccessResponse<Interactions>>(this.get_all_interactions_endpoint, {
        withCredentials: true,
      });
      return {
        success: true,
        data: data.data,
      } as SuccessResponse<Interactions>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async deleteComment(
    forumId: string,
    author: string,
    commentId: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.delete_comment_endpoint,
        { forumId, author, commentId },
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
}
