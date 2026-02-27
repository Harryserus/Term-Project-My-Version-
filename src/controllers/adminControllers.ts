import { Request, Response } from "express";

export const loadProducts = (req: Request, res: Response) => {
  res.render("admin/index");
};
export const loadOrders = (req: Request, res: Response) => {
  res.render("admin/orders");
};
export const loadProfile = (req: Request, res: Response) => {
  res.render("admin/profile");
};
export const editProduct = (req: Request, res: Response) => {
  res.render("admin/product-detail-edit");
};
