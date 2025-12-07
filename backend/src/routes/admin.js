const express = require("express");
const { login, logout, authMe } = require("../controllers/adminController");
const adminRoutes = express.Router();

adminRoutes.post("/login", login);
adminRoutes.post("/logout", logout);
adminRoutes.get("/me", authMe);

module.exports = adminRoutes;
