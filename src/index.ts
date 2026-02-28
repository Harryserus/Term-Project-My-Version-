import express, { Request, Response } from "express";
import "dotenv/config";
import session from "express-session";
import path from "path";
import {
  createNewGame,
  deleteGame,
  editProduct,
  getProductForm,
  loadOrders,
  loadProducts,
  loadProfile,
  updateGame,
  updateOrdersStatus,
} from "./controllers/adminControllers";
import {
  loadHome,
  loginController,
  logoutController,
} from "./controllers/userControllers";
import { requireLogin } from "./middlewares/requireLogin";

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

// Session middleware (MemoryStore by default) — for learning/demo only
app.use(
  session({
    secret: "replace-with-a-strong-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 },
  }),
);

app.get("/", loadHome);
app.post("/login", loginController);
app.post("/logout", requireLogin, logoutController);

app.get("/admin", requireLogin, loadProducts);
app.get("/orders", requireLogin, loadOrders);
app.get("/profile", requireLogin, loadProfile);
app.get("/product-detail-edit/:id", requireLogin, editProduct);
app.get("/product/add", requireLogin, getProductForm);
// crud
app.post("/product/add", requireLogin, createNewGame);
app.post("/product/edit/:id", requireLogin, updateGame);
app.get("/product/delete/:id", requireLogin, deleteGame);
// order crud
app.post("/admin/orders/update-status", updateOrdersStatus);

app.listen(PORT, () => {
  console.log(`Access the server at http://localhost:${PORT}`);
});
