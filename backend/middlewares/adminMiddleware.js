// middleware/verifyAdmin.js
const User = require("../models/User");
const verifyToken = require("./auth"); // your existing JWT checker

module.exports = async function verifyAdmin(req, res, next) {
  // 1) Verify the JWT
  verifyToken(req, res, async () => {
    // 2) Then check role
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).send("Access denied. Admins only.");
    }
    // attach the full user if you like
    req.user = user;
    next();
  });
};
