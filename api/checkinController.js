import Checkin from "../models/checkin.model.js";
import { isToday } from "date-fns";

export default class CheckinController {
  // Add new check-in
  static async addCheckin(req, res, next) {
    const { user_id, amount, date, category, note } = req.body;
    try {
      const newCheckin = new Checkin({
        user_id,
      });

      // Get list of check-ins
      const checkins = await Checkin.find({ user_id });

      // If latest check-in is not today, add new check-in for today
      if (checkins > 0) {
        if (!isToday(checkins[checkins.length - 1].createdAt)) {
          await newCheckin.save();
        }
      } else {
        await newCheckin.save();
      }

      res.status(200).json(newCheckin);
    } catch (error) {
      res.status(500).send("Error adding checkin: " + error.message);
      next(error);
    }
  }

  static async isTodayCheckin(req, res, next) {
    try {
      const { user_id } = req.body;
      const checkins = await Checkin.find({ user_id });
      let today = false;
      if (checkins.length > 0) {
        if (isToday(checkins[checkins.length - 1].createdAt)) {
          today = true;
        }
      }
      res.status(200).json({
        success: true,
        data: today,
      });
    } catch (error) {
      res.status(500).send("Error retriving latest checkin: " + error.message);
      next(error);
    }
  }
}
