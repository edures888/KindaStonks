import User from "../models/user.model"

export default class UserController {
  // Return all users in database
  static async apiGetAllUsers(req, res) {
    await User.find()
      .then(res => res.status(200).json(users))
      .catch(err => {
        res.status(500)
          .send("Some error occurred while retrieving tutorials." + err.message)
        });
      
    }

  // Get User specificed with ID
  static async apiGetUserById(req, res) {
    User.findById(req.params.id)
      .then(data => {
        if (!listing) {
          res.status(404).send('No such user found');
        } else {
          res.status(200).send(data);
        }
      }).catch(err => {
        res.status(500)
           .send("Error retrieving user: " + err.message);
      })
  }

  // Create new user to add to database
  static async apiAddUser(req, res) {
      // Validate user      
      if (!req.body.username || !req.body.password 
          || !req.body.email || !req.body.name) {
        res.status(400).send("missing fields")
      }
      const newUser = new User(req.body)
      newUser.save()
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).send("Error creating new user" + err.messages))
  }
  


  // Update user specified by Id from database
  static async apiUpdateUser(req, res) {
    if (!req.body) {
      return res.status(400).send("Empty request");
    }
    User.findByIdAndUpdate(req.params.id, req.body)
      .then(data => {
        if (!data) {
          res.status(404).send("Error updating user")
        }
        else {
          res.status(200).json(data)
        }
      })
      .catch(err => res.status(500).send("Error updating user: " + err.message))
  }

  // Delete user specified by Id from database
  static async apiDeleteUser(req, res) {
    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send("Unable to delete, user was found")
        } else {
          res.status(200).send("User was deleted");
        }
      })
      .catch(err => res.status(500).send("Error deleting user: " + err.message)) 
  }
}