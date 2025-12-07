const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token = null;

    //Http-only cookie

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Authorization bearer
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach payload to request
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
