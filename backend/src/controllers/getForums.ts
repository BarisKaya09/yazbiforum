import express from "express";
import { type ForumTypes, type ForumBody, DISCUSSION, QUESTION, INFORMATION, type Tags } from "./forum";

import { MongoDBUserRepository } from "../repository/mongodb";
import { err_codes, status_codes } from "../types";
import tags from "../data/tags";
import response, { INVALID_FORUM_TYPE, ANY_ERR, USER_NOT_EXIST, FORUM_NOT_EXIST } from "../lib/response";

export const getFilteredForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const ftype: ForumTypes = req.params.forumType as ForumTypes;
  if (ftype != DISCUSSION && ftype != QUESTION && ftype != INFORMATION) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_FORUM_TYPE());
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const allForum = await userRepo.find({});
    const filteredForums = (await allForum.toArray())
      .map((x) => x.forums)
      .filter((x: any) => x.length)[0]
      .filter((x: any) => x.type_ == ftype);

    response(res).success(status_codes.OK, filteredForums);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const getAllForums: express.Handler = async (req: express.Request, res: express.Response) => {
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const allForums = await userRepo.find({});
    const forums = (await allForums.toArray()).map((x) => x.forums).filter((x) => x.length)[0];
    response(res).success(status_codes.OK, forums);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const getForumCountByTags: express.Handler = async (req: express.Request, res: express.Response) => {
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  const nickname = req.cookies.nickname;
  try {
    const userTags: Tags[] = [];
    const user = await userRepo.findOne({ nickname });
    user?.forums.forEach((x) => {
      if (Array.isArray(x.tag)) {
        userTags.push(...x.tag);
      } else userTags.push(x.tag);
    });

    const data = [];
    for (const tag of [...new Set(userTags)]) {
      data.push({
        tag_name: tag,
        count: userTags.filter((x) => x == tag).length,
        index: tags.findIndex((x) => x.tag_name == tag),
      });
    }
    response(res).success(status_codes.OK, data);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const getTotalLikes: express.Handler = async (req: express.Request, res: express.Response) => {
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  const nickname = req.cookies.nickname;
  try {
    let totalLikes: number = 0;
    const user = await userRepo.findOne({ nickname });
    user?.forums.forEach((x) => (totalLikes += x.likes.count));
    response(res).success(status_codes.OK, totalLikes);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const getForumById: express.Handler = async (req: express.Request, res: express.Response) => {
  const { author, id } = req.params;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner = await userRepo.findOne({ nickname: author });
    if (!forumOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Foruma ait kullanıcı bulunamadı!"));
      return;
    }

    const forum = forumOwner?.forums.find((forum) => forum._id == id);
    if (!forum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(id));
      return;
    }
    response(res).success(status_codes.OK, { nickname: req.cookies.nickname as string, forum });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const getUserForumById: express.Handler = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  const nickname = req.cookies.nickname;

  try {
    const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }
    const userForum = user?.forums.find((forum) => forum._id == id);
    if (!userForum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(id));
      return;
    }

    response(res).success(status_codes.OK, userForum);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const searchForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const { searchArg }: { searchArg: string } = req.body;
  // burada boş bir searchArg gelirse hata fırlatmaya veya status code göndermeye gerek yok.
  if (!searchArg) return;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumsCursor = await userRepo.find({});
    const forums = (await forumsCursor.toArray()).map((x) => x.forums).filter((x) => x.length)[0];
    const searchedForums = forums.filter((x: ForumBody) => x.title.toLowerCase().slice(0, searchArg.length) == searchArg.toLowerCase());
    response(res).success(status_codes.OK, searchedForums);
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const searchUserForum: express.Handler = async (req: express.Request, res: express.Response) => {
  const { searchArg }: { searchArg: string } = req.body;
  // burada boş bir searchArg gelirse hata fırlatmaya veya status code göndermeye gerek yok.
  if (!searchArg) return;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  const nickname = req.cookies.nickname;

  try {
    const user = await userRepo.findOne({ nickname });
    const searchedForums = user?.forums.filter((x) => x.title.toLowerCase().slice(0, searchArg.length) == searchArg.toLowerCase());
    response(res).success(status_codes.OK, searchedForums);
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};
