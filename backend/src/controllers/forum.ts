import express from "express";
import { status_codes } from "../types";
import tags from "../data/tags";
import { MongoDBUserRepository } from "../repository/mongodb";
import { Interactions, type RegisterBody } from "./auth";
import { v4 as uuidv4 } from "uuid";
import response, {
  ALREADY_LIKED,
  ANY_ERR,
  FORUM_NOT_EXIST,
  INVALID_FIELD,
  INVALID_FORUM_TAG,
  INVALID_FORUM_TYPE,
  MISSING_CONTENT,
  MISSING_PARAMS,
  USER_NOT_EXIST,
} from "../lib/response";

// utils funcs
const checkForumType_ = (type_: ForumTypes): boolean => {
  if (type_ != DISCUSSION && type_ != QUESTION && type_ != INFORMATION) return false;
  else return true;
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
  _id: string;
  author: string;
  content: string;
  releaseDate: string;
};

export type ForumTypes = "tartışma" | "soru" | "bilgi";

export const DISCUSSION: string = "tartışma";
export const QUESTION: string = "soru";
export const INFORMATION: string = "bilgi";

export const createForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const { tag, title, content, type_ }: ForumBody = req.body as ForumBody;
  if (!tag || !title || !content || !type_) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  if (!checkForumType_(type_)) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TYPE());
    return;
  }

  if (Array.isArray(tag)) {
    let r: boolean = true;
    tag.forEach((t) => {
      if (!tags.find((i) => i.tag_name == t)) r = false;
    });

    if (!r) {
      response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TAG());
      return;
    }
  } else if (!tags.find((i) => i.tag_name == tag)) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TAG());
    return;
  }

  const date = new Date();

  const userForum: ForumBody = {
    _id: uuidv4(),
    author: req.cookies.nickname,
    tag,
    title,
    content,
    type_,
    releaseDate: date.toLocaleString(),
    lastUpdate: "",
    comments: [],
    likes: {
      count: 0,
      users: [],
    },
  };

  const nickname = req.cookies.nickname as string;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user: RegisterBody | null = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.BAD_REQUEST, USER_NOT_EXIST());
      return;
    }
    await userRepo.updateOne({ nickname }, { $set: { forums: [...user.forums, userForum] } });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }
  response(res).success(status_codes.OK, "Forum başarılı bir şekilde eklendi.");
};

export const likeForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  const forumOwnerNickname = req.params.forumOwner;
  const nickname = req.cookies.nickname;

  if (!_id || !forumOwnerNickname) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner: RegisterBody | null = await userRepo.findOne({ nickname: forumOwnerNickname });
    if (!forumOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Forumun ait olduğu kullanıcı bulunamadı!"));
      return;
    }

    const userForum: ForumBody | undefined = forumOwner.forums.find((i) => i._id == _id);
    if (!userForum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }
    // kullanıcı forumu beğenmişse hata döndür ve return et
    if (userForum.likes.users.includes(nickname)) {
      response(res).unsuccess(status_codes.BAD_REQUEST, ALREADY_LIKED());
      return;
    }
    userForum.likes.count += 1;
    userForum.likes.users.push(nickname);
    const newUserForums = forumOwner.forums.filter((i) => i._id != _id);
    newUserForums.push(userForum);

    // add interaction
    const userWhoLiked = await userRepo.findOne({ nickname });
    if (!userWhoLiked) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Beğeni atan kullanıcı bulunamaıd!"));
      return;
    }

    const newUserInteractions: Interactions = {
      likedForums: [...userWhoLiked.interactions?.likedForums, { _id, author: userForum.author, title: userForum.title, releaseDate: userForum.releaseDate }],
      commented: [...userWhoLiked.interactions?.commented],
    };

    await userRepo.updateOne({ nickname }, { $set: { interactions: newUserInteractions } });
    await userRepo.updateOne({ nickname: forumOwnerNickname }, { $set: { forums: newUserForums } });

    response(res).success(status_codes.OK, "Forum Beğenildi");
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }
};

export const unlikeForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  const forumOwnerNickname = req.params.forumOwner;
  const nickname = req.cookies.nickname; // unliked user nickname
  if (!_id || !forumOwnerNickname) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }

  const repo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner = await repo.findOne({ nickname: forumOwnerNickname });
    if (!forumOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Forumun ait olduğu kullanıcı bulunamadı!"));
      return;
    }
    const forum = forumOwner.forums.find((forum) => forum._id == _id);
    if (!forum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }

    forum.likes.count -= 1;
    forum.likes.users = forum.likes.users.filter((user) => user != nickname);
    const newForums = forumOwner?.forums.filter((forum) => forum._id != _id);
    newForums?.push(forum);

    await repo.updateOne({ nickname: forum.author }, { $set: { forums: newForums } });

    // update interactions
    const user = await repo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }
    user.interactions.likedForums = user?.interactions.likedForums.filter((ls) => ls._id != _id);
    await repo.updateOne({ nickname }, { $set: { interactions: user.interactions } });
    response(res).success(status_codes.OK, "Beğeni geri alındı.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await repo.close();
  }
};

