import express from "express";
import { mongoClient, anyError } from "../utils";
import { type RegisterBody } from "./auth";
import { err_codes } from "../types";

export const getAllInteractions: express.Handler = async (req: express.Request, res: express.Response) => {
  const nickname = req.cookies.nickname;
  const client = mongoClient(process.env.MONGODB_URI as string);
  try {
    const coll = client.db("yazbiforum").collection("users");
    const user = await coll.findOne<RegisterBody>({ nickname });
    if (!user) {
      res
        .status(402)
        .json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    res.status(200).json({ success: true, data: user.interactions });
  } catch (err: any) {
    res.status(402).json(anyError(err));
  } finally {
    await client.close();
  }
};

export const deleteComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumId, author, commentId }: { forumId: string; author: string; commentId: string } = req.body;
  const nickname: string = req.cookies.nickname;
  const client = mongoClient(process.env.MONGODB_URI as string);

  if (!forumId || !author || !commentId) {
    res
      .status(402)
      .json({ success: false, data: { error: { message: "Eksik bilgi gönderildi!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const coll = client.db("yazbiforum").collection("users");
    const forumOwner = await coll.findOne<RegisterBody>({ nickname: author });
    if (!forumOwner) {
      res
        .status(402)
        .json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    // update comment
    //! hatalı
    let forum = forumOwner.forums.find((forum) => forum._id == forumId);
    if (forum) {
      forum.comments = forum.comments.filter((comment) => comment._id != commentId);
      await coll.updateOne(
        { nickname: forumOwner.nickname },
        { $set: { forums: [...forumOwner.forums.filter((forum) => forum._id != forumId), forum] } }
      );
    }

    // update commentOwner interactions
    const commentOwner = await coll.findOne<RegisterBody>({ nickname });
    if (!commentOwner) {
      res
        .status(402)
        .json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    const commentOwnerNewCommentedInteractions = commentOwner.interactions.commented.filter((c) => c.comment._id != commentId);
    await coll.updateOne(
      { nickname },
      {
        $set: {
          interactions: { likedForums: commentOwner.interactions.likedForums, commented: commentOwnerNewCommentedInteractions },
        },
      }
    );
    res.status(200).json({ success: true, data: "Yorum silindir." });
  } catch (err: any) {
    res.status(402).json(anyError(err));
  } finally {
    await client.close();
  }
};
