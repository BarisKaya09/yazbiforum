import express from "express";
import auth from "./auth";
import forum from "./forum";
import account from "./account";
import interactions from "./interactions";

const router: express.Router = express.Router();

router.use("/auth", auth);
router.use("/forum", forum);
router.use("/account", account);
router.use("/interactions", interactions);

export default router;
