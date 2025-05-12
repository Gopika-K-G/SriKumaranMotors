// server/controllers/userController.js
const User = require('../models/User');

const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you're storing user info in a session or JWT token
    const user = await User.findById(userId).select('firstName lastName email phone'); // Fetch only relevant fields
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserDetails };
