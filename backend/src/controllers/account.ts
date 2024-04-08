import express from "express";
import { anyError, comparePassword, hashPassword } from "../utils";
import { RegisterBody } from "./auth";
import { err_codes } from "../types";
import validator from "validator";
import { MongoDBUserRepository } from "../repository/mongodb";

export const getAccountData = async (req: express.Request, res: express.Response) => {
  const nickname = req.cookies.nickname;
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({
        success: false,
        data: {
          error: {
            message: "Bu kullanıcı adına kayıtlı kullanıcı mevcut değil!",
            code: err_codes.USER_NOT_EXIST,
          },
        },
      });
      return;
    }
    res.status(200).json({ success: true, data: { ...user, password: null } });
  } catch (err) {
    res.status(400).json(anyError(err));
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
    res.status(402).json({ success: false, data: { error: { message: "İsim veya Soyisim bulunamadı!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    const nomodif: string[] = [];
    if (name && name == user.name) nomodif.push(name);
    if (surname && surname == user.surname) nomodif.push(surname);

    if (nomodif.length >= 2) {
      res.status(402).json({ success: false, data: { error: { message: "Değişiklik Yapılmadı!", code: err_codes.NO_CHANGES_WERE_MADE } } });
      return;
    }

    await userRepo.updateOne({ nickname }, { $set: { name: !name ? user.name : name, surname: !surname ? user.surname : surname } });

    res.status(200).json({
      success: true,
      data: "İsim Soyisim güncellendi.",
    });
  } catch (err: any) {
    res.status(402).json(anyError(err));
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
    res.status(402).json({ success: false, data: { error: { message: "Kullanıcı adı bulunamdı!!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname: user_nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    if (nickname == user.nickname) {
      res.status(402).json({ success: false, data: { error: { message: "Değişiklik yapılmadı!", code: err_codes.NO_CHANGES_WERE_MADE } } });
      return;
    }

    const updatedForums = user.forums.map((forum) => {
      return { ...forum, author: nickname };
    });

    await userRepo.updateOne({ nickname: user_nickname }, { $set: { nickname: nickname, forums: updatedForums } });
    res.cookie("nickname", nickname, { httpOnly: true, maxAge: 3600000, secure: true });

    res.status(200).json({ success: true, data: "Kullancı adı güncellendi." });
  } catch (err: any) {
    res.status(402).json(anyError(err));
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
    res.status(402).json({ success: false, data: { error: { message: "Doğtum tarihi bulunamadı!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    if (user.age == dateOfBirth) {
      res.status(402).json({ success: false, data: { error: { message: "Değişiklik Yapılmadı!", code: err_codes.NO_CHANGES_WERE_MADE } } });
      return;
    }

    await userRepo.updateOne({ nickname: user.nickname }, { $set: { age: dateOfBirth } });
    res.status(200).json({ success: true, data: "Doğum tarihi güncellendi." });
  } catch (err: any) {
    res.status(402).json(anyError(err));
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
    res.status(402).json({ success: false, data: { error: { message: "Email adresi bulunamadı!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  if (!validator.isEmail(email)) {
    res.status(402).json({
      success: false,
      data: { error: { message: "Lütfen uygun email formatı girin!", code: err_codes.INVALID_EMAIL_FORMAT } },
    });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    if (user.email == email) {
      res.status(402).json({ success: false, data: { error: { message: "Değişiklik yapılmadı!", code: err_codes.NO_CHANGES_WERE_MADE } } });
      return;
    }

    await userRepo.updateOne({ nickname }, { $set: { email: email } });
    res.status(200).json({ success: true, data: "Email adresi güncellendi." });
  } catch (err: any) {
    res.status(402).json(anyError(err));
  } finally {
    await userRepo.close();
  }
};

export const passwordIsItCorrect: express.Handler = async (req: express.Request, res: express.Response) => {
  const { password }: { password: string } = req.body as { password: string };
  const userRepo = MongoDBUserRepository(process.env.MONGODB_URI as string, { db: "yazbiforum", collection: "users" });

  const nickname = req.cookies.nickname;

  if (!password) {
    res.status(402).json({ success: false, data: { error: { message: "Şifre bulunamadı!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    const data = await comparePassword(password, user.password);
    res.status(200).json({ success: true, data: { passwordIsItCorrect: data } });
  } catch (err: any) {
    res.status(402).json(anyError(err));
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
    res.status(402).json({ success: false, data: { error: { message: "Şifre bulunamadı!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  if (password.length <= 7) {
    res.status(422).json({
      success: false,
      data: {
        error: { message: "Lütfen şifrenizi 7 karakterden fazla girin!", code: err_codes.INVALID_PASSWORD_LENGTH },
      },
    });
    return;
  }

  try {
    const user = await userRepo.findOne({ nickname });
    if (!user) {
      res.status(402).json({ success: false, data: { error: { message: "Kullanıcı bulunamadı!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    // eğer şifre eskisi ile aynıysa
    if (await comparePassword(password, user.password)) {
      res.status(402).json({ success: false, data: { error: { message: "Değişiklik yapılmadı!", code: err_codes.NO_CHANGES_WERE_MADE } } });
      return;
    }

    await userRepo.updateOne({ nickname: user.nickname }, { $set: { password: await hashPassword(password, 10) } });

    res.status(200).json({ success: true, data: "Şifre güncellendi." });
  } catch (err: any) {
    res.status(402).json(anyError(err));
  } finally {
    await userRepo.close();
  }
};
