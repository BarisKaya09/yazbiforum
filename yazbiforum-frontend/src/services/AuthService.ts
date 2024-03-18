import axios from "axios";
import { SuccessResponse, UnsuccessfulResponse } from "../types";

type Signup = {
  name: string;
  surname: string;
  age: string; // 20.12.2004;
  nickname: string;
  email: string; // incorrect email format: @gmali.com | a@gmail | a@gmail.a;
  password: string; // min len 7;
};

type Signin = {
  nickname: string;
  password: string;
};

export default class AuthService {
  private static readonly signup_endpoint: string = import.meta.env.VITE_SIGNUP_ENDPOINT as string;
  private static readonly signin_endpoint: string = import.meta.env.VITE_SIGNIN_ENDPOINT as string;
  private static readonly logout_endpoint: string = import.meta.env.VITE_LOGOUT_ENDPOINT as string;
  private static readonly isLoggedIn_endpoint: string = import.meta.env.VITE_ISLOGGEDIN_ENDPOINT as string;

  static async signup(user: Signup): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(this.signup_endpoint, user, {
        withCredentials: true,
      });
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

  static async signin(user: Signin): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(this.signin_endpoint, user, {
        withCredentials: true,
      });
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

  static async logout(): Promise<SuccessResponse<string> | UnsuccessfulResponse> {
    try {
      const { data } = await axios.post<SuccessResponse<string> | UnsuccessfulResponse>(
        this.logout_endpoint,
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

  static async isLoggedin(): Promise<boolean> {
    try {
      const { data } = await axios.get(this.isLoggedIn_endpoint, { withCredentials: true });
      if (data.success) return true;
    } catch (err: any) {
      console.log(err.response.data);
    }
    return false;
  }
}
