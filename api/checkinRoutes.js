import express from "express";
import CheckinController from "./checkinController.js";

const router = express.Router();

router.route("/").post(CheckinController.addCheckin);

export default router;
