const { getDB } = require("../db");

const getProducts = async (req, res) => {
  try {
    const rawSearch = req.query.search || "";
    const rawCategory = req.query.category || "";
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 5, 1);
    const offset = (page - 1) * limit;

    // search or filter patterns
    const search = rawSearch ? `%${rawSearch}%` : "%%";
    const category = rawCategory ? `%${rawCategory}%` : "%%";

    const db = await getDB();

    // count number of row matching
    const countRow = await db.get(
      `SELECT COUNT(*) AS total
       FROM products
       WHERE name LIKE ? COLLATE NOCASE AND category LIKE ? COLLATE NOCASE`,
      [search, category]
    );
    const total = countRow ? countRow.total : 0;

    //products based on query paramters
    const products = await db.all(
      `SELECT id, name, category, short_desc, price, image_url, created_at
       FROM products
       WHERE name LIKE ? COLLATE NOCASE AND category LIKE ? COLLATE NOCASE
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [search, category, limit, offset]
    );

    res.json({
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("productsController.getProducts error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const idStr = String(req.params.id || "");

    // only digits allowed
    if (!/^\d+$/.test(idStr)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // convert to number (safe because we validated digits)
    const id = Number(idStr);

    const db = await getDB();

    const productDetails = await db.get(`SELECT * FROM products WHERE id = ?`, [
      id,
    ]);

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ data: productDetails });
  } catch (err) {
    console.error("productsController.getProductDetails error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProducts, getProductDetails };
