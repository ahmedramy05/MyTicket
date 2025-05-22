const jwt = require("jsonwebtoken");

// Verify JWT token and attach user to request
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token." });
    }

    // Attach only necessary user data to the request
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    }

    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authenticate;