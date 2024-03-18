import axios from "axios";
import { type SuccessResponse, type UnsuccessfulResponse } from "../types";

export default class AccountService {
  private static update_name_surname_endpoint: string = import.meta.env.VITE_UPDATE_NAME_SURNAME_ENDPOINT;
  private static update_nickname_endpoint: string = import.meta.env.VITE_UPDATE_NICKNAME_ENDPOINT;
  private static update_date_of_birth_endpoint: string = import.meta.env.VITE_UPDATE_DATE_OF_BIRTH_ENDPOINT;
  private static update_email_endpoint: string = import.meta.env.VITE_UPDATE_EMAIL_ENDPOINT;
  private static password_is_it_correct_endpoint: string = import.meta.env.VITE_PASSWORD_IS_IT_CORRECT_ENDPOINT;
  private static update_password_endpoint: string = import.meta.env.VITE_UPDATE_PASSWORD_ENDPOINT;

  static async updateNameSurname(
    name: string,
    surname: string,
    confirmPassword: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.update_name_surname_endpoint,
        { name, surname, confirmPassword_: confirmPassword },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async updateNickname(
    nickname: string,
    confirmPassword: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.update_nickname_endpoint,
        { nickname, confirmPassword_: confirmPassword },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async updateDateOfBirth(
    dateOfBirth: string,
    confirmPassword: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.update_date_of_birth_endpoint,
        { dateOfBirth, confirmPassword_: confirmPassword },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<string>;
    } catch (err: any) {
      return {
        success: false,
        data: err.response.data.data,
      } as UnsuccessfulResponse;
    }
  }

  static async updateEmail(email: string, confirmPassword: string): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.update_email_endpoint,
        { email, confirmPassword_: confirmPassword },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<string>;
    } catch (err: any) {
      return { success: false, data: err.response.data.data } as UnsuccessfulResponse;
    }
  }

  static async passwordIsItCorrect(
    password: string
  ): Promise<SuccessResponse<{ passwordIsItCorrect: boolean }> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<{ passwordIsItCorrect: boolean }>>(
        this.password_is_it_correct_endpoint,
        { password },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<{ passwordIsItCorrect: boolean }>;
    } catch (err: any) {
      return { success: false, data: err.response.data.data } as UnsuccessfulResponse;
    }
  }

  static async updatePassword(
    password: string,
    confirmPassword: string
  ): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string>>(
        this.update_password_endpoint,
        { password, confirmPassword_: confirmPassword },
        { withCredentials: true }
      );

      return { success: true, data: data.data } as SuccessResponse<string>;
    } catch (err: any) {
      return { success: false, data: err.response.data.data } as UnsuccessfulResponse;
    }
  }
}
