import express from "express";
import { anyError } from "../utils";
import { type RegisterBody } from "./auth";
import { err_codes } from "../types";
import { MongoDBUserRepository } from "../repository/mongodb";

export const getAllInteractions: express.Handler = async (req: express.Request, res: express.Response) => {
  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    // eğer kullanıcının yorum yaptığı forum silinmiş ise, silinmiş yorumu işaretle
    let index = 0;
    for (const commented of user.interactions.commented) {
      const forumOwner = await userRepo.findOne({ nickname: commented.author });
      if (!forumOwner?.forums.find((forum) => forum._id == commented._id)) {
        user.interactions.commented[index].title += " - bu forum kaldırılmış!";
      } else continue;
      index++;
    }

    index = 0;
    // eğer kullanıcının beğendiği forum silinmiş ise, silinmiş yorumu işaretle
    for (const liked of user.interactions.likedForums) {
      const forumOwner = await userRepo.findOne({ nickname: liked.author });
      if (!forumOwner?.forums.find((forum) => forum._id == liked._id)) {
        user.interactions.likedForums[index].title += " - bu forum kaldırılmış!";
      }
      index++;
    }

    res.status(200).json({ success: true, data: user.interactions });
  } catch (err: any) {
    res.status(402).json(anyError(err));
  } finally {
    await userRepo.close();
  }
};

export const deleteComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumId, author, commentId }: { forumId: string; author: string; commentId: string } = req.body;
  const nickname: string = req.cookies.nickname;

  if (!forumId || !author || !commentId) {
    res.status(402).json({ success: false, data: { error: { message: "Eksik bilgi gönderildi!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner = await userRepo.findOne({ nickname: author });
    if (!forumOwner) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    // update comment
    //! hatalı
    let forum = forumOwner.forums.find((forum) => forum._id == forumId);
    if (forum) {
      forum.comments = forum.comments.filter((comment) => comment._id != commentId);
      await userRepo.updateOne({ nickname: forumOwner.nickname }, { $set: { forums: [...forumOwner.forums.filter((forum) => forum._id != forumId), forum] } });
    }

    // update commentOwner interactions
    const commentOwner = await userRepo.findOne({ nickname });
    if (!commentOwner) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }
    const commentOwnerNewCommentedInteractions = commentOwner.interactions.commented.filter((c) => c.comment._id != commentId);
    await userRepo.updateOne(
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
    await userRepo.close();
  }
};