export const deleteForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  if (!_id) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }

  const nickname = req.cookies.nickname as string;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }
    if (!user.forums.find((i) => i._id == _id)) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }
    user.forums = user.forums.filter((i) => i._id != _id);
    await userRepo.updateOne({ nickname }, { $set: { forums: user.forums } });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }

  response(res).success(status_codes.OK, "Forum Silindi.");
};

export const createComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumOwner, _id } = req.params;
  const { content } = req.body;
  if (!forumOwner || !_id || !content) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }
  const author = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user: RegisterBody | null = await userRepo.findOne({ nickname: forumOwner });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Forumun ait olduğu kullanıcı bulunamadı!"));
      return;
    }
    const date = new Date();
    const comment: CommentBody = {
      _id: uuidv4(),
      author,
      content,
      releaseDate: date.toLocaleString(),
    };

    const forum = user.forums.find((i) => i._id == _id);
    if (!forum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }
    forum.comments.push(comment);
    await userRepo.updateOne({ nickname: forumOwner }, { $set: { forums: [...user.forums.filter((i) => i._id != forum._id), forum] } });

    // add interaction a comment
    const authorAcc = await userRepo.findOne({ nickname: author });
    if (!authorAcc) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    const newUserInteractions: Interactions = {
      likedForums: [...authorAcc.interactions?.likedForums],
      commented: [
        ...authorAcc.interactions.commented,
        {
          _id,
          author: forum.author,
          title: forum.title,
          releaseDate: forum.releaseDate,
          comment: { _id: comment._id, content, releaseDate: date.toLocaleString() },
        },
      ],
    };

    await userRepo.updateOne({ nickname: author }, { $set: { interactions: newUserInteractions } });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }

  response(res).success(status_codes.OK, "Yorum eklendi.");
};

export const deleteComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumOwner, _id, commentID } = req.params;
  if (!forumOwner || !_id || !commentID) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }

  const repo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwnerData = await repo.findOne({ nickname: forumOwner });
    if (!forumOwnerData) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Bu forumun ait olduğu kullanıcı bulunamadı!"));
      return;
    }

    const forum = forumOwnerData.forums.find((forum) => forum._id == _id);
    if (!forum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }

    forum.comments = forum.comments.filter((comment) => comment._id != commentID);
    const updatedForums = [...forumOwnerData.forums.filter((forum) => forum._id != _id), forum];
    await repo.updateOne({ nickname: forumOwnerData.nickname }, { $set: { forums: updatedForums } });

    const nickname = req.cookies.nickname;
    const commentOwner = await repo.findOne({ nickname });
    if (!commentOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Bu yorumu oluşturan kullanıcı bulunamadı!"));
      return;
    }

    const newCommentedInteractions = commentOwner.interactions.commented.filter((c) => c._id != _id);
    const newUserInteractions: Interactions = { likedForums: commentOwner.interactions.likedForums, commented: newCommentedInteractions };
    await repo.updateOne({ nickname }, { $set: { interactions: newUserInteractions } });
    response(res).success(status_codes.OK, "Yorum silindi!");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  }
};

type UpdateForumBody = {
  tag: Tags | Tags[];
  title: string;
  content: string;
  type_: ForumTypes;
};

export const updateForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  if (!_id) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_PARAMS());
    return;
  }

  const data: Partial<UpdateForumBody> = req.body;
  if (!data) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  if (data.title == "" || data.content == "") {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FIELD("Başlık ve İçerik alanları boş olamaz!"));
    return;
  }

  const allowedFields: (keyof UpdateForumBody)[] = ["tag", "title", "content", "type_"];
  const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field as keyof UpdateForumBody));
  if (invalidFields.length > 0) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FIELD("Geçersiz alan adı!"));
    return;
  }

  if (data.tag) {
    if (Array.isArray(data.tag)) {
      for (const t of data.tag) {
        if (!tags.find((i) => i.tag_name == t)) {
          response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TAG());
          return;
        }
      }
    } else {
      if (tags.filter((i) => i.tag_name == data.tag).length == 0) {
        response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TAG());
        return;
      }
    }
  }

  if (data.type_) {
    if (!checkForumType_(data.type_)) {
      response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TYPE());
      return;
    }
  }

  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }
    let updatedUserForum = user.forums.find((i) => i._id == _id);
    if (!updatedUserForum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(_id));
      return;
    }
    const date = new Date();
    updatedUserForum = { ...updatedUserForum, ...data, lastUpdate: date.toLocaleString() };
    await userRepo.updateOne({ nickname }, { $set: { forums: [...user.forums.filter((i) => i._id != _id), updatedUserForum] } });

    response(res).success(status_codes.OK, "Forum güncellendi!");
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }
};

export const getTags: express.Handler = (req: express.Request, res: express.Response) => {
  response(res).success(status_codes.OK, tags);
};
