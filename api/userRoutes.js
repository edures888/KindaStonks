import express from "express"
import UserController from "./userController.js"
import jwtCheck from "../middleware/jwtCheck.js"

const router = express.Router()

router.post('/register', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.get('/details', jwtCheck, UserController.protectedInfo)

export default router