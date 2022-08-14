import Budget from "../../models/budget.model.js";

export default class BudgetController {
  // Set a new budget
  static async addBudget(req, res, next) {
    try {
      const { user_id, label, limit, duration } = req.body;

      const newBudget = new Budget({
        user_id,
        label,
        limit,
        duration,
      });

      await newBudget.save();
      res.status(200).json(newBudget);
    } catch (error) {
      next(error);
    }
  }

  static async setBudget(req, res, next) {
    try {
      const { limit, duration } = req.body;
      const budget = await Budget.findById(req.params.id).exec();
      budget.limit = limit;
      budget.duration = duration;
      await budget.save();
      res.status(200).json(budget);
    } catch (error) {
      next(error);
    }
  }

  // Get user-specific budget
  static async getUserBudget(req, res, next) {
    try {
      const { user_id } = req.body;
      const budgets = await Budget.find({ user_id });

      res.status(200).json({
        success: true,
        count: budgets.length,
        data: budgets,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBudget(req, res, next) {
    try {
      const { user_id } = req.body;
      const budget = await Budget.findById(req.params.id).exec();

      if (!budget) {
        res.status(404).send('No budget found');
        return;
      }

      if (budget.user_id != user_id) {
        res.status(401).send('No permission to delete current transaction');
        return;
      }

      await budget.remove();

      res.status(200).send(req.params.id + ' deleted');
    } catch (error) {
      next(error);
    }
  }
}
