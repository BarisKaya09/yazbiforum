import express from "express";
import requireAuth from "../middlewares/requireAuth";
import {
  getAccountData,
  updateNameSurname,
  updateNickname,
  updateDateOfBirth,
  updateEmail,
  passwordIsItCorrect,
  updatePassword,
} from "../controllers/account";
import confirmPassword from "../middlewares/confirmPassword";

const router: express.Router = express.Router();

router.get("/getAccountData", requireAuth, getAccountData);

router.post("/updateNameSurname", requireAuth, confirmPassword, updateNameSurname);
router.post("/updateNickname", requireAuth, confirmPassword, updateNickname);
router.post("/updateDateOfBirth", requireAuth, confirmPassword, updateDateOfBirth);
router.post("/updateEmail", requireAuth, confirmPassword, updateEmail);

router.post("/passwordIsItCorrect", requireAuth, passwordIsItCorrect);
router.post("/updatePassword", requireAuth, confirmPassword, updatePassword);

export default router;
