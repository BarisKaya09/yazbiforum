import express from "express";
import { status_codes } from "../types";
import validator from "validator";
import { MongoDBUserRepository } from "../repository/mongodb";
import response, { ANY_ERR, INVALID_EMAIL_FORMAT, INVALID_PASSWORD_LENGTH, MISSING_CONTENT, NO_CHANGES_WERE_MADE, USER_NOT_EXIST } from "../lib/response";
import { comparePassword, hashPassword } from "../utils";

export const getAccountData = async (req: express.Request, res: express.Response) => {
  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }
    response(res).success(status_codes.OK, { ...user, password: null });
  } catch (err) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

type NameSurnameField = {
  name?: string;
  surname?: string;
};
export const updateNameSurname: express.Handler = async (req: express.Request, res: express.Response) => {
  const { name, surname }: NameSurnameField = req.body as NameSurnameField;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!name || !surname) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    const nomodif: string[] = [];
    if (name && name == user.name) nomodif.push(name);
    if (surname && surname == user.surname) nomodif.push(surname);

    if (nomodif.length >= 2) {
      response(res).unsuccess(status_codes.BAD_REQUEST, NO_CHANGES_WERE_MADE());
      return;
    }

    await userRepo.updateOne({ nickname }, { $set: { name: !name ? user.name : name, surname: !surname ? user.surname : surname } });

    response(res).success(status_codes.OK, "İsim Soyisim güncellendi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

type NicknameField = {
  nickname: string;
};
export const updateNickname: express.Handler = async (req: express.Request, res: express.Response) => {
  const { nickname } = req.body as NicknameField;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const user_nickname = req.cookies.nickname;

  if (!nickname) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname: user_nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    if (nickname == user.nickname) {
      response(res).unsuccess(status_codes.BAD_REQUEST, NO_CHANGES_WERE_MADE());
      return;
    }

    const updatedForums = user.forums.map((forum) => {
      return { ...forum, author: nickname };
    });

    await userRepo.updateOne({ nickname: user_nickname }, { $set: { nickname: nickname, forums: updatedForums } });
    res.cookie("nickname", nickname, { httpOnly: true, maxAge: 3600000, secure: true });

    response(res).success(status_codes.OK, "Kullancı adı güncellendi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

type DateOfBirthField = {
  dateOfBirth: string;
};
export const updateDateOfBirth: express.Handler = async (req: express.Request, res: express.Response) => {
  const { dateOfBirth }: DateOfBirthField = req.body;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!dateOfBirth) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    if (user.age == dateOfBirth) {
      response(res).unsuccess(status_codes.BAD_REQUEST, NO_CHANGES_WERE_MADE());
      return;
    }

    await userRepo.updateOne({ nickname: user.nickname }, { $set: { age: dateOfBirth } });
    response(res).success(status_codes.OK, "Doğum tarihi güncellendi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

type EmailField = {
  email: string;
};
export const updateEmail: express.Handler = async (req: express.Request, res: express.Response) => {
  const { email }: EmailField = req.body as EmailField;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!email) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  if (!validator.isEmail(email)) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_EMAIL_FORMAT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    if (user.email == email) {
      response(res).unsuccess(status_codes.BAD_REQUEST, NO_CHANGES_WERE_MADE());
      return;
    }

    await userRepo.updateOne({ nickname }, { $set: { email: email } });
    response(res).success(status_codes.OK, "Email adresi güncellendi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

export const passwordIsItCorrect: express.Handler = async (req: express.Request, res: express.Response) => {
  const { password }: { password: string } = req.body as { password: string };
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!password) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    const data = await comparePassword(password, user.password);
    response(res).success(status_codes.OK, { passwordIsItCorrect: data });
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};

type PasswordField = {
  password: string;
};
export const updatePassword: express.Handler = async (req: express.Request, res: express.Response) => {
  const { password }: PasswordField = req.body as PasswordField;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!password) {
    response(res).unsuccess(status_codes.BAD_REQUEST, MISSING_CONTENT());
    return;
  }

  if (password.length <= 7) {
    response(res).unsuccess(status_codes.BAD_REQUEST, INVALID_PASSWORD_LENGTH());
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      response(res).unsuccess(status_codes.NOT_FOUND, USER_NOT_EXIST());
      return;
    }

    // eğer şifre eskisi ile aynıysa
    if (await comparePassword(password, user.password)) {
      response(res).unsuccess(status_codes.BAD_REQUEST, NO_CHANGES_WERE_MADE());
      return;
    }

    await userRepo.updateOne({ nickname: user.nickname }, { $set: { password: await hashPassword(password, 10) } });

    response(res).success(status_codes.OK, "Şifre güncellendi.");
  } catch (err: any) {
    response(res).unsuccess(status_codes.INTERNAL_SERVER_ERROR, ANY_ERR(err));
  } finally {
    await userRepo.close();
  }
};
