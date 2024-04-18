import express from "express";
import { err_codes, status_codes } from "../types";
import tags from "../data/tags";
import { anyError } from "../utils";
import { MongoDBUserRepository } from "../repository/mongodb";
import { Interactions, type RegisterBody } from "./auth";
import { v4 as uuidv4 } from "uuid";

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
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik İçerik gönderildi", code: err_codes.MISSING_CONTENT } },
    });
    return;
  }

  if (!checkForumType_(type_)) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Geçersiz forum tipi!!!", code: err_codes.INVALID_FORUM_TYPE } },
    });
    return;
  }

  if (Array.isArray(tag)) {
    let r: boolean = true;
    tag.forEach((t) => {
      if (!tags.find((i) => i.tag_name == t)) r = false;
    });

    if (!r) {
      res.status(402).json({
        success: false,
        data: { error: { message: "Geçersiz forum tagi!!!", err_codes: err_codes.INVALID_FORUM_TAG } },
      });

      return;
    }
  } else if (!tags.find((i) => i.tag_name == tag)) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Geçersiz forum tagi!!!", err_codes: err_codes.INVALID_FORUM_TAG } },
    });
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
    if (user) await userRepo.updateOne({ nickname }, { $set: { forums: [...user.forums, userForum] } });
    else {
      res.status(402).json({
        success: false,
        data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
      });
      return;
    }
  } catch (err) {
    res.status(400).json(anyError(err));
    return;
  } finally {
    await userRepo.close();
  }
  res.status(200).json({ success: true, data: "Forum başarılı bir şekilde eklendi." });
};

export const likeForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  const forumOwnerNickname = req.params.forumOwner;
  const nickname = req.cookies.nickname;

  if (!_id || !forumOwnerNickname) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik params gönderildi!", code: err_codes.MISSING_PARAMS } },
    });
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner: RegisterBody | null = await userRepo.findOne({ nickname: forumOwnerNickname });
    if (forumOwner) {
      const userForum: ForumBody | undefined = forumOwner.forums.find((i) => i._id == _id);
      if (userForum) {
        // kullanıcı forumu beğenmişse hata döndür ve return et
        if (userForum.likes.users.includes(nickname)) {
          res.status(402).json({
            success: false,
            data: { error: { message: "Bu forumu zaten beğendiniz.", code: err_codes.ALREADY_LIKED } },
          });
          return;
        }
        userForum.likes.count += 1;
        userForum.likes.users.push(nickname);
        const newUserForums = forumOwner.forums.filter((i) => i._id != _id);
        newUserForums.push(userForum);

        // add interaction
        const userWhoLiked = await userRepo.findOne({ nickname });
        if (userWhoLiked) {
          const newUserInteractions: Interactions = {
            likedForums: [...userWhoLiked.interactions?.likedForums, { _id, author: userForum.author, title: userForum.title, releaseDate: userForum.releaseDate }],
            commented: [...userWhoLiked.interactions?.commented],
          };
          await userRepo.updateOne({ nickname }, { $set: { interactions: newUserInteractions } });
        } else {
          res.status(402).json({
            success: false,
            data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
          });
          return;
        }

        await userRepo.updateOne({ nickname: forumOwnerNickname }, { $set: { forums: newUserForums } });
      } else {
        res.status(402).json({
          success: false,
          data: { error: { message: "Forum bulunamadı!!!", code: err_codes.FORUM_NOT_EXIST } },
        });
        return;
      }
    } else {
      res.status(402).json({
        success: false,
        data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
      });
      return;
    }
  } catch (err) {
    res.status(400).json({ success: false, data: { error: { message: `Bir hata oluştu: ${err}`, code: err_codes.ANY_ERR } } });
    return;
  } finally {
    await userRepo.close();
  }
  res.status(200).json({ success: true, data: "Forum Beğenildi" });
};

