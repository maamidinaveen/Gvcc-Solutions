const { getDB } = require("../db");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createEnquiry = async (req, res) => {
  try {
    const { product_id, name, email, phone = null, message } = req.body || {};

    // basic validations
    if (!product_id) {
      return res.status(400).json({ error: "product_id is required" });
    }
    // if (!name || !name.trim()) {
    //   return res.status(400).json({ error: "name is required" });
    // }
    // if (!email || !EMAIL_RE.test(email.trim())) {
    //   return res.status(400).json({ error: "valid email is required" });
    // }
    // if (!message || !message.trim()) {
    //   return res.status(400).json({ error: "message is required" });
    // }
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, Email and Message is required*" });
    }

    const db = await getDB();

    // check if product exists in products table
    const productQuery = `SELECT id FROM products WHERE id = ?`;
    const product = await db.get(productQuery, [product_id]);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    const insertQuery = `
      INSERT INTO enquiries (product_id, name, email, phone, message)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await db.run(insertQuery, [
      product_id,
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      message.trim(),
    ]);

    res.status(201).json({
      message: "Enquiry created",
      enquiryId: result.lastID,
    });
  } catch (err) {
    console.error("enquiriesController.createEnquiry error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// fetch enquiries from DB;

const listEnquiries = async (req, res) => {
  try {
    const db = await getDB();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    console.log(req.admin);

    const offset = (page - 1) * limit;

    // total enquiries
    const countQuery = `SELECT count(*) as total FROM enquiries`;
    const countRow = await db.get(countQuery);
    const total = countRow.total;

    // fetch enquiries
    const listQuery = `SELECT id, product_id,name, email,phone,message,created_at FROM enquiries ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const enquiries = await db.all(listQuery, [limit, offset]);

    res.json({
      data: enquiries,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("enquiriesController.listEnquiries error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createEnquiry, listEnquiries };
