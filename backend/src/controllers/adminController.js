const jwt = require("jsonwebtoken");

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USER || !ADMIN_PASS) {
  console.warn("ADMIN_USER / ADMIN_PASS not set in .env");
}
if (!JWT_SECRET) {
  console.warn("JWT_SECRET not set in .env");
}

const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password required" });
  }
  // Check credentials (simple equality against env variables)
  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  // Create token payload (minimal)

  const payload = { username };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

  // set httponly cookie

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ message: "Logged in" });
};

const authMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ loggedIn: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({
      loggedIn: true,
      user: decoded.username,
    });
  } catch (err) {
    return res.json({ loggedIn: false });
  }
};

function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

module.exports = { login, logout, authMe };
