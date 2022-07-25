import express from "express";
import StreakController from "./streakController.js";

const router = express.Router();

router.route("/").get(StreakController.getStreak);

export default router;
