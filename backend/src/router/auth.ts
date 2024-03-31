import express from "express";
import { signup, signin, logout } from "../controllers/auth";
import requireAuth from "../middlewares/requireAuth";

const router: express.Router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", requireAuth, logout);
router.get("/isLoggedin", requireAuth, (req: express.Request, res: express.Response) => {
  res.status(200).json({ success: true, data: "Kullanıcı oturumu açık!" });
});

export default router;
