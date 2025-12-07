const express = require("express");
const {
  getProducts,
  getProductDetails,
} = require("../controllers/productsController");

const productRoutes = express.Router();

productRoutes.get("/", getProducts);
productRoutes.get("/:id", getProductDetails);

module.exports = productRoutes;
