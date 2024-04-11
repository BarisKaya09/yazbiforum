export type LoadAnimates = "top-to-bottom" | "bottom-to-top" | "left-to-right" | "right-to-left" | "left-cross-to-bottom" | "right-cross-to-bottom";

export enum Colors {
  Text = "#402B3A",
  ColorfullyText = "#D63484",
  BackgroundColor = "#eee7db",
  ButtonCardBorder = "#D63484",
}

export type UserBody = {
  name: string;
  surname: string;
  age: number;
  nickname: string;
  email: string;
  password: string;
  forums: ForumBody[];
};

export type ForumBody = {
  _id: string;
  author: string;
  tag: Tags | Tags[];
  title: string;
  content: string;
  type_: ForumTypes;
  releaseDate: string;
  lastUpdate: string;
  comments: CommentBody[];
  likes: {
    count: number;
    users: string[];
  };
};

export type OPForumBody = {
  tag: Tags | Tags[];
  title: string;
  content: string;
  type_: ForumTypes;
};

export type ForumTypes = "tartışma" | "soru" | "bilgi";

export type Tags =
  | "bilim"
  | "yazılım"
  | "grafik"
  | "siyaset"
  | "sosyal medya"
  | "yazarlık"
  | "matematik"
  | "edebiyat"
  | "ingizilizce"
  | "oyun"
  | "yayıncılık"
  | "yapay zeka"
  | "gündem"
  | "siber güvenlik"
  | "mühendislik"
  | "yemek"
  | "airsoft"
  | "sağlık"
  | "ekonomi"
  | "elektronik"
  | "ticaret"
  | "e-ticaret"
  | "sanat"
  | "müzik"
  | "eğitim"
  | "futbol"
  | "basketbol"
  | "voleybol"
  | "spor";

export type CommentBody = {
  author: string;
  content: string;
  releaseDate: string;
};

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
}

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export type UnsuccessfulResponse = {
  success: false;
  data: { error: { message: string; code: err_codes } };
};

export type UpdateForumBody = {
  tag: Tags | Tags[];
  title: string;
  content: string;
  type_: ForumTypes;
};

// edit fields
export type EditNameSurnameFields = {
  name: string;
  surname: string;
};

export type EditNicknameFields = {
  nickname: string;
};

export type EditDateOfBirthFields = {
  dateOfBirth: string;
};

export type EditEmailFields = {
  email: string;
};

export type EditPasswordFields = {
  password: string;
};

export type EditAccountData = EditNameSurnameFields | EditNicknameFields | EditDateOfBirthFields | EditEmailFields | EditPasswordFields;

export type EditField = "name-surname" | "nickname" | "date-of-birth" | "email" | "password";

export type LikedForum = { _id: string; author: string; title: string; releaseDate: string }[];
export type Commented = {
  _id: string;
  author: string;
  title: string;
  releaseDate: string;
  comment: { _id: string; content: string; releaseDate: string };
}[];
export type Interactions = {
  // kullanıcının beğendiği forumların id bilgileri burada saklanacak.
  likedForums: LikedForum;
  // kullanıcının yorum yaptığı forumların id bilgileri burada saklanacak.
  commented: Commented;
};
