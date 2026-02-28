import { Request, Response } from "express";

export const loadHome = (req: Request, res: Response) => {
  res.render("client/index");
};

export const loadProductDetail = (req: Request, res: Response) => {
  res.render("client/product-detail");
};

export const loadOrder = (req: Request, res: Response) => {
  res.render("client/orders");
};

export const loadCheckout = (req: Request, res: Response) => {
  res.render("client/checkout");
};

export const loadCustomerProfile = (req: Request, res: Response) => {
  res.render("client/profile");
};