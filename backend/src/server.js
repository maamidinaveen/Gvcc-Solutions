const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");
const { getDB } = require("./db");
const productRoutes = require("./routes/products");
const enquiryRoutes = require("./routes/enquiries");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  try {
    await getDB();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("DB Error: ", error.message);
    process.exit(1);
  }
};

initializeServer();

app.get("/check", async (req, res) => {
  res.send("hello world");
});

app.use("/products", productRoutes);
app.use("/enquiry", enquiryRoutes);
app.use("/admin", adminRoutes);
