import express from "express";
import jwt from "jsonwebtoken";

const requireAuth: express.Handler = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.cookies.token as string;
  try {
    jwt.verify(token as string, process.env.JWT_SECRET as string);
    next();
  } catch (err) {
    res
      .status(401)
      .json({
        success: false,
        data: { error: { message: `Bu işlemi gerçekleştirmek için giriş yapmış olmalısınız!` } },
      });
  }
};

export default requireAuth;
