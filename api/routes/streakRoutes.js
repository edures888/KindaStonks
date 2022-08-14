import express from "express";
import StreakController from "../controllers/streakController.js";

const router = express.Router();

router.route("/").get(StreakController.getStreak);

export default router;
