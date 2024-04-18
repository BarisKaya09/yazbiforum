import express from "express";
import requireAuth from "../middlewares/requireAuth";
import { createForum, likeForum, deleteForum, createComment, deleteComment, updateForum, getTags, unlikeForum } from "../controllers/forum";
import {
  getFilteredForum,
  getAllForums,
  getForumCountByTags,
  getTotalLikes,
  getForumById,
  getUserForumById,
  searchForum,
  searchUserForum,
} from "../controllers/getForums";

const router: express.Router = express.Router();

router.post("/createForum", requireAuth, createForum);

router.post("/likeForum/:forumOwner/:_id", requireAuth, likeForum);
router.post("/unlikeForum/:forumOwner/:_id", requireAuth, unlikeForum);

router.post("/deleteForum/:_id", requireAuth, deleteForum);

router.post("/createComment/:forumOwner/:_id", requireAuth, createComment);
router.post("/deleteComment/:forumOwner/:_id/:commentID", requireAuth, deleteComment)

router.post("/updateForum/:_id", requireAuth, updateForum);
router.get("/getTags", getTags);

router.get("/getForum/:forumType", requireAuth, getFilteredForum);
router.get("/getAllForums", getAllForums);
router.get("/getForumCountByTags", requireAuth, getForumCountByTags);
router.get("/getTotalLikes", requireAuth, getTotalLikes);
router.get("/getForumById/:author/:id", getForumById);
router.get("/getUserForumById/:id", requireAuth, getUserForumById);
router.post("/searchForum", searchForum);
router.post("/searchUserForum", requireAuth, searchUserForum);

export default router;
