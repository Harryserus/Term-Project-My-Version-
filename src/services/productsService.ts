import { Game, Platform, Availability } from "../models/game.model";
import { Order, OrderItem } from "../models/order.model";
import { Request, Response } from "express";
import { getData, saveData, stringToArray } from "./util";
import { getUser } from "./personalization";
import { User } from "../models/user.model";


// 1. Get All Games
export const getAllGames = (): Game[] => {
  const data = getData();
  return data.games;
};
// get one game product
export const getOneProduct = (req: Request, res: Response) => {
  const gameid = req.params.id;
  const games: Game[] = getData().games;
  const game = games.find((g) => g.id == gameid);
  return game;
};
export const searchGames = (q?: string, id?: string): Game[] => {
  if(id) return getAllGames().filter((g) => g.id === id);
  if(!q) return getAllGames();
  const games = getAllGames();
  return games.filter((g) => g.title.toLowerCase().match(q.toLowerCase() as string));
}
export const searchOrders = (q?: string): Order[] => {
  if(!q) return getAllOrders();
  const orders = getAllOrders();
  return orders.filter((o) => o.id.toLowerCase().match(q.toLowerCase() as string));
}
// 2. Add Product
export const addProduct = (req: Request, res: Response) => {
  const db = getData();
  const gamesList = db.games;

  // Ensure platforms is an array even if one checkbox is ticked
  let platforms = req.body.platforms;
  if (!platforms) platforms = [];
  if (!Array.isArray(platforms)) platforms = [platforms];

  const newGame: Game = {
    id: Date.now().toString(), // Generate a real ID
    slug: req.body.title.toLowerCase().replace(/ /g, "-"),
    title: req.body.title,
    developer: req.body.developer,
    publisher: req.body.publisher,
    platforms: platforms as Platform[],
    genres: stringToArray(req.body.genres),
    tags: stringToArray(req.body.tags),
    releaseDate: req.body.releaseDate,
    availability: (req.body.availability as Availability) || "available",
    price: parseFloat(req.body.price),
    currency: "$",
    thumbnailUrl: req.body.thumbnailUrl || "",
    description: req.body.description,
    stock: parseInt(req.body.stock),
    isPreOrder: req.body.isPreOrder === "on",
  };

  gamesList.push(newGame);
  saveData(db); // Actually write to file
  res.redirect("/admin");
};

// 3. Update Product
export const updateProduct = (req: Request, res: Response) => {
  const db = getData();
  const gameId = req.params.id;
  const gamesList = db.games;

  const index = gamesList.findIndex((g: Game) => g.id === gameId);

  if (index !== -1) {
    let platforms = req.body.platforms;
    if (!platforms) platforms = [];
    if (!Array.isArray(platforms)) platforms = [platforms];

    gamesList[index] = {
      ...gamesList[index], // Keep existing ID/Slug if you want
      ...req.body,
      platforms: platforms as Platform[],
      genres: stringToArray(req.body.genres),
      tags: stringToArray(req.body.tags),
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      isPreOrder: req.body.isPreOrder === "on",
    };

    saveData(db);
  }
  res.redirect("/admin");
};

// 4. Delete Product
export const deleteProduct = (req: Request, res: Response) => {
  const db = getData();
  const gameId = req.params.id;
  db.games = db.games.filter((g: Game) => g.id !== gameId);

  saveData(db);
  res.redirect("/admin");
};

export const getAllOrders = (): Order[] => getData().orders;
export const getUserOrder = (uid: string) => getAllOrders().filter((o) => o.userId === uid);
// order updates
export const updateOrders = (req: Request, res: Response) => {
  const { orderIds, status } = req.body; // e.g., ["101", "102"], "paid"
  const db = getData();

  // Update the status for matching IDs
  db.orders.forEach((order: any) => {
    if (orderIds.includes(order.id)) {
      order.status = status;
    }
  });

  saveData(db);
  res.sendStatus(200);
};

export const getUserCartItem = (uid: string): OrderItem[] => getUser(uid).cart;
export const addProductToCart = (req: Request, res: Response) => {
  const wholeData = getData();
  const pickedGame = wholeData.games.find((g: Game) => g.id === id)
  if(!pickedGame) return res.status(404).json({ message: "Game not found" })
  if(pickedGame.stock === 0) return res.status(400).json({ messsage: "This game is out of stock!" })
  if(pickedGame.availability === "delisted") return res.status(400).json({ messsage: "This game has been delisted, you can no longer add it to your cart." })
  const userCart = getUserCartItem(req.session.userId as string);
  const { id } = req.params;
  userCart.push({
    gameId: pickedGame.id,
    title: pickedGame.title,
    thumbnailUrl: pickedGame.thumbnailUrl,
    quantity: 1, // well, you play one game for one account, right??
    priceAtPurchase: pickedGame.price
  })
  wholeData.users.find((u: User) => u.id === req.session.userId).cart = userCart;
  saveData(wholeData);
  res.sendStatus(204);
  // res.redirect("/customer");
}

export const checkout = (req: Request, res: Response) => {
  const wholeData = getData();
  // Empty the cart, assume payment is automatically done.
  const outOfStockGames = [];
  const delistedGames = [];
  for(const item of getUserCartItem(req.session.userId as string)) {
    const thegame = searchGames(undefined, (item as OrderItem).gameId)
    if(thegame[0]?.stock === 0) outOfStockGames.push(thegame[0].title);
    if(thegame[0]?.availability === "delisted") delistedGames.push(thegame[0].title);
  }

  if(outOfStockGames.length === 0 || delistedGames.length === 0) {
    return res.status(400).json({ outOfStockGames, delistedGames })
  }

  wholeData.orders.push({ 
    id: "ord_" + (parseInt(wholeData.orders[wholeData.orders.length - 1].id.slice(4)) + 1),
    userId: req.session.userId,
    items: getUserCartItem(req.session.userId as string),
    totalAmount: getUserCartItem(req.session.userId as string).reduce((acc, item) => acc + item.priceAtPurchase, 0),
    status: "paid",
    dateCreated: new Date()
  })
  wholeData.users.find((u: User) => u.id === req.session.userId).cart = [];
  // Enable install button for the game? (Later)
  saveData(wholeData);
  res.sendStatus(204)
  // res.redirect(req.headers.referer || "/customer");
}
