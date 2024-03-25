export enum err_codes {
  // eksik içerik
  MISSING_CONTENT = "MISSING_CONTENT",
  // herhangi bir hata
  ANY_ERR = "ANY_ERR",

  //? auth hata kodları
  // geçersiz email formatı
  INVALID_EMAIL_FORMAT = "INVALID_EMAIL_FORMAT",
  // geçersiz şifre uzunluğu
  INVALID_PASSWORD_LENGTH = "INVALID_PASSWORD_LENGTH",
  // kullanıcı bulunamadı
  USER_NOT_EXIST = "USER_NOT_EXIST",
  // kullanıcı mevcut
  USER_EXIST = "USER_EXIST",
  // yanlış şifre
  WRONG_PASSWORD = "WRONG_PASSWORD",

  //? forum hata codları
  INVALID_FORUM_TYPE = "INVALID_FORUM_TYPE",
  INVALID_FORUM_TAG = "INVALID_FORUM_TAG",
  FORUM_NOT_EXIST = "FORUM_NOT_EXIST",
  INVALID_FIELD = "INVALID_FIELD",

  PASSWORD_VERIFICATION_FAILED = "PASSWORD_VERIFICATION_FAILED",

  // account
  NO_CHANGES_WERE_MADE = "NO_CHANGES_WERE_MADE",

  // likes
  ALL_READY_LIKED = "ALL_READY_LIKED",
}
