import express from "express";
import BudgetController from "./budgetController.js";

const router = express.Router();

router
  .route("/")
  .get(BudgetController.getUserBudget)
  .post(BudgetController.addBudget);

router.route("/:id").put(BudgetController.setBudget);
router.route("/:id").delete(BudgetController.deleteBudget);

export default router;
