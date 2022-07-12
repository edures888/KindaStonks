import { differenceInCalendarDays, isToday, parseISO } from "date-fns";
import Transaction from "../models/transaction.model.js";

export default class StreakController {
  // Get user-specific streak
  static async getStreak(req, res, next) {
    try {
      const { user_id } = req.body;
      const transactions = await Transaction.find({ user_id }).data.sort((a, b) => -a.date.localeCompare(b.date));

      let streakCounter = 0;
      let checkedInToday = false;
      let tempDate = Date.now();
      if (differenceInCalendarDays(parseISO(transactions[0].date), tempDate) === 0) {
        streakCounter++;
        checkedInToday = true;
      }
      if (transactions.length > 1) {
        for (let i = 1; i < transactions.length; i++) {
          if (differenceInCalendarDays(parseISO(transactions[i].date), tempDate) === 0) {
            continue;
          }
          if (differenceInCalendarDays(parseISO(transactions[i].date), tempDate) === 1) {
            streakCounter++;
            tempDate++;
          } else {
            break;
          }
        }
      }
      res.status(200).json({
        success: true,
        data: streakCounter,
      });
    } catch (error) {
      res.status(500).send("Error retriving streaks: " + error.message);
      next(error);
    }
  }

  //static async checkIn(req, res, next)
}
