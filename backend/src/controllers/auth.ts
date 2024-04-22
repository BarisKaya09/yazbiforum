import express from "express";
import validator from "validator";
import { hashPassword, comparePassword } from "../utils";
import { MongoDBUserRepository } from "../repository/mongodb";
import { status_codes } from "../types";
import jwt from "jsonwebtoken";
import { type ForumBody } from "./forum";
import response, { ANY_ERR, INVALID_EMAIL_FORMAT, INVALID_PASSWORD_LENGTH, MISSING_CONTENT, USER_EXIST, USER_NOT_EXIST, WRONG_PASSWORD } from "../lib/response";

export type Interactions = {
  // kullanıcının beğendiği forumların id bilgileri burada saklanacak.
  likedForums: { _id: string; author: string; title: string; releaseDate: string }[];
  // kullanıcının yorum yaptığı forumların id bilgileri burada saklanacak.
  commented: {
    _id: string;
    author: string;
    title: string;
    releaseDate: string;
    comment: { _id: string; content: string; releaseDate: string };
  }[];
};

export type RegisterBody = {
  name: string;
  surname: string;
  age: string;
  nickname: string;
  email: string;
  password: string;
  forums: ForumBody[];
  // kullanıcının etkileşim kurduğu forumların id bilgilerinin tutulacağı yer.(beğendiği forum, yorum yaptığı forum)
  interactions: Interactions;
};

export const signup: express.Handler = async (req: express.Request, res: express.Response) => {
  const { name, surname, age, nickname, email, password }: RegisterBody = req.body as RegisterBody;
  if (!name || !surname || !age || !nickname || !email || !password) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  if (!validator.isEmail(email)) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_EMAIL_FORMAT());
    return;
  }

  if (password.length <= 7) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_PASSWORD_LENGTH());
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    // hash password
    const hashedPassword = await hashPassword(password, 10);
    // create user
    const user: RegisterBody = {
      name,
      surname,
      age,
      nickname,
      email,
      password: hashedPassword,
      forums: [],
      interactions: { likedForums: [], commented: [] },
    };

    // db connectsion
    if ((await userRepo.findOne({ nickname: user.nickname })) || (await userRepo.findOne({ email: user.email }))) {
      response(res).unsuccess(status_codes.BAD_REQUEST, USER_EXIST());
      return;
    }
    await userRepo.insertOne(user);
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }

  response(res).success(status_codes.OK, "Kayıt başarılı!");
};

export type LoginBody = {
  nickname: string;
  password: string;
};

export const signin: express.Handler = async (req: express.Request, res: express.Response) => {
  const { nickname, password }: LoginBody = req.body as LoginBody;

  if (!nickname || !password) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });
  try {
    const user = await userRepo.findOne({ nickname: nickname });

    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    if (!(await comparePassword(password, user.password))) {
      response(res).unsuccess(status_codes.BAD_REQUEST, WRONG_PASSWORD());
      return;
    }

    const token = jwt.sign({ nickname: user.nickname }, process.env.JWT_SECRET as string, { expiresIn: "2h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000, secure: true });
    res.cookie("nickname", user.nickname, { httpOnly: true, maxAge: 3600000, secure: true });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
    return;
  } finally {
    await userRepo.close();
  }

  response(res).success(status_codes.OK, "Başarılı bir şekilde giriş yapıldı!");
};

export const logout: express.Handler = (req: express.Request, res: express.Response) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json;charset=UTF-8");

  res.clearCookie("token");
  res.clearCookie("nickname");
  response(res).success(status_codes.OK, "Çıkış yapıldı!!!");
};
