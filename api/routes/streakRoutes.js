import express from "express";
import StreakController from "../controllers/streakController";

const router = express.Router();

router.route("/").get(StreakController.getStreak);

export default router;
