import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { bgRedAndGreenText } from "./utils";
import router from "./router/index";
import cookieParser from "cookie-parser";
import response from "./lib/response";
import { status_codes } from "./types";

dotenv.config({ path: ".env" });

const port = process.env.PORT || 3000;

const app = express();

// middlewares
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  const allowedOrigins = ["*"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json;charset=UTF-8");
  next();
});
app.use("/api", router);

app.get("/", async (req: express.Request, res: express.Response) => {
  response(res).success(status_codes.OK, "merhaba, dünya");
});

app.listen(port, () => {
  console.log(bgRedAndGreenText(`[Server] sunucu başarılı bir şekilde http://localhost:${port} adresinde başlatıldı!`));
});
