import express, { Request, Response } from "express";
import "dotenv/config";
import path from "path";
import {
  loadOrders,
  loadProducts,
  loadProfile,
} from "./controllers/adminControllers";

const app = express();
const PORT = process.env.PORT || 3000;

/* --- 1. EJS Setup --- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

/* --- 2. Middleware --- */
// Body parser to handle form submissions (A2 Feature)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the 'public' folder (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("hello");
});
app.get("/admin", loadProducts);
app.get("/orders", loadOrders);
app.get("/profile", loadProfile);
app.listen(PORT, () => {
  console.log(`Access the server at http://localhost:${PORT}`);
});