export const unlikeForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  const forumOwnerNickname = req.params.forumOwner;
  const nickname = req.cookies.nickname; // unliked user nickname
  if (!_id || !forumOwnerNickname) {
    res.status(402).json({ success: false, data: { error: { message: "Eksik params gönderildi.", code: err_codes.MISSING_PARAMS } } })
    return
  }

  const repo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner = await repo.findOne({ nickname: forumOwnerNickname });
    if (!forumOwner) {
      res.status(402).json({ success: false, data: { error: { message: "Bu kullanıcı adına sahip bir forum bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return
    }
    const forum = forumOwner.forums.find((forum) => forum._id == _id);
    if (!forum) {
      res.status(402).json({ success: false, data: { error: { message: "Bu Id'ye ait forum bulunamadı!", code: err_codes.FORUM_NOT_EXIST } } });
      return;
    }

    forum.likes.count -= 1;
    forum.likes.users = forum.likes.users.filter(user => user != nickname);
    const newForums = forumOwner?.forums.filter((forum) => forum._id != _id);
    newForums?.push(forum)

    await repo.updateOne({ nickname: forum.author }, { $set: { forums: newForums } });

    // update interactions
    const user = await repo.findOne({ nickname });
    if (!user) {
      res.status(401).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    user.interactions.likedForums = user?.interactions.likedForums.filter((ls) => ls._id != _id);
    await repo.updateOne({ nickname }, { $set: { interactions: user.interactions } });
    res.status(200).json({ success: true, data: "Beğeni geri alındı." });
  } catch (err: any) {
    res.status(400).json(anyError(err));
  } finally {
    await repo.close()
  }
}

export const deleteForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  if (!_id) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik bilgi gönderildi!!!", code: err_codes.MISSING_CONTENT } },
    });
    return;
  }

  const nickname = req.cookies.nickname as string;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (user) {
      if (!user.forums.find((i) => i._id == _id)) {
        res.status(402).json({
          success: false,
          data: { error: { message: "Forum bulunamadı!!!", code: err_codes.FORUM_NOT_EXIST } },
        });
        return;
      }
      user.forums = user.forums.filter((i) => i._id != _id);
      await userRepo.updateOne({ nickname }, { $set: { forums: user.forums } });
    } else {
      res.status(402).json({
        success: false,
        data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
      });
      return;
    }
  } catch (err) {
    res.status(400).json(anyError(err));
    return;
  } finally {
    await userRepo.close();
  }

  res.status(200).json({ success: true, data: "Forum Silindi." });
};

export const createComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumOwner, _id } = req.params;
  const { content } = req.body;
  if (!forumOwner || !_id || !content) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik param gönderildi!!!", code: err_codes.MISSING_PARAMS } },
    });
    return;
  }
  const author = req.cookies.nickname
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user: RegisterBody | null = await userRepo.findOne({ nickname: forumOwner });
    if (user) {
      const date = new Date();
      const comment: CommentBody = {
        _id: uuidv4(),
        author,
        content,
        releaseDate: date.toLocaleString(),
      };

      const forum = user.forums.find((i) => i._id == _id);
      if (forum) {
        forum.comments.push(comment);
        await userRepo.updateOne({ nickname: forumOwner }, { $set: { forums: [...user.forums.filter((i) => i._id != forum._id), forum] } });

        // add interaction a comment
        const authorAcc = await userRepo.findOne({ nickname: author });
        if (authorAcc) {
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
        } else {
          res.status(402).json({
            success: false,
            data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
          });
          return;
        }
      } else {
        res.status(402).json({
          success: false,
          data: { error: { message: "Forum bulunamadı!!!", code: err_codes.FORUM_NOT_EXIST } },
        });
        return;
      }
    } else {
      res.status(402).json({
        success: false,
        data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
      });
      return;
    }
  } catch (err) {
    res.status(400).json(anyError(err));
    return;
  } finally {
    await userRepo.close();
  }

  res.status(200).json({ success: true, data: "Yorum eklendi." });
};

