import User from "../models/user.model"
import asyncHanlder from "express-async-handler"
import expressAsyncHandler from "express-async-handler"
// use express-async-hanlder to customize error handling and use less try catch blocks

export default class UserController {
  // Usage of static get accessors for functions wrapped by AsyncHandler

  // Return all users in database
  static apiGetAllUsers() {
    return expressAsyncHandler(async (req, res) => {
      const users = await User.find()
      res.status(200).json(users)
    })
  }

  // Get User specificed with ID
  static apiGetAllUsers() {
    return expressAsyncHandler(async (req, res) => {
      const users = await User.findById(req.params.id)
      if (!listing) {
        res.status(400)
        throw new Error('No such user found')
      }
      res.status(200).json(users)
    })
  }

  // Create new user to add to database
  static apiAddUsers() {
    return expressAsyncHandler(async (req, res) => {
      const users = await User.findById(req.params.id)
      
      /*if (!req.params.id) {
        res.status(400)
        throw new Error('Invalid fields')
      }*/
      const newUser = new User(req.body)
      await newUser.save(err => {
        throw new Error("Error creating new user" + err.messages)
      })
      res.status(200).json(newUser)
    })
  }

  // Update user specified by Id from database
  static apiUpdateUser() {
    return expressAsyncHandler(async (req, res) => {
      const users = await User.findById(req.params.id)
       /*   ......*/
      res.status(200).json(newUser)
    })
  }

  // Delete user specified by Id from database
  static apiDeleteUser() {
    return expressAsyncHandler(async (req, res) => {
      const users = await User.findById(req.params.id)
       /*   ......*/
      res.status(200).json(newUser)
    })
  }

}