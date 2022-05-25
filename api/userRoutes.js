import express from "express"
import UserController from "./userController"

const router = express.Router()

router.route('/').get(UserController.apiGetAllUsers)
                 .get(UserController.apiAddUser)

router.route('/:id').get(UserController.apiGetUserById)
      .delete(UserController.apiDeleteUser)
      .put(UserController.apiUpdateUser)

export default router