export const deleteComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumOwner, _id, commentID } = req.params
  if (!forumOwner || !_id || !commentID) {
    res.status(status_codes.BAD_REQUEST).json({ success: false, data: { error: { message: "Eksik param gönderildi!", code: err_codes.MISSING_PARAMS } } })
    return
  }

  const repo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" })
  try {
    const forumOwnerData = await repo.findOne({ nickname: forumOwner })
    if (!forumOwnerData) {
      res.
        status(status_codes.NOT_FOUND).
        json({ success: false, data: { error: { message: "Forum sahibine ait hesap bulunamadı!", code: err_codes.USER_NOT_EXIST } } })
      return
    }

    const forum = forumOwnerData.forums.find(forum => forum._id == _id)
    if (!forum) {
      res
        .status(status_codes.NOT_FOUND)
        .json({ success: false, data: { error: { message: "Gönderilen id'ye ait forum bulunamadı!", code: err_codes.FORUM_NOT_EXIST } } })
      return
    }

    forum.comments = forum.comments.filter(comment => comment._id != commentID)
    const updatedForums = [...forumOwnerData.forums.filter(forum => forum._id != _id), forum]
    await repo.updateOne({ nickname: forumOwnerData.nickname }, { $set: { forums: updatedForums } })

    const nickname = req.cookies.nickname
    const commentOwner = await repo.findOne({ nickname })
    if (!commentOwner) {
      res
        .status(status_codes.NOT_FOUND)
        .json({ success: false, data: { error: { message: "Yorum sahibi bulunamadı!", code: err_codes.USER_NOT_EXIST } } })
      return
    }

    const newCommentedInteractions = commentOwner.interactions.commented.filter(c => c._id != _id)
    const newUserInteractions: Interactions = { likedForums: commentOwner.interactions.likedForums, commented: newCommentedInteractions }
    await repo.updateOne({ nickname }, { $set: { interactions: newUserInteractions } })
    res.status(status_codes.OK).json({ success: true, data: "Yorum silindi" })
  } catch (err: any) {
    res.status(status_codes.INTERNAL_SERVER_ERROR).json(anyError(err))
  }
}

type UpdateForumBody = {
  tag: Tags | Tags[];
  title: string;
  content: string;
  type_: ForumTypes;
};

export const updateForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  if (!_id) {
    res.status(402).json({ success: false, data: { error: { message: "id bulunamadı!!!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  const data: Partial<UpdateForumBody> = req.body;
  if (!data) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik İçerik gönderildi!!!", code: err_codes.MISSING_CONTENT } },
    });
    return;
  }

  if (data.title == "" || data.content == "") {
    res.status(402).json({
      success: false,
      data: { error: { message: "Başlık ya da içerik boş olamaz!!!", code: err_codes.INVALID_FIELD } },
    });
    return;
  }

  const allowedFields: (keyof UpdateForumBody)[] = ["tag", "title", "content", "type_"];
  const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field as keyof UpdateForumBody));
  if (invalidFields.length > 0) {
    res.status(402).json({ success: false, data: { error: { message: "Geçersiz alan adı.", code: err_codes.INVALID_FIELD } } });
    return;
  }

  if (data.tag) {
    if (Array.isArray(data.tag)) {
      for (const t of data.tag) {
        if (!tags.find((i) => i.tag_name == t)) {
          res.status(402).json({
            success: false,
            data: { error: { message: "Geçersiz forum tagi!!!", err_codes: err_codes.INVALID_FORUM_TAG } },
          });
          return;
        }
      }
    } else {
      if (tags.filter((i) => i.tag_name == data.tag).length == 0) {
        res.status(402).json({
          success: false,
          data: { error: { message: "Geçersiz forum tagi!!!", err_codes: err_codes.INVALID_FORUM_TAG } },
        });
        return;
      }
    }
  }

  if (data.type_) {
    if (!checkForumType_(data.type_)) {
      res.status(402).json({
        success: false,
        data: { error: { message: "Geçersiz forum tipi!!!", code: err_codes.INVALID_FORUM_TYPE } },
      });
      return;
    }
  }

  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (user) {
      let updatedUserForum = user.forums.find((i) => i._id == _id);
      if (updatedUserForum) {
        const date = new Date();
        updatedUserForum = { ...updatedUserForum, ...data, lastUpdate: date.toLocaleString() };
      } else {
        res.status(402).json({
          success: false,
          data: { error: { message: "Forum bulunamadı!!!", code: err_codes.FORUM_NOT_EXIST } },
        });
        return;
      }
      await userRepo.updateOne({ nickname }, { $set: { forums: [...user.forums.filter((i) => i._id != _id), updatedUserForum] } });
    } else {
      res.status(402).json({
        success: false,
        data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
      });
      return;
    }
  } catch (err) {
    res.status(400).json(anyError(err));
    return;
  } finally {
    await userRepo.close();
  }

  res.status(200).json({ success: true, data: "Forum Güncellendi." });
};

export const getTags: express.Handler = (req: express.Request, res: express.Response) => {
  res.status(200).json({ success: true, data: tags });
};
