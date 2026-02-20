import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

;

const app = express();
app.use("/images", express.static(path.join(__dirname, "images")));
dotenv.config()
app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

// 🔥 CONNECT TO MONGODB ATLAS
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  });

// 🔥 ORDER SCHEMA
const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    city: String,
    address: String,
  },
  cart: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

// PRODUCTS (temporary static)
const products = [
  { id: 1, name: "Coffe Machine Italy", price: 1900, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
  { id: 2, name: "Vasels simple modern", price: 200, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
  { id: 3, name: "Coffe Machine france 2020", price: 1500, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
  { id: 4, name: "Jacket Man New version", price: 600, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
  { id: 5, name: "Vasel France simple", price: 300, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
  { id: 6, name: "vasel italy flower", price: 250, image:  "https://express-store-production.up.railway.app/images/img1.jpg" },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

// 🔥 SAVE ORDER TO ATLAS
app.post("/api/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();

    console.log("✅ Order saved to Atlas");
    res.status(201).json({ message: "Order saved successfully" });
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
