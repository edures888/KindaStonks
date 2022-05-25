import express from "express"
import UserController from "./userController"
import protectRoute from "../middleware/authMiddleware"

const router = express.Router()

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/details', protectRoute, UserController.getUser)

export default router