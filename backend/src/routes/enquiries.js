const express = require("express");
const {
  createEnquiry,
  listEnquiries,
} = require("../controllers/enquiriesController");
const authMiddleware = require("../middleware/auth");

const enquiryRoutes = express.Router();

enquiryRoutes.post("/create", createEnquiry);

enquiryRoutes.get("/get", authMiddleware, listEnquiries);

module.exports = enquiryRoutes;
