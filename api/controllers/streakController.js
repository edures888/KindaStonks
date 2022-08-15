import { differenceInCalendarDays, isToday, parseISO, subDays } from "date-fns";
import Checkin from "../../models/checkin.model.js";

export default class StreakController {
  // Get user-specific streak
  static async getStreak(req, res, next) {
    try {
      const { user_id } = req.body;
      const checkins = await Checkin.find({ user_id });

      let streakCounter = 0;

      if (checkins.length > 0) {
        // Check if latest check-in is today
        if (isToday(checkins[checkins.length - 1].createdAt)) {
          streakCounter++;
        }

        // Iterate through check-ins backwards to check consecutive
        if (checkins.length > 1) {
          let tempDate = subDays(Date.now(), 1);
          for (let i = checkins.length - 2; i >= 0; i--) {
            const diff = differenceInCalendarDays(
              checkins[i].createdAt,
              tempDate
            );
            if (diff === 0) {
              streakCounter++;
              tempDate = subDays(tempDate, 1);
            } else {
              break;
            }
          }
        }
      }

      res.status(200).json({
        success: true,
        data: streakCounter,
      });
    } catch (error) {
      next(error);
    }
  }

  //static async checkIn(req, res, next)
}
