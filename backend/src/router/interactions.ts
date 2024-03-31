import express from "express";
import { getAllInteractions, deleteComment } from "../controllers/interactions";
import requireAuth from "../middlewares/requireAuth";

const router = express.Router();

router.get("/getAllInteractions", requireAuth, getAllInteractions);
router.post("/deleteComment", requireAuth, deleteComment);

export default router;
