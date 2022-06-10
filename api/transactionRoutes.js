import express from "express"
import TransactionController from "./transactionController.js"
import jwtCheck from "../middleware/jwtCheck.js"

const router = express.Router()

router
    .route('/')
    .post(TransactionController.addTransaction)
    .get(TransactionController.getTransactions)

router.route('/:id').delete(TransactionController.deleteTransaction)

export default router