/*
 *  success: {success: true, data: "mesaj"}
 *  unsuccess: {success: false, data: {error: {message: "mesaj", code: err_codes.}}}
 *
 * */
import express from "express";
import { err_codes, status_codes } from "../types";

type Unsuccess<T extends err_codes> = { message: string; code: T };
type Response = {
  success(status_code: status_codes, data: any): void;
  unsuccess<T extends err_codes>(status_code: status_codes, data: Unsuccess<T>): void;
};

const response = (res: express.Response): Response => {
  return {
    success: (status_code: status_codes, data: any): void => {
      res.status(status_code).json({ success: true, data: data });
    },
    unsuccess: <T extends err_codes>(status_code: status_codes, data: Unsuccess<T>): void => {
      res.status(status_code).json({ success: false, data: { error: data } });
    },
  } as Response;
};

export const MISSING_CONTENT = (): Unsuccess<err_codes.MISSING_CONTENT> => {
  return {
    message: "Eksik içerik gönderildi!",
    code: err_codes.MISSING_CONTENT,
  } as Unsuccess<err_codes.MISSING_CONTENT>;
};

export const MISSING_PARAMS = (): Unsuccess<err_codes.MISSING_PARAMS> => {
  return {
    message: "Eksik parametre gönderildi!",
    code: err_codes.MISSING_PARAMS,
  } as Unsuccess<err_codes.MISSING_PARAMS>;
};

export const ANY_ERR = (err: any): Unsuccess<err_codes.ANY_ERR> => {
  return {
    message: `[ Bir hata oluştu ]: ${err}`,
    code: err_codes.ANY_ERR,
  } as Unsuccess<err_codes.ANY_ERR>;
};

export const INVALID_EMAIL_FORMAT = (): Unsuccess<err_codes.INVALID_EMAIL_FORMAT> => {
  return {
    message: "Geçersiz email formatı!",
    code: err_codes.INVALID_EMAIL_FORMAT,
  } as Unsuccess<err_codes.INVALID_EMAIL_FORMAT>;
};

export const INVALID_PASSWORD_LENGTH = (): Unsuccess<err_codes.INVALID_PASSWORD_LENGTH> => {
  return {
    message: "Lütfen şifrenizi 7 karakterden fazla girin!",
    code: err_codes.INVALID_PASSWORD_LENGTH,
  } as Unsuccess<err_codes.INVALID_PASSWORD_LENGTH>;
};

export const USER_NOT_EXIST = (msg?: string): Unsuccess<err_codes.USER_NOT_EXIST> => {
  return {
    message: msg || "Kullanıcı bulunamadı!",
    code: err_codes.USER_NOT_EXIST,
  } as Unsuccess<err_codes.USER_NOT_EXIST>;
};

export const USER_EXIST = (): Unsuccess<err_codes.USER_EXIST> => {
  return {
    message: "Bu kullanıcı adına veya email adresine sahip kullanıcı kayıtlı!",
    code: err_codes.USER_EXIST,
  } as Unsuccess<err_codes.USER_EXIST>;
};

export const WRONG_PASSWORD = (): Unsuccess<err_codes.WRONG_PASSWORD> => {
  return {
    message: "Girilen şifre hatalı!",
    code: err_codes.WRONG_PASSWORD,
  } as Unsuccess<err_codes.WRONG_PASSWORD>;
};

export const INVALID_FORUM_TYPE = (): Unsuccess<err_codes.INVALID_FORUM_TYPE> => {
  return {
    message: "Geçersiz forum tipi!",
    code: err_codes.INVALID_FORUM_TYPE,
  } as Unsuccess<err_codes.INVALID_FORUM_TYPE>;
};

export const INVALID_FORUM_TAG = (): Unsuccess<err_codes.INVALID_FORUM_TAG> => {
  return {
    message: "Geçersiz forum tagı!",
    code: err_codes.INVALID_FORUM_TAG,
  } as Unsuccess<err_codes.INVALID_FORUM_TAG>;
};

export const FORUM_NOT_EXIST = (forumId: string): Unsuccess<err_codes.FORUM_NOT_EXIST> => {
  return {
    message: `${forumId}'ye ait forum bulunamadı!`,
    code: err_codes.FORUM_NOT_EXIST,
  } as Unsuccess<err_codes.FORUM_NOT_EXIST>;
};

export const INVALID_FIELD = (message: string): Unsuccess<err_codes.INVALID_FIELD> => {
  // farklı invalid field mesajları olabilir. (Geçersiz filed, eksik field vb.)
  return {
    message,
    code: err_codes.INVALID_FIELD,
  } as Unsuccess<err_codes.INVALID_FIELD>;
};

export const PASSWORD_VERIFICATION_FAILED = (): Unsuccess<err_codes.PASSWORD_VERIFICATION_FAILED> => {
  return {
    message: "Şifre doğrulama hatalı!",
    code: err_codes.PASSWORD_VERIFICATION_FAILED,
  } as Unsuccess<err_codes.PASSWORD_VERIFICATION_FAILED>;
};

export const NO_CHANGES_WERE_MADE = (): Unsuccess<err_codes.NO_CHANGES_WERE_MADE> => {
  return {
    message: "Herhangi bir değişiklik yapılmadı!",
    code: err_codes.NO_CHANGES_WERE_MADE,
  } as Unsuccess<err_codes.NO_CHANGES_WERE_MADE>;
};

export const ALREADY_LIKED = (): Unsuccess<err_codes.ALREADY_LIKED> => {
  return {
    message: "Halihazırda beğenilmiş",
    code: err_codes.ALREADY_LIKED,
  } as Unsuccess<err_codes.ALREADY_LIKED>;
};

export default response;
