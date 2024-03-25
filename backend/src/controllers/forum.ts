import express from "express";
import { err_codes } from "../types";
import tags from "../data/tags";
import { anyError, mongoClient } from "../utils";
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
      console.log("dwadwad");
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
  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const user: RegisterBody | null = await coll.findOne<RegisterBody>({ nickname });
    if (user) await coll.updateOne({ nickname }, { $set: { forums: [...user.forums, userForum] } });
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
    await client.close();
  }
  res.status(200).json({ success: true, data: "Forum başarılı bir şekilde eklendi." });
};

export const likeForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const _id = req.params._id;
  const forumOwnerNickname = req.params.forumOwner;
  const nickname = req.cookies.nickname;

  if (!_id) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik bilgi gönderildi!!!", code: err_codes.MISSING_CONTENT } },
    });
    return;
  }

  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const forumOwner: RegisterBody | null = await coll.findOne<RegisterBody>({ nickname: forumOwnerNickname });
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
        const userWhoLiked = await coll.findOne<RegisterBody>({ nickname });
        if (userWhoLiked) {
          const newUserInteractions: Interactions = {
            likedForums: [
              ...userWhoLiked.interactions?.likedForums,
              { _id, author: userForum.author, title: userForum.title, releaseDate: userForum.releaseDate },
            ],
            commented: [...userWhoLiked.interactions?.commented],
          };
          await coll.updateOne({ nickname }, { $set: { interactions: newUserInteractions } });
        } else {
          res.status(402).json({
            success: false,
            data: { error: { message: "Kullanıcı bulunamadı!!!", code: err_codes.USER_NOT_EXIST } },
          });
          return;
        }

        await coll.updateOne({ nickname: forumOwnerNickname }, { $set: { forums: newUserForums } });
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
    await client.close();
  }
  res.status(200).json({ success: true, data: "Forum Beğenildi" });
};

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
  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const user = await coll.findOne<RegisterBody>({ nickname });
    if (user) {
      if (!user.forums.find((i) => i._id == _id)) {
        res.status(402).json({
          success: false,
          data: { error: { message: "Forum bulunamadı!!!", code: err_codes.FORUM_NOT_EXIST } },
        });
        return;
      }
      user.forums = user.forums.filter((i) => i._id != _id);
      await coll.updateOne({ nickname }, { $set: { forums: user.forums } });
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
    await client.close();
  }

  res.status(200).json({ success: true, data: "Forum Silindi." });
};

export const createComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const forumOwner = req.params.forumOwner;
  const _id = req.params._id;
  const author = req.cookies.nickname;
  const { content } = req.body;
  if (!forumOwner || !_id || !author || !content) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Eksik içerik gönderildi!!!", code: err_codes.MISSING_CONTENT } },
    });
    return;
  }

  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const user: RegisterBody | null = await coll.findOne<RegisterBody>({ nickname: forumOwner });
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
        await coll.updateOne(
          { nickname: forumOwner },
          { $set: { forums: [...user.forums.filter((i) => i._id != forum._id), forum] } }
        );

        // add interaction a comment
        const authorAcc = await coll.findOne<RegisterBody>({ nickname: author });
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

          await coll.updateOne({ nickname: author }, { $set: { interactions: newUserInteractions } });
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
    await client.close();
  }

  res.status(200).json({ success: true, data: "Yorum eklendi." });
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
  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const user = await coll.findOne<RegisterBody>({ nickname });
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
      await coll.updateOne({ nickname }, { $set: { forums: [...user.forums.filter((i) => i._id != _id), updatedUserForum] } });
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
    await client.close();
  }

  res.status(200).json({ success: true, data: "Forum Güncellendi." });
};

export const getTags: express.Handler = (req: express.Request, res: express.Response) => {
  res.status(200).json({ success: true, data: tags });
};
