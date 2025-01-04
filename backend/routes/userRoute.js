const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser
} = require('../controller/userController');

// Route to create a new user (Signup)
router.post('/users/create', createUser);
router.post('/users/login', loginUser);

// Route to get all users
router.get('/users', getAllUsers);

// Route to get a user by ID
router.get('users/:userId', getUserById);

// Route to update a user by ID
router.put('users/:userId', updateUser);

// Route to delete a user by ID
router.delete('users/:userId', deleteUser);

module.exports = router;
