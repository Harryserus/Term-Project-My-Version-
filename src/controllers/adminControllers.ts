import { Request, Response } from "express";
import {
  addProduct,
  deleteProduct,
  getOneProduct,
  searchGames,
  searchOrders,
  updateOrders,
  updateProduct,
} from "../services/productsService";
import { getUser } from "../services/personalization";

export const loadProducts = (req: Request, res: Response) => {
  res.render("admin/index", { games: searchGames(req.query['search-product'] as string) });
};
export const loadOrders = (req: Request, res: Response) => {
  res.render("admin/orders", { orders: searchOrders(req.query['search-order'] as string) });
};
export const loadProfile = (req: Request, res: Response) => {
  res.render("admin/profile", { admin: getUser(req.session.userId as string) });
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
