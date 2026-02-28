import { Request, Response } from "express";
import {
  addProduct,
  deleteProduct,
  getAdmin,
  getAllGames,
  getAllOrders,
  getOneProduct,
  updateOrders,
  updateProduct,
} from "../services/productsService";

export const loadProducts = (req: Request, res: Response) => {
  res.render("admin/index", { games: getAllGames() });
};
export const loadOrders = (req: Request, res: Response) => {
  res.render("admin/orders", { orders: getAllOrders() });
};
export const loadProfile = (req: Request, res: Response) => {
  res.render("admin/profile", { admin: getAdmin() });
};
export const editProduct = (req: Request, res: Response) => {
  res.render("admin/product-detail-edit", { game: getOneProduct(req, res) });
};

export const getProductForm = (req: Request, res: Response) => {
  res.render("admin/product-detail-edit", { game: null });
};
// crud
export const createNewGame = (req: Request, res: Response) => {
  addProduct(req, res);
};
export const deleteGame = (req: Request, res: Response) => {
  deleteProduct(req, res);
};
export const updateGame = (req: Request, res: Response) => {
  updateProduct(req, res);
};
export const updateOrdersStatus = (req: Request, res: Response) => {
  updateOrders(req, res);
};
