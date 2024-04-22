import express from "express";
import { status_codes } from "../types";
import { MongoDBUserRepository } from "../repository/mongodb";
import response, { ANY_ERR, FORUM_NOT_EXIST, MISSING_CONTENT, USER_NOT_EXIST } from "../lib/response";

export const getAllInteractions: express.Handler = async (req: express.Request, res: express.Response) => {
  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
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

    response(res).success(status_codes.OK, user.interactions);
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const deleteComment: express.Handler = async (req: express.Request, res: express.Response) => {
  const { forumId, author, commentId }: { forumId: string; author: string; commentId: string } = req.body;
  const nickname: string = req.cookies.nickname;

  if (!forumId || !author || !commentId) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const forumOwner = await userRepo.findOne({ nickname: author });
    if (!forumOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Forumun ait olduğu kullanıcı bulunamadı!"));
      return;
    }
    //! hatalı
    let forum = forumOwner.forums.find((forum) => forum._id == forumId);
    if (!forum) {
      response(res).unsuccess(status_codes.NOT_FOUND, FORUM_NOT_EXIST(forumId));
      return;
    }
    forum.comments = forum.comments.filter((comment) => comment._id != commentId);
    await userRepo.updateOne({ nickname: forumOwner.nickname }, { $set: { forums: [...forumOwner.forums.filter((forum) => forum._id != forumId), forum] } });

    // update commentOwner interactions
    const commentOwner = await userRepo.findOne({ nickname });
    if (!commentOwner) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST("Yorumu yapan kullanıcı bulunamadı!"));
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
    response(res).success(status_codes.OK, "Yorum silindi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};
