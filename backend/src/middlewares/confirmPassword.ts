import express from "express";
import { comparePassword } from "../utils";
import { status_codes } from "../types";
import { MongoDBUserRepository } from "../repository/mongodb";
import response, { ANY_ERR, MISSING_CONTENT, PASSWORD_VERIFICATION_FAILED, USER_NOT_EXIST } from "../lib/response";

const confirmPassword: express.Handler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  const { confirmPassword_ } = req.body;
  if (!confirmPassword_) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    if (!(await comparePassword(confirmPassword_, user.password))) {
      response(res).unsuccess(status_codes.BAD_REQUEST, PASSWORD_VERIFICATION_FAILED());
      return;
    }

    next();
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  }
};

export default confirmPassword;
