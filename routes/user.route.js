import express from "express";
import {
  getAllUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";

import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(logout);

router.use(protect);
router.route("/").get(getAllUsers);

export default router;
