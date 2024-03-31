import express from "express";
import { comparePassword } from "../utils";
import { mongoClient } from "../utils";
import { anyError } from "../utils";
import { RegisterBody } from "../controllers/auth";
import { err_codes } from "../types";

const confirmPassword: express.Handler = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const nickname = req.cookies.nickname;
  const client = mongoClient(process.env.MONGODB_URI as string);
  const { confirmPassword_ } = req.body;
  if (!confirmPassword_) {
    res
      .status(402)
      .json({ success: false, data: { error: { message: "Doğrulama şifresi eksik!", code: err_codes.MISSING_CONTENT } } });
    return;
  }

  try {
    const coll = client.db("yazbiforum").collection("users");
    const user = await coll.findOne<RegisterBody>({ nickname });
    if (!user) {
      res
        .status(404)
        .json({ success: false, data: { error: { message: "Kullanıcı mevcut değil!!!", code: err_codes.USER_NOT_EXIST } } });
      return;
    }

    if (!(await comparePassword(confirmPassword_, user.password))) {
      res.status(401).json({
        success: false,
        data: { error: { message: "Şifre doğrulama başarısız!", code: err_codes.PASSWORD_VERIFICATION_FAILED } },
      });
      return;
    }

    next();
  } catch (err: any) {
    res.status(402).json(anyError(err));
  }
};

export default confirmPassword;
