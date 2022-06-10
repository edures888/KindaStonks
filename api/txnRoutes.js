import express from "express"
import TransactionController from "./txnController.js"
import jwtCheck from "../middleware/jwtCheck.js"

const router = express.Router()

router
    .route('/')
    .post(TransactionController.addTxn)
    .get(TransactionController.getTxns)

router.route(':/id').delete(TransactionController.deleteTxn)

export default router