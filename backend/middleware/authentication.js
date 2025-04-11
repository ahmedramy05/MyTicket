const jwt = require("jsonwebtoken");

// Verify JWT token and attach user to request
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data (id, role) to the request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;
