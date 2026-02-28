import { Request, Response } from "express";
import {searchGames, getOneProduct, getUserOrder, getUserCartItem } from "../services/productsService";
import { getUser } from "../services/personalization";

export const loadCustomerHomePage = (req: Request, res: Response) => {
  res.render("client/index", { games: searchGames(req.query['search-product'] as string), alert: req.query.alert as string });
};

export const loadProductDetail = (req: Request, res: Response) => {
  res.render("client/product-detail", { game: getOneProduct(req, res) });
};

export const loadOrder = (req: Request, res: Response) => {
  res.render("client/orders", { orders: getUserOrder(req.session.userId as string) });
};

export const loadCheckout = (req: Request, res: Response) => {
  res.render("client/checkout", { cartItem: getUserCartItem(req.session.userId as string) });
};

export const loadCustomerProfile = (req: Request, res: Response) => {
  res.render("client/profile", { user: getUser(req.session.userId as string) });
};