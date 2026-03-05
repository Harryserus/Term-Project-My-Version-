import { Request, Response } from "express";
import {
  searchGames,
  getOneProduct,
  getUserOrder,
  getUserCartItem,
  addProductToCart,
  removeProductFromCart,
  getOrderDetail,
} from "../services/productsService";
import { getUser } from "../services/personalization";

export const loadCustomerHomePage = (req: Request, res: Response) => {
  const search = (req.query["search-product"] as string) || "";
  const sort = (req.query["sort"] as string) || "";

  let games = searchGames(search);

  if (sort === "price_asc") {
    games = games.sort((a, b) => a.price - b.price);
  } else if (sort === "price_desc") {
    games = games.sort((a, b) => b.price - a.price);
  }

  res.render("client/index", { games, search, sort, alert: req.query.alert as string });
};

export const loadProductDetail = (req: Request, res: Response) => {
  const game = getOneProduct(req, res);

  if (!game) {
    return res.render("client/product-detail", { game: null, isPurchased: false });
  }

  const userId = req.session.userId as string;

  const orders = getUserOrder(userId) || [];
  const isPurchased = orders.some((order: any) =>
    (order.items || []).some((it: any) =>
      String(it.gameId ?? it.productId ?? it.id) === String(game.id)
    )
  );

  return res.render("client/product-detail", { game, isPurchased });
};

export const loadOrder = (req: Request, res: Response) => {
  res.render("client/orders", { orders: getUserOrder(req.session.userId as string) });
};

export const loadCheckout = (req: Request, res: Response) => {
  res.render("client/checkout", {
    cartItem: getUserCartItem(req.session.userId as string),
    errorMsg: req.query.error ? String(req.query.msg || "Checkout failed.") : "",
  });
};

export const loadCustomerProfile = (req: Request, res: Response) => {
  res.render("client/profile", { user: getUser(req.session.userId as string) });
};

export const addToCart = (req: Request, res: Response) => {
  addProductToCart(req, res);
};
export const removeFromCart = (req: Request, res: Response) => {
  removeProductFromCart(req, res);
}
export const getCustomerOrderDetail = (req: Request, res: Response) => {
  const orderDetail = getOrderDetail(req.session.userId as string, req.body.id as string);
  if(!orderDetail) return res.status(404).json({ message: "Order not found!" })
  return res.status(200).json(orderDetail);
}

export { checkout } from "../services/productsService";